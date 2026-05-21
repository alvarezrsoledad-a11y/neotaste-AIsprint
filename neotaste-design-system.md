# NeoTaste Design System Reference
*Extracted from 🟢 Neotaste Base Design System — Figma file key: WPqPBBhgsZcnHNv2pIv7QH*
*Last extracted: May 20, 2026*

---

## How to use this file

This document is the single source of truth for building NeoTaste sprint screens. Every value here is pulled directly from the Figma variables and text styles — not approximated. When in doubt between a semantic token and a base token, always use the semantic one (e.g. `Background/Brand/Default` not `Green/400*`).

---

## 1. Color System

### 1a. Base Palette

The palette has six named color families plus grey and opacity utilities. Asterisked shades (e.g. `400*`) are the key reference stops in each ramp.

#### Green — Primary brand family
The core NeoTaste identity color. The 400 stop is the primary CTA, active states, and brand accent throughout the app.

| Token | Hex | Visual |
|---|---|---|
| Green/50 | `#EEFEF4` | Near-white mint tint — almost never used directly |
| Green/100 | `#D8FFE7` | Very pale green — subtle backgrounds |
| Green/200 | `#BAFAD4` | Light green — disabled CTA backgrounds, subtle tints |
| Green/300 | `#79FCAD` | Soft green |
| **Green/400*** | **`#53F293`** | **Primary brand green — CTA fills, active nav icons, brand highlights** |
| Green/500 | `#3EE380` | Darker CTA — hover/pressed state on primary buttons |
| Green/600 | `#28CE6A` | |
| Green/700 | `#219750` | |
| Green/800 | `#145B32` | |
| Green/900 | `#11301D` | **Border/Strong** — active input borders, focus rings, validation |
| Green/950 | `#08180F` | Near-black green — inverse backgrounds |

#### Mustard — Accent / Loyalty family
Used exclusively for the loyalty/accent tier. Never use as a general-purpose colour.

| Token | Hex | Visual |
|---|---|---|
| Mustard/50 | `#FEFDE8` | |
| Mustard/100 | `#FFFBC2` | Accent button disabled state |
| **Mustard/200*** | **`#FFF592`** | **Accent CTA fill (Primary Accent button) — loyalty, rewards contexts** |
| Mustard/300 | `#FFE645` | Accent button hover/pressed |
| Mustard/400 | `#FCD413` | |
| Mustard/500 | `#ECBB06` | Level 05 badge background |
| Mustard/600 | `#CC9102` | |
| Mustard/700 | `#A26706` | |
| Mustard/800 | `#86510D` | |
| Mustard/900 | `#724211` | |
| Mustard/950 | `#432205` | |

#### Mango — Level 03 / Accent family
Warm orange. Used for specific content badges (Level 03, Top 10 tag).

| Token | Hex | Visual |
|---|---|---|
| Mango/50 | `#FFF8EB` | |
| Mango/100 | `#FEEAC6` | |
| **Mango/200*** | **`#FFC86A`** | **Top 10 tag background** |
| Mango/300 | `#FFB64A` | |
| Mango/400 | `#FF9B20` | |
| Mango/500 | `#F97607` | Level 03 badge background |
| Mango/600 | `#DD5202` | |
| Mango/700 | `#B73506` | |
| Mango/800 | `#94280C` | |
| Mango/900 | `#7A220D` | |
| Mango/950 | `#460E02` | |

#### Strawberry — Error / Destructive family
Exclusively for error states, validation failures, and destructive actions. Never use decoratively.

| Token | Hex | Visual |
|---|---|---|
| Strawberry/50 | `#FEF2F2` | Error input background tint |
| Strawberry/100 | `#FEE2E2` | |
| Strawberry/200 | `#FFC9C9` | |
| Strawberry/300 | `#FDA4A4` | |
| Strawberry/400 | `#FA6F6F` | |
| **Strawberry/500*** | **`#F24141`** | **Error text, error borders, error icons, delete/destructive actions** |
| Strawberry/600 | `#DF2323` | |
| Strawberry/700 | `#BC1919` | |
| Strawberry/800 | `#9B1919` | |
| Strawberry/900 | `#811B1B` | |
| Strawberry/950 | `#460909` | |

