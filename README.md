# Gablura

Gablura is an open-source developer infrastructure platform for discovering, publishing, and managing packages, SDKs, tools, and projects. The project combines a public marketing site, a documentation experience, and a dashboard for managing published resources and developer workflows.

Built with Next.js, TypeScript, MongoDB, and a custom auth layer, Gablura is designed to support a growing ecosystem of reusable developer assets.

## Overview

Gablura brings together:

- Packages for reusable software components
- SDKs for developer integrations
- Tools for engineering workflows
- Projects and ecosystem showcases
- Authentication and dashboard experiences for users
- Public documentation and resource discovery pages

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- MongoDB
- Redis-backed auth/session support
- Vitest for testing
- ESLint for linting

## Project Structure

```text
.
├── app/                     # App Router pages and API routes
│   ├── (auth)/             # Login, register, password reset, verification
│   ├── (public)/           # Public marketing and resource pages
│   ├── api/                # Backend API endpoints
│   ├── dashboard/          # Authenticated dashboard routes
│   ├── layout.tsx
│   ├── globals.css
│   ├── robots.ts
│   └── sitemap.ts
├── components/             # Shared UI components
├── content/                # Content and docs sources
├── features/               # Feature-based modules
│   ├── auth/
│   ├── dashboard/
│   ├── docs/
│   ├── marketing/
│   ├── packages/
│   ├── projects/
│   ├── sdks/
│   └── tools/
├── lib/                    # Shared utilities, auth, DB, resources
├── public/                 # Static assets
├── scripts/                # Seed and maintenance scripts
├── __tests__/              # Test files
├── package.json
├── tsconfig.json
├── next.config.ts
├── vitest.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── README.md
```

## Features

### Public website
The public side includes:

- Home landing page with ecosystem highlights
- Featured package and latest package discovery
- Developer-focused marketing sections
- About, contact, docs, ecosystem, and join pages

### Resource ecosystem
Gablura supports resource discovery and management across:

- Packages
- SDKs
- Tools
- Projects

These resources are served from MongoDB collections and cached for efficient public-page rendering.

### Authentication
The app includes custom auth flows for:

- Sign in
- Registration
- Email verification
- Password reset
- Forgot-password flow

### Dashboard
The dashboard area is organized for managing resource types and user-related information, including:

- Packages
- Projects
- SDKs
- Tools
- Developers
- Users

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- MongoDB instance
- Redis instance for auth/session features

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root with the required values:

```bash
MONGODB_URI="mongodb://localhost:27017/gablura"
AUTH_HMAC_SECRET="replace-with-a-secure-secret"
NEXTAUTH_SECRET="replace-with-a-secure-secret"
NEXTAUTH_URL="http://localhost:3000"
```

The app uses these variables in its auth and database configuration layers.

### Run the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev          # Start the development server
npm run build        # Build the app for production
npm run start        # Run the production build
npm run lint         # Run ESLint
npm run test         # Run the Vitest suite
npm run db:indexes   # Ensure MongoDB indexes exist
```

## Testing

```bash
npm run test
```

## Development Notes

- The app uses the Next.js App Router.
- Resource content is cached and served using Next.js caching utilities.
- MongoDB is used as the primary persistence layer for app resources and auth-related metadata.
- Auth flows are configured with custom callback routes for login, registration, dashboard redirect, email verification, and password recovery.

## License

This project does not currently declare a license in the repository root. If this repo is intended for public reuse, add a license file and corresponding badge before publishing broadly.

## Contributing

Contributions are welcome. For local development, start with the project setup steps above and keep the app's auth and resource data flow consistent with the existing architecture.

## Related

- Next.js: https://nextjs.org
- MongoDB: https://www.mongodb.com
- Redis: https://redis.io
- TypeScript: https://www.typescriptlang.org
```
