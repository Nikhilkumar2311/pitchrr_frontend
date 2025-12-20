# Pitchrr - Startup Idea Validation & Creation Platform

Pitchrr is an AI-powered SaaS tool that helps first-time founders validate, brand, and pitch their startup ideas. It guides users through a 7-step process to go from raw idea to investor-ready materials.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📋 What Pitchrr Does

1. **Idea Validation** - Score your idea, identify risks, get SWOT analysis
2. **Marketing Strategy** - 30-day plan, customer personas, channel strategy
3. **Branding** - Logo, colors, fonts, taglines, brand kit
4. **Pitch Deck** - AI-generated slides, professional templates
5. **GTM Strategy** - Launch plan, pricing, growth loops
6. **Competitor Analysis** - Feature comparison, competitive positioning
7. **AI Chatbot** - Always-on startup mentor

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Tailwind CSS 4 | Styling |
| Vite | Build Tool |
| React Router v6 | Routing |
| TanStack Query | Server State |
| Zustand | Client State |
| Framer Motion | Animations |
| GSAP | Landing Page Animations |
| react-hot-toast | Notifications |

## 📁 Project Structure

```
src/
├── app/           # App setup (router, providers)
├── pages/         # Route pages
├── layout/        # Layout components
├── features/      # Feature modules
├── components/
│   ├── ui/        # Base UI components
│   ├── common/    # Shared components
│   └── skeletons/ # Loading skeletons
├── services/      # API layer
├── store/         # Zustand stores
├── hooks/         # Custom hooks
├── utils/         # Helper functions
├── types/         # TypeScript types
└── docs/          # Documentation
```

## 📖 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Folder structure & data flow
- [USER_FLOW.md](./USER_FLOW.md) - User journey through the app
- [MODULES.md](./MODULES.md) - Detailed module documentation
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) - When to use Query/Zustand/local
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Build & deployment guide

## 🔑 Environment Variables

Create a `.env` file in the root:

```
VITE_API_URL=http://localhost:3000/api
```

## 👥 For New Developers

This codebase is designed to be beginner-friendly:
- Every file has comments explaining its purpose
- Functions are kept short and focused
- Naming is descriptive over clever
- Complex logic is avoided where possible

Start by reading the [ARCHITECTURE.md](./ARCHITECTURE.md) file.
