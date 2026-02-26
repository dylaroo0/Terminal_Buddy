# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Framework Overview

This is the **Dashboard Development Framework (BMAD-Adapted)** - a systematic, agent-driven framework for building professional control panels and dashboards. The framework uses specialized AI agents to guide development from requirements through deployment.

## Core Architecture

### Agent-Based System
The framework operates through 7 specialized agents, each with specific roles:

- **Dashboard Master** (`@dashboard-master`) - Universal task executor for all dashboard operations
- **Dashboard Orchestrator** (`@dashboard-orchestrator`) - Workflow coordination and project planning
- **Dashboard Architect** (`@dashboard-architect`) - Technical architecture and system design
- **UI/UX Designer** (`@ui-designer`) - Visual design and user experience
- **Data Integration Specialist** (`@data-integrator`) - Backend data connections and processing
- **Component Developer** (`@component-dev`) - Interactive component implementation
- **Testing & Validation Specialist** (`@dashboard-qa`) - Quality assurance and testing

### Framework Structure
```
agents/           # AI agent definitions and personas
tasks/           # Executable workflow tasks
templates/       # Document generation templates
workflows/       # Complete workflow definitions
checklists/      # Quality assurance checklists
core-config.yaml # Framework configuration
```

## Essential Commands

### Agent Activation
```bash
# Universal task executor (recommended starting point)
@dashboard-master

# Workflow coordination
@dashboard-orchestrator
*guide    # Get workflow guidance

# Create comprehensive requirements
@dashboard-master
*requirements

# Modern architecture with Refine.dev + Supabase
@dashboard-architect
*create           # Architecture with modern stack
*refine-setup     # Refine.dev project setup
*supabase-setup   # Supabase integration

# Visual design and UX
@ui-designer
*mockup

# Modern component development (Refine + shadcn/ui)
@component-dev
*shadcn-setup     # 2-4 hour shadcn/ui integration
*chart / *control / *widget / *table / *form
*realtime         # Setup Supabase real-time features

# Supabase data integration
@data-integrator
*supabase-setup   # Configure Supabase project
*schema           # Design database schema
*rls              # Configure Row Level Security
*realtime         # Setup real-time subscriptions
*auth             # Configure authentication

# Testing and validation
@dashboard-qa
*test / *performance / *accessibility / *security
```

### Core Workflow Commands
All agents support these standard patterns:
- `*help` - Show available commands
- `*task {task-name}` - Execute specific task
- `*create-doc {template}` - Generate documents from templates

## Technology Stack (Modern 2024 Configuration)

### Recommended Modern Stack (Default)
- **Frontend Framework**: React + TypeScript
- **Dashboard Framework**: Refine.dev (eliminates months of CRUD development)
- **UI Components**: shadcn/ui (modern, accessible, copy-paste approach)
- **Backend**: Supabase (PostgreSQL + instant APIs)
- **Deployment**: Vercel + Supabase Cloud
- **Styling**: Tailwind CSS (integrated with shadcn/ui)
- **Charts**: Recharts
- **State Management**: Refine's built-in + Zustand

### Key Benefits of Modern Stack
- **Development Speed**: 1-2 weeks to MVP vs 2-3 months traditional
- **Quality**: Enterprise-grade security and performance by default
- **Accessibility**: Built-in via Radix UI primitives (shadcn/ui)
- **Real-time**: Native support for live dashboard updates
- **Type Safety**: TypeScript throughout the entire stack

### Alternative Technologies (Legacy Support)
- **Frontend**: Vue, Streamlit, Dash
- **UI Libraries**: Material-UI, Ant Design, Chakra UI
- **Backend**: FastAPI, Express.js, Flask, Django
- **Database**: MongoDB, InfluxDB (though PostgreSQL via Supabase is recommended)
- **Deployment**: Docker, Kubernetes, AWS, Azure, GCP

## Development Workflow

### Modern Development Process (1-2 Weeks to MVP)
1. **Project Planning**: Use `@dashboard-orchestrator` → `*guide`
2. **Requirements**: Use `@dashboard-master` → `*requirements`
3. **Modern Architecture**: Use `@dashboard-architect` → `*refine-setup` + `*supabase-setup`
4. **Design**: Use `@ui-designer` → `*mockup`
5. **Supabase Setup**: Use `@data-integrator` → `*supabase-setup` + `*schema` + `*rls`
6. **shadcn/ui Integration**: Use `@component-dev` → `*shadcn-setup` (2-4 hours)
7. **Component Development**: Use `@component-dev` → `*chart` / `*table` / `*form` etc.
8. **Real-time Features**: Use `@data-integrator` → `*realtime`
9. **Testing**: Use `@dashboard-qa` for comprehensive validation
10. **Deployment**: Vercel + Supabase (automatic via Git)

### Traditional Development Process (2-3 Months)
Use the legacy workflow when modern stack isn't suitable:
1. **Project Planning**: Use `@dashboard-orchestrator` → `*guide`
2. **Requirements**: Use `@dashboard-master` → `*requirements`
3. **Architecture**: Use `@dashboard-architect` → `*create`
4. **Design**: Use `@ui-designer` → `*mockup`
5. **Implementation**: Use `@component-dev` for each component
6. **Integration**: Connect components and data sources
7. **Testing**: Use `@dashboard-qa` for comprehensive validation
8. **Deployment**: Use `@dashboard-architect` for deployment setup

### Document Generation
The framework generates structured documents in `docs/`:
- `dashboard-requirements.md` - Comprehensive requirements document
- `dashboard-architecture.md` - Technical architecture specification (includes modern stack)
- `refine-project-setup.md` - Refine.dev project initialization guide
- `supabase-integration.md` - Supabase configuration and integration
- `dashboard-mockups.md` - UI/UX design and wireframes

