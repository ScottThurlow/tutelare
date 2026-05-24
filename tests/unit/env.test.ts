import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

describe("src/lib/env.ts", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("defaults SITE_URL to production when env var unset", async () => {
    vi.stubEnv("SITE_URL", "");
    const env = await import("../../src/lib/env");
    expect(env.SITE_URL).toBe("https://tutelare.ai");
  });

  it("uses provided SITE_URL when set", async () => {
    vi.stubEnv("SITE_URL", "https://ppe.tutelare.ai");
    const env = await import("../../src/lib/env");
    expect(env.SITE_URL).toBe("https://ppe.tutelare.ai");
  });

  it("IS_LAUNCHED is false when LAUNCHED env var is unset", async () => {
    vi.stubEnv("LAUNCHED", "");
    const env = await import("../../src/lib/env");
    expect(env.IS_LAUNCHED).toBe(false);
  });

  it("IS_LAUNCHED is false when LAUNCHED env var is 'false'", async () => {
    vi.stubEnv("LAUNCHED", "false");
    const env = await import("../../src/lib/env");
    expect(env.IS_LAUNCHED).toBe(false);
  });

  it("IS_LAUNCHED is true only when LAUNCHED env var is exactly 'true'", async () => {
    vi.stubEnv("LAUNCHED", "true");
    const env = await import("../../src/lib/env");
    expect(env.IS_LAUNCHED).toBe(true);
  });

  it("IS_PRODUCTION_HOST is true for the production URL", async () => {
    vi.stubEnv("SITE_URL", "https://tutelare.ai");
    const env = await import("../../src/lib/env");
    expect(env.IS_PRODUCTION_HOST).toBe(true);
  });

  it("IS_PRODUCTION_HOST is false for the PPE URL", async () => {
    vi.stubEnv("SITE_URL", "https://ppe.tutelare.ai");
    const env = await import("../../src/lib/env");
    expect(env.IS_PRODUCTION_HOST).toBe(false);
  });

  it("SHOULD_INDEX is false on PPE even with LAUNCHED=true", async () => {
    vi.stubEnv("SITE_URL", "https://ppe.tutelare.ai");
    vi.stubEnv("LAUNCHED", "true");
    const env = await import("../../src/lib/env");
    expect(env.SHOULD_INDEX).toBe(false);
  });

  it("SHOULD_INDEX is false on production pre-launch", async () => {
    vi.stubEnv("SITE_URL", "https://tutelare.ai");
    vi.stubEnv("LAUNCHED", "false");
    const env = await import("../../src/lib/env");
    expect(env.SHOULD_INDEX).toBe(false);
  });

  it("SHOULD_INDEX is true ONLY when production host AND launched", async () => {
    vi.stubEnv("SITE_URL", "https://tutelare.ai");
    vi.stubEnv("LAUNCHED", "true");
    const env = await import("../../src/lib/env");
    expect(env.SHOULD_INDEX).toBe(true);
  });
});
