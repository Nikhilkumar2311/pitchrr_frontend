# Modules Documentation

Detailed documentation for each of the 7 Pitchrr modules.

---

## 1. Idea Validation

**Goal:** Answer "Is this idea worth pursuing?"

**Features:**
- Idea summary input
- AI viability score (0-100)
- Risk heat map (market, execution, competition, tech)
- SWOT analysis (strengths & weaknesses)
- Market demand snapshot

**Output:** Idea Validation PDF

---

## 2. Marketing Strategy

**Goal:** "How will users find and adopt this product?"

**Features:**
- 30-day marketing plan (week-by-week)
- Marketing funnel (awareness → interest → conversion)
- Channel strategy (online/offline)
- Customer persona builder
- AI-recommended ads strategy

**Output:** Marketing Strategy PDF

---

## 3. Branding

**Goal:** "Give the startup an identity."

**Features:**
- Startup name input
- Brand tone selection
- Color palette picker
- AI-generated taglines
- Font recommendations
- Brand preview

**Output:** Brand Kit ZIP (logo, fonts, guidelines)

---

## 4. Pitch Deck

**Goal:** "Convert the idea into a clear story."

**Features:**
- AI slide generation (7 slides)
- Slide editor
- Slide preview
- Template selection (future)

**Output:** Pitch Deck PDF/PPT

---

## 5. GTM Strategy

**Goal:** "How will this product launch and grow?"

**Features:**
- Target users definition
- Pricing strategy selector
- Launch plan timeline
- Growth loops
- Key metrics (KPIs)

**Output:** GTM Strategy PDF

---

## 6. Competitor Analysis

**Goal:** "Understand where this idea stands in the market."

**Features:**
- Add competitors manually
- AI competitor analysis
- Feature comparison table
- Competitor SWOT
- Pricing comparison

**Output:** Competitor Analysis PDF

---

## 7. Startup AI Chatbot

**Goal:** "Always-on startup mentor."

**Features:**
- Context-aware chat (knows modules)
- Predefined prompts
- Free-form questions
- Chat history

**Output:** Chat transcript (optional PDF)

---

## Data Storage

Currently all module data is stored in **localStorage** (mock backend).

Each module saves:
- User inputs
- Generated analysis
- Last saved timestamp

Keys:
- `pitchrr_idea_validation`
- `pitchrr_marketing_strategy`
- `pitchrr_branding`
- `pitchrr_pitch_deck`
- `pitchrr_gtm_strategy`
- `pitchrr_competitor_analysis`
- `pitchrr_chatbot_messages`
