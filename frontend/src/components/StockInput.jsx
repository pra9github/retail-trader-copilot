import React from 'react'

const periods = [
  { value: '1mo', label: '1 Month' },
  { value: '3mo', label: '3 Months' },
  { value: '6mo', label: '6 Months' },
  { value: '1y', label: '1 Year' },
]

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '32px',
    boxShadow: 'var(--shadow)',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontSize: '15px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
  },
  hint: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '6px',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'var(--accent)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 700,
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.1s',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}

export default function StockInput({ symbol, setSymbol, period, setPeriod, onAnalyze, loading }) {
  return (
    <div style={styles.card}>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Stock Symbol</label>
          <input
            style={styles.input}
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="RELIANCE / AAPL"
            onKeyDown={(e) => e.key === 'Enter' && !loading && onAnalyze()}
          />
          <span style={styles.hint}>Indian stocks auto-append .NS</span>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Timeframe</label>
          <select
            style={styles.select}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {periods.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
        onClick={onAnalyze}
        disabled={loading}
        onMouseEnter={(e) => { if (!loading) e.target.style.opacity = '0.85' }}
        onMouseLeave={(e) => { if (!loading) e.target.style.opacity = '1' }}
      >
        {loading ? '⏳  Analyzing...' : '⚡  Analyze Stock'}
      </button>
    </div>
  )
}