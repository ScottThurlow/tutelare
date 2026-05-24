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

Two environments, both on GoDaddy **cPanel** shared hosting (SSH enabled):

| Environment | Source trigger | Hostname | Deploy target |
|---|---|---|---|
| Production | push to `main` | `tutelare.ai` | document root via SFTP |
| PPE | any PR opened/updated against `main` | `ppe.tutelare.ai` | PPE subdomain document root via SFTP |

1. GitHub Actions (`.github/workflows/build-and-deploy.yml`) runs on push to `main` AND on PR against `main`.
2. Determines the deploy target from the event type, sets `SITE_URL` and `LAUNCHED` env vars accordingly.
3. Builds the Astro site (`npm ci && npm run build`).
4. Uses `SamKirkland/FTP-Deploy-Action` to SFTP the `dist/` contents to the appropriate document root on cPanel.
5. The action keeps a `.ftp-deploy-sync-state.json` on the server to do incremental syncs: new and changed files upload, locally-deleted files get removed server-side. Files the action never uploaded (notably `.htaccess`) are preserved.

**Required GitHub repo secrets** (Settings → Secrets and variables → Actions → Secrets):
- `CPANEL_SFTP_HOST` — SFTP hostname (e.g. `tutelare.ai` or the cPanel server hostname)
- `CPANEL_SFTP_USERNAME` — cPanel account username
- `CPANEL_SFTP_PASSWORD` — cPanel account password (or, for key-based auth, swap to using `key` input with SSH private key in `CPANEL_SFTP_KEY` secret)

**Required GitHub repo variables** (Settings → Secrets and variables → Actions → Variables):
- `CPANEL_DEPLOY_PATH_PROD` — absolute path on the cPanel server, e.g. `/home/USERNAME/public_html`
- `CPANEL_DEPLOY_PATH_PPE` — absolute path for the PPE subdomain, e.g. `/home/USERNAME/ppe.tutelare.ai`

If any of these are unset, the workflow build still succeeds but the deploy step is skipped with a clear warning in the run log.

**PPE quirks to know**:
- Multiple PRs open at once = last PR push wins on PPE. For solo workflow this is fine; if collaborators show up, add a `staging` source branch and require explicit promotion.
- PPE should always be noindex, even after production launch. Don't reverse the robots.txt block on `ppe.tutelare.ai` ever — it's not a public surface.
- The site URL Astro bakes into canonical/OG tags is environment-specific. Don't hard-code `tutelare.ai` anywhere — read from `Astro.site` which honors the `SITE_URL` env var via `astro.config.mjs`.
- We do **not** use deploy branches (no `prod` or `ppe` orphan branches). SFTP-from-CI is the single deploy mechanism.

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
