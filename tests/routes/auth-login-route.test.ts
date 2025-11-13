import { describe, expect, it } from "vitest";

import { POST as loginRoute } from "@/app/api/auth/login/route";

function createRequest(body: string | null) {
  return new Request("http://localhost/api/auth/login", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/auth/login", () => {
  it("returns 400 when the incoming body is not valid JSON", async () => {
    const response = await loginRoute(createRequest("{not valid json"));

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload).toMatchObject({
      message: "Invalid request body. Please submit JSON credentials.",
    });
  });

  it("returns field level errors when username or password is empty", async () => {
    const response = await loginRoute(createRequest(JSON.stringify({ username: "", password: "" })));

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload).toMatchObject({
      message: "Please fix the highlighted fields.",
      errors: {
        username: "Username is required.",
        password: "Password is required.",
      },
    });
  });

  it("rejects incorrect credentials", async () => {
    const response = await loginRoute(createRequest(JSON.stringify({ username: "admin", password: "nope" })));

    expect(response.status).toBe(401);
    const payload = await response.json();
    expect(payload).toMatchObject({ message: "Incorrect username or password." });
  });

  it("authenticates valid credentials and sets the pokedex-session cookie", async () => {
    const response = await loginRoute(createRequest(JSON.stringify({ username: "admin", password: "admin" })));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      message: "Authenticated successfully.",
    });

    const cookies = response.headers.get("set-cookie");
    expect(cookies).toBeTruthy();
    expect(cookies).toContain("pokedex-session=authenticated");
    expect(cookies).toContain("HttpOnly");
  });
});
