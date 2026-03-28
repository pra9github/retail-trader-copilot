from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np
from groq import Groq
import os
import json
from dotenv import load_dotenv
import datetime
import requests
from unittest.mock import patch

# Patch yfinance to use a browser User-Agent
import yfinance.utils as yf_utils
original_get = requests.Session.get

def patched_get(self, url, **kwargs):
    kwargs.setdefault('headers', {})
    kwargs['headers']['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    return original_get(self, url, **kwargs)

requests.Session.get = patched_get
load_dotenv()

app = Flask(__name__)

# ── Fix 1: Explicit, comprehensive CORS config ────────────────────────────────
CORS(app, resources={r"/*": {"origins": "*"}})

# ── Fix 2: Manually handle OPTIONS preflight for ALL routes ───────────────────
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = jsonify({"status": "ok"})
        res.headers["Access-Control-Allow-Origin"] = "*"
        res.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        res.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept"
        res.headers["Access-Control-Max-Age"] = "3600"
        return res, 200

# ── Fix 3: Inject CORS headers into EVERY response (including errors) ─────────
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept"
    return response

# ── Groq client ───────────────────────────────────────────────────────────────
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def calculate_rsi(prices, period=14):
    delta = prices.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return round(float(rsi.iloc[-1]), 2)


def get_trend(price, ma50, ma200):
    if price > ma50 and ma50 > ma200:
        return "Strong Uptrend"
    elif price < ma50 and ma50 < ma200:
        return "Downtrend"
    else:
        return "Sideways"


import datetime

def fetch_stock_data(symbol, period):
    period_map = {
        '1mo': 30, '3mo': 90, '6mo': 180,
        '1y': 365, '2y': 730, '5y': 1825
    }
    days = period_map.get(period, 90)
    start = datetime.datetime.now() - datetime.timedelta(days=days)

    ticker_symbol = symbol.upper()
    if "." not in ticker_symbol:
        indian = yf.Ticker(ticker_symbol + ".NS")
        hist = indian.history(start=start)
        if not hist.empty:
            return hist, ticker_symbol + ".NS"
        us = yf.Ticker(ticker_symbol)
        hist = us.history(start=start)
        if not hist.empty:
            return hist, ticker_symbol
    else:
        ticker = yf.Ticker(ticker_symbol)
        hist = ticker.history(start=start)
        if not hist.empty:
            return hist, ticker_symbol

    raise ValueError(f"No data found for symbol: {symbol}")
@app.route('/analyze-stock', methods=['POST', 'OPTIONS'])  # ← Fix 4: include OPTIONS per route too
def analyze_stock():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    try:
        body = request.get_json()
        symbol = body.get('symbol', '').strip()
        period = body.get('period', '3mo')

        if not symbol:
            return jsonify({'error': 'Stock symbol is required'}), 400

        hist, used_symbol = fetch_stock_data(symbol, period)
        closes = hist['Close']

        if len(closes) < 20:
            return jsonify({'error': 'Not enough data. Try a longer period.'}), 400

        current_price = round(float(closes.iloc[-1]), 2)
        ma50  = round(float(closes.rolling(window=min(50,  len(closes))).mean().iloc[-1]), 2)
        ma200 = round(float(closes.rolling(window=min(200, len(closes))).mean().iloc[-1]), 2)
        rsi   = calculate_rsi(closes)
        trend = get_trend(current_price, ma50, ma200)

        technical = {
            'symbol':        used_symbol,
            'current_price': current_price,
            'trend':         trend,
            'rsi':           rsi,
            'ma50':          ma50,
            'ma200':         ma200,
        }

        prompt = f"""
You are a financial analyst. Analyze this stock data and return ONLY a strict JSON object (no markdown, no extra text):

Stock: {used_symbol}
Current Price: {current_price}
Trend: {trend}
RSI (14): {rsi}
MA50: {ma50}
MA200: {ma200}
Period: {period}

Return ONLY this JSON:
{{
  "summary": "simple 2-3 sentence explanation",
  "risks": ["risk 1", "risk 2", "risk 3"],
  "short_term": "short-term strategy (1-4 weeks)",
  "long_term": "long-term strategy (3-12 months)",
  "confidence": "Low / Medium / High with one sentence reason",
  "bearish_view": "what could go wrong"
}}
"""

        chat = groq_client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[{'role': 'user', 'content': prompt}],
            temperature=0.4,
        )

        raw = chat.choices[0].message.content.strip()
        if '```' in raw:
            raw = raw.split('```')[1]
            if raw.startswith('json'):
                raw = raw[4:]
        raw = raw.strip()

        ai_data = json.loads(raw)

        return jsonify({'technical': technical, 'ai': ai_data})

    except ValueError as ve:
        return jsonify({'error': str(ve)}), 404
    except json.JSONDecodeError:
        return jsonify({'error': 'AI returned invalid JSON. Try again.'}), 500
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)