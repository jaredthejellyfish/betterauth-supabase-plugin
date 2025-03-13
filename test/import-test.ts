// Test importing from the main package
import { supabaseJWT } from "../index";
import defaultExport from "../index";

// Test importing from the client package
import { supabaseJWTClient } from "../client-plugin";
import clientDefaultExport from "../client-plugin";

// Verify the imports
console.log("Main export:", typeof supabaseJWT === 'function');
console.log("Default export:", typeof defaultExport.supabaseJWT === 'function');
console.log("Client export:", typeof supabaseJWTClient === 'function');
console.log("Client default export:", typeof clientDefaultExport === 'function');

// Test creating a plugin instance
const plugin = supabaseJWT({ jwtSecret: "test-secret" });
console.log("Plugin ID:", plugin.id);

// Test creating a client plugin instance
const clientPlugin = supabaseJWTClient();
console.log("Client Plugin ID:", clientPlugin.id); 