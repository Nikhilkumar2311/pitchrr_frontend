# Architecture Guide

This document explains how the Pitchrr codebase is organized.

## Folder Structure

```
src/
├── app/           # Application-level setup
├── pages/         # Route-level pages
├── layout/        # Layout components
├── features/      # Module features
├── components/    # Reusable components
├── services/      # API communication
├── store/         # Global state (Zustand)
├── hooks/         # Custom React hooks
├── utils/         # Helper functions
├── types/         # TypeScript definitions
└── docs/          # Documentation
```

## Data Flow

```
User Action → Component → Store/Query → API → Response → Update UI
```

### When to Use What:

| Type | Use For | Example |
|------|---------|---------|
| **Local State** | UI-only state | Form inputs, modals open/closed |
| **Zustand** | App-wide client state | Auth, sidebar open/closed |
| **React Query** | Server data | API responses, cached data |

## Key Technologies

### React Query
- Manages data fetching and caching
- Handles loading/error states
- Auto-refetches stale data

### Zustand
- Simple global state
- No boilerplate like Redux
- Persists to localStorage

### Tailwind CSS
- Utility-first styling
- No separate CSS files
- Custom theme via CSS variables

## Request Flow

```
Component
    ↓
useQuery/useMutation (React Query)
    ↓
services/api.ts (Axios instance)
    ↓
Backend API
    ↓
Response cached by React Query
```

## Routing

React Router v6 with lazy loading:

```
/                    → Landing page
/login               → Login (public)
/register            → Register (public)
/dashboard           → Dashboard (protected)
/dashboard/idea      → Idea Validation
/dashboard/marketing → Marketing Strategy
/dashboard/branding  → Branding
/dashboard/pitch     → Pitch Deck
/dashboard/gtm       → GTM Strategy
/dashboard/competitors → Competitor Analysis
/dashboard/chat      → AI Chatbot
```
