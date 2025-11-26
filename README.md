# SQL Guard

### Infografico
![Imagem do WhatsApp de 2025-11-25 à(s) 21 26 35_4237f0d7](https://github.com/user-attachments/assets/d2d164fb-982c-4141-97c2-15910af21648)

## Overview

SQL Guard is a Vite + React application that showcases secure and insecure authentication flows, log analysis, and defensive patterns for SQL security training. The project combines Supabase functions with a shadcn-ui based interface to highlight best practices.

## Getting Started

1. Install Node.js (v18+) and npm. Using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) is recommended.
2. Clone the repository.

	```sh
	git clone <REPOSITORY_URL>
	cd sql-guard-cybok-main
	```

3. Install dependencies and start the dev server.

	```sh
	npm install
	npm run dev
	```

4. Open the Vite preview URL printed in the terminal to explore the app.

## Available Scripts

- `npm run dev` – start the development server with hot reloading.
- `npm run build` – generate a production build.
- `npm run build:dev` – produce a development-mode build artifact.
- `npm run preview` – serve the production bundle locally.
- `npm run lint` – run ESLint across the project.

## Tech Stack

- Vite 5
- React 18
- TypeScript
- shadcn-ui + Radix UI primitives
- Tailwind CSS
- Supabase functions for backend integrations

## Deployment

Deploy the production bundle to any static host (e.g., Vercel, Netlify, Cloudflare Pages). Run `npm run build` and upload the generated `dist/` directory to your hosting provider of choice.
