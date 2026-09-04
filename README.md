# 🚆 SOLVEX – Indian Railways Block Planning & Decision Support Portal

> **Integrated Corridor Block Planning, Conflict Resolution & Real-Time Decision Support System**  
> *Designed for CRIS (Centre for Railway Information Systems) & Ministry of Railways Operations.*

---

## 📖 Overview

**SOLVEX** is an enterprise-grade railway operations portal engineered to automate and optimize **Corridor Maintenance Block Planning** across high-density Indian Railways routes. It integrates civil engineering (Engg), overhead electrification (OHE/TRD), and signaling & telecommunication (S&T) maintenance requests into unified shadow blocks, drastically reducing train detentions, punctuality loss, and scheduling conflicts.

---

## 🌟 Key Capabilities

### 1. 👥 Multi-Tier Role-Based Access Control & Division Selection
- **Railway Division Selection**: Support for operational divisions (**Palakkad Division**, **Thiruvananthapuram Division**, **Chennai Division**, **Mysuru Division**).
- **Divisional Authority & Block Planner Console**: Seamless credential sign-in and division state synchronization.
- **Section Controller & Field Officers**: Live execution, machine logging, and contingency sign-off.

### 2. 🗺️ 3-Level Hierarchical Track Network & Work Zone Drill-Down
- **Level 1 (Division Map)**:
  - Macro corridor topology showing primary stations (**PGT**, **OTP**, **SRR**, **TIR**, **CLT**, **TCR**, **POY**) and operational railway sections.
  - Lines between stations strictly represent **Railway Sections** (avoiding visual misconceptions that entire sections are blocked).
  - Clear interaction cues: *"Click section to view stations"*.
- **Level 2 (Section Detail Map)**:
  - Deep-dive into active corridor (e.g., **Shoranur Jn ↔ Tirur**).
  - Intermediate station nodes rendered clearly (**SRR**, **PTB**, **PUM**, **KTU**, **TNA**, **TIR**). Strictly adheres to railway terminology (*Station / Station Node*, never *substation*).
  - Dual track layout (UP Line & DN Line) with crossovers and live train markers.
- **Level 3 (Localized Maintenance Work Zones)**:
  - Highlighting specific track possessions (e.g., between **Pattambi** & **Pallippuram** on UP Line, km 598/200–601/400).
  - Isolates maintenance impact to the exact work zone rather than displaying whole sections under maintenance.

### 3. ⚡ SolveX Innovation: Multi-Department Corridor Bundling
- **DETECT ➔ BUNDLE ➔ OPTIMIZE ➔ SCORE IMPACT ➔ REPLAN ➔ EXPLAIN ➔ APPROVE**:
  - Automatically identifies overlapping civil engineering (tamping), electrical TRD (OHE inspection), and S&T (axle counter calibration) requisitions.
  - Generates unified coordinated corridor possession windows (e.g., **02:30 – 03:30 IST**), saving 50+ minutes of isolated track downtime and eliminating conflicts with passenger trains (e.g., Express 12617).
  - Dynamic Alternative Windows comparison with operational impact and delay tradeoffs.
  - One-click **Officer Sanction & Approval Action** that issues direct clearance orders.

### 4. 🧠 Intelligent Optimization & Window Recommendation Engine
- Heuristic and constraint-satisfaction optimization that searches for minimal-impact maintenance windows.
- Calculates corridor throughput scores, punctuality penalty estimations, and machine-gang utilization metrics.

### 5. ⚠️ Conflict Detection & Risk Assessment
- Instant identification of spatial conflicts, headway violations, and power supply (OHE isolation) dependencies.
- Severity-graded alert system (Critical, High, Medium) with one-click resolution proposals.

### 6. 🔄 Delay Management & Rescheduling Simulator
- **What-If Scenario Simulation**: Test the downstream ripple effects of extended blocks or emergency speed restrictions.
- Live block burst and extension reporting with automated contingency route planning.

### 7. 📊 Executive Analytics & MIS Reports
- Block adherence rates (% planned vs. % granted vs. % executed).
- Departmental utilization breakdown (Civil, Electrical, S&T, Mechanical).
- Train detention hours saved through integrated corridor blocking.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailored Design System with pure CSS3 (CRIS / Indian Railways aesthetic standards)
- **Icons**: Lucide React
- **Build Tool**: Vite & Rolldown
- **State Management**: React Context API with persistent session support

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adnansaraf/files-pasted-by-the-user-build.git
   cd files-pasted-by-the-user-build
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview the production build:**
   ```bash
   npm run preview
   ```

---

## 📂 Project Architecture

```
files-pasted-by-the-user-build/
├── dist/                  # Production build output
├── public/                # Static assets & icons
├── src/
│   ├── components/        # Core UI & visualization components
│   │   ├── BlockDetailModal.tsx   # Detailed block inspector & delay logger
│   │   ├── GanttTimeline.tsx      # 24-hr multi-track visual block scheduler
│   │   ├── RequestModal.tsx       # Formal block requisition submission modal
│   │   ├── SchematicMap.tsx       # Interactive corridor track schematic
│   │   ├── Sidebar.tsx            # Navigation drawer with quick metrics
│   │   └── Topbar.tsx             # Role switcher, search & alert bar
│   ├── context/
│   │   └── AppContext.tsx         # Central application state & action dispatchers
│   ├── data/
│   │   └── mockData.ts            # Realistic IR corridor, train & block datasets
│   ├── pages/                     # Application views
│   │   ├── ActiveBlocksPage.tsx   # Real-time ongoing blocks & monitoring
│   │   ├── BlockPlannerPage.tsx   # Master scheduling grid & timetable view
│   │   ├── ConflictsPage.tsx      # Conflict matrix & safety resolution hub
│   │   ├── LoginPage.tsx          # Role-based credential verification
│   │   ├── NetworkPage.tsx        # Section topology & signal inspection
│   │   ├── OptimizerPage.tsx      # AI recommendations & throughput engine
│   │   ├── OverviewPage.tsx       # Operations dashboard & executive KPIs
│   │   ├── PlanReviewPage.tsx     # Sanctioning & multi-department sign-offs
│   │   ├── ReportsPage.tsx        # MIS adherence & delay performance reports
│   │   ├── RequestsPage.tsx       # Block requisition backlog & approval workflow
│   │   ├── ReschedulingPage.tsx   # Contingency handling & rescheduling desk
│   │   ├── SettingsPage.tsx       # System parameters & corridor configurations
│   │   └── SimulatorPage.tsx      # What-If impact & punctuality loss calculator
│   ├── types/
│   │   └── index.ts               # Complete TypeScript data model definitions
│   ├── App.tsx                    # Main layout & router orchestration
│   ├── main.tsx                   # Application bootstrap
│   └── style.css                  # Indian Railways design system & UI tokens
├── index.html                     # HTML5 entry point
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript compiler configuration
└── vite.config.ts                 # Vite bundler configuration
```

---

## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).
