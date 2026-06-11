import { test, expect } from "@playwright/test";

const routes = [
  { path: "/", h1: "Tutelare" },
  { path: "/approach", h1: "Approach" },
  { path: "/services", h1: "Services" },
  { path: "/about", h1: "About" },
  { path: "/privacy", h1: "Privacy" },
  { path: "/writing", h1: "Writing" },
];

for (const route of routes) {
  test(`${route.path} loads with expected heading`, async ({ page }) => {
    const response = await page.goto(route.path);
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator("h1").first()).toContainText(route.h1);
  });
}

test("homepage shows contact email link with correct mailto", async ({ page }) => {
  await page.goto("/");
  const mailLink = page.getByRole("link", { name: "sthurlow@tutelare.ai" }).first();
  await expect(mailLink).toHaveAttribute("href", "mailto:sthurlow@tutelare.ai");
});

test("every page has a noindex meta tag pre-launch", async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.path);
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", "noindex, nofollow");
  }
});

test("robots.txt disallows crawlers pre-launch", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toMatch(/Disallow:\s*\//i);
});

test("nav links all resolve to valid internal pages", async ({ page }) => {
  await page.goto("/");
  const navLinks = await page.locator("header nav a").all();
  expect(navLinks.length).toBeGreaterThan(0);
  for (const link of navLinks) {
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(/^\//);
    const response = await page.request.get(href!);
    expect(response.status(), `nav link ${href} returned ${response.status()}`).toBeLessThan(400);
  }
});

test("footer copyright says Tutelare, not Teneo Group LLC", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer).toContainText(/©\s*\d{4}\s*Tutelare/);
});
