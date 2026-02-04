// src/lib/config/env.ts
// Environment configuration.
// Server-only values are accessed directly in lib/server/ modules.
// This file keeps a minimal public config for client-side needs.

export const ENV = {
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? '',
};
