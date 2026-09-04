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
  Maximize2
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

          {/* Critical Conflict Area Marker (03:15 on A-B) */}
          <div
            className="conflict-highlight-zone"
            style={{ left: `${timeToPercent('02:00')}%`, width: `${durationToWidth('02:00', '05:00')}%` }}
            title="Coordinated Maintenance Window on Section A-B (02:00–05:00)"
          >
            <div className="conflict-point-pin" style={{ left: `${((timeToPercent('03:15') - timeToPercent('02:00')) / durationToWidth('02:00', '05:00')) * 100}%` }}>
              <AlertTriangle size={12} className="text-danger" />
              <span>03:15 Clash (12617)</span>
            </div>
          </div>
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
              {/* Block BLK-204 (PGT-OTP) */}
              <div
                className="gantt-block block-engineering active"
                style={{
                  left: `${timeToPercent('02:00')}%`,
                  width: `${durationToWidth('02:00', '04:45')}%`
                }}
                onClick={() => handleBlockSelect(blocks[0])}
                onMouseEnter={() => setHoveredItem('BLK-204')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="block-content">
                  <span className="block-id">BLK-204</span>
                  <span className="block-title">A–B: Track Tamping (+45m Delay)</span>
                  <span className="block-time">02:00–04:45</span>
                </div>
                <div className="block-progress-fill" style={{ width: '78%' }} />
              </div>

              {/* Block BLK-206 (OTP-SRR) */}
              <div
                className="gantt-block block-engineering planned"
                style={{
                  left: `${timeToPercent('05:00')}%`,
                  width: `${durationToWidth('05:00', '07:00')}%`
                }}
                onClick={() => handleBlockSelect(blocks[2])}
                onMouseEnter={() => setHoveredItem('BLK-206')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="block-content">
                  <span className="block-id">BLK-206</span>
                  <span className="block-title">B–C: Rail Weld Renewal</span>
                  <span className="block-time">05:00–07:00</span>
                </div>
              </div>
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
              {/* Coordinated OHE block on A-B */}
              <div
                className="gantt-block block-trd active"
                style={{
                  left: `${timeToPercent('02:00')}%`,
                  width: `${durationToWidth('02:00', '04:00')}%`
                }}
                onClick={() => handleBlockSelect(blocks[0])}
                title="TRD OHE Inspection coordinated with BLK-204 on Section A-B"
              >
                <div className="block-content">
                  <span className="block-id">REQ-1025 (Joint)</span>
                  <span className="block-title">A–B: Catenary Tower Wagon Inspection</span>
                  <span className="block-time">02:00–04:00</span>
                </div>
              </div>

              {/* Substation maintenance on A-G */}
              <div
                className="gantt-block block-trd planned"
                style={{
                  left: `${timeToPercent('10:00')}%`,
                  width: `${durationToWidth('10:00', '13:30')}%`
                }}
                title="Muthalamada TSS Transformer Overhaul"
              >
                <div className="block-content">
                  <span className="block-id">REQ-1031</span>
                  <span className="block-title">A–G: TSS Power Transformer Overhaul</span>
                  <span className="block-time">10:00–13:30</span>
                </div>
              </div>
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
              {/* S&T Block on C-D */}
              <div
                className="gantt-block block-st active"
                style={{
                  left: `${timeToPercent('01:30')}%`,
                  width: `${durationToWidth('01:30', '03:30')}%`
                }}
                onClick={() => handleBlockSelect(blocks[1])}
              >
                <div className="block-content">
                  <span className="block-id">BLK-205</span>
                  <span className="block-title">C–D: Axle Counter Replacement</span>
                  <span className="block-time">01:30–03:30</span>
                </div>
                <div className="block-progress-fill" style={{ width: '92%' }} />
              </div>

              {/* Coordinated Relay Check on A-B */}
              <div
                className="gantt-block block-st planned"
                style={{
                  left: `${timeToPercent('03:00')}%`,
                  width: `${durationToWidth('03:00', '04:00')}%`
                }}
                title="REQ-1026: Signal Relay & Point 102B Inspection"
              >
                <div className="block-content">
                  <span className="block-id">REQ-1026 (Joint)</span>
                  <span className="block-title">A–B: Point 102B & Relay Check</span>
                  <span className="block-time">03:00–04:00</span>
                </div>
              </div>
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
                  style={{ left: `${startP}%`, width: `${widthP}%` }}
                  title={`${t.trainNo} ${t.trainName} on Section ${t.sectionId} (${t.entryTime}–${t.exitTime})`}
                >
                  <span className="train-slot-no">{t.trainNo}</span>
                  <span className="train-slot-sec">{t.sectionId}</span>
                </div>
              );
            })}
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
    </div>
  );
};
