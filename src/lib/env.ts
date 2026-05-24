/**
 * Build-time environment flags derived from env vars set by CI.
 *
 * - SITE_URL: full origin of the deployed environment. Defaults to
 *   production for local `npm run dev` / `npm run build`.
 * - LAUNCHED: 'true' once the production site is publicly launched and
 *   we want search engines to index it. Default false (pre-launch).
 * - SHOULD_INDEX: true ONLY when the build target is the production
 *   host AND launch has happened. PPE is never indexable, period.
 *
 * To flip prod to indexable at soft launch, update the workflow file
 * to pass LAUNCHED=true for the production build target. Do NOT set it
 * for PPE.
 *
 * Uses `process.env` not `import.meta.env`: Vite's `import.meta.env`
 * only exposes PUBLIC_* and built-in vars to the build, not arbitrary
 * shell env. These flags are server/build-only, so `process.env` is correct.
 */
export const SITE_URL: string =
  process.env.SITE_URL ?? "https://tutelare.ai";

export const IS_LAUNCHED: boolean = process.env.LAUNCHED === "true";

export const IS_PRODUCTION_HOST: boolean = SITE_URL === "https://tutelare.ai";

export const SHOULD_INDEX: boolean = IS_PRODUCTION_HOST && IS_LAUNCHED;
