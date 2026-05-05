# Brick Finder — Phase 1 (MVP) — Claude Code Prompt

## 1. Project to open in Cursor
`C:\projects\Personal\Lego-Website`

## 2. cd path for terminal
```
cd C:\projects\Personal\Lego-Website
```

## 3. Files to attach
- `PHASE-1-CLAUDE-CODE-PROMPT.md` (this file)
- `logo.png` (the round Brick Finder patch logo)
- `logo-clean.png` (the white-background logo)

## 4. The prompt

You are building **Brick Finder** — a clean, fast website to search any LEGO set ever made.

**Context:** This is a personal gift for my girlfriend's little brother — a LEGO-obsessed kid. The site has to make him say **WOW** the first time he sees it. Visual design, animations, and micro-interactions are first-class deliverables, not nice-to-haves. "Simple architecture, stunning surface" is the rule: keep the code path simple (no auth, no DB), but pour creative energy into every pixel and every interaction. Treat this as an Awwwards-caliber portfolio piece.

### CRITICAL — Use every relevant skill and subagent

Before writing any code, **read the SKILL.md of every skill below** and follow their guidance throughout the build. Don't just glance — actually apply them. Use them again as checkpoints during and after the build.

**Always-active routing skill (must run first on every step):**
- `auto-skill-router` — let it route each subtask to the right specialist skill

**During design and UI build:**
- `user-interface` — Tailwind, responsive design, dark mode, animations, accessibility, design tokens, typography, spacing
- `design:design-system` — consistent component variants and states
- `design:ux-copy` — every button label, empty state, error message, tooltip
- `theme-factory` — apply a coherent theme across the whole site
- `humanizer` — strip AI-style writing from every visible string in **both Hebrew and English**

**During SEO and metadata work:**
- `web-manager` — full website-quality framework (CWV, trust elements, IA, mobile, schema)
- `marketing:seo-audit` — keyword targeting, meta tags, schema markup, sitemap, robots.txt

**During engineering:**
- `engineering:architecture` — record the key decisions (Next.js 16 App Router, no DB, localStorage, Rebrickable wrapper)
- `engineering:system-design` — API design, data flow, caching strategy
- `engineering:testing-strategy` — what to test (Rebrickable wrapper, save/remove flow, locale switch)
- `engineering:debug` — when something breaks during build
- `engineering:code-review` — self-review every meaningful change before committing
- `engineering:tech-debt` — flag and avoid debt as you go
- `engineering:documentation` — write a real README and inline docs
- `engineering:deploy-checklist` — run the full checklist before pushing to Vercel

**Before declaring done:**
- `design:accessibility-review` — WCAG 2.1 AA audit on landing, search, set page, my-bricks
- `design:design-critique` — final pass on hierarchy, consistency, polish
- `marketing:brand-review` — voice and consistency check on all visible copy

**Subagents to call when the work fits them:**
- `Plan` agent — to design the implementation strategy before scaffolding
- `Explore` agent — to verify file structure and find anything you misplaced
- `general-purpose` agent — for multi-step research (e.g. picking the right Next.js i18n pattern, comparing image-search APIs for Phase 2 prep)

**Tooling rules:**
- Use the **TodoWrite/TaskCreate** tools to track progress through the build — break Phase 1 into ~15 tasks and check them off as you go
- Use **WebSearch / WebFetch** when you need current info on Next.js 16, next-intl, shadcn, Rebrickable endpoints, or Vercel deploy quirks — don't rely on memory for fast-moving libs
- Use **Grep / Glob** to verify your own work (no hardcoded keys, no `any` types, no `console.log` left in)

**Final verification before saying done:**
Spawn a verification subagent (Task tool, `general-purpose`) to independently check:
1. Build passes with zero TS/ESLint errors
2. All pages load on the Vercel preview
3. Lighthouse scores meet the gates (Perf ≥90, A11y ≥95, SEO ≥95)
4. Hebrew RTL flips correctly on every page
5. Save → reload → set persists; remove → set gone
6. No API key leaks to client bundle (grep for `REBRICKABLE_API_KEY` in `.next/static`)

If any check fails, fix it before reporting completion.

