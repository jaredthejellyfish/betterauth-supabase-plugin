import { describe, test, expect } from "bun:test";
import { supabaseJWTClient } from "../client-plugin";

describe("supabaseJWTClient", () => {
  test("should create a plugin with the correct ID", () => {
    const plugin = supabaseJWTClient();
    expect(plugin.id).toBe("supabase-jwt");
  });

  test("should have getActions method", () => {
    const plugin = supabaseJWTClient();
    expect(typeof plugin.getActions).toBe("function");
  });

  test("should have getAtoms method", () => {
    const plugin = supabaseJWTClient();
    expect(typeof plugin.getAtoms).toBe("function");
  });
}); 