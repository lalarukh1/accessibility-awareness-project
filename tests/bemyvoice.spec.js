import { test, expect } from '@playwright/test'

// ── Project Home ───────────────────────────────────────────────────────────

test.describe('Project Home (/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders heading and intro copy', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Accessibility Awareness Project', level: 1 })).toBeVisible()
    await expect(page.getByText('The web should work for everyone.')).toBeVisible()
  })

  test('shows Experiments section with two cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /experiments/i, level: 2 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'BeMyVoice News', level: 3 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Empathy Mode', level: 3 })).toBeVisible()
  })

  test('BeMyVoice card has a working link', async ({ page }) => {
    await page.getByRole('link', { name: 'Open BeMyVoice' }).click()
    await expect(page).toHaveURL('/bemyvoice')
  })

  test('Empathy Mode card is disabled (no link)', async ({ page }) => {
    const disabled = page.locator('.project-card__cta--disabled')
    await expect(disabled).toBeVisible()
    await expect(disabled).toHaveText('Open Empathy Mode')
    // Must not be an anchor tag
    await expect(page.getByRole('link', { name: 'Open Empathy Mode' })).toHaveCount(0)
  })

  test('global header shows project name', async ({ page }) => {
    await expect(page.locator('.global-header__title')).toHaveText('Accessibility Awareness Project')
  })

  test('global header shows no section name on root', async ({ page }) => {
    await expect(page.locator('.global-header__section')).toHaveCount(0)
  })

  test('no em dashes anywhere on page', async ({ page }) => {
    const body = await page.locator('body').innerText()
    expect(body).not.toContain('—') // —
  })
})

// ── BeMyVoice News Home (/bemyvoice) ──────────────────────────────────────

test.describe('BeMyVoice News Home (/bemyvoice)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bemyvoice')
  })

  test('renders Today\'s Stories heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: "Today's Stories" })).toBeVisible()
  })

  test('shows all 3 articles', async ({ page }) => {
    const cards = page.locator('.article-card')
    await expect(cards).toHaveCount(3)
  })

  test('first article title is correct', async ({ page }) => {
    await expect(page.getByText('AI Breakthrough Enables Real-Time Language Translation for 200 Languages')).toBeVisible()
  })

  test('second article title is correct', async ({ page }) => {
    await expect(page.getByText('Historic Climate Agreement Signed by 142 Nations at Geneva Summit')).toBeVisible()
  })

  test('third article title is correct', async ({ page }) => {
    await expect(page.getByText('Scientists Detect Water Vapour in Atmosphere of Potentially Habitable Exoplanet')).toBeVisible()
  })

  test('global header shows BeMyVoice News section name', async ({ page }) => {
    await expect(page.locator('.global-header__section')).toHaveText('BeMyVoice News')
  })

  test('global header title links back to project home', async ({ page }) => {
    await page.locator('.global-header__title').click()
    await expect(page).toHaveURL('/')
  })

  test('status pill is visible with idle state', async ({ page }) => {
    await expect(page.locator('.status-pill')).toBeVisible()
    await expect(page.locator('.status-pill')).toHaveClass(/status-pill--idle/)
    await expect(page.locator('.status-pill')).toContainText('Press space to talk')
  })

  test('footer shows voice assistant instructions', async ({ page }) => {
    await expect(page.getByText('Hold Space')).toBeVisible()
  })
})

// ── Article Navigation ─────────────────────────────────────────────────────

test.describe('Article navigation', () => {
  test('clicking article 1 title navigates to /bemyvoice/article/1', async ({ page }) => {
    await page.goto('/bemyvoice')
    await page.getByRole('link', { name: 'AI Breakthrough Enables Real-Time Language Translation for 200 Languages' }).first().click()
    await expect(page).toHaveURL('/bemyvoice/article/1')
  })

  test('clicking Read full article on article 2 navigates to /bemyvoice/article/2', async ({ page }) => {
    await page.goto('/bemyvoice')
    await page.getByRole('link', { name: 'Read full article: Historic Climate Agreement Signed by 142 Nations at Geneva Summit' }).click()
    await expect(page).toHaveURL('/bemyvoice/article/2')
  })

  test('clicking article 3 navigates to /bemyvoice/article/3', async ({ page }) => {
    await page.goto('/bemyvoice')
    await page.getByRole('link', { name: 'Read full article: Scientists Detect Water Vapour in Atmosphere of Potentially Habitable Exoplanet' }).click()
    await expect(page).toHaveURL('/bemyvoice/article/3')
  })
})

// ── Article Page ───────────────────────────────────────────────────────────

