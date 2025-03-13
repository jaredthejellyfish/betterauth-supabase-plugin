# Better Auth Supabase JWT Plugin

This plugin for Better Auth provides JWT authentication for Supabase. It generates JWTs that can be used with Supabase's JWT authentication, allowing your Better Auth users to seamlessly authenticate with Supabase services.

## Installation

Using npm:
```bash
npm install better-auth-supabase-plugin
```

Using Bun:
```bash
bun add better-auth-supabase-plugin
```

Using Yarn:
```bash
yarn add better-auth-supabase-plugin
```

## Usage

### Server-side Setup

Add the Supabase JWT plugin to your Better Auth setup:

```typescript
import { betterAuth } from "better-auth";
import { supabaseJWT } from "better-auth-supabase-plugin";

export const auth = betterAuth({
  plugins: [
    supabaseJWT({
      // Required: Secret key used to sign the JWT
      // This should match your Supabase JWT secret
      jwtSecret: process.env.SUPABASE_JWT_SECRET,
      
      // Optional: JWT expiration time (default: "1h")
      expiresIn: "24h",
      
      // Optional: Additional claims to include in the JWT
      additionalClaims: {
        app_metadata: {
          role: "user"
        }
      }
    })
  ]
});
```

### Client-side Setup

Import the client plugin in your frontend code:

```typescript
import { createAuthClient } from "better-auth/client";
import { supabaseJWTClient } from "better-auth-supabase-plugin/client";

export const authClient = createAuthClient({
  plugins: [
    supabaseJWTClient()
  ]
});
```

### Using with Supabase Client

Here's how to use the JWT with the Supabase client in a React component:

```typescript
import { useEffect } from 'react';
import { useStore } from '@nanostores/react'; // or the appropriate framework adapter
import { createClient } from '@supabase/supabase-js';
import { authClient } from './auth-client';

// Initialize Supabase client
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function SupabaseAuthComponent() {
  // Use the hook to get the JWT
  const { jwt, token, getJWT } = useStore(authClient.useGetJWT);
  
  // Fetch the JWT when the component mounts
  useEffect(() => {
    getJWT();
  }, []);
  
  // Set the Supabase session when the token is available
  useEffect(() => {
    if (token) {
      supabase.auth.setSession({
        access_token: token,
        refresh_token: '', // No refresh token needed for JWT auth
      });
      
      // Now you can use supabase client with the authenticated session
      // For example:
      supabase.from('your_table').select('*').then(console.log);
    }
  }, [token]);
  
  return (
    <div>
      {jwt ? (
        <div>
          <h2>Authenticated with Supabase</h2>
          <p>User ID: {jwt.user.id}</p>
          <p>User Email: {jwt.user.email}</p>
          <button onClick={getJWT}>Refresh JWT</button>
        </div>
      ) : (
        <p>Loading authentication...</p>
      )}
    </div>
  );
}
```

### Using with Other Frameworks

#### Vue.js

```typescript
import { computed, onMounted, ref } from 'vue';
import { useStore } from '@nanostores/vue';
import { authClient } from './auth-client';

export default {
  setup() {
    const authStore = useStore(authClient.useGetJWT);
    
    onMounted(() => {
      authStore.value.getJWT();
    });
    
    const isAuthenticated = computed(() => !!authStore.value.token);
    
    return {
      auth: authStore,
      isAuthenticated
    };
  }
};
```

#### Svelte

```svelte
<script>
  import { useStore } from '@nanostores/svelte';
  import { authClient } from './auth-client';
  import { onMount } from 'svelte';
  
  const auth = useStore(authClient.useGetJWT);
  
  onMount(() => {
    auth.getJWT();
  });
</script>

{#if $auth.jwt}
  <p>User ID: {$auth.jwt.user.id}</p>
  <p>User Email: {$auth.jwt.user.email}</p>
  <button on:click={() => $auth.getJWT()}>Refresh JWT</button>
{:else}
  <p>Loading...</p>
{/if}
```

## API Reference

### Server Plugin Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| jwtSecret | string | Yes | - | Secret key used to sign the JWT. Must match your Supabase JWT secret |
| expiresIn | string | No | "1h" | JWT expiration time in [zeit/ms](https://github.com/vercel/ms) format |
| additionalClaims | object | No | {} | Additional claims to include in the JWT payload |

### Client Plugin

The client plugin provides the following atoms and actions:

#### Atoms
- `jwtAtom`: Stores the full JWT response
- `tokenAtom`: Computed atom that extracts just the token
- `useGetJWT`: Main atom for use with framework adapters

#### Actions
- `getSupabaseJWT()`: Fetches a new JWT from the server

## JWT Payload

The generated JWT includes the following claims:

```json
{
  "id": "user-id",
  "email": "user-email",
  "aud": "authenticated",
  "role": "authenticated",
  // Any additional claims provided in additionalClaims
}
```

## Security Considerations

- Store your JWT secret securely and never expose it in client-side code
- Use environment variables to manage your JWT secret
- Consider using a strong, randomly generated secret key
- Rotate your JWT secret periodically for enhanced security
- Set an appropriate expiration time for your JWTs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 