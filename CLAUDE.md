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

1. GitHub Actions (`.github/workflows/build-and-deploy.yml`) runs on push to `main`
2. Builds the Astro site (`npm ci && npm run build`)
3. Force-pushes the `dist/` contents to the `prod` branch (orphan, single commit, history overwritten each deploy)
4. Plesk Git extension on GoDaddy watches the `prod` branch and pulls into the site's webroot

The `prod` branch is the **only** place force-pushes are allowed. The main-branch ruleset blocks force-pushes everywhere else.

## Voice and tone

- **Substantive, not promotional.** No hype words, no "transform your business" copy.
- **First-person plural for the firm** ("We work with..."). First-person singular acceptable when Scott speaks personally (the Approach essay's research section, the About page).
- **Practitioner voice.** Written by someone who has shipped software, not someone who has written about it.
- **No jargon that doesn't add precision.** "Risk-tiered code review" yes, "AI-powered transformation" no.
- **No AI-generated imagery anywhere.** For a practice focused on AI oversight, generative imagery would actively undermine the positioning.

## Privacy / search engine indexing (pre-launch)

Until soft launch, the site is configured to **block all indexing**:

- `public/robots.txt` disallows all crawlers
- `<meta name="robots" content="noindex, nofollow">` in `BaseLayout.astro`

**At launch time, both must be reversed:**

1. Update `public/robots.txt` to allow indexing (replace `Disallow: /` with `Allow: /`)
2. Remove or change the meta robots tag in `BaseLayout.astro`
3. Submit the site to Google Search Console and Bing Webmaster Tools

Do not reverse these before Scott confirms the soft-launch date.

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
