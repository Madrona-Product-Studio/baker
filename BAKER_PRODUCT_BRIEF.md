# Baker — Product Brief
### A trail companion PWA for Mount Baker hikers

---

## Overview

Baker is a mobile-first Progressive Web App designed for hikers heading to Mount Baker, Washington. It solves a specific problem: the moment you need trail information most — on the mountain, mid-hike — is exactly when you have no service.

The app works in two modes: **connected** (pre-trip, at the trailhead) and **offline** (on the trail). It combines practical safety infrastructure with a lightweight social layer — crowdsourced trail conditions shared peer-to-peer between hikers, without requiring a network.

The core concept: a **trail register that lives in everyone's pocket.** Hikers coming down share what they saw. Hikers going up receive it automatically. The safety is a byproduct of the social behavior.

---

## Target Users

**Primary:**
- Casual day hikers heading to Artist Point / Heather Meadows
- Multi-day backpackers doing routes like Chain Lakes Loop or Ptarmigan Ridge

**Not (yet):**
- Backcountry skiers
- Mountaineers / technical climbers

---

## Core Design Principles

1. **Offline-first.** Every core screen must be fully functional with zero connectivity. If it breaks without service, it doesn't ship.
2. **Cache aggressively pre-trip.** The window of connectivity (parking lot, trailhead) is the moment to pull everything. Design for that handoff explicitly.
3. **Speed over richness.** Emergency screen loads in under 1 second. No exceptions.
4. **Social is the Trojan horse.** The safety layer is serious. The check-in / conditions feed is the fun part. Lead with the fun.
5. **Real data, real trails.** No lorem ipsum anywhere. Use actual Baker trail names, real waypoints, realistic mocked content.

---

## Stack

- **Framework:** Vite + React + TypeScript
- **Styling:** Tailwind v4
- **PWA:** Vite PWA plugin with service worker (cache-first strategy for app shell)
- **Storage:** localStorage for v1 (trip plans, check-ins, cached weather)
- **Geolocation:** Browser Geolocation API
- **Peer-to-peer (research spike, not v1):** MultipeerConnectivity (native) or WebRTC (web)

---

## Design Direction

**Aesthetic:** Utilitarian / field-tool. This is gear, not a lifestyle app. Think topographic maps, weathered trail signs, the inside of a Gore-Tex jacket tag. Not precious. Not Instagrammy.

**Mode:** Dark mode default. Hikers use phones in full sun and at dusk. Dark backgrounds reduce glare and battery drain.

**Color palette:**
- Background: deep slate (`#0f1318`)
- Surface: `#1c2128`
- Accent primary: Baker blue (`#4a8fa8`) — glacial, cold, clear
- Accent warning: trail amber (`#d4882a`)
- Accent danger: signal red (`#c0392b`)
- Text primary: `#e8eaed`
- Text secondary: `#8b9299`

**Typography:**
- Display / headings: `DM Mono` or `Space Mono` — utilitarian, technical, feels like a GPS readout
- Body: `IBM Plex Sans` — legible at small sizes, slightly technical character
- Load both from Google Fonts

**Motion:** Minimal. Fast transitions (150ms). No decorative animation. The one exception: the check-in submission — a brief radial pulse from the button to reinforce the "broadcasting" mental model.

**Icons:** Lucide React throughout. No custom illustrations in v1.

---

## Pages & Screens

### 1. Home (`/`)

The pre-departure hub. Loaded while still connected; everything cached for offline use.

**Elements:**
- App name + tagline: *"Know before you go. And after."*
- Offline status banner (appears automatically when connection is lost — amber, not red, not alarming)
- Weather snapshot card: current conditions at Baker, avalanche risk level, last updated timestamp
- Quick-access buttons: Start Trip Plan, View Trail Feed, Check In
- Bottom navigation (persistent across all screens)

**Behavior:**
- On load, fetch and cache: NOAA forecast for Mt. Baker (lat/lng: 48.7768, -121.8144), Northwest Avalanche Center advisory (mock for v1, real API later)
- If offline on load, show cached data with staleness warning

---

### 2. Trip Planner (`/plan`)

Set your trip before you leave. This data is what gets shared with SAR if something goes wrong.

**Form fields:**
- Route (select): Artist Point Loop, Chain Lakes Loop, Ptarmigan Ridge, Railroad Grade, Park Butte, Scott Paul Trail
- Party size (stepper: 1–12)
- Trailhead departure time (datetime picker)
- Expected return time (datetime picker)
- Emergency contact name + phone (stored locally only, never uploaded)

**Actions:**
- Save Trip Plan → persists to localStorage
- Share Trip Plan → generates a plain-text summary the user can iMessage to someone before heading up (uses native share sheet)

**Saved state:**
- If a plan exists, show it in a summary card at top with "Edit" and "Clear" options
- Timestamp of when it was saved

---

### 3. Trail Feed (`/feed`)

The social layer. Crowdsourced conditions from other hikers.

