# Better Auth Supabase JWT Plugin

This plugin for Better Auth provides JWT authentication for Supabase. It generates JWTs that can be used with Supabase's JWT authentication.

## Installation

```bash
npm install better-auth-supabase-plugin
```

## Usage

### Server-side Setup

```typescript
import { betterAuth } from "better-auth";
import { supabaseJWT } from "better-auth-supabase-plugin";

export const auth = betterAuth({
  plugins: [
    supabaseJWT({
      // Required: Secret key used to sign the JWT
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

```typescript
import { createAuthClient } from "better-auth/client";
import { supabaseJWTClient } from "better-auth-supabase-plugin/client";

export const authClient = createAuthClient({
  plugins: [
    supabaseJWTClient()
  ]
});
```

### Using the JWT in your application

```typescript
import { useStore } from '@nanostores/react'; // or the appropriate framework adapter
import { authClient } from './auth-client';

function MyComponent() {
  // Use the hook to get the JWT
  const { jwt, token, getJWT } = useStore(authClient.useGetJWT);
  
  // Fetch the JWT when the component mounts
  useEffect(() => {
    getJWT();
  }, []);
  
  // Use the token with Supabase client
  useEffect(() => {
    if (token) {
      supabaseClient.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
    }
  }, [token]);
  
  return (
    <div>
      {jwt ? (
        <div>
          <p>User ID: {jwt.user.id}</p>
          <p>User Email: {jwt.user.email}</p>
          <button onClick={getJWT}>Refresh JWT</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
```

## Configuration Options

### Server Plugin Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| jwtSecret | string | Yes | - | Secret key used to sign the JWT |
| expiresIn | string | No | "1h" | JWT expiration time |
| additionalClaims | object | No | {} | Additional claims to include in the JWT |

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