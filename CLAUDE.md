# Project guide for Claude Code

This file bootstraps Claude Code sessions into project context. Read it before starting work in this repo.

## What this is

The marketing website for **Tutelare**, a boutique AI governance consultancy. Tutelare is a DBA of **Teneo Group LLC**.

- Live site: `https://tutelare.ai` (in development; not yet indexed)
- Primary owner / decision-maker: Scott Thurlow

## Entity and copyright

- **Legal entity**: Teneo Group LLC (holding LLC). The LLC owns all assets, signs all contracts, holds the EIN, and is the actual copyright holder.
- **Brand and DBA**: Tutelare. All public-facing copy, copyright lines, page footers, and license text use "Tutelare" — not "Teneo Group LLC" — for simplicity.
- **Decision (2026-05-23)**: copyright notices on the site read `© 2026 Tutelare`. The legal entity is not surfaced in the public footer. This is the user's deliberate choice for brand simplicity; IP ownership still legally resides with Teneo Group LLC.
- For contracts, SOWs, banking, tax, USPTO filings — use **Teneo Group LLC d/b/a Tutelare**. Public web copy = "Tutelare" only.

## Stack

- **Astro 5** with static output
- **Tailwind 4** for styling
- **MDX** for writing pieces (under `/writing`)
- **TypeScript** baseline
- **npm** as package manager
- **Node 22 LTS** (pinned in `.nvmrc`)

## Branch workflow

The `main` branch is protected by a GitHub ruleset:

- All changes require a PR with at least one approving review
- Force-pushes and deletions of `main` blocked
- Scott (Repository admin role) is the sole bypass actor

Day-to-day flow:

1. Create a feature branch (`feature/<thing>` or `fix/<thing>`)
2. Make commits there
3. Open a PR into `main`
4. Scott reviews, approves via admin bypass when he's the sole contributor, merges

**Never push directly to `main`** unless explicitly instructed and using the admin bypass.

## Deploy pipeline

Two environments, both on GoDaddy **cPanel** shared hosting. Build runs **in GitHub Actions**, and the built `dist/` is committed back to the source branch by CI; cPanel just rsyncs static files. Reason: GoDaddy's plan does not include Node.js Selector, so server-side `npm run build` via `.cpanel.yml` is unavailable.

| Environment | Source branch | cPanel docroot |
|---|---|---|
| PPE | `main` | `/home/k7sqbol3loif/ppe.tutelare.ai` (see `.cpanel.yml`) |
| Production | `prod` | `/home/k7sqbol3loif/tutelare.ai` (see `.cpanel.yml`) |

**Engineer workflow:**

1. Engineer works in a feature branch (any name), tests locally via `npm run dev`.
2. Engineer opens PR against `main`. Scott reviews, merges (admin bypass since solo).
3. CI (`build-and-deploy.yml`) on push to `main`:
   - Builds Astro with `SITE_URL=https://ppe.tutelare.ai`
   - Force-adds `dist/` (which is otherwise gitignored), commits with `[skip ci]`, pushes back to `main` using the `CI_PUSH_TOKEN` PAT
   - The `[skip ci]` marker prevents an infinite loop
4. On cPanel → Git Version Control → Manage → **Update from Remote + Deploy HEAD Commit** → cPanel pulls latest `main` (which now includes the built `dist/`), runs `.cpanel.yml`, which rsyncs `dist/` to the PPE webroot.
5. Verify `ppe.tutelare.ai`.

**To promote to production:**

1. Locally: `git checkout prod && git merge main && git push origin prod`
2. CI rebuilds with `SITE_URL=https://tutelare.ai`, commits dist/ to `prod`
3. On cPanel for the production site: Git Version Control → **Update from Remote + Deploy HEAD Commit**
4. cPanel pulls latest `prod`, rsyncs `dist/` to the prod webroot.

**`.cpanel.yml` lives at the repo root** and is the single source of truth for the deploy logic. Branch-aware: detects whether `main` or `prod` is checked out and chooses the right `DEPLOYPATH`. To change deploy paths or build steps, edit `.cpanel.yml` in a PR.

**Required GitHub repo secret**:
- `CI_PUSH_TOKEN` — fine-grained PAT tied to Scott's account, scope: Contents Write on this repo. CI uses it for the `git push` after building. Because the PAT carries Scott's identity, it inherits the main-branch ruleset bypass automatically. **Rotate yearly** (set a calendar reminder when generating).

**Why `dist/` is in `.gitignore` even though CI commits it:**
- Humans should not commit `dist/` — it's a build output, not source. The gitignore entry prevents accidental local commits.
- CI uses `git add -f dist/` to force-add, overriding the gitignore for the build artifact commit.
- If you ever see a `dist/` commit authored by anyone other than CI (commit message ending in `[skip ci]`), that's a bug — revert it.

