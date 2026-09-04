import React from 'react';
import {
  ClipboardList,
  CalendarCheck,
  Activity,
  TriangleAlert,
  ShieldAlert,
  Gauge,
  Sparkles,
  ChevronRight,
  Clock,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GanttTimeline } from '../components/GanttTimeline';
import { SchematicMap } from '../components/SchematicMap';

export const OverviewPage: React.FC = () => {
  const {
    navigateTo,
    requests,
    blocks,
    conflicts,
    optimizationPlan,
    overrunScenario,
    setSelectedSectionId
  } = useApp();

  const pendingRequestsCount = requests.filter(r => r.status === 'Pending').length;
  const plannedBlocksCount = blocks.filter(b => b.status === 'Planned').length + 9; // simulated total 12
  const activeBlocksCount = blocks.filter(b => b.status === 'Active' || b.status === 'Delayed').length;
  const criticalConflictsCount = conflicts.filter(c => c.severity === 'Critical').length;
  const highPriorityJobsCount = requests.filter(r => r.priority === 'Critical' || r.priority === 'High').length;

  return (
    <div className="page-container">
      {/* Page Title & Hero Action */}
      <div className="page-header-row">
        <div>
          <div className="page-badge">OPERATIONAL CONTROL CONSOLE</div>
          <h1 className="page-title">Railway Operations Overview</h1>
          <p className="page-subtitle">
            Palakkad Division (PGT) · Maintenance and block planning intelligence layer
          </p>
        </div>

        <div className="header-actions-group">
          <button
            className="btn-secondary"
            onClick={() => navigateTo('What-if Simulator')}
          >
            What-if Simulator
          </button>
          <button
            className="btn-primary"
            onClick={() => navigateTo('AI Optimizer')}
          >
            <Sparkles size={16} />
            <span>Launch AI Optimizer</span>
          </button>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => navigateTo('Maintenance Requests')}>
          <div className="kpi-content">
            <span className="kpi-label">Pending Requests</span>
            <div className="kpi-value">{pendingRequestsCount + 10}</div>
            <span className="kpi-delta text-warning">+{3} today · 3 depts</span>
          </div>
          <div className="kpi-icon-box bg-maroon-subtle">
            <ClipboardList size={22} className="text-maroon" />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigateTo('Block Planner')}>
          <div className="kpi-content">
            <span className="kpi-label">Planned Blocks</span>
            <div className="kpi-value">{plannedBlocksCount}</div>
            <span className="kpi-delta text-info">Next window: 02:00 IST</span>
          </div>
          <div className="kpi-icon-box bg-blue-subtle">
            <CalendarCheck size={22} className="text-blue" />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigateTo('Active Blocks')}>
          <div className="kpi-content">
            <span className="kpi-label">Active Blocks</span>
            <div className="kpi-value">{activeBlocksCount}</div>
            <span className="kpi-delta text-danger">1 Delay / Overrun Alert</span>
          </div>
          <div className="kpi-icon-box bg-green-subtle">
            <Activity size={22} className="text-success" />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigateTo('Conflicts')}>
          <div className="kpi-content">
            <span className="kpi-label">Operational Conflicts</span>
            <div className="kpi-value">{conflicts.length}</div>
            <span className="kpi-delta text-danger">{criticalConflictsCount} Critical Overlap</span>
          </div>
          <div className="kpi-icon-box bg-danger-subtle">
            <TriangleAlert size={22} className="text-danger" />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigateTo('Maintenance Requests')}>
          <div className="kpi-content">
            <span className="kpi-label">High Priority Jobs</span>
            <div className="kpi-value">{highPriorityJobsCount}</div>
            <span className="kpi-delta text-warning">Requires urgent slot</span>
          </div>
          <div className="kpi-icon-box bg-amber-subtle">
            <ShieldAlert size={22} className="text-amber" />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigateTo('Reports & Analytics')}>
          <div className="kpi-content">
            <span className="kpi-label">Asset Availability</span>
            <div className="kpi-value">92.4%</div>
            <span className="kpi-delta text-success">↑ +1.8% vs last month</span>
          </div>
          <div className="kpi-icon-box bg-slate-subtle">
            <Gauge size={22} className="text-navy" />
          </div>
        </div>
      </div>

      {/* Row 2: Today's Schedule & Network Overview */}
      <div className="dashboard-grid-two">
        {/* Left: Gantt Schedule */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Today's Block Schedule (00:00 → 24:00)</h2>
              <span className="panel-sub">Coordinated departmental possessions & train paths</span>
            </div>
            <button
              className="btn-link"
              onClick={() => navigateTo('Block Planner')}
            >
              <span>Open 24h Planner</span>
              <ChevronRight size={14} />
            </button>
          </div>
          <GanttTimeline />
        </div>

        {/* Right: Schematic Railway Network */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Railway Network Overview</h2>
              <span className="panel-sub">Palakkad Division schematic corridor (PGT–OTP–SRR–TIR–CLT)</span>
            </div>
            <button
              className="btn-link"
              onClick={() => navigateTo('Railway Network')}
            >
              <span>Full Screen Network</span>
              <ChevronRight size={14} />
            </button>
          </div>
          <SchematicMap compact={true} />
        </div>
      </div>

      {/* Row 3: AI Recommendation & Critical Alerts */}
      <div className="dashboard-grid-two">
        {/* AI Recommendations */}
        <div className="dashboard-panel recommendation-panel">
          <div className="panel-header">
            <div className="d-flex align-center gap-2">
              <Sparkles size={18} className="text-maroon" />
              <h2 className="panel-title">AI Coordination Recommendation</h2>
            </div>
            <button
              className="btn-link"
              onClick={() => navigateTo('AI Optimizer')}
            >
              <span>View Optimizer Details</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="hero-recommend-box">
            <div className="recommend-head">
              <div className="recommend-badge-wrap">
                <span className="badge-recommended">SolveX High-Synergy Plan</span>
                <span className="section-pill">Section A–B (PGT–OTP)</span>
              </div>
              <div className="recommend-score">
                <span className="score-num">87</span>
                <span className="score-denom">/ 100</span>
              </div>
            </div>

            <h3 className="recommend-title">
              Coordinate 3 Jobs in 02:00–05:00 Single Block Window
            </h3>
            <p className="recommend-sub">
              Engineering Track Tamping + TRD OHE Dropper Check + S&T Axle Counter Testing
            </p>

            <div className="recommend-reasons-list">
              <div className="reason-item">
                <CheckCircle2 size={15} className="text-success" />
                <span>
                  <strong>Same Section Synergy:</strong> Consolidates 3 requests on PGT–OTP (km 531–534).
                </span>
              </div>
              <div className="reason-item">
                <CheckCircle2 size={15} className="text-success" />
                <span>
                  <strong>Reduces Separate Possessions:</strong> Cuts individual track downtime from 6.0h to 3.0h.
                </span>
              </div>
              <div className="reason-item">
                <CheckCircle2 size={15} className="text-success" />
                <span>
                  <strong>Lowest Estimated Train Impact:</strong> 14 min delay vs 42 min in daytime alternative.
                </span>
              </div>
            </div>

            <div className="recommend-footer">
              <span className="text-xs text-muted">
                Status: {optimizationPlan.approvalStatus} · Requires Planner Signature
              </span>
              <button
                className="btn-primary-sm"
                onClick={() => navigateTo('Plan Review')}
              >
                Review & Approve Plan
              </button>
            </div>
          </div>
        </div>

        {/* Critical Operational Alerts */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="d-flex align-center gap-2">
              <TriangleAlert size={18} className="text-danger" />
              <h2 className="panel-title">Critical Operational Alerts</h2>
            </div>
            <button
              className="btn-link"
              onClick={() => navigateTo('Conflicts')}
            >
              <span>View All 4 Alerts</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="alerts-list">
            <div
              className="alert-item alert-critical"
              onClick={() => {
                setSelectedSectionId('A-B');
                navigateTo('Conflicts');
              }}
            >
              <div className="alert-icon-col">
                <TriangleAlert size={20} className="text-danger" />
              </div>
              <div className="alert-content-col">
                <div className="alert-title-row">
                  <strong>Train Movement Overlaps Block Request</strong>
                  <span className="badge-critical">CRITICAL</span>
                </div>
                <p>
                  Section A–B (PGT–OTP): 12617 Mangala Superfast arrives at 03:15 inside requested 02:00–05:00 window.
                </p>
                <div className="alert-action-line">
                  <span>Recommendation: Advance block window to 01:00–04:00 (Option A)</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>

            <div
              className="alert-item alert-warning"
              onClick={() => {
                setSelectedSectionId('A-B');
                navigateTo('Dynamic Rescheduling');
              }}
            >
              <div className="alert-icon-col">
                <Clock size={20} className="text-warning" />
              </div>
              <div className="alert-content-col">
                <div className="alert-title-row">
                  <strong>Active Block BLK-204 Overrun Alert (+45 min)</strong>
                  <span className="badge-warning">DELAY</span>
                </div>
                <p>
                  Tamping machine subgrade issue at km 532. Planned completion 04:00 → Expected 04:45.
                </p>
                <div className="alert-action-line">
                  <span>SolveX Re-scheduling: Move S&T to shadow window (8 min impact)</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Operational Analytics Banner */}
      <div className="dashboard-panel analytics-strip-panel">
        <div className="panel-header">
          <h2 className="panel-title">Divisional Operational Efficiency (Simulated Layer)</h2>
          <button
            className="btn-link"
            onClick={() => navigateTo('Reports & Analytics')}
          >
            <span>Detailed Analytics & Histograms</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="analytics-metrics-row">
          <div className="analytics-stat-col">
            <span className="stat-label">Block Time Utilization Rate</span>
            <div className="stat-val-row">
              <strong>74%</strong>
              <small className="text-success">↑ 6% vs baseline</small>
            </div>
            <div className="meter-bar">
              <div className="meter-fill bg-success" style={{ width: '74%' }} />
            </div>
          </div>

          <div className="analytics-stat-col">
            <span className="stat-label">Planned vs Actual Duration Variance</span>
            <div className="stat-val-row">
              <strong>+0.3 hrs</strong>
              <small className="text-warning">Overrun risk monitored</small>
            </div>
            <div className="meter-bar">
              <div className="meter-fill bg-warning" style={{ width: '42%' }} />
            </div>
          </div>

          <div className="analytics-stat-col">
            <span className="stat-label">Conflicts Resolved by SolveX Optimizer</span>
            <div className="stat-val-row">
              <strong>63%</strong>
              <small className="text-info">5 of 8 resolved proactively</small>
            </div>
            <div className="meter-bar">
              <div className="meter-fill bg-info" style={{ width: '63%' }} />
            </div>
          </div>

          <div className="analytics-stat-col disclaimer-col">
            <Info size={16} className="text-muted" />
            <p>
              Simulated optimization data represents decision-support projections for the Palakkad
              divisional network under SIH 2026 Problem Statement 26027.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
