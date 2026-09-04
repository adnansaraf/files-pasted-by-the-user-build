import React from 'react';
import {
  Network,
  Layers,
  Train,
  Wrench,
  Zap,
  Radio,
  Clock,
  Shield,
  Search,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SchematicMap } from '../components/SchematicMap';

export const NetworkPage: React.FC = () => {
  const {
    sections,
    selectedSectionId,
    setSelectedSectionId,
    selectedSection,
    requests,
    blocks,
    conflicts,
    navigateTo
  } = useApp();

  const sectionRequests = requests.filter(r => r.sectionId === selectedSectionId);
  const sectionBlocks = blocks.filter(b => b.sectionId === selectedSectionId);
  const sectionConflicts = conflicts.filter(c => c.sectionId === selectedSectionId);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="page-badge">SPATIAL CORRIDOR INTELLIGENCE</div>
          <h1 className="page-title">Railway Network (Palakkad Division)</h1>
          <p className="page-subtitle">
            Schematic operational topology showing block possessions, electrical feeder zones, and train movements
          </p>
        </div>

        <div className="header-actions-group">
          <button
            className="btn-secondary"
            onClick={() => navigateTo('Block Planner')}
          >
            <Clock size={15} />
            <span>Open 24h Gantt Timeline</span>
          </button>
          <button
            className="btn-primary"
            onClick={() => navigateTo('AI Optimizer')}
          >
            <Sparkles size={16} />
            <span>Optimize Active Corridor</span>
          </button>
        </div>
      </div>

      {/* Main Full Schematic Network Workbench */}
      <div className="network-workbench-card">
        <SchematicMap compact={false} />
      </div>

      {/* Quick Section Selector Row */}
      <div className="section-pills-strip">
        <span className="strip-label">Select Corridor Section:</span>
        <div className="pills-scroll-container">
          {sections.map(s => {
            const isSelected = selectedSectionId === s.id;
            return (
              <button
                key={s.id}
                className={`corridor-pill-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedSectionId(s.id)}
              >
                <strong>{s.fromCode}–{s.toCode}</strong>
                <span>Section {s.id}</span>
                <span className={`status-indicator status-${s.status.toLowerCase().replace(/ /g, '-')}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Operational Intelligence Drawer */}
      <div className="network-details-grid">
        {/* Active Block / Maintenance Status */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h4>Section {selectedSection.id} Maintenance Status</h4>
            <span className={`status-pill status-${selectedSection.status.toLowerCase().replace(/ /g, '-')}`}>
              {selectedSection.status}
            </span>
          </div>

          <div className="panel-inner-body">
            {sectionBlocks.length > 0 ? (
              sectionBlocks.map(b => (
                <div key={b.id} className="block-summary-tile">
                  <div className="d-flex justify-between align-center mb-1">
                    <strong className="text-maroon">{b.id} ({b.departments.join(' + ')})</strong>
                    <span className="text-xs text-muted">{b.scheduledStart}–{b.expectedEnd}</span>
                  </div>
                  <p className="text-sm text-slate">{b.workSummary}</p>
                  <div className="progress-bar-sm mt-2">
                    <div className="progress-fill bg-success" style={{ width: `${b.progressPercent}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state-card">
                <Clock size={20} className="text-muted" />
                <p>No active possession in progress on this section right now.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Requests on this Section */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h4>Pending Departmental Applications ({sectionRequests.length})</h4>
            <button
              className="btn-link"
              onClick={() => navigateTo('Maintenance Requests')}
            >
              <span>View All Requests</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="panel-inner-body">
            {sectionRequests.length > 0 ? (
              <div className="requests-compact-list">
                {sectionRequests.map(r => (
                  <div key={r.id} className="request-compact-item">
                    <div className="d-flex justify-between align-center">
                      <strong className="text-monospace">{r.id}</strong>
                      <span className={`priority-tag priority-${r.priority.toLowerCase()}`}>
                        {r.priority} ({r.priorityScore})
                      </span>
                    </div>
                    <div className="text-sm font-medium">{r.workType}</div>
                    <small className="text-muted">
                      {r.dept} · Req: {r.requestedDuration}h (Pred: {r.predictedDuration}h) · Window: {r.preferredTimeWindow}
                    </small>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-card">
                <p>No pending maintenance requests registered for this section.</p>
              </div>
            )}
          </div>
        </div>

        {/* Operational Constraints & Caution Orders */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h4>Civil & Traction Engineering Limits</h4>
            <Shield size={16} className="text-muted" />
          </div>

          <div className="panel-inner-body">
            <div className="spec-list">
              <div className="spec-row">
                <span>Maximum Permissible Speed (MPS):</span>
                <strong>{selectedSection.mps} km/h</strong>
              </div>
              <div className="spec-row">
                <span>Corridor Track Type:</span>
                <strong>{selectedSection.tracks} (BG 1676mm)</strong>
              </div>
              <div className="spec-row">
                <span>Electrification System:</span>
                <strong>{selectedSection.traction}</strong>
              </div>
              <div className="spec-row">
                <span>Track Section Length:</span>
                <strong>{selectedSection.lengthKm} Route Kilometers</strong>
              </div>
              {selectedSection.currentSpeedRestriction && (
                <div className="caution-spec-row">
                  <span className="text-warning font-bold">Caution Order:</span>
                  <strong>{selectedSection.currentSpeedRestriction}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
