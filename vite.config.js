import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const previewMode = process.env.BASE44_PREVIEW_MODE === '1';

// In the Base44 sandbox the dev server is reached through a proxy, so the
// request host is not localhost. Allow only the sandbox/preview hosts, and only
// while the preview flag is on.
const allowedHosts = [];
if (previewMode) {
  if (process.env.BASE44_SANDBOX_HOST_DOMAIN) {
    allowedHosts.push(`.${process.env.BASE44_SANDBOX_HOST_DOMAIN}`);
  }
  if (process.env.BASE44_PUBLIC_HOST_SUFFIX) {
    allowedHosts.push(`3000-${process.env.BASE44_PUBLIC_HOST_SUFFIX}`);
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    ...(allowedHosts.length ? { allowedHosts } : {}),
  },
});
