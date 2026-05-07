# Accessibility Awareness Project

**A collection of experiments exploring what it actually means to design for disabled users — and why getting it right benefits everyone.**

---

## The idea

Accessibility is usually treated as a checklist: hit the contrast ratio, add the ARIA label, ship. This project takes a different approach. It asks what it feels like to navigate the web when sight, motor control, or cognition works differently — and uses that question to build things that genuinely help.

With AI handling the standard work at scale — semantic structure, labels, contrast audits — there's space to go further. To design not for a spec, but for a specific person and how they actually experience the web.

These experiments are for developers, designers, and anyone who wants to understand what's at stake when we make (or skip) accessibility decisions.

---

## Experiments

### 1 — BeMyVoice News `Voice Navigation`

A news reader built entirely around a conversational AI assistant. Designed for blind users, but the experience it creates — a patient, context-aware assistant that answers your questions about the page rather than reading everything at you — turns out to be a better interface for anyone.

**How it works:**
- Hold Space to activate the assistant, speak your request, release to send
- On load, the assistant orients you: where you are, what's on the page, how to navigate
- Ask it to read an article, describe an image, go to a different page, or answer a question about the content
- Works entirely without a mouse or visual interface

The assistant is built on an ElevenLabs Conversational AI agent — not just text-to-speech, but a full agentic loop that understands context, holds a conversation, and decides how to respond. Claude handles the reasoning behind those decisions: interpreting what the user actually wants, understanding page structure, and generating image descriptions.

The insight here: screen readers narrate the whole page at you. An AI assistant waits for your questions. That shift in model — from broadcast to conversation — makes the web meaningfully more usable for blind users, and more pleasant for everyone else.

---

### 2 — Empathy Mode `Disability Simulation`

A form-based demo where you experience a normal webpage through six different accessibility conditions. Not a filter overlay — each mode changes how you interact with the page, not just how it looks.

| Mode | What you experience |
|---|---|
| **Blind** | Full dark screen. Navigate by Tab only. Every element must earn its label. |
| **Low Vision** | Partial sight. Body text becomes a strain; only large headings remain readable. |
| **Color Blindness** | Deuteranopia (red-green). Try submitting a form with errors — can you tell success from failure without colour? |
| **Motor Impairment** | Tremor simulation. Cursor drift makes small targets, checkboxes, and password toggles genuinely hard to hit. |
| **Dyslexia** | Letters drift, similar forms blur (b, d, p, q). Reading a full sentence takes real concentration. |
| **Tunnel Vision** | Glaucoma-style peripheral loss. Finding navigation or scanning a layout means moving your mouse across the whole screen. |

Each mode includes a real statistic (WHO, global prevalence data) and a tip for what to try — so the experience connects to something concrete, not just discomfort.

---

### 3 — Alt Text Generator `AI Vision`

A practical tool for developers and content creators: upload any image (or pick from curated examples), choose how detailed you need the description, and Claude writes ready-to-use alt text you can copy straight into your code.

**Three output styles:**

| Style | What you get |
|---|---|
| **Concise** | A short phrase — the essential subject only, under 10 words |
| **Descriptive** | 1–2 sentences covering what the image shows and what it communicates |
| **Detailed** | Full breakdown including colours, data, visible text — suited to charts, infographics, and complex visuals |

The experiment makes a point as much as it provides a utility: most images on the web have no alt text, and most that do have unhelpful alt text like "image.jpg". Seeing what a proper description looks like — and how different it is across contexts — changes how you think about the images you ship.

Powered by Claude's vision API. Runs entirely in the browser.

---

### 4 — ThemeSeed `Accessible Design`

A design system generator that bakes accessibility in from the very first token. Describe your project in plain English and get back a complete, downloadable design system — colour palettes, typography scale, spacing, and component tokens — all verified against WCAG 2.1 AA contrast ratios before anything is handed to you.

The point: most design systems get built first, then audited for accessibility later. ThemeSeed flips that. Claude generates the palette, calculates real luminance contrast ratios, and adjusts colours until they pass — so the output is compliant by construction, not by retrofit.

**What gets generated:**
- Primitive and semantic colour tokens with contrast check results
- Typography scale with specimen previews
- Spacing and border-radius scales
- Button states and size grid
- Tailwind config and JSON token export
- Full downloadable HTML design system document

Powered by Claude. Runs entirely in the browser.

---

## Resource Library

A curated set of videos, talks, and first-hand accounts. Real people showing what it means to navigate the web with a disability — not simulated, not hypothetical.

Includes: blind user comparisons of accessible vs inaccessible sites, accessibility overlay teardowns, hearing loss demonstrations, and a TED talk on why accessibility has to be designed in from the start.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Vite |
| Voice AI | ElevenLabs Conversational AI SDK |
| AI reasoning | Claude (Anthropic) |
| Testing | Playwright |

---

## Getting started

```bash
npm install
npm run dev
```

Set your ElevenLabs agent ID for the BeMyVoice experiment:

```env
VITE_ELEVENLABS_AGENT_ID=your_agent_id_here
```