### Quality Gates
Every project must pass these validation checkpoints:
- Requirements complete and approved
- Architecture reviewed and validated
- Design mockups created and approved
- Components developed and tested
- Data integration working correctly
- Performance benchmarks met
- Accessibility compliance validated
- Security validation passed
- Deployment ready and verified

## Framework Configuration

### Core Config (core-config.yaml)
- Project documents stored in `docs/`
- Components implemented in `src/components`
- Tests located in `tests/`
- Framework version: 1.0.0
- Markdown exploder enabled for detailed documentation

### Workflow Selection
Choose workflow based on complexity:
- **Simple Dashboard**: Single data source, basic visualizations
- **Standard Dashboard**: Multiple components, moderate complexity
- **Complex Dashboard**: Multiple data sources, real-time updates, advanced features
- **Real-time Dashboard**: Live data streams, performance-critical

## Component Development Patterns

### Interactive Components
- **Charts**: Line, bar, pie, scatter, heatmaps, gauges
- **Controls**: Filters, date pickers, dropdowns, toggles
- **Widgets**: KPI displays, status indicators, summaries
- **Tables**: Data grids with sorting, filtering, pagination

### Development Standards
- TypeScript for type safety
- Component testing with >80% coverage
- Performance optimization (load time < 3s, interaction < 500ms)
- Mobile-responsive design
- WCAG AA accessibility compliance

## Data Integration Patterns

### Supported Data Sources
- REST APIs and GraphQL endpoints
- SQL databases (PostgreSQL, MySQL)
- NoSQL databases (MongoDB)
- Time-series databases (InfluxDB)
- File imports (CSV, JSON, XML)
- Real-time data streams
- Cloud services and external APIs

### Data Processing
- Data validation and cleaning
- Calculated fields and derived metrics
- Aggregation and summarization
- Caching strategies with Redis
- Real-time updates and streaming

## Security and Performance

### Security Requirements
- Input validation and sanitization
- Authentication and authorization
- Data encryption (at rest and in transit)
- API security and rate limiting
- GDPR/HIPAA compliance support

### Performance Standards
- Page load time < 3 seconds
- Interactive response time < 500ms
- Efficient handling of large datasets
- Real-time updates without blocking UI
- Mobile-responsive design

## Common Usage Patterns

### Quick Start for Modern Dashboard (Recommended)
```bash
# 1. Define requirements
@dashboard-master
*requirements
# Follow interactive prompts to define project requirements

# 2. Generate modern architecture
@dashboard-architect
*refine-setup     # Creates Refine.dev project setup guide
*supabase-setup   # Creates Supabase integration guide

# 3. Configure Supabase backend
@data-integrator
*supabase-setup   # Set up Supabase project
*schema           # Design database schema
*rls              # Configure Row Level Security

# 4. Set up modern UI components
@component-dev
*shadcn-setup     # Integrate shadcn/ui (2-4 hours)

# 5. Develop dashboard components
@component-dev
*chart            # Chart components with Refine + shadcn/ui
*table            # Data tables with Refine patterns
*form             # Forms with Refine CRUD operations
*realtime         # Real-time features with Supabase

# Result: Working dashboard in 1-2 weeks
```

### Quick Start for Traditional Dashboard (Legacy)
```bash
@dashboard-master
*requirements
# Follow interactive prompts to define project requirements

@dashboard-architect
*create
# Generate technical architecture based on requirements

@ui-designer
*mockup
# Create visual design and user experience

@component-dev
*chart  # Develop chart components
*table  # Develop table components
# Continue for each component type needed
```

### Testing and Validation
```bash
@dashboard-qa
*test           # Functional testing
*performance    # Performance validation
*accessibility  # WCAG compliance
*security       # Security validation
```

### Troubleshooting
- Use `*help` with any agent to see available commands
- Check `core-config.yaml` for framework configuration
- Review workflow files in `workflows/` for detailed process guidance
- Use quality checklists in `checklists/` for validation requirements

## File Organization Best Practices

### Generated Documents
- Save requirements as `docs/dashboard-requirements.md`
- Save architecture as `docs/dashboard-architecture.md`
- Save design mockups as `docs/dashboard-mockups.md`

### Component Structure
- Components: `src/components/`
- Pages: `src/pages/`
- Services: `src/services/`
- Tests: `tests/`

## Refine.dev Integration Benefits

### Revolutionary Development Speed
The integration of Refine.dev + Supabase + shadcn/ui transforms the framework from a planning tool into a complete solution:

- **Time to MVP**: Reduced from 2-3 months to 1-2 weeks
- **Code Quality**: Enterprise-grade by default through modern tooling
- **Accessibility**: WCAG AA compliance built-in via Radix UI
- **Performance**: Optimized bundle sizes and real-time capabilities
- **Maintainability**: Modern React patterns with TypeScript throughout

### Modern Stack Advantages
- **No Backend Development**: Supabase provides instant PostgreSQL APIs
- **Professional UI**: shadcn/ui delivers 2024-quality components
- **CRUD Operations**: Refine eliminates months of form and table development
- **Real-time Updates**: Built-in WebSocket subscriptions for live dashboards
- **Type Safety**: End-to-end TypeScript for reduced bugs

### Quick Integration Timeline
- **Hour 0-4**: shadcn/ui setup and theme customization
- **Day 1**: Supabase project and schema design
- **Week 1**: Core dashboard components and CRUD operations
- **Week 2**: Real-time features and production deployment

This framework ensures systematic, high-quality dashboard development with professional results through its structured agent-based approach, modern technology integration, and comprehensive quality validation process.