### Goal of this phase (Phase 1 — MVP only)
Ship a beautiful, responsive site with:
1. A landing page with the Brick Finder brand
2. Text search across all LEGO sets (by set number, name, or theme)
3. A search results page with pagination
4. A single-set page with images, theme, year, parts count, and a link to building instructions
5. A bilingual Hebrew/English toggle (Hebrew default, RTL)
6. **No login.** A simple "Save to my list" button on each set that stores set numbers in `localStorage`, plus a `/my-bricks` page that reads from `localStorage` and shows the saved sets.

**Do NOT build in this phase:** AI image search, price comparison. Those are later phases.

### Tech stack (use exactly this)

**Core:**
- **Next.js 16** (App Router) + **TypeScript strict mode**
- **Tailwind CSS v4**
- **shadcn/ui** for base components
- **Rebrickable API** as the data source — https://rebrickable.com/api/v3/docs/
- **next-intl** for Hebrew/English
- Deploy: **Vercel**
- **No backend, no database, no auth.** Pure Next.js + Rebrickable.

**Animation & motion (mandatory — pick the right one per use case):**
- **Framer Motion (`motion`)** — primary animation library for React components, page transitions, gesture handling, layout animations, AnimatePresence
- **GSAP** + **ScrollTrigger** — for scroll-based timelines on the landing page (hero parallax, scroll-tied reveals)
- **@studio-freight/lenis** — buttery smooth scrolling site-wide
- **canvas-confetti** — celebratory bursts (saving a set, a milestone)
- **lottie-react** — for any pre-made Lottie animations (loading state, empty states)
- **`prefers-reduced-motion`** — respect it everywhere. Provide a calm fallback for users who disable motion. This is non-negotiable a11y.

**3D (use thoughtfully — only where it earns the page weight):**
- **@react-three/fiber** + **@react-three/drei** — for the hero, render an animated 3D LEGO brick (low-poly, ~500 verts) that the user can drag to rotate. Lazy-load this so it doesn't block first paint.
- Fallback: a static gorgeous SVG/PNG for low-end devices and prefers-reduced-motion users

**UI polish:**
- **`sonner`** — beautiful toast notifications (saved, removed, errors)
- **`vaul`** — drawer for mobile filter/menu
- **`lucide-react`** — icons
- **`tailwindcss-animate`** + **shadcn motion variants** — quick utility animations
- **`@tanstack/react-query`** — client-side data fetching for `/my-bricks` and search-as-you-type, with optimistic updates and skeletons

**Sound (subtle, optional, toggleable):**
- **`use-sound`** — small click sound when saving a set (LEGO brick snap), soft hover "tick" on cards. Default OFF, with a toggle in the header. Save preference to localStorage.
- Source 1–2 royalty-free LEGO-style click samples from Pixabay or Freesound (CC0). Place in `public/sounds/`. Keep total sound payload under 50KB.

### Brand
- **Name:** Brick Finder
- **Tagline (EN):** "Find any LEGO set, fast"
- **Tagline (HE):** "מצא כל סט לגו, מהר"
- **Logo:** the attached round patch (use the clean-background version `logo-clean.png` for the header; the round patch for favicon and footer)
- **Colors (extract from logo):**
  - Primary blue: `#1E5FA8`
  - Accent red: `#D6232A`
  - Background: `#F7F8FA`
  - Text: `#0E1A2B`
- **Font:** Inter (Google Fonts) — clean, modern. For Hebrew use Heebo or Rubik (also Google Fonts).
- **Vibe:** modern, clean, playful, premium. Lots of whitespace. Round corners on cards (`rounded-2xl`). The site should feel like Apple's product pages had a baby with the LEGO brand — clean and aspirational, not childish.

### Dark mode (mandatory)

The site supports both **light** and **dark** mode with a smooth animated toggle in the header.