#### Spirulina — Level 02 / Informational family
Sky blue. Used for Level 02 badges, verified creator checkmarks, informational contexts.

| Token | Hex | Visual |
|---|---|---|
| Spirulina/50 | `#EFF8FF` | |
| Spirulina/100 | `#DFF0FF` | |
| Spirulina/200 | `#B8E3FF` | Level 02 confetti/subtle background |
| Spirulina/300 | `#78CDFF` | |
| **Spirulina/400*** | **`#24AFFF`** | **Level 02 badge background, verified checkmark fill** |
| Spirulina/500 | `#069AF1` | |
| Spirulina/600 | `#007ACE` | |
| Spirulina/700 | `#0061A7` | |
| Spirulina/800 | `#02528A` | |
| Spirulina/900 | `#084572` | |
| Spirulina/950 | `#062B4B` | |

#### Grey — Neutral family
The workhorse of the UI. Used for backgrounds, surfaces, text, dividers.

| Token | Hex | Visual |
|---|---|---|
| Grey/50 | `#FAFAFA` | Lightest surface — rarely used directly |
| Grey/100 | `#F5F5F5` | Card backgrounds, input backgrounds, secondary CTAs |
| Grey/200 | `#E5E5E5` | Medium surface, input borders at rest, dividers |
| Grey/300 | `#D4D4D4` | Strong surface |
| Grey/400 | `#A3A3A3` | Level 04 badge, placeholder icons |
| Grey/500 | `#737373` | Tertiary text (metadata, secondary labels) |
| Grey/600 | `#525252` | |
| Grey/700 | `#404040` | |
| Grey/800 | `#262626` | |
| Grey/900 | `#171717` | |
| Grey/950 | `#0A0A0A` | Primary text — near-black, all body copy and headings |

#### Opacity Utilities
Used for overlays, scrim layers, and semi-transparent surfaces. Not for text or interactive fills.

| Token | Value | Use |
|---|---|---|
| Black-Opacity/05 | `rgba(0,0,0,0.05)` | Softest border (secondary border) |
| Black-Opacity/10 | `rgba(0,0,0,0.10)` | Default card/input border |
| Black-Opacity/20 | `rgba(0,0,0,0.20)` | |
| Black-Opacity/30 | `rgba(0,0,0,0.30)` | |
| Black-Opacity/40 | `rgba(0,0,0,0.40)` | |
| Black-Opacity/50 | `rgba(0,0,0,0.50)` | Disabled text |
| Black-Opacity/60–100 | — | Scrim overlays, modals |
| White-Opacity/20 | `rgba(254,254,254,0.20)` | Ticker button default; Tertiary button hover/pressed |
| White-Opacity/30 | `rgba(254,254,254,0.30)` | Inverse secondary border |
| White-Opacity/35 | `rgba(254,254,254,0.35)` | Tertiary button fill |
| White-Opacity/70 | `rgba(254,254,254,0.70)` | Inverse primary border; disabled text on dark |
| White-Opacity/100 | `#FEFEFE` | White — base app background, inverse text |
| Green-Opacity/10 | `rgba(83,242,147,0.10)` | Brand button hover/pressed on flash cards |
| Green-Opacity/20 | `rgba(83,242,147,0.20)` | Border on flash deal cards; overlay on brand bg |
| Green-Opacity/50 | `rgba(83,242,147,0.50)` | Brand disabled state |

---

### 1b. Semantic Color Tokens

Semantic tokens alias base palette values into named usage slots. Always use these in components — they're what the design system enforces.

#### Background tokens

