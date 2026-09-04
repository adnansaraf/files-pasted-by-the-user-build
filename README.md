# 🚆 SOLVEX – Indian Railways Block Planning & Decision Support Portal

> **Integrated Corridor Block Planning, Conflict Resolution & Real-Time Decision Support System**  
> *Designed for CRIS (Centre for Railway Information Systems) & Ministry of Railways Operations.*

---

## 📖 Overview

**SOLVEX** is an enterprise-grade railway operations portal engineered to automate and optimize **Corridor Maintenance Block Planning** across high-density Indian Railways routes. It integrates civil engineering (Engg), overhead electrification (OHE/TRD), and signaling & telecommunication (S&T) maintenance requests into unified shadow blocks, drastically reducing train detentions, punctuality loss, and scheduling conflicts.

---

## 🌟 Key Capabilities

### 1. 👥 Multi-Tier Role-Based Access Control (RBAC)
- **HQ Block Planner / Operating Department**: Full corridor scheduling, system optimization, cross-divisional approvals.
- **Divisional Authority (DRM / Sr. DOM)**: Approval matrix, safety threshold enforcement, sanctioning authority.
- **Section Controller (Control Office)**: Live block execution, real-time granting/bursting, train precedence management.
- **Site Engineer / Field Supervisor**: Submission of block demands, machine deployment logs, live delay & completion reports.

### 2. 🗺️ Interactive Schematic Track Network
- Dynamic track topology diagram representing railway sections (e.g., *Vijayawada – Duvvada (BZA–DVD)*, *Chennai Central – Gudur (MAS–GDR)*, *New Delhi – Kanpur (NDLS–CNB)*).
- Real-time visual status of stations, block sections, crossovers, speed restrictions (TSR/PSR), and active track occupancies.

### 3. ⏱️ 24-Hour Corridor Gantt Timeline
- Multi-track visual timeline rendering passenger/freight train paths alongside scheduled civil & electrical blocks.
- Correlated **Shadow Block** detection: enables S&T and Electrical teams to perform work during civil engineering blocks without extra traffic disruption.

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
