import React from 'react'

function getConfidenceColor(confidence) {
  const lower = (confidence || '').toLowerCase()
  if (lower.includes('high')) return 'var(--accent)'
  if (lower.includes('low')) return 'var(--red)'
  return 'var(--yellow)'
}

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '28px',
    boxShadow: 'var(--shadow)',
  },
  title: {
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid var(--border)',
  },
  sectionLast: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '8px',
  },
  sectionText: {
    fontSize: '14px',
    color: 'var(--text-dim)',
    lineHeight: 1.7,
  },
  riskList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  riskItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '14px',
    color: 'var(--text-dim)',
    lineHeight: 1.5,
  },
  riskDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--red)',
    marginTop: '7px',
    flexShrink: 0,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
  },
  stratBox: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '16px',
  },
  stratLabel: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  stratText: {
    fontSize: '13px',
    color: 'var(--text-dim)',
    lineHeight: 1.6,
  },
  confidenceBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    width: '100%',
  },
  bearishBox: {
    background: 'var(--red-dim)',
    border: '1px solid rgba(255,77,109,0.2)',
    borderRadius: '10px',
    padding: '16px',
  },
}

export default function AIInsights({ data }) {
  const { summary, risks, short_term, long_term, confidence, bearish_view } = data
  const confColor = getConfidenceColor(confidence)

  return (
    <div style={styles.card}>
      <div style={styles.title}>🤖 AI Insights</div>

      <div style={styles.section}>
        <div style={styles.sectionLabel}>Summary</div>
        <div style={styles.sectionText}>{summary}</div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionLabel}>Risk Factors</div>
        <ul style={styles.riskList}>
          {(risks || []).map((risk, i) => (
            <li key={i} style={styles.riskItem}>
              <span style={styles.riskDot}></span>
              {risk}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.row}>
        <div style={styles.stratBox}>
          <div style={{ ...styles.stratLabel, color: 'var(--accent)' }}>Short-Term</div>
          <div style={styles.stratText}>{short_term}</div>
        </div>
        <div style={styles.stratBox}>
          <div style={{ ...styles.stratLabel, color: 'var(--yellow)' }}>Long-Term</div>
          <div style={styles.stratText}>{long_term}</div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionLabel}>Confidence Level</div>
        <div
          style={{
            ...styles.confidenceBadge,
            color: confColor,
            background: confColor === 'var(--accent)' ? 'var(--accent-dim)'
              : confColor === 'var(--red)' ? 'var(--red-dim)' : 'var(--yellow-dim)',
          }}
        >
          <span>◎</span> {confidence}
        </div>
      </div>

      <div style={styles.sectionLast}>
        <div style={styles.sectionLabel}>Bearish View</div>
        <div style={styles.bearishBox}>
          <div style={{ ...styles.stratText, color: 'var(--red)' }}>⚠ {bearish_view}</div>
        </div>
      </div>
    </div>
  )
}