| Token | Resolves to | Hex | What it's for |
|---|---|---|---|
| Background/Neutral/Base | White-Opacity/100 | `#FEFEFE` | Default app background — the main canvas behind all screens |
| Background/Neutral/Surface/Default | Grey/100 | `#F5F5F5` | Cards, secondary CTA fills, input field backgrounds, alternative section backgrounds |
| Background/Neutral/Surface/Medium | Grey/200 | `#E5E5E5` | Mid-weight surface — segmented control tracks, image placeholders |
| Background/Neutral/Surface/Strong | Grey/300 | `#D4D4D4` | Heavy surface, pressed states on neutral elements |
| Background/Brand/Default | Green/400* | `#53F293` | Primary CTA buttons, highlights, active tab fill |
| Background/Brand/Strong | Green/500 | `#3EE380` | Primary CTA hover and pressed state |
| Background/Brand/Subtle | Green/200 | `#BAFAD4` | Disabled CTA background |
| Background/Accent/01/Default | Mustard/200* | `#FFF592` | Loyalty-related accent CTA fill (Primary Accent button) |
| Background/Accent/01/Strong | Mustard/300 | `#FFE645` | Accent button hover and pressed |
| Background/Accent/01/Subtle | Mustard/100 | `#FFFBC2` | Accent button disabled |
| Background/Accent/02 | Mango/200* | `#FFC86A` | Top 10 tag background |
| Background/Accent/03 | Spirulina/400* | `#24AFFF` | Verified checkmark / creator badge |
| Background/Inverse/Ground/Default | Green/500 | `#3EE380` | Inverse (dark-on-green) background — flash deal cards |
| Background/Inverse/Ground/Strong | Green/900 | `#11301D` | Inverse background darker — Promo button context |
| Background/Inverse/Neutral/Default | Grey/100 | `#F5F5F5` | Inverse background context |
| Background/Inverse/Neutral/Subtle | Grey/100 | `#F5F5F5` | Secondary button on inverse bg, hover (web only) |
| Background/Overlay/White/Default | White-Opacity/20 | `rgba(254,254,254,0.20)` | Ticker button default; Tertiary button hover & pressed |
| Background/Overlay/White/Subtle | White-Opacity/35 | `rgba(254,254,254,0.35)` | Tertiary button fill |
| Background/Overlay/Black/Default | Black-Opacity/10 | `rgba(0,0,0,0.10)` | Button on flash deals card |
| Background/Overlay/Black/Subtle | Black-Opacity/85 | `rgba(0,0,0,0.85)` | Button hover/pressed (web only) |
| Background/Overlay/Brand/Default | Green-Opacity/20 | `rgba(83,242,147,0.20)` | Button on flash deals card |
| Background/Overlay/Brand/Strong | Green-Opacity/10 | `rgba(83,242,147,0.10)` | Button hover/pressed on flash cards |
| Background/Levels/Level 01/Subtle | Green/200 | `#BAFAD4` | Confetti / subtle Level 01 indicator |
| Background/Levels/Level 01/Default | Green/400* | `#53F293` | Level 01 badge background |
| Background/Levels/Level 02/Subtle | Spirulina/200 | `#B8E3FF` | Confetti / subtle Level 02 indicator |
| Background/Levels/Level 02/Default | Spirulina/400* | `#24AFFF` | Level 02 badge background |
| Background/Levels/Level 03/Subtle | Mango/200* | `#FFC86A` | Confetti / subtle Level 03 indicator |
| Background/Levels/Level 03/Default | Mango/500 | `#F97607` | Level 03 badge background |
| Background/Levels/Level 04/Subtle | Grey/200 | `#E5E5E5` | Confetti / subtle Level 04 indicator |
| Background/Levels/Level 04/Default | Grey/400 | `#A3A3A3` | Level 04 badge background |
| Background/Levels/Level 05/Subtle | Mustard/200* | `#FFF592` | Confetti / subtle Level 05 indicator |
| Background/Levels/Level 05/Default | Mustard/500 | `#ECBB06` | Level 05 badge background |

