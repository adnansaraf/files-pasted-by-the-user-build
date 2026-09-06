import React, { useState } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Train,
  Wrench,
  Zap,
  Radio,
  ArrowRight,
  Shield,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReschedulingPage: React.FC = () => {
  const { blocks, overrunScenario, applyRescheduleOption, navigateTo } = useApp();
  const [selectedOptionId, setSelectedOptionId] = useState<string>('OPT-MOVE-ST');
  const [isApplying, setIsApplying] = useState(false);

  // Check if any real block currently has an active delay/overrun
  const activeDelayedBlock = blocks.find(b => b.status === 'Delayed');

  const handleApply = (optId: string) => {
    setIsApplying(true);
    setTimeout(() => {
      applyRescheduleOption(optId);
      setIsApplying(false);
      navigateTo('Active Blocks');
    }, 700);
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="page-badge-danger">
            <AlertTriangle size={13} />
            <span>INCIDENT & OVERRUN MITIGATION</span>
          </div>
          <h1 className="page-title">Dynamic Rescheduling</h1>
          <p className="page-subtitle">
            Rapid operational recovery options when active maintenance blocks exceed allotted possession windows
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={() => navigateTo('Active Blocks')}
        >
          <span>Return to Active Blocks</span>
        </button>
      </div>

      {!activeDelayedBlock ? (
        /* Honest Empty State when no real overrun exists */
        <div className="table-card" style={{ padding: '64px 24px', textAlign: 'center', marginTop: '16px' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(22, 163, 74, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={32} className="text-success" />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--slate-800)' }}>
              No Active Overruns Detected
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--slate-500)', lineHeight: '1.5', margin: 0 }}>
              All maintenance blocks and train services across Palakkad Division are currently running within nominal schedule tolerances. If a site supervisor or section controller flags an unforeseen possession overrun on an active track block, automated SolveX dynamic recovery strategies will generate here in real time.
            </p>
            <button
              className="btn-secondary"
              style={{ marginTop: '8px' }}
              onClick={() => navigateTo('Overview')}
            >
              Return to Overview
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Active Overrun Alert Card for the real delayed block */}
          <div className="overrun-hero-card">
            <div className="overrun-header">
              <div className="overrun-icon-box">
                <AlertTriangle size={32} className="text-danger" />
              </div>
              <div className="overrun-text">
                <div className="d-flex align-center gap-2">
                  <span className="badge-critical">CRITICAL OVERRUN DETECTED</span>
                  <span className="badge-section">{activeDelayedBlock.sectionName}</span>
                  <span className="text-muted text-xs">Block Ref: {activeDelayedBlock.id}</span>
                </div>
                <h2>Block Overrun Alert: Execution Delay Detected</h2>
                <p className="overrun-reason">
                  <strong>Site Report:</strong> {activeDelayedBlock.notes || 'Track maintenance team reported unexpected delay during possession execution.'}
                </p>
              </div>
            </div>

            <div className="overrun-stats-row">
              <div className="overrun-stat-cell">
                <span className="lbl">Planned Possession End</span>
                <strong className="val">{activeDelayedBlock.scheduledEnd} IST</strong>
              </div>
              <div className="overrun-stat-cell">
                <span className="lbl">Updated Expected Finish</span>
                <strong className="val text-danger">{activeDelayedBlock.expectedEnd || '04:45'} IST</strong>
              </div>
              <div className="overrun-stat-cell">
                <span className="lbl">Additional Possession Window</span>
                <strong className="val text-warning">+45 Minutes</strong>
              </div>
              <div className="overrun-stat-cell">
                <span className="lbl">Affected Section Traffic</span>
                <strong className="val text-danger">{activeDelayedBlock.affectedTrains.join(', ') || 'Approaching Section Traffic'}</strong>
              </div>
            </div>
          </div>

          {/* Evaluated Operational Recovery Options */}
          <div className="reschedule-options-container">
            <div className="section-title-row">
              <h3>SolveX Calculated Rescheduling Options</h3>
              <span className="text-xs text-muted">
                The optimization engine ranks mitigation strategies by total train detention and safety margins
              </span>
            </div>

            <div className="reschedule-grid">
              {overrunScenario.options.map(opt => {
                const isRec = opt.isRecommended;
                const isSelected = selectedOptionId === opt.id;

                return (
                  <div
                    key={opt.id}
                    className={`reschedule-card ${isRec ? 'card-recommended' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedOptionId(opt.id)}
                  >
                    <div className="reschedule-card-head">
                      <div className="d-flex align-center gap-2">
                        <span className={`alt-pill ${isRec ? 'pill-rec' : 'pill-alt'}`}>
                          {isRec ? '★ Recommended Recovery Strategy' : 'Alternative Strategy'}
                        </span>
                      </div>
                      <h4 className="reschedule-title">{opt.title}</h4>
                      <p className="reschedule-desc">{opt.description}</p>
                    </div>

                    <div className="reschedule-metrics-box">
                      <div className="metric-row">
                        <span>Train Punctuality Impact:</span>
                        <strong className={opt.trainImpactMin > 20 ? 'text-danger' : 'text-success'}>
                          {opt.trainImpactMin} min total detention
                        </strong>
                      </div>
                      <div className="metric-row">
                        <span>Subsequent Conflicts:</span>
                        <strong className={opt.conflicts > 0 ? 'text-warning' : 'text-success'}>
                          {opt.conflicts} line conflicts
                        </strong>
                      </div>
                      <div className="metric-row">
                        <span>Asset Availability:</span>
                        <strong>{opt.assetAvailability}%</strong>
                      </div>
                      <div className="metric-row">
                        <span>Maintenance Yield:</span>
                        <span className="text-xs">{opt.maintenanceImpact}</span>
                      </div>
                    </div>

                    <div className="reschedule-reasoning-box">
                      <Info size={14} className="text-muted flex-shrink-0" />
                      <span className="text-xs text-muted">{opt.reasoning}</span>
                    </div>

                    <div className="reschedule-btn-wrap">
                      <button
                        className={isRec ? 'btn-primary-block' : 'btn-secondary-block'}
                        disabled={isApplying}
                        onClick={e => {
                          e.stopPropagation();
                          handleApply(opt.id);
                        }}
                      >
                        {isRec ? (
                          <>
                            <CheckCircle2 size={16} />
                            <span>Apply Recommended Schedule</span>
                          </>
                        ) : (
                          <span>Select This Strategy</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
