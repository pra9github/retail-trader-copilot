import React from 'react'

function getTrendColor(trend) {
  if (trend === 'Strong Uptrend') return 'var(--accent)'
  if (trend === 'Downtrend') return 'var(--red)'
  return 'var(--yellow)'
}

function getTrendBg(trend) {
  if (trend === 'Strong Uptrend') return 'var(--accent-dim)'
  if (trend === 'Downtrend') return 'var(--red-dim)'
  return 'var(--yellow-dim)'
}

function getRsiLabel(rsi) {
  if (rsi >= 70) return { label: 'Overbought', color: 'var(--red)' }
  if (rsi <= 30) return { label: 'Oversold', color: 'var(--accent)' }
  return { label: 'Neutral', color: 'var(--yellow)' }
}

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '28px',
    boxShadow: 'var(--shadow)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  title: {
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
  symbol: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--accent)',
    background: 'var(--accent-dim)',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  trendBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 700,
    marginBottom: '24px',
    width: '100%',
    justifyContent: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  metric: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '16px',
  },
  metricLabel: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '8px',
  },
  metricValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '22px',
    fontWeight: 700,
    lineHeight: 1,
  },
  metricSub: {
    fontSize: '11px',
    marginTop: '4px',
    fontWeight: 500,
  },
  price: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '16px',
    gridColumn: '1 / -1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
  priceValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '26px',
    fontWeight: 700,
    color: 'var(--accent)',
  },
}

export default function TechnicalCard({ data }) {
  const { symbol, current_price, trend, rsi, ma50, ma200 } = data
  const rsiInfo = getRsiLabel(rsi)
  const trendColor = getTrendColor(trend)
  const trendBg = getTrendBg(trend)

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>Technical Analysis</span>
        <span style={styles.symbol}>{symbol}</span>
      </div>

      <div style={{ ...styles.trendBadge, color: trendColor, background: trendBg }}>
        {trend === 'Strong Uptrend' ? '📈' : trend === 'Downtrend' ? '📉' : '↔️'}
        {trend}
      </div>

      <div style={styles.grid}>
        <div style={styles.price}>
          <div>
            <div style={styles.priceLabel}>Current Price</div>
            <div style={styles.priceValue}>₹ {current_price.toLocaleString()}</div>
          </div>
        </div>

        <div style={styles.metric}>
          <div style={styles.metricLabel}>RSI (14)</div>
          <div style={{ ...styles.metricValue, color: rsiInfo.color }}>{rsi}</div>
          <div style={{ ...styles.metricSub, color: rsiInfo.color }}>{rsiInfo.label}</div>
        </div>

        <div style={styles.metric}>
          <div style={styles.metricLabel}>MA50</div>
          <div style={{ ...styles.metricValue, color: 'var(--text)' }}>{ma50.toLocaleString()}</div>
          <div style={{ ...styles.metricSub, color: current_price > ma50 ? 'var(--accent)' : 'var(--red)' }}>
            Price {current_price > ma50 ? 'above' : 'below'} MA50
          </div>
        </div>

        <div style={styles.metric}>
          <div style={styles.metricLabel}>MA200</div>
          <div style={{ ...styles.metricValue, color: 'var(--text)' }}>{ma200.toLocaleString()}</div>
          <div style={{ ...styles.metricSub, color: current_price > ma200 ? 'var(--accent)' : 'var(--red)' }}>
            Price {current_price > ma200 ? 'above' : 'below'} MA200
          </div>
        </div>
      </div>
    </div>
  )
}