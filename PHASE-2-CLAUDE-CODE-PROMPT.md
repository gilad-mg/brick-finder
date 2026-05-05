# Brick Finder — Phase 2 (FINAL) — Claude Code Prompt

This phase delivers the complete website end-to-end in one autonomous run. It bundles three previously-planned phases into one execution:

- **Phase 1.5** — recover the WOW features that were cut from Phase 1 (3D hero brick, custom cursor, sound, easter eggs, magnetic button, polish)
- **Phase 2** — AI image search (upload a photo → identify the LEGO set)
- **Phase 3** — Price comparison (LEGO official + 3 retailers)
- **Final pass** — real Lighthouse, bundle cleanup, fix the duplicate-title bug, full QA, redeploy

---

## 1. Project to open in Cursor
`C:\projects\Personal\Lego-Website`

## 2. cd path for terminal
```
cd C:\projects\Personal\Lego-Website
```

## 3. Files to attach
- `PHASE-2-CLAUDE-CODE-PROMPT.md` (this file)
- `PHASE-1-CLAUDE-CODE-PROMPT.md` (the original Phase 1 brief — read for design system, brand, RTL rules, motion specs, autonomous-run protocol)
- `PHASE-1-DONE.md` (what shipped, what was cut, decisions made, known issues)

## 4. The prompt

---

### Context

**Phase 1 is live and production-stable** at https://brick-finder.vercel.app. Read `PHASE-1-DONE.md` first — it documents what shipped, what was deferred, the BOM bug fix, the cache versioning, and the autonomous decisions made.

You are now executing the FINAL phase. When you finish, the website is complete. The original brief — text search + AI image search + single set page with price comparison + responsive bilingual UI — must be fully delivered.

**The site is a gift for an 11-ish-year-old LEGO obsessive.** The bar is "WOW." Not "MVP." Treat every interaction as portfolio-worthy.

---

### CRITICAL — Account separation (carries over from Phase 1)

I run Twin-Ex business work on this same machine in parallel. The rules from Phase 1 still apply — re-read them in `PHASE-1-CLAUDE-CODE-PROMPT.md` under "Account separation". Summary:

- **GitHub:** active account must be `gilad-mg` (personal). Run `gh auth switch -u gilad-mg` before any push. Repo: `gilad-mg/brick-finder`. Do not touch the `Gilad-TX` work account.
- **Vercel:** never run `vercel login`/`vercel logout`. Use `VERCEL_TOKEN` from `.env.local` for every command. Scope: `gilad-projects` (personal). If `vercel whoami --token $env:VERCEL_TOKEN` returns a Twin-Ex team, STOP and write a warning to `PHASE-2-DONE.md`.
- **Env vars:** ALWAYS use Bash with `--value` for `vercel env add`, NEVER PowerShell stdin pipe. The PowerShell BOM bug from Phase 1 is documented in memory and must not recur.
- **Vercel Preview env:** the CLI cannot add Preview env non-interactively (returns `git_branch_required` even with `--yes`). Document this and instruct the user to add via dashboard. Do not block on it.

---

### Autonomous run mode

The user is launching this and walking away. Run autonomously for the full duration. Do NOT pause for confirmation. Do NOT ask questions. Make sensible decisions and document every one in `PHASE-2-DONE.md`.

- Use `--yes`, `-y`, `--force`, `-d` flags everywhere available
- If a tool fails, retry once. If still failing, log under "Issues to resolve" and continue
- For architectural choices (e.g. picking between two valid libraries), pick the more popular/maintained one and document why
- The only hard stop: if Vercel scope returns a Twin-Ex team, STOP and write a top-line warning

---

### CRITICAL — Use every relevant skill and subagent

Before writing code, read the SKILL.md of the skills below. Apply them. Re-check against them at milestones. Don't just glance.

**Always-active:** `auto-skill-router`

**Design & UI:** `user-interface`, `design:design-system`, `design:design-critique`, `design:ux-copy`, `design:accessibility-review`, `theme-factory`, `humanizer` (Hebrew + English copy)

**SEO & site quality:** `web-manager`, `marketing:seo-audit`, `marketing:brand-review`

**Engineering:** `engineering:architecture`, `engineering:system-design`, `engineering:testing-strategy`, `engineering:code-review`, `engineering:debug`, `engineering:tech-debt`, `engineering:documentation`, `engineering:deploy-checklist`

**Subagents:** `Plan` (design strategy first), `Explore` (verify file structure), `general-purpose` (research Brickognize/Brickset APIs, picking the right react-three-fiber pattern, final verification pass)

