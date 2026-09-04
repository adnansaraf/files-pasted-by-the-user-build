import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  Wrench,
  Zap,
  Radio,
  Clock,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Department, MaintenanceRequest, PriorityLevel } from '../types';

export const RequestsPage: React.FC = () => {
  const {
    requests,
    setIsNewRequestModalOpen,
    setSelectedSectionId,
    navigateTo,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [activeRequestDetail, setActiveRequestDetail] = useState<MaintenanceRequest | null>(null);

  const totalCount = requests.length + 12; // Simulated total requests
  const pendingCount = requests.filter(r => r.status === 'Pending').length + 6;
  const highPriorityCount = requests.filter(r => r.priority === 'Critical' || r.priority === 'High').length;
  const scheduledCount = requests.filter(r => r.status === 'Planned' || r.status === 'Approved').length + 6;

  // Filter requests
  const filteredRequests = requests.filter(r => {
    const matchesDept = selectedDept === 'All' || r.dept === selectedDept;
    const matchesPriority = selectedPriority === 'All' || r.priority === selectedPriority;
    const matchesSearch =
      !searchQuery ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.workType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sectionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.dept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesPriority && matchesSearch;
  });

  const getDeptIcon = (dept: Department) => {
    switch (dept) {
      case 'Engineering':
        return <Wrench size={14} className="text-maroon" />;
      case 'TRD':
        return <Zap size={14} className="text-amber" />;
      case 'S&T':
        return <Radio size={14} className="text-blue" />;
      default:
        return <ClipboardList size={14} />;
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="page-badge">DEPARTMENTAL POSSESSION REGISTRATION</div>
          <h1 className="page-title">Maintenance Requests</h1>
          <p className="page-subtitle">
            Consolidated register of track, traction, and signaling maintenance applications
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setIsNewRequestModalOpen(true)}
        >
          <Plus size={16} />
          <span>+ New Maintenance Request</span>
        </button>
      </div>

      {/* Statistics Strip */}
      <div className="stat-strip">
        <div className="stat-box">
          <span className="stat-box-num">{totalCount}</span>
          <span className="stat-box-label">Total Requests</span>
        </div>
        <div className="stat-box">
          <span className="stat-box-num text-warning">{pendingCount}</span>
          <span className="stat-box-label">Pending Approval</span>
        </div>
        <div className="stat-box">
          <span className="stat-box-num text-danger">{highPriorityCount}</span>
          <span className="stat-box-label">Critical / High Priority</span>
        </div>
        <div className="stat-box">
          <span className="stat-box-num text-info">{scheduledCount}</span>
          <span className="stat-box-label">Scheduled in Blocks</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="table-filter-bar">
        <div className="dept-tabs">
          {['All', 'Engineering', 'TRD', 'S&T'].map(d => (
            <button
              key={d}
              className={`tab-btn ${selectedDept === d ? 'active' : ''}`}
              onClick={() => setSelectedDept(d)}
            >
              {d === 'Engineering' && <Wrench size={13} />}
              {d === 'TRD' && <Zap size={13} />}
              {d === 'S&T' && <Radio size={13} />}
              <span>{d}</span>
            </button>
          ))}
        </div>

        <div className="filter-right-group">
          <select
            className="filter-select"
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div className="search-box-compact">
            <Search size={14} className="text-muted" />
            <input
              type="text"
              placeholder="Filter requests..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Requests Table */}
      <div className="table-card">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Department</th>
              <th>Section (Palakkad Div)</th>
              <th>Work Type & Scope</th>
              <th>Duration (Req / Pred)</th>
              <th>Preferred Time</th>
              <th>Priority Score</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(r => (
              <tr
                key={r.id}
                className={activeRequestDetail?.id === r.id ? 'row-selected' : ''}
              >
                <td>
                  <strong className="text-monospace text-maroon">{r.id}</strong>
                </td>
                <td>
                  <div className="dept-cell">
                    {getDeptIcon(r.dept)}
                    <span>{r.dept}</span>
                  </div>
                </td>
                <td>
                  <button
                    className="section-clickable-btn"
                    onClick={() => {
                      setSelectedSectionId(r.sectionId);
                      navigateTo('Railway Network');
                    }}
                    title={`Inspect Section ${r.sectionId} on Schematic Network`}
                  >
                    {r.sectionName}
                  </button>
                </td>
                <td>
                  <div className="work-cell">
                    <strong className="work-type-text">{r.workType}</strong>
                    <span className="work-desc-text">{r.description}</span>
                  </div>
                </td>
                <td>
                  <div className="duration-cell" title={`Simulated Historical benchmark: ${r.historicalSamples.join('h, ')}h`}>
                    <strong>{r.requestedDuration}h</strong>
                    <span className="predicted-tag">
                      <Sparkles size={10} />
                      <span>{r.predictedDuration}h est</span>
                    </span>
                  </div>
                </td>
                <td>
                  <div className="time-badge">
                    <Clock size={12} className="text-muted" />
                    <span>{r.preferredTimeWindow}</span>
                  </div>
                </td>
                <td>
                  <div className="priority-cell">
                    <span className={`priority-tag priority-${r.priority.toLowerCase()}`}>
                      {r.priority}
                    </span>
                    <span className="score-text">{r.priorityScore}/100</span>
                  </div>
                </td>
                <td>
                  <span className={`status-pill status-${r.status.toLowerCase()}`}>
                    {r.status}
                  </span>
                </td>
                <td className="text-right">
                  <button
                    className="btn-link-sm"
                    onClick={() => setActiveRequestDetail(r)}
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inspect Drawer for Selected Request */}
      {activeRequestDetail && (
        <div className="inspect-drawer-panel">
          <div className="drawer-header">
            <div>
              <span className="drawer-sub">REQUEST DETAILS & HISTORICAL BENCHMARK</span>
              <h3>
                {activeRequestDetail.id}: {activeRequestDetail.workType}
              </h3>
            </div>
            <button
              className="drawer-close"
              onClick={() => setActiveRequestDetail(null)}
            >
              ×
            </button>
          </div>

          <div className="drawer-body">
            <div className="drawer-grid-two">
              <div>
                <span className="label">Department</span>
                <strong>{activeRequestDetail.dept}</strong>
              </div>
              <div>
                <span className="label">Section</span>
                <strong>{activeRequestDetail.sectionName}</strong>
              </div>
              <div>
                <span className="label">Requested Duration</span>
                <strong>{activeRequestDetail.requestedDuration} Hours</strong>
              </div>
              <div>
                <span className="label">Predicted Duration (AI Variance)</span>
                <strong className="text-maroon">{activeRequestDetail.predictedDuration} Hours</strong>
              </div>
              <div>
                <span className="label">Preferred Window</span>
                <strong>{activeRequestDetail.preferredTimeWindow}</strong>
              </div>
              <div>
                <span className="label">Operational Deadline</span>
                <strong>{activeRequestDetail.deadline}</strong>
              </div>
            </div>

            <div className="drawer-section-box">
              <h4>Historical Simulated Overrun Samples</h4>
              <p className="text-xs text-muted">
                Similar past jobs in Palakkad division under identical track and weather conditions:
              </p>
              <div className="sample-chips-row">
                {activeRequestDetail.historicalSamples.map((s, idx) => (
                  <div key={idx} className="sample-chip">
                    <span>Job #{idx + 1}:</span>
                    <strong>{s}h</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="drawer-section-box">
              <h4>Constraints & Resources</h4>
              <p className="text-sm"><strong>Constraints:</strong> {activeRequestDetail.constraints}</p>
              <p className="text-sm"><strong>Required Machinery:</strong> {activeRequestDetail.resources}</p>
            </div>

            <div className="drawer-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  setSelectedSectionId(activeRequestDetail.sectionId);
                  navigateTo('AI Optimizer');
                }}
              >
                <Sparkles size={14} />
                <span>Optimize Joint Block for this Request</span>
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setSelectedSectionId(activeRequestDetail.sectionId);
                  navigateTo('Block Planner');
                }}
              >
                Inspect in Gantt Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
