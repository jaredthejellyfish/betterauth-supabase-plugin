import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/plugins";
import { sessionMiddleware } from "better-auth/api";
import * as jose from "jose";
import "server-only";

export interface SupabaseJWTOptions {
  /**
   * The secret key used to sign the JWT
   * This should be a secure, random string
   */
  jwtSecret: string;
  /**
   * The expiration time for the JWT
   * @default "1h"
   */
  expiresIn?: string;
  /**
   * Additional claims to include in the JWT
   */
  additionalClaims?: Record<string, string | number | boolean | null>;
}

export const supabaseJWT = (options: SupabaseJWTOptions) => {
  if (!options.jwtSecret) {
    throw new Error("jwtSecret is required for the supabase-jwt plugin");
  }

  const expiresIn = options.expiresIn || "1h";

  return {
    id: "supabase-jwt",
    endpoints: {
      getSupabaseJWT: createAuthEndpoint(
        "/supabase-jwt",
        {
          method: "GET",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          if (!ctx.context.session?.user) {
            throw new Error("User not found in session");
          }

          // Convert the secret to Uint8Array for jose
          const secretKey = new TextEncoder().encode(options.jwtSecret);

          // Create and sign the JWT
          const jwtPayload = {
            id: ctx.context.session.user.id,
            email: ctx.context.session.user.email,
            aud: "authenticated",
            role: "authenticated",
            ...options.additionalClaims,
          };

          const token = await new jose.SignJWT(jwtPayload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(expiresIn)
            .sign(secretKey);

          // Return the JWT
          return ctx.json({
            token,
            user: {
              id: ctx.context.session.user.id,
              email: ctx.context.session.user.email,
            },
          });
        }
      ),
    },
  } satisfies BetterAuthPlugin;
};

// Default export for backwards compatibility
export default { supabaseJWT };
