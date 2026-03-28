# Retail Trader Copilot

Full-stack app: Flask backend + React (Vite) frontend.  
Enter any stock symbol, get technical indicators + GPT-powered insights.

---

## 🗂 Project Structure

```
stock-analyzer/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── pages/
        │   └── Analysis.jsx
        └── components/
            ├── StockInput.jsx
            ├── TechnicalCard.jsx
            └── AIInsights.jsx
```

---

## ⚙️ BACKEND SETUP

### Step 1 — Navigate to backend folder
```bash
cd backend
```

### Step 2 — Create and activate virtual environment
```bash
# Create
python -m venv venv

# Activate (Mac/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate
```

### Step 3 — Install dependencies
```bash
pip install -r requirements.txt
```

### Step 4 — Set your OpenAI API key
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Then open `.env` and replace with your actual key:
```
OPENAI_API_KEY=sk-your-key-here
```

### Step 5 — Run the Flask server
```bash
python app.py
```
Backend runs on: http://localhost:8000

---

## 🖥 FRONTEND SETUP

### Step 1 — Navigate to frontend folder
```bash
cd frontend
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Start the dev server
```bash
npm run dev
```
Frontend runs on: http://localhost:5173

---

## 🚀 USAGE

1. Open http://localhost:5173
2. Enter a stock symbol:
   - Indian stocks: `RELIANCE`, `TCS`, `INFY`, `HDFC` (auto-appends `.NS`)
   - US stocks: `AAPL`, `TSLA`, `GOOGL`, `MSFT`
3. Select a timeframe
4. Click **Analyze Stock**
5. View technical indicators + AI insights

---

## 🔑 Getting an OpenAI API Key

1. Go to https://platform.openai.com
2. Sign in / create account
3. Go to **API Keys** → **Create new secret key**
4. Copy the key and paste in your `.env` file

---

## ⚠️ Disclaimer

This app is for **educational purposes only**.  
Not financial advice. Always do your own research before investing.