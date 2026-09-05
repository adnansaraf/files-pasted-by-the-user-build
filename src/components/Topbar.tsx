import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Search,
  Bell,
  ChevronDown,
  X,
  Plus,
  AlertTriangle,
  Info,
  CheckCircle,
  Database,
  Radio,
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TestRunModal } from './TestRunModal';

export const Topbar: React.FC = () => {
  const {
    selectedDivisionId,
    setSelectedDivisionId,
    selectedDivision,
    divisions,
    notifications,
    searchQuery,
    setSearchQuery,
    searchResults,
    handleSelectSearchResult,
    setIsNewRequestModalOpen,
    isTestRunModalOpen,
    setIsTestRunModalOpen,
    navigateTo,
    currentPage
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDivisionMenu, setShowDivisionMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setCurrentTime(now.toLocaleString('en-IN', options) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.length;

  return (
    <header className="topbar">
      {/* SolveX Brand & Division Indicator in Header */}
      <div className="topbar-branding-cluster">
        <div className="topbar-brand-title">
          <span className="brand-primary-name">SolveX</span>
          <span className="brand-descriptor">AI-Powered Railway Maintenance Block Planning</span>
        </div>
      </div>

      {/* Division Selector */}
      <div className="division-selector-container">
        <button
          className="division-btn"
          onClick={() => setShowDivisionMenu(!showDivisionMenu)}
          title="Switch Railway Division"
        >
          <MapPin size={15} className="text-maroon" />
          <span className="division-name">{selectedDivision.name}</span>
          <ChevronDown size={14} />
        </button>

        {showDivisionMenu && (
          <div className="division-dropdown">
            <div className="dropdown-header">Select Operational Railway Division</div>
            {divisions.map(div => {
              const isActive = selectedDivisionId === div.id;
              return (
                <button
                  key={div.id}
                  className={`dropdown-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedDivisionId(div.id);
                    setShowDivisionMenu(false);
                  }}
                >
                  <div className="d-flex justify-between align-center">
                    <strong>{div.name} ({div.code})</strong>
                    {div.isPopulatedDemo && <span className="demo-chip-active">Main Demo</span>}
                  </div>
                  <small>{div.zone} · {div.routeKm} Route km</small>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Live Operational Clock */}
      <div className="operational-clock">
        <Clock size={15} className="text-muted" />
        <span className="clock-text">{currentTime || 'Wed, 26 Aug 2026 · 01:42:00 IST'}</span>
      </div>

      {/* Simulated Layer Status */}
      <div className="simulated-pill" title="Simulated data integration representing TMS, SMMS, TDMS, COA feeds">
        <Radio size={12} className="live-pulse" />
        <span>SIMULATED FEED: TMS / COA / SMMS</span>
      </div>

      {/* Search Input with Hierarchical Autocomplete */}
      <div className="topbar-search-wrapper">
        <div className="topbar-search">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search stations (PTB, Tirur), sections (SRR-TIR), trains (12617)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Hierarchical Search Results Dropdown */}
        {searchQuery.trim().length >= 2 && (
          <div className="search-results-popover">
            <div className="search-results-header">
              <span>Matching Hierarchy Entities ({searchResults.length})</span>
              <small>Click to drill down directly</small>
            </div>
            {searchResults.length > 0 ? (
              <div className="search-results-list">
                {searchResults.map(item => (
                  <div
                    key={item.id}
                    className="search-result-row"
                    onClick={() => {
                      handleSelectSearchResult(item);
                      if (currentPage !== 'Railway Network' && currentPage !== 'Overview') {
                        navigateTo('Railway Network');
                      }
                    }}
                  >
                    <span className={`search-badge badge-type-${item.type.toLowerCase().replace(/ /g, '-')}`}>
                      {item.type}
                    </span>
                    <div className="search-result-info">
                      <div className="search-result-title">{item.title}</div>
                      <div className="search-result-sub">{item.subtitle}</div>
                    </div>
                    <span className="search-hint">{item.actionHint} →</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="search-no-results">
                No matching stations, sections, work zones, or trains found for "{searchQuery}".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action: 2-Day Test Run */}
      <button
        className="btn-accent-sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '6px 14px',
          borderRadius: '4px',
          fontWeight: 600,
          fontSize: '13px',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(2,132,199,0.25)'
        }}
        onClick={() => setIsTestRunModalOpen(true)}
        title="Launch Realistic 2-Day Test Run (2026-09-05/06 Timetable Feed)"
      >
        <Play size={13} fill="#ffffff" />
        <span>2-Day Test Run</span>
      </button>

      {/* Action: New Request */}
      <button
        className="btn-primary-sm"
        onClick={() => setIsNewRequestModalOpen(true)}
      >
        <Plus size={15} />
        <span>New Request</span>
      </button>

      {/* Notification Bell */}
      <div className="notification-container">
        <button
          className="notification-btn"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={18} />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>

        {showNotifications && (
          <div className="notification-popover">
            <div className="popover-header">
              <h3>Operational Notifications</h3>
              <span className="badge-count">{notifications.length} alerts</span>
            </div>
            <div className="popover-list">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`notification-item type-${n.type}`}
                  onClick={() => {
                    setShowNotifications(false);
                    if (n.title.includes('Overrun')) navigateTo('Dynamic Rescheduling');
                    else if (n.title.includes('Conflict')) navigateTo('Conflicts');
                    else if (n.title.includes('Coordination')) navigateTo('AI Optimizer');
                    else navigateTo('Active Blocks');
                  }}
                >
                  <div className="notif-icon">
                    {n.type === 'critical' ? (
                      <AlertTriangle size={15} className="text-danger" />
                    ) : n.type === 'success' ? (
                      <CheckCircle size={15} className="text-success" />
                    ) : (
                      <Info size={15} className="text-info" />
                    )}
                  </div>
                  <div className="notif-content">
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-desc">{n.desc}</div>
                    <div className="notif-time">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="popover-footer">
              <button
                className="btn-link"
                onClick={() => {
                  setShowNotifications(false);
                  navigateTo('Conflicts');
                }}
              >
                View all operational conflicts →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Realistic 2-Day Timetable Test Run Modal */}
      {isTestRunModalOpen && (
        <TestRunModal
          isOpen={isTestRunModalOpen}
          onClose={() => setIsTestRunModalOpen(false)}
        />
      )}
    </header>
  );
};