#### Foreground (text & icon) tokens

| Token | Resolves to | Hex / Value | What it's for |
|---|---|---|---|
| Foreground/Primary | Grey/950 | `#0A0A0A` | All primary text and icons — body copy, headings, primary UI labels. 19:1 contrast (AAA) |
| Foreground/Secondary | Black-Opacity/70 | `rgba(0,0,0,0.70)` | Supporting text — menu items, placeholders, metadata. 4.14:1 contrast (AA) |
| Foreground/Tertiary | Grey/500 | `#737373` | Low-emphasis text — captions, hints. No accessibility requirement enforced |
| Foreground/Disabled | Black-Opacity/50 | `rgba(0,0,0,0.50)` | Inactive/disabled UI text and icons. WCAG 2.1 inactive component exemption |
| Foreground/Brand | Green/400* | `#53F293` | Brand-colour icons and text — active tab bar icons, nav highlights on light backgrounds |
| Foreground/Brand/Disabled | Green-Opacity/50 | `rgba(83,242,147,0.50)` | Brand element disabled state |
| Foreground/Inverse | White-Opacity/100 | `#FEFEFE` | Text and icons on dark/inverse backgrounds |
| Foreground/Inverse-Disabled | White-Opacity/70 | `rgba(254,254,254,0.70)` | Disabled text on dark/inverse backgrounds |
| Foreground/Error | Strawberry/500* | `#F24141` | Error messages, validation text, error icons |

#### Border tokens

| Token | Resolves to | Value | What it's for |
|---|---|---|---|
| Border/Primary | Black-Opacity/10 | `rgba(0,0,0,0.10)` | Default border on cards, input fields, buttons, dividers — the most-used border in the app |
| Border/Secondary | Black-Opacity/05 | `rgba(0,0,0,0.05)` | Softer structural borders, subtle separators |
| Border/Strong | Green/900 | `#11301D` | Active/focused input fields, focus rings, validation states |
| Border/Inverse Primary | White-Opacity/70 | `rgba(254,254,254,0.70)` | Primary borders on dark/inverse backgrounds |
| Border/Inverse Secondary | White-Opacity/30 | `rgba(254,254,254,0.30)` | Secondary borders on dark backgrounds |
| Border/Inverse Strong | White-Opacity/100 | `#FEFEFE` | Strong borders on dark backgrounds |
| Border/Error | Strawberry/500* | `#F24141` | Error state on input fields and validation |
| Border/Brand | Green-Opacity/20 | `rgba(83,242,147,0.20)` | Border on flash deal cards |

---

## 2. Typography

**Single font family throughout:** Poppins. No exceptions.

The scale is divided into five categories: Display, Heading, Paragraph, Label, and Action. Each serves a distinct role in the visual hierarchy.

### Type scale

| Style | Size | Line Height | Weight | Tracking | Role |
|---|---|---|---|---|---|
| **Display/Large** | 52px | 60px | Bold | −0.3% | Hero moments only — splash screens, major onboarding steps |
| **Display/Medium** | 44px | 52px | Bold | −0.3% | Large feature titles |
| **Display/Small** | 36px | 44px | Bold | 0 | Section hero headings |
| **Heading/H1** | 32px | 38px | Bold | 0 | Screen-level titles (e.g. "Explore", "Your Bookings") |
| **Heading/H2** | 28px | 34px | Bold | 0 | Major section headings |
| **Heading/H3** | 24px | 30px | Bold | 0 | Card-level headings, modal titles |
| **Heading/H4** | 20px | 26px | Bold | 0 | Restaurant name on cards, primary item labels |
| **Heading/H5** | 16px | 20px | Bold | +0.25px | Sub-section labels, filter group titles |
| **Paragraph/Large** | 18px | 28px | Medium | 0 | Long-form body copy, restaurant descriptions |
| **Paragraph/Medium** | 16px | 24px | Medium | 0 | Standard body text, list item descriptions |
| **Paragraph/Small** | 14px | 20px | Medium | 0 | Supporting info — cuisine type, distance, metadata |
| **Paragraph/Small/Bold** | 14px | 20px | Bold | 0 | Emphasised small text — deal names, price highlights |
| **Paragraph/XSmall** | 12px | 18px | Medium | 0 | Timestamps, fine print, secondary tags |
| **Label/Large** | 16px | 20px | SemiBold | 0 | Primary button labels, important form labels |
| **Label/Medium** | 14px | 18px | SemiBold | 0 | Secondary button labels, chip text, filter labels |
| **Label/Small** | 12px | 16px | SemiBold | 0 | Badge text, small tag labels, tab labels |
| **Action/Medium** | 16px | 16px | SemiBold | 0 | CTA button text — line height equals font size (no extra leading) |
| **Action/Small** | 14px | 14px | SemiBold | 0 | Small button text — line height equals font size |

