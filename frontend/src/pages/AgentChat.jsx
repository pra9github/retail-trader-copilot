import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import API from '../config'


const THINKING_STEPS = [
  "Analyzing market conditions...",
  "Checking technical indicators...",
  "Evaluating RSI signals...",
  "Assessing trend direction...",
  "Calculating confidence score...",
]

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

  // Input
  inputRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px 16px',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    color: 'var(--text)',
    fontFamily: 'inherit',
  },
  button: {
    background: 'var(--accent)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  // Thinking panel
  thinkingBox: {
    marginTop: '24px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '28px 32px',
  },
  thinkingTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  thinkingStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 0',
    borderBottom: '1px solid var(--border)',
    fontSize: '14px',
    color: 'var(--text-dim)',
    animation: 'fadeIn 0.4s ease',
  },
  thinkingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent)',
    flexShrink: 0,
    animation: 'pulse 1.2s ease-in-out infinite',
  },

  // Timeline steps
  timelineBox: {
    marginTop: '24px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '28px 32px',
  },
  timelineTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '20px',
  },
  timelineItem: {
    display: 'flex',
    gap: '16px',
    marginBottom: '14px',
    animation: 'fadeIn 0.4s ease',
  },
  timelineLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0',
  },
  timelineNum: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: 'var(--accent)',
    color: '#000',
    fontSize: '11px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  timelineLine: {
    width: '2px',
    flex: 1,
    background: 'var(--border)',
    marginTop: '4px',
  },
  timelineText: {
    fontSize: '14px',
    color: 'var(--text-dim)',
    paddingTop: '4px',
    lineHeight: 1.5,
  },

  // Decision card
  decisionBox: {
    marginTop: '24px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '28px 32px',
  },
  decisionLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '16px',
  },
  decisionBadge: {
    display: 'inline-block',
    fontSize: '28px',
    fontWeight: 800,
    borderRadius: '10px',
    padding: '8px 24px',
    marginBottom: '20px',
    letterSpacing: '0.1em',
  },
  confidenceLabel: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginBottom: '8px',
  },
  confidenceBar: {
    height: '8px',
    borderRadius: '4px',
    background: 'var(--border)',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: '4px',
    background: 'var(--accent)',
    transition: 'width 1s ease',
  },
  strategyBox: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  strategyRow: {
    display: 'flex',
    gap: '12px',
    fontSize: '14px',
  },
  strategyKey: {
    color: 'var(--text-muted)',
    fontWeight: 600,
    minWidth: '48px',
  },
  strategyVal: {
    color: 'var(--text-dim)',
  },

  // Suggestion cards
  suggestBox: {
    marginTop: '24px',
  },
  suggestTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '16px',
  },
  suggestGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '12px',
  },
  suggestCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px 20px',
    animation: 'fadeIn 0.4s ease',
  },
  suggestSymbol: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: '6px',
  },
  suggestRsi: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginBottom: '8px',
  },
  suggestBadge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: '20px',
    background: 'rgba(0,230,118,0.15)',
    color: '#00e676',
  },

  // Error
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

  stamp: {
    textAlign: 'center',
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '32px',
    paddingBottom: '24px',
  },
}

const keyframes = `
@keyframes pulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
`

function decisionColor(decision) {
  if (decision === 'BUY')  return { color: '#00e676', background: 'rgba(0,230,118,0.12)' }
  if (decision === 'SELL') return { color: '#ff4d6d', background: 'rgba(255,77,109,0.12)' }
  return { color: '#ffd60a', background: 'rgba(255,214,10,0.12)' }
}

