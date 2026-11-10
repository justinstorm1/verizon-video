# Priority 5G: Round 1 pitch deck (web)

A 9-slide presentation website for the **NJIT × Verizon Smart Campus Innovation Challenge 2026**, Round 1 video concept pitch (2:00 max, due **Nov 12, 2026, 11:59 p.m.**).
Pillar: **Next-Gen Products & Services to Enhance Customer Experience**.
Content comes from the team's concept site, https://verizon-gamma.vercel.app.

```
verizonvideo/
├── SCRIPT.md               voiceover script with timestamps (277 words, 1:58)
├── app/page.tsx            home page, redirects to the deck
└── public/pitch/
    ├── index.html          the slides
    ├── deck.js             navigation, animation, auto-play
    ├── notes.html          speaker-notes window (opened from the deck with N)
    └── assets/             official Verizon logo and photos
```

**Run it:** `npm run dev`, then open http://localhost:3000 in **Google Chrome** (it goes straight to the deck).
**Or with no server:** double-click `public/pitch/index.html`. The deck is fully self-contained.
**Deploy:** it ships with the Next app (for example on Vercel) at `/` and `/pitch/index.html`.

## Before you record

1. **Add your team (optional).** In `public/pitch/index.html`, find `const TEAM = "";` near the bottom and type your team name and members, for example
   `const TEAM = "Team Highlanders · A. Rivera, S. Kim, J. Patel";`. It appears under the pillar on the title slide. If you leave it empty, the line is hidden.
2. Read `SCRIPT.md` aloud once or twice. It's written to fit the timings exactly.

## Record it (Mac)

**Option A: Auto-play (easiest, timing is guaranteed).**
1. Open the deck in Chrome and press **F** for fullscreen.
2. Start your recorder. QuickTime: File → New Screen Recording → Options → Microphone: your mic. OBS also works.
3. Press **A**. A 3-2-1 countdown plays, then the slides advance on the script timing (1:58 total) and stop on the last slide.
4. Read the script as the slides change. Trim the countdown off the start of the video.

**Option B: You control the pace.**
1. Open the deck and press **N**. The speaker-notes window opens with the current line, the next line, a per-slide timer and a 2:00 total timer. Allow pop-ups if Chrome asks.
2. Move the notes window to a second screen, or beside the slides, and record **only the slide window**.
3. Press **→** or **Space** to advance. The arrow keys work from either window, so you can keep focus on the notes.

On slides 3, 6, 7 and 9, items appear as you say them, timed to the script. In manual mode, if you get ahead, the first **→** shows everything left on the slide and the second moves on. If you talk faster or slower than the script, change `const SPEED = 1;` in `public/pitch/deck.js` (1.1 = 10% faster).

Each slide's animation replays every time you land on it. If you stumble, press **←** then **→** (or **R**) and say the line again.

## Controls

| Key | Action |
|---|---|
| → / Space / click | Next slide (shows any remaining items first) |
| ← | Previous slide |
| 1–9 | Jump to a slide |
| F | Fullscreen |
| N | Speaker-notes window |
| A | Auto-play recording run (A again stops it) |
| P | Pause / resume auto-play |
| R | Replay the current slide's animation |
| B | Show / hide the auto-play progress bar (hidden by default) |
| H or ? | Help overlay |

The mouse cursor hides itself after 1.5 seconds, so it won't show in the recording.

## What's on each slide

| # | Slide | Judging criterion it serves |
|---|---|---|
| 1 | Title and pillar | Presentation |
| 2 | The problem: crowds break the network. Real stat: Verizon planned for 50+ TB per stadium per match at World Cup 2026 | Impact, Content |
| 3 | The gap: slicing is proven (Verizon Frontline) and rivals are moving (T-Mobile SuperMobile), but nothing is built for students, families and campus sellers | Content, Creativity |
| 4 | Plans: $12 / $35 / $59, everyday priority + guaranteed boost hours | Creativity |
| 5 | Animated demo: regular network climbs to 162 ms, boost holds at 18 ms | Content |
| 6 | Fairness: 35% cap, 65% kept for everyone, waitlists, no silent slowdowns (synced to the voiceover) | Feasibility |
| 7 | How it works: 4 steps (plan, admission control, Verizon 5G SA core, SLA monitoring), production path via network APIs | Feasibility |
| 8 | Business value: $1.2M simulated year one, 10% from upgrades, 225 leads | Impact |
| 9 | The ask: slicing access on two NJIT cells for a 16-week pilot; targets; closing line | Feasibility, Impact |

## Accuracy notes

- Plans, prices, network numbers and business figures are the concept's **illustrative, simulated** values from the source site. The slides label them that way, because the scoring guide rewards honest, well-researched content.
- Real-world claims, each cited on its slide:
  - **Slide 2:** Verizon planned for more than 50 TB of data per stadium per match at FIFA World Cup 2026 and added an estimated 3–5× capacity (Verizon press release, April 16, 2026). These were Verizon's own projections, so the slide says "planned for".
  - **Slide 3:** the Verizon Frontline Network Slice, a 5G slice for public safety, expanded to 5G standalone devices nationwide (Verizon press release, April 23, 2026).
  - **Slide 3:** T-Mobile SuperMobile, a business phone plan with a nationwide 5G network slice (T-Mobile press release, August 27, 2025). Because of this, the deck doesn't claim small businesses can't buy slicing. It claims nothing is *built for* students, families and campus sellers.

## Image credits

Files are in `public/pitch/assets/`. All photos and the logo come from Verizon's official media library, verizon.com/about/news/media-resources:

| File | Verizon asset |
|---|---|
| `vz-wordmark-white-tight.svg` | New Verizon Logo Pack (2024), white solid wordmark. Only the empty margin around the logo was trimmed; the artwork is unchanged. |
| `tower.jpg` | Verizon Macro Cell Tower |
| `stadium-bowl.jpg`, `stadium-speedtest.jpg`, `network-racks.jpg` | Allegiant Stadium Verizon B-Roll |
| `vz-engineer.jpg` | Verizon technician tests 5G service in Houston |
| `retail.jpg` | Verizon Customer Experience |
| `technicians.jpg` | Technicians Installing 5G Node |

Verizon's media-library terms limit these assets to editorial use and allow resizing only, which is all that was done here. Since the video goes to Verizon's own competition, that should be fine; if in doubt, confirm with the competition contact.
