# Deployment Guide

How to build and deploy Pitchrr.

## Prerequisites

- Node.js 18+
- npm 9+

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Opens at http://localhost:5173
```

## Production Build

```bash
# Create production build
npm run build

# Output in /dist folder
```

## Environment Variables

Create `.env` file in root:

```env
# API URL (backend server)
VITE_API_URL=https://api.your-domain.com

# Optional: Analytics, etc.
VITE_GA_ID=G-XXXXXXXX
```

**Important:** All environment variables for client must be prefixed with `VITE_`.

## Deployment Options

### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo in the Vercel dashboard.

### 2. Netlify

1. Push to GitHub
2. Connect repo in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### 3. Manual (Any Static Host)

```bash
# Build
npm run build

# Upload /dist folder to your host
```

## Post-Deployment Checklist

- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] API CORS configured for domain
- [ ] Test all routes work
- [ ] Check mobile responsiveness
- [ ] Verify GSAP animations load

## Performance Tips

- Images are lazy-loaded
- Routes are code-split
- Use production build (minified)

## Troubleshooting

**Blank page after deploy?**
- Check browser console for errors
- Verify environment variables
- Ensure SPA routing configured (index.html fallback)

**404 on refresh?**
- Configure SPA fallback on host
- All routes should serve index.html
