import React, { useState, useMemo } from 'react';
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
  Compass,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MaintenanceBlock, TrainMovement } from '../types';
import { TRAIN_MOVEMENTS } from '../data/mockData';
import { PALAKKAD_STATIONS, getStationTimetable, StationTimetableEvent } from '../data/timetableService';

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
  const [selectedTimetableEvent, setSelectedTimetableEvent] = useState<StationTimetableEvent | null>(null);
  const [selectedStationCode, setSelectedStationCode] = useState<string>('PGT');

  const selectedStation = useMemo(() => {
    return PALAKKAD_STATIONS.find(s => s.code === selectedStationCode) || PALAKKAD_STATIONS[0];
  }, [selectedStationCode]);

  const stationEvents = useMemo(() => {
    return getStationTimetable(selectedStationCode);
  }, [selectedStationCode]);

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
    <div className="gantt-wrapper-with-station">
      {/* Station Selector Bar */}
      <div className="gantt-station-selector-bar">
        <div className="station-selector-controls">
          <label htmlFor="station-select-dropdown" className="station-select-label">
            <MapPin size={15} className="text-maroon" />
            <span>Select Station:</span>
          </label>
          <select
            id="station-select-dropdown"
            className="station-dropdown"
            value={selectedStationCode}
            onChange={(e) => setSelectedStationCode(e.target.value)}
          >
            {PALAKKAD_STATIONS.map(s => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.code}) {s.isJunction ? '★ Jn' : ''} — {s.route}
              </option>
            ))}
          </select>

          {/* Quick Hub Jump Chips */}
          <div className="station-quick-chips">
            {['PGT', 'SRR', 'TIR', 'CLT', 'CAN'].map(code => (
              <button
                key={code}
                type="button"
                className={`station-chip-btn ${selectedStationCode === code ? 'active' : ''}`}
                onClick={() => setSelectedStationCode(code)}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        <div className="station-meta-badge">
          <span>Palakkad Division ({PALAKKAD_STATIONS.length} Stations)</span>
          <span className="station-meta-pill">
            {stationEvents.length} Movements Scheduled Today
          </span>
        </div>
      </div>

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

          {/* Row 4: Station Timetable Movements */}
          <div className="gantt-row row-trains">
            <div className="gantt-lane-label-col">
              <div className="lane-title">
                <Train size={14} className="text-sky" />
                <span>Station Timetable</span>
              </div>
              <small className="lane-sub">{selectedStation.name} ({selectedStation.code})</small>
            </div>
            <div className="gantt-lane-track">
              {stationEvents.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '16px', color: 'var(--slate-400)', fontSize: '11px', fontStyle: 'italic' }}>
                  No scheduled stopping train runs recorded at {selectedStation.name} for this calendar day.
                </div>
              ) : (
                stationEvents.map(evt => {
                  const arrP = timeToPercent(evt.arrival || evt.departure);
                  const widthP = Math.max(2.0, durationToWidth(evt.arrival || evt.departure, evt.departure || evt.arrival));
                  const isConflicting = conflicts.some(c => c.conflictingTrain?.trainNo === evt.trainNumber);

                  return (
                    <button
                      key={`${evt.trainNumber}-${evt.arrival}-${evt.departure}`}
                      type="button"
                      className={`gantt-station-slot ${isConflicting ? 'slot-conflict' : ''}`}
                      style={{ left: `${arrP}%`, width: `${widthP}%`, minWidth: '42px' }}
                      onClick={() => setSelectedTimetableEvent(evt)}
                      aria-label={`Train ${evt.trainNumber} (${evt.trainName}) at ${evt.stationName}`}
                    >
                      <Train size={11} className="train-icon-sym" />
                      <span className="train-num">{evt.trainNumber}</span>
                      <span className="train-brief-name">{evt.trainName}</span>
                      {evt.haltMin > 0 && <span className="train-dwell">{evt.haltMin}m</span>}

                      {/* Rich Instant Hover Popover */}
                      <div className="train-hover-popover">
                        <div className="popover-header">
                          <span>Train {evt.trainNumber} · {evt.trainName}</span>
                          {isConflicting && <span className="popover-badge-conflict">⚠ CONFLICT</span>}
                        </div>
                        <div className="popover-body">
                          <div><span>Station:</span> <strong>{evt.stationName} ({evt.stationCode})</strong></div>
                          <div><span>Timetable:</span> Arr <strong>{evt.arrival}</strong> · Dep <strong>{evt.departure} IST</strong></div>
                          <div><span>Halt / Dwell:</span> <strong>{evt.haltMin} minutes</strong></div>
                          <div><span>Origin ➔ Dest:</span> {evt.origin} ➔ {evt.destination}</div>
                          <div><span>Type:</span> {evt.trainType}</div>
                          <div style={{ marginTop: '4px', fontSize: '10px', color: '#38bdf8', fontWeight: 600 }}>
                            Click to inspect full train details & telemetry →
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
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
            <span>Station Timetable (Click to inspect)</span>
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
    </div>

    {/* 24-Hour Station Timetable Register Table */}
    <div className="station-timetable-card">
      <div className="station-timetable-header">
        <div className="station-timetable-title">
          <Train size={16} className="text-sky" />
          <span>{selectedStation.name} ({selectedStation.code}) · 24-Hour Station Timetable</span>
          <span className="station-meta-pill">{stationEvents.length} Trains Scheduled</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--slate-500)' }}>
          Route / Branch: <strong>{selectedStation.route}</strong>
        </div>
      </div>

      <div className="station-timetable-table-wrap">
        {stationEvents.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--slate-500)', fontSize: '12px' }}>
            No scheduled stopping train runs recorded at {selectedStation.name} for this calendar day.
          </div>
        ) : (
          <table className="station-timetable-table">
            <thead>
              <tr>
                <th>Train No. & Name</th>
                <th>Origin ➔ Destination</th>
                <th>Scheduled Arr</th>
                <th>Scheduled Dep</th>
                <th>Halt</th>
                <th>Category / Type</th>
                <th>Safety Status</th>
              </tr>
            </thead>
            <tbody>
              {stationEvents.map(evt => {
                const isConflicting = conflicts.some(c => c.conflictingTrain?.trainNo === evt.trainNumber);
                return (
                  <tr
                    key={`${evt.trainNumber}-${evt.arrival}-${evt.departure}`}
                    className="clickable-row"
                    onClick={() => setSelectedTimetableEvent(evt)}
                    title="Click to view train details & telemetry"
                  >
                    <td>
                      <span className="tt-train-pill">{evt.trainNumber}</span>
                      <strong>{evt.trainName}</strong>
                    </td>
                    <td style={{ color: 'var(--slate-600)' }}>
                      {evt.origin} ➔ {evt.destination}
                    </td>
                    <td>
                      <span className="tt-time-strong">{evt.arrival}</span> <small style={{ color: 'var(--slate-400)' }}>IST</small>
                    </td>
                    <td>
                      <span className="tt-time-strong">{evt.departure}</span> <small style={{ color: 'var(--slate-400)' }}>IST</small>
                    </td>
                    <td>
                      {evt.haltMin > 0 ? (
                        <span className="tt-halt-badge">{evt.haltMin} min</span>
                      ) : (
                        <span style={{ color: 'var(--slate-400)' }}>Pass-thru</span>
                      )}
                    </td>
                    <td>
                      <span className="tt-type-tag">{evt.trainType}</span>
                    </td>
                    <td>
                      {isConflicting ? (
                        <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={12} /> Conflict Overlap
                        </span>
                      ) : (
                        <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={12} /> Clear Path
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>

    {/* Station Timetable Event Popup Modal */}
    {selectedTimetableEvent && (() => {
      const evt = selectedTimetableEvent;
      const isConflicting = conflicts.some(c => c.conflictingTrain?.trainNo === evt.trainNumber);
      const matchedConflict = conflicts.find(c => c.conflictingTrain?.trainNo === evt.trainNumber);

      return (
        <div className="modal-backdrop" onClick={() => setSelectedTimetableEvent(null)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div>
                <div className="modal-subtitle">STATION TIMETABLE TELEMETRY · PALAKKAD DIVISION</div>
                <h2 className="modal-title">
                  Train {evt.trainNumber} · {evt.trainName}
                </h2>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedTimetableEvent(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
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
                    {evt.trainType}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--slate-600)' }}>
                  Calendar Date: <strong>{evt.calendarDate}</strong>
                </div>
              </div>

              <div className="block-quick-info">
                <div className="info-cell">
                  <span className="info-lbl">Station</span>
                  <strong>{evt.stationName} ({evt.stationCode})</strong>
                </div>
                <div className="info-cell">
                  <span className="info-lbl">Route / Corridor</span>
                  <strong>{evt.origin} ➔ {evt.destination}</strong>
                </div>
                <div className="info-cell">
                  <span className="info-lbl">Scheduled Arrival</span>
                  <strong>{evt.arrival} IST</strong>
                </div>
                <div className="info-cell">
                  <span className="info-lbl">Scheduled Departure</span>
                  <strong>{evt.departure} IST ({evt.haltMin}m halt)</strong>
                </div>
              </div>

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
                      Operational Path Conflict ({matchedConflict.conflictPointTime} IST)
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
                    Path Clear: Timetable run safely sequenced with surrounding maintenance blocks.
                  </span>
                </div>
              )}

              <div className="block-details-rows">
                <div className="detail-row">
                  <Clock size={15} className="text-muted" />
                  <span><strong>Station Dwell:</strong> {evt.haltMin > 0 ? `${evt.haltMin} minutes scheduled stop` : 'Through movement / pass-through'}</span>
                </div>
                <div className="detail-row">
                  <Train size={15} className="text-muted" />
                  <span><strong>Operating Division:</strong> Palakkad Division, Southern Railway</span>
                </div>
                <div className="detail-row">
                  <Compass size={15} className="text-muted" />
                  <span><strong>Branch / Line:</strong> {evt.routeBranch}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedTimetableEvent(null)}
              >
                Close
              </button>
              {isConflicting && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setSelectedTimetableEvent(null);
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

    {/* Generic Train Operations Movement Popup Modal (fallback) */}
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
