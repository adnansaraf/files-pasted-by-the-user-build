import React, { useState } from 'react';
import {
  FileCheck,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Train,
  Wrench,
  Zap,
  Radio,
  XCircle,
  Sparkles,
  ArrowRight,
  Info,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GanttTimeline } from '../components/GanttTimeline';

export const PlanReviewPage: React.FC = () => {
  const {
    requests,
    optimizationPlan,
    approvePlan,
    rejectPlan,
    navigateTo,
    setSelectedSectionId
  } = useApp();

  const [plannerNotes, setPlannerNotes] = useState('Reviewed with Chief Controller Palakkad. Approved for imposition under standard divisional safety headway protocols.');
  const [hasConfirmedChecks, setHasConfirmedChecks] = useState(true);

  const isApproved = optimizationPlan.approvalStatus === 'Approved';

  if (requests.length === 0) {
    return (
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header-row">
          <div>
            <div className="page-badge">HUMAN-IN-THE-LOOP APPROVAL GATE</div>
            <h1 className="page-title">Plan Review & Authorization</h1>
            <p className="page-subtitle">
              Mandatory operational review gate before AI recommendations are committed into live corridor dispatching
            </p>
          </div>
        </div>

        <div className="table-card" style={{ padding: '64px 24px', textAlign: 'center', marginTop: '16px' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(128, 0, 0, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck size={28} className="text-maroon" />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--slate-800)' }}>
              No Optimization Plan Awaiting Review
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--slate-500)', lineHeight: '1.5', margin: 0 }}>
              Submit a maintenance request and run the AI Block Optimizer to generate a coordinated possession schedule. Once generated, the plan will appear here for formal review and digital authorization.
            </p>
            <button
              className="btn-primary"
              style={{ marginTop: '8px' }}
              onClick={() => navigateTo('Maintenance Requests')}
            >
              <Plus size={16} />
              <span>Submit Maintenance Request</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeReq = requests[0];
  const ai = activeReq.aiAnalysis;
  const hasConflict = !!ai?.conflict;
  const recommendedWindow = ai?.recommendedWindow
    ? `${ai.recommendedWindow.start}–${ai.recommendedWindow.end}`
    : activeReq.preferredTimeWindow;

  const getDeptIcon = (dept: string) => {
    switch (dept) {
      case 'Engineering':
        return <Wrench size={15} className="text-maroon" />;
      case 'TRD':
        return <Zap size={15} className="text-amber" />;
      case 'S&T':
        return <Radio size={15} className="text-blue" />;
      default:
        return <Wrench size={15} />;
    }
  };

  const reasons = [
    ai?.reasoning || (hasConflict ? 'Resolved train path conflict by repositioning window.' : 'Zero train path conflicts on section.'),
    ai?.priorityNote || `Prioritized according to departmental priority: ${activeReq.priority}.`,
    'Verified against Southern Railway Palakkad Division 24h timetable movements (data/timetable.json).'
  ];

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="page-badge">HUMAN-IN-THE-LOOP APPROVAL GATE</div>
          <h1 className="page-title">Plan Review & Authorization</h1>
          <p className="page-subtitle">
            Mandatory operational review gate before AI recommendations are committed into live corridor dispatching
          </p>
        </div>

        <span className={`status-pill status-${isApproved ? 'active' : 'pending'}`}>
          {optimizationPlan.approvalStatus}
        </span>
      </div>

      {/* Mandatory Human Review Warning Banner */}
      <div className="planner-alert-banner bg-white-border">
        <Shield size={20} className="text-maroon flex-shrink-0" />
        <div className="alert-banner-text">
          <strong>Mandatory Railway Safety Protocol:</strong>
          <span>
            AI generated schedules provide advisory decision-support. No track possession, speed restriction, or
            traction power isolation may be imposed without explicit sign-off by the authorized Divisional Operations Manager or Sectional Controller.
          </span>
        </div>
      </div>

      {/* Hero Review Card */}
      <div className="plan-review-card">
        <div className="review-header">
          <div>
            <div className="d-flex align-center gap-2">
              <span className="badge-section">{activeReq.sectionName}</span>
              <span className="badge-recommended">Plan Ref: OPT-{activeReq.id}</span>
            </div>
            <h2>Coordinated Maintenance Possession ({recommendedWindow})</h2>
            <p className="text-muted text-sm">
              Generated for Palakkad Division · Target Section: {activeReq.sectionName}
            </p>
          </div>

          <div className="review-score-badge">
            <span className="lbl">COMPOSITE SCORE</span>
            <strong>{hasConflict ? 88 : 97} / 100</strong>
          </div>
        </div>

        {/* Coordinated Jobs Grid */}
        <div className="coordinated-jobs-box">
          <h4>Registered Departmental Maintenance Jobs ({requests.length} Application{requests.length !== 1 ? 's' : ''})</h4>
          <div className="jobs-tag-grid">
            {requests.map(req => (
              <div key={req.id} className="job-tag-card">
                <div className="dept-header-row">
                  {getDeptIcon(req.dept)}
                  <strong>{req.dept}</strong>
                  <span className={`priority-tag priority-${req.priority.toLowerCase()}`}>
                    {req.priority} ({req.priorityScore})
                  </span>
                </div>
                <div className="job-desc-text">
                  {req.workType}: {req.description}
                </div>
                <small className="text-muted">
                  Duration: {req.requestedDuration}h · Requested: {req.preferredTimeWindow}
                </small>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="review-timeline-wrapper">
          <div className="box-title-row">
            <h4>24-Hour Corridor Headway Validation</h4>
            <span className="text-xs text-muted">Overlaps and safe separation buffers</span>
          </div>
          <GanttTimeline />
        </div>

        {/* Explainability Reasoning */}
        <div className="review-reasons-box">
          <h4>SolveX Optimization Decision Audit</h4>
          <div className="reasons-checklist">
            {reasons.map((r, i) => (
              <div key={i} className="check-item">
                <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Safety & Checklist Confirmation */}
        <div className="planner-signoff-section">
          <div className="checklist-box">
            <h4>Planner Pre-Imposition Verification</h4>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={hasConfirmedChecks}
                onChange={e => setHasConfirmedChecks(e.target.checked)}
              />
              <span>
                Verified traction isolation protocol with Traction Power Controller (TPC) Shoranur.
              </span>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={hasConfirmedChecks}
                onChange={e => setHasConfirmedChecks(e.target.checked)}
              />
              <span>
                Verified regulation notice issued to Palakkad & adjacent station masters.
              </span>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={hasConfirmedChecks}
                onChange={e => setHasConfirmedChecks(e.target.checked)}
              />
              <span>
                Standard caution order protocol logged into divisional bulletin.
              </span>
            </label>
          </div>

          <div className="signoff-inputs">
            <label>Planner Review Remarks & Authorization Order</label>
            <textarea
              rows={2}
              value={plannerNotes}
              onChange={e => setPlannerNotes(e.target.value)}
              disabled={isApproved}
            />
          </div>

          {/* Approval Action Bar */}
          <div className="signoff-bar">
            {isApproved ? (
              <div className="approved-stamp-card">
                <CheckCircle2 size={24} className="text-success" />
                <div>
                  <strong>PLAN OFFICIALLY APPROVED & SIGNED OFF</strong>
                  <p>
                    Authorized by {optimizationPlan.approvedBy} at {optimizationPlan.approvedAt}. Integrated into divisional COA timetable.
                  </p>
                </div>
              </div>
            ) : (
              <div className="action-buttons-group">
                <button
                  className="btn-danger"
                  onClick={rejectPlan}
                >
                  <XCircle size={16} />
                  <span>Reject / Request Modifications</span>
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => navigateTo('AI Optimizer')}
                >
                  <span>Modify in Optimizer</span>
                </button>
                <button
                  className="btn-primary-hero"
                  disabled={!hasConfirmedChecks}
                  onClick={approvePlan}
                >
                  <CheckCircle2 size={18} />
                  <span>Approve & Authorize Block (OPT-{activeReq.id})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
