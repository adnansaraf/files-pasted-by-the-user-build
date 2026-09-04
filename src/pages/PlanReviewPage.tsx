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
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GanttTimeline } from '../components/GanttTimeline';

export const PlanReviewPage: React.FC = () => {
  const {
    optimizationPlan,
    approvePlan,
    rejectPlan,
    navigateTo,
    setSelectedSectionId
  } = useApp();

  const [plannerNotes, setPlannerNotes] = useState('Reviewed with Chief Controller Palakkad. Approved for Shift 3 imposition under standard 45 km/h caution order.');
  const [hasConfirmedChecks, setHasConfirmedChecks] = useState(true);

  const isApproved = optimizationPlan.approvalStatus === 'Approved';

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
              <span className="badge-section">{optimizationPlan.targetSection}</span>
              <span className="badge-recommended">Plan ID: {optimizationPlan.id}</span>
            </div>
            <h2>Coordinated Multi-Department Maintenance Possession (02:00–05:00)</h2>
            <p className="text-muted text-sm">
              Generated: {optimizationPlan.timestamp} · Target: Palakkad Jn – Ottappalam (km 531–534)
            </p>
          </div>

          <div className="review-score-badge">
            <span className="lbl">COMPOSITE SCORE</span>
            <strong>{optimizationPlan.overallScore} / 100</strong>
          </div>
        </div>

        {/* Coordinated Jobs Grid */}
        <div className="coordinated-jobs-box">
          <h4>Coordinated Departmental Maintenance Work (3 Applications)</h4>
          <div className="jobs-tag-grid">
            <div className="job-tag-card">
              <div className="dept-header-row">
                <Wrench size={15} className="text-maroon" />
                <strong>Engineering (P-Way)</strong>
                <span className="priority-tag priority-high">High (87)</span>
              </div>
              <div className="job-desc-text">
                Track Geometry Correction & Tamping with 09-3X Duomatic (km 531/0 to 534/2)
              </div>
              <small className="text-muted">Duration: 3.0h · Caution order 45 km/h post-work</small>
            </div>

            <div className="job-tag-card">
              <div className="dept-header-row">
                <Zap size={15} className="text-amber" />
                <strong>TRD (Traction OHE)</strong>
                <span className="priority-tag priority-medium">Medium (68)</span>
              </div>
              <div className="job-desc-text">
                OHE Catenary Wire & Dropper Inspection via Tower Wagon Unit
              </div>
              <small className="text-muted">Duration: 2.0h · 25kV power cut isolated from PGT</small>
            </div>

            <div className="job-tag-card">
              <div className="dept-header-row">
                <Radio size={15} className="text-blue" />
                <strong>S&T (Signalling)</strong>
                <span className="priority-tag priority-high">High (82)</span>
              </div>
              <div className="job-desc-text">
                HASSDAC Digital Axle Counter & Point 102B Insulation Testing
              </div>
              <small className="text-muted">Duration: 1.0h · Off-track testing enclosed within block</small>
            </div>
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
            {optimizationPlan.reasons.map((r, i) => (
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
                Verified regulation of Express 12617 and notice issued to Palakkad & Ottappalam Station Masters.
              </span>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={hasConfirmedChecks}
                onChange={e => setHasConfirmedChecks(e.target.checked)}
              />
              <span>
                Caution order (45 km/h) drafted into divisional bulletin.
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
                  <span>Approve & Authorize Block (OPT-PGT-308)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
