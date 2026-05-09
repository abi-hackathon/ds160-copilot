# DS-160 Copilot

> AI-powered preparation tool for the US DS-160 Nonimmigrant Visa Application

**Live Demo:** https://ds160-copilot.vercel.app

---

## The Problem

The DS-160 is a 40+ page US visa application form — entirely in English, with strict formatting requirements, and zero guidance for first-time applicants. One wrong answer can delay or reject your application.

Most applicants are non-native English speakers filling out a government form they've never seen before.

**I built this because my mom needed help filling out her DS-160.**

---

## The Solution

DS-160 Copilot is a **generative UI** form preparation tool. Upload your passport, and Claude guides you through the form field by field — rendering the right widget for each section automatically.

### How it works

1. **Upload passport photo** → Claude vision extracts 10 fields automatically (name, DOB, passport number, place of issue, dates)
2. **Agent guides you** through each DS-160 section using purpose-built widgets
3. **Download a PDF worksheet** with everything pre-filled and ready to enter at ceac.state.gov

---

## Architecture
Passport Image → Claude Vision → Zustand Store → useCopilotReadable
↓
Deterministic Engine
↓
Agent decides how to ask
↓
Widget renders in chat

**Key design decision:** A deterministic next-field engine decides *what* to ask next. The Claude agent decides *how* to ask it. This is controlled generative UI — not open-ended chat.

### Pattern used
`useCopilotAction` + `renderAndWaitForResponse` — controlled generative UI, not Open Generative UI.

---

## Widgets

| Widget | DS-160 Section | Fields |
|--------|---------------|--------|
| `PassportExtractor` | Personal Info 1 | 10 fields via Claude vision |
| `PassportWidget` | Passport | Type, number, dates, place |
| `PurposeOfTripWidget` | Travel Information | Visa type, arrival, address, payer |
| `TravelHistoryTable` | Previous US Travel | Visits, visa history, refusals |
| `PersonalInfoCard` | Personal Info Review | Verify/correct extracted data |
| `SubmissionSummary` | Final Review | PDF worksheet download |

---

## Tech Stack

- **Next.js 16** — App Router, TypeScript, Tailwind CSS
- **CopilotKit v1.50** — `useCopilotAction`, `useCopilotReadable`, `BuiltInAgent`
- **Anthropic Claude Sonnet** — Vision extraction + agent reasoning
- **Zustand** — Form state management
- **@react-pdf/renderer** — PDF worksheet generation
- **Vercel** — Deployment

---

## Running Locally

```bash
git clone https://github.com/abi-hackathon/ds160-copilot
cd ds160-copilot
npm install
```

Create `.env.local`:
ANTHROPIC_API_KEY=your-api-key-here

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Built For

**AI Tinkerers Atlanta Hackathon — May 2026**

Solo build · 5 days · First hackathon

---

## Disclaimer

This tool is for preparation purposes only. Users must enter their information directly into the official DS-160 form at [ceac.state.gov](https://ceac.state.gov). This is not an official US government product.