**Feed cards include:**
- Trail name + waypoint name
- Condition indicator: ✅ All good / ⚠️ Heads up / 🔴 Turn back
- Condition note (free text, max 140 chars)
- Optional photo (thumbnail, tap to expand)
- Timestamp + "X miles from trailhead" if waypoint data available
- Source badge: "Synced from nearby hiker" vs "Loaded from network"

**Mocked data to hardcode for v1 (realistic):**
```
- Chain Lakes Loop / Bagley Lakes junction — "Snow on the ridge past mile 4, microspikes helpful" — 2h ago — All good
- Artist Point / Summit overlook — "Wildflowers are insane right now, worth every step" — 4h ago — All good  
- Ptarmigan Ridge / Camp Kiser — "Strong wind above 6k, turned back at Camp Kiser" — 6h ago — Heads up
- Railroad Grade / Moraine — "Trail clear to moraine, stream crossing at mile 3 is thigh-deep" — 1d ago — Heads up
```

**Filters (top of feed):**
- All trails / My route only
- Today / This week

**Empty state:**
- "No reports yet for today. Be the first — check in on your way down."

---

### 4. Check In (`/checkin`)

The action that powers the feed. Fast, simple, designed to be used mid-hike with cold hands and a phone at 30% battery.

**Fields:**
- Current location: auto-populated from geolocation API (show lat/lng + nearest known waypoint name)
- Waypoint override: dropdown of known waypoints on user's saved route
- Condition: three large tap targets — ✅ All good / ⚠️ Heads up / 🔴 Turn back
- Note: text area, 140 char max, optional
- Photo: camera/library picker, optional, compressed client-side before storage

**Submit behavior:**
- Saves to localStorage check-ins array
- Triggers radial pulse animation on button
- Confirmation: "Check-in saved. It'll sync when you're back in range — and share automatically with nearby hikers."
- If geolocation fails: show manual waypoint selector, don't block submission

**Offline behavior:**
- Works fully offline
- Queue check-ins for upload when connectivity returns

---

### 5. Emergency (`/emergency`)

This screen must be fast, clear, and work with zero connectivity. No spinners. No fetching. Pure static + cached.

**Elements:**
- Large, high-contrast header: "EMERGENCY"
- Primary CTA: **Call 911** (tel: link, full-bleed red button)
- Secondary CTA: **Emergency SOS via Satellite** — deep link to iOS Settings > Emergency SOS, with a plain-language explanation: "iPhone 14 or later: point your phone at open sky and hold the side button"
- **Whatcom County Search & Rescue:** (360) 676-6911
- **Your Trip Plan** — displays saved trip plan in full (so user can read it to a dispatcher): route, party size, departure time, expected return, emergency contact
- If no trip plan saved: "No trip plan saved. Set one before you head out — it could save your life."
- **Your Last Known Location** — displays current GPS coordinates, updates every 30 seconds, works offline

**Design:**
- This screen uses a slightly different color treatment — darker, higher contrast, larger tap targets
- No bottom nav animation or transition on arrival — instant render

---

## Data Model (localStorage)

```typescript
// Trip plan
interface TripPlan {
  route: string;
  partySize: number;
  departureTime: string; // ISO
  expectedReturn: string; // ISO
  emergencyContactName: string;
  emergencyContactPhone: string;
  savedAt: string; // ISO
}

// Individual check-in
interface CheckIn {
  id: string;
  route: string;
  waypoint: string;
  condition: 'good' | 'heads-up' | 'turn-back';
  note: string;
  photoUrl?: string; // base64 or blob URL for offline
  timestamp: string; // ISO
  lat?: number;
  lng?: number;
  source: 'self' | 'peer' | 'network';
}

// Cached weather
interface CachedWeather {
  forecast: string;
  avalancheRisk: 'low' | 'moderate' | 'considerable' | 'high' | 'extreme';
  avalancheSummary: string;
  updatedAt: string; // ISO
}

// localStorage keys
// 'baker:tripPlan' → TripPlan
// 'baker:checkIns' → CheckIn[]
// 'baker:weather' → CachedWeather
```

---

## PWA Requirements

- **Service worker:** Cache-first strategy for all app shell assets (HTML, JS, CSS, fonts, icons)
- **Web app manifest:**
  - `name`: Baker
  - `short_name`: Baker
  - `theme_color`: `#0f1318`
  - `background_color`: `#0f1318`
  - `display`: standalone
  - `orientation`: portrait
  - Icons at 192×192 and 512×512 (placeholder icons fine for v1)
- **Offline fallback:** All five screens render with no network. Show staleness warnings where appropriate.
- **Install prompt:** Suppress default browser prompt; add a subtle "Add to Home Screen" nudge in the Home screen footer

---

## Navigation

Persistent bottom navigation bar with five items:
- 🏔 Home
- 📋 Plan
- 📡 Feed
- ✅ Check In
- 🆘 Emergency

Emergency tab uses a distinct visual treatment (red dot or different icon weight) to keep it accessible but not alarming.

Active state: Baker blue underline. Inactive: muted text.

---

## Known Trails & Waypoints (hardcode for v1)

