import { Link } from 'react-router-dom'
import './Resources.css'

const resources = [
  {
    id: 'OOvXuz6ejuw',
    title: 'Navigating the Web as a Blind Person: Accessible vs. Inaccessible Websites',
    tag: 'First-hand experience',
    description:
      'A blind user navigates the same tasks on two different websites — one built with care, one built without. The gap between the two experiences, in frustration and lost time, is stark.',
    url: 'https://www.youtube.com/watch?v=OOvXuz6ejuw',
  },
  {
    id: 'ia7fRPGxCK8',
    title: 'How Web Accessibility Widgets Affect Blind Users',
    tag: 'First-hand experience',
    description:
      'Third-party accessibility overlays are sold as a quick fix, but how do they actually feel to use? A blind user puts them to the test and shows why bolt-on tools often make things worse.',
    url: 'https://www.youtube.com/watch?v=ia7fRPGxCK8',
  },
  {
    id: 'PbBZjT7nuoA',
    title: "Hearing Loss Simulation: What's It Like?",
    tag: 'Empathy simulation',
    description:
      'An audio demonstration that walks through what everyday sounds — speech, music, background noise — are like at different levels of hearing loss. A quick way to understand why captions and clear audio design are not optional.',
    url: 'https://www.youtube.com/watch?v=PbBZjT7nuoA',
  },
  {
    id: 'QWPWgaDqbZI',
    title: "The Internet's Accessibility Problem — and How To Fix It",
    tag: 'TED Talk',
    description:
      'Clive Loseby makes the case at TED for why accessibility needs to be designed in from the start, not layered on at the end — and what the web could look like if we got that right.',
    url: 'https://www.youtube.com/watch?v=QWPWgaDqbZI',
  },
]

const tagColours = {
  'First-hand experience': { bg: '#EFF6FF', text: '#1D4ED8' },
  'Empathy simulation':    { bg: '#F0FDF4', text: '#166534' },
  'TED Talk':              { bg: '#FFF7ED', text: '#C2410C' },
}

export default function Resources() {
  return (
    <main id="main-content" tabIndex="-1" className="resources-page">
      <section className="resources-hero">
        <h1 className="resources-hero__title">Resource Library</h1>
        <p className="resources-hero__sub">
          Real perspectives, first-hand accounts and educational content that build
          genuine understanding of what it means to navigate the web with a disability.
        </p>
      </section>

      <section className="resources-grid-section" aria-label="Resources">
        <ul className="resources-grid" role="list">
          {resources.map((r) => {
            const colour = tagColours[r.tag] ?? { bg: '#F3F4F6', text: '#374151' }
            return (
              <li key={r.id} className="resource-card">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-card__thumb-link"
                  tabIndex="-1"
                  aria-hidden="true"
                >
                  <div className="resource-card__thumb-wrap">
                    <img
                      src={`https://img.youtube.com/vi/${r.id}/maxresdefault.jpg`}
                      alt=""
                      className="resource-card__thumb"
                      loading="lazy"
                      width="480"
                      height="270"
                    />
                    <span className="resource-card__play" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                        <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.55)" />
                        <polygon points="9.5,7 18.5,12 9.5,17" fill="white" />
                      </svg>
                    </span>
                  </div>
                </a>

                <div className="resource-card__body">
                  <span
                    className="resource-card__tag"
                    style={{ background: colour.bg, color: colour.text }}
                  >
                    {r.tag}
                  </span>

                  <h2 className="resource-card__title">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-card__title-link"
                    >
                      {r.title}
                    </a>
                  </h2>

                  <p className="resource-card__desc">{r.description}</p>

                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-card__watch"
                    aria-label={`Watch: ${r.title} (opens YouTube)`}
                  >
                    Watch on YouTube
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="resources-back">
        <Link to="/" className="resources-back__link">
          ← Back to all experiments
        </Link>
      </div>
    </main>
  )
}
