# Technology Stack

## Framework & Runtime
- **Next.js 15.4.1** with App Router architecture
- **React 19.1.0** with modern features
- **TypeScript** for type safety throughout the codebase
- **Node.js 18+** runtime requirement

## Frontend Stack
- **Tailwind CSS v4** for utility-first styling
- **shadcn/ui** component library (44+ components, "new-york" style)
- **Lucide React** for icons
- **Recharts** for data visualization and charts
- **React Plotly.js** for advanced plotting

## Backend & Database
- **SQLite** for local development (stored in `./data/local.db`)
- **Turso** (cloud SQLite) for production
- **Drizzle ORM** with type-safe database operations
- **Better-sqlite3** driver for high performance

## Development Tools
- **ESLint** with Next.js core web vitals rules
- **Prettier** with Tailwind CSS plugin for formatting
- **Drizzle Kit** for database migrations
- **tsx** for TypeScript script execution

## Common Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Operations
```bash
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations  
npm run db:init      # Initialize database with sample data
```

## Build Configuration
- **Turbopack** enabled for faster development builds
- ESLint and TypeScript errors ignored during builds for faster iteration
- React Strict Mode disabled for performance
- Path aliases configured: `@/*` maps to `./src/*`

## Environment Setup
- Development uses local SQLite (no configuration needed)
- Production requires `DATABASE_URL` and `DATABASE_AUTH_TOKEN` for Turso