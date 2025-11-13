import { describe, expect, it } from "vitest";

import { POST as logoutRoute } from "@/app/api/auth/logout/route";

describe("POST /api/auth/logout", () => {
  it("clears the session cookie", async () => {
    const response = await logoutRoute();

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toMatchObject({ message: "Logged out." });

    const cookies = response.headers.get("set-cookie");
    expect(cookies).toBeTruthy();
    expect(cookies).toContain("pokedex-session=");
    expect(cookies).toContain("Max-Age=0");
  });
});
