import { useParams, Link, Navigate } from 'react-router-dom'
import { articles } from '../data/articles'

export default function Article() {
  const { id } = useParams()
  const article = articles.find((a) => a.id === parseInt(id))

  if (!article) return <Navigate to="/bemyvoice" replace />

  return (
    <main id="main-content" tabIndex="-1">
      <article aria-labelledby="article-title" className="full-article">
        <header className="full-article__header">
          <div className="full-article__meta">
            <span className="article-card__category">{article.category}</span>
            <time dateTime={article.date}>{article.date}</time>
          </div>

          <h1 id="article-title" className="full-article__title">
            {article.title}
          </h1>

          <p className="full-article__byline">
            By <span className="full-article__author">{article.author}</span>
          </p>
        </header>

        <figure className="full-article__figure">
          <img
            src={article.image}
            alt={article.imageAlt}
            className="full-article__hero"
            width="1200"
            height="600"
          />
          <figcaption className="full-article__caption">{article.imageAlt}</figcaption>
        </figure>

        <div className="full-article__body">
          {article.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <nav aria-label="Article navigation" className="full-article__nav">
          <Link to="/bemyvoice" className="back-link">
            <span aria-hidden="true">←</span> Back to all stories
          </Link>
        </nav>
      </article>
    </main>
  )
}
