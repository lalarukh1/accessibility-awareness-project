import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { ConversationProvider } from '@elevenlabs/react'
import { VoiceProvider } from './contexts/VoiceContext'
import VoiceAssistant from './components/VoiceAssistant'
import StatusPill from './components/StatusPill'
import ProjectHome from './pages/ProjectHome'
import Home from './pages/Home'
import Article from './pages/Article'
import AccessibilityDemo from './pages/AccessibilityDemo'
import Resources from './pages/Resources'
import AltTextGenerator from './pages/AltTextGenerator'

function BeMyVoiceApp() {
  return (
    <ConversationProvider>
      <VoiceProvider>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <VoiceAssistant />
        <StatusPill />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="article/:id" element={<Article />} />
        </Routes>

        <footer className="site-footer" role="contentinfo" id="accessibility-info">
          <div className="site-footer__inner">
            <section aria-labelledby="a11y-heading">
              <h2 id="a11y-heading" className="site-footer__heading">Voice Assistant</h2>
              <ul className="site-footer__features">
                <li><strong>Hold Space</strong> to speak, release to send.</li>
                <li><strong>Commands to try:</strong> "Read the article", "Go home", "What's on this page", "Describe the image", "Open the science article".</li>
                <li><strong>Press Space while AI is speaking</strong> to stop it.</li>
              </ul>
            </section>
            <p className="site-footer__note">
              BeMyVoice News is part of the{' '}
              <Link to="/">Accessibility Awareness Project</Link>.
              All articles are fictional examples.
            </p>
          </div>
        </footer>
      </VoiceProvider>
    </ConversationProvider>
  )
}

const sectionNames = {
  '/bemyvoice': 'BeMyVoice News',
  '/accessibility-demo': 'Empathy Mode',
  '/resources': 'Resource Library',
  '/alt-text': 'Alt Text Generator',
}

function GlobalHeader() {
  const { pathname } = useLocation()
  const section = Object.entries(sectionNames).find(([k]) => pathname.startsWith(k))?.[1]
  return (
    <header className="global-header" role="banner">
      <Link to="/" className="global-header__title">
        Accessibility Awareness Project
      </Link>
      {section && <span className="global-header__section">{section}</span>}
    </header>
  )
}

export default function App() {
  return (
    <>
      <GlobalHeader />

      <Routes>
        <Route path="/" element={<ProjectHome />} />
        <Route path="/bemyvoice/*" element={<BeMyVoiceApp />} />
        <Route path="/accessibility-demo" element={<AccessibilityDemo />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/alt-text" element={<AltTextGenerator />} />
      </Routes>
    </>
  )
}
