# Accessibility Awareness Project

**An accessible news site with a conversational AI voice assistant — built to make the web actually usable for blind and visually impaired people.**

Hold Space. Ask a question. Navigate by voice.

---

## What it does

This project combines a voice-navigated news reader with hands-on disability simulations and educational resources — all built around one idea: accessibility shouldn't be an afterthought.

The news reader lets you hold Space to speak with an AI assistant that orients you to the page, reads articles, describes images, and navigates the site through natural conversation. No screen-reader required.

The accessibility demo section lets sighted users experience the web through impaired vision, motor control, and cognitive load simulations — making the stakes of inaccessible design tangible.

---

## Features

### Voice-navigated news
- **Hold Space to speak** — conversational AI powered by ElevenLabs
- **AI page orientation** — on load, the assistant describes where you are and what's available
- **Voice navigation** — "take me to the next article", "go back home", "what's on this page"
- **Article reading and Q&A** — ask the assistant to read, summarise, or answer questions
- **Image descriptions** — AI-generated alt text spoken on request
- **Status pill** — visual indicator shows assistant state (idle / listening / thinking / speaking)

### Disability simulations
- Blurred and tunnel-vision overlays simulating visual impairment
- Motor control simulation with cursor lag and tremor
- Cognitive load simulation with distractions and reduced contrast

### Resources
- Curated educational content on accessibility standards, tools, and best practices
- Links to WCAG guidelines, testing tools, and advocacy organisations

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

Set your ElevenLabs agent ID:

```env
VITE_ELEVENLABS_AGENT_ID=your_agent_id_here
```

---

## Why it matters

Screen readers narrate *everything* before you reach the content you came for. This project explores a different model: an assistant that waits for your questions rather than dumping the whole page at you. Combined with the simulation demos, it's meant to shift accessibility from a compliance checkbox to something you actually feel.
