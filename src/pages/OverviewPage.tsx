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
  Info,
  Play
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
    workZones,
    optimizationPlan,
    overrunScenario,
    setSelectedSectionId,
    selectedDivision,
    setIsTestRunModalOpen
  } = useApp();

  const pendingRequestsCount = requests.filter(r => r.status === 'Pending').length;
  const plannedBlocksCount = blocks.filter(b => b.status === 'Planned').length;
  const activeBlocksCount = blocks.filter(b => b.status === 'Active' || b.status === 'Delayed').length;
  const activeWorkZonesCount = workZones.filter(w => w.status === 'Active' || w.status === 'Scheduled').length;
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
            {selectedDivision.name} ({selectedDivision.code}) · Maintenance and block planning intelligence layer
          </p>
        </div>

        <div className="header-actions-group">
          <button
            className="btn-accent"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(2,132,199,0.25)'
            }}
            onClick={() => setIsTestRunModalOpen(true)}
            title="Launch Realistic 2-Day Timetable Test Run"
          >
            <Play size={16} fill="#ffffff" />
            <span>Run Test Simulation</span>
          </button>
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
            <div className="kpi-value">{pendingRequestsCount}</div>
            <span className="kpi-delta text-warning">In active queue · {selectedDivision.code}</span>
          </div>
          <div className="kpi-icon-box bg-maroon-subtle">
            <ClipboardList size={22} className="text-maroon" />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigateTo('Block Planner')}>
          <div className="kpi-content">
            <span className="kpi-label">Planned Blocks</span>
            <div className="kpi-value">{plannedBlocksCount}</div>
            <span className="kpi-delta text-info">
              {plannedBlocksCount > 0 ? `${plannedBlocksCount} block(s) scheduled` : 'No upcoming windows'}
            </span>
          </div>
          <div className="kpi-icon-box bg-blue-subtle">
            <CalendarCheck size={22} className="text-blue" />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigateTo('Active Blocks')}>
          <div className="kpi-content">
            <span className="kpi-label">Active Blocks</span>
            <div className="kpi-value">{activeBlocksCount}</div>
            <span className={`kpi-delta ${activeBlocksCount > 0 ? 'text-danger' : 'text-muted'}`}>
              {activeBlocksCount > 0 ? `${activeBlocksCount} Active Work Zones` : '0 Active Possessions'}
            </span>
          </div>
          <div className="kpi-icon-box bg-green-subtle">
            <Activity size={22} className="text-success" />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigateTo('Conflicts')}>
          <div className="kpi-content">
            <span className="kpi-label">Operational Conflicts</span>
            <div className="kpi-value">{conflicts.length}</div>
            <span className={`kpi-delta ${criticalConflictsCount > 0 ? 'text-danger' : 'text-success'}`}>
              {criticalConflictsCount > 0 ? `${criticalConflictsCount} Critical Overlap` : '0 Critical Overlaps'}
            </span>
          </div>
          <div className="kpi-icon-box bg-danger-subtle">
            <TriangleAlert size={22} className="text-danger" />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigateTo('Maintenance Requests')}>
          <div className="kpi-content">
            <span className="kpi-label">High Priority Jobs</span>
            <div className="kpi-value">{highPriorityJobsCount}</div>
            <span className={`kpi-delta ${highPriorityJobsCount > 0 ? 'text-warning' : 'text-muted'}`}>
              {highPriorityJobsCount > 0 ? 'Requires priority slot' : 'No urgent queue'}
            </span>
          </div>
          <div className="kpi-icon-box bg-amber-subtle">
            <ShieldAlert size={22} className="text-amber" />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigateTo('Reports & Analytics')}>
          <div className="kpi-content">
            <span className="kpi-label">Asset Availability</span>
            <div className="kpi-value">93.2%</div>
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

          {requests.length > 0 ? (
            <div className="hero-recommend-box">
              <div className="recommend-head">
                <div className="recommend-badge-wrap">
                  <span className={`badge-recommended ${requests[0].aiAnalysis?.conflict ? '' : 'bg-success text-white'}`} style={!requests[0].aiAnalysis?.conflict ? { background: '#16a34a', color: '#fff' } : {}}>
                    {requests[0].aiAnalysis?.conflict ? 'SolveX AI Optimized Plan' : 'SolveX Verified — Clear Window'}
                  </span>
                  <span className="section-pill">{requests[0].sectionName}</span>
                </div>
                <div className="recommend-score">
                  <span className="score-num">{requests[0].aiAnalysis?.conflict ? 88 : 97}</span>
                  <span className="score-denom">/ 100</span>
                </div>
              </div>

              <h3 className="recommend-title">
                {requests.length === 1
                  ? (requests[0].aiAnalysis?.conflict
                      ? `Recommended: ${requests[0].aiAnalysis.recommendedWindow ? `${requests[0].aiAnalysis.recommendedWindow.start}–${requests[0].aiAnalysis.recommendedWindow.end}` : requests[0].preferredTimeWindow} Window`
                      : `Requested Window Clear: ${requests[0].preferredTimeWindow}`)
                  : `Coordinate ${requests.length} Requests into Unified Window`}
              </h3>
              <p className="recommend-sub">
                {requests.map(r => `${r.dept} (${r.workType})`).join(' + ')}
              </p>

              <div className="recommend-reasons-list">
                <div className="reason-item">
                  <CheckCircle2 size={15} className="text-success" />
                  <span>
                    <strong>{requests[0].aiAnalysis?.conflict ? 'AI Headway Optimization:' : 'Timetable Verification:'}</strong>{' '}
                    {requests[0].aiAnalysis?.reasoning || 'Validated against Southern Railway Palakkad Division 24h timetable movements.'}
                  </span>
                </div>
              </div>

              <div className="recommend-footer">
                <span className="text-xs text-muted">
                  Status: Ready for Planner Review
                </span>
                <button
                  className="btn-primary-sm"
                  onClick={() => navigateTo('AI Optimizer')}
                >
                  Optimize Now
                </button>
              </div>
            </div>
          ) : (
            <div className="hero-recommend-box" style={{ textAlign: 'center', padding: '36px 20px' }}>
              <Sparkles size={28} style={{ color: 'var(--maroon-700)', margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--slate-800)', margin: '0 0 6px' }}>
                AI Optimizer Ready
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--slate-500)', margin: '0 0 16px', maxWidth: '380px', marginLeft: 'auto', marginRight: 'auto' }}>
                Submit maintenance requests to let the SolveX AI engine identify joint corridor possession windows and resolve clashes.
              </p>
              <button
                className="btn-primary-sm"
                style={{ margin: '0 auto' }}
                onClick={() => navigateTo('Maintenance Requests')}
              >
                + Submit Maintenance Request
              </button>
            </div>
          )}
        </div>

        {/* Critical Operational Alerts */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="d-flex align-center gap-2">
              <TriangleAlert size={18} className="text-danger" />
              <h2 className="panel-title">Critical Operational Alerts</h2>
            </div>
            {conflicts.length > 0 && (
              <button
                className="btn-link"
                onClick={() => navigateTo('Conflicts')}
              >
                <span>View All ({conflicts.length})</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          <div className="alerts-list">
            {conflicts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--slate-500)' }}>
                <CheckCircle2 size={28} style={{ color: '#16a34a', margin: '0 auto 8px' }} />
                <strong style={{ display: 'block', color: 'var(--slate-700)', fontSize: '14px', marginBottom: '4px' }}>
                  Corridors Clear — No Active Alerts
                </strong>
                <span style={{ fontSize: '12.5px' }}>Zero train clashing or block overruns reported across Palakkad Division.</span>
              </div>
            ) : (
              conflicts.map(c => (
                <div
                  key={c.id}
                  className="alert-item alert-critical"
                  onClick={() => {
                    setSelectedSectionId(c.sectionId);
                    navigateTo('Conflicts');
                  }}
                >
                  <div className="alert-icon-col">
                    <TriangleAlert size={20} className="text-danger" />
                  </div>
                  <div className="alert-content-col">
                    <div className="alert-title-row">
                      <strong>{c.description}</strong>
                      <span className="badge-critical">{c.severity}</span>
                    </div>
                    <p>
                      Section {c.sectionName}: {c.conflictingTrain?.trainName} ({c.conflictingTrain?.trainNo}) at {c.conflictPointTime}.
                    </p>
                    <div className="alert-action-line">
                      <span>View alternative non-clashing windows</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              ))
            )}
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
