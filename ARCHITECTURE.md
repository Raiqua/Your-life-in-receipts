# Architecture & System Design Specification

## 1. System Overview

**Your Life, in Receipts** is built as a full-stack reactive application that transforms quantitative financial transaction ledgers into qualitative biographical narratives. It bridges deterministic heuristic data mining with generative artificial intelligence.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│  React 19 • Tailwind CSS v4 • Motion v12 • Lucide Icons • Recharts     │
├────────────────────────────────────────────────────────────────────────┤
│                          APPLICATION LAYER                             │
│  State: useDataset (CSV Streaming/Cache) • useFilters • React Hooks    │
│  Engines: ConnectionEngine • InsightEngine • StoryEngine • AudioSynth  │
├────────────────────────────────────────────────────────────────────────┤
│                           SECURITY PROXY                               │
│  Express 4 • Vite Middleware • Secret Shielding • Strict Route Handlers│
├────────────────────────────────────────────────────────────────────────┤
│                          INTELLIGENCE LAYER                            │
│  Google Gemini 3.8 Flash • @google/genai SDK • Fallback Heuristic Synth│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Heuristic Engines

### 2.1 Connection Engine (`src/services/connectionEngine.ts`)
The connection engine identifies temporal and behavioral affinities across disparate transactions without arbitrary clustering:
- **Temporal Proximity Sliding Window**: Computes the timestamp delta $\Delta t$ between consecutive records. Transactions occurring within 24 hours with distinct categories are linked.
- **Category Sequence Detection**: Prioritizes directed pairs such as `Transportation → Food` or `Food → Entertainment` occurring in tight chronological sequence.
- **Subcategory Rituals**: Identifies repeated instances of domestic staples (e.g. daily milk subscriptions, grocery replenishment) across multi-day intervals.
- **Explainability Invariant**: Every connection generates a typed link with an explicit natural-language explanation (`reason` and `evidence`) explaining the mathematical justification.

### 2.2 Discovery & Insight Engine (`src/services/insightEngine.ts`)
Executes statistical heuristics over the entire receipt array:
- **Frequency Dominance**: Analyzes the Pareto distribution of spending categories.
- **Temporal Anomaly Detection**: Locates peak spending dates and computes the Z-score variance against the 30-day moving average.
- **Micro-Rituals**: Extracts recurring small-value transactions (< ₹100) indicative of personal daily routines (e.g., afternoon tea, train tickets).
- **Landmark Transactions**: Isolates significant inflection points (investments, electronics, medical bills, weddings).

### 2.3 Story Engine & Epoch Segmentation (`src/services/storyEngine.ts`)
Rather than slicing the timeline into arbitrary 12-month calendar buckets, the story engine segments time based on **activity velocity and financial character**:
1. **The Pre-Demonetization Baseline (2014–2016)**: Heavy reliance on physical cash; daily train commutes; frugal sustenance.
2. **The Demonetization Disruption (Nov 2016 – early 2017)**: Rapid drop in physical cash; transition to electronic banking and digital payments.
3. **The Consolidation & Wealth Accumulation Era (2017–2019)**: Structured mutual fund SIPs, fixed deposits, and provident fund deposits.
4. **The Pandemic & Modern Adaptation Era (2020+)**: Lockdown lifestyle, digital subscriptions, reduced transit, domestic replenishment.

---

## 3. Server Architecture & Gemini AI Integration

### 3.1 Security & Zero-Leakage Architecture
The Gemini API key is never exposed to the client browser:
- All LLM interactions route through server-side Express endpoints:
  - `POST /api/ai/interrogate`: Accepts natural language questions, injects condensed dataset metrics and grounded sample receipts, and queries `gemini-3.8-flash`.
  - `POST /api/ai/biography`: Generates structured multi-chapter biographical dossiers.
  - `POST /api/ai/anomalies`: Synthesizes forensic explanations for extreme outlier transactions.
  - `GET /api/health`: Server heartbeat for container readiness probes.

### 3.2 Resilience & Graceful Fallback
When the server operates in environments without an active API key or during network disruptions, the backend seamlessly falls back to a deterministic, high-fidelity **Forensic Synthesizer**. The client UI never encounters an unhandled error state.

---

## 4. Performance & Rendering Strategy

### 4.1 HTML5 Canvas Life Map
- Renders 2,461 nodes at a fluid 60 FPS.
- Avoids React DOM overhead by drawing directly onto an HTML5 Canvas context.
- Implements a spatial bounding-box hit detection algorithm for hovering and clicking nodes.
- Device Pixel Ratio (DPR) scaling guarantees crisp visual fidelity on high-density Retina displays.

### 4.2 Web Audio API Procedural Synthesis (`src/utils/audioUtils.ts`)
- Zero external audio file dependencies.
- Generates click frequencies (800 Hz) and pleasant chord progressions (523 Hz to 659 Hz) directly in browser memory using an `AudioContext` oscillator.
- Includes instantaneous mute toggle and volume leveling.

---

## 5. Accessibility Compliance (WCAG 2.1 AA)

- **Semantic Landmark Structure**: Layout organized with `<header>`, `<nav>`, `<main>`, and `<footer>` containers.
- **Focus Management**: Modals feature auto-focus and `ESC` key escape handlers.
- **Visual Contrast**: Strict compliance with WCAG AA minimum 4.5:1 ratio for normal body copy and 3.0:1 for large display headers.
- **Screen Reader Parity**: Interactive canvas visualizations include accessible companion data tables (`sr-only`) so non-sighted users have full data accessibility.
