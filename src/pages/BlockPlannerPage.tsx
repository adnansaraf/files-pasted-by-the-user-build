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
  const { navigateTo, blocks, conflicts, setSelectedSectionId } = useApp();
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
          <span className="info-label">Active Operational Shift:</span>
          <strong>Shift 3 (Night Possessions 22:00–06:00 IST)</strong>
        </div>

        <div className="planner-filters">
          <div className="filter-group">
            <span className="filter-label">Filter Department:</span>
            <button
              className={`filter-btn-pill ${filterDept === '' ? 'active' : ''}`}
              onClick={() => setFilterDept('')}
            >
              All 4 Swimlanes
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

      {/* Critical Overlap Notice Banner */}
      <div className="planner-alert-banner">
        <TriangleAlert size={18} className="text-danger flex-shrink-0" />
        <div className="alert-banner-text">
          <strong>Path Conflict Alert on Section A–B (PGT–OTP):</strong>
          <span>
            Requested block (02:00–05:00) intersects 12617 Mangala Lakshadweep Superfast passage at 03:15.
            SolveX recommends advancing window to 01:00–04:00 (Option A) to preserve passenger punctuality.
          </span>
        </div>
        <button
          className="btn-danger-sm"
          onClick={() => {
            setSelectedSectionId('A-B');
            navigateTo('Conflicts');
          }}
        >
          Resolve Conflict
        </button>
      </div>

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
      <div className="planner-summary-grid">
        <div className="summary-box">
          <div className="summary-icon bg-maroon-subtle">
            <Wrench size={18} className="text-maroon" />
          </div>
          <div>
            <span className="summary-title">BLK-204 (PGT–OTP)</span>
            <p>Active: Track tamping + OHE catenary overhaul (Delay reported to 04:45)</p>
          </div>
        </div>

        <div className="summary-box">
          <div className="summary-icon bg-green-subtle">
            <CheckCircle2 size={18} className="text-success" />
          </div>
          <div>
            <span className="summary-title">BLK-205 (SRR–TIR)</span>
            <p>Active: 92% complete, Axle counter heads tested, line clearance in 15m</p>
          </div>
        </div>

        <div className="summary-box">
          <div className="summary-icon bg-blue-subtle">
            <Clock size={18} className="text-blue" />
          </div>
          <div>
            <span className="summary-title">BLK-206 (OTP–SRR)</span>
            <p>Planned: 05:00–07:00 Rail weld renewal at km 562/14 following USFD flaw</p>
          </div>
        </div>
      </div>

      {/* Block Detail Modal if inspecting */}
      <BlockDetailModal />
    </div>
  );
};
