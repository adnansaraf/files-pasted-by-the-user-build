import React, { useState } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Clock,
  Sparkles,
  Shield,
  Train,
  Check,
  AlertTriangle,
  ArrowRight,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PriorityLevel } from '../types';

export const SimulatorPage: React.FC = () => {
  const {
    whatIfState,
    setWhatIfState,
    whatIfResults,
    sections,
    navigateTo
  } = useApp();

  const [appliedNotice, setAppliedNotice] = useState(false);

  // Baseline "Current Plan" metrics
  const currentPlan = {
    blockHours: '3.0h',
    jobsCompleted: '3 Jobs',
    conflicts: '1 Conflict',
    trainImpactMin: '14 min',
    assetDowntime: '3.0h',
    assetAvailability: '92%'
  };

  const handleApplyScenario = () => {
    setAppliedNotice(true);
    setTimeout(() => {
      navigateTo('AI Optimizer');
    }, 1200);
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="page-badge">SANDBOX SIMULATION BENCH</div>
          <h1 className="page-title">What-if Scenario Simulator</h1>
          <p className="page-subtitle">
            Stress-test schedule variations, duration adjustments, and train delay scenarios before committing changes
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={() => {
            setWhatIfState({
              sectionId: 'A-B',
              blockStart: '02:00',
              durationHours: 3.0,
              priority: 'High',
              trainCondition: 'Normal Schedule',
              coordinatedJobsCount: 3
            });
            setAppliedNotice(false);
          }}
        >
          <RotateCcw size={15} />
          <span>Reset Scenario Defaults</span>
        </button>
      </div>

      {/* Main Simulator Layout: Left Controls, Right Comparative Dashboard */}
      <div className="simulator-grid">
        {/* Left Column: Interactive Scenario Controls */}
        <div className="sim-controls-card">
          <div className="panel-header">
            <h3 className="panel-title">Operational Scenario Controls</h3>
            <span className="text-xs text-muted">Adjust parameters in real time</span>
          </div>

          <div className="sim-control-field">
            <label>Target Railway Section</label>
            <select
              value={whatIfState.sectionId}
              onChange={e => setWhatIfState(prev => ({ ...prev, sectionId: e.target.value }))}
            >
              {sections.map(s => (
                <option key={s.id} value={s.id}>
                  Section {s.id} ({s.fromCode}–{s.toCode}: {s.fromName}–{s.toName})
                </option>
              ))}
            </select>
          </div>

          <div className="sim-control-field">
            <label>Block Start Time</label>
            <input
              type="time"
              value={whatIfState.blockStart}
              onChange={e => setWhatIfState(prev => ({ ...prev, blockStart: e.target.value }))}
            />
          </div>

          <div className="sim-control-field">
            <div className="slider-label-row">
              <label>Block Duration Window</label>
              <strong className="slider-val-tag">{whatIfState.durationHours.toFixed(1)} Hours</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.5"
              value={whatIfState.durationHours}
              onChange={e =>
                setWhatIfState(prev => ({ ...prev, durationHours: parseFloat(e.target.value) }))
              }
              className="sim-range-slider"
            />
            <div className="slider-ticks">
              <span>1.0h</span>
              <span>2.0h</span>
              <span>3.0h (Standard)</span>
              <span>4.5h</span>
              <span>6.0h (Extended)</span>
            </div>
          </div>

          <div className="sim-control-field">
            <label>Corridor Maintenance Priority</label>
            <select
              value={whatIfState.priority}
              onChange={e =>
                setWhatIfState(prev => ({ ...prev, priority: e.target.value as PriorityLevel }))
              }
            >
              <option value="Critical">Critical (Track geometry failure risk)</option>
              <option value="High">High (Standard scheduled maintenance)</option>
              <option value="Medium">Medium (Routine periodic overhaul)</option>
              <option value="Low">Low (Preventive cosmetic activity)</option>
            </select>
          </div>

          <div className="sim-control-field">
            <label>Train Running / Weather Scenario</label>
            <select
              value={whatIfState.trainCondition}
              onChange={e =>
                setWhatIfState(prev => ({
                  ...prev,
                  trainCondition: e.target.value as any
                }))
              }
            >
              <option value="Normal Schedule">Normal Timetable Operations</option>
              <option value="Delayed Express 12617">Delayed Express 12617 (+25 min detention)</option>
              <option value="Heavy Freight Congestion">Heavy Freight Congestion (Cochin Port Rakes)</option>
              <option value="Monsoon Speed Restriction">Monsoon Speed Restriction (30 km/h Caution Order)</option>
            </select>
          </div>

          <div className="sim-control-field">
            <label>Department Jobs Included in Joint Possession</label>
            <div className="job-toggle-row">
              <button
                type="button"
                className={`job-pill ${whatIfState.coordinatedJobsCount >= 1 ? 'active' : ''}`}
                onClick={() => setWhatIfState(prev => ({ ...prev, coordinatedJobsCount: 1 }))}
              >
                1 Job (Engg Only)
              </button>
              <button
                type="button"
                className={`job-pill ${whatIfState.coordinatedJobsCount >= 2 ? 'active' : ''}`}
                onClick={() => setWhatIfState(prev => ({ ...prev, coordinatedJobsCount: 2 }))}
              >
                2 Jobs (Engg + TRD)
              </button>
              <button
                type="button"
                className={`job-pill ${whatIfState.coordinatedJobsCount >= 3 ? 'active' : ''}`}
                onClick={() => setWhatIfState(prev => ({ ...prev, coordinatedJobsCount: 3 }))}
              >
                3 Jobs (All 3 Depts)
              </button>
            </div>
          </div>

          <div className="sim-actions-col">
            <button
              className="btn-primary-block"
              onClick={handleApplyScenario}
              disabled={appliedNotice}
            >
              {appliedNotice ? (
                <>
                  <Check size={16} />
                  <span>Scenario Applied! Redirecting to Optimizer...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Apply Scenario to Optimizer</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Comparative Dashboard (CURRENT vs SIMULATED) */}
        <div className="sim-results-card">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Comparative Impact Analysis</h3>
              <span className="text-xs text-muted">Real-time delta between Approved Baseline and Simulated Scenario</span>
            </div>
            <span className="badge-comparison">
              Scenario: {whatIfState.trainCondition}
            </span>
          </div>

          <div className="comparison-columns-container">
            {/* Column 1: Current Baseline Plan */}
            <div className="comparison-card baseline-card">
              <div className="comp-header">
                <span className="comp-tag">CURRENT PLAN (BASELINE)</span>
                <h4>Approved Plan OPT-PGT-308</h4>
                <small className="text-muted">3.0h Window (02:00–05:00)</small>
              </div>

              <div className="comp-metrics-list">
                <div className="comp-metric-row">
                  <span>Total Block Hours</span>
                  <strong>{currentPlan.blockHours}</strong>
                </div>
                <div className="comp-metric-row">
                  <span>Coordinated Jobs</span>
                  <strong>{currentPlan.jobsCompleted}</strong>
                </div>
                <div className="comp-metric-row">
                  <span>Train Path Conflicts</span>
                  <strong className="text-warning">{currentPlan.conflicts}</strong>
                </div>
                <div className="comp-metric-row">
                  <span>Estimated Train Impact</span>
                  <strong className="text-success">{currentPlan.trainImpactMin}</strong>
                </div>
                <div className="comp-metric-row">
                  <span>Track Downtime</span>
                  <strong>{currentPlan.assetDowntime}</strong>
                </div>
                <div className="comp-metric-row">
                  <span>Section Availability</span>
                  <strong className="text-success">{currentPlan.assetAvailability}</strong>
                </div>
              </div>
            </div>

            {/* Column 2: Simulated Scenario Plan */}
            <div className="comparison-card simulated-card">
              <div className="comp-header">
                <span className="comp-tag tag-simulated">SIMULATED SCENARIO</span>
                <h4>Dynamic What-If Model</h4>
                <small className="text-muted">
                  {whatIfState.durationHours.toFixed(1)}h Window ({whatIfState.blockStart} start)
                </small>
              </div>

              <div className="comp-metrics-list">
                <div className="comp-metric-row">
                  <span>Total Block Hours</span>
                  <strong className={whatIfResults.blockHours > 3.0 ? 'text-danger' : 'text-success'}>
                    {whatIfResults.blockHours}h
                  </strong>
                </div>
                <div className="comp-metric-row">
                  <span>Coordinated Jobs</span>
                  <strong>{whatIfResults.jobsCompleted} Jobs</strong>
                </div>
                <div className="comp-metric-row">
                  <span>Train Path Conflicts</span>
                  <strong className={whatIfResults.conflicts > 1 ? 'text-danger' : 'text-success'}>
                    {whatIfResults.conflicts} Conflict{whatIfResults.conflicts !== 1 ? 's' : ''}
                  </strong>
                </div>
                <div className="comp-metric-row">
                  <span>Estimated Train Impact</span>
                  <strong className={whatIfResults.trainImpactMin > 20 ? 'text-danger' : 'text-success'}>
                    {whatIfResults.trainImpactMin} min delay
                  </strong>
                </div>
                <div className="comp-metric-row">
                  <span>Track Downtime</span>
                  <strong>{whatIfResults.assetDowntimeHours}h</strong>
                </div>
                <div className="comp-metric-row">
                  <span>Section Availability</span>
                  <strong className={whatIfResults.assetAvailabilityPercent < 90 ? 'text-warning' : 'text-success'}>
                    {whatIfResults.assetAvailabilityPercent}%
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Meters Comparison */}
          <div className="sim-visual-meters-box">
            <h4>Punctuality & Asset Availability Meters</h4>

            <div className="meter-unit">
              <div className="meter-label-row">
                <span>Estimated Passenger Train Delay (Min)</span>
                <strong>{whatIfResults.trainImpactMin} min (Baseline: 14 min)</strong>
              </div>
              <div className="meter-track">
                <div
                  className={`meter-bar-fill ${whatIfResults.trainImpactMin > 25 ? 'bg-danger' : 'bg-success'}`}
                  style={{ width: `${Math.min(100, (whatIfResults.trainImpactMin / 60) * 100)}%` }}
                />
              </div>
            </div>

            <div className="meter-unit">
              <div className="meter-label-row">
                <span>Infrastructure Asset Availability Index</span>
                <strong>{whatIfResults.assetAvailabilityPercent}% (Baseline: 92%)</strong>
              </div>
              <div className="meter-track">
                <div
                  className="meter-bar-fill bg-info"
                  style={{ width: `${whatIfResults.assetAvailabilityPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="sim-disclaimer-note">
            <Info size={14} className="text-muted flex-shrink-0" />
            <span>
              All simulated outcomes are mathematical estimates generated by the SolveX decision support engine
              to aid railway planners during timetable reviews and monsoon contingency planning.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
