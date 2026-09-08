/**
 * Seed script — run with: npx tsx scripts/seed.ts
 *
 * Inserts dummy Package, SDK, and Tool documents so detail pages can be tested.
 */

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI env var");
  process.exit(1);
}

const client = new MongoClient(uri, {
  tls: true,
  tlsAllowInvalidCertificates: true,
});

const PACKAGES = [
  {
    type: "package",
    name: "@gablura/auth-core",
    slug: "gablura-auth-core",
    description:
      "Core authentication primitives for Gablura. Session management, token handling, and user state in a lightweight, framework-agnostic package.",
    version: "2.0.0",
    repositoryUrl: "https://github.com/gablura/auth-core",
    documentation: {
      overview:
        "The foundational authentication package for the Gablura ecosystem. Provides session management, JWT handling, token refresh logic, and user state primitives that higher-level SDKs build upon.",
      whyItExists:
        "Every authentication implementation reinvents session handling, token refresh, and user state. Auth Core extracts these into a single, tested foundation so SDKs and apps can focus on their specific needs.",
      features:
        "- Framework-agnostic core primitives\n- JWT creation and validation\n- Automatic token refresh\n- Session persistence adapters\n- Type-safe user state management\n- Zero external dependencies",
      installation:
        "```bash\nnpm install @gablura/auth-core\n```",
      quickStart:
        "```ts\nimport { createAuth } from '@gablura/auth-core'\n\nconst auth = createAuth({\n  secret: process.env.AUTH_SECRET,\n  tokenExpiry: '1h',\n  refreshExpiry: '7d',\n})\n\n// Create a session\nconst session = await auth.createSession({ userId: '123' })\n\n// Validate a token\nconst user = await auth.validateToken(session.accessToken)\n```",
      apiReference:
        "createAuth(options)\n\n- secret (string, required): HMAC secret for signing tokens\n- tokenExpiry (string, optional): Access token lifetime, default '1h'\n- refreshExpiry (string, optional): Refresh token lifetime, default '7d'\n- store (SessionStore, optional): Custom session storage adapter\n\nMethods:\n- createSession(data): Create a new session\n- validateToken(token): Validate and decode a JWT\n- refreshTokens(refreshToken): Rotate token pair\n- destroySession(sessionId): Invalidate a session",
      examples:
        "```ts\n// Custom session store\nimport { createAuth, MemoryStore } from '@gablura/auth-core'\n\nconst auth = createAuth({\n  secret: process.env.AUTH_SECRET!,\n  store: new MemoryStore(),\n})\n\n// Middleware helper\nexport async function requireAuth(request: Request) {\n  const token = request.headers.get('Authorization')?.split(' ')[1]\n  if (!token) throw new Error('No token')\n  return auth.validateToken(token)\n}\n```",
      changelog: "v2.0.0 — Breaking: new API surface, dropped legacy adapters",
    },
    authorId: "system",
    authorName: "Gablura",
    status: "published",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    type: "package",
    name: "@gablura/db-core",
    slug: "gablura-db-core",
    description:
      "Database abstraction layer with connection pooling, migration support, and type-safe query building for MongoDB and PostgreSQL.",
    version: "1.3.0",
    repositoryUrl: "https://github.com/gablura/db-core",
    documentation: {
      overview:
        "A lightweight database abstraction that provides consistent APIs across MongoDB and PostgreSQL. Includes connection pooling, migration runners, and type-safe query builders.",
      whyItExists:
        "Switching databases or supporting multiple backends requires rewriting data access layers. Db Core provides a unified interface so applications can swap backends without changing business logic.",
      features:
        "- Unified API for MongoDB and PostgreSQL\n- Connection pooling with configurable limits\n- Migration runner with rollback support\n- Type-safe query builder\n- Transaction support\n- Health check and monitoring hooks",
      installation:
        "```bash\nnpm install @gablura/db-core\n```",
      quickStart:
        "```ts\nimport { createDb } from '@gablura/db-core'\n\nconst db = createDb({\n  driver: 'mongodb',\n  uri: process.env.DATABASE_URL!,\n  pool: { min: 2, max: 10 },\n})\n\nawait db.connect()\n\nconst users = await db.collection('users').find({ role: 'admin' })\n```",
      apiReference:
        "createDb(options)\n\n- driver ('mongodb' | 'postgresql', required)\n- uri (string, required): Connection string\n- pool (PoolOptions, optional): Connection pool settings\n- migrations (string, optional): Path to migration files\n\nMethods:\n- connect(): Establish connection\n- disconnect(): Close all connections\n- collection(name): Get a typed collection handle\n- migrate(): Run pending migrations\n- rollback(): Rollback last migration\n- health(): Check connection status",
      examples:
        "```ts\n// Transactions\nawait db.transaction(async (tx) => {\n  await tx.collection('accounts').updateOne(\n    { _id: userId },\n    { $inc: { balance: -amount } }\n  )\n  await tx.collection('transactions').insertOne({\n    userId,\n    amount,\n    type: 'debit',\n  })\n})\n\n// Migrations\nawait db.migrate()\n```",
      changelog: "v1.3.0 — Added PostgreSQL support",
    },
    authorId: "system",
    authorName: "Gablura",
    status: "published",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    type: "package",
    name: "@gablura/ui-primitives",
    slug: "gablura-ui-primitives",
    description:
      "Headless UI component primitives with full keyboard navigation, ARIA support, and unstyled defaults for custom design systems.",
    version: "1.1.0",
    repositoryUrl: "https://github.com/gablura/ui-primitives",
    documentation: {
      overview:
        "A set of unstyled, accessible UI components built on React. Provides the behavior and accessibility of complex components (dropdowns, modals, tabs) while leaving styling entirely to the consumer.",
      whyItExists:
        "Building accessible UI components from scratch requires deep knowledge of ARIA patterns, keyboard navigation, and focus management. These primitives handle the hard parts so you can focus on design.",
      features:
        "- Full WAI-ARIA compliance\n- Keyboard navigation out of the box\n- Zero styling opinions\n- Composable API\n- Tree-shakeable exports\n- React 19 compatible",
      installation:
        "```bash\nnpm install @gablura/ui-primitives\n```",
      quickStart:
        "```tsx\nimport { Dialog, DialogTrigger, DialogContent } from '@gablura/ui-primitives'\n\nfunction Example() {\n  return (\n    <Dialog>\n      <DialogTrigger>Open</DialogTrigger>\n      <DialogContent>\n        <h2>Hello</h2>\n        <p>This is accessible by default.</p>\n      </DialogContent>\n    </Dialog>\n  )\n}\n```",
      apiReference:
        "Components:\n\n- Dialog, DialogTrigger, DialogContent, DialogClose\n- DropdownMenu, DropdownTrigger, DropdownContent, DropdownItem\n- Tabs, TabsList, TabsTrigger, TabsContent\n- Accordion, AccordionItem, AccordionTrigger, AccordionContent\n- Popover, PopoverTrigger, PopoverContent\n\nAll components accept standard HTML attributes and ref forwarding.",
      examples:
        "```tsx\n// Tabs with custom styling\nimport { Tabs, TabsList, TabsTrigger, TabsContent } from '@gablura/ui-primitives'\n\nfunction Settings() {\n  return (\n    <Tabs defaultValue='account'>\n      <TabsList className='flex gap-2 border-b'>\n        <TabsTrigger value='account' className='px-4 py-2'>Account</TabsTrigger>\n        <TabsTrigger value='security' className='px-4 py-2'>Security</TabsTrigger>\n      </TabsList>\n      <TabsContent value='account'>Account settings</TabsContent>\n      <TabsContent value='security'>Security settings</TabsContent>\n    </Tabs>\n  )\n}\n```",
      changelog: "v1.1.0 — Added Popover component",
    },
    authorId: "system",
    authorName: "Gablura",
    status: "published",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const SDKS = [
  {
    type: "sdk",
    name: "@gablura/auth-sdk",
    slug: "gablura-auth-sdk",
    description:
      "Type-safe client SDK for Gablura Auth. Handles sessions, tokens, and user management with zero configuration.",
    version: "1.0.0",
    repositoryUrl: "https://github.com/gablura/auth-sdk",
    documentation: {
      overview:
        "The Gablura Auth SDK provides a type-safe client for integrating authentication into any JavaScript or TypeScript application. It wraps the core auth primitives into a simple, developer-friendly API.\n\nBuilt on top of @gablura/auth-core, this SDK handles session management, token refresh, and user state automatically.",
      whyItExists:
        "Integrating authentication manually requires handling token storage, refresh logic, session persistence, and edge cases around expired credentials. The Auth SDK removes this complexity by providing a single client that manages all of it.",
      features:
        "- Type-safe API with full TypeScript support\n- Automatic token refresh\n- Session persistence across tabs\n- SSR and CSR compatible\n- Framework-agnostic (works with React, Vue, Svelte, etc.)\n- Built-in error handling and retry logic",
      installation:
        "Install the SDK and its peer dependency:\n\n```bash\nnpm install @gablura/auth-sdk @gablura/auth-core\n```\n\nOr with your preferred package manager:",
      quickStart:
        "Initialize the SDK in your application entry point:\n\n```ts\nimport { createAuthClient } from '@gablura/auth-sdk'\n\nconst auth = createAuthClient({\n  baseUrl: process.env.AUTH_API_URL,\n  apiKey: process.env.AUTH_API_KEY,\n})\n```\n\nThen use it in your components:\n\n```ts\n// Get current user\nconst user = await auth.getUser()\n\n// Sign in\nawait auth.signIn({\n  email: 'user@example.com',\n  password: 'securepassword',\n})\n\n// Sign out\nawait auth.signOut()\n```",
      apiReference:
        "createAuthClient(options)\n\nCreates a new auth client instance.\n\nParameters:\n- baseUrl (string, required): The URL of your auth API\n- apiKey (string, required): Your API key\n- timeout (number, optional): Request timeout in ms, default 10000\n- retries (number, optional): Number of retry attempts, default 3\n\nReturns an AuthClient instance with the following methods:\n\n- getUser(): Promise<User | null> — Get the currently authenticated user\n- signIn(credentials): Promise<Session> — Sign in with email/password\n- signOut(): Promise<void> — Sign out and clear session\n- refresh(): Promise<TokenPair> — Manually refresh tokens\n- onAuthStateChange(callback): Unsubscribe function — Listen for auth state changes",
      examples:
        "```ts\n// React hook example\nimport { useAuth } from '@gablura/auth-sdk/react'\n\nfunction Profile() {\n  const { user, loading, signOut } = useAuth()\n\n  if (loading) return <div>Loading...</div>\n  if (!user) return <div>Not signed in</div>\n\n  return (\n    <div>\n      <h1>{user.name}</h1>\n      <p>{user.email}</p>\n      <button onClick={signOut}>Sign out</button>\n    </div>\n  )\n}\n```\n\n```ts\n// Server-side usage\nimport { createAuthClient } from '@gablura/auth-sdk'\n\nexport async function GET(request: Request) {\n  const auth = createAuthClient({\n    baseUrl: process.env.AUTH_API_URL!,\n    apiKey: process.env.AUTH_API_KEY!,\n  })\n\n  const session = await auth.getSession(request.headers.get('cookie'))\n\n  if (!session) {\n    return new Response('Unauthorized', { status: 401 })\n  }\n\n  return Response.json({ user: session.user })\n}\n```",
      changelog: "v1.0.0 — Initial release",
    },
    authorId: "system",
    authorName: "Gablura",
    status: "published",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    type: "sdk",
    name: "@gablura/db-client",
    slug: "gablura-db-client",
    description:
      "Lightweight MongoDB client SDK with connection pooling, type-safe queries, and automatic reconnection.",
    version: "0.9.0",
    repositoryUrl: "https://github.com/gablura/db-client",
    documentation: {
      overview:
        "A lightweight, type-safe MongoDB client designed for serverless and traditional Node.js environments. Handles connection pooling, retries, and query building with minimal overhead.",
      whyItExists:
        "Standard MongoDB drivers require manual connection management, pooling configuration, and lack built-in type safety. This SDK provides a clean abstraction over the native driver while maintaining full performance.",
      features:
        "- Connection pooling optimized for serverless\n- Type-safe query builder\n- Automatic reconnection on failure\n- Schema validation with Zod\n- Minimal bundle size (< 5KB)\n- No external dependencies",
      installation:
        "```bash\nnpm install @gablura/db-client mongodb\n```",
      quickStart:
        "```ts\nimport { createClient } from '@gablura/db-client'\nimport { z } from 'zod'\n\nconst UserSchema = z.object({\n  name: z.string(),\n  email: z.string().email(),\n})\n\nconst db = createClient({\n  uri: process.env.MONGODB_URI!,\n  schema: { users: UserSchema },\n})\n\n// Insert\nawait db.users.insert({ name: 'Alice', email: 'alice@example.com' })\n\n// Query\nconst user = await db.users.findOne({ email: 'alice@example.com' })\n```",
      apiReference:
        "createClient(options)\n\nCreates a new database client.\n\n- uri (string, required): MongoDB connection string\n- schema (Record, optional): Zod schemas for collections\n- maxPoolSize (number, optional): Max connections, default 10\n- timeout (number, optional): Connection timeout in ms",
      examples:
        "```ts\n// Type-safe queries\nconst users = await db.users.find({\n  age: { $gte: 18 },\n  status: 'active',\n})\n\n// Aggregation\nconst stats = await db.users.aggregate([\n  { $match: { status: 'active' } },\n  { $group: { _id: '$role', count: { $sum: 1 } } },\n])\n```",
      changelog: "v0.9.0 — Beta release",
    },
    authorId: "system",
    authorName: "Gablura",
    status: "published",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    type: "sdk",
    name: "@gablura/api-client",
    slug: "gablura-api-client",
    description:
      "Auto-generated, type-safe API client for REST and GraphQL endpoints with built-in retry and caching.",
    version: "1.2.0",
    repositoryUrl: "https://github.com/gablura/api-client",
    documentation: {
      overview:
        "A fully typed API client that generates TypeScript interfaces from your API schema. Supports REST and GraphQL with automatic retry, caching, and request deduplication.",
      whyItExists:
        "Writing and maintaining API client code manually is error-prone and time-consuming. This SDK generates types from your OpenAPI or GraphQL schema and provides a clean client interface.",
      features:
        "- Auto-generated types from OpenAPI/GraphQL schema\n- Request retry with exponential backoff\n- Response caching with TTL\n- Request deduplication\n- Abort controller support\n- Framework-agnostic",
      installation: "```bash\nnpm install @gablura/api-client\n```",
      quickStart:
        "```ts\nimport { createApiClient } from '@gablura/api-client'\n\nconst api = createApiClient({\n  baseUrl: 'https://api.example.com',\n  schema: './openapi.json',\n})\n\n// Fully typed response\nconst users = await api.users.list({\n  page: 1,\n  limit: 20,\n})\n```",
      apiReference:
        "createApiClient(options)\n\n- baseUrl (string, required): API base URL\n- schema (string | object, required): OpenAPI schema path or object\n- headers (Record, optional): Default headers\n- timeout (number, optional): Request timeout in ms\n- cache (CacheOptions, optional): Caching configuration",
      examples:
        "```ts\n// POST request with typed body\nconst user = await api.users.create({\n  body: { name: 'Bob', email: 'bob@example.com' },\n})\n\n// Error handling\ntry {\n  await api.users.delete({ id: '123' })\n} catch (error) {\n  if (error.status === 404) {\n    console.log('User not found')\n  }\n}\n```",
      changelog: "v1.2.0 — Added GraphQL support",
    },
    authorId: "system",
    authorName: "Gablura",
    status: "published",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const TOOLS = [
  {
    type: "tool",
    name: "@gablura/cli",
    slug: "gablura-cli",
    description:
      "Command-line interface for managing Gablura projects, scaffolding components, and running development tasks.",
    version: "1.1.0",
    repositoryUrl: "https://github.com/gablura/cli",
    documentation: {
      overview:
        "The Gablura CLI is a unified command-line tool for scaffolding, developing, and deploying Gablura projects. It provides generators, dev server, and build optimization out of the box.",
      whyItExists:
        "Setting up new projects, generating boilerplate, and managing build pipelines manually leads to inconsistencies across teams. The CLI standardizes these workflows.",
      features:
        "- Interactive project scaffolding\n- Component and feature generators\n- Optimized dev server with HMR\n- Build analysis and bundle size reporting\n- TypeScript path alias support\n- Environment variable management",
      installation: "```bash\nnpm install -g @gablura/cli\n```",
      quickStart:
        "```bash\n# Create a new project\ngablura init my-project\n\n# Navigate to project\ncd my-project\n\n# Start dev server\ngablura dev\n```\n\nGenerate a new feature:\n\n```bash\ngablura generate feature auth\n```",
      apiReference:
        "Commands:\n\n- init <name> — Create a new project\n- dev — Start development server\n- build — Production build\n- generate <type> <name> — Generate code\n- lint — Run linter\n- test — Run tests",
      examples:
        "```bash\n# Generate a component\ngablura generate component Button\n\n# Generate a feature with all files\ngablura generate feature dashboard --with-actions --with-hooks\n\n# Build with analysis\ngablura build --analyze\n```",
      changelog: "v1.1.0 — Added feature generator",
    },
    authorId: "system",
    authorName: "Gablura",
    status: "published",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    type: "tool",
    name: "@gablura/env-validator",
    slug: "gablura-env-validator",
    description:
      "Validate environment variables at build time and runtime with Zod schemas and clear error messages.",
    version: "1.0.0",
    repositoryUrl: "https://github.com/gablura/env-validator",
    documentation: {
      overview:
        "A lightweight tool for validating environment variables using Zod schemas. Catches missing or invalid variables at build time before they reach production.",
      whyItExists:
        "Missing environment variables are one of the most common causes of production bugs. This tool validates them early with clear, actionable error messages.",
      features:
        "- Build-time and runtime validation\n- Zod schema support\n- Type inference for validated env\n- Clear error messages with fix suggestions\n- Works with Next.js, Vite, and plain Node.js\n- Zero runtime overhead in production",
      installation: "```bash\nnpm install -D @gablura/env-validator zod\n```",
      quickStart:
        "```ts\n// env.ts\nimport { defineEnv } from '@gablura/env-validator'\nimport { z } from 'zod'\n\nexport const env = defineEnv({\n  DATABASE_URL: z.string().url(),\n  API_KEY: z.string().min(32),\n  PORT: z.coerce.number().default(3000),\n})\n```\n\n```ts\n// app.ts\nimport { env } from './env'\n\nconsole.log(env.DATABASE_URL) // typed as string\nconsole.log(env.PORT) // typed as number\n```",
      apiReference:
        "defineEnv(schema)\n\n- schema (ZodObject, required): Zod schema defining env vars\n- Returns validated, typed environment object\n- Throws EnvValidationError with detailed messages if validation fails",
      examples:
        "```ts\n// With .env.example generation\nimport { defineEnv, generateExample } from '@gablura/env-validator'\n\nconst env = defineEnv({\n  DATABASE_URL: z.string().url(),\n  REDIS_URL: z.string().url().optional(),\n})\n\n// Generate .env.example\nawait generateExample(env, '.env.example')\n```",
      changelog: "v1.0.0 — Initial release",
    },
    authorId: "system",
    authorName: "Gablura",
    status: "published",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    type: "tool",
    name: "@gablura/schema-gen",
    slug: "gablura-schema-gen",
    description:
      "Generate TypeScript types, Zod schemas, and validation code from a single source of truth.",
    version: "0.8.0",
    repositoryUrl: "https://github.com/gablura/schema-gen",
    documentation: {
      overview:
        "A code generation tool that takes a schema definition and produces TypeScript types, Zod validators, and API client code from one source of truth.",
      whyItExists:
        "Maintaining types, validators, and API clients separately leads to drift and bugs. Schema Gen keeps everything in sync from a single definition.",
      features:
        "- Generate TypeScript types from JSON Schema\n- Generate Zod validators automatically\n- Generate API client code\n- Watch mode for development\n- Custom templates support\n- CLI and programmatic API",
      installation: "```bash\nnpm install -D @gablura/schema-gen\n```",
      quickStart:
        "```yaml\n# schema.yml\nUser:\n  name: string\n  email: string (email)\n  age: number (min: 0)\n  role: 'admin' | 'user'\n```\n\n```bash\n# Generate all outputs\nschema-gen generate ./schema.yml --output ./src/generated\n```",
      apiReference:
        "Commands:\n\n- generate <schema> — Generate types from schema\n- watch <schema> — Watch for changes and regenerate\n- validate <schema> — Validate schema file\n\nOptions:\n- --output, -o: Output directory\n- --format, -f: Output format (typescript, zod, json-schema)\n- --watch, -w: Watch mode",
      examples:
        "```bash\n# Generate only Zod schemas\nschema-gen generate ./schema.yml --format zod\n\n# Generate with custom template\nschema-gen generate ./schema.yml --template ./my-template.hbs\n\n# Watch mode during development\nschema-gen watch ./schema.yml --output ./src/generated\n```",
      changelog: "v0.8.0 — Beta with watch mode",
    },
    authorId: "system",
    authorName: "Gablura",
    status: "published",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seed() {
  try {
    await client.connect();
    const db = client.db();

    console.log("Connected to MongoDB");

    // Insert Packages
    const pkgCol = db.collection("packages");
    const existingPkgs = await pkgCol.countDocuments();
    if (existingPkgs === 0) {
      const result = await pkgCol.insertMany(PACKAGES);
      console.log(`Inserted ${result.insertedCount} packages`);
    } else {
      console.log(`Skipping packages — ${existingPkgs} already exist`);
    }

    // Insert SDKs
    const sdkCol = db.collection("sdks");
    const existingSdks = await sdkCol.countDocuments();
    if (existingSdks === 0) {
      const result = await sdkCol.insertMany(SDKS);
      console.log(`Inserted ${result.insertedCount} SDKs`);
    } else {
      console.log(`Skipping SDKs — ${existingSdks} already exist`);
    }

    // Insert Tools
    const toolCol = db.collection("tools");
    const existingTools = await toolCol.countDocuments();
    if (existingTools === 0) {
      const result = await toolCol.insertMany(TOOLS);
      console.log(`Inserted ${result.insertedCount} tools`);
    } else {
      console.log(`Skipping tools — ${existingTools} already exist`);
    }

    console.log("Done!");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
