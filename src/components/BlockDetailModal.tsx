import React, { useState } from 'react';
import {
  X,
  Clock,
  Wrench,
  Zap,
  Radio,
  Train,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BlockDetailModal: React.FC = () => {
  const { inspectingBlock, setInspectingBlock, reportDelay, markBlockComplete, navigateTo } = useApp();
  const [showDelayInput, setShowDelayInput] = useState(false);
  const [delayMinutes, setDelayMinutes] = useState(45);
  const [delayReason, setDelayReason] = useState('Subgrade formation instability requiring 2 additional packing passes.');

  if (!inspectingBlock) return null;

  const handleDelaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportDelay(inspectingBlock.id, delayMinutes, delayReason);
    setInspectingBlock(null);
  };

  return (
    <div className="modal-backdrop" onClick={() => setInspectingBlock(null)}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-subtitle">BLOCK INSPECTION & CONTROL</div>
            <h2 className="modal-title">
              Block {inspectingBlock.id} · {inspectingBlock.sectionName}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={() => setInspectingBlock(null)}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status and Progress Bar */}
          <div className="block-status-header">
            <div className="status-badge-wrap">
              <span className={`status-pill status-${inspectingBlock.status.toLowerCase()}`}>
                {inspectingBlock.status}
              </span>
              <span className={`priority-badge priority-${inspectingBlock.priority.toLowerCase()}`}>
                {inspectingBlock.priority} Priority
              </span>
            </div>
            <div className="block-progress-meter">
              <div className="progress-label">
                <span>Work Progress:</span>
                <strong>{inspectingBlock.progressPercent}%</strong>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-active"
                  style={{ width: `${inspectingBlock.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="block-info-grid">
            <div className="info-cell">
              <span className="info-lbl">Departments Involved</span>
              <strong>{inspectingBlock.departments.join(' + ')}</strong>
            </div>
            <div className="info-cell">
              <span className="info-lbl">Scheduled Window</span>
              <strong>{inspectingBlock.scheduledStart} → {inspectingBlock.scheduledEnd}</strong>
            </div>
            <div className="info-cell">
              <span className="info-lbl">Expected Completion</span>
              <strong className={inspectingBlock.status === 'Delayed' ? 'text-danger' : ''}>
                {inspectingBlock.expectedEnd} ({inspectingBlock.durationHours} hrs)
              </strong>
            </div>
            <div className="info-cell">
              <span className="info-lbl">25kV Traction Power</span>
              <strong>{inspectingBlock.overheadPowerCutRequired ? 'Isolated (Power Block)' : 'Energized'}</strong>
            </div>
          </div>

          <div className="block-summary-card">
            <h4>Work Summary</h4>
            <p>{inspectingBlock.workSummary}</p>
          </div>

          <div className="block-details-rows">
            <div className="detail-row">
              <Wrench size={15} className="text-muted" />
              <span><strong>Crew / Machinery:</strong> {inspectingBlock.crewAssigned}</span>
            </div>
            <div className="detail-row">
              <Train size={15} className="text-muted" />
              <span><strong>Affected Trains:</strong> {inspectingBlock.affectedTrains.join(', ')}</span>
            </div>
            {inspectingBlock.speedRestrictionImposed && (
              <div className="detail-row">
                <ShieldAlert size={15} className="text-warning" />
                <span><strong>Caution Order:</strong> {inspectingBlock.speedRestrictionImposed}</span>
              </div>
            )}
            {inspectingBlock.notes && (
              <div className="detail-row note-row">
                <AlertTriangle size={15} className="text-danger" />
                <span><strong>Site Report:</strong> {inspectingBlock.notes}</span>
              </div>
            )}
          </div>

          {/* Delay Reporting Form (if expanded) */}
          {showDelayInput && (
            <form onSubmit={handleDelaySubmit} className="delay-report-form">
              <h4>Report Execution Delay / Overrun</h4>
              <div className="form-grid-two">
                <div className="form-field">
                  <label>Delay in Minutes</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    step="5"
                    required
                    value={delayMinutes}
                    onChange={e => setDelayMinutes(Number(e.target.value))}
                  />
                </div>
                <div className="form-field">
                  <label>Revised Expected Clearance</label>
                  <input type="text" readOnly value="04:45 IST" />
                </div>
                <div className="form-field full-width">
                  <label>Reason for Delay</label>
                  <input
                    type="text"
                    required
                    value={delayReason}
                    onChange={e => setDelayReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="delay-actions">
                <button
                  type="button"
                  className="btn-secondary-sm"
                  onClick={() => setShowDelayInput(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-danger-sm">
                  Confirm Delay & Recalculate Operations
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Action Buttons */}
        <div className="modal-footer">
          {!showDelayInput && (
            <button
              type="button"
              className="btn-danger-outline"
              onClick={() => setShowDelayInput(true)}
            >
              <RotateCcw size={15} />
              <span>Report Delay / Overrun</span>
            </button>
          )}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setInspectingBlock(null);
              navigateTo('Dynamic Rescheduling');
            }}
          >
            Dynamic Rescheduling
          </button>
          {inspectingBlock.status !== 'Completed' && (
            <button
              type="button"
              className="btn-success"
              onClick={() => {
                markBlockComplete(inspectingBlock.id);
                setInspectingBlock(null);
              }}
            >
              <CheckCircle2 size={15} />
              <span>Mark Completed & Handover</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
