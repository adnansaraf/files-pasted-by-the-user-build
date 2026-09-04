import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Train,
  ShieldAlert,
  Clock,
  Layers,
  Info,
  ChevronRight,
  Zap,
  Wrench,
  Radio,
  ExternalLink
} from 'lucide-react';
import { STATIONS, TRAIN_MOVEMENTS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { RailwaySection, SectionStatus } from '../types';

interface SchematicMapProps {
  compact?: boolean;
  onSectionClick?: (sectionId: string) => void;
}

export const SchematicMap: React.FC<SchematicMapProps> = ({ compact = false, onSectionClick }) => {
  const {
    sections,
    selectedSectionId,
    setSelectedSectionId,
    selectedSection,
    blocks,
    requests,
    conflicts,
    navigateTo
  } = useApp();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [filterLayer, setFilterLayer] = useState<'all' | 'active' | 'planned' | 'conflicts'>('all');
  const [showTrains, setShowTrains] = useState(true);

  const handleSectionSelect = (secId: string) => {
    setSelectedSectionId(secId);
    if (onSectionClick) onSectionClick(secId);
  };

  // Coordinates mapping for sections
  const sectionLines: {
    id: string;
    from: string;
    to: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    name: string;
    labelX: number;
    labelY: number;
  }[] = [
    { id: 'A-B', from: 'PGT', to: 'OTP', x1: 120, y1: 140, x2: 290, y2: 140, name: 'PGT–OTP', labelX: 205, labelY: 120 },
    { id: 'B-C', from: 'OTP', to: 'SRR', x1: 290, y1: 140, x2: 450, y2: 190, name: 'OTP–SRR', labelX: 370, labelY: 155 },
    { id: 'C-D', from: 'SRR', to: 'TIR', x1: 450, y1: 190, x2: 620, y2: 120, name: 'SRR–TIR', labelX: 535, labelY: 140 },
    { id: 'D-E', from: 'TIR', to: 'CLT', x1: 620, y1: 120, x2: 780, y2: 120, name: 'TIR–CLT', labelX: 700, labelY: 100 },
    { id: 'C-F', from: 'SRR', to: 'TCR', x1: 450, y1: 190, x2: 450, y2: 310, name: 'SRR–TCR (Thrissur Chord)', labelX: 470, labelY: 260 },
    { id: 'A-G', from: 'PGT', to: 'POY', x1: 120, y1: 140, x2: 120, y2: 290, name: 'PGT–POY (Pollachi Branch)', labelX: 140, labelY: 220 }
  ];

  const getStatusColorClass = (status: SectionStatus) => {
    switch (status) {
      case 'Available':
        return 'stroke-available';
      case 'Maintenance Planned':
        return 'stroke-planned';
      case 'Active Block':
        return 'stroke-active';
      case 'Conflict':
        return 'stroke-conflict';
      case 'Speed Restriction':
        return 'stroke-warning';
      default:
        return 'stroke-available';
    }
  };

  // Related data for the currently selected section
  const sectionRequests = requests.filter(r => r.sectionId === selectedSectionId);
  const sectionBlocks = blocks.filter(b => b.sectionId === selectedSectionId);
  const sectionConflicts = conflicts.filter(c => c.sectionId === selectedSectionId);
  const sectionTrains = TRAIN_MOVEMENTS.filter(t => t.sectionId === selectedSectionId);

  return (
    <div className={`schematic-map-container ${compact ? 'compact' : 'expanded'}`}>
      {/* Map Toolbar & Legend */}
      <div className="map-toolbar">
        <div className="map-legend">
          <span className="legend-item">
            <span className="legend-dot dot-available" />
            <span>Available</span>
          </span>
          <span className="legend-item">
            <span className="legend-dot dot-planned" />
            <span>Maintenance Planned</span>
          </span>
          <span className="legend-item">
            <span className="legend-dot dot-active" />
            <span>Active Block</span>
          </span>
          <span className="legend-item">
            <span className="legend-dot dot-conflict" />
            <span>Operational Conflict</span>
          </span>
          <span className="legend-item">
            <span className="legend-dot dot-warning" />
            <span>Speed Restriction</span>
          </span>
          <span className="legend-item">
            <Train size={13} className="text-navy" />
            <span>Train Movement</span>
          </span>
        </div>

        <div className="map-controls">
          <div className="filter-pill-group">
            <button
              className={`filter-pill ${filterLayer === 'all' ? 'active' : ''}`}
              onClick={() => setFilterLayer('all')}
            >
              All Tracks
            </button>
            <button
              className={`filter-pill ${filterLayer === 'active' ? 'active' : ''}`}
              onClick={() => setFilterLayer('active')}
            >
              Active Only
            </button>
            <button
              className={`filter-pill ${filterLayer === 'conflicts' ? 'active' : ''}`}
              onClick={() => setFilterLayer('conflicts')}
            >
              Conflicts
            </button>
          </div>

          <label className="checkbox-toggle" title="Toggle train positions on schematic tracks">
            <input
              type="checkbox"
              checked={showTrains}
              onChange={e => setShowTrains(e.target.checked)}
            />
            <span>Show Trains</span>
          </label>

          <div className="zoom-btn-group">
            <button
              className="zoom-btn"
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              className="zoom-btn"
              onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              className="zoom-btn"
              onClick={() => setZoomLevel(1)}
              title="Reset View"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Schematic SVG */}
      <div className="schematic-canvas-wrapper">
        <svg
          viewBox="0 0 920 370"
          className="schematic-svg"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          <defs>
            {/* Track Sleeper Pattern */}
            <pattern id="sleepers" width="8" height="8" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="1.5" />
            </pattern>
            {/* Gradient for active block */}
            <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c9353e" />
              <stop offset="50%" stopColor="#e55353" />
              <stop offset="100%" stopColor="#c9353e" />
            </linearGradient>
          </defs>

          {/* Background Grid Accent */}
          <rect width="920" height="370" fill="#f8fafc" rx="8" />

          {/* Section Track Lines (Underlay for track ties) */}
          {sectionLines.map(line => (
            <line
              key={`underlay-${line.id}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#e2e8f0"
              strokeWidth="14"
              strokeLinecap="round"
            />
          ))}

          {/* Section Tracks with State Coloring */}
          {sectionLines.map(line => {
            const sec = sections.find(s => s.id === line.id);
            const status = sec ? sec.status : 'Available';
            const isSelected = selectedSectionId === line.id;
            const colorClass = getStatusColorClass(status);

            // Filtering visibility
            if (filterLayer === 'active' && status !== 'Active Block') return null;
            if (filterLayer === 'conflicts' && status !== 'Conflict') return null;

            return (
              <g
                key={line.id}
                className={`schematic-track-group ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSectionSelect(line.id)}
              >
                {/* Active Selection Glow Ring */}
                {isSelected && (
                  <line
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="#1e293b"
                    strokeWidth="18"
                    strokeLinecap="round"
                    opacity="0.25"
                  />
                )}

                {/* Main Track Segment */}
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  className={`track-segment ${colorClass}`}
                  strokeWidth={isSelected ? 9 : 7}
                  strokeLinecap="round"
                />

                {/* Section Badge and Kilometer text */}
                <rect
                  x={line.labelX - 34}
                  y={line.labelY - 12}
                  width="68"
                  height="20"
                  rx="4"
                  fill="#ffffff"
                  stroke={isSelected ? '#1e293b' : '#cbd5e1'}
                  strokeWidth="1.5"
                  className="section-label-bg"
                />
                <text
                  x={line.labelX}
                  y={line.labelY + 2}
                  className="section-label-text"
                  textAnchor="middle"
                >
                  {sec ? `${sec.fromCode}–${sec.toCode}` : line.id}
                </text>
                <text
                  x={line.labelX}
                  y={line.labelY + 19}
                  className="section-subtext"
                  textAnchor="middle"
                >
                  {sec ? `${sec.lengthKm} km · ${sec.mps}kph` : ''}
                </text>
              </g>
            );
          })}

          {/* Trains on Tracks (Simulated Positions) */}
          {showTrains && (
            <g className="train-layer">
              {/* Train 12617 on Section A-B */}
              <g
                className="train-marker"
                transform="translate(210, 131)"
                onClick={() => handleSectionSelect('A-B')}
              >
                <title>12617 Mangala Lakshadweep Express at 03:15</title>
                <rect x="-35" y="-18" width="70" height="20" rx="10" fill="#1e3a8a" />
                <text x="0" y="-4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  🚆 12617 Exp
                </text>
              </g>

              {/* Freight BOXN-4022 on C-F */}
              <g
                className="train-marker"
                transform="translate(450, 250)"
                onClick={() => handleSectionSelect('C-F')}
              >
                <title>BOXN-4022 Container Freight</title>
                <rect x="-32" y="-18" width="64" height="20" rx="10" fill="#334155" />
                <text x="0" y="-4" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  🚛 4022 Fgt
                </text>
              </g>

              {/* 16347 on Section C-D */}
              <g
                className="train-marker"
                transform="translate(545, 142)"
                onClick={() => handleSectionSelect('C-D')}
              >
                <title>16347 Mangalore Express</title>
                <rect x="-35" y="-18" width="70" height="20" rx="10" fill="#047857" />
                <text x="0" y="-4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  🚆 16347 Exp
                </text>
              </g>
            </g>
          )}

          {/* Station Nodes */}
          {STATIONS.map(st => {
            const isEndOrJunction = st.junction;
            return (
              <g key={st.code} className="station-node-group">
                {/* Outer Ring */}
                <circle
                  cx={st.x}
                  cy={st.y}
                  r={isEndOrJunction ? 18 : 14}
                  fill="#ffffff"
                  stroke="#1e293b"
                  strokeWidth={isEndOrJunction ? 3.5 : 2.5}
                  className="station-circle"
                />
                {/* Station Letter (A, B, C, D, E, F, G) */}
                <text
                  x={st.x}
                  y={st.y + 4}
                  className="station-letter"
                  textAnchor="middle"
                  fontWeight="bold"
                  fontSize="12"
                  fill="#1e293b"
                >
                  {st.letter}
                </text>

                {/* Station Name & Code */}
                <text
                  x={st.x}
                  y={st.y + (st.y > 200 ? 32 : -22)}
                  className="station-name"
                  textAnchor="middle"
                  fontWeight="700"
                  fontSize="12"
                  fill="#0f172a"
                >
                  {st.name} ({st.code})
                </text>

                {/* Junction / KM indicator */}
                <text
                  x={st.x}
                  y={st.y + (st.y > 200 ? 44 : -10)}
                  className="station-km"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#64748b"
                >
                  {st.km} km {st.junction ? '· Junction' : ''}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Section Operational Inspector Drawer / Panel */}
      <div className="section-inspector">
        <div className="inspector-header">
          <div className="inspector-title">
            <span className="inspector-section-id">Section {selectedSection.id}</span>
            <h4>
              {selectedSection.fromName} ({selectedSection.fromCode}) ↔ {selectedSection.toName} ({selectedSection.toCode})
            </h4>
          </div>
          <span className={`status-tag status-${selectedSection.status.toLowerCase().replace(/ /g, '-')}`}>
            {selectedSection.status}
          </span>
        </div>

        <div className="inspector-metrics-grid">
          <div className="metric-chip">
            <span className="chip-label">Length & Tracks</span>
            <strong>{selectedSection.lengthKm} km · {selectedSection.tracks}</strong>
          </div>
          <div className="metric-chip">
            <span className="chip-label">Traction & MPS</span>
            <strong>{selectedSection.mps} km/h · 25kV AC</strong>
          </div>
          <div className="metric-chip">
            <span className="chip-label">Active / Planned Blocks</span>
            <strong>
              {sectionBlocks.length > 0 ? sectionBlocks.map(b => b.id).join(', ') : 'None active'}
            </strong>
          </div>
          <div className="metric-chip">
            <span className="chip-label">Pending Requests</span>
            <strong>{sectionRequests.length} departmental requests</strong>
          </div>
        </div>

        {/* Caution Orders / Restrictions */}
        {selectedSection.currentSpeedRestriction && (
          <div className="caution-order-box">
            <ShieldAlert size={14} className="text-warning" />
            <span>
              <strong>Caution Order Enforced:</strong> {selectedSection.currentSpeedRestriction}
            </span>
          </div>
        )}

        {/* Trains and Conflict Alerts on this section */}
        {sectionConflicts.length > 0 && (
          <div className="inspector-conflict-alert">
            <ShieldAlert size={16} className="text-danger" />
            <div>
              <strong>{sectionConflicts[0].description}</strong>
              <div className="text-xs text-muted">
                Conflict at {sectionConflicts[0].conflictPointTime} with {sectionConflicts[0].conflictingTrain.trainName} ({sectionConflicts[0].conflictingTrain.trainNo})
              </div>
            </div>
            <button
              className="btn-danger-xs"
              onClick={() => navigateTo('Conflicts')}
            >
              Resolve Conflicts
            </button>
          </div>
        )}

        {/* Quick Operational Actions */}
        <div className="inspector-actions">
          <button
            className="btn-secondary-sm"
            onClick={() => navigateTo('Maintenance Requests')}
          >
            <Wrench size={14} />
            <span>View {sectionRequests.length} Requests</span>
          </button>
          <button
            className="btn-secondary-sm"
            onClick={() => navigateTo('Block Planner')}
          >
            <Clock size={14} />
            <span>Inspect in Gantt</span>
          </button>
          <button
            className="btn-primary-sm"
            onClick={() => navigateTo('AI Optimizer')}
          >
            <Zap size={14} />
            <span>Optimize Section Blocks</span>
          </button>
        </div>
      </div>
    </div>
  );
};
