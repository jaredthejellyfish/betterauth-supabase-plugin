import type {
  BetterAuthClientPlugin,
  BetterFetchOption,
} from "better-auth/client";
import type { supabaseJWT } from ".";
import { atom, computed } from "nanostores";

export interface SupabaseJWTResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

/**
 * Client-side plugin for Supabase JWT authentication
 * Works with the server-side supabaseJWT plugin
 */
export const supabaseJWTClient = () => {
  return {
    id: "supabase-jwt",
    $InferServerPlugin: {} as ReturnType<typeof supabaseJWT>,
    getActions: ($fetch) => {
      return {
        getSupabaseJWT: async (fetchOptions?: BetterFetchOption) => {
          const res = $fetch<SupabaseJWTResponse>("/supabase-jwt", {
            method: "GET",
            ...fetchOptions,
          });
          return res;
        },
      };
    },
    getAtoms: ($fetch) => {
      // Store the JWT response
      const jwtAtom = atom<SupabaseJWTResponse | null>(null);
      
      // Create a computed atom for just the token
      const tokenAtom = computed(jwtAtom, (jwt) => jwt?.token || null);
      
      // Function to fetch and update the JWT
      const fetchJWT = async (): Promise<SupabaseJWTResponse | null> => {
        try {
          const response = await $fetch<SupabaseJWTResponse>("/supabase-jwt", {
            method: "GET",
          });
          
          // Ensure we have a properly formatted response
          if (response && 'token' in response && 'user' in response) {
            jwtAtom.set(response as SupabaseJWTResponse);
            return response as SupabaseJWTResponse;
          }
          return null;
        } catch (error) {
          console.error("Error fetching Supabase JWT:", error);
          return null;
        }
      };
      
      // Create a hook atom that will be used by the framework
      const useGetJWTAtom = atom({
        getJWT: fetchJWT,
        get jwt() { return jwtAtom.get(); },
        get token() { return tokenAtom.get(); },
        isLoading: false,
        error: null
      });
      
      return {
        jwtAtom,
        tokenAtom,
        useGetJWT: useGetJWTAtom
      };
    }
  } satisfies BetterAuthClientPlugin;
};
