import { describe, test, expect, mock } from "bun:test";
import { supabaseJWTClient } from "../client-plugin";
import type { SupabaseJWTResponse } from "../client-plugin";

describe("supabaseJWT integration", () => {
  test("client plugin should work with server plugin", async () => {
    // Create a mock response that simulates what the server would return
    const mockResponse: SupabaseJWTResponse = {
      token: "mock-jwt-token",
      user: {
        id: "user-123",
        email: "test@example.com"
      }
    };
    
    // Create a mock server handler that returns the mock response
    const mockServerHandler = mock(async (url: string, options?: any) => {
      if (url === "/supabase-jwt" && options?.method === "GET") {
        return mockResponse;
      }
      throw new Error(`Unexpected request: ${url}`);
    });
    
    // Create the client plugin
    const clientPlugin = supabaseJWTClient();
    
    // Get the client actions
    const actions = clientPlugin.getActions(mockServerHandler as any);
    
    // Call the getSupabaseJWT action
    const result = await actions.getSupabaseJWT();
    
    // Verify the result contains the expected data
    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("user");
    
    // Check if the result has the expected structure
    if (result && typeof result === 'object' && 'user' in result) {
      expect(result.user).toEqual({
        id: "user-123",
        email: "test@example.com"
      });
    }
    
    // Get the client atoms
    const atoms = clientPlugin.getAtoms(mockServerHandler as any);
    
    // Call the fetchJWT function
    const jwtResult = await atoms.useGetJWT.get().getJWT();
    
    // Verify the atoms were updated
    if (jwtResult) {
      expect(jwtResult).toHaveProperty("token");
      expect(jwtResult).toHaveProperty("user");
      
      expect(atoms.jwtAtom.get()).toEqual(jwtResult);
      
      // Safely access the token property
      const token = jwtResult.token || null;
      expect(atoms.tokenAtom.get()).toBe(token);
    }
    
    // Verify the mock server handler was called correctly
    expect(mockServerHandler).toHaveBeenCalledWith("/supabase-jwt", {
      method: "GET"
    });
  });
}); 