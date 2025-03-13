# Release Notes - v0.0.2

## Improved Package Exports

This release focuses on improving the package exports to make it easier to import the plugin functions in your projects.

### Changes

- **Enhanced Module Exports**: Updated the package exports configuration to support both ESM and CommonJS environments
- **Improved TypeScript Declarations**: Fixed TypeScript declaration files to properly expose all exported functions
- **Added Default Exports**: Added default exports for backwards compatibility
- **Re-exported Client Plugin**: The client plugin is now re-exported from the main module for easier imports

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

### Development

- Added test file to verify correct exports
- Updated build scripts for better compatibility 