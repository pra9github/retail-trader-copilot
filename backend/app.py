from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_stock_data(symbol, period="3mo"):
    """Fetch stock data using yfinance"""
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period)
        info = stock.info
        return hist, info
    except Exception as e:
        return None, str(e)

def calculate_indicators(df):
    """Calculate technical indicators"""
    df = df.copy()
    
    # SMA (Simple Moving Average)
    df['SMA_20'] = df['Close'].rolling(window=20).mean()
    df['SMA_50'] = df['Close'].rolling(window=50).mean()
    
    # EMA (Exponential Moving Average)
    df['EMA_12'] = df['Close'].ewm(span=12).mean()
    df['EMA_26'] = df['Close'].ewm(span=26).mean()
    
    # MACD
    df['MACD'] = df['EMA_12'] - df['EMA_26']
    df['Signal_Line'] = df['MACD'].ewm(span=9).mean()
    df['MACD_Histogram'] = df['MACD'] - df['Signal_Line']
    
    # RSI (Relative Strength Index)
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))
    
    # Bollinger Bands
    df['BB_Middle'] = df['Close'].rolling(window=20).mean()
    bb_std = df['Close'].rolling(window=20).std()
    df['BB_Upper'] = df['BB_Middle'] + (bb_std * 2)
    df['BB_Lower'] = df['BB_Middle'] - (bb_std * 2)
    
    # ATR (Average True Range)
    df['High_Low'] = df['High'] - df['Low']
    df['High_Close'] = abs(df['High'] - df['Close'].shift())
    df['Low_Close'] = abs(df['Low'] - df['Close'].shift())
    df['True_Range'] = df[['High_Low', 'High_Close', 'Low_Close']].max(axis=1)
    df['ATR'] = df['True_Range'].rolling(window=14).mean()
    
    return df

def get_ai_insights(symbol, indicators):
    """Get AI insights using Groq (free API)"""
    try:
        prompt = f"""
        Analyze this stock data for {symbol} and provide insights:
        
        Latest Close: ${indicators['Close'].iloc[-1]:.2f}
        SMA 20: ${indicators['SMA_20'].iloc[-1]:.2f}
        SMA 50: ${indicators['SMA_50'].iloc[-1]:.2f}
        RSI: {indicators['RSI'].iloc[-1]:.2f}
        MACD: {indicators['MACD'].iloc[-1]:.4f}
        Bollinger Upper: ${indicators['BB_Upper'].iloc[-1]:.2f}
        Bollinger Lower: ${indicators['BB_Lower'].iloc[-1]:.2f}
        ATR: {indicators['ATR'].iloc[-1]:.2f}
        
        Provide a brief technical analysis (2-3 sentences) about the trend, support/resistance levels, 
        and potential trading signals. Be concise and educational.
        """
        
        message = groq_client.messages.create(
            model="mixtral-8x7b-32768",
            max_tokens=300,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        return message.content[0].text
    except Exception as e:
        return f"Error generating insights: {str(e)}"

@app.route('/api/analyze', methods=['POST'])
def analyze_stock():
    """Analyze stock and return technical indicators + AI insights"""
    try:
        data = request.json
        symbol = data.get('symbol', '').upper()
        period = data.get('period', '3mo')
        
        if not symbol:
            return jsonify({'error': 'Stock symbol required'}), 400
        
        # Append .NS for Indian stocks if needed
        if len(symbol) <= 4 and not any(char.isdigit() for char in symbol):
            test_symbol = symbol + '.NS'
            hist, info = get_stock_data(test_symbol, period)
            if hist is not None and len(hist) > 0:
                symbol = test_symbol
            else:
                hist, info = get_stock_data(symbol, period)
        else:
            hist, info = get_stock_data(symbol, period)
        
        if hist is None:
            return jsonify({'error': 'Stock not found'}), 404
        
        # Calculate indicators
        indicators = calculate_indicators(hist)
        
        # Get AI insights
        insights = get_ai_insights(symbol, indicators)
        
        # Prepare response
        latest = indicators.iloc[-1]
        response = {
            'symbol': symbol,
            'current_price': float(latest['Close']),
            'indicators': {
                'sma_20': float(latest['SMA_20']) if not pd.isna(latest['SMA_20']) else None,
                'sma_50': float(latest['SMA_50']) if not pd.isna(latest['SMA_50']) else None,
                'ema_12': float(latest['EMA_12']) if not pd.isna(latest['EMA_12']) else None,
                'rsi': float(latest['RSI']) if not pd.isna(latest['RSI']) else None,
                'macd': float(latest['MACD']) if not pd.isna(latest['MACD']) else None,
                'bb_upper': float(latest['BB_Upper']) if not pd.isna(latest['BB_Upper']) else None,
                'bb_lower': float(latest['BB_Lower']) if not pd.isna(latest['BB_Lower']) else None,
                'atr': float(latest['ATR']) if not pd.isna(latest['ATR']) else None,
            },
            'ai_insights': insights
        }
        
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'Backend is running'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
