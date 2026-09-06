import React, { useState } from 'react';
import { X, Wrench, Shield, Clock, AlertCircle, Info, Sparkles, Plus, Loader2, TriangleAlert, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Department, PriorityLevel } from '../types';

// Helpers for smart time window synchronization
function timeToMins(t: string): number {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function minsToTime(m: number): string {
  const norm = ((Math.round(m) % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60).toString().padStart(2, '0');
  const mins = (norm % 60).toString().padStart(2, '0');
  return `${h}:${mins}`;
}

function computeEndTime(start: string, durationHours: number): string {
  const startM = timeToMins(start);
  const endM = startM + Math.round(durationHours * 60);
  return minsToTime(endM);
}

function computeDuration(start: string, end: string): number {
  const startM = timeToMins(start);
  let endM = timeToMins(end);
  if (endM <= startM) {
    endM += 1440;
  }
  const diffM = endM - startM;
  return Number((diffM / 60).toFixed(1));
}

function isTimeInWindow(t: string, start: string, end: string): boolean {
  const cur = timeToMins(t);
  const s = timeToMins(start);
  let e = timeToMins(end);
  if (e <= s) {
    return cur >= s || cur < e;
  }
  return cur >= s && cur < e;
}

const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  const hh = h.toString().padStart(2, '0');
  TIME_OPTIONS.push(`${hh}:00`);
  TIME_OPTIONS.push(`${hh}:30`);
}

export const RequestModal: React.FC = () => {
  const { isNewRequestModalOpen, setIsNewRequestModalOpen, addRequest, sections } = useApp();

  const [dept, setDept] = useState<Department>('Engineering');
  const [sectionId, setSectionId] = useState<string>('PGT-SRR');
  const [workType, setWorkType] = useState('');
  const [description, setDescription] = useState('');
  
  // Smart synchronized time window state
  const [startTime, setStartTime] = useState('02:00');
  const [requestedDuration, setRequestedDuration] = useState<number>(3.0);
  const [endTime, setEndTime] = useState('05:00');

  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [deadline, setDeadline] = useState('Tonight (Shift 3)');
  const [constraints, setConstraints] = useState('Requires power cut & traffic block');
  const [resources, setResources] = useState('1 JE/P-Way, 14 Track Maintainers');
  const [isEvaluatingAI, setIsEvaluatingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Synchronized update handlers
  const handleStartTimeChange = (newStart: string) => {
    setStartTime(newStart);
    setEndTime(computeEndTime(newStart, requestedDuration));
  };

  const handleDurationChange = (newDur: number) => {
    const valid = Math.max(0.5, Math.min(16, Number(newDur.toFixed(1))));
    setRequestedDuration(valid);
    setEndTime(computeEndTime(startTime, valid));
  };

  const handleEndTimeChange = (newEnd: string) => {
    setEndTime(newEnd);
    const newDur = computeDuration(startTime, newEnd);
    setRequestedDuration(newDur);
  };

  const applyPreset = (presetStart: string, presetDur: number) => {
    setStartTime(presetStart);
    setRequestedDuration(presetDur);
    setEndTime(computeEndTime(presetStart, presetDur));
  };

  if (!isNewRequestModalOpen) return null;

  const preferredTimeWindow = `${startTime}–${endTime}`;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workType) {
      alert('Please specify the work type');
      return;
    }

    setIsEvaluatingAI(true);
    setAiError(null);

    let aiResult = null;
    try {
      const response = await fetch('/api/process-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          section: sectionId,
          startTime: startTime,
          duration: requestedDuration,
          priority: priority,
          dept: dept,
          workType: workType,
          description: description || `${workType} on requested section under standard divisional maintenance protocols.`,
          preferredTimeWindow: preferredTimeWindow,
          constraints: constraints,
          resources: resources
        })
      });

      if (response.ok) {
        aiResult = await response.json();
      } else {
        console.warn('AI evaluation API returned status:', response.status);
      }
    } catch (err: any) {
      console.error('Error contacting /api/process-request:', err);
      setAiError(err.message || 'Failed to connect to AI conflict service');
    } finally {
      setIsEvaluatingAI(false);
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
      resources,
      aiAnalysis: aiResult,
      id: aiResult?.id
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

            {/* Smart Synchronized Time & Duration Scheduler */}
            <div className="form-field full-width smart-time-scheduler">
              <div className="scheduler-header">
                <div className="scheduler-title">
                  <Clock size={15} className="text-maroon" />
                  <span>Smart Possession Timing & Duration</span>
                </div>
                <div className="scheduler-pill-summary">
                  <span>{startTime} ➔ {endTime} IST</span>
                  <span>({requestedDuration} hrs)</span>
                  {timeToMins(endTime) < timeToMins(startTime) && (
                    <span className="next-day-tag">+1 Day Overnight</span>
                  )}
                </div>
              </div>

              {/* 3-Column Stepper & Dropdown Controls */}
              <div className="time-controls-grid">
                <div className="time-ctrl-item">
                  <label>Start Time (IST)</label>
                  <select
                    value={startTime}
                    onChange={e => handleStartTimeChange(e.target.value)}
                    className="time-select"
                  >
                    {TIME_OPTIONS.map(t => (
                      <option key={`start-${t}`} value={t}>
                        {t} IST
                      </option>
                    ))}
                  </select>
                </div>

                <div className="time-ctrl-item">
                  <label>Duration (Hours)</label>
                  <div className="duration-stepper">
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => handleDurationChange(requestedDuration - 0.5)}
                      disabled={requestedDuration <= 0.5}
                      title="Decrease duration by 30 mins"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="16"
                      value={requestedDuration}
                      onChange={e => handleDurationChange(Number(e.target.value))}
                      className="stepper-input"
                    />
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => handleDurationChange(requestedDuration + 0.5)}
                      disabled={requestedDuration >= 16}
                      title="Increase duration by 30 mins"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="time-ctrl-item">
                  <label>Calculated End Time</label>
                  <select
                    value={endTime}
                    onChange={e => handleEndTimeChange(e.target.value)}
                    className="time-select"
                  >
                    {TIME_OPTIONS.map(t => (
                      <option key={`end-${t}`} value={t}>
                        {t} IST {timeToMins(t) < timeToMins(startTime) ? '(Next Day)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Duration Buttons */}
              <div className="duration-chips-row">
                <span className="chips-label">Quick Duration:</span>
                {[1, 1.5, 2, 2.5, 3, 4, 5, 6, 8].map(dur => (
                  <button
                    key={dur}
                    type="button"
                    className={`dur-chip ${requestedDuration === dur ? 'active' : ''}`}
                    onClick={() => handleDurationChange(dur)}
                  >
                    {dur}h
                  </button>
                ))}
              </div>

              {/* Horizontal Scrollable Time Selector Strip */}
              <div className="scroll-picker-box">
                <div className="scroll-picker-label">
                  <span>Time choosing scrolling window (Click any time to set start):</span>
                  <span className="scroll-hint">← Scroll 24h timeline →</span>
                </div>
                <div className="time-scroll-container">
                  {TIME_OPTIONS.map(timeStr => {
                    const isStart = timeStr === startTime;
                    const inWindow = isTimeInWindow(timeStr, startTime, endTime);
                    return (
                      <button
                        key={timeStr}
                        type="button"
                        className={`time-chip ${isStart ? 'chip-start' : ''} ${inWindow ? 'chip-in-window' : ''}`}
                        onClick={() => handleStartTimeChange(timeStr)}
                        title={`Set Start Time to ${timeStr} IST (End will be ${computeEndTime(timeStr, requestedDuration)})`}
                      >
                        <span className="time-chip-text">{timeStr}</span>
                        {isStart && <span className="time-chip-pin">START</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divisional Shift Presets */}
              <div className="shift-presets-row">
                <span className="chips-label">Palakkad Shift Presets:</span>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => applyPreset('01:30', 3)}
                >
                  🌙 Night Possession (01:30–04:30)
                </button>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => applyPreset('02:00', 3)}
                >
                  🌅 Early Morning (02:00–05:00)
                </button>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => applyPreset('11:00', 2.5)}
                >
                  ☀️ Midday Traffic Gap (11:00–13:30)
                </button>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => applyPreset('08:00', 4)}
                >
                  🔧 Shift 1 Morning (08:00–12:00)
                </button>
              </div>
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
              disabled={isEvaluatingAI}
              onClick={() => setIsNewRequestModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isEvaluatingAI}>
              {isEvaluatingAI ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Checking Timetable & AI Conflicts...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Submit & Check Conflicts</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