**Tools:**
- `TodoWrite` — break this phase into ~25 tasks; check off as you go
- `WebSearch` / `WebFetch` — verify Brickognize endpoint is live, check Brickset API docs, look up Next.js 16 / next-intl / Three.js current best practices
- `Grep` / `Glob` — self-verify (no `any`, no `console.log`, no leaked keys)

**Final verification:** spawn a `general-purpose` subagent to independently verify every quality gate. Do not declare done until it returns clean.

---

## SECTION 1 — Phase 1.5 (recover the deferred WOW features)

### 1.1 — 3D draggable hero brick

- Install: `npm i three @react-three/fiber @react-three/drei`
- Component: `<HeroBrick3D />` rendered in the hero section, lazy-loaded behind `next/dynamic` with `ssr: false`
- Geometry: a single 2×4 LEGO brick, low-poly (~500–800 verts total), modeled procedurally in code (8 studs on top, hollow underside not needed). Use `BoxGeometry` + `CylinderGeometry` for studs. Brick-red color matching brand `#D6232A`.
- Lighting: ambient (intensity 0.5) + directional key light + a softer fill from the opposite side. In dark mode, cooler key light + deeper shadows.
- Interaction: `OrbitControls` from drei with `enableZoom={false}`, `enablePan={false}`, drag to rotate. Auto-rotate at 0.4 rad/s when idle for >3 seconds, stop on hover/drag.
- Suspense fallback: a static SVG of a LEGO brick with a subtle pulse. The fallback also shows for `prefers-reduced-motion` users — never render the canvas if reduced motion is set.
- Mount only when in viewport (`react-intersection-observer` or native IntersectionObserver). Unmount when scrolled away to free GPU.
- Performance budget: 3D scene chunk must stay under 80KB gzipped. If over, simplify geometry or drop drei imports.
- Mobile: render at half resolution on devices with `devicePixelRatio < 2`. Disable orbit controls on touch devices smaller than 600px wide; use a slow auto-rotation only.

### 1.2 — Custom cursor (desktop only)

- Component: `<CustomCursor />`, mounted globally, conditionally rendered when `window.matchMedia("(pointer: fine)").matches`
- Two layers: a 6px brand-red stud (follows mouse 1:1) and a 24px outer ring (follows with spring physics, lag ~80ms, stiffness 300, damping 30)
- On hover over interactive elements (`a, button, [role="button"], input, [data-cursor-pointer]`): ring expands to 40px, stud fades. Use a CSS variable + `cursor: none` on these elements.
- On hover over text inputs and contenteditable: hide custom cursor, restore native caret
- Hide entirely below `lg` breakpoint (Tailwind `lg:` class) or on touch devices
- Respect `prefers-reduced-motion` — show only the small stud, no spring lag

### 1.3 — Magnetic submit button on hero search

- New component: `<MagneticButton />`, wraps any button
- On `mousemove` within a 60px radius, button translates toward cursor proportionally (max 8px offset). On mouse leave, springs back to (0,0).
- Apply to the hero search submit button. Keep all other buttons standard.

### 1.4 — Easter eggs

**Konami code (↑↑↓↓←→←→BA):**
- Global keyboard listener mounted in the root layout
- On match: `canvas-confetti` shower in brand colors for 3 seconds across the full viewport, plus a sonner toast: "You found the secret!" (HE: "מצאת את הסוד!")
- Reset after triggering; can fire again

**Logo backflip (5× clicks within 2 seconds):**
- Logo in the header tracks click count + timestamp
- 5 clicks within 2s → the logo does a 360° rotation animation (Framer keyframes, 700ms, spring)
- Plays the click sound if sound is enabled

**Master Builder (10th save):**
- Already implemented in Phase 1 — verify still works

**404 page:**
- Already implemented — verify the wiggling brick still works

### 1.5 — Sound effects (optional, toggleable, default OFF)

- Install: `npm i use-sound`
- Source CC0 sounds: 1 short "click" (LEGO snap-style, ~50ms) + 1 short "pop" (for the save confetti). Acceptable sources: Pixabay, Freesound (CC0/CC-BY 4.0). Use WebSearch to find appropriate clips, download to `public/sounds/click.mp3` and `public/sounds/pop.mp3`. Each file under 25KB.
- Component: `<SoundToggle />` — speaker icon in the header. State persisted to `localStorage` key `brickfinder:sound`. Default OFF.
- Hook into: card hover (debounced, only fires once every 200ms), save button (pop sound + click), language toggle (click), theme toggle (click), logo backflip (click)
- All sounds gated by the toggle. Volume capped at 0.4. Respect `prefers-reduced-motion` — if true, force sound OFF and disable the toggle.
- Animate the toggle: speaker icon swaps between sound-on and sound-off variants with a Framer spring scale.