### Key type decisions to carry into sprint screens

- **Action styles have tight line heights** (equal to font size). This is intentional — button text should not wrap.
- **Paragraph styles use 1.4–1.55× line height** — generous for readability in feed contexts.
- **Restaurant card names** → Heading/H4 (20px Bold).
- **Deal/price labels** → Paragraph/Small/Bold or Label/Medium.
- **Map pin text / social signal pills** → Label/Small (12px SemiBold) — fits the pill width.
- **Review text in detail page** → Paragraph/Small (14px Medium).
- **Filter chip labels** → Label/Medium (14px SemiBold).
- **Tab bar labels** → Label/Small (12px SemiBold).

---

## 3. Spacing

One scale, eight steps. All gaps between components must come from these values.

| Token | px | Use |
|---|---|---|
| Space/XS | 4px | Inline spacing between icon and text (e.g. leading icon in a label) |
| Space/S | 8px | Tight internal padding — pill tags, chips, badge internals |
| Space/M | 12px | Standard internal padding — list row vertical padding, card section gaps |
| Space/L | 16px | Primary layout spacing — card internal padding, form field vertical padding |
| Space/XL | 24px | Section-to-section gaps, between card groups, modal internal sections |
| Space/2XL | 32px | Large section breaks, modal top/bottom padding |
| Space/3XL | 48px | Major structural separations — onboarding step spacing |
| Space/4XL | 64px | Hero section padding, very large visual breathing room |

**Spacing rhythm in practice:**
- Card internal padding: 16px (Space/L)
- Gap between stacked cards in a list: 12px (Space/M)
- Gap between section header and first card: 16px (Space/L)
- Tab bar internal spacing: 8px (Space/S) between icon and label
- Social signal pill internal padding: 8px horizontal, 4px vertical (Space/S + Space/XS)

---

## 4. Border Radius

Full radius scale — the pill shape is defined by radius-4XL (9999px).

| Token | px | Typical use |
|---|---|---|
| Radius/None | 0px | Square images, table cells |
| Radius/XS | 4px | Small tags, inline badges, chips within a tight context |
| Radius/S | 8px | Input fields, small cards, contextual tooltips |
| Radius/M | 12px | Standard cards (secondary), bottom sheet handles, segmented controls |
| Radius/L | 16px | Primary cards (restaurant cards, deal cards), modal sheets |
| Radius/XL | 24px | Large cards, prominent modal containers |
| Radius/2XL | 32px | Extra-large modals, bottom sheets |
| Radius/3XL | 48px | Very rounded containers |
| Radius/4XL | 9999px | **Pill shape** — all buttons, filter chips, social signal tooltips, avatar rings |

**What this means in practice:**
- Restaurant cards → Radius/L (16px)
- All buttons → Radius/4XL (fully pill-shaped)
- Filter chips → Radius/4XL (pill)
- Social signal pill on map pins → Radius/4XL (pill)
- Input fields → Radius/S (8px) or Radius/M (12px)
- Bottom sheets / modal drawers → Radius/XL (24px) top corners, square bottom

