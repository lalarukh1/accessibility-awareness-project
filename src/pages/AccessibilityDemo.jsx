import { useState, useEffect, useRef, useCallback } from 'react'
import './AccessibilityDemo.css'

const MODES = [
  { id: 'none', label: 'Default - no filter', stat: null, description: null, tip: null },
  {
    id: 'blind',
    label: 'Blind',
    stat: 'Over 2.2 billion people have a vision impairment (WHO, 2023)',
    description: 'The screen is completely dark. Blind users navigate entirely by keyboard and screen reader. Tab through the page - every element should be reachable and meaningfully announced.',
    tip: 'Press Tab to move through the page. Notice every button, link and field has a clear label.',
  },
  {
    id: 'low-vision',
    label: 'Low Vision',
    stat: '246 million people live with moderate to severe vision impairment',
    description: 'Partial sight makes low-contrast text, small fonts and cluttered layouts nearly impossible to read. Font size, spacing and contrast ratios are not cosmetic choices.',
    tip: 'Notice how large headings remain somewhat readable while body text and labels become a strain.',
  },
  {
    id: 'color-blind',
    label: 'Color Blindness',
    stat: '8% of men and 0.5% of women have red-green colour blindness',
    description: 'Deuteranopia removes the ability to distinguish red from green. Interfaces that rely on colour alone to show errors, success states or status become ambiguous.',
    tip: 'Submit the form with errors (red) then successfully. Can you tell the states apart?',
  },
  {
    id: 'motor',
    label: 'Motor Impairment',
    stat: "Tremor affects roughly 1 in 25 people; Parkinson's alone affects 10 million worldwide",
    description: "Conditions like Parkinson's and essential tremor make precise cursor movement unreliable. Small click targets, hover-only menus and drag interactions become real barriers.",
    tip: 'Try clicking the show/hide password button or checking the small terms checkbox.',
  },
  {
    id: 'dyslexia',
    label: 'Dyslexia',
    stat: 'Dyslexia affects an estimated 10-15% of the global population',
    description: 'Without accommodation, dense text feels crowded and unstable. Letters drift on the baseline, similar letterforms (b, d, p, q) blur into each other, and tracking a line from word to word takes real effort.',
    tip: 'Try reading a full sentence or filling in the form. Notice how much concentration it takes just to hold the words still.',
  },
  {
    id: 'tunnel',
    label: 'Tunnel Vision',
    stat: 'Glaucoma - a leading cause of tunnel vision - affects 80 million people worldwide',
    description: 'Glaucoma and retinitis pigmentosa narrow the visual field to a small central circle. Move your cursor around and experience how scanning a full page becomes slow and exhausting.',
    tip: 'Try to find the navigation links or read the features section just by moving your mouse.',
  },
]

function validate(formData) {
  const errors = {}
  if (!formData.firstName.trim()) errors.firstName = 'First name is required.'
  if (!formData.lastName.trim()) errors.lastName = 'Last name is required.'
  if (!formData.email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!formData.password) {
    errors.password = 'Password is required.'
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }
  if (!formData.terms) errors.terms = 'You must agree to the Terms of Service.'
  return errors
}

