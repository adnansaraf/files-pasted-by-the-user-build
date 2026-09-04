import React, { useState, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Train,
  ShieldAlert,
  Clock,
  ArrowLeft,
  Wrench,
  Zap,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Layers,
  Sparkles,
  Info,
  ExternalLink,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDivisionNetwork, getSectionStations, getWorkZonesForSection } from '../data/hierarchyData';
import { MaintenanceWorkZone, SectionStatus, RailwaySection } from '../types';

interface SchematicMapProps {
  compact?: boolean;
  onSectionClick?: (sectionId: string) => void;
}

const DIVISION_TRAINS: Record<
  string,
  { no: string; name: string; x: number; y: number; color: string }[]
> = {
  PGT: [
    { no: '12617 Exp', name: 'Mangala SF', x: 200, y: 130, color: '#1e3a8a' },
    { no: '4022 Fgt', name: 'BOXN Freight', x: 440, y: 240, color: '#334155' },
    { no: '16347 Exp', name: 'Mangalore Exp', x: 525, y: 145, color: '#047857' }
  ],
  TVC: [
    { no: '16343 Exp', name: 'Amritha Exp', x: 200, y: 110, color: '#1e3a8a' },
    { no: '16127 Exp', name: 'Guruvayur Exp', x: 665, y: 190, color: '#047857' },
    { no: '56365 Pass', name: 'Fast Passenger', x: 330, y: 225, color: '#d97706' }
  ],
  MAS: [
    { no: '12602 Exp', name: 'Chennai Mail', x: 270, y: 130, color: '#1e3a8a' },
    { no: '12675 Exp', name: 'Kovai SF', x: 540, y: 130, color: '#047857' },
    { no: '41002 EMU', name: 'Tambaram Local', x: 290, y: 240, color: '#0284c7' }
  ],
  MYS: [
    { no: '16231 Exp', name: 'Mayiladuturai Exp', x: 210, y: 200, color: '#1e3a8a' },
    { no: '20607 VB', name: 'Vande Bharat', x: 610, y: 155, color: '#7c3aed' },
    { no: '56214 Pass', name: 'Hassan Passenger', x: 175, y: 145, color: '#334155' }
  ]
};

