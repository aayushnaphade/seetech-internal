# Project Structure

## Root Directory Organization
```
├── src/                    # Source code
├── public/                 # Static assets
├── data/                   # Local SQLite database
├── docs/                   # Documentation
├── .kiro/                  # Kiro configuration
├── .next/                  # Next.js build output
└── node_modules/           # Dependencies
```

## Source Code Structure (`src/`)

### App Router (`src/app/`)
- **Next.js 15 App Router** architecture
- `layout.tsx` - Root layout component
- `page.tsx` - Homepage/dashboard
- `globals.css` - Global styles
- `api/` - API route handlers
- `tools/` - Tool-specific pages
- `knowledge/` - Knowledge base pages

### Components (`src/components/`)
- `ui/` - shadcn/ui components (44+ components)
- `templates/` - Reusable page templates
- `dashboard-layout.tsx` - Main dashboard layout

### Library (`src/lib/`)
- `db/` - Database schema, migrations, and connection logic
- `utils.ts` - Utility functions (cn helper for className merging)

### Utilities (`src/utils/`)
- `thermodynamics/` - Thermodynamic calculation utilities
- `plotting/` - Plotting and visualization utilities
- CoolProp integration for fluid properties

### Supporting Directories
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `styles/` - Additional CSS files

## Database Structure
- **Schema**: `src/lib/db/schema.ts`
- **Migrations**: `src/lib/db/migrations/`
- **Local DB**: `./data/local.db`

## Configuration Files
- `components.json` - shadcn/ui configuration
- `drizzle.config.ts` - Database ORM configuration
- `tsconfig.json` - TypeScript configuration with path aliases
- `.eslintrc.json` & `eslint.config.mjs` - Linting rules
- `.prettierrc` - Code formatting with Tailwind plugin

## Asset Organization
- Static files in `public/` including:
  - JavaScript libraries (CoolProp, Math.js)
  - WASM modules for fluid calculations
  - Images and SVG icons
  - Company branding assets

## Naming Conventions
- **Files**: kebab-case for components and pages
- **Components**: PascalCase for React components
- **Utilities**: camelCase for functions and variables
- **Database**: snake_case for table and column names
- **CSS**: Tailwind utility classes with consistent spacing