import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    middleware: {
      async handle(req, res, next) {
        const cspHeader =
          import.meta.env.NODE_ENV === 'production'
            ? "script-src 'self' https://js.stripe.com; frame-src 'self' https://js.stripe.com; connect-src 'self' https://api.stripe.com"
            : "script-src 'self' 'unsafe-eval' https://js.stripe.com; frame-src 'self' https://js.stripe.com; connect-src 'self' https://api.stripe.com";

        res.setHeader('Content-Security-Policy', cspHeader);

        await next();
      },
    },
  },
});
