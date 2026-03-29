# agent.py
# ── Agentic AI system for Retail Trader Copilot ───────────────────────────────

import re
from tools import TOOLS

# ── Predefined watchlist for suggestion engine ────────────────────────────────
WATCHLIST = [
    "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS",
    "ICICIBANK.NS", "WIPRO.NS", "SBIN.NS", "BAJFINANCE.NS",
    "AAPL", "MSFT", "NVDA", "GOOGL"
]


# ── 1. Intent Detection ───────────────────────────────────────────────────────
def detect_intent(query):
    q = query.lower()
    if any(word in q for word in ["suggest", "find", "recommend", "which stock", "top stocks"]):
        return "SUGGESTION"
    if any(word in q for word in ["buy", "sell", "should i", "analysis", "analyze", "what about"]):
        return "ANALYSIS"
    return "ANALYSIS"  # default


# ── 2. Symbol Extraction ──────────────────────────────────────────────────────
def extract_symbol(query):
    """
    Extracts stock symbol from query.
    Looks for known tickers or uppercase words.
    """
    # Check for known .NS symbols
    for stock in WATCHLIST:
        base = stock.replace(".NS", "")
        if base.lower() in query.lower() or stock.lower() in query.lower():
            return stock

    # Look for uppercase word (likely a ticker like AAPL, NVDA)
    matches = re.findall(r'\b[A-Z]{2,5}\b', query)
    if matches:
        return matches[0]

    return None


# ── 3. Analysis Engine ────────────────────────────────────────────────────────
def generate_analysis(symbol):
    steps = []

    # Fetch all tool data
    rsi_data   = TOOLS["get_rsi"](symbol)
    price_data = TOOLS["get_price"](symbol)
    trend_data = TOOLS["get_trend"](symbol)
    ma_data    = TOOLS["get_moving_averages"](symbol)

    # Check for errors
    if "error" in rsi_data or "error" in price_data:
        return {"error": f"Could not fetch data for {symbol}"}

    rsi   = rsi_data["rsi"]
    price = price_data["price"]
    trend = trend_data.get("trend", "Unknown")
    ma50  = ma_data.get("ma50", 0)
    ma200 = ma_data.get("ma200", 0)

    steps.append(f"Fetched data for {rsi_data['symbol']}")
    steps.append(f"Current Price → {price}")
    steps.append(f"RSI (14) → {rsi}")
    steps.append(f"Trend → {trend}")
    steps.append(f"MA50 → {ma50} | MA200 → {ma200}")

    # Decision logic
    if rsi < 30:
        decision = "BUY"
        confidence = 0.75
        steps.append(f"RSI {rsi} is below 30 → oversold → BUY signal")
        strategy = {
            "entry": f"Consider entering near current price of {price}",
            "exit":  "Target RSI above 50 or price near MA50"
        }
    elif rsi > 70:
        decision = "SELL"
        confidence = 0.72
        steps.append(f"RSI {rsi} is above 70 → overbought → SELL signal")
        strategy = {
            "entry": "Avoid new entries",
            "exit":  f"Consider exiting near {price}, watch for RSI drop below 60"
        }
    else:
        decision = "HOLD"
        confidence = 0.60
        steps.append(f"RSI {rsi} is neutral → no strong signal → HOLD")
        strategy = {
            "entry": "Wait for RSI to move below 35 for a better entry",
            "exit":  "Hold current position and monitor trend"
        }

    # Adjust confidence based on trend
    if trend == "Strong Uptrend" and decision == "BUY":
        confidence = min(confidence + 0.10, 1.0)
        steps.append("Trend confirms uptrend → confidence boosted")
    elif trend == "Downtrend" and decision == "SELL":
        confidence = min(confidence + 0.10, 1.0)
        steps.append("Trend confirms downtrend → confidence boosted")
    elif trend == "Downtrend" and decision == "BUY":
        confidence = max(confidence - 0.15, 0.0)
        steps.append("Warning: BUY signal but trend is Downtrend → confidence reduced")

    return {
        "symbol":     rsi_data["symbol"],
        "steps":      steps,
        "decision":   decision,
        "confidence": round(confidence, 2),
        "strategy":   strategy,
        "data": {
            "price": price,
            "rsi":   rsi,
            "trend": trend,
            "ma50":  ma50,
            "ma200": ma200
        }
    }


# ── 4. Suggestion Engine ──────────────────────────────────────────────────────
def suggest_stocks():
    steps = ["Scanning predefined watchlist for strong RSI signals"]
    results = []

    for stock in WATCHLIST:
        rsi_data = TOOLS["get_rsi"](stock)
        if "error" in rsi_data:
            steps.append(f"Skipped {stock} → data unavailable")
            continue
        rsi = rsi_data["rsi"]
        steps.append(f"Checked {stock} → RSI: {rsi}")
        if rsi > 60:
            results.append({"stock": stock, "rsi": rsi, "signal": "Bullish momentum"})

    steps.append(f"Found {len(results)} stocks with RSI > 60")

    if not results:
        steps.append("No strong RSI signals found in watchlist at this time")

    return {
        "intent":  "SUGGESTION",
        "steps":   steps,
        "results": sorted(results, key=lambda x: x["rsi"], reverse=True)
    }


# ── 5. Agent Core ─────────────────────────────────────────────────────────────
def run_agent(query):
    intent = detect_intent(query)

    if intent == "SUGGESTION":
        return suggest_stocks()

    # ANALYSIS intent
    symbol = extract_symbol(query)

    if not symbol:
        return {
            "error": "Could not extract a stock symbol from your query. Try: 'Should I buy AAPL?' or 'Analyze RELIANCE'"
        }

    result = generate_analysis(symbol)
    result["intent"] = "ANALYSIS"
    result["query"]  = query
    return result