---

## 5. Border Widths

Three widths only.

| Token | px | Use |
|---|---|---|
| border-S | 1px | Default border on cards, buttons, input fields at rest, dividers |
| border-M | 2px | Emphasis borders — active states, focused inputs |
| border-L | 4px | Strong emphasis — focus rings in accessibility contexts |

**Rule:** Most UI uses border-S (1px) with `Border/Primary` (black-opacity/10). Active input fields switch to border-M or border-L with `Border/Strong` (Green/900 `#11301D`).

---

## 6. Visual Patterns from Screen Examples

These are observed patterns from the component library — use them as implementation rules for sprint screens.

### Restaurant cards

- **Background:** Background/Neutral/Surface/Default (`#F5F5F5`) or white
- **Border:** 1px (border-S) `Border/Primary` (rgba 0,0,0,0.1)
- **Corner radius:** Radius/L (16px) — consistent across all card types
- **Food image:** Full-bleed at top of card, inherits card's top radius. Aspect ratio approximately 16:9 or 4:3.
- **Deal badge:** Overlaid on image, bottom-left or top-right. Uses accent background (Mustard for loyalty, Mango for Top 10) with bold label text
- **Restaurant name:** Heading/H4 (20px Bold), Foreground/Primary
- **Metadata line** (cuisine · distance · rating): Paragraph/Small (14px Medium), Foreground/Secondary or Foreground/Tertiary
- **Price/deal info:** Paragraph/Small/Bold (14px Bold), Foreground/Primary or brand green
- **Card padding:** Space/L (16px) on all sides of the text content area
- **Shadow:** Subtle — cards sit on grey surface backgrounds rather than relying on strong drop shadows

### Buttons

Six button variants, all using the pill shape (Radius/4XL):

| Variant | Fill | Text | When to use |
|---|---|---|---|
| **Primary** | Background/Brand/Default `#53F293` | Foreground/Primary `#0A0A0A` | Main CTA — "Book", "Redeem", "Continue" |
| **Primary Accent** | Background/Accent/01/Default `#FFF592` | Foreground/Primary `#0A0A0A` | Loyalty/accent CTA — rewards, loyalty tier actions |
| **Primary Inverse** | Background/Inverse/Ground/Strong (dark green) | Foreground/Inverse `#FEFEFE` | CTA on light-coloured or green backgrounds |
| **Promo** | Background/Inverse/Ground/Strong + green border | Foreground/Inverse `#FEFEFE` | Flash deal cards only — on inverse/dark backgrounds |
| **Secondary** | Background/Neutral/Surface/Default `#F5F5F5` | Foreground/Primary `#0A0A0A` | Secondary actions — "Cancel", "Later", alternative options |
| **Tertiary** | Transparent | Foreground/Primary `#0A0A0A` | Low-emphasis text links, supporting actions |
| **Ghost** | Transparent + error border | Foreground/Error `#F24141` | Destructive actions only — "Delete account", irreversible removes |

**Button text:** Action/Medium (16px SemiBold) for standard size, Action/Small (14px SemiBold) for compact. Line height equals font size — no wrapping.

**Button states:** default → hover (stronger fill) → pressed (strongest fill) → disabled (subtle tint, 50% opacity text).

### Bottom navigation (tab bar)

- Standard iOS bottom tab bar pattern
- 44px+ touch targets per iOS HIG
- Active icon/label: Foreground/Brand (`#53F293` green)
- Inactive icon/label: Foreground/Tertiary (`#737373`)
- Tab label: Label/Small (12px SemiBold)
- Background: Background/Neutral/Base (white) with subtle top border
- Safe area insets applied below the bar

### Filter chips

