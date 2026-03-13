# Calorie Buddy

A social calorie tracker built with React + Vite. Track your daily intake alongside a friend for mutual accountability on a calorie-deficit lifestyle.

---

## Features

- **Personal dashboard** — daily calories consumed vs. your goal, deficit badge, and progress bar
- **Food logging** — search 60+ foods or enter manually; quick-add chips for common items; vegan filter toggle
- **Friend linking** — share a daily sync code with your friend; paste theirs to see their stats side-by-side
- **History** — 7-day bar chart (yours + friend's), weekly summary, and daily breakdown
- **Offline-ready PWA** — installable on iOS and Android, works without an internet connection

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & run locally

```bash
git clone https://github.com/sbullocks/calorie_tracker.git
cd calorie_tracker
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## How to Use

### First launch

1. Enter your name and daily calorie goal
2. For a 500 cal/day deficit, set your goal ~500 below your TDEE (Total Daily Energy Expenditure)

### Logging food

1. Tap the **Log** tab
2. Search for a food by name — matching items appear in a dropdown with calorie counts
3. Adjust the calorie value if needed and tap **+ Add Entry**
4. Or use the **Quick Add** chips for one-tap logging of common foods
5. Toggle **🌱 Vegan** to filter the food list to plant-based items only
6. Tap ✕ on any entry to remove it

### Linking a friend

Because this app has no backend, sharing works via a daily sync code:

1. You and your friend both install the app
2. Go to the **Friend** tab
3. Tap **Copy My Code** and send it to your friend (text, email, etc.)
4. Your friend pastes your code into their **Paste Friend's Code** box and taps **Link Friend**
5. Repeat in reverse so you both have each other's codes
6. Refresh your code each day so your friend always sees your latest data

### Viewing progress

- **Home** tab shows today's intake vs. goal and a side-by-side friend comparison
- **History** tab shows a 7-day bar chart — your green bars alongside your friend's blue bars, plus a weekly deficit summary

---

## Installing on Your Phone (PWA)

### Android

1. Open the deployed URL in Chrome
2. Tap the **"Add to Home Screen"** banner or use the browser menu → Install App

### iOS

1. Open the deployed URL in Safari
2. Tap the **Share** button → **Add to Home Screen**
3. Tap **Add** — the app appears on your home screen like a native app

---

## Development

```bash
npm run dev             # start dev server
npm run build           # production build → dist/
npm run preview         # preview the production build locally
npm run generate-icons  # regenerate PWA icons (public/icons/)
```

---

## Project Structure

```
src/
  constants/
    foods.js            # food database with vegan flags
    storageKeys.js      # localStorage key constants
  utils/
    helpers.js          # date formatting, calColor, sumCal
    storage.js          # load/save localStorage wrappers
    shareCode.js        # encode/decode friend sync codes
  hooks/
    useCalorieStore.js  # all app state and handlers
  components/
    ProgressBar.jsx
    Onboarding.jsx
    Dashboard.jsx
    FoodLog.jsx
    FriendScreen.jsx
    History.jsx
    NavBar.jsx
  App.jsx
  main.jsx
  index.css
scripts/
  generate-icons.cjs    # generates PNG icons for PWA manifest
```

---

## Tech Stack

- [React 19](https://react.dev) — functional components and hooks
- [Vite 8](https://vite.dev) — build tool and dev server
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app) — service worker and PWA manifest
- `localStorage` — persistent storage, no backend required
