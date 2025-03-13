# Release Notes - v0.0.3

## Server-Only Integration

This release adds integration with the "server-only" package to ensure certain code only runs on the server.

### Changes

- **Added Server-Only Package**: Integrated the "server-only" package to prevent server-side code from being executed in client environments
- **Improved Type Safety**: Enhanced type definitions for better developer experience
- **Dependency Updates**: Updated dependencies to their latest compatible versions

### Usage

The API remains the same as in previous versions:

```typescript
import { supabaseJWT } from "better-auth-supabase-plugin";

const plugin = supabaseJWT({
  jwtSecret: "your-secret-key"
});
```

---

# Release Notes - v0.0.2

## Improved Package Exports

This release focuses on improving the package exports to make it easier to import the plugin functions in your projects.

### Changes

- **Enhanced Module Exports**: Updated the package exports configuration to support both ESM and CommonJS environments
- **Improved TypeScript Declarations**: Fixed TypeScript declaration files to properly expose all exported functions
- **Added Default Exports**: Added default exports for backwards compatibility
- **Re-exported Client Plugin**: The client plugin is now re-exported from the main module for easier imports
- **Switched to tsup**: Replaced Bun build with tsup for more reliable TypeScript builds and declaration file generation

### Usage Examples

#### Server-side Plugin

```typescript
// Named import (recommended)
import { supabaseJWT } from "better-auth-supabase-plugin";

// Usage
const plugin = supabaseJWT({
  jwtSecret: "your-secret-key"
});
```

#### Client-side Plugin

```typescript
// Import from main module
import { supabaseJWTClient } from "better-auth-supabase-plugin";

// Or import from client subpath
import { supabaseJWTClient } from "better-auth-supabase-plugin/client";

// Usage
const clientPlugin = supabaseJWTClient();
```

### Bug Fixes

- Fixed issue with TypeScript declaration files not being generated correctly
- Improved build process to ensure consistent output
- Resolved TypeScript error TS5055 related to declaration file generation

### Development

- Added test file to verify correct exports
- Updated build scripts for better compatibility
- Added dual ESM/CommonJS output format support 