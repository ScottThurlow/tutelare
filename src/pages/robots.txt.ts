import type { APIRoute } from "astro";
import { SHOULD_INDEX } from "../lib/env";

/**
 * Dynamic robots.txt generated per environment.
 *
 * - Production, post-launch: allow all crawlers + sitemap link
 * - Production, pre-launch: disallow all (avoid premature indexing)
 * - PPE (any state): disallow all (never indexable)
 *
 * Logic lives in src/lib/env.ts so the meta-robots tag in BaseLayout
 * stays in sync with what robots.txt says.
 */
export const GET: APIRoute = ({ site }) => {
  const body = SHOULD_INDEX
    ? `User-agent: *\nAllow: /\nSitemap: ${site}sitemap-index.xml\n`
    : `User-agent: *\nDisallow: /\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
