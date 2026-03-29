# tools.py
# ── Tool wrappers around existing app.py functions ────────────────────────────
# These import core functions from app.py and wrap them cleanly for agent use.

import datetime
import yfinance as yf


def _fetch(symbol, days=90):
    """Internal helper to fetch closing prices for a symbol."""
    start = datetime.datetime.now() - datetime.timedelta(days=days)
    ticker_symbol = symbol.upper()

    if "." not in ticker_symbol:
        hist = yf.Ticker(ticker_symbol + ".NS").history(start=start)
        if not hist.empty:
            return hist['Close'], ticker_symbol + ".NS"
        hist = yf.Ticker(ticker_symbol).history(start=start)
        if not hist.empty:
            return hist['Close'], ticker_symbol
    else:
        hist = yf.Ticker(ticker_symbol).history(start=start)
        if not hist.empty:
            return hist['Close'], ticker_symbol

    raise ValueError(f"No data found for symbol: {symbol}")


def tool_get_rsi(symbol):
    """Returns RSI value for a given symbol."""
    try:
        closes, used_symbol = _fetch(symbol)
        delta = closes.diff()
        gain = delta.clip(lower=0)
        loss = -delta.clip(upper=0)
        avg_gain = gain.rolling(window=14).mean()
        avg_loss = loss.rolling(window=14).mean()
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        return {
            "symbol": used_symbol,
            "rsi": round(float(rsi.iloc[-1]), 2)
        }
    except Exception as e:
        return {"symbol": symbol, "error": str(e)}


def tool_get_price(symbol):
    """Returns the latest closing price for a given symbol."""
    try:
        closes, used_symbol = _fetch(symbol)
        return {
            "symbol": used_symbol,
            "price": round(float(closes.iloc[-1]), 2)
        }
    except Exception as e:
        return {"symbol": symbol, "error": str(e)}


def tool_get_moving_averages(symbol):
    """Returns MA50 and MA200 for a given symbol."""
    try:
        closes, used_symbol = _fetch(symbol, days=365)
        ma50  = round(float(closes.rolling(window=min(50,  len(closes))).mean().iloc[-1]), 2)
        ma200 = round(float(closes.rolling(window=min(200, len(closes))).mean().iloc[-1]), 2)
        return {
            "symbol": used_symbol,
            "ma50": ma50,
            "ma200": ma200
        }
    except Exception as e:
        return {"symbol": symbol, "error": str(e)}


def tool_get_trend(symbol):
    """Returns trend direction for a given symbol."""
    try:
        closes, used_symbol = _fetch(symbol, days=365)
        price = float(closes.iloc[-1])
        ma50  = float(closes.rolling(window=min(50,  len(closes))).mean().iloc[-1])
        ma200 = float(closes.rolling(window=min(200, len(closes))).mean().iloc[-1])

        if price > ma50 and ma50 > ma200:
            trend = "Strong Uptrend"
        elif price < ma50 and ma50 < ma200:
            trend = "Downtrend"
        else:
            trend = "Sideways"

        return {
            "symbol": used_symbol,
            "trend": trend
        }
    except Exception as e:
        return {"symbol": symbol, "error": str(e)}


# ── Tool Registry ─────────────────────────────────────────────────────────────
TOOLS = {
    "get_rsi":             tool_get_rsi,
    "get_price":           tool_get_price,
    "get_moving_averages": tool_get_moving_averages,
    "get_trend":           tool_get_trend,
}