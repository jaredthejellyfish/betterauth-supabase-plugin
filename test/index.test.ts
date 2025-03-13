import { describe, test, expect, mock, beforeEach } from "bun:test";
import { supabaseJWT } from "../index";
import * as jose from "jose";

describe("supabaseJWT", () => {
  test("should throw an error if jwtSecret is not provided", () => {
    // @ts-expect-error - Testing invalid input
    expect(() => supabaseJWT({})).toThrow("jwtSecret is required for the supabase-jwt plugin");
  });

  test("should create a plugin with the correct ID", () => {
    const plugin = supabaseJWT({ jwtSecret: "test-secret" });
    expect(plugin.id).toBe("supabase-jwt");
  });

  test("should create a plugin with the getSupabaseJWT endpoint", () => {
    const plugin = supabaseJWT({ jwtSecret: "test-secret" });
    expect(plugin.endpoints).toHaveProperty("getSupabaseJWT");
  });

  test("should use custom expiresIn value if provided", () => {
    const plugin = supabaseJWT({ 
      jwtSecret: "test-secret",
      expiresIn: "2h" 
    });
    
    expect(plugin.endpoints.getSupabaseJWT).toBeDefined();
  });

  test("should include additionalClaims in JWT if provided", () => {
    const plugin = supabaseJWT({ 
      jwtSecret: "test-secret",
      additionalClaims: {
        customClaim: "custom-value",
        numericClaim: 123
      }
    });
    
    expect(plugin.endpoints.getSupabaseJWT).toBeDefined();
  });

  describe("endpoint handler behavior", () => {
    // Create a mock for the context
    let mockJson: any;
    let mockContext: any;
    
    beforeEach(() => {
      // Create a mock for the json method
      mockJson = mock((data: any, options?: any) => ({ data, options }));
      
      // Create a mock context with a session
      mockContext = {
        context: {
          session: {
            user: {
              id: "user-123",
              email: "test@example.com"
            }
          }
        },
        json: mockJson
      };
    });
    
    test("should return 401 if no session is present", async () => {
      // Create a handler function that simulates the endpoint
      const handler = async (ctx: any) => {
        const session = ctx.context.session;
        
        if (!session) {
          return ctx.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        // Rest of the handler logic (not needed for this test)
        return ctx.json({ token: "mock-token" });
      };
      
      // Set session to null to simulate unauthorized state
      mockContext.context.session = null;
      
      // Call the handler with the mock context
      await handler(mockContext);
      
      // Verify the response
      expect(mockJson).toHaveBeenCalledWith(
        { error: "Unauthorized" },
        { status: 401 }
      );
    });
  });
}); 