**Indexing quirks:**
- PPE should always be noindex, even after production launch. Don't reverse the robots.txt block on `ppe.tutelare.ai` ever — it's not a public surface.
- The site URL Astro bakes into canonical/OG tags is environment-specific. Don't hard-code `tutelare.ai` anywhere — read from `Astro.site` which honors the `SITE_URL` env var via `astro.config.mjs`.
- To enable indexing on production at soft launch: edit `.github/workflows/build-and-deploy.yml`, find the `prod` branch in the "Determine deploy target" step, change `launched=false` to `launched=true`. PR, merge, push to prod.

## Voice and tone

- **Substantive, not promotional.** No hype words, no "transform your business" copy.
- **First-person plural for the firm** ("We work with..."). First-person singular acceptable when Scott speaks personally (the Approach essay's research section, the About page).
- **Practitioner voice.** Written by someone who has shipped software, not someone who has written about it.
- **No jargon that doesn't add precision.** "Risk-tiered code review" yes, "AI-powered transformation" no.
- **No AI-generated imagery anywhere.** For a practice focused on AI oversight, generative imagery would actively undermine the positioning.

## Search engine indexing

Indexing is controlled by **one boolean env var, `LAUNCHED`**, plus the deploy target. Logic in `src/lib/env.ts`:

```
SHOULD_INDEX = (SITE_URL is production host) AND (LAUNCHED == "true")
```

Behavior matrix:

| Target | LAUNCHED | robots.txt | meta robots |
|---|---|---|---|
| Production (`tutelare.ai`) | `false` | `Disallow: /` | `noindex, nofollow` |
| Production (`tutelare.ai`) | `true` | `Allow: /` + sitemap link | (omitted) |
| PPE (`ppe.tutelare.ai`) | `false` | `Disallow: /` | `noindex, nofollow` |
| PPE (`ppe.tutelare.ai`) | `true` | `Disallow: /` | `noindex, nofollow` |

**PPE is never indexable.** Even if someone passes `LAUNCHED=true` to a PPE build by mistake, `SHOULD_INDEX` stays false because the host check fails.

**At soft launch:**

1. Edit `.github/workflows/build-and-deploy.yml`. In the "Determine deploy target" step, find the `else` block (production) and change `echo "launched=false"` to `echo "launched=true"`. Leave PPE's `launched=false` untouched.
2. Open a PR with that change so it goes through review.
3. After merge, the next deploy will rebuild with `LAUNCHED=true`, regenerating both `robots.txt` and the page-level robots meta tag.
4. Submit `https://tutelare.ai/sitemap-index.xml` to Google Search Console and Bing Webmaster Tools.

Do not reverse these before Scott confirms the soft-launch date.

`robots.txt` is generated by `src/pages/robots.txt.ts` (a static endpoint), not a static file in `public/`. Don't add `public/robots.txt` — it would conflict with the endpoint at build time.

## Working notes — not in the repo

The `notes/` directory is **gitignored**. It contains the website concept brief and other working documents. When you need context on positioning, target audience, IA decisions, or launch sequence, read files in `notes/` rather than asking Scott to re-explain.

**Never commit files from `notes/`.** The `.gitignore` blocks the whole directory; do not add exceptions.

If `notes/` is empty (e.g., on a fresh clone), ask Scott to point you at the source documents — don't proceed with assumptions.

## Memory

Cross-session memory lives in `~/.claude/projects/-Users-scott-Code-tutelare/memory/`. Read `MEMORY.md` there for an index of what's been saved. Key memories include entity structure, stack/deploy decisions, Zotero library access for research citations, and the convention of mirroring patterns from Scott's other repos (nitrateonline, lastfallback).

## Things not to do

- Don't commit secrets (`.env*` is gitignored — keep it that way).
- Don't add tracking/analytics scripts. Site is launching without them per the brief.
- Don't introduce statistics in copy without verifiable sources. The Zotero library is the authoritative reference; check it before citing.
- Don't propose WordPress, Webflow, Squarespace, or any template-driven CMS migrations. The Astro static-site decision is settled.
- Don't add client logos or testimonials. There aren't any yet, and the brief is explicit about not faking social proof.
- Don't generate AI imagery for the site.

## Things to do proactively

- When proposing copy that includes a statistic or claim, cite the source inline and add it to the References block.
- When reviewing diffs, check that copyright lines say "Teneo Group LLC" not "Tutelare".
- Use the `zotero` skill when looking for academic sources rather than guessing or relying on outdated standard-issue citations.
