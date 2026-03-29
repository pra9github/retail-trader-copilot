import React, { useState } from 'react'
import Analysis from './pages/Analysis.jsx'
import AgentChat from './pages/AgentChat.jsx'

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    padding: '20px 20px 0',
  },
  tab: {
    padding: '8px 20px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: 'var(--accent)',
    color: '#000',
    border: '1px solid var(--accent)',
    fontWeight: 600,
  },
}

export default function App() {
  const [tab, setTab] = useState('analysis')

  return (
    <>
      <nav style={styles.nav}>
        <button
          style={{ ...styles.tab, ...(tab === 'analysis' ? styles.tabActive : {}) }}
          onClick={() => setTab('analysis')}
        >
          📊 Stock Analysis
        </button>
        <button
          style={{ ...styles.tab, ...(tab === 'agent' ? styles.tabActive : {}) }}
          onClick={() => setTab('agent')}
        >
          🧠 AI Agent
        </button>
      </nav>

      {tab === 'analysis' ? <Analysis /> : <AgentChat />}
    </>
  )
}