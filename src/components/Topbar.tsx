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
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Topbar: React.FC = () => {
  const {
    division,
    setDivision,
    notifications,
    searchQuery,
    setSearchQuery,
    setIsNewRequestModalOpen,
    navigateTo,
    setSelectedSectionId
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
      {/* Division Selector */}
      <div className="division-selector-container">
        <button
          className="division-btn"
          onClick={() => setShowDivisionMenu(!showDivisionMenu)}
        >
          <MapPin size={16} className="text-maroon" />
          <span className="division-name">{division}</span>
          <ChevronDown size={14} />
        </button>

        {showDivisionMenu && (
          <div className="division-dropdown">
            <div className="dropdown-header">Select Operational Division</div>
            <button
              className="dropdown-item active"
              onClick={() => {
                setDivision('Palakkad (PGT) · Southern Railway');
                setShowDivisionMenu(false);
              }}
            >
              <strong>Palakkad (PGT)</strong>
              <small>Southern Railway · 588 Route km</small>
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                setDivision('Thiruvananthapuram (TVC) · Southern Railway');
                setShowDivisionMenu(false);
              }}
            >
              <strong>Thiruvananthapuram (TVC)</strong>
              <small>Southern Railway · 625 Route km</small>
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                setDivision('Madurai (MDU) · Southern Railway');
                setShowDivisionMenu(false);
              }}
            >
              <strong>Madurai (MDU)</strong>
              <small>Southern Railway · 1,356 Route km</small>
            </button>
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

      {/* Search Input */}
      <div className="topbar-search">
        <Search size={15} className="search-icon" />
        <input
          type="text"
          placeholder="Search sections (A-B, SRR), trains (12617), requests..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
            <X size={13} />
          </button>
        )}
      </div>

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
    </header>
  );
};
