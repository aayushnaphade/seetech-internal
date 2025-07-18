# SeeTech Solutions - Internal Toolbox

A comprehensive internal web application for SeeTech Solutions, providing energy efficiency engineering tools, project management, and analysis capabilities.

## 🏗️ Project Overview

This SaaS-like internal tool is designed for SeeTech Solutions to streamline their energy efficiency consulting work. The application includes:

- **Dashboard**: Real-time KPIs, project tracking, and performance analytics
- **Project Management**: Complete project lifecycle management
- **Energy Calculator**: Automated energy efficiency calculations
- **Proposal Generator**: Professional proposal creation and management
- **Load Analysis**: Equipment load analysis and optimization
- **Equipment Library**: Centralized equipment specifications database

## 🚀 Features

### Core Functionality
- ✅ **Modern Dashboard** with real-time data visualization
- ✅ **Project Management** with status tracking and progress monitoring
- ✅ **Energy Calculations** with automated savings calculations
- ✅ **Proposal Generation** with professional templates
- ✅ **Load Analysis** for equipment optimization
- ✅ **Activity Logging** for audit trails
- ✅ **Equipment Library** with comprehensive specifications

### Technical Features
- 🔄 **Hybrid Database**: SQLite for local development, Turso for production
- 📊 **Interactive Charts**: Real-time data visualization with Recharts
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🎨 **Modern UI**: 44+ shadcn/ui components for consistent design
- 🔒 **Type Safety**: Full TypeScript implementation
- 🚀 **Fast Development**: Next.js 15 with App Router and React 19

## 📋 Tech Stack

### Frontend
- **Next.js 15.4.1** - React framework with App Router
- **React 19.1.0** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Modern component library (44 components)
- **Recharts** - Interactive data visualization

### Backend & Database
- **SQLite** - Local development database
- **Turso** - Cloud SQLite for production
- **Drizzle ORM** - Type-safe database operations
- **Better-sqlite3** - High-performance SQLite driver

### Development Tools
- **ESLint** - Code linting and formatting
- **Drizzle Kit** - Database migrations and management
- **tsx** - TypeScript execution for scripts

## 🗄️ Database Schema

### Core Tables
1. **projects** - Project management and tracking
2. **energy_calculations** - Energy efficiency calculations
3. **proposals** - Proposal generation and management
4. **load_analysis** - Equipment load analysis data
5. **activity_logs** - System activity and audit trails
6. **equipment_library** - Equipment specifications database

### Key Relationships
- Projects → Energy Calculations (1:many)
- Projects → Proposals (1:many)
- Projects → Load Analysis (1:many)
- All tables → Activity Logs (audit trail)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd seetech-internal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create `.env.local` for development:
```env
# Development uses local SQLite - no config needed

# Production (Optional - for Turso cloud database)
DATABASE_URL=your_turso_database_url
DATABASE_AUTH_TOKEN=your_turso_auth_token
```

### 4. Database Setup
```bash
# Generate database schema
npm run db:generate

# Run database migrations
npx tsx src/lib/db/migrate.ts

# Initialize with sample data
npm run db:init
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 📝 Available Scripts

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Management
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:init` - Initialize database with sample data

## 🏃‍♂️ Usage Guide

### Dashboard
The main dashboard provides:
- **KPI Cards**: Total projects, annual savings, energy saved, CO₂ reduction
- **Performance Charts**: Monthly trends and project distribution
- **Recent Activity**: System activity log
- **Project Overview**: Active projects with status tracking

### Project Management
- Create new energy efficiency projects
- Track project status (Planning → In Progress → Completed)
- Monitor savings, energy reduction, and CO₂ impact
- Generate project reports and analytics

### Energy Calculator
- Input equipment specifications
- Calculate energy savings and costs
- Generate detailed efficiency reports
- Store calculations for future reference

### Proposal Generator
- Create professional proposals from templates
- Include project details and calculations
- Export in various formats
- Track proposal status and client feedback

## 🔧 API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `GET /api/projects/stats` - Get project statistics

### Calculations
- `GET /api/calculations` - List all calculations
- `POST /api/calculations` - Create new calculation

### Activities
- `GET /api/activities` - Get recent activity log

## 🎯 Business Value

### For SeeTech Solutions
1. **Efficiency Gains**: Automate manual calculations and reduce project setup time
2. **Data Centralization**: Single source of truth for all energy efficiency projects
3. **Professional Proposals**: Generate consistent, professional client proposals
4. **Performance Tracking**: Monitor business KPIs and project success rates
5. **Audit Trail**: Complete activity logging for compliance and review

### For Clients
1. **Faster Service**: Automated calculations reduce project turnaround time
2. **Professional Presentation**: Consistent, high-quality proposals and reports
3. **Data-Driven Insights**: Comprehensive energy efficiency analysis
4. **Transparent Tracking**: Clear project progress and milestone tracking

## 🔄 Database Migration

### Local Development
The application uses SQLite for local development, stored in `./data/local.db`.

### Production Deployment
For production, the application automatically switches to Turso (cloud SQLite) when the appropriate environment variables are set.

## 📊 Sample Data

The application includes sample data for:
- 3 demo projects (LED retrofit, HVAC upgrade, Solar installation)
- Equipment library with common efficiency equipment
- Activity logs showing system usage
- Calculation examples for different project types

## 🚀 Deployment

### Local Deployment
1. Build the application: `npm run build`
2. Start production server: `npm run start`

### Cloud Deployment
1. Set up Turso database
2. Configure environment variables
3. Deploy to your preferred platform (Vercel, Netlify, etc.)

## 📈 Performance Monitoring

The application includes:
- Real-time KPI tracking
- Performance analytics dashboard
- Activity logging for audit trails
- Error handling and logging

## 🔐 Security Features

- Type-safe database operations
- Input validation and sanitization
- Activity logging for audit trails
- Environment-based configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical support or questions about the SeeTech Internal Toolbox:
- Check the documentation in this README
- Review the code comments and type definitions
- Examine the sample data and API endpoints

## 📄 License

This project is proprietary software developed for SeeTech Solutions.

---

**SeeTech Solutions Internal Toolbox** - Streamlining energy efficiency consulting with modern web technology.
