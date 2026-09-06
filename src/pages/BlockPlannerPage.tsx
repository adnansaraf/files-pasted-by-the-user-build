import React, { useState } from 'react';
import {
  CalendarRange,
  Sparkles,
  Filter,
  TriangleAlert,
  Clock,
  Layers,
  Wrench,
  Zap,
  Radio,
  Train,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GanttTimeline } from '../components/GanttTimeline';
import { BlockDetailModal } from '../components/BlockDetailModal';

export const BlockPlannerPage: React.FC = () => {
  const { navigateTo, blocks, conflicts, setSelectedSectionId, setInspectingBlock } = useApp();
  const [filterDept, setFilterDept] = useState<string>('');
  const [timeZoom, setTimeZoom] = useState<'24h' | '12h' | '6h'>('24h');

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="page-badge">OPERATIONAL GANTT SCHEDULER</div>
          <h1 className="page-title">Block Planner (24-Hour Corridor Schedule)</h1>
          <p className="page-subtitle">
            Palakkad Division · Simultaneous track possessions, 25kV traction isolations, and train headway slots
          </p>
        </div>

        <div className="header-actions-group">
          <button
            className="btn-secondary"
            onClick={() => navigateTo('Conflicts')}
          >
            <TriangleAlert size={15} className="text-danger" />
            <span>Inspect Conflicts ({conflicts.length})</span>
          </button>
          <button
            className="btn-primary"
            onClick={() => navigateTo('AI Optimizer')}
          >
            <Sparkles size={16} />
            <span>Run AI Block Optimizer</span>
          </button>
        </div>
      </div>

      {/* Corridor Header & Controls Bar */}
      <div className="planner-control-bar">
        <div className="planner-info-item">
          <Clock size={15} className="text-muted" />
          <span className="info-label">Active Shift:</span>
          <strong>Shift 3 (Night Possessions 22:00–06:00 IST)</strong>
        </div>

        <div className="planner-filters">
          <div className="filter-group">
            <span className="filter-label">
              <Filter size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
              Department:
            </span>
            <button
              className={`filter-btn-pill ${filterDept === '' ? 'active' : ''}`}
              onClick={() => setFilterDept('')}
            >
              All Lanes
            </button>
            <button
              className={`filter-btn-pill ${filterDept === 'Engineering' ? 'active' : ''}`}
              onClick={() => setFilterDept('Engineering')}
            >
              Engineering
            </button>
            <button
              className={`filter-btn-pill ${filterDept === 'TRD' ? 'active' : ''}`}
              onClick={() => setFilterDept('TRD')}
            >
              TRD Catenary
            </button>
            <button
              className={`filter-btn-pill ${filterDept === 'S&T' ? 'active' : ''}`}
              onClick={() => setFilterDept('S&T')}
            >
              S&T Signalling
            </button>
          </div>

          <div className="zoom-toggle-group">
            <button
              className={`zoom-toggle ${timeZoom === '24h' ? 'active' : ''}`}
              onClick={() => setTimeZoom('24h')}
            >
              24h Full Day
            </button>
            <button
              className={`zoom-toggle ${timeZoom === '12h' ? 'active' : ''}`}
              onClick={() => setTimeZoom('12h')}
            >
              Night Shift (12h)
            </button>
          </div>
        </div>
      </div>

      {/* Critical Overlap Notice Banner (only when real conflicts exist) */}
      {conflicts.length > 0 && (
        <div className="planner-alert-banner">
          <TriangleAlert size={18} className="text-danger flex-shrink-0" />
          <div className="alert-banner-text">
            <strong>Path Conflict Alert on Section {conflicts[0].sectionName}:</strong>
            <span>
              {conflicts[0].description}. Recommended resolution: {conflicts[0].alternatives?.[0]?.label || 'Use non-clashing window'}.
            </span>
          </div>
          <button
            className="btn-danger-sm"
            onClick={() => {
              setSelectedSectionId(conflicts[0].sectionId);
              navigateTo('Conflicts');
            }}
          >
            Resolve Conflict
          </button>
        </div>
      )}

      {/* Full Interactive 24-Hour Gantt Chart */}
      <div className="planner-gantt-card">
        <div className="gantt-card-header">
          <div className="d-flex align-center gap-2">
            <Clock size={16} className="text-maroon" />
            <h3>Corridor Track Possessions: 26 August 2026</h3>
          </div>
          <span className="text-xs text-muted">
            Click any block to view telemetry, crew allocation, or report live delays
          </span>
        </div>

        <GanttTimeline filterDept={filterDept} />
      </div>

      {/* Quick Summary Cards below Gantt */}
      {blocks.length === 0 ? (
        <div style={{ padding: '16px 20px', background: 'var(--slate-900)', border: '1px solid var(--slate-800)', borderRadius: '10px', color: 'var(--slate-400)', fontSize: '13px', textAlign: 'center', fontStyle: 'italic', marginTop: '16px' }}>
          No active or scheduled possession blocks in this corridor. Create a request or approve an AI-optimized plan to schedule possessions.
        </div>
      ) : (
        <div className="planner-summary-grid">
          {blocks.map(b => (
            <div key={b.id} className="summary-box" onClick={() => setInspectingBlock(b)} style={{ cursor: 'pointer' }}>
              <div className={`summary-icon ${b.departments.includes('TRD') ? 'bg-amber-subtle text-amber' : b.departments.includes('S&T') ? 'bg-blue-subtle text-blue' : 'bg-maroon-subtle text-maroon'}`}>
                {b.departments.includes('TRD') ? <Zap size={18} /> : b.departments.includes('S&T') ? <Radio size={18} /> : <Wrench size={18} />}
              </div>
              <div>
                <span className="summary-title">{b.id} ({b.sectionId})</span>
                <p>{b.status}: {b.workSummary} ({b.scheduledStart}–{b.expectedEnd || b.scheduledEnd})</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Block Detail Modal if inspecting */}
      <BlockDetailModal />
    </div>
  );
};
