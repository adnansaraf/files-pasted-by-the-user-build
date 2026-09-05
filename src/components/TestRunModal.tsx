import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Layers,
  Wrench,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Train,
  ArrowRight,
  RotateCcw,
  Zap,
  Info,
  Sliders,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import {
  SIMULATED_TEST_REQUESTS,
  runSolveXOptimization,
  compareSaturdayVsSunday
} from '../data/engine/decisionEngine';
import {
  SimulatedTestRequest,
  TestRunOptimizationResult,
  TwoDayComparisonResult
} from '../types';

interface TestRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToMap?: (workZoneId: string, window: string) => void;
}

export const TestRunModal: React.FC<TestRunModalProps> = ({
  isOpen,
  onClose,
  onApplyToMap
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-05');
  const [selectedSection, setSelectedSection] = useState<string>('SRR-CLT');
  const [selectedWorkZone, setSelectedWorkZone] = useState<string>('WZ-SRR-CLT-01');
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([
    'REQ-SIM-ENG-001',
    'REQ-SIM-TRD-001',
    'REQ-SIM-SNT-001'
  ]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeTab, setActiveTab] = useState<'decision' | 'timeline' | 'comparison'>('decision');
  const [selectedTrainDetail, setSelectedTrainDetail] = useState<any | null>(null);

  // Optimization Result state
  const [optimizationResult, setOptimizationResult] = useState<TestRunOptimizationResult | null>(() => {
    return runSolveXOptimization(
      '2026-09-05',
      'SRR-CLT',
      'WZ-SRR-CLT-01',
      SIMULATED_TEST_REQUESTS.filter(r =>
        ['REQ-SIM-ENG-001', 'REQ-SIM-TRD-001', 'REQ-SIM-SNT-001'].includes(r.id)
      )
    );
  });

  const [twoDayResult, setTwoDayResult] = useState<TwoDayComparisonResult | null>(null);

  if (!isOpen) return null;

  const currentRequests = SIMULATED_TEST_REQUESTS.filter(r =>
    selectedRequestIds.includes(r.id)
  );

  const toggleRequestSelection = (id: string) => {
    setSelectedRequestIds(prev =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter(x => x !== id) : prev) : [...prev, id]
    );
  };

  const handleLoadDemoScenario = () => {
    setSelectedDate('2026-09-05');
    setSelectedSection('SRR-CLT');
    setSelectedWorkZone('WZ-SRR-CLT-01');
    setSelectedRequestIds([
      'REQ-SIM-ENG-001',
      'REQ-SIM-TRD-001',
      'REQ-SIM-SNT-001'
    ]);

    const res = runSolveXOptimization(
      '2026-09-05',
      'SRR-CLT',
      'WZ-SRR-CLT-01',
      SIMULATED_TEST_REQUESTS.filter(r =>
        ['REQ-SIM-ENG-001', 'REQ-SIM-TRD-001', 'REQ-SIM-SNT-001'].includes(r.id)
      )
    );
    setOptimizationResult(res);
    setActiveTab('decision');
  };

  const handleRunOptimization = async () => {
    setIsEvaluating(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    const res = runSolveXOptimization(
      selectedDate,
      selectedSection,
      selectedWorkZone,
      currentRequests
    );
    setOptimizationResult(res);

    const comp = compareSaturdayVsSunday(
      selectedSection,
      selectedWorkZone,
      currentRequests
    );
    setTwoDayResult(comp);

    if (onApplyToMap) {
      onApplyToMap(selectedWorkZone, res.recommendedWindow);
    }
    setIsEvaluating(false);
  };

  const handleApprove = () => {
    if (!optimizationResult) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST';
    setOptimizationResult({
      ...optimizationResult,
      approvalStatus: 'Approved by Officer',
      approvedBy: 'Senior Divisional Operations Manager (Palakkad)',
      approvedAt: timeStr
    });
  };

  return (
    <div className="modal-overlay animate-fade-in" style={{ zIndex: 1100 }}>
      <div className="test-run-modal-dialog">
        {/* Header */}
        <div className="test-run-modal-header">
          <div className="d-flex align-center gap-2">
            <div className="test-run-icon-box">
              <Sparkles size={20} className="text-maroon" />
            </div>
            <div>
              <div className="d-flex align-center gap-2">
                <span className="badge-demo-tag">PROTOTYPE DECISION ENGINE</span>
                <span className="badge-simulated-tag">SIMULATED FEED</span>
              </div>
              <h2 className="modal-title">Realistic 2-Day Test Run / Decision Engine</h2>
              <p className="modal-subtitle">
                Evaluating Palakkad Division (PGT) Timetable (05–06 Sep 2026) · Multi-Departmental Possession Synthesizer
              </p>
            </div>
          </div>

          <div className="d-flex align-center gap-2">
            <button className="btn-secondary-sm" onClick={handleLoadDemoScenario} title="Load verified demo with 1 Engg + 1 TRD + 1 S&T request">
              <RotateCcw size={13} />
              <span>Load Demo Scenario</span>
            </button>
            <button className="btn-close-modal" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: Two columns */}
        <div className="test-run-modal-body">
          {/* Left Column: Test Configuration & Request Builder */}
          <div className="test-run-sidebar">
            <div className="sidebar-group">
              <label className="sidebar-label">1. Select Timetable Date</label>
              <div className="date-toggle-group">
                <button
                  className={`date-pill ${selectedDate === '2026-09-05' ? 'active' : ''}`}
                  onClick={() => setSelectedDate('2026-09-05')}
                >
                  <Calendar size={14} />
                  <span>Saturday, 05 Sep 2026</span>
                </button>
                <button
                  className={`date-pill ${selectedDate === '2026-09-06' ? 'active' : ''}`}
                  onClick={() => setSelectedDate('2026-09-06')}
                >
                  <Calendar size={14} />
                  <span>Sunday, 06 Sep 2026</span>
                </button>
              </div>
            </div>

            <div className="sidebar-group">
              <label className="sidebar-label">2. Target Railway Section</label>
              <select
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
                className="test-run-select"
              >
                <option value="SRR-CLT">Shoranur Jn – Kozhikode (SRR–CLT) · 86 km</option>
                <option value="PGT-SRR">Palakkad Jn – Shoranur Jn (PGT–SRR) · 46 km</option>
                <option value="SRR-NIL">Shoranur Jn – Nilambur Road Branch · 66 km</option>
              </select>
            </div>

            <div className="sidebar-group">
              <label className="sidebar-label">3. Maintenance Work Zone (Localized)</label>
              <select
                value={selectedWorkZone}
                onChange={e => setSelectedWorkZone(e.target.value)}
                className="test-run-select"
              >
                <option value="WZ-SRR-CLT-01">Pattambi (PTB) – Pallippuram (PUM) [km 598/200 – km 601/400 · UP Line]</option>
                <option value="WZ-SRR-CLT-02">Kuttippuram (KTU) – Tirur (TIR) [km 618/100 – km 622/500 · DN Line]</option>
                <option value="WZ-SRR-NIL-01">Vallapuzha (VPZ) – Kulukkallur (KZC) [km 10/500 – km 14/800 · Single Line]</option>
              </select>
              <small className="form-hint-text">
                ℹ Highlights specific track chainage only. The rest of the section remains operational.
              </small>
            </div>

            <div className="sidebar-group">
              <div className="d-flex justify-between align-center mb-1">
                <label className="sidebar-label">4. Simulated Departmental Requests</label>
                <span className="badge-demo-tag" style={{ fontSize: '9px' }}>SIMULATED</span>
              </div>
              <div className="simulated-requests-picker">
                {SIMULATED_TEST_REQUESTS.map(req => {
                  const isChecked = selectedRequestIds.includes(req.id);
                  return (
                    <div
                      key={req.id}
                      className={`request-select-card ${isChecked ? 'selected' : ''}`}
                      onClick={() => toggleRequestSelection(req.id)}
                    >
                      <div className="d-flex justify-between align-center">
                        <span className={`dept-pill dept-${req.dept.toLowerCase()}`}>{req.dept}</span>
                        <span className="text-monospace font-bold">{req.durationMin} min</span>
                      </div>
                      <div className="req-title font-bold mt-1">{req.workType}</div>
                      <div className="req-sub text-muted">{req.resources}</div>
                      <div className="req-meta mt-1">
                        <span className={`priority-tag priority-${req.priority.toLowerCase()}`}>
                          {req.priority}
                        </span>
                        <span className="badge-buffer">Buffer: {req.safetyBufferMin}m</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              className="btn-primary w-full run-opt-btn"
              disabled={isEvaluating}
              onClick={handleRunOptimization}
            >
              {isEvaluating ? (
                <>
                  <RotateCcw size={16} className="spin" />
                  <span>Evaluating Timetable Constraints...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>RUN SOLVEX OPTIMIZATION</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: SolveX Intelligence Display */}
          <div className="test-run-content">
            {/* View Switcher Tabs */}
            <div className="test-run-tabs-bar">
              <div className="tab-buttons-row">
                <button
                  className={`tab-button ${activeTab === 'decision' ? 'active' : ''}`}
                  onClick={() => setActiveTab('decision')}
                >
                  <Sparkles size={14} />
                  <span>SolveX Recommendation</span>
                </button>
                <button
                  className={`tab-button ${activeTab === 'timeline' ? 'active' : ''}`}
                  onClick={() => setActiveTab('timeline')}
                >
                  <Clock size={14} />
                  <span>Train Timeline View</span>
                </button>
                <button
                  className={`tab-button ${activeTab === 'comparison' ? 'active' : ''}`}
                  onClick={() => {
                    if (!twoDayResult) {
                      setTwoDayResult(compareSaturdayVsSunday(selectedSection, selectedWorkZone, currentRequests));
                    }
                    setActiveTab('comparison');
                  }}
                >
                  <Calendar size={14} />
                  <span>Saturday vs Sunday</span>
                </button>
              </div>

              <div className="simulated-feed-chip">
                <span className="pulse-dot" />
                <span>FEED: solvex_palakkad_trains_2026-09-05_06.json</span>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                TAB 1: DECISION PROCESS & SOLVEX RECOMMENDATION
               ══════════════════════════════════════════════════════════ */}
            {activeTab === 'decision' && optimizationResult && (
              <div className="decision-workbench animate-fade-in">
                {/* Visual 7-Step SolveX Progress Pipeline */}
                <div className="solvex-decision-pipeline">
                  <div className="pipeline-step completed">
                    <span className="step-num">1</span>
                    <span className="step-name">DETECT</span>
                  </div>
                  <div className="pipeline-arrow">➔</div>
                  <div className="pipeline-step completed">
                    <span className="step-num">2</span>
                    <span className="step-name">BUNDLE</span>
                  </div>
                  <div className="pipeline-arrow">➔</div>
                  <div className="pipeline-step completed">
                    <span className="step-num">3</span>
                    <span className="step-name">OPTIMIZE</span>
                  </div>
                  <div className="pipeline-arrow">➔</div>
                  <div className="pipeline-step completed">
                    <span className="step-num">4</span>
                    <span className="step-name">SCORE IMPACT</span>
                  </div>
                  <div className="pipeline-arrow">➔</div>
                  <div className="pipeline-step completed">
                    <span className="step-num">5</span>
                    <span className="step-name">REPLAN</span>
                  </div>
                  <div className="pipeline-arrow">➔</div>
                  <div className="pipeline-step completed">
                    <span className="step-num">6</span>
                    <span className="step-name">EXPLAIN</span>
                  </div>
                  <div className="pipeline-arrow">➔</div>
                  <div className={`pipeline-step ${optimizationResult.approvalStatus === 'Approved by Officer' ? 'approved' : 'pending'}`}>
                    <span className="step-num">7</span>
                    <span className="step-name">APPROVE</span>
                  </div>
                </div>

                {/* Primary Recommended Block Box */}
                <div className="recommended-result-card">
                  <div className="result-card-header">
                    <div>
                      <span className="badge-ai-recommend">AI RECOMMENDATION</span>
                      <h3 className="mt-1">
                        RECOMMENDED MAINTENANCE WINDOW: <span className="text-maroon">{optimizationResult.recommendedWindow} IST</span>
                      </h3>
                      <div className="result-meta-line text-muted">
                        <span>Date: <strong>{optimizationResult.weekday}, {optimizationResult.date}</strong></span> ·{' '}
                        <span>Work Zone: <strong>{optimizationResult.workZoneName}</strong></span> ·{' '}
                        <span>Track: <strong>{optimizationResult.workZoneLine}</strong> ({optimizationResult.chainage})</span>
                      </div>
                    </div>

                    <div className="result-score-box">
                      <span className="score-val">{optimizationResult.synergyScore}/100</span>
                      <span className="score-lbl">Synergy Score</span>
                    </div>
                  </div>

                  {/* Summary Metric Stats */}
                  <div className="result-stats-row">
                    <div className="stat-box">
                      <span className="lbl">Block Duration</span>
                      <strong className="val">{optimizationResult.bundledBlockDurationMin} min</strong>
                      <small className="sub text-success">Saved {optimizationResult.timeSavedMin}m via bundling</small>
                    </div>
                    <div className="stat-box">
                      <span className="lbl">Departments</span>
                      <strong className="val">{optimizationResult.departmentsInvolved.join(' + ')}</strong>
                      <small className="sub">{optimizationResult.requestsBundledCount} Requisitions Bundled</small>
                    </div>
                    <div className="stat-box">
                      <span className="lbl">Timetable Conflicts</span>
                      <strong className={`val ${optimizationResult.conflictsCount === 0 ? 'text-success' : 'text-danger'}`}>
                        {optimizationResult.conflictsCount} Conflicts
                      </strong>
                      <small className="sub">0 Headway Infringements</small>
                    </div>
                    <div className="stat-box">
                      <span className="lbl">Operational Impact</span>
                      <strong className="val text-success">{optimizationResult.operationalImpact}</strong>
                      <small className="sub">Zero Express Delays</small>
                    </div>
                  </div>

                  {/* Explainability Section: WHY THIS WINDOW? */}
                  <div className="explainability-box">
                    <div className="d-flex align-center gap-2 mb-2">
                      <Info size={16} className="text-maroon" />
                      <h4>WHY THIS WINDOW?</h4>
                    </div>
                    <div className="explanation-items">
                      {optimizationResult.explanationPoints.map((pt, i) => (
                        <div key={i} className="explanation-bullet">
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Officer Approval Action Area */}
                  <div className="officer-action-row">
                    {optimizationResult.approvalStatus === 'Approved by Officer' ? (
                      <div className="sanction-badge-banner">
                        <ShieldCheck size={22} className="text-success" />
                        <div>
                          <strong>PROTOTYPE APPROVAL RECORDED</strong>
                          <p>
                            Sanctioned by {optimizationResult.approvedBy} at {optimizationResult.approvedAt}.{' '}
                            <em>{optimizationResult.officialNote}</em>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex justify-between align-center w-full">
                        <div className="disclaimer-mini text-muted">
                          <small>Final operational authority remains with the designated railway officer.</small>
                        </div>
                        <div className="action-buttons-group">
                          <button className="btn-secondary-sm" onClick={() => alert('Modification requested: Planner can adjust time offsets or add safety buffers.')}>
                            <span>Modify</span>
                          </button>
                          <button className="btn-secondary-sm" onClick={() => alert('Window rejected. Solvex will re-evaluate alternative slots.')}>
                            <span>Reject</span>
                          </button>
                          <button className="btn-primary" onClick={handleApprove}>
                            <CheckCircle2 size={15} />
                            <span>APPROVE BLOCK</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Alternative Windows Ranked Comparison */}
                <div className="alternatives-section mt-3">
                  <h4>Alternative Candidate Windows Evaluated ({optimizationResult.candidateWindows.length})</h4>
                  <div className="alternatives-grid">
                    {optimizationResult.candidateWindows.slice(0, 4).map((alt, idx) => (
                      <div
                        key={idx}
                        className={`alt-card ${alt.window === optimizationResult.recommendedWindow ? 'recommended' : ''} ${alt.conflictsCount > 0 ? 'conflict' : ''}`}
                      >
                        <div className="d-flex justify-between align-center">
                          <strong className="alt-time">{alt.window}</strong>
                          {alt.window === optimizationResult.recommendedWindow ? (
                            <span className="badge-rec-pill">Recommended</span>
                          ) : alt.conflictsCount > 0 ? (
                            <span className="badge-conflict-pill">Conflict ({alt.conflictsCount})</span>
                          ) : (
                            <span className="badge-alt-pill">Option {idx + 1}</span>
                          )}
                        </div>
                        <div className="alt-specs mt-1">
                          <span>Score: {alt.score}/100</span> ·{' '}
                          <span>Impact: {alt.operationalImpact}</span>
                        </div>
                        <p className="alt-reason-text mt-1">{alt.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                TAB 2: TRAIN TIMELINE VIEW
               ══════════════════════════════════════════════════════════ */}
            {activeTab === 'timeline' && optimizationResult && (
              <div className="timeline-view-container animate-fade-in">
                <div className="timeline-header-info">
                  <h4>Timetable Passage vs. Maintenance Gap ({optimizationResult.date})</h4>
                  <p className="text-muted">
                    Work Zone: <strong>{optimizationResult.workZoneName}</strong>. Demonstrates exact gap between train passages.
                  </p>
                </div>

                <div className="train-timeline-track">
                  {optimizationResult.timelineEvents.map((evt, idx) => {
                    const isRecBlock = evt.type === 'window_start' || evt.type === 'window_end';
                    return (
                      <div
                        key={idx}
                        className={`timeline-event-card ${isRecBlock ? 'maintenance-event' : 'train-event'} ${evt.isConflict ? 'has-conflict' : ''}`}
                        onClick={() => {
                          if (evt.trainData) setSelectedTrainDetail(evt.trainData);
                        }}
                      >
                        <div className="event-time-col">
                          <strong>{evt.time}</strong>
                          <span className="event-type-tag">{isRecBlock ? 'BLOCK' : 'TRAIN'}</span>
                        </div>
                        <div className="event-details-col">
                          <div className="event-title">
                            {isRecBlock ? (
                              <span className="text-maroon font-bold">{evt.title}</span>
                            ) : (
                              <span className="d-flex align-center gap-1 font-bold">
                                <Train size={14} className="text-navy" />
                                <span>{evt.title}</span>
                              </span>
                            )}
                          </div>
                          <div className="event-subtitle text-muted">{evt.subtitle}</div>
                        </div>

                        {!isRecBlock && (
                          <div className="event-status-col">
                            {evt.isConflict ? (
                              <span className="badge-danger-xs">Conflict</span>
                            ) : (
                              <span className="badge-success-xs">Clear</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Train Detail Popup */}
                {selectedTrainDetail && (
                  <div className="train-detail-popup mt-3 animate-slide-up">
                    <div className="d-flex justify-between align-center">
                      <div className="d-flex align-center gap-2">
                        <Train size={18} className="text-maroon" />
                        <strong>
                          {selectedTrainDetail.trainNo} · {selectedTrainDetail.trainName}
                        </strong>
                      </div>
                      <button className="btn-close-sm" onClick={() => setSelectedTrainDetail(null)}>
                        <X size={14} />
                      </button>
                    </div>
                    <div className="popup-grid mt-2">
                      <div>Passage: <strong>{selectedTrainDetail.arrival} – {selectedTrainDetail.departure}</strong></div>
                      <div>Reference: <strong>{selectedTrainDetail.station}</strong></div>
                      <div>Direction: <strong>{selectedTrainDetail.direction}</strong></div>
                      <div>Source: <strong>ConfirmTkt Seed Timetable</strong></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                TAB 3: TWO-DAY COMPARISON (SATURDAY VS SUNDAY)
               ══════════════════════════════════════════════════════════ */}
            {activeTab === 'comparison' && twoDayResult && (
              <div className="two-day-comparison-container animate-fade-in">
                <div className="comparison-banner">
                  <div className="d-flex align-center gap-2">
                    <Calendar size={20} className="text-maroon" />
                    <div>
                      <h3>TWO-DAY OPERATIONAL COMPARISON</h3>
                      <p className="text-muted">
                        Comparing Saturday, 05 Sep 2026 vs. Sunday, 06 Sep 2026 in <strong>{twoDayResult.workZoneName}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="recommended-day-badge">
                    <span>RECOMMENDED DAY:</span>
                    <strong>{twoDayResult.recommendedDay.toUpperCase()}</strong>
                  </div>
                </div>

                <div className="two-days-grid mt-3">
                  {/* Saturday Card */}
                  <div className={`day-card ${twoDayResult.recommendedDay === 'Saturday' ? 'winner' : ''}`}>
                    <div className="day-header">
                      <h4>{twoDayResult.saturday.date}</h4>
                      {twoDayResult.recommendedDay === 'Saturday' && (
                        <span className="badge-winner">Recommended Option</span>
                      )}
                    </div>
                    <div className="day-metrics">
                      <div className="metric-row">
                        <span>Best Window:</span>
                        <strong className="text-maroon">{twoDayResult.saturday.bestWindow}</strong>
                      </div>
                      <div className="metric-row">
                        <span>Timetable Conflicts:</span>
                        <strong className="text-success">{twoDayResult.saturday.conflicts}</strong>
                      </div>
                      <div className="metric-row">
                        <span>Operational Impact:</span>
                        <strong>{twoDayResult.saturday.impact}</strong>
                      </div>
                      <div className="metric-row">
                        <span>Synergy Score:</span>
                        <strong>{twoDayResult.saturday.synergyScore}/100</strong>
                      </div>
                      <div className="metric-row">
                        <span>Trains Evaluated:</span>
                        <span>{twoDayResult.saturday.trainsChecked} services</span>
                      </div>
                    </div>
                    <div className="day-notes mt-2 text-muted">
                      <em>Includes Saturday-only service 22476 CBE HSR AC EXP clearance.</em>
                    </div>
                  </div>

                  {/* Sunday Card */}
                  <div className={`day-card ${twoDayResult.recommendedDay === 'Sunday' ? 'winner' : ''}`}>
                    <div className="day-header">
                      <h4>{twoDayResult.sunday.date}</h4>
                      {twoDayResult.recommendedDay === 'Sunday' && (
                        <span className="badge-winner">Recommended Option</span>
                      )}
                    </div>
                    <div className="day-metrics">
                      <div className="metric-row">
                        <span>Best Window:</span>
                        <strong className="text-maroon">{twoDayResult.sunday.bestWindow}</strong>
                      </div>
                      <div className="metric-row">
                        <span>Timetable Conflicts:</span>
                        <strong className="text-success">{twoDayResult.sunday.conflicts}</strong>
                      </div>
                      <div className="metric-row">
                        <span>Operational Impact:</span>
                        <strong>{twoDayResult.sunday.impact}</strong>
                      </div>
                      <div className="metric-row">
                        <span>Synergy Score:</span>
                        <strong>{twoDayResult.sunday.synergyScore}/100</strong>
                      </div>
                      <div className="metric-row">
                        <span>Trains Evaluated:</span>
                        <span>{twoDayResult.sunday.trainsChecked} services</span>
                      </div>
                    </div>
                    <div className="day-notes mt-2 text-muted">
                      <em>Includes Sunday services 16621 RMM MAQ EXP and 22852 Vivek Express.</em>
                    </div>
                  </div>
                </div>

                <div className="comparison-verdict-box mt-3">
                  <Check size={18} className="text-success flex-shrink-0" />
                  <div>
                    <strong>SolveX Verdict:</strong>
                    <p>{twoDayResult.comparisonReason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="test-run-modal-footer">
          <div className="d-flex align-center gap-2 text-muted" style={{ fontSize: '11px' }}>
            <Info size={13} />
            <span>
              Prototype simulation uses the supplied 05–06 Sep 2026 scheduled timetable dataset. Results are for demonstration only and are not live railway operational decisions.
            </span>
          </div>
          <button className="btn-secondary-sm" onClick={onClose}>
            Close Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
