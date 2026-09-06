import React, { useState } from 'react';
import {
  Clock,
  Train,
  Wrench,
  Zap,
  Radio,
  AlertTriangle,
  ChevronRight,
  Info,
  Maximize2,
  X,
  ShieldCheck,
  Calendar,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MaintenanceBlock, TrainMovement } from '../types';
import { TRAIN_MOVEMENTS } from '../data/mockData';

interface GanttTimelineProps {
  interactive?: boolean;
  filterDept?: string;
  onBlockClick?: (block: MaintenanceBlock) => void;
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({
  interactive = true,
  filterDept,
  onBlockClick
}) => {
  const { blocks, requests, setInspectingBlock, navigateTo, conflicts } = useApp();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<TrainMovement | null>(null);

  // Time conversion helper: "02:30" -> percentage of 24h
  const timeToPercent = (timeStr: string): number => {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (((isNaN(h) ? 0 : h) + (isNaN(m) ? 0 : m) / 60) / 24) * 100;
  };

  const durationToWidth = (startStr: string, endStr: string): number => {
    const startP = timeToPercent(startStr);
    const endP = timeToPercent(endStr);
    return Math.max(2, endP - startP);
  };

  // Helper to parse start and end times from preferredTimeWindow (e.g. "00:30–02:30")
  const parseWindow = (windowStr: string, durationHours: number = 2): { start: string; end: string } => {
    if (!windowStr) return { start: '02:00', end: '04:00' };
    const parts = windowStr.split(/[–\-]/).map(s => s.trim());
    const start = parts[0] && parts[0].includes(':') ? parts[0] : '02:00';
    let end = parts[1] && parts[1].includes(':') ? parts[1] : '';
    if (!end) {
      const [sh, sm] = start.split(':').map(Number);
      const totalMin = ((sh || 0) * 60 + (sm || 0) + Math.round(durationHours * 60)) % 1440;
      const eh = Math.floor(totalMin / 60).toString().padStart(2, '0');
      const em = (totalMin % 60).toString().padStart(2, '0');
      end = `${eh}:${em}`;
    }
    return { start, end };
  };

  // 24 Hour Ticks
  const hours = Array.from({ length: 25 }, (_, i) => i);

  // Current simulated time: 01:42 -> %
  const currentTimePercent = timeToPercent('01:42');

  const handleBlockSelect = (b: MaintenanceBlock) => {
    setInspectingBlock(b);
    if (onBlockClick) onBlockClick(b);
  };

  // Filter blocks and requests by department
  const engBlocks = blocks.filter(b => b.departments.includes('Engineering'));
  const engRequests = requests.filter(r => r.dept === 'Engineering');
  const hasEng = engBlocks.length > 0 || engRequests.length > 0;

  const trdBlocks = blocks.filter(b => b.departments.includes('TRD'));
  const trdRequests = requests.filter(r => r.dept === 'TRD');
  const hasTrd = trdBlocks.length > 0 || trdRequests.length > 0;

  const stBlocks = blocks.filter(b => b.departments.includes('S&T'));
  const stRequests = requests.filter(r => r.dept === 'S&T');
  const hasSt = stBlocks.length > 0 || stRequests.length > 0;

  return (
    <div className="gantt-container">
      {/* Horizontal Scroll Hint Indicator */}
      <div className="gantt-scroll-hint-bar">
        <span>↔ Scroll horizontally to view the full 24-hour timeline (00:00 – 24:00)</span>
      </div>

      <div className="gantt-scrollable-inner" style={{ minWidth: '1860px' }}>
        {/* Gantt Header Time Bar */}
        <div className="gantt-header-row">
          <div className="gantt-lane-label-col">Department / Entity</div>
          <div className="gantt-time-scale">
            {hours.map(h => (
              <div
                key={h}
                className="time-tick"
                style={{ left: `${(h / 24) * 100}%` }}
              >
                <span className="tick-label">{String(h).padStart(2, '0')}:00</span>
                <div className="tick-line" />
              </div>
            ))}

            {/* Current Time Indicator (01:42 IST) */}
            <div
              className="current-time-marker"
              style={{ left: `${currentTimePercent}%` }}
              title="Current Time: 01:42 IST"
            >
              <div className="marker-pill">NOW 01:42</div>
              <div className="marker-line" />
            </div>

            {/* Critical Conflict Area Marker (if real conflicts exist) */}
            {conflicts.length > 0 && conflicts[0].conflictPointTime && (
              <div
                className="conflict-highlight-zone"
                style={{
                  left: `${timeToPercent(conflicts[0].conflictPointTime)}%`,
                  width: `${durationToWidth(conflicts[0].conflictPointTime, '05:00')}%`
                }}
                title={`Operational Conflict: ${conflicts[0].description}`}
              >
                <div className="conflict-point-pin">
                  <AlertTriangle size={11} />
                  <span>{conflicts[0].conflictPointTime} Conflict ({conflicts[0].conflictingTrain?.trainNo || 'Train'})</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lanes Body */}
        <div className="gantt-body">
          {/* Row 1: Engineering */}
          {(!filterDept || filterDept === 'Engineering') && (
            <div className="gantt-row">
              <div className="gantt-lane-label-col">
                <div className="lane-title">
                  <Wrench size={14} className="text-maroon" />
                  <span>Engineering (P-Way)</span>
                </div>
                <small className="lane-sub">Track & Structural</small>
              </div>
              <div className="gantt-lane-track">
                {!hasEng ? (
                  <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '16px', color: 'var(--slate-400)', fontSize: '11px', fontStyle: 'italic' }}>
                    No active or planned Engineering possessions
                  </div>
                ) : (
                  <>
                    {engBlocks.map(b => (
                      <div
                        key={b.id}
                        className={`gantt-block block-engineering ${b.status.toLowerCase()}`}
                        style={{
                          left: `${timeToPercent(b.scheduledStart)}%`,
                          width: `${durationToWidth(b.scheduledStart, b.expectedEnd || b.scheduledEnd)}%`
                        }}
                        onClick={() => handleBlockSelect(b)}
                        onMouseEnter={() => setHoveredItem(b.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        title={`${b.id}: ${b.workSummary} (${b.scheduledStart}–${b.expectedEnd || b.scheduledEnd})`}
                      >
                        <div className="block-content">
                          <div className="block-badge-row">
                            <span className="block-id">{b.id}</span>
                            <span className="block-sec-tag">{b.sectionId}</span>
                            {b.status === 'Delayed' && <span className="block-tag tag-delayed">+Delay</span>}
                          </div>
                          <div className="block-details">
                            <span className="block-title">{b.sectionName}: {b.workSummary}</span>
                            <span className="block-time">{b.scheduledStart}–{b.expectedEnd || b.scheduledEnd}</span>
                          </div>
                        </div>
                        {b.progressPercent > 0 && (
                          <div className="block-progress-fill" style={{ width: `${b.progressPercent}%` }} />
                        )}
                      </div>
                    ))}

                    {engRequests.map(req => {
                      const { start, end } = parseWindow(req.preferredTimeWindow, req.requestedDuration);
                      const isConflict = !!req.aiAnalysis?.conflict;
                      return (
                        <div
                          key={req.id}
                          className={`gantt-block block-engineering ${isConflict ? 'delayed' : 'planned'}`}
                          style={{
                            left: `${timeToPercent(start)}%`,
                            width: `${durationToWidth(start, end)}%`,
                            borderStyle: 'dashed',
                            cursor: 'pointer'
                          }}
                          onClick={() => navigateTo('Maintenance Requests')}
                          title={`[${req.status}] ${req.id}: ${req.workType} on ${req.sectionName} (${start}–${end})`}
                        >
                          <div className="block-content">
                            <div className="block-badge-row">
                              <span className="block-id">{req.id}</span>
                              <span className="block-sec-tag">{req.sectionId}</span>
                              <span className={`block-tag ${isConflict ? 'tag-delayed' : ''}`}>
                                {isConflict ? 'Conflict' : 'Requested'}
                              </span>
                            </div>
                            <div className="block-details">
                              <span className="block-title">{req.sectionName}: {req.workType}</span>
                              <span className="block-time">{start}–{end}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Row 2: TRD (Electrical) */}
          {(!filterDept || filterDept === 'TRD') && (
            <div className="gantt-row">
              <div className="gantt-lane-label-col">
                <div className="lane-title">
                  <Zap size={14} className="text-amber" />
                  <span>TRD (Traction OHE)</span>
                </div>
                <small className="lane-sub">25kV AC Catenary</small>
              </div>
              <div className="gantt-lane-track">
                {!hasTrd ? (
                  <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '16px', color: 'var(--slate-400)', fontSize: '11px', fontStyle: 'italic' }}>
                    No active or planned TRD possessions
                  </div>
                ) : (
                  <>
                    {trdBlocks.map(b => (
                      <div
                        key={b.id}
                        className={`gantt-block block-trd ${b.status.toLowerCase()}`}
                        style={{
                          left: `${timeToPercent(b.scheduledStart)}%`,
                          width: `${durationToWidth(b.scheduledStart, b.expectedEnd || b.scheduledEnd)}%`
                        }}
                        onClick={() => handleBlockSelect(b)}
                        title={`${b.id}: ${b.workSummary} (${b.scheduledStart}–${b.expectedEnd || b.scheduledEnd})`}
                      >
                        <div className="block-content">
                          <div className="block-badge-row">
                            <span className="block-id">{b.id}</span>
                            <span className="block-sec-tag">{b.sectionId}</span>
                          </div>
                          <div className="block-details">
                            <span className="block-title">{b.sectionName}: {b.workSummary}</span>
                            <span className="block-time">{b.scheduledStart}–{b.expectedEnd || b.scheduledEnd}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {trdRequests.map(req => {
                      const { start, end } = parseWindow(req.preferredTimeWindow, req.requestedDuration);
                      const isConflict = !!req.aiAnalysis?.conflict;
                      return (
                        <div
                          key={req.id}
                          className={`gantt-block block-trd ${isConflict ? 'delayed' : 'planned'}`}
                          style={{
                            left: `${timeToPercent(start)}%`,
                            width: `${durationToWidth(start, end)}%`,
                            borderStyle: 'dashed',
                            cursor: 'pointer'
                          }}
                          onClick={() => navigateTo('Maintenance Requests')}
                          title={`[${req.status}] ${req.id}: ${req.workType} on ${req.sectionName} (${start}–${end})`}
                        >
                          <div className="block-content">
                            <div className="block-badge-row">
                              <span className="block-id">{req.id}</span>
                              <span className="block-sec-tag">{req.sectionId}</span>
                              <span className={`block-tag ${isConflict ? 'tag-delayed' : ''}`}>
                                {isConflict ? 'Conflict' : 'Requested'}
                              </span>
                            </div>
                            <div className="block-details">
                              <span className="block-title">{req.sectionName}: {req.workType}</span>
                              <span className="block-time">{start}–{end}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Row 3: S&T (Signalling) */}
          {(!filterDept || filterDept === 'S&T') && (
            <div className="gantt-row">
              <div className="gantt-lane-label-col">
                <div className="lane-title">
                  <Radio size={14} className="text-blue" />
                  <span>S&T (Signals & Telecom)</span>
                </div>
                <small className="lane-sub">Interlocking & Relays</small>
              </div>
              <div className="gantt-lane-track">
                {!hasSt ? (
                  <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '16px', color: 'var(--slate-400)', fontSize: '11px', fontStyle: 'italic' }}>
                    No active or planned S&T possessions
                  </div>
                ) : (
                  <>
                    {stBlocks.map(b => (
                      <div
                        key={b.id}
                        className={`gantt-block block-st ${b.status.toLowerCase()}`}
                        style={{
                          left: `${timeToPercent(b.scheduledStart)}%`,
                          width: `${durationToWidth(b.scheduledStart, b.expectedEnd || b.scheduledEnd)}%`
                        }}
                        onClick={() => handleBlockSelect(b)}
                        title={`${b.id}: ${b.workSummary} (${b.scheduledStart}–${b.expectedEnd || b.scheduledEnd})`}
                      >
                        <div className="block-content">
                          <div className="block-badge-row">
                            <span className="block-id">{b.id}</span>
                            <span className="block-sec-tag">{b.sectionId}</span>
                          </div>
                          <div className="block-details">
                            <span className="block-title">{b.sectionName}: {b.workSummary}</span>
                            <span className="block-time">{b.scheduledStart}–{b.expectedEnd || b.scheduledEnd}</span>
                          </div>
                        </div>
                        {b.progressPercent > 0 && (
                          <div className="block-progress-fill" style={{ width: `${b.progressPercent}%` }} />
                        )}
                      </div>
                    ))}

                    {stRequests.map(req => {
                      const { start, end } = parseWindow(req.preferredTimeWindow, req.requestedDuration);
                      const isConflict = !!req.aiAnalysis?.conflict;
                      return (
                        <div
                          key={req.id}
                          className={`gantt-block block-st ${isConflict ? 'delayed' : 'planned'}`}
                          style={{
                            left: `${timeToPercent(start)}%`,
                            width: `${durationToWidth(start, end)}%`,
                            borderStyle: 'dashed',
                            cursor: 'pointer'
                          }}
                          onClick={() => navigateTo('Maintenance Requests')}
                          title={`[${req.status}] ${req.id}: ${req.workType} on ${req.sectionName} (${start}–${end})`}
                        >
                          <div className="block-content">
                            <div className="block-badge-row">
                              <span className="block-id">{req.id}</span>
                              <span className="block-sec-tag">{req.sectionId}</span>
                              <span className={`block-tag ${isConflict ? 'tag-delayed' : ''}`}>
                                {isConflict ? 'Conflict' : 'Requested'}
                              </span>
                            </div>
                            <div className="block-details">
                              <span className="block-title">{req.sectionName}: {req.workType}</span>
                              <span className="block-time">{start}–{end}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Row 4: Train Operations */}
          <div className="gantt-row row-trains">
            <div className="gantt-lane-label-col">
              <div className="lane-title">
                <Train size={14} className="text-slate" />
                <span>Train Operations</span>
              </div>
              <small className="lane-sub">Passenger & Freight Paths</small>
            </div>
            <div className="gantt-lane-track">
              {TRAIN_MOVEMENTS.map(t => {
                const startP = timeToPercent(t.entryTime);
                const widthP = durationToWidth(t.entryTime, t.exitTime);
                const isConflicting = conflicts.some(c => c.conflictingTrain?.trainNo === t.trainNo);

                return (
                  <button
                    key={`${t.trainNo}-${t.sectionId}-${t.entryTime}`}
                    type="button"
                    className={`gantt-train-slot ${isConflicting ? 'slot-conflict' : ''} cat-${t.category.toLowerCase().replace(/ /g, '-')}`}
                    style={{ left: `${startP}%` }}
                    onClick={() => setSelectedTrain(t)}
                    aria-label={`Train ${t.trainNo} (${t.trainName}) on Section ${t.sectionId}`}
                  >
                    <Train size={13} className="train-icon-sym" />

                    {/* Rich Instant Hover Popover */}
                    <div className="train-hover-popover">
                      <div className="popover-header">
                        <span>Train {t.trainNo} · {t.trainName}</span>
                        {isConflicting && <span className="popover-badge-conflict">⚠ CONFLICT</span>}
                      </div>
                      <div className="popover-body">
                        <div><span>Occupying Section:</span> <strong>{t.sectionId}</strong></div>
                        <div><span>Corridor Stations:</span> {t.fromStation || t.sectionId.split('-')[0]} ➔ {t.toStation || t.sectionId.split('-')[1]}</div>
                        <div><span>Passage Window:</span> <strong>{t.entryTime} → {t.exitTime} IST</strong></div>
                        <div><span>Category:</span> {t.category} (Priority {t.priority})</div>
                        <div style={{ marginTop: '4px', fontSize: '10px', color: '#38bdf8', fontWeight: 600 }}>
                          Click icon for full train details & telemetry →
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Footer Legend */}
      <div className="gantt-footer">
        <div className="gantt-legend-group">
          <span className="g-legend-item">
            <span className="g-legend-box bg-engineering" />
            <span>Engineering Work</span>
          </span>
          <span className="g-legend-item">
            <span className="g-legend-box bg-trd" />
            <span>TRD Traction Work</span>
          </span>
          <span className="g-legend-item">
            <span className="g-legend-box bg-st" />
            <span>S&T Signalling Work</span>
          </span>
          <span className="g-legend-item">
            <span className="g-legend-box" style={{ background: '#1e293b', border: '1px solid #475569', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Train size={9} color="#38bdf8" />
            </span>
            <span>Train Run (Click icon to inspect)</span>
          </span>
          <span className="g-legend-item">
            <span className="g-legend-box" style={{ background: '#dc2626', border: '1px solid #f87171', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Train size={9} color="#ffffff" />
            </span>
            <span>Train Path Conflict</span>
          </span>
        </div>

        <div className="gantt-actions">
          <button
            className="btn-link-sm"
            onClick={() => navigateTo('AI Optimizer')}
          >
            Run Optimizer to Resolve Overlaps →
          </button>
        </div>
      </div>

      {/* Train Operations Movement Popup Modal */}
      {selectedTrain && (() => {
        const isConflicting = conflicts.some(c => c.conflictingTrain?.trainNo === selectedTrain.trainNo);
        const matchedConflict = conflicts.find(c => c.conflictingTrain?.trainNo === selectedTrain.trainNo);

        return (
          <div className="modal-backdrop" onClick={() => setSelectedTrain(null)}>
            <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
              <div className="modal-header">
                <div>
                  <div className="modal-subtitle">OPERATIONAL TRAIN PATH CONTROL</div>
                  <h2 className="modal-title">
                    Train {selectedTrain.trainNo} · {selectedTrain.trainName}
                  </h2>
                </div>
                <button className="modal-close-btn" onClick={() => setSelectedTrain(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                {/* Status Header */}
                <div className="block-status-header">
                  <div className="status-badge-wrap" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span
                      className="status-pill"
                      style={{
                        background: isConflicting ? 'var(--red-100)' : 'var(--blue-100)',
                        color: isConflicting ? 'var(--red-800)' : 'var(--blue-800)',
                        fontWeight: '700',
                        padding: '3px 9px',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}
                    >
                      {isConflicting ? '⚠ Path Conflict' : 'Scheduled Movement'}
                    </span>
                    <span
                      style={{
                        background: 'var(--slate-100)',
                        color: 'var(--slate-700)',
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '3px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {selectedTrain.category}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--slate-600)' }}>
                    Operational Priority: <strong>P-{selectedTrain.priority}</strong>
                  </div>
                </div>

                <div className="block-quick-info">
                  <div className="info-cell">
                    <span className="info-lbl">Active Section</span>
                    <strong>{selectedTrain.sectionId} Corridor</strong>
                  </div>
                  <div className="info-cell">
                    <span className="info-lbl">Corridor Stations</span>
                    <strong>{selectedTrain.fromStation || selectedTrain.sectionId.split('-')[0]} ➔ {selectedTrain.toStation || selectedTrain.sectionId.split('-')[1]}</strong>
                  </div>
                  <div className="info-cell">
                    <span className="info-lbl">Section Passage Window</span>
                    <strong>{selectedTrain.entryTime} IST → {selectedTrain.exitTime} IST</strong>
                  </div>
                  <div className="info-cell">
                    <span className="info-lbl">Max Permissible Buffer</span>
                    <strong>{selectedTrain.allowedDelayMin} Minutes Buffer</strong>
                  </div>
                </div>

                {/* Conflict Callout if clashing train */}
                {isConflicting && matchedConflict ? (
                  <div
                    style={{
                      background: '#fff1f2',
                      border: '1px solid #fecdd3',
                      borderRadius: '6px',
                      padding: '12px 14px',
                      marginBottom: '16px',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start'
                    }}
                  >
                    <AlertTriangle size={18} className="text-danger flex-shrink-0" style={{ marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#991b1b', fontSize: '12.5px', display: 'block' }}>
                        Operational Path Conflict Detected ({matchedConflict.conflictPointTime} IST)
                      </strong>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#7f1d1d', lineHeight: '1.4' }}>
                        {matchedConflict.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '6px',
                      padding: '12px 14px',
                      marginBottom: '16px',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center'
                    }}
                  >
                    <ShieldCheck size={18} style={{ color: '#16a34a' }} />
                    <span style={{ fontSize: '12px', color: '#166534', fontWeight: '600' }}>
                      Path Clear: Scheduled timetable run safely sequenced with surrounding maintenance possessions.
                    </span>
                  </div>
                )}

                {/* Technical Telemetry Details */}
                <div className="block-details-rows">
                  <div className="detail-row">
                    <Clock size={15} className="text-muted" />
                    <span><strong>Section Dwell & Transit:</strong> Transit window within section {selectedTrain.sectionId}</span>
                  </div>
                  <div className="detail-row">
                    <Train size={15} className="text-muted" />
                    <span><strong>Control Desk:</strong> Palakkad Division Section Controller (PGT East)</span>
                  </div>
                  <div className="detail-row">
                    <Compass size={15} className="text-muted" />
                    <span><strong>Routing Direction:</strong> Palakkad Mainline Corridor</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedTrain(null)}
                >
                  Close
                </button>
                {isConflicting && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setSelectedTrain(null);
                      navigateTo('Conflicts');
                    }}
                  >
                    Inspect Conflict Detail →
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
