import { Link } from 'react-router-dom'
import { articles } from '../data/articles'

export default function Home() {
  return (
    <main id="main-content" tabIndex="-1">
      <section aria-labelledby="featured-heading" className="featured-section">
        <h2 id="featured-heading" className="section-label">Today's Stories</h2>

        <div className="article-grid" role="list">
          {articles.map((article, index) => (
            <article
              key={article.id}
              className="article-card"
              role="listitem"
              aria-labelledby={`article-title-${article.id}`}
            >
              <Link
                to={`/bemyvoice/article/${article.id}`}
                className="article-card__image-link"
                tabIndex="-1"
                aria-hidden="true"
              >
                <div className="article-card__image-wrap">
                  <img
                    src={article.image}
                    alt={article.imageAlt}
                    className="article-card__image"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    width="800"
                    height="450"
                  />
                </div>
              </Link>

              <div className="article-card__body">
                <div className="article-card__meta">
                  <span className="article-card__category">{article.category}</span>
                  <time className="article-card__date" dateTime={article.date}>
                    {article.date}
                  </time>
                </div>

                <h3 id={`article-title-${article.id}`} className="article-card__title">
                  <Link to={`/bemyvoice/article/${article.id}`} className="article-card__title-link">
                    {article.title}
                  </Link>
                </h3>

                <p className="article-card__excerpt">{article.excerpt}</p>

                <Link
                  to={`/bemyvoice/article/${article.id}`}
                  className="article-card__read-more"
                  aria-label={`Read full article: ${article.title}`}
                >
                  Read full article
                  <span aria-hidden="true"> →</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
