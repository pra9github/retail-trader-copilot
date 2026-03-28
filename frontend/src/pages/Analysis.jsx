import React, { useState } from 'react'
import axios from 'axios'
import StockInput from '../components/StockInput.jsx'
import TechnicalCard from '../components/TechnicalCard.jsx'
import AIInsights from '../components/AIInsights.jsx'

const styles = {
  page: {
    minHeight: '100vh',
    padding: '40px 20px',
    maxWidth: '860px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '36px',
    textAlign: 'center',
  },
  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    background: 'var(--accent)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  logoText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '0.05em',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  disclaimer: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '8px',
    fontStyle: 'italic',
  },
  loadingBox: {
    textAlign: 'center',
    padding: '60px 32px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    marginTop: '24px',
  },
  loadingDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'var(--accent)',
    animation: 'pulse 1.2s ease-in-out infinite',
  },
  loadingText: {
    fontSize: '15px',
    color: 'var(--text-dim)',
  },
  loadingSub: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '6px',
  },
  errorBox: {
    background: 'var(--red-dim)',
    border: '1px solid rgba(255,77,109,0.3)',
    borderRadius: 'var(--radius)',
    padding: '20px 24px',
    marginTop: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  errorText: {
    fontSize: '14px',
    color: 'var(--red)',
  },
  results: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  stamp: {
    textAlign: 'center',
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '32px',
    paddingBottom: '24px',
  },
}

const pulseKeyframes = `
@keyframes pulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
`

export default function Analysis() {
  const [symbol, setSymbol] = useState('')
  const [period, setPeriod] = useState('3mo')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  async function handleAnalyze() {
    if (!symbol.trim()) {
      setError('Please enter a stock symbol.')
      return
    }
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await axios.post('http://localhost:8000/analyze-stock', {
        symbol: symbol.trim(),
        period,
      })
      setData(response.data)
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid stock or server error. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <style>{pulseKeyframes}</style>

      <div style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>📊</div>
          <span style={styles.logoText}>StockAI</span>
        </div>
        <div style={styles.subtitle}>AI-Powered Stock Analysis · Technical Indicators + GPT Insights</div>
        <div style={styles.disclaimer}>Not financial advice. For educational purposes only.</div>
      </div>

      <StockInput
        symbol={symbol}
        setSymbol={setSymbol}
        period={period}
        setPeriod={setPeriod}
        onAnalyze={handleAnalyze}
        loading={loading}
      />

      {loading && (
        <div style={styles.loadingBox}>
          <div style={styles.loadingDots}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{ ...styles.dot, animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <div style={styles.loadingText}>Fetching data & running AI analysis...</div>
          <div style={styles.loadingSub}>This may take 10–20 seconds</div>
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          <span style={{ fontSize: '20px' }}>⚠</span>
          <span style={styles.errorText}>{error}</span>
        </div>
      )}

      {data && (
        <div style={styles.results}>
          <TechnicalCard data={data.technical} />
          <AIInsights data={data.ai} />
        </div>
      )}

      <div style={styles.stamp}>
        Powered by yfinance + OpenAI GPT · StockAI 2025
      </div>
    </div>
  )
}