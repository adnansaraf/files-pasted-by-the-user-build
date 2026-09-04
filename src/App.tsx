import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { RequestModal } from './components/RequestModal';
import { BlockDetailModal } from './components/BlockDetailModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { OverviewPage } from './pages/OverviewPage';
import { RequestsPage } from './pages/RequestsPage';
import { BlockPlannerPage } from './pages/BlockPlannerPage';
import { OptimizerPage } from './pages/OptimizerPage';
import { ConflictsPage } from './pages/ConflictsPage';
import { ActiveBlocksPage } from './pages/ActiveBlocksPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { ReschedulingPage } from './pages/ReschedulingPage';
import { NetworkPage } from './pages/NetworkPage';
import { ReportsPage } from './pages/ReportsPage';
import { PlanReviewPage } from './pages/PlanReviewPage';
import { SettingsPage } from './pages/SettingsPage';

export const AppContent: React.FC = () => {
  const { isLoggedIn, currentPage } = useApp();

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'Overview':
        return <OverviewPage />;
      case 'Maintenance Requests':
        return <RequestsPage />;
      case 'Block Planner':
        return <BlockPlannerPage />;
      case 'AI Optimizer':
        return <OptimizerPage />;
      case 'Railway Network':
        return <NetworkPage />;
      case 'Conflicts':
        return <ConflictsPage />;
      case 'Active Blocks':
        return <ActiveBlocksPage />;
      case 'What-if Simulator':
        return <SimulatorPage />;
      case 'Dynamic Rescheduling':
        return <ReschedulingPage />;
      case 'Reports & Analytics':
        return <ReportsPage />;
      case 'Plan Review':
        return <PlanReviewPage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="solvex-desktop-app">
      <Sidebar />
      <div className="main-viewport">
        <Topbar />
        <main className="content-scrollable">
          {renderPage()}
        </main>
      </div>
      <RequestModal />
      <BlockDetailModal />
    </div>
  );
};