export default function AgentChat() {
  const [query, setQuery]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [response, setResponse] = useState(null)
  const [error, setError]       = useState(null)
  const [thinkStep, setThinkStep] = useState(0)
  const [visibleSteps, setVisibleSteps] = useState([])
  const resultRef = useRef(null)

  // Animate thinking steps while loading
  useEffect(() => {
    if (!loading) { setThinkStep(0); return }
    const interval = setInterval(() => {
      setThinkStep(prev => (prev + 1) % THINKING_STEPS.length)
    }, 1200)
    return () => clearInterval(interval)
  }, [loading])

  // Animate response steps one by one
  useEffect(() => {
    if (!response?.steps) return
    setVisibleSteps([])
    response.steps.forEach((_, i) => {
      setTimeout(() => {
        setVisibleSteps(prev => [...prev, i])
      }, i * 300)
    })
    // Auto-scroll to result
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 400)
  }, [response])

  async function handleSubmit() {
    if (!query.trim() || loading) return
    setLoading(true)
    setError(null)
    setResponse(null)
    setVisibleSteps([])

    try {
      const res = await axios.post(`${API}/agent-query`, {
        query: query.trim(),
      })
      const data = res.data
      if (data.error) throw new Error(data.error)
      setResponse(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  const isSuggestion = response?.intent === 'SUGGESTION'
  const colors = response?.decision ? decisionColor(response.decision) : {}

  return (
    <div style={styles.page}>
      <style>{keyframes}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🧠</div>
          <span style={styles.logoText}>Agent</span>
        </div>
        <div style={styles.subtitle}>AI Stock Agent · Natural Language · Step-by-Step Reasoning</div>
        <div style={styles.disclaimer}>Not financial advice. For educational purposes only.</div>
      </div>

      {/* Input */}
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="Ask anything about stocks… e.g. Should I buy AAPL?"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
        />
        <button
          style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Thinking...' : '⚡ Ask Agent'}
        </button>
      </div>

      {/* Thinking panel */}
      {loading && (
        <div style={styles.thinkingBox}>
          <div style={styles.thinkingTitle}>
            <span>🧠</span> Agent Thinking...
          </div>
          {THINKING_STEPS.slice(0, thinkStep + 1).map((step, i) => (
            <div key={i} style={styles.thinkingStep}>
              <div style={styles.thinkingDot} />
              {step}
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>
          <span style={{ fontSize: '20px' }}>⚠</span>
          <span style={styles.errorText}>{error}</span>
        </div>
      )}

      {/* Response */}
      {response && (
        <div ref={resultRef}>

          {/* Step-by-step timeline */}
          <div style={styles.timelineBox}>
            <div style={styles.timelineTitle}>🔍 Agent Reasoning</div>
            {response.steps.map((step, i) => (
              visibleSteps.includes(i) && (
                <div key={i} style={styles.timelineItem}>
                  <div style={styles.timelineLeft}>
                    <div style={styles.timelineNum}>{i + 1}</div>
                    {i < response.steps.length - 1 && <div style={styles.timelineLine} />}
                  </div>
                  <div style={styles.timelineText}>{step}</div>
                </div>
              )
            ))}
          </div>

          {/* Analysis result */}
          {!isSuggestion && response.decision && (
            <div style={styles.decisionBox}>
              <div style={styles.decisionLabel}>📊 Decision</div>

              <div style={{ ...styles.decisionBadge, ...colors }}>
                {response.decision}
              </div>

              <div style={styles.confidenceLabel}>
                Confidence: {Math.round(response.confidence * 100)}%
              </div>
              <div style={styles.confidenceBar}>
                <div
                  style={{
                    ...styles.confidenceFill,
                    width: `${response.confidence * 100}%`,
                    background: colors.color,
                  }}
                />
              </div>

              {response.strategy && (
                <div style={styles.strategyBox}>
                  <div style={styles.strategyRow}>
                    <span style={styles.strategyKey}>Entry</span>
                    <span style={styles.strategyVal}>{response.strategy.entry}</span>
                  </div>
                  <div style={styles.strategyRow}>
                    <span style={styles.strategyKey}>Exit</span>
                    <span style={styles.strategyVal}>{response.strategy.exit}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Suggestion result */}
          {isSuggestion && response.results && (
            <div style={styles.suggestBox}>
              <div style={styles.suggestTitle}>
                📈 Stocks with Strong RSI ({response.results.length} found)
              </div>
              {response.results.length === 0 ? (
                <div style={styles.errorBox}>
                  <span>No stocks found with RSI &gt; 60 right now.</span>
                </div>
              ) : (
                <div style={styles.suggestGrid}>
                  {response.results.map((item, i) => (
                    <div key={i} style={styles.suggestCard}>
                      <div style={styles.suggestSymbol}>{item.stock}</div>
                      <div style={styles.suggestRsi}>RSI: {item.rsi}</div>
                      <span style={styles.suggestBadge}>{item.signal}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      <div style={styles.stamp}>
        Powered by yfinance + Groq · StockAI Agent 2025
      </div>
    </div>
  )
}