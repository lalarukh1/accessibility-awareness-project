import { Link } from 'react-router-dom'

const experiments = [
  {
    slug: '/bemyvoice',
    title: 'BeMyVoice News',
    tag: 'Voice Navigation',
    description:
      'An AI-powered voice assistant built for blind users. Navigate articles, read content, and explore the page entirely by holding the spacebar and speaking, no mouse, no visual interface required.',
    cta: 'Explore',
  },
  {
    slug: '/accessibility-demo',
    title: 'Empathy Mode',
    tag: 'Empathy Simulation',
    description:
      'Experience the web through different accessibility needs. Toggle between visual impairments, motor limitations, and cognitive differences to understand what millions of users face on everyday websites.',
    cta: 'Explore',
  },
  {
    slug: '/alt-text',
    title: 'Alt Text Generator',
    tag: 'AI Vision',
    description:
      'Upload any image and let AI write the alt text for you. Choose how detailed you need it: a quick phrase, a balanced description, or a full breakdown for charts and complex visuals.',
    cta: 'Explore',
  },
  {
    slug: '/themeseed/',
    title: 'ThemeSeed',
    tag: 'Accessible Design',
    description:
      'Describe your project and get back a complete, WCAG 2.1 AA compliant design system — colour palettes with verified contrast ratios, typography scale, spacing, and component tokens. Designed so accessibility is built in from the first token, not bolted on at the end.',
    cta: 'Explore',
    external: true,
  },
]

export default function ProjectHome() {
  return (
    <main id="main-content" tabIndex="-1" className="project-home">
      <section className="project-home__intro" aria-labelledby="project-heading">
        <h1 id="project-heading" className="project-home__title">
          Accessibility Awareness Project
        </h1>
        <p className="project-home__lead">
          The web should work for everyone. For millions of people with disabilities, it often doesn't.
        </p>
        <div className="project-home__body-group">
          <p className="project-home__body project-home__body--framed">
            This project brings that gap into focus through specialised experiments
            designed to move accessibility from a side thought to a main feature.
          </p>
          <p className="project-home__body">
            With AI, the standard work: screen reader labels, contrast ratios, keyboard navigation,
            semantic structure. These can be audited and fixed at scale. Accessibility should not
            be a checklist you tick off before shipping anymore.
          </p>
          <p className="project-home__body project-home__body">
            Here we explore designing not for compliance, but for specific people and how they
            actually experience the web. Feeling what they feel. Using AI to go niche in ways
            the rulebook never could.
          </p>
          <p className="project-home__body">
            Whether you are a developer, a designer, a product owner, or simply someone who wants
            to know what it feels like to navigate the web when sight, motor control, or cognition
            works differently, these experiments are here to build that understanding.
          </p>
        </div>
      </section>

      <section aria-labelledby="demos-heading" className="project-home__demos">
        <h2 id="demos-heading" className="project-home__demos-label">Experiments</h2>
        <ul className="project-cards" role="list">
          {experiments.map((p) => (
            <li key={p.slug} className="project-card" role="listitem">
              <div className="project-card__inner">
                <span className="project-card__tag">{p.tag}</span>
                <h3 className="project-card__title">{p.title}</h3>
                <p className="project-card__desc">{p.description}</p>
                {p.comingSoon ? (
                  <span className="project-card__cta project-card__cta--disabled" aria-disabled="true">
                    {p.cta}
                  </span>
                ) : p.external ? (
                  <a href={p.slug} className="project-card__cta">
                    {p.cta}
                  </a>
                ) : (
                  <Link to={p.slug} className="project-card__cta">
                    {p.cta}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="resources-heading" className="project-home__resources">
        <h2 id="resources-heading" className="project-home__demos-label">Education</h2>
        <div className="resource-hub-card">
          <div className="resource-hub-card__inner">
            <span className="project-card__tag">Watch &amp; Learn</span>
            <h3 className="resource-hub-card__title">Resource Library</h3>
            <p className="resource-hub-card__desc">
              A growing collection of videos, talks and first-hand accounts. Real people showing
              what it means to navigate the web with a disability, and why the decisions we make
              as builders matter.
            </p>
            <Link to="/resources" className="project-card__cta">
              Explore
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
