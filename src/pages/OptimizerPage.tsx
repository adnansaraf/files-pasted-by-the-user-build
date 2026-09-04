import React, { useState } from 'react';
import {
  Sparkles,
  Database,
  Train,
  Sliders,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Check,
  ChevronRight,
  Info,
  Layers,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OptimizerPage: React.FC = () => {
  const {
    optimizationPlan,
    runOptimizer,
    isOptimizing,
    approvePlan,
    navigateTo,
    setSelectedSectionId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'recommendation' | 'comparison' | 'matrix'>('recommendation');
  const [showModifyWeights, setShowModifyWeights] = useState(false);

  const handleApprove = () => {
    approvePlan();
    navigateTo('Plan Review');
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="page-badge-hero">
            <Sparkles size={13} />
            <span>AI CORRIDOR OPTIMIZATION ENGINE</span>
          </div>
          <h1 className="page-title">AI Block Optimizer</h1>
          <p className="page-subtitle">
            Generate mathematically optimized, multi-departmental maintenance plans from operational constraints
          </p>
        </div>

        <div className="header-actions-group">
          <button
            className="btn-secondary"
            onClick={() => setShowModifyWeights(!showModifyWeights)}
          >
            <Sliders size={15} />
            <span>{showModifyWeights ? 'Hide Weight Sliders' : 'Tune Engine Weights'}</span>
          </button>
          <button
            className="btn-primary-hero"
            disabled={isOptimizing}
            onClick={runOptimizer}
          >
            {isOptimizing ? (
              <>
                <RotateCcw size={16} className="spin" />
                <span>Evaluating Constraints & Headways...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate Optimized Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Input Feeds Summary Cards */}
      <div className="optimizer-input-strip">
        <div className="input-feed-card">
          <div className="feed-icon bg-maroon-subtle">
            <Database size={18} className="text-maroon" />
          </div>
          <div className="feed-info">
            <span className="feed-label">Maintenance Requests</span>
            <strong>24 Applications</strong>
            <small className="text-muted">Engineering, TRD & S&T</small>
          </div>
        </div>

        <div className="input-feed-card">
          <div className="feed-icon bg-blue-subtle">
            <Train size={18} className="text-blue" />
          </div>
          <div className="feed-info">
            <span className="feed-label">Train Timetable (COA)</span>
            <strong>86 Scheduled Services</strong>
            <small className="text-muted">Palakkad mainline + loops</small>
          </div>
        </div>

        <div className="input-feed-card">
          <div className="feed-icon bg-green-subtle">
            <Layers size={18} className="text-success" />
          </div>
          <div className="feed-info">
            <span className="feed-label">Section Availability</span>
            <strong>18 Track Sections</strong>
            <small className="text-muted">PGT–OTP–SRR corridor</small>
          </div>
        </div>

        <div className="input-feed-card">
          <div className="feed-icon bg-amber-subtle">
            <Shield size={18} className="text-amber" />
          </div>
          <div className="feed-info">
            <span className="feed-label">Active Constraints</span>
            <strong>11 Operating Rules</strong>
            <small className="text-muted">25kV Power cut & Caution orders</small>
          </div>
        </div>
      </div>

      {/* Workflow Diagram Banner */}
      <div className="optimization-flow-banner">
        <div className="flow-step">
          <span className="step-tag">INPUTS</span>
          <span className="step-text">Requests + Timetable + Constraints + Priorities</span>
        </div>
        <div className="flow-arrow">→</div>
        <div className="flow-step highlight-core">
          <span className="step-tag">SOLVEX ENGINE</span>
          <span className="step-text">Multi-Criteria Headway & Synergy Optimizer</span>
        </div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">
          <span className="step-tag">OUTPUT</span>
          <span className="step-text">Coordinated Block Window + Alternatives</span>
        </div>
        <div className="flow-arrow">→</div>
        <div className="flow-step human-gate">
          <span className="step-tag">DECISION</span>
          <span className="step-text">Planner Review & Digital Sign-off</span>
        </div>
      </div>

      {/* Hero Recommendation Card */}
      <div className="optimizer-result-card">
        <div className="result-top-bar">
          <div className="result-header-left">
            <div className="badge-combo">
              <span className="badge-recommended">SolveX High-Synergy Plan</span>
              <span className="badge-target-sec">{optimizationPlan.targetSection}</span>
            </div>
            <h2 className="recommended-window-title">
              Recommended: {optimizationPlan.recommendedWindow} Window
            </h2>
            <p className="recommended-window-sub">
              Engineering Track Tamping + TRD OHE Dropper Overhaul + S&T Relay Calibration
            </p>
          </div>

          <div className="result-score-box">
            <span className="score-label">OPTIMIZATION SCORE</span>
            <div className="score-digits">
              <strong>{optimizationPlan.overallScore}</strong>
              <small>/ 100</small>
            </div>
            <span className="score-desc">Calculated via multi-criteria weights</span>
          </div>
        </div>

        {/* Explainability Section: "Why this plan?" */}
        <div className="why-this-plan-box">
          <div className="why-header">
            <Info size={16} className="text-success" />
            <h4>Explainable Decision Logic: Why this plan was recommended?</h4>
          </div>
          <div className="reasons-grid">
            {optimizationPlan.reasons.map((reason, i) => (
              <div key={i} className="reason-tile">
                <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Criteria Score Breakdown */}
        <div className="score-breakdown-bar">
          <div className="breakdown-item">
            <span className="lbl">Safety & Priority Compliance</span>
            <div className="bar-with-val">
              <div className="mini-bar"><div style={{ width: `${optimizationPlan.scoreBreakdown.safetyAndPriority}%` }} /></div>
              <strong>{optimizationPlan.scoreBreakdown.safetyAndPriority}%</strong>
            </div>
          </div>
          <div className="breakdown-item">
            <span className="lbl">Multi-Dept Corridor Synergy</span>
            <div className="bar-with-val">
              <div className="mini-bar bg-success-bar"><div style={{ width: `${optimizationPlan.scoreBreakdown.corridorSynergy}%` }} /></div>
              <strong>{optimizationPlan.scoreBreakdown.corridorSynergy}%</strong>
            </div>
          </div>
          <div className="breakdown-item">
            <span className="lbl">Train Punctuality Preservation</span>
            <div className="bar-with-val">
              <div className="mini-bar bg-amber-bar"><div style={{ width: `${optimizationPlan.scoreBreakdown.trainPunctualityImpact}%` }} /></div>
              <strong>{optimizationPlan.scoreBreakdown.trainPunctualityImpact}%</strong>
            </div>
          </div>
          <div className="breakdown-item">
            <span className="lbl">Asset Availability Index</span>
            <div className="bar-with-val">
              <div className="mini-bar"><div style={{ width: `${optimizationPlan.scoreBreakdown.assetAvailabilityScore}%` }} /></div>
              <strong>{optimizationPlan.scoreBreakdown.assetAvailabilityScore}%</strong>
            </div>
          </div>
        </div>

        {/* Alternatives Comparison Matrix */}
        <div className="alternatives-section">
          <h3 className="section-heading">Operational Alternatives Comparison</h3>
          <div className="alternatives-grid">
            {optimizationPlan.alternatives.map(alt => {
              const isBest = alt.status === 'Recommended';
              return (
                <div
                  key={alt.id}
                  className={`alternative-card ${isBest ? 'card-recommended' : ''}`}
                >
                  <div className="alt-head">
                    <div>
                      <span className={`alt-pill ${isBest ? 'pill-rec' : 'pill-alt'}`}>
                        {isBest ? 'Recommended Option' : 'Alternative Scenario'}
                      </span>
                      <h4 className="alt-title">{alt.name}</h4>
                    </div>
                    <div className="alt-score-circle">
                      <strong>{alt.score}</strong>
                    </div>
                  </div>

                  <div className="alt-timing-box">
                    <Clock size={14} className="text-muted" />
                    <strong>Time Window: {alt.timeWindow}</strong>
                    <span className="text-muted">({alt.duration} hours)</span>
                  </div>

                  <div className="alt-metrics-list">
                    <div className="alt-metric-row">
                      <span>Jobs Coordinated:</span>
                      <strong>{alt.jobsCoordinated} of 3 Requests</strong>
                    </div>
                    <div className="alt-metric-row">
                      <span>Estimated Train Impact:</span>
                      <strong className={alt.trainDelayMin > 20 ? 'text-danger' : 'text-success'}>
                        {alt.trainDelayMin} min total delay
                      </strong>
                    </div>
                    <div className="alt-metric-row">
                      <span>Operational Conflicts:</span>
                      <strong className={alt.conflictsCount > 0 ? 'text-warning' : 'text-success'}>
                        {alt.conflictsCount} conflict{alt.conflictsCount !== 1 ? 's' : ''}
                      </strong>
                    </div>
                    <div className="alt-metric-row">
                      <span>Track Downtime:</span>
                      <strong>{alt.assetDowntimeHours} hours</strong>
                    </div>
                  </div>

                  <div className="alt-tradeoffs">
                    <span className="tradeoff-lbl">Key Operational Trade-offs:</span>
                    <ul>
                      {alt.tradeoffs.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  {isBest && (
                    <button
                      className="btn-primary-block"
                      onClick={handleApprove}
                    >
                      <Check size={16} />
                      <span>Approve & Sign Off Plan</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Human in the loop action footer */}
        <div className="optimizer-footer-actions">
          <div className="approval-warning-notice">
            <Shield size={16} className="text-maroon" />
            <span>
              <strong>Official Planner Review Protocol:</strong> AI generated schedules are advisory recommendations.
              Final imposition of power and traffic blocks remains with the authorized sectional controller.
            </span>
          </div>

          <div className="footer-btn-row">
            <button
              className="btn-secondary"
              onClick={() => navigateTo('What-if Simulator')}
            >
              Test in What-if Simulator
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigateTo('Conflicts')}
            >
              Inspect Conflicts
            </button>
            <button
              className="btn-primary"
              onClick={handleApprove}
            >
              <span>Submit to Plan Review (OPT-PGT-308)</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