export const SchematicMap: React.FC<SchematicMapProps> = ({ compact = false, onSectionClick }) => {
  const {
    sections,
    selectedSectionId,
    setSelectedSectionId,
    selectedSection,
    selectedDivisionId,
    selectedDivision,
    setSelectedDivisionId,
    currentMapLevel,
    selectedDrillDownSectionId,
    selectedWorkZoneId,
    workZones,
    selectedWorkZone,
    drillDownToSection,
    drillDownToWorkZone,
    backToDivision,
    backToSection,
    approveWorkZoneBundle,
    requests
  } = useApp();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [filterLayer, setFilterLayer] = useState<'all' | 'active' | 'conflicts'>('all');
  const [showTrains, setShowTrains] = useState(true);

  // Active division network topology
  const divisionNet = useMemo(() => {
    return getDivisionNetwork(selectedDivisionId);
  }, [selectedDivisionId]);

  const divisionSectionLines = divisionNet.sectionLines;
  const divisionStations = divisionNet.stations;

  // Active section for drilldown
  const activeSectionId =
    selectedDrillDownSectionId ||
    selectedSectionId ||
    (divisionNet.sections[0] ? divisionNet.sections[0].id : 'C-D');

  const activeSectionObj: RailwaySection =
    sections.find(s => s.id === activeSectionId) ||
    divisionNet.sections.find(s => s.id === activeSectionId) ||
    divisionNet.sections[0] ||
    selectedSection;

  // Intermediate stations for the current section
  const sectionStations = getSectionStations(activeSectionId);
  const sectionWorkZones = workZones.filter(wz => wz.sectionId === activeSectionId);

  // Fallback to section endpoints if no intermediate nodes recorded
  const displayStations =
    sectionStations.length > 0
      ? sectionStations
      : [
          {
            id: `ST-${activeSectionObj.fromCode}`,
            code: activeSectionObj.fromCode,
            name: activeSectionObj.fromName,
            km: 0,
            junction: true,
            sectionId: activeSectionObj.id,
            nodeType: 'Junction Station' as const
          },
          {
            id: `ST-${activeSectionObj.toCode}`,
            code: activeSectionObj.toCode,
            name: activeSectionObj.toName,
            km: activeSectionObj.lengthKm,
            junction: true,
            sectionId: activeSectionObj.id,
            nodeType: 'Terminal Station' as const
          }
        ];

  const handleSectionClick = (secId: string) => {
    drillDownToSection(secId);
    if (onSectionClick) onSectionClick(secId);
  };

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

  const showcaseSection =
    divisionSectionLines.find(l => l.isShowcase) || divisionSectionLines[0];

  return (
    <div className={`schematic-map-container ${compact ? 'compact' : 'expanded'}`}>
      {/* Level Breadcrumb & Navigation Bar */}
      <div className="map-hierarchy-navbar">
        <div className="map-breadcrumbs">
          <button
            className={`breadcrumb-btn ${currentMapLevel === 'division' ? 'active' : ''}`}
            onClick={backToDivision}
          >
            <span>{selectedDivision.name}</span>
          </button>

          {currentMapLevel !== 'division' && (
            <>
              <span className="breadcrumb-sep">/</span>
              <button
                className={`breadcrumb-btn ${currentMapLevel === 'section' ? 'active' : ''}`}
                onClick={backToSection}
              >
                <span>{activeSectionObj.fromName} – {activeSectionObj.toName} Section</span>
              </button>
            </>
          )}

          {currentMapLevel === 'workzone' && selectedWorkZone && (
            <>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">
                Work Zone: {selectedWorkZone.startStationName} – {selectedWorkZone.endStationName} ({selectedWorkZone.line})
              </span>
            </>
          )}
        </div>

        {currentMapLevel !== 'division' && (
          <button className="btn-back-hierarchy" onClick={backToDivision}>
            <ArrowLeft size={14} />
            <span>← Back to Division</span>
          </button>
        )}
      </div>

      {/* Map Toolbar & Legend */}
      <div className="map-toolbar">
        <div className="map-legend">
          <span className="legend-item" title="Station / Junction node">
            <span className="legend-dot dot-station" />
            <span>● Station</span>
          </span>
          <span className="legend-item" title="Railway line connecting stations">
            <span className="legend-line line-section" />
            <span>━━ Railway Section</span>
          </span>
          <span className="legend-item" title="Specific localized maintenance work zone">
            <span className="legend-dot dot-workzone" />
            <span>🔴 Maintenance Work Zone</span>
          </span>
          <span className="legend-item" title="Operational train scheduling conflict">
            <span className="legend-dot dot-conflict" />
            <span>🟠 Operational Conflict</span>
          </span>
          <span className="legend-item" title="Track section available for traffic">
            <span className="legend-dot dot-available" />
            <span>🟢 Available</span>
          </span>
          <span className="legend-item" title="Live train movement position">
            <Train size={13} className="text-navy" />
            <span>🔵 Train Movement</span>
          </span>
          <span className="legend-item" title="Permanent or temporary speed restriction">
            <span className="legend-dot dot-warning" />
            <span>⚠ Speed Restriction</span>
          </span>
        </div>

        <div className="map-controls">
          <div className="filter-pill-group">
            <button
              className={`filter-pill ${filterLayer === 'all' ? 'active' : ''}`}
              onClick={() => setFilterLayer('all')}
            >
              All
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

      {/* ════════════════════════════════════════════════════════════════
          LEVEL 1: DIVISION MAP (When currentMapLevel === 'division')
         ════════════════════════════════════════════════════════════════ */}
      {currentMapLevel === 'division' && (
        <div className="schematic-canvas-wrapper">
          <div className="map-interaction-hint-banner">
            <Info size={14} className="text-maroon" />
            <span>
              <strong>Division Overview ({selectedDivision.name}):</strong> A line between stations represents an operational{' '}
              <strong>Railway Section</strong>. Click any section such as{' '}
              <button
                className="inline-drilldown-link"
                onClick={() => handleSectionClick(showcaseSection.id)}
              >
                {showcaseSection.name}
              </button>{' '}
              to drill down into intermediate stations, substations, tracks, and maintenance work zones.
            </span>
          </div>

          <svg
            viewBox="0 0 920 370"
            className="schematic-svg"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            <defs>
              <pattern id="sleepers" width="8" height="8" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="1.5" />
              </pattern>
            </defs>

            <rect width="920" height="370" fill="#f8fafc" rx="8" />

            {/* Track underlays */}
            {divisionSectionLines.map(line => (
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

            {/* Main Sections */}
            {divisionSectionLines.map(line => {
              const sec = sections.find(s => s.id === line.id) || divisionNet.sections.find(s => s.id === line.id);
              const status = sec ? sec.status : 'Available';
              const isSelected = selectedSectionId === line.id;
              const colorClass = getStatusColorClass(status);

              if (filterLayer === 'active' && status !== 'Active Block') return null;
              if (filterLayer === 'conflicts' && status !== 'Conflict') return null;

              return (
                <g
                  key={line.id}
                  className={`schematic-track-group ${isSelected ? 'selected' : ''} ${line.isShowcase ? 'showcase-section' : ''}`}
                  onClick={() => handleSectionClick(line.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <title>Click section to drill down ({line.name})</title>

                  {/* Highlight Glow for Showcase Section */}
                  {line.isShowcase && (
                    <line
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke="#8d2430"
                      strokeWidth="16"
                      strokeLinecap="round"
                      opacity="0.2"
                      className="pulse-glow"
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

                  {/* Section Badge */}
                  <rect
                    x={line.labelX - 42}
                    y={line.labelY - 13}
                    width="84"
                    height="22"
                    rx="5"
                    fill="#ffffff"
                    stroke={isSelected ? '#1e293b' : '#94a3b8'}
                    strokeWidth={line.isShowcase ? '2' : '1.5'}
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
                    y={line.labelY + 21}
                    className="section-subtext"
                    textAnchor="middle"
                  >
                    {line.isShowcase ? 'Click to drill down' : `${sec?.lengthKm || 0} km`}
                  </text>

                  {/* Interactive cue badge on section */}
                  {line.isShowcase && (
                    <g transform={`translate(${line.labelX - 45}, ${line.labelY - 30})`}>
                      <rect x="0" y="0" width="90" height="15" rx="3" fill="#8d2430" />
                      <text x="45" y="11" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                        🔍 Drill Down →
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Trains on Tracks (Division View) */}
            {showTrains && (
              <g className="train-layer">
                {(DIVISION_TRAINS[selectedDivisionId] || DIVISION_TRAINS['PGT']).map((tr, idx) => (
                  <g key={idx} className="train-marker" transform={`translate(${tr.x}, ${tr.y})`}>
                    <rect x="-35" y="-18" width="70" height="20" rx="10" fill={tr.color} />
                    <text x="0" y="-4" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                      🚆 {tr.no}
                    </text>
                  </g>
                ))}
              </g>
            )}

            {/* Division Major Station Nodes */}
            {divisionStations.map(st => {
              const isJunction = st.junction;
              const textBelow = st.y > 200;
              return (
                <g key={st.code} className="station-node-group">
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={isJunction ? 16 : 12}
                    fill="#ffffff"
                    stroke="#1e293b"
                    strokeWidth={isJunction ? 3.5 : 2.5}
                    className="station-circle"
                  />
                  <circle cx={st.x} cy={st.y} r="5" fill="#1e293b" />
                  <text
                    x={st.x}
                    y={st.y + (textBelow ? 28 : -20)}
                    className="station-name"
                    textAnchor="middle"
                    fontWeight="700"
                    fontSize="11"
                    fill="#0f172a"
                  >
                    {st.name} ({st.code})
                  </text>
                  <text
                    x={st.x}
                    y={st.y + (textBelow ? 40 : -9)}
                    className="station-km"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#64748b"
                  >
                    {st.km} km {st.junction ? '· Junction' : ''}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          LEVEL 2 & 3: SECTION DETAIL MAP WITH INTERMEDIATE STATIONS
          AND LOCALIZED MAINTENANCE WORK ZONES
         ════════════════════════════════════════════════════════════════ */}
      {currentMapLevel !== 'division' && (
        <div className="schematic-canvas-wrapper section-detail-canvas">
          <div className="section-canvas-header">
            <div className="d-flex align-center gap-2">
              <span className="section-pill-lg">Section {activeSectionObj.id}</span>
              <h3>
                {activeSectionObj.fromName} ({activeSectionObj.fromCode}) ↔ {activeSectionObj.toName} ({activeSectionObj.toCode})
              </h3>
            </div>
            <div className="section-meta-chips">
              <span className="meta-chip">{activeSectionObj.tracks} · 25kV AC</span>
              <span className="meta-chip">{activeSectionObj.lengthKm} Route km</span>
              <span className="meta-chip">MPS: {activeSectionObj.mps} km/h</span>
              <span className="meta-chip badge-workzones-count">{sectionWorkZones.length} Maintenance Work Zones</span>
            </div>
          </div>

          <div className="map-interaction-hint-banner">
            <Wrench size={14} className="text-maroon" />
            <span>
              <strong>Maintenance Work Zones:</strong> Work is isolated to specific track work zones between stations (not the entire section).{' '}
              Click any highlighted <strong>Maintenance Work Zone</strong> below to inspect detected tasks, SolveX bundle optimization, and officer approval.
            </span>
          </div>

          {/* Section SVG: Dual-line corridor with intermediate stations & work zones */}
          <svg
            viewBox="0 0 960 300"
            className="schematic-svg section-zoom-svg"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            <defs>
              <linearGradient id="workzone-grad-conflict" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#ef4444" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="workzone-grad-pending" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ea580c" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="workzone-grad-sched" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#16a34a" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.85" />
              </linearGradient>
            </defs>

            <rect width="960" height="300" fill="#ffffff" rx="8" />

            {/* Line Labels: UP Line and DN Line */}
            <text x="25" y="129" fill="#64748b" fontSize="10" fontWeight="bold">
              UP LINE ➔
            </text>
            <text x="25" y="189" fill="#64748b" fontSize="10" fontWeight="bold">
              DN LINE ➔
            </text>

            {/* UP Track (y = 125) */}
            <line x1="90" y1="125" x2="870" y2="125" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
            {/* DN Track (y = 185) */}
            <line x1="90" y1="185" x2="870" y2="185" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />

            {/* Dynamic Station Layout Calculation */}
            {(() => {
              const leftMargin = 95;
              const rightMargin = 865;
              const availableWidth = rightMargin - leftMargin;
              const stationCount = displayStations.length;
              const step = stationCount > 1 ? availableWidth / (stationCount - 1) : availableWidth;

              const stationXMap: Record<string, number> = {};
              displayStations.forEach((st, idx) => {
                stationXMap[st.code] = Math.round(leftMargin + idx * step);
              });

              // Crossover switch lines between tracks
              const cross1X =
                displayStations.length >= 3
                  ? Math.round((stationXMap[displayStations[0].code] + stationXMap[displayStations[1].code]) / 2)
                  : 260;
              const cross2X =
                displayStations.length >= 4
                  ? Math.round(
                      (stationXMap[displayStations[displayStations.length - 2].code] +
                        stationXMap[displayStations[displayStations.length - 1].code]) /
                        2
                    )
                  : 660;

              return (
                <>
                  {/* Crossovers between tracks */}
                  <line x1={cross1X - 16} y1="125" x2={cross1X + 16} y2="185" stroke="#94a3b8" strokeWidth="3" strokeDasharray="4 3" />
                  <line x1={cross2X + 16} y1="185" x2={cross2X - 16} y2="125" stroke="#94a3b8" strokeWidth="3" strokeDasharray="4 3" />

                  {/* Highlighted Maintenance Work Zones */}
                  {sectionWorkZones.map(wz => {
                    const isSelected = selectedWorkZoneId === wz.id;
                    const isConflict = wz.conflictStatus === 'Operational Conflict';
                    const isApproved = wz.optimization.approvalStatus === 'Approved by Officer';
                    const grad = isApproved
                      ? 'url(#workzone-grad-sched)'
                      : isConflict
                      ? 'url(#workzone-grad-conflict)'
                      : 'url(#workzone-grad-pending)';

                    // Calculate X bounds between start and end station nodes
                    let startX = stationXMap[wz.startStationCode];
                    let endX = stationXMap[wz.endStationCode];

                    // If station codes not directly mapped, fallback sensibly
                    if (startX === undefined || endX === undefined) {
                      startX = leftMargin + 80;
                      endX = rightMargin - 80;
                    }

                    const minX = Math.min(startX, endX);
                    const maxX = Math.max(startX, endX);
                    const pad = Math.min(26, (maxX - minX) * 0.18);
                    const x1 = minX + pad;
                    const x2 = maxX - pad;
                    const midX = (x1 + x2) / 2;

                    const isUp = wz.line.includes('UP');
                    const trackY = isUp ? 125 : 185;
                    const badgeY = isUp ? 97 : 213;
                    const chainageY = isUp ? 82 : 233;

                    return (
                      <g
                        key={wz.id}
                        className={`workzone-svg-group ${isSelected ? 'active-workzone' : ''}`}
                        onClick={() => drillDownToWorkZone(wz.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <title>Maintenance Work Zone: {wz.startStationName} – {wz.endStationName} ({wz.line})</title>

                        {/* Outer Glow Halo */}
                        <rect
                          x={x1 - 4}
                          y={trackY - 14}
                          width={Math.max(30, x2 - x1 + 8)}
                          height={28}
                          rx="6"
                          fill={isConflict ? '#fee2e2' : '#fef3c7'}
                          stroke={isSelected ? '#8d2430' : isConflict ? '#dc2626' : '#d97706'}
                          strokeWidth={isSelected ? '2.5' : '1.5'}
                          strokeDasharray={isSelected ? '0' : '4 3'}
                          className="workzone-halo"
                        />

                        {/* Heavy Work Zone Possession Track Line */}
                        <line
                          x1={x1}
                          y1={trackY}
                          x2={x2}
                          y2={trackY}
                          stroke={grad}
                          strokeWidth={isSelected ? '10' : '8'}
                          strokeLinecap="round"
                        />

                        {/* Chainage text (Generously spaced vertically away from station labels) */}
                        <text
                          x={midX}
                          y={chainageY}
                          textAnchor="middle"
                          fontSize="8.5"
                          fill="#64748b"
                          fontWeight="600"
                        >
                          {wz.chainage}
                        </text>

                        {/* Work Zone Badge / Flag */}
                        <g transform={`translate(${midX}, ${badgeY})`}>
                          <rect
                            x="-58"
                            y="-9"
                            width="116"
                            height="18"
                            rx="4"
                            fill="#ffffff"
                            stroke={isSelected ? '#8d2430' : isConflict ? '#b91c1c' : '#d97706'}
                            strokeWidth={isSelected ? '2' : '1.5'}
                            filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
                          />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            fontSize="8.5"
                            fontWeight="bold"
                            fill={isApproved ? '#166534' : isConflict ? '#991b1b' : '#b45309'}
                          >
                            {isApproved ? '✓ SANCTIONED' : '🔴 WORK ZONE'} ({isUp ? 'UP' : 'DN'})
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {/* Simulated Trains inside the section */}
                  {showTrains && displayStations.length >= 2 && (
                    <g className="train-layer">
                      <g
                        className="train-marker"
                        transform={`translate(${stationXMap[displayStations[0].code] + 65}, 117)`}
                      >
                        <rect x="-35" y="-14" width="70" height="17" rx="8" fill="#1e3a8a" />
                        <text x="0" y="-2" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                          🚆 {selectedDivisionId === 'TVC' ? '16343 Exp' : selectedDivisionId === 'MAS' ? '12602 Exp' : selectedDivisionId === 'MYS' ? '16231 Exp' : '12617 Exp'}
                        </text>
                      </g>
                      {displayStations.length >= 3 && (
                        <g
                          className="train-marker"
                          transform={`translate(${stationXMap[displayStations[displayStations.length - 1].code] - 65}, 177)`}
                        >
                          <rect x="-35" y="-14" width="70" height="17" rx="8" fill="#047857" />
                          <text x="0" y="-2" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                            🚆 {selectedDivisionId === 'TVC' ? '16127 Exp' : selectedDivisionId === 'MAS' ? '12675 Exp' : selectedDivisionId === 'MYS' ? '20607 VB' : '16604 Exp'}
                          </text>
                        </g>
                      )}
                    </g>
                  )}

                  {/* Intermediate Stations inside Section */}
                  {displayStations.map(st => {
                    const x = stationXMap[st.code] || leftMargin;
                    const isTerminal = st.nodeType === 'Terminal Station' || st.nodeType === 'Junction Station';

                    return (
                      <g key={st.code} className="section-station-node">
                        {/* Vertical Station Stop Bar traversing UP and DN lines */}
                        <line
                          x1={x}
                          y1="105"
                          x2={x}
                          y2="205"
                          stroke="#94a3b8"
                          strokeWidth="2"
                          strokeDasharray="2 2"
                        />

                        {/* Upper Track Stop Point */}
                        <circle
                          cx={x}
                          cy="125"
                          r={isTerminal ? 7 : 5}
                          fill="#ffffff"
                          stroke="#1e293b"
                          strokeWidth={isTerminal ? 3 : 2}
                        />

                        {/* Lower Track Stop Point */}
                        <circle
                          cx={x}
                          cy="185"
                          r={isTerminal ? 7 : 5}
                          fill="#ffffff"
                          stroke="#1e293b"
                          strokeWidth={isTerminal ? 3 : 2}
                        />

                        {/* Center Station Symbol Circle */}
                        <circle
                          cx={x}
                          cy="155"
                          r={isTerminal ? 14 : 11}
                          fill="#ffffff"
                          stroke={isTerminal ? '#8d2430' : '#1e293b'}
                          strokeWidth={isTerminal ? 3 : 2}
                          className="station-node-point"
                        />
                        <circle cx={x} cy="155" r="4" fill={isTerminal ? '#8d2430' : '#1e293b'} />

                        {/* Station Name (Top tier: y = 38) */}
                        <text
                          x={x}
                          y="38"
                          textAnchor="middle"
                          fontWeight="700"
                          fontSize="11.5"
                          fill="#0f172a"
                        >
                          {st.name}
                        </text>

                        {/* Station Code & Chainage (Top tier: y = 52) */}
                        <text
                          x={x}
                          y="52"
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight="600"
                          fill="#475569"
                        >
                          ({st.code}) · km {st.km}
                        </text>

                        {/* Station Classification (Bottom tier: y = 262) */}
                        <text
                          x={x}
                          y="262"
                          textAnchor="middle"
                          fontSize="9"
                          fill="#64748b"
                        >
                          {st.nodeType}
                        </text>
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          LEVEL 3: MAINTENANCE WORK ZONE & SOLVEX INNOVATION WORKBENCH
         ════════════════════════════════════════════════════════════════ */}
      {selectedWorkZone ? (
        <div className="workzone-detail-panel animate-slide-up">
          {/* Work Zone Header */}
          <div className="workzone-header-row">
            <div>
              <div className="d-flex align-center gap-2">
                <span className="badge-workzone-id">{selectedWorkZone.id}</span>
                <span className="badge-workzone-line">{selectedWorkZone.line}</span>
                <span className={`priority-tag priority-${selectedWorkZone.criticality.toLowerCase()}`}>
                  {selectedWorkZone.criticality} Criticality
                </span>
                <span className={`status-tag status-${selectedWorkZone.status.toLowerCase().replace(/ /g, '-')}`}>
                  {selectedWorkZone.status}
                </span>
              </div>
              <h2 className="workzone-title mt-1">
                Maintenance Work Zone: {selectedWorkZone.startStationName} ({selectedWorkZone.startStationCode}) ↔{' '}
                {selectedWorkZone.endStationName} ({selectedWorkZone.endStationCode})
              </h2>
              <p className="workzone-chainage text-muted">
                Track Chainage: {selectedWorkZone.chainage} · Section {selectedWorkZone.sectionName}
              </p>
            </div>

            <div className="header-badge-action">
              {selectedWorkZone.optimization.approvalStatus === 'Approved by Officer' ? (
                <div className="sanction-stamp">
                  <ShieldCheck size={20} className="text-success" />
                  <div>
                    <strong>SANCTIONED / APPROVED</strong>
                    <small>By {selectedWorkZone.optimization.approvedBy} at {selectedWorkZone.optimization.approvedAt}</small>
                  </div>
                </div>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => approveWorkZoneBundle(selectedWorkZone.id)}
                >
                  <CheckCircle2 size={16} />
                  <span>Approve Coordinated Block (Sanction)</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="workzone-metrics-grid">
            <div className="metric-cell">
              <span className="cell-lbl">Estimated Duration</span>
              <strong>{selectedWorkZone.estimatedDurationMin} minutes</strong>
              <small>Without coordination: {selectedWorkZone.tasks.reduce((a, b) => a + b.durationMin, 0)} min</small>
            </div>
            <div className="metric-cell">
              <span className="cell-lbl">Preferred Window</span>
              <strong>{selectedWorkZone.preferredWindow} IST</strong>
              <small>Night corridor slot</small>
            </div>
            <div className="metric-cell">
              <span className="cell-lbl">Conflict Status</span>
              <strong className={selectedWorkZone.conflictStatus === 'No Conflict' ? 'text-success' : 'text-danger'}>
                {selectedWorkZone.conflictStatus}
              </strong>
              <small>{selectedWorkZone.conflictDetail || 'No path clashes detected'}</small>
            </div>
            <div className="metric-cell">
              <span className="cell-lbl">Affected Train Paths</span>
              <strong>{selectedWorkZone.affectedTrains.length} Trains</strong>
              <small>{selectedWorkZone.affectedTrains.map(t => t.trainNo).join(', ') || 'None'}</small>
            </div>
          </div>

          {/* Detected Departmental Tasks Grid */}
          <div className="detected-tasks-section">
            <div className="section-subhead">
              <h4>
                Detected Departmental Requisitions for this Work Zone ({selectedWorkZone.tasks.length})
              </h4>
              <span className="tag-compatible">Compatible for Bundling</span>
            </div>

            <div className="tasks-cards-grid">
              {selectedWorkZone.tasks.map(task => (
                <div key={task.id} className="task-detail-card">
                  <div className="task-card-header">
                    <span className={`dept-pill dept-${task.dept.toLowerCase()}`}>{task.dept}</span>
                    <strong className="text-monospace">{task.durationMin} min</strong>
                  </div>
                  <div className="task-worktype">{task.workType}</div>
                  <p className="task-desc">{task.description}</p>
                  <div className="task-resources">
                    <Wrench size={12} className="text-muted" />
                    <span>{task.resources}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              CORE SOLVEX INNOVATION: BUNDLE → COORDINATE → OPTIMIZE
             ════════════════════════════════════════════════════════════════ */}
          <div className="solvex-innovation-card">
            <div className="innovation-header">
              <div className="d-flex align-center gap-2">
                <Sparkles size={20} className="text-maroon" />
                <div>
                  <h3 className="innovation-title">SOLVEX AI RECOMMENDATION & CORRIDOR BUNDLING</h3>
                  <span className="innovation-subtitle">
                    Automated multi-departmental possession synthesis · Compatible Tasks Detected:{' '}
                    <strong>{selectedWorkZone.optimization.compatibleTasksCount}</strong>
                  </span>
                </div>
              </div>
              <div className="synergy-score-pill">
                <span>Synergy Score:</span>
                <strong>{selectedWorkZone.optimization.synergyScore}/100</strong>
              </div>
            </div>

            {/* Visual Graphic Representation: Many Requests ──> ONE Coordinated Block */}
            <div className="bundle-visual-flow">
              <div className="flow-inputs-col">
                {selectedWorkZone.tasks.map(t => (
                  <div key={t.id} className="flow-input-item">
                    <span className={`flow-dept-chip dept-${t.dept.toLowerCase()}`}>{t.dept}</span>
                    <span className="flow-task-name">{t.workType}</span>
                    <span className="flow-task-time">{t.durationMin}m</span>
                  </div>
                ))}
              </div>

              <div className="flow-connector-col">
                <div className="flow-bracket" />
                <div className="flow-arrow">
                  <span>COMBINED VIA SOLVEX</span>
                  <strong>➔</strong>
                </div>
              </div>

              <div className="flow-output-col">
                <div className="coordinated-block-box">
                  <div className="coord-badge">ONE COORDINATED MAINTENANCE BLOCK</div>
                  <div className="coord-window">{selectedWorkZone.optimization.recommendedWindow} IST</div>
                  <div className="coord-summary">
                    Duration: <strong>{selectedWorkZone.optimization.combinedBlockDurationMin} min</strong>{' '}
                    (Saved {selectedWorkZone.optimization.timeSavedMin}m vs separate blocks)
                  </div>
                  <div className="coord-impact text-success">
                    Operational Impact: <strong>{selectedWorkZone.optimization.operationalImpact}</strong> ·{' '}
                    <strong>{selectedWorkZone.optimization.conflictsAvoided} Conflicts Avoided</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation Note */}
            <div className="solvex-explanation-box">
              <Info size={16} className="text-maroon flex-shrink-0" />
              <p>{selectedWorkZone.optimization.explanation}</p>
            </div>

            {/* Alternative Windows Comparison */}
            <div className="alternatives-comparison-block">
              <h5>Alternative Block Windows Evaluated:</h5>
              <div className="alternatives-grid">
                {selectedWorkZone.optimization.alternativeWindows.map((alt, idx) => (
                  <div
                    key={alt.id}
                    className={`alternative-chip-card ${alt.isRecommended ? 'recommended' : ''}`}
                  >
                    <div className="d-flex justify-between align-center mb-1">
                      <strong className="alt-window">{alt.window}</strong>
                      {alt.isRecommended ? (
                        <span className="badge-recommended-xs">Recommended</span>
                      ) : (
                        <span className="alt-num">Option {idx + 1}</span>
                      )}
                    </div>
                    <div className="alt-specs">
                      <span>Duration: {alt.durationMin}m</span> ·{' '}
                      <span>Impact: {alt.operationalImpact}</span> ·{' '}
                      <span>Conflicts: {alt.conflicts}</span>
                    </div>
                    <p className="alt-reason">{alt.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Section Overview Drawer (when inside section view, but no specific work zone selected yet) */
        currentMapLevel !== 'division' && (
          <div className="section-inspector">
            <div className="inspector-header">
              <div className="inspector-title">
                <span className="inspector-section-id">Section {activeSectionObj.id}</span>
                <h4>
                  {activeSectionObj.fromName} ({activeSectionObj.fromCode}) ↔ {activeSectionObj.toName} ({activeSectionObj.toCode})
                </h4>
              </div>
              <span className={`status-tag status-${activeSectionObj.status.toLowerCase().replace(/ /g, '-')}`}>
                {activeSectionObj.status}
              </span>
            </div>

            <div className="inspector-metrics-grid">
              <div className="metric-chip">
                <span className="chip-label">Corridor Length</span>
                <strong>{activeSectionObj.lengthKm} km · {activeSectionObj.tracks}</strong>
              </div>
              <div className="metric-chip">
                <span className="chip-label">Intermediate Stations</span>
                <strong>{displayStations.length} Station Nodes</strong>
              </div>
              <div className="metric-chip">
                <span className="chip-label">Maintenance Work Zones</span>
                <strong className="text-maroon">{sectionWorkZones.length} Localized Zones</strong>
              </div>
              <div className="metric-chip">
                <span className="chip-label">Speed & Traction</span>
                <strong>{activeSectionObj.mps} km/h · 25kV AC</strong>
              </div>
            </div>

            {/* Work Zones Quick Selection Strip */}
            <div className="workzones-quick-list">
              {sectionWorkZones.length > 0 ? (
                <>
                  <span className="strip-label font-bold">Select a Maintenance Work Zone to inspect:</span>
                  <div className="workzones-pills-row">
                    {sectionWorkZones.map(wz => (
                      <button
                        key={wz.id}
                        className="wz-pill-button"
                        onClick={() => drillDownToWorkZone(wz.id)}
                      >
                        <Wrench size={13} className="text-maroon" />
                        <strong>{wz.startStationCode}–{wz.endStationCode} ({wz.line})</strong>
                        <span className="wz-dept-tag">{wz.departments.join('+')}</span>
                        <span className={`priority-tag priority-${wz.criticality.toLowerCase()}`}>{wz.criticality}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="d-flex align-center gap-2 text-muted" style={{ padding: '8px 0', fontSize: '12px' }}>
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Corridor Clear: No active or planned maintenance blocks on this section. Track capacity 100% available.</span>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Legacy Section Inspector (Only on Division Map) */}
      {currentMapLevel === 'division' && (
        <div className="section-inspector">
          <div className="inspector-header">
            <div className="inspector-title">
              <span className="inspector-section-id">Section {activeSectionObj.id}</span>
              <h4>
                {activeSectionObj.fromName} ({activeSectionObj.fromCode}) ↔ {activeSectionObj.toName} ({activeSectionObj.toCode})
              </h4>
            </div>
            <div className="d-flex align-center gap-2">
              <button
                className="btn-primary-sm"
                onClick={() => drillDownToSection(activeSectionObj.id)}
              >
                <span>Drill Down into Section</span>
                <ChevronRight size={14} />
              </button>
              <span className={`status-tag status-${activeSectionObj.status.toLowerCase().replace(/ /g, '-')}`}>
                {activeSectionObj.status}
              </span>
            </div>
          </div>

          <div className="inspector-metrics-grid">
            <div className="metric-chip">
              <span className="chip-label">Length & Tracks</span>
              <strong>{activeSectionObj.lengthKm} km · {activeSectionObj.tracks}</strong>
            </div>
            <div className="metric-chip">
              <span className="chip-label">Traction & MPS</span>
              <strong>{activeSectionObj.mps} km/h · 25kV AC</strong>
            </div>
            <div className="metric-chip">
              <span className="chip-label">Section Work Zones</span>
              <strong>{getWorkZonesForSection(activeSectionObj.id).length} zones detected</strong>
            </div>
            <div className="metric-chip">
              <span className="chip-label">Pending Requests</span>
              <strong>{requests.filter(r => r.sectionId === activeSectionObj.id).length} departmental requests</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
