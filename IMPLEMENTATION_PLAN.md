# johnsonsaimon.com — Funnel & Conversion Implementation Plan

**Repo:** `johnsonsaimon89/johnson_portfolio` (folder: `Johnson/`)
**Stack confirmed from source:** React 18 + Vite, React Router, Framer Motion, Supabase (Postgres) backend with a custom admin dashboard (`src/pages/AdminDashboard.jsx` + `src/components/admin/*`).
**Author of this plan:** reviewed via direct repo checkout (tarball of `master`), not guesswork — all file paths, component names, and Supabase table/column names below are taken directly from the existing code.

This plan is written to be executed by an AI coding agent (e.g. Gemini) or a developer, ticket by ticket. Each ticket has: the problem, the fix, exact files touched, and either a ready-to-drop-in file or a precise diff. Ready-to-drop-in files are included alongside this plan in the same folder structure as the repo (`website-code/src/...`) — copy them directly over the matching path in `Johnson/src/...`.

---

## 0. Before you start

- Confirm your local `.env` / Supabase project matches what's referenced in `src/lib/supabaseClient.js` — nothing here changes your schema except where explicitly called out in Ticket 6.
- Take a git branch: `git checkout -b funnel-improvements`.
- Every ticket below is independent and can be merged separately — do them in priority order, but none blocks the others except where noted.

---

## Ticket 1 — Homepage: add proof + fork the CTA (Priority: HIGH)

**Problem:** `src/components/HomeSplash.jsx` is a full-bleed hero with a name, tagline, and a single "VIEW PROFILE" button. It has zero proof (your real metrics — 250K+ reach, 4.8% engagement, 5,000+ community — live in `performances`/`case_studies` tables that `SocialMediaPage.jsx` already queries, but the homepage never touches them) and only one path forward, forcing every visitor down the same route regardless of whether they came to hire you or to buy a template.

**Fix:**
- Replace `src/components/HomeSplash.jsx` with the version at `website-code/src/components/HomeSplash.jsx` in this delivery.
- It keeps your existing cinematic hero pixel-for-pixel, then adds:
  1. A proof strip pulling live data from `performances` (same shape as `AnalyticsDash` in `SocialMediaPage.jsx`), falling back to your known numbers if the table is empty.
  2. Two case-study highlight cards pulled from `case_studies` (`is_active = true`, ordered by `display_order`), falling back to `portfolioData.socialMediaPortfolio.caseStudies`.
  3. A forked CTA: **"Work With Me"** → `/contact`, **"Browse Templates & Guides"** → `/resources`, plus a smaller "or see the full profile" link to `/profile`.
- New dependency: `src/components/common/AnimatedCounter.jsx` (included) — extracted from the inline `AnimatedCounter` currently duplicated inside `SocialMediaPage.jsx`, so both pages share one implementation instead of two copies drifting apart.

**Files touched:**
- `src/components/HomeSplash.jsx` (replace)
- `src/components/common/AnimatedCounter.jsx` (new)

**Optional follow-up (not required to ship this ticket):** once merged, refactor `SocialMediaPage.jsx`'s local `AnimatedCounter` to import the shared one and delete its local copy.

**App.jsx side-effect to decide on:** `src/App.jsx` currently hides the Footer and NewsletterPopup specifically on `/`:
```jsx
{!pathname.startsWith('/admin') && pathname !== '/' && <Footer />}
...
{!pathname.startsWith('/admin') && pathname !== '/' && <NewsletterPopup />}
```
Now that the homepage has real content below the hero, it makes sense to show the Footer there too (visitors scrolling past the case studies should land on real footer nav, not a hard stop). Recommend removing `pathname !== '/'` from the Footer line. The NewsletterPopup exclusion on `/` can stay — better to let the popup trigger from `/profile`, `/resources`, etc. where someone has shown more intent, per Ticket 4.

---

## Ticket 2 — Rename nav "Resources" → reflects what it actually is (Priority: HIGH, ~2 min change)

**Problem:** `src/pages/ResourcesPage.jsx`'s own hero copy calls itself a **"Digital Marketplace"** with **"Premium Tools & Free Creative Assets"** — but `src/components/Navbar.jsx` labels it "Resources" in the nav. Someone scanning the nav for "can I buy something" will skip right past a tab called Resources. The label doesn't match the page's own internal branding.

