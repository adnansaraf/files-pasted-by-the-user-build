import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  CalendarRange,
  Sparkles,
  Network,
  TriangleAlert,
  Activity,
  SlidersHorizontal,
  RotateCcw,
  BarChart3,
  FileCheck,
  Settings,
  HelpCircle,
  Train,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useApp, PageName } from '../context/AppContext';

interface NavItem {
  name: PageName;
  icon: React.ElementType;
  badge?: string | number;
  badgeType?: 'danger' | 'warning' | 'info' | 'primary';
}

export const Sidebar: React.FC = () => {
  const { currentPage, navigateTo, conflicts, blocks, requests, overrunScenario, optimizationPlan } = useApp();

  const unresolvedConflicts = conflicts.filter(c => c.status === 'Unresolved').length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const hasDelayedBlock = blocks.some(b => b.status === 'Delayed');

  const navItems: NavItem[] = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Maintenance Requests', icon: ClipboardList, badge: pendingRequests, badgeType: 'warning' },
    { name: 'Block Planner', icon: CalendarRange },
    { name: 'AI Optimizer', icon: Sparkles, badge: 'AI', badgeType: 'primary' },
    { name: 'Railway Network', icon: Network },
    { name: 'Conflicts', icon: TriangleAlert, badge: unresolvedConflicts, badgeType: 'danger' },
    { name: 'Active Blocks', icon: Activity, badge: blocks.length, badgeType: 'info' },
    { name: 'What-if Simulator', icon: SlidersHorizontal },
    {
      name: 'Dynamic Rescheduling',
      icon: RotateCcw,
      badge: hasDelayedBlock ? 'Overrun' : undefined,
      badgeType: hasDelayedBlock ? 'danger' : undefined
    },
    { name: 'Reports & Analytics', icon: BarChart3 },
    {
      name: 'Plan Review',
      icon: FileCheck,
      badge: optimizationPlan.approvalStatus === 'Approved' ? 'Signed' : 'Review',
      badgeType: optimizationPlan.approvalStatus === 'Approved' ? 'primary' : 'warning'
    }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand" onClick={() => navigateTo('Overview')}>
        <div className="brand-icon-box">
          <Train className="brand-train-icon" size={22} />
        </div>
        <div className="brand-text">
          <div className="brand-title">
            SOLVEX <span className="brand-tag">PROTOTYPE</span>
          </div>
          <div className="brand-subtitle">Palakkad Block Planning Desk</div>
        </div>
      </div>

      <div className="sidebar-role-badge">
        <Shield size={12} />
        <span>AUTHORIZED RAILWAY PLANNER DESK</span>
      </div>

      {/* Navigation list */}
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.name;
          return (
            <button
              key={item.name}
              className={`nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => navigateTo(item.name)}
              title={item.name}
            >
              <span className="nav-icon-wrapper">
                <Icon size={18} />
              </span>
              <span className="nav-label">{item.name}</span>
              {item.badge !== undefined && (
                <span className={`nav-badge badge-${item.badgeType || 'info'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom links and User Profile */}
      <div className="sidebar-bottom">
        <button
          className={`nav-btn ${currentPage === 'Settings' ? 'active' : ''}`}
          onClick={() => navigateTo('Settings')}
        >
          <span className="nav-icon-wrapper">
            <Settings size={17} />
          </span>
          <span className="nav-label">Settings & Weights</span>
        </button>

        <a
          href="#help"
          className="nav-btn"
          onClick={e => {
            e.preventDefault();
            alert('SolveX Decision Support Platform — SIH 2026 Problem Statement 26027. Palakkad Division (PGT) Prototype.');
          }}
        >
          <span className="nav-icon-wrapper">
            <HelpCircle size={17} />
          </span>
          <span className="nav-label">Help & Protocol Docs</span>
        </a>

        <div className="user-profile-card">
          <div className="user-avatar">AS</div>
          <div className="user-info">
            <div className="user-name">Adnan Saraf</div>
            <div className="user-designation">Sr. DOM / Planning (PGT)</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
