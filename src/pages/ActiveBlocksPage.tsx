import React, { useState } from 'react';
import {
  Activity,
  Clock,
  Wrench,
  Zap,
  Radio,
  Train,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MaintenanceBlock } from '../types';
import { BlockDetailModal } from '../components/BlockDetailModal';

export const ActiveBlocksPage: React.FC = () => {
  const {
    blocks,
    reportDelay,
    markBlockComplete,
    setInspectingBlock,
    navigateTo,
    setSelectedSectionId
  } = useApp();

  const [selectedBlock, setSelectedBlock] = useState<MaintenanceBlock>(blocks[0]);

  const activeCount = blocks.filter(b => b.status === 'Active' || b.status === 'Delayed').length;
  const delayedCount = blocks.filter(b => b.status === 'Delayed').length;
  const completedCount = blocks.filter(b => b.status === 'Completed').length;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="page-badge">LIVE TRACK POSSESSION MONITOR</div>
          <h1 className="page-title">Active Maintenance Blocks</h1>
          <p className="page-subtitle">
            Real-time tracking of track possessions, traction isolations, and crew execution conditions across Palakkad Division
          </p>
        </div>

        <div className="header-actions-group">
          <button
            className="btn-danger-outline"
            onClick={() => {
              reportDelay('BLK-204', 45, 'Subgrade instability at km 532 requiring packing passes');
            }}
          >
            <RotateCcw size={15} />
            <span>Simulate Overrun on BLK-204</span>
          </button>
          <button
            className="btn-primary"
            onClick={() => navigateTo('Block Planner')}
          >
            <Clock size={15} />
            <span>Open 24h Timeline</span>
          </button>
        </div>
      </div>

      {/* Live Stats Strip */}
      <div className="stat-strip">
        <div className="stat-box">
          <span className="stat-box-num text-success">{activeCount}</span>
          <span className="stat-box-label">Active Possessions</span>
        </div>
        <div className="stat-box">
          <span className="stat-box-num text-danger">{delayedCount > 0 ? delayedCount : '1 Pending'}</span>
          <span className="stat-box-label">Overrun / Delay Alerts</span>
        </div>
        <div className="stat-box">
          <span className="stat-box-num text-info">2</span>
          <span className="stat-box-label">OHE Power Cut Offs Active</span>
        </div>
        <div className="stat-box">
          <span className="stat-box-num text-navy">42 Staff</span>
          <span className="stat-box-label">On-Track Personnel Deployed</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="table-card">
        <div className="panel-header">
          <h3 className="panel-title">Live Execution Register</h3>
          <span className="text-xs text-muted">Click any block to inspect site details or report execution delays</span>
        </div>

        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Block ID</th>
              <th>Section (Palakkad Div)</th>
              <th>Departments</th>
              <th>Scheduled Start</th>
              <th>Expected Finish</th>
              <th>Work Progress</th>
              <th>Operating Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map(b => {
              const isOverrun = b.status === 'Delayed' || b.expectedEnd > b.scheduledEnd;
              return (
                <tr
                  key={b.id}
                  className={selectedBlock.id === b.id ? 'row-selected' : ''}
                  onClick={() => setSelectedBlock(b)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <strong className="text-maroon text-monospace">{b.id}</strong>
                  </td>
                  <td>
                    <button
                      className="section-clickable-btn"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedSectionId(b.sectionId);
                        navigateTo('Railway Network');
                      }}
                    >
                      {b.sectionName}
                    </button>
                  </td>
                  <td>
                    <div className="dept-tags-row">
                      {b.departments.map(d => (
                        <span key={d} className={`dept-pill dept-${d.toLowerCase()}`}>
                          {d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <strong>{b.scheduledStart}</strong>
                  </td>
                  <td>
                    <strong className={isOverrun ? 'text-danger font-bold' : ''}>
                      {b.expectedEnd} {isOverrun ? '(+45m)' : ''}
                    </strong>
                  </td>
                  <td>
                    <div className="table-progress-box">
                      <div className="progress-bar-sm">
                        <div
                          className={`progress-fill ${isOverrun ? 'bg-danger' : 'bg-success'}`}
                          style={{ width: `${b.progressPercent}%` }}
                        />
                      </div>
                      <span className="progress-text">{b.progressPercent}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill status-${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="text-right" onClick={e => e.stopPropagation()}>
                    <div className="btn-group-right">
                      {b.id === 'BLK-204' && (
                        <button
                          className="btn-danger-xs"
                          onClick={() => {
                            reportDelay(b.id, 45, 'Track tamping needs additional passes due to wet formation');
                          }}
                        >
                          Report Delay
                        </button>
                      )}
                      <button
                        className="btn-secondary-xs"
                        onClick={() => setInspectingBlock(b)}
                      >
                        Inspect
                      </button>
                      {b.status !== 'Completed' && (
                        <button
                          className="btn-success-xs"
                          onClick={() => markBlockComplete(b.id)}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Block Detailed Telemetry Card */}
      <div className="active-block-card">
        <div className="block-card-header">
          <div>
            <div className="d-flex align-center gap-2">
              <span className="badge-section">Section {selectedBlock.sectionId}</span>
              <span className={`status-pill status-${selectedBlock.status.toLowerCase()}`}>
                {selectedBlock.status}
              </span>
            </div>
            <h2>
              {selectedBlock.id}: {selectedBlock.workSummary}
            </h2>
            <p className="text-muted text-sm">
              Corridor: {selectedBlock.sectionName} · Shift: 02:00–04:45 IST
            </p>
          </div>

          <div className="block-progress-card">
            <div className="progress-header">
              <span>Execution Completion</span>
              <strong>{selectedBlock.progressPercent}%</strong>
            </div>
            <div className="progress-bar-lg">
              <div
                className="progress-fill-lg"
                style={{ width: `${selectedBlock.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="block-metrics-grid">
          <div className="metric-chip">
            <span className="chip-label">Scheduled Window</span>
            <strong>{selectedBlock.scheduledStart} → {selectedBlock.scheduledEnd}</strong>
          </div>
          <div className="metric-chip">
            <span className="chip-label">Actual Expected Finish</span>
            <strong className="text-danger">{selectedBlock.expectedEnd} IST</strong>
          </div>
          <div className="metric-chip">
            <span className="chip-label">Assigned Gang & Crew</span>
            <strong>{selectedBlock.crewAssigned}</strong>
          </div>
          <div className="metric-chip">
            <span className="chip-label">25kV Traction Power</span>
            <strong className="text-amber">
              {selectedBlock.overheadPowerCutRequired ? 'Isolated (Substation PGT)' : 'Normal'}
            </strong>
          </div>
        </div>

        {selectedBlock.notes && (
          <div className="overrun-alert-banner">
            <AlertTriangle size={18} className="text-danger flex-shrink-0" />
            <div>
              <strong>Site Condition Note:</strong>
              <span> {selectedBlock.notes}</span>
            </div>
            <button
              className="btn-danger-sm"
              onClick={() => navigateTo('Dynamic Rescheduling')}
            >
              Resolve Overrun Now
            </button>
          </div>
        )}
      </div>

      <BlockDetailModal />
    </div>
  );
};