**Fix — in `src/components/Navbar.jsx`:**
```diff
  const navLinks = [
      { name: 'Home', href: '/', isPage: true },
      { name: 'Profile', href: '/profile', isPage: true },
      { name: 'Social', href: '/social-media', isPage: true },
      { name: 'Studio', href: '/web-portfolio', isPage: true },
-     { name: 'Resources', href: '/resources', isPage: true },
+     { name: 'Shop', href: '/resources', isPage: true },
      { name: 'Talk', href: '/contact', isPage: true },
  ];
```
Route path (`/resources`) is left unchanged deliberately — only the visible label changes, so no links elsewhere in the app or externally break.

**Files touched:** `src/components/Navbar.jsx` (one-line change)

---

## Ticket 3 — Give the Profile page a real ending (Priority: HIGH)

**Problem:** `src/pages/ProfilePage.jsx` walks a visitor through your intro, all six services (in an accordion), and an "Approach" section — then the page just ends. No closing CTA, no link to Contact, no next step. This is the single most direct funnel leak on the site: someone who reads through six services is clearly interested, and hits a wall.

**Fix:**
- Replace `src/pages/ProfilePage.jsx` with the version at `website-code/src/pages/ProfilePage.jsx`.
- It adds two things at the end of the page:
  1. `<PodcastHighlights />` — new component (Ticket 5), giving the podcast a real section instead of only a social icon link.
  2. `<CTASection />` — a new shared component (below), closing the page with a clear "Start a Conversation" / "Email Me" pair pointing at `/contact`.

