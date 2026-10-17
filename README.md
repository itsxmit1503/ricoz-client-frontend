# Ricoz Client

Next.js frontend for the Ricoz manufacturing management application.

## Local development

1. Start the Express API from the companion `RicozMFG-main` project on port 5000.
2. Copy `.env.example` to `.env.local` if the API uses a different URL.
3. Install dependencies and start the frontend:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Registration requires email verification before login. The API must be configured with
its database, JWT, CORS (`VITE_FRONTEND_URL=http://localhost:3000`), and email settings.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
