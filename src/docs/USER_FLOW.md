# User Flow

This document explains how users navigate through Pitchrr.

## Main User Journey

```
Landing Page → Register/Login → Dashboard → Modules → Export
```

## Step-by-Step Flow

### 1. Landing Page (`/`)

User arrives and sees:
- Hero section explaining Pitchrr
- 7-step process overview
- CTA to get started

**Actions:** Click "Get Started" → goes to Register

### 2. Authentication (`/register` or `/login`)

- Register with name, email, password
- Login with email, password
- On success: redirect to Dashboard

**Note:** Currently using dummy auth (Clerk placeholder)

### 3. Dashboard (`/dashboard`)

Shows:
- Welcome message
- Overall progress bar
- Cards for each module (7 total)
- Status of each module (not started, in progress, complete)

**Actions:** Click any module card to start

### 4. Module Pages (`/dashboard/[module]`)

Each module has:
- Input section (describe idea, target audience, etc.)
- "Generate with AI" button
- Results section with analysis
- Auto-save (saves to localStorage)
- Export PDF button

### 5. AI Chatbot (`/dashboard/chat`)

- Always available via floating button
- Context-aware (knows user's startup)
- Predefined prompts for quick help
- Free-form chat

## Entry Points

| Entry | Where it goes |
|-------|---------------|
| Direct URL `/` | Landing page |
| Direct URL `/dashboard` | Dashboard (if logged in) or Login |
| Auth redirect | Login → Dashboard |

## Free vs Paid (Future)

Currently all features are free (no backend).

Future paid tiers might include:
- More AI generations
- Advanced analytics
- PDF exports without watermark