### 1.6 — Title metadata bug fix

In `/en` the page title currently renders `Brick Finder · Brick Finder` (duplicate). The `generateMetadata` template likely concatenates `title` and a `siteName` even when they're equal.

- Audit `src/app/[locale]/layout.tsx` and per-page `generateMetadata`
- Rule: if the page title equals the site name, emit just the site name. Otherwise emit `${pageTitle} · ${siteName}`
- Hebrew page title `בריק פיינדר · Brick Finder` is intentional bilingual — leave it
- Verify: `curl -s https://brick-finder.vercel.app/en | grep -oE '<title>[^<]+</title>'` returns `<title>Brick Finder</title>`, not the dup

### 1.7 — Lighthouse + bundle audit

- Run `npx unlighthouse --site http://localhost:3000` against the local dev build (or Lighthouse CI against the preview)
- Goal: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on landing, search, set page, my-bricks
- If the landing JS bundle is over 250KB gzipped:
  - Move `framer-motion` imports to per-component lazy wrappers where appropriate (use `m` from Framer's `LazyMotion` + `domAnimation` features)
  - Lazy-load `@tanstack/react-query` provider on routes that need it (search, my-bricks) instead of root layout
  - Lazy-load the 3D canvas (already required), confetti, and sound module
- Save the Lighthouse JSON output under `.lighthouse/` (gitignored) and quote the headline scores in `PHASE-2-DONE.md`

---

## SECTION 2 — AI image search (Phase 2)

### 2.1 — Choose the recognition backend

Run a `general-purpose` subagent to verify which of these is currently live, free, and reliable:

1. **Brickognize** — public API at `https://api.brickognize.com/predict/` (POST multipart/form-data with `query_image` field). Returns a JSON list of probable LEGO sets/parts ranked by confidence. Free, rate-limited.
2. **Fallback A:** OpenAI Vision (gpt-4o-mini) with a structured prompt asking for a LEGO set number. Requires an `OPENAI_API_KEY`. Less accurate but always available.
3. **Fallback B:** prompt the user to "type the set number from the box" — graceful degradation.

**Default:** Brickognize. Fall back to "type set number" if Brickognize is unreachable. Don't add OpenAI unless the user has an `OPENAI_API_KEY` already in `.env.local` (check; do not invent it).

### 2.2 — Upload UI (`/he/search/image` and `/en/search/image`)

- Page title: "חיפוש לפי תמונה" / "Search by photo"
- Centered drop zone: `<UploadZone />` component
  - Drag-and-drop file upload (highlights on dragover with a brand-blue dashed border)
  - Click-to-pick file input
  - Paste image from clipboard support (`onPaste` listener, capture `e.clipboardData.items`)
  - On mobile: triggers the camera via `<input type="file" accept="image/*" capture="environment">`
- Accepted formats: `image/jpeg, image/png, image/webp, image/heic`. Max 5MB. Validate client-side, show toast on rejection.
- Preview: once an image is selected, show a thumbnail with a "Try another" button
- Compress images > 1MB to JPEG quality 0.8 / max 1280px on the longest side using `browser-image-compression` or canvas. This keeps the upload under Vercel Edge's 4.5MB body limit and speeds up Brickognize.

### 2.3 — Recognition pipeline

- Server route: `POST /api/recognize` (Node runtime, `nodejs` not edge — multipart parsing is friendlier)
- Forwards the image to Brickognize, returns the top 5 results enriched with Rebrickable data (image, name, theme, year, parts count)
- Response shape:
  ```ts
  type Recognized = {
    items: Array<{
      setNum: string;
      confidence: number; // 0..1
      name: string;
      themeName: string;
      year: number;
      numParts: number;
      imageUrl: string;
    }>;
    elapsedMs: number;
  };
  ```
- Cache identical images by hash (sha256 of bytes) for 1 hour via `unstable_cache`
- Add a 15-second timeout. On timeout or error, return a friendly error JSON; UI shows a graceful message + "type the set number instead" CTA

### 2.4 — Results UI

- Loading state: a custom Lottie or SVG of a magnifying glass scanning across a brick, with a progress bar showing "Looking for matches…" / "מחפש התאמות…". Stays visible until response.
- Results: top match shown large with confidence pill (e.g. "92% match"), 4 alternatives shown smaller below
- Click a match → navigate to `/he/sets/[setNum]` (or /en) with a Framer shared-layout transition
- "Not what you're looking for? Type the set number" link below results
- Empty / unrecognized state: animated brick shrugging + copy "Couldn't recognize this set. Try a clearer photo or type the set number." with a CTA back to text search

### 2.5 — Wire into landing page

- The "Search by photo" method card on the landing page is currently "Coming soon" — replace the badge with "Live", make the card clickable, navigate to `/[locale]/search/image`
- Add a "Search by photo" button next to the text search bar in the hero (camera icon, magnetic, opens the image upload page)

### 2.6 — Privacy

- Images are uploaded for recognition only. Never stored on our servers. Document this in a small privacy note on the upload page: "Photos are sent to our recognition partner for matching. We don't store them."
- Add to `/privacy` (new lightweight page in both locales) with the same text + Rebrickable + Brickognize attributions.

---

## SECTION 3 — Price comparison (Phase 3)

### 3.1 — Strategy

Real-time scraping of LEGO/Amazon is fragile and legally grey. Affiliate-style direct links to retailer search/product pages are robust and just as useful for the user. Optionally, integrate Brickset's free API for a ballpark "current value" if the user has registered for an API key.

**Default deliverable:** a "Where to find this set" panel on every set page with 4 retailer links, each opening that retailer's search/product page for the set number.

**Optional enhancement:** if `BRICKSET_API_KEY` is set in `.env.local`, show Brickset's stored retail price (USD/GBP/EUR) and current value in a small stat row.

### 3.2 — "Where to find this set" panel

Replace the existing "Price comparison — coming soon" placeholder on the set page with:

- A panel titled "Where to find" (HE: "איפה למצוא")
- Four cards in a 2×2 grid (mobile: stacked):
  1. **LEGO.com** — links to `https://www.lego.com/en-us/product/{setNum}` (omit the `-1` variant). If LEGO doesn't have a direct product page (retired sets), link to the global search `https://www.lego.com/en-us/search?q={setNum}`. Branded yellow/red logo.
  2. **BrickLink** — links to `https://www.bricklink.com/v2/catalog/catalogitem.page?S={setNum}-1`. Tan/orange logo.
  3. **eBay** — links to a search filtered to LEGO category: `https://www.ebay.com/sch/i.html?_nkw=lego+{setNum}&_sacat=19006`. Branded multicolor logo.
  4. **Amazon** — links to a search: `https://www.amazon.com/s?k=lego+{setNum}`. Amazon orange.
- Each card has the retailer logo (use simple-icons or hand-crafted SVGs; do not infringe brand assets — use generic versions where ambiguous), the retailer name, and a subtitle: "View on LEGO.com" etc.
- Hover: card lifts, the external-link icon does a small bounce
- All links: `target="_blank" rel="noopener noreferrer sponsored"` — `sponsored` because in the future these may be affiliate-tagged
- Add a small disclaimer below the panel: "Prices and availability vary by retailer. We don't sell sets — we link you to where to find them."

### 3.3 — Optional: Brickset stored price

- If `process.env.BRICKSET_API_KEY` is set:
  - Server-side fetch `https://brickset.com/api/v3.asmx/getSets?apiKey={key}&userHash=&params={"setNumber":"{setNum}-1"}` (Brickset's API)
  - Pull `LEGOCom.US.retailPrice`, `LEGOCom.UK.retailPrice`, `LEGOCom.DE.retailPrice` (if present). Cache 24h.
  - Render a 3-column row above the retailer panel: "MSRP US: $99.99 · UK: £89.99 · DE: €99.99" (skip currencies that aren't returned)
- If the env var is NOT set, omit this row entirely (no broken UI)
- Document in `PHASE-2-DONE.md` how to register: https://brickset.com/tools/webservices

### 3.4 — Wire into landing page

- The "Price comparison" landing card already shows a "Coming soon" badge — leave it. Price comparison is a per-set feature, not a search method, so it doesn't need its own landing slot.

---

## SECTION 4 — Final QA & redeploy

### 4.1 — Full QA pass

Spawn a `general-purpose` subagent to independently verify ALL of the following. Do not declare done until it returns clean.

**Code quality:**
- `npm run build` zero errors / warnings
- `npx tsc --noEmit` clean
- `npx eslint src --max-warnings=0` clean
- No `any` types, no `console.log`, no `// @ts-ignore`

**Performance & SEO (Lighthouse on the deployed URL, mobile + desktop):**
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95
- Landing JS bundle < 250KB gzipped (excluding lazy chunks)

**Functionality:**
- Search "train" → ≥ 20 results
- `/he/sets/10497-1` and `/en/sets/10497-1` load with full data, gallery, save button, "Where to find" panel
- Save → reload → set persists; remove → set gone
- `/api/search?q=train` returns count > 100
- `/api/recognize` accepts a multipart image POST and returns valid JSON (test with a sample LEGO box image — pick one from a public CC photo)

**WOW features:**
- 3D hero brick renders, can be dragged, has SVG fallback for reduced motion
- Custom cursor active on desktop, hidden on touch
- Magnetic search submit button works
- Konami code triggers confetti
- 5× logo click triggers backflip
- Sound toggle works, defaults OFF, persists
- Title bug fixed: `/en` returns `<title>Brick Finder</title>`

**Localization:**
- `/he` is RTL; `/en` is LTR
- Image upload page exists in both locales
- "Where to find" panel labeled correctly in both locales
- All new copy passes `humanizer` skill (no AI tells)

**Image search:**
- Drag/drop, click-pick, paste, mobile camera all work
- Compression for files >1MB
- Top match displays with confidence
- Graceful failure on unrecognized

**Price comparison:**
- All 4 retailer links open the correct URL with the right set number
- `target="_blank"`, `rel="noopener noreferrer sponsored"`
- Disclaimer present
- Brickset row only renders if `BRICKSET_API_KEY` is set

**Security & accounts:**
- Vercel scope is `gilad-projects` (not Twin-Ex)
- GitHub push went to `gilad-mg/brick-finder`
- No secrets in client bundle: `grep -r REBRICKABLE_API_KEY .next/static` returns nothing; same for `VERCEL_TOKEN` and any future `BRICKSET_API_KEY`
- `.env.local` in `.gitignore`

**Mobile:**
- 375px width: no horizontal scroll
- All CTAs reachable with thumb
- Touch targets ≥ 44×44px
- Image upload triggers camera on mobile

**Accessibility:**
- WCAG 2.1 AA color contrast on every page in both light and dark mode
- Keyboard navigation reaches every interactive element in a logical order
- All animations respect `prefers-reduced-motion`
- Focus rings visible and branded

### 4.2 — Redeploy

- Commit all changes with descriptive messages
- Push to `gilad-mg/brick-finder` main
- Trigger production deploy via `vercel deploy --prod --token "$VERCEL_TOKEN" --scope gilad-projects --yes` from Bash
- Verify the deployed URL matches the version with all new features

### 4.3 — `PHASE-2-DONE.md`

Write a comprehensive report:

- Live URL and final commit SHA
- Vercel scope confirmation
- Final Lighthouse scores (mobile + desktop) with screenshots if possible
- Bundle size breakdown
- What was built (organized by Section 1 / 2 / 3)
- All decisions made under autonomy
- Any deferred items (should be empty if the gates pass)
- Any issues to resolve (should be empty)
- A "How to extend" section: adding a new locale, swapping the recognition backend, registering for Brickset
- A note on the Vercel Preview env var (still needs dashboard step)
- Maintenance notes (rotating Rebrickable key, Vercel token)

---

### Setup tasks the user already did (do not repeat)

- `.env.local` exists with `REBRICKABLE_API_KEY` and `VERCEL_TOKEN`
- `gh auth` has both `gilad-mg` (personal, active) and `Gilad-TX` (work, idle)
- Vercel project `brick-finder` exists under scope `gilad-projects`
- GitHub repo `gilad-mg/brick-finder` exists with Phase 1 code
- Production URL `https://brick-finder.vercel.app` is live with Phase 1

### Things you should NOT do

- Do not run `vercel login` or `vercel logout`
- Do not switch the global gh auth context permanently
- Do not push to the `twin-ex` org
- Do not invent API keys (Brickset, OpenAI, etc.). Check `.env.local` for them; if absent, skip that integration with a graceful fallback documented in `PHASE-2-DONE.md`
- Do not remove or break any Phase 1 functionality

### What to deliver

1. Live production URL with all features working
2. A `PHASE-2-DONE.md` covering everything above
3. The verification subagent's clean report appended to `PHASE-2-DONE.md`

Start.