export default function AccessibilityDemo() {
  const [mode, setMode] = useState('none')
  const [mousePos, setMousePos] = useState({ x: -300, y: -300 })
  const [tremorPos, setTremorPos] = useState({ x: -300, y: -300 })
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    terms: false,
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const successRef = useRef(null)
  const actualMouseRef = useRef({ x: -300, y: -300 })
  const rafRef = useRef(null)

  // Tunnel vision: track mouse position
  useEffect(() => {
    if (mode !== 'tunnel') return
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mode])

  // Motor tremor: RAF loop with jitter
  useEffect(() => {
    if (mode !== 'motor') {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      setTremorPos({ x: -300, y: -300 })
      return
    }

    const trackMouse = (e) => {
      actualMouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', trackMouse)

    const loop = () => {
      const jx = (Math.random() - 0.5) * 20
      const jy = (Math.random() - 0.5) * 20
      setTremorPos({
        x: actualMouseRef.current.x + jx,
        y: actualMouseRef.current.y + jy,
      })
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', trackMouse)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [mode])

  const handleField = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate(formData)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const fields = ['firstName', 'lastName', 'email', 'password', 'terms']
      for (const f of fields) {
        if (errs[f]) {
          const el = document.getElementById(`field-${f}`)
          if (el) el.focus()
          break
        }
      }
      return
    }
    setSubmitted(true)
    setTimeout(() => {
      if (successRef.current) successRef.current.focus()
    }, 100)
  }

  const handleReset = () => {
    setSubmitted(false)
    setFormData({ firstName: '', lastName: '', email: '', password: '', terms: false })
    setErrors({})
    setShowPassword(false)
  }

  const currentMode = MODES.find((m) => m.id === mode)

  return (
    <div className={`empathy-root mode--${mode}`}>
      {/* Hidden SVG filter for deuteranopia */}
      <svg className="empathy-svg-filters" aria-hidden="true" focusable="false">
        <defs>
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.367 0.861 -0.228 0 0  0.280 0.673 0.047 0 0  -0.012 0.043 0.969 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Skip link - fixed position, always above filters and overlays */}
      <a href="#demo-main" className="demo-skip">
        Skip to main content
      </a>

      {/* Mode control panel - never affected by mode effects */}
      <div className="mode-panel" role="region" aria-label="Accessibility mode selector">
        <div className="mode-panel__inner">
          <label htmlFor="mode-select" className="mode-panel__label">
            See how they use it
          </label>
          <select
            id="mode-select"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="mode-panel__select"
          >
            {MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          {currentMode?.description && (
            <div className="mode-panel__info" role="status" aria-live="polite">
              <span className="mode-panel__stat">{currentMode.stat}</span>
              <p className="mode-panel__desc">{currentMode.description}</p>
              <p className="mode-panel__tip">Try this: {currentMode.tip}</p>
            </div>
          )}
        </div>
      </div>

      {/* Demo page - all mode effects apply here */}
      <div className="demo-wrapper">
        <header className="d-header" role="banner">
          <div className="d-header__inner">
            <a href="#" className="d-logo" aria-label="Stride home">
              <svg
                viewBox="0 0 28 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <rect x="3" y="3" width="9" height="9" rx="2" />
                <rect x="16" y="3" width="9" height="9" rx="2" />
                <rect x="3" y="16" width="9" height="9" rx="2" />
                <path d="M16 20.5h9M20.5 16v9" />
              </svg>
              Stride
            </a>
            <nav className="d-nav" aria-label="Main navigation">
              <ul role="list">
                <li>
                  <a href="#features-section">Features</a>
                </li>
                <li>
                  <a href="#">Pricing</a>
                </li>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Log in</a>
                </li>
              </ul>
            </nav>
            <a href="#signup-section" className="d-header__cta">
              Get started
            </a>
          </div>
        </header>

        <main id="demo-main" tabIndex="-1">
          {/* Hero */}
          <section className="d-hero" aria-labelledby="hero-heading">
            <h1 id="hero-heading" className="d-hero__title">
              Work flows
              <br />
              faster with Stride.
            </h1>
            <p className="d-hero__sub">
              Stride brings your team, tasks, and timeline into one clear workspace, so nothing
              slips through the gaps.
            </p>
            <div className="d-hero__actions">
              <a href="#signup-section" className="d-btn d-btn--primary">
                Start for free
              </a>
              <a href="#features-section" className="d-btn d-btn--ghost">
                See how it works
              </a>
            </div>
          </section>

          {/* Features */}
          <section
            className="d-features"
            id="features-section"
            aria-labelledby="features-heading"
          >
            <h2 id="features-heading" className="d-section-label">
              What Stride does
            </h2>
            <ul className="d-feature-grid" role="list">
              <li className="d-feature-card">
                <div className="d-feature-card__icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <rect x="2" y="2" width="8" height="8" rx="1.5" />
                    <rect x="12" y="2" width="8" height="8" rx="1.5" />
                    <rect x="2" y="12" width="8" height="8" rx="1.5" />
                    <rect x="12" y="12" width="8" height="8" rx="1.5" />
                  </svg>
                </div>
                <h3 className="d-feature-card__title">Smart Organisation</h3>
                <p>
                  Structure projects your way. Create tasks, set priorities, and group work into
                  organised spaces your whole team can follow.
                </p>
              </li>
              <li className="d-feature-card">
                <div className="d-feature-card__icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <circle cx="8" cy="8" r="4" />
                    <circle cx="15" cy="8" r="4" />
                    <path d="M2 19c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6" />
                  </svg>
                </div>
                <h3 className="d-feature-card__title">Real-time Collaboration</h3>
                <p>
                  See changes as they happen. Comment, assign, and update tasks together without
                  ever losing track of who did what.
                </p>
              </li>
              <li className="d-feature-card">
                <div className="d-feature-card__icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <rect x="3" y="12" width="4" height="7" rx="1" />
                    <rect x="9" y="8" width="4" height="11" rx="1" />
                    <rect x="15" y="3" width="4" height="16" rx="1" />
                  </svg>
                </div>
                <h3 className="d-feature-card__title">Progress Tracking</h3>
                <p>
                  Milestones, deadlines, and reports in one view. Know exactly where each project
                  stands without chasing status updates.
                </p>
              </li>
            </ul>
          </section>

          {/* Sign-up */}
          <section className="d-signup" id="signup-section" aria-labelledby="signup-heading">
            <div className="d-signup__card">
              <h2 id="signup-heading" className="d-signup__title">
                Create your free account
              </h2>
              <p className="d-signup__sub">
                No credit card required. Up and running in 2 minutes.
              </p>

              {submitted ? (
                <div
                  className="d-success"
                  role="status"
                  tabIndex="-1"
                  ref={successRef}
                >
                  <div className="d-success__icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 28 28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M5 14l7 7L23 7" />
                    </svg>
                  </div>
                  <h3>You're in!</h3>
                  <p>
                    Check your inbox to verify your email address. Welcome to Stride.
                  </p>
                  <button onClick={handleReset} className="d-btn d-btn--ghost">
                    Start over
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate aria-label="Sign up form">
                  <div className="d-form-row">
                    <div className="d-field">
                      <label htmlFor="field-firstName">First name</label>
                      <input
                        id="field-firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        aria-required="true"
                        aria-describedby={errors.firstName ? 'err-firstName' : undefined}
                        aria-invalid={!!errors.firstName}
                        value={formData.firstName}
                        onChange={handleField}
                      />
                      {errors.firstName && (
                        <span id="err-firstName" className="d-field__error" role="alert">
                          {errors.firstName}
                        </span>
                      )}
                    </div>
                    <div className="d-field">
                      <label htmlFor="field-lastName">Last name</label>
                      <input
                        id="field-lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        aria-required="true"
                        aria-describedby={errors.lastName ? 'err-lastName' : undefined}
                        aria-invalid={!!errors.lastName}
                        value={formData.lastName}
                        onChange={handleField}
                      />
                      {errors.lastName && (
                        <span id="err-lastName" className="d-field__error" role="alert">
                          {errors.lastName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="d-field">
                    <label htmlFor="field-email">Email address</label>
                    <input
                      id="field-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      aria-required="true"
                      aria-describedby={errors.email ? 'err-email' : undefined}
                      aria-invalid={!!errors.email}
                      value={formData.email}
                      onChange={handleField}
                    />
                    {errors.email && (
                      <span id="err-email" className="d-field__error" role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>
                  <div className="d-field">
                    <label htmlFor="field-password">Password</label>
                    <div className="d-field__password-wrap">
                      <input
                        id="field-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        aria-required="true"
                        aria-describedby={`pw-hint${errors.password ? ' err-password' : ''}`}
                        aria-invalid={!!errors.password}
                        value={formData.password}
                        onChange={handleField}
                      />
                      <button
                        type="button"
                        className="d-field__pw-toggle"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <span id="pw-hint" className="d-field__hint">
                      Minimum 8 characters
                    </span>
                    {errors.password && (
                      <span id="err-password" className="d-field__error" role="alert">
                        {errors.password}
                      </span>
                    )}
                  </div>
                  <div className="d-field d-field--checkbox">
                    <input
                      id="field-terms"
                      name="terms"
                      type="checkbox"
                      aria-required="true"
                      aria-describedby={errors.terms ? 'err-terms' : undefined}
                      aria-invalid={!!errors.terms}
                      checked={formData.terms}
                      onChange={handleField}
                    />
                    <label htmlFor="field-terms">
                      I agree to the <a href="#">Terms of Service</a> and{' '}
                      <a href="#">Privacy Policy</a>
                    </label>
                    {errors.terms && (
                      <span id="err-terms" className="d-field__error" role="alert">
                        {errors.terms}
                      </span>
                    )}
                  </div>
                  <button type="submit" className="d-btn d-btn--primary d-btn--full">
                    Create account
                  </button>
                  <p className="d-signup__login">
                    Already have an account? <a href="#">Log in</a>
                  </p>
                </form>
              )}
            </div>
          </section>
        </main>

        <footer className="d-footer" role="contentinfo">
          <div className="d-footer__inner">
            <div className="d-footer__brand">
              <span className="d-logo__text">Stride</span>
              <p>2026 Stride Inc. All rights reserved.</p>
            </div>
            <nav aria-label="Footer navigation">
              <div className="d-footer__col">
                <h3>Product</h3>
                <ul role="list">
                  <li>
                    <a href="#">Features</a>
                  </li>
                  <li>
                    <a href="#">Pricing</a>
                  </li>
                  <li>
                    <a href="#">Changelog</a>
                  </li>
                </ul>
              </div>
              <div className="d-footer__col">
                <h3>Company</h3>
                <ul role="list">
                  <li>
                    <a href="#">About</a>
                  </li>
                  <li>
                    <a href="#">Blog</a>
                  </li>
                  <li>
                    <a href="#">Careers</a>
                  </li>
                </ul>
              </div>
              <div className="d-footer__col">
                <h3>Legal</h3>
                <ul role="list">
                  <li>
                    <a href="#">Privacy</a>
                  </li>
                  <li>
                    <a href="#">Terms</a>
                  </li>
                  <li>
                    <a href="#">Cookies</a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </footer>
      </div>

      {/* Tunnel vision overlay */}
      {mode === 'tunnel' && (
        <div
          className="tunnel-overlay"
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, transparent 100px, rgba(0,0,0,0.96) 150px)`,
          }}
        />
      )}

      {/* Motor tremor cursor */}
      {mode === 'motor' && (
        <div
          className="tremor-cursor"
          aria-hidden="true"
          style={{ left: tremorPos.x, top: tremorPos.y }}
        />
      )}
    </div>
  )
}