- Use `next-themes` (`npm i next-themes`) with shadcn's CSS-variable theming
- Default theme: **system** (follows OS preference). Falls back to light if undetectable.
- Persist user choice in `localStorage` (next-themes handles this)
- Toggle is a sliding sun/moon icon button in the header — animate the icon swap with Framer Motion
- Toggling triggers a smooth color transition site-wide (300ms `ease-out` on background and surface colors). Use CSS variables so the transition is automatic.
- Both themes get full design polish — dark mode is NOT just inverted colors. Re-tune contrasts, shadows become more diffuse, accent colors slightly desaturated for comfort.
- The 3D hero brick has slightly different lighting in dark mode (cooler key light, deeper shadows)
- All Lighthouse and accessibility checks must pass in BOTH modes

**Dark palette:**
- Background: `#0A0F1C` (near-black with blue undertone)
- Surface: `#121A2C`
- Primary blue: `#3B82F6` (brighter for contrast)
- Accent red: `#EF4444`
- Text: `#E5EAF3`
- Muted text: `#8A93A8`

### Reference quality bar (study before building)

The bar is **Awwwards Site of the Day**. Look at and emulate the polish of:
- **Linear.app** — micro-interactions, gradient backgrounds, button states
- **Stripe.com** — scroll-based animations, hero quality
- **Apple.com product pages** — scroll storytelling, image transitions
- **LEGO.com** — brand confidence, photography use, color
- **Vercel.com** — typography, spacing, dark/light feel
- **Brickognize.com** — for the LEGO image-search aesthetic (Phase 2 reference)

Use **WebFetch** to actually look at these sites and extract concrete design patterns before building. Don't guess.

### Design excellence & wow factor (mandatory specs)

These are not optional flourishes. They are the spec.

**Global motion system:**
- Standard durations: `fast` 150ms, `base` 250ms, `slow` 400ms, `dramatic` 700ms
- Standard easing: `ease-out` for enters, `ease-in` for exits, `cubic-bezier(0.34, 1.56, 0.64, 1)` for playful spring overshoots (use sparingly on save/celebrate)
- Every interactive element responds to hover, focus, and active with motion (not just color)
- Scrolling is smooth (Lenis), with momentum on touchpads
- Page transitions use `AnimatePresence` — soft fade + 8px slide

**Hero section (landing page) — this is the WOW moment:**
1. **3D animated LEGO brick** that the kid can grab and spin with mouse/touch (react-three-fiber). Auto-rotates slowly when idle. Lazy-loaded behind a Suspense boundary with a static fallback image.
2. **Logo entrance:** on first load, the round logo fades in with a slight scale-up from 0.95 → 1, with a subtle 3D tilt that responds to mouse position (parallax)
3. **Tagline animation:** characters of the tagline fade-up word-by-word with 50ms stagger
4. **Search bar:**
   - Glassmorphic background with subtle backdrop blur
   - Animated placeholder that cycles through example searches every 3s with a typewriter effect: "Galaxy Explorer" → "Star Wars" → "10497" → "rocket"
   - Magnetic hover on the submit button (button gently follows the cursor within a 30px radius)
   - On focus: the bar glows with the brand-blue ring, scales up 1.02
5. **Background:** a very subtle floating-bricks particle layer (10–15 large LEGO studs drifting slowly, low opacity ~6%, blurred). NOT distracting. Pause the animation when off-screen.
6. **Scroll cue:** an animated chevron at the bottom that bounces gently to invite scroll

**Search-method cards (3 cards on landing):**
- On hover: card lifts up 8px, shadow deepens, the icon inside does a 360° flip
- The "Coming soon" badges have a soft pulsing glow
- On click of the live one (text search): smooth scroll to the search bar with a focus ring

**Featured sets grid (8 sets on landing):**
- Cards animate in on scroll with a 60ms stagger (Intersection Observer + Framer)
- Each card has a 3D tilt on hover (max 6° rotateX/rotateY, subtle, with shine highlight following the cursor)
- Image inside scales 1.05 on hover with a smooth 400ms transition
- Card click → navigate to `/sets/[setNum]` with a shared-element layout transition

**Search results page:**
- **Search-as-you-type** with 300ms debounce. Results refresh in place with `AnimatePresence` exit/enter — old cards fade out, new cards fade in with stagger.
- Cards animate in with the same staggered fade-up
- Pagination is animated (numbers slide)
- Skeleton loaders use a brick-pattern shimmer (custom skeleton, not the default gray rectangle)
- Empty state: a Lottie animation of a magnifying glass with no result + friendly copy

