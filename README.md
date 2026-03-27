# Sajoma Fitness

**Your Personal Wellness Coach** — A bilingual (EN/ES) iOS wellness app built with React + Vite + TypeScript + Tailwind CSS + Capacitor.

## Features

### Phase 1 (Current)
- **Exercise Tracking** — Log workouts by type, duration, calories, and intensity; Apple HealthKit integration; weekly summaries
- **Barcode Food Scanner** — Scan barcodes via camera; OpenFoodFacts API lookup; Latino/Hispanic cultural foods database
- **Push Notification Reminders** — Configurable meal, water, and workout reminders; morning wellness check-in
- **Progress Photos** — Take/upload weekly photos; before/after comparison view; local storage
- **Journaling** — Daily mood, energy, gratitude entries; rotating prompts; searchable history
- **Bilingual EN/ES** — Full Spanish translation; language toggle in settings; cultural meal database
- **Subscription Tiers** — Free / Basic Premium ($9.99/mo) / Full Premium ($14.99/mo) UI with 30-day trial messaging

### Core Features
- AI-powered meal photo analysis
- Water intake tracking
- Health metrics dashboard
- Personalized wellness tips

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS + inline styles |
| Mobile | Capacitor (iOS) |
| i18n | Custom hook + JSON translations |
| Storage | localStorage (Phase 1) |

## Bundle ID
`com.sajomafitness.app`

## Getting Started

```bash
pnpm install
pnpm dev          # Web development server
pnpm build        # Production build
npx cap sync ios  # Sync to iOS project
```

## iOS Requirements
- Xcode 14+
- iOS 13+
- CocoaPods

## Contact
info@sajomafitness.app