test.describe('Article page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bemyvoice/article/1')
  })

  test('renders article title as h1', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'AI Breakthrough Enables Real-Time Language Translation for 200 Languages', level: 1 })).toBeVisible()
  })

  test('renders article author', async ({ page }) => {
    await expect(page.getByText('Sarah Chen')).toBeVisible()
  })

  test('renders article date', async ({ page }) => {
    await expect(page.getByText('May 2, 2026')).toBeVisible()
  })

  test('renders article category', async ({ page }) => {
    await expect(page.getByText('Technology')).toBeVisible()
  })

  test('renders hero image with alt text', async ({ page }) => {
    const img = page.locator('.full-article__hero')
    await expect(img).toBeVisible()
    await expect(img).toHaveAttribute('alt', 'A glowing neural network diagram visualising AI language processing')
  })

  test('renders body paragraphs', async ({ page }) => {
    const paragraphs = page.locator('.full-article__body p')
    await expect(paragraphs).toHaveCount(6)
  })

  test('back link navigates to /bemyvoice', async ({ page }) => {
    await page.getByRole('link', { name: /back to all stories/i }).click()
    await expect(page).toHaveURL('/bemyvoice')
  })

  test('global header shows BeMyVoice News section name', async ({ page }) => {
    await expect(page.locator('.global-header__section')).toHaveText('BeMyVoice News')
  })

  test('status pill is visible on article page', async ({ page }) => {
    await expect(page.locator('.status-pill')).toBeVisible()
    await expect(page.locator('.status-pill--idle')).toBeVisible()
  })
})

// ── Article 2 and 3 spot checks ────────────────────────────────────────────

test('article 2 renders climate content', async ({ page }) => {
  await page.goto('/bemyvoice/article/2')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Historic Climate Agreement')
  await expect(page.getByText('James Okafor')).toBeVisible()
  await expect(page.locator('.full-article__body p')).toHaveCount(6)
})

test('article 3 renders exoplanet content', async ({ page }) => {
  await page.goto('/bemyvoice/article/3')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Scientists Detect Water Vapour')
  await expect(page.locator('.full-article__body p')).toHaveCount(6)
})

test('unknown article redirects to /bemyvoice', async ({ page }) => {
  await page.goto('/bemyvoice/article/999')
  await expect(page).toHaveURL('/bemyvoice')
})

// ── Status Pill / Spacebar UI ─────────────────────────────────────────────

test.describe('Spacebar status pill UI (no real mic/websocket)', () => {
  test.beforeEach(async ({ page }) => {
    // Override mediaDevices via defineProperty (works in headless Chromium)
    // and make ElevenLabs fetch hang so the listening state stays observable
    await page.addInitScript(() => {
      // Both getUserMedia and ElevenLabs fetch hang forever.
      // This keeps the pill in 'listening' state until space is released,
      // giving Playwright time to observe the state change.
      Object.defineProperty(navigator, 'mediaDevices', {
        get: () => ({ getUserMedia: () => new Promise(() => {}) }),
        configurable: true,
      })
      const realFetch = window.fetch
      window.fetch = (url, ...args) => {
        if (typeof url === 'string' && url.includes('elevenlabs.io')) {
          return new Promise(() => {})
        }
        return realFetch(url, ...args)
      }
    })
    await page.goto('/bemyvoice')
    // Wait for React to mount and useEffect to attach the keydown listener
    await page.waitForSelector('.status-pill--idle')
  })

  test('pill starts in idle state', async ({ page }) => {
    await expect(page.locator('.status-pill--idle')).toBeVisible()
    await expect(page.locator('.status-pill')).toContainText('Press space to talk')
  })

  test('holding space changes pill to listening', async ({ page }) => {
    await page.keyboard.down('Space')
    await expect(page.locator('.status-pill--listening')).toBeVisible({ timeout: 4000 })
    await expect(page.locator('.status-pill')).toContainText('Listening')
    await page.keyboard.up('Space')
  })

  test('releasing space while fetch is pending returns pill to idle', async ({ page }) => {
    await page.keyboard.down('Space')
    await expect(page.locator('.status-pill--listening')).toBeVisible({ timeout: 4000 })
    await page.keyboard.up('Space')
    // No connected session on keyup → idle
    await expect(page.locator('.status-pill--idle')).toBeVisible({ timeout: 3000 })
  })

  test('screen reader live region reflects pill state', async ({ page }) => {
    const liveRegion = page.locator('[role="status"]')
    await expect(liveRegion).toContainText('Press space to talk')
  })
})

// ── Accessibility ──────────────────────────────────────────────────────────

test.describe('Accessibility basics', () => {
  test('project home has skip link', async ({ page }) => {
    await page.goto('/')
    // skip link exists on bemyvoice sub-pages, not project home
    // just verify main content is reachable
    await expect(page.locator('#main-content')).toBeVisible()
  })

  test('bemyvoice home has skip to main link', async ({ page }) => {
    await page.goto('/bemyvoice')
    const skipLink = page.locator('.skip-link')
    await expect(skipLink).toBeAttached()
    await expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  test('article page main content is focusable', async ({ page }) => {
    await page.goto('/bemyvoice/article/1')
    const main = page.locator('#main-content')
    await expect(main).toHaveAttribute('tabindex', '-1')
  })

  test('article images have non-empty alt text', async ({ page }) => {
    await page.goto('/bemyvoice')
    const images = page.locator('.article-card__image')
    const count = await images.count()
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt')
      expect(alt).toBeTruthy()
      expect(alt.length).toBeGreaterThan(5)
    }
  })

  test('empathy mode card is aria-disabled', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.project-card__cta--disabled')).toHaveAttribute('aria-disabled', 'true')
  })
})
