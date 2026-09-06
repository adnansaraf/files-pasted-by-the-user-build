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
  const { blocks, setInspectingBlock, navigateTo, conflicts } = useApp();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<TrainMovement | null>(null);

  // Time conversion helper: "02:30" -> percentage of 24h
  const timeToPercent = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return ((h + m / 60) / 24) * 100;
  };

  const durationToWidth = (startStr: string, endStr: string): number => {
    const startP = timeToPercent(startStr);
    const endP = timeToPercent(endStr);
    return Math.max(2, endP - startP);
  };

  // 24 Hour Ticks
  const hours = Array.from({ length: 25 }, (_, i) => i);

  // Current simulated time: 01:42 -> %
  const currentTimePercent = timeToPercent('01:42');

  const handleBlockSelect = (b: MaintenanceBlock) => {
    setInspectingBlock(b);
    if (onBlockClick) onBlockClick(b);
  };

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

            {/* Critical Conflict Area Marker (if conflicts exist) */}
            {conflicts.length > 0 && (
              <div
                className="conflict-highlight-zone"
                style={{ left: `${timeToPercent('02:00')}%`, width: `${durationToWidth('02:00', '05:00')}%` }}
                title="Operational Conflict Window"
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
              {blocks.filter(b => b.departments.includes('Engineering')).length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '16px', color: 'var(--slate-400)', fontSize: '11px', fontStyle: 'italic' }}>
                  No active or planned Engineering possessions
                </div>
              ) : (
                blocks
                  .filter(b => b.departments.includes('Engineering'))
                  .map(b => (
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
                  ))
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
              {blocks.filter(b => b.departments.includes('TRD')).length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '16px', color: 'var(--slate-400)', fontSize: '11px', fontStyle: 'italic' }}>
                  No active or planned TRD possessions
                </div>
              ) : (
                blocks
                  .filter(b => b.departments.includes('TRD'))
                  .map(b => (
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
                        </div>
                        <div className="block-details">
                          <span className="block-title">{b.sectionName}: {b.workSummary}</span>
                          <span className="block-time">{b.scheduledStart}–{b.expectedEnd || b.scheduledEnd}</span>
                        </div>
                      </div>
                    </div>
                  ))
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
              {blocks.filter(b => b.departments.includes('S&T')).length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '16px', color: 'var(--slate-400)', fontSize: '11px', fontStyle: 'italic' }}>
                  No active or planned S&T possessions
                </div>
              ) : (
                blocks
                  .filter(b => b.departments.includes('S&T'))
                  .map(b => (
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
                  ))
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
              const isConflicting = t.trainNo === '12617';

              return (
                <div
                  key={t.trainNo}
                  className={`gantt-train-slot ${isConflicting ? 'slot-conflict' : ''} cat-${t.category.toLowerCase().replace(/ /g, '-')}`}
                  style={{ left: `${startP}%`, width: `${widthP}%`, cursor: 'pointer' }}
                  onClick={() => setSelectedTrain(t)}
                  title={`Click to inspect ${t.trainNo} ${t.trainName} on Section ${t.sectionId} (${t.entryTime}–${t.exitTime})`}
                >
                  <span className="train-slot-no">{t.trainNo}</span>
                  <span className="train-slot-sec">{t.sectionId}</span>
                </div>
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
            <span className="g-legend-box bg-train" />
            <span>Scheduled Train Run</span>
          </span>
          <span className="g-legend-item">
            <span className="g-legend-box bg-conflict-pulse" />
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
      {selectedTrain && (
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
                      background: selectedTrain.trainNo === '12617' ? 'var(--red-100)' : 'var(--blue-100)',
                      color: selectedTrain.trainNo === '12617' ? 'var(--red-800)' : 'var(--blue-800)',
                      fontWeight: '700',
                      padding: '3px 9px',
                      borderRadius: '4px',
                      fontSize: '11px'
                    }}
                  >
                    {selectedTrain.trainNo === '12617' ? '⚠ Path Conflict' : 'Scheduled Movement'}
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

              {/* Schedule and Section Cells */}
              <div className="block-info-grid">
                <div className="info-cell">
                  <span className="info-lbl">Active Section Corridor</span>
                  <strong>{selectedTrain.sectionId} (PGT–SRR Mainline)</strong>
                </div>
                <div className="info-cell">
                  <span className="info-lbl">Section Passage Window</span>
                  <strong>{selectedTrain.entryTime} IST → {selectedTrain.exitTime} IST</strong>
                </div>
                <div className="info-cell">
                  <span className="info-lbl">Max Permissible Buffer</span>
                  <strong>{selectedTrain.allowedDelayMin} Minutes Buffer</strong>
                </div>
                <div className="info-cell">
                  <span className="info-lbl">Traction & Track Usage</span>
                  <strong>25kV Electrified Dual Track</strong>
                </div>
              </div>

              {/* Conflict Callout if clashing train */}
              {selectedTrain.trainNo === '12617' ? (
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
                      Operational Path Conflict Detected (03:15 IST)
                    </strong>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#7f1d1d', lineHeight: '1.4' }}>
                      Scheduled entry of 12617 at 03:15 directly intersects BLK-204 Track Tamping window on A–B.
                      SolveX recommends advancing the maintenance window by 60m to prevent a 45-minute detention.
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
                  <span><strong>Section Dwell & Transit:</strong> 23 Minutes calculated run time</span>
                </div>
                <div className="detail-row">
                  <Train size={15} className="text-muted" />
                  <span><strong>Control Desk:</strong> Palakkad Division Section Controller (PGT East)</span>
                </div>
                <div className="detail-row">
                  <Compass size={15} className="text-muted" />
                  <span><strong>Routing Direction:</strong> Palakkad Jn ➔ Ottappalam ➔ Shoranur Jn</span>
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
              {selectedTrain.trainNo === '12617' && (
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
      )}
    </div>
  );
};
