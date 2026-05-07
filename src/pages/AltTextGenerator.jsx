import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './AltTextGenerator.css'

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

// Diverse examples: person, data viz, product, landscape, group, infographic-style
const EXAMPLES = [
  {
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    label: 'Data chart',
  },
  {
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
    label: 'Person at work',
  },
  {
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    label: 'Product photo',
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    label: 'Landscape',
  },
  {
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
    label: 'Group of people',
  },
]

const STYLES = [
  {
    id: 'concise',
    label: 'Concise',
    hint: 'A short phrase. The essential subject only.',
    prompt: `Write concise alt text for this image. Return only the alt text, nothing else. No quotes, no label, no explanation. Keep it under 10 words. Capture only what is most essential for a screen reader user.`,
  },
  {
    id: 'descriptive',
    label: 'Descriptive',
    hint: '1–2 sentences covering what it shows and why it matters.',
    prompt: `Write descriptive alt text for this image. Return only the alt text, nothing else. No quotes, no label, no explanation. Write 1 to 2 sentences. Give a screen reader user meaningful context about what this image shows and what it communicates.`,
  },
  {
    id: 'detailed',
    label: 'Detailed',
    hint: 'Full description including colours, data, and any text. Best for charts or complex visuals.',
    prompt: `Write detailed alt text for this image. Return only the alt text, nothing else. No quotes, no label, no explanation. Provide a thorough description covering key visual elements, colours, any text or data visible, and the overall context. This style is suited to complex images like charts, infographics, or photographs with important detail.`,
  },
]

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AltTextGenerator() {
  const [image, setImage] = useState(null) // { file, previewUrl, base64, mediaType }
  const [style, setStyle] = useState('descriptive')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [dragging, setDragging] = useState(false)

  const [activeExample, setActiveExample] = useState(null)

  const inputRef = useRef(null)
  const resultRef = useRef(null)

  const loadFromUrl = useCallback(async (url, label) => {
    setError('')
    setResult('')
    setActiveExample(url)
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const file = new File([blob], label, { type: blob.type })
      const previewUrl = URL.createObjectURL(blob)
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]
        setImage({ file, previewUrl, base64, mediaType: blob.type })
      }
      reader.readAsDataURL(blob)
    } catch {
      setError('Could not load the example image. Try uploading one instead.')
      setActiveExample(null)
    }
  }, [])

  const loadFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload an image file.')
      return
    }
    const previewUrl = URL.createObjectURL(file)
    const base64 = await fileToBase64(file)
    setImage({ file, previewUrl, base64, mediaType: file.type })
    setResult('')
    setError('')
  }, [])

  const onFileChange = (e) => {
    if (e.target.files[0]) loadFile(e.target.files[0])
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) { setActiveExample(null); loadFile(file) }
  }

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const generate = async () => {
    if (!image) return
    if (!API_KEY) {
      setError('No Anthropic API key found. Add VITE_ANTHROPIC_API_KEY to your .env file.')
      return
    }

    setLoading(true)
    setError('')
    setResult('')

    const selectedStyle = STYLES.find((s) => s.id === style)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-5',
          max_tokens: 300,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: image.mediaType,
                    data: image.base64,
                  },
                },
                {
                  type: 'text',
                  text: selectedStyle.prompt,
                },
              ],
            },
          ],
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error?.message || `API error ${res.status}`)
      }

      const data = await res.json()
      const text = data.content?.[0]?.text?.trim() ?? ''
      setResult(text)
      setTimeout(() => resultRef.current?.focus(), 50)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Could not copy to clipboard.')
    }
  }

  const currentStyle = STYLES.find((s) => s.id === style)

  return (
    <main id="main-content" tabIndex="-1" className="alt-page">
      <section className="alt-hero">
        <h1 className="alt-hero__title">Alt Text Generator</h1>
        <p className="alt-hero__sub">
          Upload any image, choose a style, and get AI-written alt text you can
          drop straight into your code. Built to show what proper image descriptions
          look like, and how much better they are than nothing.
        </p>
      </section>

      <div className="alt-layout">

        {/* ── Left: controls ── */}
        <div className="alt-controls">

          {/* Upload */}
          <div className="alt-section">
            <label className="alt-label" htmlFor="image-upload">Image</label>
            <div
              className={`alt-dropzone${dragging ? ' alt-dropzone--dragging' : ''}${image ? ' alt-dropzone--has-image' : ''}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex="0"
              aria-label="Upload image: click or drag and drop"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
            >
              <input
                ref={inputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onFileChange}
                aria-label="Choose image file"
              />
              {image ? (
                <img
                  src={image.previewUrl}
                  alt="Uploaded preview"
                  className="alt-dropzone__preview"
                />
              ) : (
                <div className="alt-dropzone__empty">
                  <svg aria-hidden="true" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p>Click or drag an image here</p>
                  <span>PNG, JPG, GIF, WebP</span>
                </div>
              )}
            </div>
            {image && (
              <button
                className="alt-change-btn"
                onClick={() => { setImage(null); setResult(''); setError(''); setActiveExample(null) }}
              >
                Remove image
              </button>
            )}
          </div>

          {/* Example images */}
          <div className="alt-section">
            <span className="alt-examples-label">Or pick an example</span>
            <ul className="alt-examples" role="list">
              {EXAMPLES.map((ex) => (
                <li key={ex.url}>
                  <button
                    className={`alt-example-btn${activeExample === ex.url ? ' alt-example-btn--active' : ''}`}
                    onClick={() => loadFromUrl(ex.url, ex.label)}
                    aria-label={`Use example: ${ex.label}`}
                    aria-pressed={activeExample === ex.url}
                  >
                    <img src={ex.url} alt={ex.label} loading="lazy" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Style */}
          <div className="alt-section">
            <label className="alt-label" htmlFor="style-select">Style</label>
            <select
              id="style-select"
              className="alt-select"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              {STYLES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <p className="alt-hint">{currentStyle.hint}</p>
          </div>

          {/* Generate */}
          <button
            className="alt-generate-btn"
            onClick={generate}
            disabled={!image || loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="alt-spinner" aria-hidden="true" />
                Analysing image...
              </>
            ) : (
              'Generate alt text'
            )}
          </button>

          {error && (
            <p className="alt-error" role="alert">{error}</p>
          )}
        </div>

        {/* ── Right: result ── */}
        <div className="alt-result-panel">
          <div className="alt-result-header">
            <span className="alt-label">Generated alt text</span>
            {result && (
              <button className="alt-copy-btn" onClick={copy} aria-live="polite">
                {copied ? (
                  <>
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          {result ? (
            <div
              className="alt-result-box alt-result-box--filled"
              ref={resultRef}
              tabIndex="-1"
              role="region"
              aria-label="Generated alt text"
            >
              <p className="alt-result-text">{result}</p>
              <div className="alt-result-code">
                <code>alt="{result}"</code>
              </div>
            </div>
          ) : (
            <div className="alt-result-box alt-result-box--empty" aria-hidden="true">
              <p>Your alt text will appear here once you upload an image and click generate.</p>
            </div>
          )}

          {result && (
            <div className="alt-result-footer">
              <p>
                <strong>Try all three styles</strong> on the same image to see how the output changes
                depending on context and need.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="alt-back">
        <Link to="/" className="alt-back__link">← Back to all experiments</Link>
      </div>
    </main>
  )
}