**Single-set page:**
- **Image gallery:** main image takes 50% of viewport width on desktop. Thumbnails below. Click a thumbnail → main image cross-fades. Keyboard arrows navigate. Click main image → opens fullscreen lightbox (use a custom Framer-powered modal, not a heavy lib).
- **Hover on the main image:** subtle 3D tilt with shine effect (tilt follows cursor)
- **Stats bar:** parts count, year, minifig count animate from 0 → final value over 800ms when scrolled into view (use Framer's `useMotionValue` + `useTransform` + intersection observer)
- **Save button:**
  - Heart icon outline by default
  - On click: heart fills with a brick-red color, scales 1.0 → 1.4 → 1.0 with spring, AND triggers a `canvas-confetti` burst of small LEGO-stud-shaped confetti pieces (use custom shape function)
  - Toast appears: "Saved to My Bricks!" with the set name
  - Subtle click sound (if sound is enabled)
- **Section reveals:** as the user scrolls, each section (image, stats, instructions, related) fades+slides in
- Background: a very subtle gradient that shifts based on the dominant color of the set's image (use `react-extract-colors` or hardcode a palette)

**My Bricks page (`/my-bricks`):**
- **Empty state:** a Lottie animation of LEGO bricks tumbling, plus copy "Your collection is empty — go find some bricks!" and a CTA button
- **Populated state:** cards animate in with a "wall building" effect — each brick lands from above with a slight bounce, staggered 80ms apart
- **Remove button:** click triggers a "shatter" animation — the card scales down and fragments into ~6 brick pieces that fall off-screen (use Framer with custom keyframes), then list re-flows
- Total saved counter at the top with an animated number

**Header & navigation:**
- Header is sticky, with a backdrop-blur that intensifies as the user scrolls
- Logo on the left animates a tiny brick "click" rotation on logo click (acts as home link)
- Language toggle: animated EN/HE pill that slides between options
- Sound toggle: speaker icon, toggles sound effects globally
- Mobile: hamburger opens a `vaul` drawer with smooth slide-up

**Cursor (desktop only):**
- Replace the default cursor with a **custom cursor**: a small LEGO-stud circle (6px) plus a larger ring (24px) that lags slightly with spring physics
- On hover over interactive elements (buttons, links, cards), the ring expands to 40px and the stud disappears
- On hover over the search input, cursor becomes the standard text caret
- Hide on touch devices

**Toasts (sonner):**
- Bottom-center on mobile, bottom-right on desktop
- Branded styling with brand-blue border
- Icon: a tiny LEGO brick

**Easter eggs (kid delight):**
1. Konami code (↑↑↓↓←→←→BA) → fullscreen confetti shower of LEGO bricks for 3 seconds + a hidden "You found the secret!" toast
2. Saving the 10th set → a special confetti burst with the message "Master Builder unlocked!"
3. Click the round logo 5 times in a row → the brick on the logo briefly does a backflip
4. On the 404 page: a sad little animated brick with "This page is missing — like a lost LEGO piece"

**Loading states everywhere:**
- Custom brick-shimmer skeleton (not gray rectangles)
- Page-level loading: a small animated stack of bricks assembling
- Suspense boundaries on every async component

**Performance budget for animations:**
- All animations 60fps on a 2018 MacBook Air
- `will-change` only on actively animating elements, removed on completion
- 3D scene: max 5000 verts total, single draw call where possible
- Total JS bundle on landing: under 250KB gzipped
- Lazy-load the 3D scene, the sound files, and Lottie JSON
- Test on **mobile Safari** (Vercel preview on phone) before declaring done

**Accessibility (NOT optional):**
- Every animation has a `prefers-reduced-motion` fallback (instant or fade only)
- Focus rings are visible and branded (2px solid brand-blue, 2px offset)
- All interactive elements keyboard-reachable, in a logical tab order
- Cursor effects only on devices with `pointer: fine`
- Sound is OFF by default; toggle is keyboard accessible
- Color contrast AA minimum on all text (use the contrast checker via `design:accessibility-review` skill)

### Language & RTL
- **Bilingual:** Hebrew (default, RTL) + English toggle in the header
- Use `next-intl` — locale prefix in the URL: `/he/...` (default) and `/en/...`
- When Hebrew is active: `<html lang="he-IL" dir="rtl">`
- All UI strings in `messages/he.json` and `messages/en.json`
- LEGO set names stay in their original language (English) — don't translate them
- Numbers (parts count, year) display in the user's locale

### Pages to build

**`/` — Landing page**
- Hero: logo, tagline, prominent search bar, language toggle
- Below: 3 cards explaining the 3 search methods (text, image, theme).
  - Text search → live now
  - Image search → "Coming soon" badge
  - Theme browse → "Coming soon" badge
- Below: a grid of 8 popular/iconic sets, balanced across themes (Star Wars, Technic, Architecture, Ideas, City, Creator). Suggested defaults — feel free to swap any for a more visually striking alternative if you find one:
  - `10497` Galaxy Explorer, `10300` DeLorean, `42115` Lamborghini Sián, `21318` Tree House, `75313` AT-AT UCS, `10294` Titanic, `21330` Home Alone, `42143` Ferrari Daytona SP3
  - Pick sets with high-quality imagery in Rebrickable. If any of these have weak images, swap them.
- Footer: round logo, "Made with bricks and love", "Powered by Rebrickable" credit (required by their TOS)

**`/search?q=...` — Search results**
- Calls Rebrickable `GET /api/v3/lego/sets/?search={q}&page_size=24`
- Grid of cards: image, set number, name, theme, year, parts count, "Save" heart icon
- Pagination (next/prev)
- Empty state with friendly message + suggestion to try another term
- Skeleton loaders during fetch

**`/sets/[setNum]` — Single set page**
- Calls Rebrickable `GET /api/v3/lego/sets/{set_num}/`
- Image gallery: main set image + alternate images from `GET /api/v3/lego/sets/{set_num}/alternates/` if any
- Set name, set number, theme name, year, number of parts, minifig count
- "Save to my bricks" button (heart icon, fills when saved, toggles `localStorage`)
- "Building instructions" button → `https://www.lego.com/en-us/service/buildinginstructions/search/?q={setNum}`
- "View on Rebrickable" link → `https://rebrickable.com/sets/{setNum}/`
- Placeholder section: "Price comparison — coming soon"

**`/my-bricks` — Saved sets**
- Reads set numbers from `localStorage` key `brickfinder:saved`
- Fetches each set's data from Rebrickable in parallel (server-side via a route handler that takes a list of IDs, or client-side fetches with skeleton loading)
- Same card grid as search results
- Empty state: friendly illustration + "No bricks saved yet — go find some!" + button to home
- "Remove" button on each card

### Rebrickable integration
- API key in `.env.local` as `REBRICKABLE_API_KEY`
- Create `lib/rebrickable.ts` with typed functions: `searchSets`, `getSet`, `getSetAlternates`, `getSetsByIds`
- Use Next.js `unstable_cache` with 1-hour revalidate to avoid hammering the API
- Auth header: `Authorization: key YOUR_KEY`
- All Rebrickable calls in **server components** or **route handlers** — never expose the key to the client
- For `/my-bricks`: client component reads localStorage, then calls a route handler `/api/sets?ids=10497,10300,...` that fetches each set and returns the array

### localStorage schema
```ts
// key: 'brickfinder:saved'
// value: JSON string of array of set numbers
// example: '["10497", "10300", "75313"]'
```
Add a small `lib/saved.ts` with `getSaved()`, `addSaved(setNum)`, `removeSaved(setNum)`, `isSaved(setNum)`. All client-side only — guard with `typeof window !== 'undefined'`.

### Components

**shadcn/ui base:** `Button`, `Input`, `Card`, `Skeleton`, `Badge`, `Sheet`, `Dialog`, `Tooltip`

**Custom (motion-rich):**
- `<MagneticButton />` — wraps any button, magnetic hover effect
- `<TiltCard />` — 3D tilt on hover with shine
- `<AnimatedNumber />` — count-up with intersection observer
- `<HeroBrick3D />` — react-three-fiber LEGO brick, draggable
- `<ParticleBricks />` — floating brick particles for hero background
- `<SearchBar />` — animated placeholder, magnetic submit, glassmorphic
- `<SetCard />` — uses TiltCard, image scale, save heart
- `<SetGallery />` — main + thumbs, lightbox, keyboard nav, 3D hover
- `<SaveButton />` — heart fill spring + confetti burst + toast + sound
- `<LanguageToggle />` — sliding pill animation
- `<SoundToggle />` — speaker icon, persists pref
- `<CustomCursor />` — desktop only, springy ring + stud
- `<Header />`, `<Footer />`, `<BrickShimmer />` (custom skeleton), `<PageTransition />` (AnimatePresence wrapper)
- `<KonamiListener />` — global keyboard listener for the easter egg
- `<EmptyBricks />` — Lottie + CTA

### Responsive
- Mobile-first
- Breakpoints: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px
- Test at 375px width
- Touch targets minimum 44×44px
- Search results grid: 1 col mobile, 2 cols sm, 3 cols md, 4 cols lg

### SEO
- Per-page metadata via Next.js `generateMetadata`
- OG image: round logo on brand-blue background
- `robots.txt` allowing all
- `sitemap.xml` with `/`, `/he`, `/en`, `/my-bricks`

### Quality gates before saying "done"

**Build & code quality:**
1. `npm run build` passes with **zero TypeScript errors** and **zero ESLint warnings**
2. No `any` types anywhere
3. No `console.log` left in source

**Performance & SEO:**
4. Lighthouse on landing page (mobile, desktop): **Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95**
5. Total JS on landing < 250KB gzipped (excluding the 3D scene which is lazy)
6. LCP < 2.5s, CLS < 0.1, INP < 200ms

**Localization:**
7. Hebrew (default) and English both render correctly
8. RTL flips properly on every page (test header, cards, buttons, gallery, my-bricks)
9. Language toggle persists across navigation (cookie or URL)

**Functionality:**
10. Search "train" returns ≥ 20 results
11. `/sets/10497` (Galaxy Explorer) loads with full data and image gallery
12. Save → reload → set still in `/my-bricks`. Remove → set gone.
13. Search-as-you-type debounces correctly (no excessive API calls)

**Motion & wow factor:**
14. 3D hero brick renders, can be dragged to rotate, has a static fallback
15. All hover states have motion (not just color changes)
16. Save button triggers confetti and toast
17. Cards animate in on scroll with stagger
18. Custom cursor active on desktop, hidden on touch
19. Konami code easter egg works
20. `prefers-reduced-motion` disables all non-essential motion
21. Page transitions between routes are smooth (no flash of unstyled content)

**Mobile:**
22. At 375px: no horizontal scroll, all CTAs reachable with thumb
23. Touch targets ≥ 44×44px
24. Sound toggle works, defaults OFF

**Dark mode:**
25. Toggle in header switches smoothly between light and dark
26. Both modes pass Lighthouse a11y ≥ 95 (color contrast)
27. System preference is respected on first visit
28. Choice persists across reloads

**Security:**
29. `REBRICKABLE_API_KEY` and `VERCEL_TOKEN` not in any client bundle (grep `.next/static`)
30. `.env.local` listed in `.gitignore`

### Account separation (critical)

I run Twin-Ex business work on this same machine in parallel. Do NOT log anything out, do NOT switch the global Vercel login. Use the per-project mechanisms below.

**GitHub:**
- Use `gh auth switch` to switch the active account to `gilad-mg` (personal) before any git push, `gh repo create`, or auth-requiring command
- The other account stored in `gh` is my Twin-Ex work account — do not log it out, do not modify it
- Do NOT use the `twin-ex` org. The repo lives under `gilad-mg/brick-finder`
- After all pushes are done, leave the active account on whatever — I'll switch back manually

**Vercel:**
- Do NOT run `vercel login` or `vercel logout`. The global login is for Twin-Ex.
- A personal `VERCEL_TOKEN` is stored in `.env.local`. Use it for EVERY vercel command:
  - `vercel whoami --token $VERCEL_TOKEN`
  - `vercel link --token $VERCEL_TOKEN`
  - `vercel deploy --token $VERCEL_TOKEN`
  - `vercel env add --token $VERCEL_TOKEN`
- Before linking or deploying, run `vercel whoami --token $env:VERCEL_TOKEN`. Log the result to `PHASE-1-DONE.md`. If the result clearly belongs to a Twin-Ex / business team, STOP and write a top-line warning to `PHASE-1-DONE.md` instead of deploying. Otherwise proceed without pausing — the user is away.
- The deployment scope must be the personal scope, never a team.

### Setup steps you should do yourself

**Scaffold in place** — `.env.local` and the logo files already live in `C:\projects\Personal\Lego-Website\`. Scaffold the Next.js app DIRECTLY in this folder, not in a subfolder.

1. `npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --eslint --use-npm` — the `.` scaffolds into the current directory. Pass all flags non-interactively. If it still asks "directory not empty" → answer Yes. Preserve `.env.local`, `logo.png`, `logo-clean.png`, `PHASE-1-CLAUDE-CODE-PROMPT.md`.
2. Move logos to `public/`
3. Verify `.gitignore` covers `.env*.local` (Next.js default does — add the line if missing)
4. `npx shadcn@latest init -d` (use defaults, non-interactive). Configure base color: Slate. Configure CSS variables: Yes.
5. Install in one batch:
   ```
   npm i framer-motion gsap @studio-freight/lenis canvas-confetti lottie-react @react-three/fiber @react-three/drei three @tanstack/react-query sonner vaul tailwindcss-animate next-intl lucide-react use-sound zod
   npm i -D @types/canvas-confetti @types/three
   ```
6. Add shadcn components:
   ```
   npx shadcn@latest add button input card skeleton badge sheet dialog tooltip
   ```
7. Build the design system foundation: tokens, typography, motion variants, custom cursor, page transition wrapper, brick shimmer
8. Build pages in order: layout (with i18n + providers) → landing → search → set page → my-bricks → 404
9. Initialize git, first commit, then push to GitHub repo `gilad-mg/brick-finder` (personal account)
10. Deploy to Vercel using `VERCEL_TOKEN` from .env.local
11. Set `REBRICKABLE_API_KEY` as a Vercel env var via `vercel env add REBRICKABLE_API_KEY production --token $env:VERCEL_TOKEN` (and for `preview` and `development`)
12. Trigger a fresh deploy so the env var takes effect

### Autonomous run mode (CRITICAL — user is away for 40 minutes)

The user will paste this prompt and walk away. **Do not pause for confirmation. Do not ask questions mid-build.** Make sensible decisions and document them in `PHASE-1-DONE.md` at the end.

Specifically:
- Use `--yes`, `-y`, `--force`, `-d` flags wherever they exist to skip prompts
- For `gh repo create gilad-mg/brick-finder --public --source=. --remote=origin --push` (non-interactive)
- For Vercel: `vercel --token $env:VERCEL_TOKEN --yes` for all deploys
- If a tool fails, retry once. If still failing, log it to `PHASE-1-DONE.md` under "Issues to resolve" and continue with the rest of the build. Do NOT block on any single failure.
- If you hit an architectural fork in the road (e.g., choice between two valid libraries), pick the more popular/well-supported one and document the choice
- If a Lighthouse check fails by a small margin, fix the obvious things (image sizing, font loading, unused JS) and re-run; if still failing, document in PHASE-1-DONE.md

**The only exception** — if `vercel whoami --token $env:VERCEL_TOKEN` returns a Twin-Ex / business account, STOP IMMEDIATELY and write a top-line warning to `PHASE-1-DONE.md`. Do not deploy anywhere until the user confirms.

### What you should ask me before starting

Nothing. Everything you need is in this file or in `.env.local`. Start.

### What you should ask me before starting
- My GitHub username (if you don't have it already)
- Whether to use a custom domain or stick with the Vercel `.vercel.app` URL for now

### What to deliver at the end
1. Working local dev server
2. Live Vercel preview URL
3. Step-by-step instructions for me to:
   - Get a free Rebrickable API key
   - Add `REBRICKABLE_API_KEY` to Vercel env vars
4. A `PHASE-1-DONE.md` summary: what was built, decisions made, Lighthouse scores, what's left for Phase 2 & 3
