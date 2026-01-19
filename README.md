# Explain to Me

An AI-powered learning app with animated visualizations. Search any topic and get explanations with scroll-triggered animations.

## Features

- 🔍 Search any topic
- 📊 5 depth levels (Novice → Professional)
- 📏 3 length options (Brief, Medium, Comprehensive)
- 🎨 Animated visualizations (SVG, Canvas, Lottie)
- 🔑 Bring your own Anthropic API key

## Setup

### 1. Get an API Key

Get your Anthropic API key from: https://console.anthropic.com/

### 2. Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and add your API key in Settings.

## Build APK

### Option A: GitHub Actions (Recommended)

1. Push this code to a GitHub repository
2. Go to Actions tab → "Build Android APK"
3. Click "Run workflow"
4. Download the APK from Artifacts

### Option B: Android Studio

1. Copy project to a computer with Android Studio
2. Run:
```bash
npm install
npm run build
npx cap sync android
```
3. Open `android/` folder in Android Studio
4. Build → Build Bundle(s) / APK(s) → Build APK(s)

## Tech Stack

- Next.js 16 (Static Export)
- TypeScript
- Tailwind CSS
- Framer Motion
- GSAP
- Lottie Web
- Claude API (Anthropic)
- Capacitor (Android)

## License

MIT