```typescript
const TRAILS = [
  {
    id: 'artist-point',
    name: 'Artist Point Loop',
    distance: '1.5 miles',
    elevation: '200 ft gain',
    waypoints: ['Parking Area', 'Table Mountain Junction', 'Artist Point Summit', 'Huntoon Point']
  },
  {
    id: 'chain-lakes',
    name: 'Chain Lakes Loop',
    distance: '6.5 miles',
    elevation: '1,600 ft gain',
    waypoints: ['Artist Point TH', 'Bagley Lakes Junction', 'Herman Saddle', 'Hayes Lake', 'Mazama Lake', 'Iceberg Lake', 'Table Mountain Base']
  },
  {
    id: 'ptarmigan-ridge',
    name: 'Ptarmigan Ridge',
    distance: '10.5 miles RT',
    elevation: '2,200 ft gain',
    waypoints: ['Artist Point TH', 'Chain Lakes Junction', 'Open Slopes', 'Camp Kiser', 'Coleman Pinnacle']
  },
  {
    id: 'railroad-grade',
    name: 'Railroad Grade',
    distance: '8 miles RT',
    elevation: '3,900 ft gain',
    waypoints: ['Heliotrope Ridge TH', 'Hogsback', 'Moraine Edge', 'Upper Railroad Grade']
  },
  {
    id: 'park-butte',
    name: 'Park Butte Lookout',
    distance: '7.5 miles RT',
    elevation: '2,200 ft gain',
    waypoints: ['Schreibers Meadow TH', 'Morovitz Meadow', 'Mazama Park', 'Park Butte Lookout']
  },
  {
    id: 'scott-paul',
    name: 'Scott Paul Trail',
    distance: '10 miles RT',
    elevation: '1,700 ft gain',
    waypoints: ['Schreibers Meadow TH', 'Forest Section', 'Moraine Viewpoint', 'Upper Meadows']
  }
]
```

---

## V1 Scope — What's In vs Out

| Feature | V1 |
|---|---|
| All 5 screens scaffolded | ✅ |
| PWA / offline shell | ✅ |
| Trip plan (localStorage) | ✅ |
| Check-in (localStorage) | ✅ |
| Mocked trail feed | ✅ |
| Mocked weather data | ✅ |
| Real NOAA weather API | ❌ Later |
| Real avalanche API | ❌ Later |
| Peer-to-peer sync (MultipeerConnectivity / WebRTC) | ❌ Research spike |
| Auth / user accounts | ❌ Later |
| Cloud sync / backend | ❌ Later |
| Photo upload to server | ❌ Later |
| Push notifications | ❌ Later |

---

## Peer-to-Peer Sync — Research Spike (Parallel Track)

This is the differentiating feature and warrants a focused investigation alongside the build.

**Question to answer:** Can a web PWA use WebRTC or another browser primitive to broadcast check-ins to nearby devices without a server, without internet?

**Options to evaluate:**
1. **WebRTC DataChannel** — peer-to-peer, but requires a signaling server to establish connection. Works offline after handshake, but handshake needs connectivity.
2. **Web Bluetooth** — can discover and communicate with nearby devices. Limited browser support on iOS (not supported in Safari as of 2025).
3. **Web NFC** — tap-to-share, very short range. iOS support limited.
4. **Native wrapper (Capacitor or React Native)** — unlocks MultipeerConnectivity on iOS, which does true peer-to-peer Bluetooth + WiFi Direct with no server. Likely the right path if web primitives fall short.

**Recommendation:** Start with the web PWA. Plan for a Capacitor wrapper in v2 if WebRTC signaling proves too limiting.

---

## File Structure (suggested)

```
/baker
  /public
    manifest.json
    /icons
  /src
    /components
      BottomNav.tsx
      CheckInCard.tsx
      WeatherCard.tsx
      OfflineBanner.tsx
      ConditionBadge.tsx
    /pages
      Home.tsx
      Plan.tsx
      Feed.tsx
      CheckIn.tsx
      Emergency.tsx
    /data
      trails.ts        ← hardcoded trail + waypoint data
      mockFeed.ts      ← mocked check-in feed entries
      mockWeather.ts   ← mocked weather snapshot
    /hooks
      useOffline.ts    ← detects connection status
      useLocation.ts   ← geolocation wrapper
      useTripPlan.ts   ← localStorage CRUD
      useCheckIns.ts   ← localStorage CRUD
    /lib
      storage.ts       ← typed localStorage helpers
    App.tsx
    main.tsx
    index.css
  vite.config.ts
  tsconfig.json
  package.json
  BRIEF.md            ← this file
```

---

## First Commands for Claude Code

```
1. Initialize Vite + React + TypeScript project named "baker"
2. Install: tailwindcss@next, vite-plugin-pwa, react-router-dom, lucide-react
3. Configure Tailwind v4, PWA manifest, service worker
4. Build all 5 pages with bottom navigation
5. Implement localStorage hooks for trip plan and check-ins
6. Wire up geolocation in Check In screen
7. Add offline detection banner
8. Populate with mocked trail data and feed entries
9. Verify all screens render correctly with network disabled in DevTools
```

---

*Brief version 1.0 — May 2026*
*Ready for Claude Code implementation*
