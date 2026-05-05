import { useVoice } from '../contexts/VoiceContext'

const labels = {
  idle: 'Press space to talk',
  listening: 'Listening… speak now',
  thinking: 'Processing…',
  speaking: 'Speaking, press space to stop',
}

const icons = {
  idle: (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  listening: (
    <span aria-hidden="true" className="pill-pulse" />
  ),
  thinking: (
    <span aria-hidden="true" className="pill-spin">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    </span>
  ),
  speaking: (
    <span aria-hidden="true" className="pill-bars">
      <span/><span/><span/><span/>
    </span>
  ),
}

export default function StatusPill() {
  const { status } = useVoice()

  return (
    <>
      {/* Visible floating pill */}
      <div className={`status-pill status-pill--${status}`} aria-hidden="true">
        {icons[status]}
        <span>{labels[status]}</span>
      </div>

      {/* Screen-reader live region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {labels[status]}
      </div>
    </>
  )
}