**New shared component — `src/components/common/CTASection.jsx`:**
This generalizes `src/components/WebStudio/StudioCTA.jsx`, which currently has its copy and links hardcoded to the web-design offer only (and its secondary link points to `#contact`, an anchor that doesn't exist anywhere in the app — likely left over from an earlier single-page version). `CTASection` takes `title`, `subtitle`, `primaryLabel`, `primaryTo`, `secondaryLabel`, `secondaryHref` as props, so the same visual block can close *any* page with copy matched to that page's actual offer.

**Files touched:**
- `src/pages/ProfilePage.jsx` (replace)
- `src/components/common/CTASection.jsx` (new)
- `src/components/PodcastHighlights.jsx` (new — see Ticket 5)

**Follow-up recommended in the same PR:** swap `src/pages/WebPortfolioPage.jsx`'s `<StudioCTA />` for the new `<CTASection />` too (ready-made replacement file included at `website-code/src/pages/WebPortfolioPage.jsx`), so there's one CTA component and one visual pattern site-wide instead of two similar-but-different ones. This version also removes dead imports (`InteractivePreview`, `ResponsiveShowcase`, `DesignThinking`, `ValueProp`, `ArrowLeft`, `Link`) that are imported in the current file but never rendered — see Ticket 7.

---

## Ticket 4 — Fix the newsletter popup's offer (Priority: MEDIUM-HIGH)

**Problem:** `src/components/common/NewsletterPopup.jsx` — the only site-wide lead-capture mechanism — currently offers: *"I share periodic updates on my latest projects, digital strategy tips, and behind-the-scenes thoughts on creation."* That's a vague incentive. Meanwhile, `src/data/productsData.js` already defines two named free products (`Brand Voice Worksheet`, `Post Idea Generator`) that the popup never mentions.

**Fix:**
- Replace `src/components/common/NewsletterPopup.jsx` with the version at `website-code/src/components/common/NewsletterPopup.jsx`.
- Changes: headline and copy now lead with **"Get the Brand Voice Worksheet — Free"**, icon changed from a generic mail icon to a download icon (matches the actual action), popup delay increased from 5s to 8s, and the `EmbeddableSignup` `source` prop is now `"website_popup_brand_voice_worksheet"` instead of the generic `"website_popup"` — so you can see in `newsletter_subscribers` exactly which offer drove each signup.
- The featured resource is a constant (`FREE_RESOURCE`) at the top of the file — swap it or rotate it without touching the rest of the component.

**Backend gap this surfaces (do this too, or the popup over-promises):**
`src/components/common/EmbeddableSignup.jsx` only inserts a row into `newsletter_subscribers` with a `source` tag; per its own code comment, a database trigger (`notify_send_email()`) sends a generic welcome email — there is currently no mechanism that actually emails the worksheet file. Two options, in order of effort:
1. **Fast:** manually check `newsletter_subscribers` filtered by `source = 'website_popup_brand_voice_worksheet'` and send the worksheet by hand until volume makes that impractical.
2. **Right:** add a `requested_resource` column (or reuse `source`) to the trigger/edge function that sends the welcome email, and branch the email template + attachment/link based on it. This is a backend/Supabase task, not a frontend one — flag it separately if handing off to someone who only works on the DB/edge-function side.

**Files touched:** `src/components/common/NewsletterPopup.jsx` (replace); Supabase trigger/edge function (separate backend task, not included as a code file here since it depends on how `notify_send_email()` is currently implemented, which lives in the DB, not the repo).

---

## Ticket 5 — Give the podcast a real home (Priority: MEDIUM)

**Problem:** Ulumbi Podcast only appears as one entry in `portfolioData.socials` — a plain icon link identical in treatment to your Instagram/Facebook/LinkedIn links. It gets no narrative, no episode content, and isn't connected to anything else on the site, despite being a real trust-building asset (long-form proof of expertise, distinct from short-form social content).

**Fix:**
- New component `src/components/PodcastHighlights.jsx` (included) — a section with 3 episode-highlight cards linking out to Spotify, dropped into `ProfilePage.jsx` per Ticket 3.
- **Action needed from you (not code):** the file ships with 3 placeholder episode titles/topics — replace `title` and `topic` in the `episodes` array with your actual strongest episodes before deploying.

**Longer-term (optional, not required to ship):** move `episodes` into a new Supabase table (`podcast_episodes`) managed from the admin dashboard, following the exact same pattern already used for `blog_posts` / `case_studies` (there's already a full CMS pattern in `src/components/admin/` to copy from — see `CaseStudiesManager.jsx` as the closest template).

**Files touched:** `src/components/PodcastHighlights.jsx` (new)

---

## Ticket 6 — Fix the inconsistent contact email (Priority: LOW, found while doing Ticket 3)

**Problem:** `src/components/WebStudio/StudioCTA.jsx` mailto's to `johnsonsaimon89@gmail.com`, while `src/data/portfolioData.js` (`contact.email`, used elsewhere) lists `johnsonsaimon111@gmail.com`. Two different addresses are live on the site simultaneously.

**Fix:** Confirm which address is correct, then grep the whole repo for the other one and replace every occurrence:
```bash
grep -rn "johnsonsaimon89@gmail.com\|johnsonsaimon111@gmail.com" src/
```
The `CTASection` replacement files in this delivery already standardize on `johnsonsaimon111@gmail.com` (matching `portfolioData.contact.email`) — change the prop values if that's actually the wrong one.

**Files touched:** whichever files the grep turns up (likely just `StudioCTA.jsx`, now replaced anyway by Ticket 3's follow-up).

---

## Ticket 7 — Dead code cleanup (Priority: LOW)

**Problem:** These components are never imported anywhere in the app (confirmed via repo-wide grep):
- `src/components/Services.jsx`
- `src/components/Portfolio.jsx`
- `src/components/About.jsx`

And these are imported in `src/pages/WebPortfolioPage.jsx` but never rendered:
- `InteractivePreview`, `ResponsiveShowcase`, `DesignThinking`, `ValueProp` (all in `src/components/WebStudio/`)

**Fix:**
- For the three fully-orphaned components: either delete them, or if they contain content worth reviving (e.g. `About.jsx` fetches from a `performances` table too — it may be a superseded version of what's now in `ProfilePage.jsx`), diff them against the current live pages first to see if anything unique is worth porting over before deleting.
- For the unused-but-imported `WebStudio` components: `ValueProp` and `DesignThinking` in particular sound like exactly the kind of credibility content a funnel benefits from (a clear value proposition block, and a design-thinking/process explainer). Recommend opening each file, and if the content holds up, deliberately add it into `WebPortfolioPage.jsx` (already handled by Ticket 3's replacement file, which removes the dead imports — re-add them there once you've reviewed the content) rather than silently deleting.

**Files touched:** varies based on what you decide to keep; no code included for this ticket since it requires a judgment call on content, not just a mechanical fix.

---

## Summary table

| # | Ticket | Priority | New files | Modified files |
|---|--------|----------|-----------|-----------------|
| 1 | Homepage proof + forked CTA | HIGH | `AnimatedCounter.jsx` | `HomeSplash.jsx` |
| 2 | Rename nav "Resources" → "Shop" | HIGH | — | `Navbar.jsx` |
| 3 | Profile page closing CTA + podcast | HIGH | `CTASection.jsx`, `PodcastHighlights.jsx` | `ProfilePage.jsx`, `WebPortfolioPage.jsx` |
| 4 | Newsletter popup → named lead magnet | MED-HIGH | — | `NewsletterPopup.jsx` (+ backend trigger) |
| 5 | Podcast episode content | MEDIUM | (part of #3) | — |
| 6 | Fix inconsistent contact email | LOW | — | grep-dependent |
| 7 | Dead code cleanup | LOW | — | judgment call |

Do 1–3 first — they're the highest-leverage, lowest-risk changes and don't touch the database schema. 4 requires a small backend decision. 6–7 are cleanup, do them whenever convenient.