- Pill-shaped (Radius/4XL), compact
- Fill: Background/Neutral/Surface/Default or transparent with border
- Border: 1px `Border/Primary`
- Text: Label/Medium (14px SemiBold)
- Internal padding: Space/S (8px) vertical, Space/M (12px) horizontal
- Active state: green fill + dark text
- Examples in the design: "% Filters", "% Now", "% Cuisine", "% Sort", "% Flash Deals", "% Loyalty"
- **Sprint note:** The "Your Friends" / "All people" review filter chips on the detail page follow exactly this pattern

### Input fields (forms)

- **Types:** Standard text, phone (with country flag selector), numeric
- **Corner radius:** Radius/S (8px) or Radius/M (12px)
- **Border:** 1px (border-S) `Border/Primary` at rest
- **Active/focused:** 2px (border-M) `Border/Strong` (Green/900 `#11301D`)
- **Error state:** 1px `Border/Error` (Strawberry/500 `#F24141`), error text in Foreground/Error below field
- **Fill:** Background/Neutral/Surface/Default (`#F5F5F5`)
- **Placeholder text:** Foreground/Tertiary (`#737373`)
- **Filled text:** Foreground/Primary (`#0A0A0A`)
- **Disabled:** Foreground/Disabled (Black-Opacity/50), no interaction

### List rows

- Icon (24px) + Title (Paragraph/Medium or Label/Medium) + optional subtitle (Paragraph/Small, Foreground/Secondary)
- Right element options: chevron (navigation), radio button, toggle switch, checkbox
- Divider between rows: 1px `Border/Primary` (Black-Opacity/10)
- Minimum row height: 44px (iOS touch target requirement)
- Internal padding: Space/M (12px) vertical, Space/L (16px) horizontal

### Tooltip — map pin trust signals (component `Tooltip`, node 8072:11759)

The existing component used on map pins. Pill-shaped, dark background, green dot anchor. All 6 types share the same background colour — there is no white pill variant.

**Background:**
- Default state → `Grey/500` = `#737373`
- Selected state → `Grey/600` = `#525252`

**Shape:** Full pill — `rounded-[100px]` (equivalent to Radius/4XL)

**Anchor dot (below pill):** `Background/Brand/Default` = `#53F293`, with `Background/Brand/Strong` = `#3EE380` border, 8px circle

**Drop shadow:** `0px 12px 8px rgba(10,13,18,0.08), 0px 4px 3px rgba(10,13,18,0.03)`

**Text:** Poppins SemiBold, 10px, `Foreground/Inverse` = `#FEFEFE`

**Internal padding:** 4px all sides (Space/XS)

**6 types and what they render inside the pill:**

| Type | Content | Notes |
|---|---|---|
| **Friends** | Avatar image(s) (16px circle, white border) + green count badge | Count badge: `Background/Brand/Default` `#53F293` when selected, `Background/Brand/Subtle` `#BAFAD4` when default |
| **Redemption** | 🔥 3k+ (emoji + text) | Crowd proof baseline |
| **Rating** | ⭐ + score e.g. 3.9 | Star icon + Poppins SemiBold 10px |
| **Community** | 👥 8 Tried (emoji + text) | Community proof |
| **Ranking** | `#1` chip inside pill | Chip fill: `Mango/200` `#FFC86A`, text `Foreground/Primary` `#0A0A0A`, Poppins Bold 10px, radius 8px |
| **New** | `NEW` chip inside pill | Chip fill: `Foreground/Primary` `#0A0A0A`, text `Background/Neutral/Base` `#FEFEFE`, Poppins Bold 10px, radius 8px |

---

### TrailingTag — card/feed trust signals (component `TrailingTag`, node 8057:13203)

The existing component used on restaurant cards in the home feed and list view. Rounded rectangle (not pill), colour-coded by signal tier.

**Shape:** `rounded-[8px]` = Radius/S = 8px

**Internal padding:** 2px vertical × 6px horizontal (Space/XS × Space/S)

**Font:** Poppins Bold, 10px, line-height 12px

**3 types:**

