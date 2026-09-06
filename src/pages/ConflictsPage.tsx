import React, { useState } from 'react';
import {
  TriangleAlert,
  Train,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Shield,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GanttTimeline } from '../components/GanttTimeline';

export const ConflictsPage: React.FC = () => {
  const { conflicts, navigateTo, setSelectedSectionId } = useApp();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [activeConflictId, setActiveConflictId] = useState<string | null>(conflicts[0]?.id || null);

  const criticalCount = conflicts.filter(c => c.severity === 'Critical').length;
  const highCount = conflicts.filter(c => c.severity === 'High').length;
  const mediumCount = conflicts.filter(c => c.severity === 'Medium').length;
  const resolvedCount = conflicts.filter(c => c.severity === 'Resolved').length;

  const activeConflict = conflicts.find(c => c.id === activeConflictId) || conflicts[0] || null;

  const filteredConflicts = conflicts.filter(c => {
    if (selectedSeverity === 'All') return true;
    return c.severity === selectedSeverity;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="page-badge">OPERATIONAL CONFLICT RESOLUTION</div>
          <h1 className="page-title">Conflict Detection & Resolution</h1>
          <p className="page-subtitle">
            Identify train movement overlaps, section unavailability, and evaluate lower-impact scheduling windows
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => navigateTo('AI Optimizer')}
        >
          <Sparkles size={16} />
          <span>Auto-Resolve via Optimizer</span>
        </button>
      </div>

      {/* Summary Filter Strip */}
      <div className="stat-strip">
        <div
          className={`stat-box clickable ${selectedSeverity === 'All' ? 'active-border' : ''}`}
          onClick={() => setSelectedSeverity('All')}
        >
          <span className="stat-box-num">{conflicts.length}</span>
          <span className="stat-box-label">All Conflicts</span>
        </div>
        <div
          className={`stat-box clickable ${selectedSeverity === 'Critical' ? 'active-border' : ''}`}
          onClick={() => setSelectedSeverity('Critical')}
        >
          <span className="stat-box-num text-danger">{criticalCount}</span>
          <span className="stat-box-label">Critical Overlaps</span>
        </div>
        <div
          className={`stat-box clickable ${selectedSeverity === 'High' ? 'active-border' : ''}`}
          onClick={() => setSelectedSeverity('High')}
        >
          <span className="stat-box-num text-warning">{highCount}</span>
          <span className="stat-box-label">High Priority</span>
        </div>
        <div
          className={`stat-box clickable ${selectedSeverity === 'Medium' ? 'active-border' : ''}`}
          onClick={() => setSelectedSeverity('Medium')}
        >
          <span className="stat-box-num text-amber">{mediumCount}</span>
          <span className="stat-box-label">Medium Priority</span>
        </div>
        <div
          className={`stat-box clickable ${selectedSeverity === 'Resolved' ? 'active-border' : ''}`}
          onClick={() => setSelectedSeverity('Resolved')}
        >
          <span className="stat-box-num text-success">{resolvedCount}</span>
          <span className="stat-box-label">Resolved / Mitigated</span>
        </div>
      </div>

      {/* Empty State or Active Conflict Detail */}
      {!activeConflict ? (
        <div className="table-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={48} style={{ color: '#16a34a' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--slate-800)', margin: 0 }}>
              Zero Operational Conflicts Detected
            </h2>
            <p style={{ color: 'var(--slate-500)', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
              All current train paths have clear clearance and no maintenance block overlaps are currently active on Palakkad Division.
            </p>
            <button
              className="btn-primary"
              style={{ marginTop: '8px' }}
              onClick={() => navigateTo('Maintenance Requests')}
            >
              Go to Maintenance Requests
            </button>
          </div>
        </div>
      ) : (
        <>
        {/* Main Conflict Detail Hero Box */}
      <div className="conflict-hero-card">
        <div className="conflict-hero-header">
          <div className="conflict-icon-large">
            <TriangleAlert size={28} className="text-danger" />
          </div>
          <div className="conflict-header-titles">
            <div className="badge-row">
              <span className={`badge-severity badge-${activeConflict.severity.toLowerCase()}`}>
                {activeConflict.severity} CONFLICT
              </span>
              <span className="badge-section">{activeConflict.sectionName}</span>
              <span className="text-xs text-muted">Conflict ID: {activeConflict.id}</span>
            </div>
            <h2>{activeConflict.description}</h2>
            <div className="conflict-meta-line">
              <span><strong>Requested Block Window:</strong> {activeConflict.blockTime}</span>
              <span><strong>Collision Point:</strong> {activeConflict.conflictPointTime} IST</span>
              <span>
                <strong>Conflicting Service:</strong> {activeConflict.conflictingTrain.trainNo} · {activeConflict.conflictingTrain.trainName} (Section <span className="block-sec-tag">{activeConflict.sectionId}</span>)
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Visualizer of the Conflict */}
        <div className="conflict-timeline-box">
          <div className="box-title-row">
            <h4>Corridor Timeline Collision Point (Section {activeConflict.sectionId})</h4>
            <span className="text-xs text-muted">
              Red pin marks estimated train passage intersecting maintenance possession
            </span>
          </div>
          <GanttTimeline />
        </div>

        {/* Alternative Windows Comparison */}
        {activeConflict.alternatives.length > 0 && (
          <div className="conflict-alternatives-box">
            <h3 className="section-heading">SolveX Evaluated Alternative Windows</h3>
            <div className="alternatives-grid">
              {activeConflict.alternatives.map((opt, idx) => {
                const isRec = opt.isRecommended;
                return (
                  <div
                    key={opt.optionId}
                    className={`alternative-card ${isRec ? 'card-recommended' : ''}`}
                  >
                    <div className="alt-head">
                      <div>
                        <span className={`alt-pill ${isRec ? 'pill-rec' : 'pill-alt'}`}>
                          {isRec ? 'Recommended Window' : `Alternative #${idx + 1}`}
                        </span>
                        <h4 className="alt-title">{opt.label}</h4>
                      </div>
                    </div>

                    <div className="alt-timing-box">
                      <Clock size={14} className="text-muted" />
                      <strong>Window: {opt.window}</strong>
                    </div>

                    <div className="alt-impact-note">
                      <span className="label">Train Impact:</span>
                      <strong className={opt.trainDelayMin > 15 ? 'text-danger' : 'text-success'}>
                        {opt.trainImpact}
                      </strong>
                    </div>

                    <p className="alt-reason-text">{opt.reason}</p>

                    {isRec ? (
                      <button
                        className="btn-primary-block"
                        onClick={() => {
                          setSelectedSectionId(activeConflict.sectionId);
                          navigateTo('AI Optimizer');
                        }}
                      >
                        <span>Apply Recommended Window (Option A)</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        className="btn-secondary-block"
                        onClick={() => alert(`Selected ${opt.label}. Updating block planner scenario.`)}
                      >
                        Simulate this Window
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* List of Other Active Conflicts */}
      <div className="table-card">
        <div className="panel-header">
          <h3 className="panel-title">All Track & Train Path Conflicts ({filteredConflicts.length})</h3>
          <span className="text-xs text-muted">Click any row to load operational collision analysis</span>
        </div>
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Severity</th>
              <th>Section</th>
              <th>Requested Window</th>
              <th>Conflicting Train</th>
              <th>Collision Time</th>
              <th>Recommended Action</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredConflicts.map(c => (
              <tr
                key={c.id}
                className={c.id === activeConflictId ? 'row-selected' : ''}
                onClick={() => setActiveConflictId(c.id)}
                style={{ cursor: 'pointer' }}
              >
                <td><strong>{c.id}</strong></td>
                <td>
                  <span className={`badge-severity badge-${c.severity.toLowerCase()}`}>
                    {c.severity}
                  </span>
                </td>
                <td>{c.sectionName}</td>
                <td>{c.blockTime}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong>{c.conflictingTrain.trainNo}</strong>
                    <span className="block-sec-tag">{c.sectionId}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--slate-500)' }}>{c.conflictingTrain.trainName}</div>
                </td>
                <td><strong className="text-danger">{c.conflictPointTime}</strong></td>
                <td>
                  {c.alternatives.find(a => a.isRecommended)?.label || 'Mitigated under pilot train order'}
                </td>
                <td className="text-right">
                  <button className="btn-link-sm">Analyze →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
      )}
    </div>
  );
};
