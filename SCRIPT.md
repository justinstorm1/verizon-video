# Priority 5G — Voiceover Script

2026 Verizon Smart Campus Innovation Challenge (NJIT) · Round 1 concept-pitch video (2:00 max)

Total: 277 words · 118 seconds (1:58) at ~155 words per minute.

Timestamps match auto-play mode (press **A**). If you click through manually instead, use them as pacing targets.

## 1. Title  ·  0:00–0:08  (8s)

Hi! For the Verizon Smart Campus Challenge, our concept is Priority 5G: guaranteed campus 5G, by subscription.

## 2. The problem  ·  0:08–0:23  (15s)

Picture game day at NJIT. Thousands of phones join one cell and the network crawls. Card readers time out. Live streams freeze. Every failure costs something: a sale, a stream, a grade, or a safety call.

## 3. The gap  ·  0:23–0:39  (16s)

Verizon already has the fix: network slicing. Its Frontline slice keeps first responders connected, and rivals like T-Mobile now sell slicing on business plans. But nothing is built for a student, a family, or a food truck's lunch rush.

## 4. The solution: plans  ·  0:39–0:56  (17s)

Priority 5G changes that. Pick a plan online: Individual at twelve dollars a month, Family at thirty-five, Small Business at fifty-nine. Each includes everyday priority, plus boost hours with a real speed and latency guarantee, and upgrades for more speed or time.

## 5. Demo: simulated lunch rush  ·  0:56–1:07  (11s)

Here's a simulated lunch rush. The regular network climbs to one hundred sixty-two milliseconds. The food truck's boost holds at eighteen, inside its guarantee.

## 6. Fairness: the obvious question  ·  1:07–1:22  (15s)

Isn't that just normal 5G? No. Guarantees are capped at thirty-five percent of each cell, so regular users always keep sixty-five. Full plans get a waitlist, and a boost that won't fit is refused, never silently slowed.

## 7. How it works  ·  1:22–1:33  (11s)

Under the hood, admission control sells seats only while they fit, Verizon's standalone core enforces each slice, and monitoring refunds any boost hour that misses its guarantee.

## 8. Why it matters to Verizon  ·  1:33–1:45  (12s)

For Verizon, that's recurring revenue from slicing it already has: a simulated one point two million dollars in year one across twenty-five sites, plus a pipeline of enterprise leads.

## 9. Our ask + close  ·  1:45–1:58  (13s)

We're asking Verizon for slicing on two NJIT cells: a sixteen-week pilot with about sixty subscribers. Priority 5G: guaranteed 5G, for everyone on campus. Thank you!

---

## Delivery notes

- On slides 3, 6, 7 and 9, items appear on screen as you say them, timed to this script. If you click through manually and get ahead, pressing → once shows everything left on the slide, and pressing it again goes to the next slide.
- Say the numbers the way they're written here ("one hundred sixty-two milliseconds", "one point two million").
- Slide 5: start talking as the lines begin to draw. The chart finishes at about 8 seconds, right when you say "inside its guarantee."
- Slide 9: leave about 2 seconds of silence after "Thank you" so the video doesn't cut off mid-word.
- If you naturally talk faster or slower, change `const SPEED = 1;` in `public/pitch/deck.js` (for example 1.1 is 10% faster) so the on-screen reveals keep pace. Auto-play slide timings are set by `data-dur` on each slide in `index.html`.
