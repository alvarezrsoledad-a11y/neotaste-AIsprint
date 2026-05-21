# NeoTaste Sprint Context
*Briefing document for prototype development. Last updated: May 20, 2026.*

---

## 1. The Challenge

NeoTaste is a restaurant discovery and deals app (primary markets: Germany, UK, Netherlands, Austria) where discovery is currently driven by functional tools — location, filters, cuisine type, deal type. It works, but it's transactional: users find deals, not restaurants they're genuinely excited about. They browse in isolation, cross-check on Google Maps before committing, and rarely return between deal-seeking sessions. The sprint challenge is to design a lightweight social discovery layer that helps users find restaurants through people they trust — friends, community signals, crowd behaviour — without adding complexity to the core deal and booking experience. The primary user is the Explorer: Gen Z / younger millennial, city-based, food-curious, social by nature. The north star KPI is **bookings per user per month** — the most direct measure of whether social signals are closing decisions, not just creating ambient engagement.

---

## 2. Committed Concept Direction

**Concept statement:** The social layer helps NeoTaste users choose restaurants with confidence by surfacing the most trusted available signal for each restaurant — friend proof first, community proof second, crowd proof as baseline — inside the discovery flow they're already in.

This is not a social feed. It is not a friends tab. It is trust signals embedded in the existing map, home feed, and restaurant detail page — encountered mid-task, not in a detour.

---

## 3. Core User Flow (Entry to Exit)

```
Onboarding (Steps 1–7)
  → Step 5: Geolocation — activates neighbourhood community signals immediately
  → Step 6: Contacts sync — seeds friend graph before first session
  → Step 7: Notifications — enables ambient pull between sessions
  → Edge case: zero contacts found → invite screen ("Invite friends, get free months")

Home feed (first screen after onboarding)
  → With friends: "Your friends' top picks" carousel (friend pull quote + avatar)
  → Without friends: "Hot in your area" carousel (community proof fills immediately, no empty state)

Discovery — Map view (primary entry point for social discovery)
  → Social cue tooltip on map pins: white pill = friend proof, grey pill = everything else
  → One cue per pin, highest-available tier only
  → List view slides up from bottom, carries same hierarchy

Restaurant detail page (where hesitation lives)
  → Reviews section defaults to "Your Friends" filter chip
  → "All people" available as secondary option
  → Filter chip hidden if user has no friends on platform

Book deal → Booking confirmation
  → "Share with a friend" prompt at confirmation (secondary share moment)

Bookings tab → Slide to redeem → Post-redemption screen (exit)
  → "Share with friends" — one tap, peak emotion
  → Share becomes friend proof signal in recipient's home feed and map
  → Flywheel closes: share → friend proof → next Explorer's discovery
```

---

## 4. Key Design Decisions

**One signal per surface, highest-available tier only.**
Trust signals are only useful when their source is legible. Stacking signals (friend visited + 12 people this week + trending) creates noise; the user ignores all of them. One pill, one source, enforced by design. The user always knows what she's looking at and why it should matter.

**Social signals are ambient, not destination-based.**
The Friends tab exists for connection management only — it is not where the social layer lives. Placing social signals in a separate tab creates a bolt-on that only the most motivated users ever reach. The map, home feed carousels, and restaurant detail reviews are where the Explorer already is.

**Share at post-redemption, not earlier.**
Peak emotion is the moment after redeeming a deal, not after booking. Earlier share prompts (booking confirmation) are lower-stakes — included as a secondary touch but not the primary flywheel close. One tap, immediate, no compose step.

**Reviews default to "Your Friends" filter.**
The detail page is where decisions get made or abandoned. Defaulting to friend reviews — even if there are none yet — primes the Explorer to register that social context exists, and surfaces it the moment it becomes available. "All people" is one tap away.

**Onboarding as infrastructure, not setup.**
The 7-step onboarding is not just account creation. Each permission step powers a different layer of the social experience. Contacts seeds the graph. Geolocation activates community signals. Notifications create re-engagement. Every permission skipped doesn't just remove a feature — it degrades the layer it was meant to power.

---

## 5. Cold Start Approach

Cold start is the default state for most new users. Three mechanisms handle it in sequence:

1. **Contacts synced at onboarding Step 6** — friend graph seeded before the user sees a single screen of the app. Compresses the empty-network window significantly.
2. **Community proof activates immediately from geolocation** — "8 people tried this week in Mitte" requires zero friends. Available from session one.
3. **No empty states** — the home feed never shows an empty "Your friends' top picks" section. If friend data isn't available, the section doesn't render. Community proof fills the layout. The user never sees a prompt to "add friends to see their picks."

Zero-contacts edge case: if Step 6 returns no matches, an invite screen appears before the home feed — "Invite friends. Get free months" with Share, Copy link, and Show QR options.

---

## 6. Constraints and Things to Avoid

**Hard constraints (non-negotiable):**
- Build within the existing NeoTaste experience — core navigation, deal flow, and booking stay intact
- No video feed — explicitly ruled out by NeoTaste
- Must work for users with 0 friends on the platform
- Mobile-first, iOS patterns (~70% iPhone users): tab bar bottom, modal sheets from bottom with grabber, 44pt touch targets, safe areas respected
- No features requiring heavy moderation or complex recommendation algorithms

**Design guardrails:**
- No full profile pages or complex friend management — this is not Instagram
- Never stack multiple social signals on a single card or map tooltip
- Every signal must be source-legible — no vague labels like "popular with people like you"
- Recency matters: "last week" is more useful than undated signals
- Social signals must support the deal and restaurant information, not compete with it

**Deliberately excluded (do not reintroduce without strong rationale):**
- Taste tags at onboarding — permission cost too high before user has seen value
- Tag-based reviews — contribution overhead the current flow doesn't support
- Reactions on restaurants — amplifies a flywheel that first needs to be started
- Badges — crosses into obligation; revisit after contribution loop is validated
- Booking confirmation as primary discovery moment — wrong emotional stage

**Signal hierarchy (reference for any UI showing social data):**

| Tier | Example | When shown |
|---|---|---|
| Friend proof | "2 friends visited" / friend avatar + pull quote | Friend has visited; shown first where available |
| Community proof | "8 people tried this week" | No friend data; geolocation active |
| Crowd proof | "3k+ redemptions" | Baseline — always available |
| Novelty / Ranked | "Rising this week" | New restaurants or rising momentum |
