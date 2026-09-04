import React, { useState } from 'react';
import { X, Wrench, Shield, Clock, AlertCircle, Info, Sparkles, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Department, PriorityLevel } from '../types';

export const RequestModal: React.FC = () => {
  const { isNewRequestModalOpen, setIsNewRequestModalOpen, addRequest, sections } = useApp();

  const [dept, setDept] = useState<Department>('Engineering');
  const [sectionId, setSectionId] = useState<string>('A-B');
  const [workType, setWorkType] = useState('');
  const [description, setDescription] = useState('');
  const [requestedDuration, setRequestedDuration] = useState<number>(2.5);
  const [preferredTimeWindow, setPreferredTimeWindow] = useState('02:00–05:00');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [deadline, setDeadline] = useState('Tonight (Shift 3)');
  const [constraints, setConstraints] = useState('Requires power cut & traffic block');
  const [resources, setResources] = useState('1 JE/P-Way, 14 Track Maintainers');

  if (!isNewRequestModalOpen) return null;

  // Real-time simulated duration prediction based on historical variance
  const predictedDuration = Number((requestedDuration * 1.15).toFixed(1));
  const historicalVarianceSamples = [
    Number((requestedDuration * 1.05).toFixed(1)),
    Number((requestedDuration * 1.12).toFixed(1)),
    Number((requestedDuration * 1.2).toFixed(1)),
    Number((requestedDuration * 1.18).toFixed(1))
  ];

  // Calculated priority score
  let calculatedScore = 75;
  if (priority === 'Critical') calculatedScore = 94;
  else if (priority === 'High') calculatedScore = 86;
  else if (priority === 'Medium') calculatedScore = 67;
  else calculatedScore = 48;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workType) {
      alert('Please specify the work type');
      return;
    }

    addRequest({
      dept,
      sectionId,
      workType,
      description: description || `${workType} on requested section under standard divisional maintenance protocols.`,
      requestedDuration,
      preferredTimeWindow,
      priority,
      deadline,
      constraints,
      resources
    });

    setIsNewRequestModalOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsNewRequestModalOpen(false)}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-subtitle">SOLVEX · DIVISIONAL MAINTENANCE DESK</div>
            <h2 className="modal-title">Create New Maintenance Request</h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setIsNewRequestModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid-two">
            {/* Department */}
            <div className="form-field">
              <label>Department</label>
              <select value={dept} onChange={e => setDept(e.target.value as Department)}>
                <option value="Engineering">Engineering (Track / Civil)</option>
                <option value="TRD">TRD (Traction / 25kV OHE)</option>
                <option value="S&T">S&T (Signalling & Telecom)</option>
              </select>
            </div>

            {/* Section */}
            <div className="form-field">
              <label>Palakkad Railway Section</label>
              <select value={sectionId} onChange={e => setSectionId(e.target.value)}>
                {sections.map(s => (
                  <option key={s.id} value={s.id}>
                    Section {s.id} ({s.fromCode}–{s.toCode}: {s.fromName}–{s.toName})
                  </option>
                ))}
              </select>
            </div>

            {/* Work Type */}
            <div className="form-field full-width">
              <label>Work Type / Nature of Maintenance</label>
              <input
                type="text"
                required
                placeholder="e.g. BCM Deep Screening, Rail Weld Replacement, OHE Dropper Inspection"
                value={workType}
                onChange={e => setWorkType(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="form-field full-width">
              <label>Technical Description & Scope</label>
              <textarea
                rows={2}
                placeholder="Specific track km, bridge no, mast numbers, or turnout points..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Requested Duration */}
            <div className="form-field">
              <label>Requested Duration (Hours)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="8"
                required
                value={requestedDuration}
                onChange={e => setRequestedDuration(Number(e.target.value))}
              />
            </div>

            {/* Preferred Time Window */}
            <div className="form-field">
              <label>Preferred Time Window</label>
              <input
                type="text"
                placeholder="e.g. 02:00–05:00"
                value={preferredTimeWindow}
                onChange={e => setPreferredTimeWindow(e.target.value)}
              />
            </div>

            {/* Priority Level */}
            <div className="form-field">
              <label>Priority Level</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PriorityLevel)}
              >
                <option value="Critical">Critical (Track Defect / Direct Safety Risk)</option>
                <option value="High">High (Urgent Scheduled Maintenance)</option>
                <option value="Medium">Medium (Routine Periodic Maintenance)</option>
                <option value="Low">Low (Preventive Inspection)</option>
              </select>
            </div>

            {/* Deadline */}
            <div className="form-field">
              <label>Operational Deadline</label>
              <input
                type="text"
                placeholder="e.g. Tonight (Shift 3) or 28 Aug"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
              />
            </div>

            {/* Operational Constraints */}
            <div className="form-field full-width">
              <label>Operational Constraints</label>
              <input
                type="text"
                placeholder="e.g. Requires 25kV traction shutdown; 45 km/h caution order post-work"
                value={constraints}
                onChange={e => setConstraints(e.target.value)}
              />
            </div>

            {/* Machinery & Resources */}
            <div className="form-field full-width">
              <label>Equipment & Gang Resources</label>
              <input
                type="text"
                placeholder="e.g. 1 Plasser Duomatic, 1 JE/P-Way, 18 Gangmen, Tower Wagon Unit"
                value={resources}
                onChange={e => setResources(e.target.value)}
              />
            </div>
          </div>

          {/* Real-time Predictive Overrun & Priority Preview Box */}
          <div className="predictive-intel-banner">
            <div className="intel-badge">
              <Sparkles size={14} />
              <span>Simulated Predictive Intelligence</span>
            </div>
            <div className="intel-row">
              <div>
                <small className="text-muted">Calculated Priority Score</small>
                <div className="intel-val text-maroon">
                  <strong>{calculatedScore}</strong> / 100
                </div>
              </div>
              <div>
                <small className="text-muted">Predicted Duration</small>
                <div className="intel-val">
                  <strong>{predictedDuration} hrs</strong>
                  <span className="text-xs text-muted"> (Requested: {requestedDuration}h)</span>
                </div>
              </div>
              <div>
                <small className="text-muted">Historical Similar Jobs Benchmark</small>
                <div className="intel-samples">
                  {historicalVarianceSamples.map((s, i) => (
                    <span key={i} className="sample-tag">{s}h</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="intel-disclaimer">
              Prototype predictive duration model based on simulated divisional maintenance variance.
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsNewRequestModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={16} />
              <span>Submit to Planning Queue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