| Type | Background | Text colour | Default label |
|---|---|---|---|
| **Friends** | `Strawberry/100` = `#FEE2E2` (soft pink/rose) | `Foreground/Primary` `#0A0A0A` | 💕 2 Friends visited |
| **Community** | `Spirulina/100` = `#DFF0FF` (soft blue) | `Foreground/Primary` `#0A0A0A` | 👥 8 people tried this week |
| **Redemption** | `Black-Opacity/50` = `rgba(0,0,0,0.5)` (dark semi-transparent) | `Foreground/Inverse` `#FEFEFE` | 🔥 3k+ redemptions |

**Signal hierarchy in practice:** Show Friends TrailingTag when friend data exists. Fall back to Community, then Redemption. Never show more than one per card.

### Overall spacing rhythm

- **Screen edge margins:** 16px (Space/L) left and right on all full-width layouts
- **Between stacked cards:** 12px (Space/M) gap
- **Between section header and first card:** 16px (Space/L)
- **Section-to-section:** 24px (Space/XL)
- **Icon-to-label gap:** 4px (Space/XS) tight, 8px (Space/S) comfortable
- **Card internal sections:** 12px (Space/M) between image and text block, 8px (Space/S) between text lines

### Image handling

- All food images are full-bleed within their container — no inset padding
- Images clip to the container's corner radius (no separate image radius)
- For cards: top-left and top-right corners rounded to Radius/L (16px), content below is square — achieved by applying radius only to the image container top
- Overlay text on images uses White-Opacity/80–100 backgrounds on the text chip, not direct text-over-image
- Image placeholder background: Background/Neutral/Surface/Medium (`#E5E5E5`)

---

## 7. Quick Reference Card (for sprint use)

```
BRAND COLORS
├── Primary brand green:    #53F293  (Green/400*)
├── Accent/loyalty yellow:  #FFF592  (Mustard/200*)
├── Error red:              #F24141  (Strawberry/500*)
└── Active border green:    #11301D  (Green/900)

TEXT
├── Primary text:           #0A0A0A  (Grey/950)
├── Secondary text:         rgba(0,0,0,0.70)
├── Tertiary/metadata:      #737373  (Grey/500)
└── Inverse text:           #FEFEFE  (White)

SURFACES
├── App background:         #FEFEFE  (White)
├── Card/input bg:          #F5F5F5  (Grey/100)
├── Divider/border:         rgba(0,0,0,0.10)
└── Active input border:    #11301D  (Green/900)

SPACING CHEAT SHEET
├── XS=4  S=8  M=12  L=16  XL=24  2XL=32  3XL=48  4XL=64

RADIUS CHEAT SHEET
├── Cards: 16px (L)
├── Pills/buttons/chips: 9999px (4XL)
├── Inputs: 8–12px (S–M)
└── Bottom sheets: 24px (XL) top corners

BORDER WIDTHS
├── Default: 1px
├── Active/focus: 2px
└── Strong: 4px

FONT: Poppins only
├── Headings: Bold
├── Body/Paragraph: Medium
├── Labels/Actions/Buttons: SemiBold

TRUST SIGNAL COMPONENTS
Map Tooltip (all types):
├── Default bg:      #737373  (Grey/500)
├── Selected bg:     #525252  (Grey/600)
├── Text:            #FEFEFE  (Inverse)
├── Anchor dot:      #53F293  (Brand/Default)
└── Font:            Poppins SemiBold 10px

Card TrailingTag:
├── Friends:         #FEE2E2 bg  (Strawberry/100) — dark text
├── Community:       #DFF0FF bg  (Spirulina/100)  — dark text
└── Redemption:      rgba(0,0,0,0.5) bg            — white text
    Font:            Poppins Bold 10px, radius 8px
```

---

*Source: Figma file WPqPBBhgsZcnHNv2pIv7QH — Foundation page. Variables extracted via Figma Plugin API. Trust signal components verified against nodes 8072:11759 and 8057:13203.*
