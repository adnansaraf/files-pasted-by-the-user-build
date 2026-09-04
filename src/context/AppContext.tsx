import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import {
  RailwaySection,
  MaintenanceRequest,
  MaintenanceBlock,
  OperationalConflict,
  OptimizationPlan,
  OverrunScenario,
  WhatIfScenarioState,
  Department,
  PriorityLevel
} from '../types';
import {
  SECTIONS,
  INITIAL_REQUESTS,
  INITIAL_BLOCKS,
  INITIAL_CONFLICTS,
  INITIAL_OPTIMIZATION_PLAN,
  OVERRUN_SCENARIO_DATA,
  TRAIN_MOVEMENTS
} from '../data/mockData';

export type PageName =
  | 'Overview'
  | 'Maintenance Requests'
  | 'Block Planner'
  | 'AI Optimizer'
  | 'Railway Network'
  | 'Conflicts'
  | 'Active Blocks'
  | 'What-if Simulator'
  | 'Dynamic Rescheduling'
  | 'Reports & Analytics'
  | 'Plan Review'
  | 'Settings';

export interface AppNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'critical' | 'warning' | 'info' | 'success';
}

export interface EngineSettings {
  weightSafety: number;
  weightAssetCriticality: number;
  weightUrgency: number;
  weightTrainPunctuality: number;
  weightTrackDowntime: number;
  allowSimultaneousTrackAndOHE: boolean;
  allowSimultaneousTrackAndSignalling: boolean;
  minHeadwayMinutes: number;
  simulatedTMSConnected: boolean;
  simulatedCOAConnected: boolean;
  simulatedSMMSConnected: boolean;
}

interface AppContextType {
  isLoggedIn: boolean;
  login: (id: string) => void;
  logout: () => void;
  currentPage: PageName;
  navigateTo: (page: PageName) => void;
  selectedSectionId: string;
  setSelectedSectionId: (id: string) => void;
  selectedSection: RailwaySection;
  
  // Data entities
  sections: RailwaySection[];
  requests: MaintenanceRequest[];
  blocks: MaintenanceBlock[];
  conflicts: OperationalConflict[];
  optimizationPlan: OptimizationPlan;
  overrunScenario: OverrunScenario;
  notifications: AppNotification[];
  settings: EngineSettings;
  
  // Selected Block Modal
  inspectingBlock: MaintenanceBlock | null;
  setInspectingBlock: (b: MaintenanceBlock | null) => void;
  
  // Selected Conflict Modal
  inspectingConflict: OperationalConflict | null;
  setInspectingConflict: (c: OperationalConflict | null) => void;

  // New Request Modal
  isNewRequestModalOpen: boolean;
  setIsNewRequestModalOpen: (open: boolean) => void;
  
  // Actions
  addRequest: (req: {
    dept: Department;
    sectionId: string;
    workType: string;
    description: string;
    requestedDuration: number;
    preferredTimeWindow: string;
    priority: PriorityLevel;
    deadline: string;
    constraints: string;
    resources: string;
  }) => void;
  
  reportDelay: (blockId: string, extraMinutes: number, reason: string) => void;
  markBlockComplete: (blockId: string) => void;
  applyRescheduleOption: (optionId: string) => void;
  
  isOptimizing: boolean;
  runOptimizer: () => Promise<void>;
  approvePlan: () => void;
  rejectPlan: () => void;
  
  whatIfState: WhatIfScenarioState;
  setWhatIfState: React.Dispatch<React.SetStateAction<WhatIfScenarioState>>;
  whatIfResults: {
    blockHours: number;
    jobsCompleted: number;
    conflicts: number;
    trainImpactMin: number;
    assetDowntimeHours: number;
    assetAvailabilityPercent: number;
  };
  
  updateSettings: (newSettings: Partial<EngineSettings>) => void;
  resetAllDemoData: () => void;
  
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  division: string;
  setDivision: (d: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageName>('Overview');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('A-B');
  const [division, setDivision] = useState<string>('Palakkad (PGT) · Southern Railway');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [sections, setSections] = useState<RailwaySection[]>(SECTIONS);
  const [requests, setRequests] = useState<MaintenanceRequest[]>(INITIAL_REQUESTS);
  const [blocks, setBlocks] = useState<MaintenanceBlock[]>(INITIAL_BLOCKS);
  const [conflicts, setConflicts] = useState<OperationalConflict[]>(INITIAL_CONFLICTS);
  const [optimizationPlan, setOptimizationPlan] = useState<OptimizationPlan>(INITIAL_OPTIMIZATION_PLAN);
  const [overrunScenario, setOverrunScenario] = useState<OverrunScenario>(OVERRUN_SCENARIO_DATA);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const [inspectingBlock, setInspectingBlock] = useState<MaintenanceBlock | null>(null);
  const [inspectingConflict, setInspectingConflict] = useState<OperationalConflict | null>(null);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'N-1',
      title: 'Active Block Overrun Alert',
      desc: 'BLK-204 on PGT–OTP reported expected finish delayed to 04:45 (+45m)',
      time: '12 min ago',
      type: 'critical'
    },
    {
      id: 'N-2',
      title: 'Critical Conflict Detected',
      desc: '12617 Mangala Exp overlaps requested maintenance on Section A–B at 03:15',
      time: '24 min ago',
      type: 'critical'
    },
    {
      id: 'N-3',
      title: 'AI Multi-Department Coordination Ready',
      desc: 'SolveX identified joint block opportunity for Engg + TRD + S&T on PGT–OTP',
      time: '35 min ago',
      type: 'info'
    },
    {
      id: 'N-4',
      title: 'Near Completion',
      desc: 'BLK-205 on SRR–TIR reached 92% completion. Track handover imminent.',
      time: '45 min ago',
      type: 'success'
    }
  ]);

  const [settings, setSettings] = useState<EngineSettings>({
    weightSafety: 35,
    weightAssetCriticality: 25,
    weightUrgency: 20,
    weightTrainPunctuality: 15,
    weightTrackDowntime: 5,
    allowSimultaneousTrackAndOHE: true,
    allowSimultaneousTrackAndSignalling: true,
    minHeadwayMinutes: 15,
    simulatedTMSConnected: true,
    simulatedCOAConnected: true,
    simulatedSMMSConnected: true
  });

  const [whatIfState, setWhatIfState] = useState<WhatIfScenarioState>({
    sectionId: 'A-B',
    blockStart: '02:00',
    durationHours: 3.0,
    priority: 'High',
    trainCondition: 'Normal Schedule',
    coordinatedJobsCount: 3
  });

  const selectedSection = useMemo(() => {
    return sections.find(s => s.id === selectedSectionId) || sections[0];
  }, [sections, selectedSectionId]);

  // Dynamic What-if calculations
  const whatIfResults = useMemo(() => {
    const dur = whatIfState.durationHours;
    const prio = whatIfState.priority;
    const cond = whatIfState.trainCondition;
    
    let baseDelay = 14;
    if (dur > 3.0) baseDelay += (dur - 3.0) * 16;
    if (dur < 3.0) baseDelay -= (3.0 - dur) * 6;
    if (prio === 'Critical') baseDelay = Math.max(5, baseDelay - 4);
    if (cond === 'Delayed Express 12617') baseDelay += 18;
    if (cond === 'Heavy Freight Congestion') baseDelay += 12;
    if (cond === 'Monsoon Speed Restriction') baseDelay += 8;

    const conflictsCount = dur > 4.0 ? 3 : dur > 3.0 ? 2 : 1;
    const avail = Math.max(82, Math.round(94 - (dur > 3 ? (dur - 3) * 3 : 0)));

    return {
      blockHours: Number(dur.toFixed(1)),
      jobsCompleted: whatIfState.coordinatedJobsCount,
      conflicts: conflictsCount,
      trainImpactMin: Math.round(baseDelay),
      assetDowntimeHours: Number(dur.toFixed(1)),
      assetAvailabilityPercent: avail
    };
  }, [whatIfState]);

  const addRequest = (newReqData: {
    dept: Department;
    sectionId: string;
    workType: string;
    description: string;
    requestedDuration: number;
    preferredTimeWindow: string;
    priority: PriorityLevel;
    deadline: string;
    constraints: string;
    resources: string;
  }) => {
    const sec = sections.find(s => s.id === newReqData.sectionId);
    const secName = sec ? `${sec.fromCode}–${sec.toCode} (${sec.fromName}–${sec.toName})` : newReqData.sectionId;
    
    // Simulate historical samples with variance
    const variance = [
      Number((newReqData.requestedDuration * (0.95 + Math.random() * 0.15)).toFixed(1)),
      Number((newReqData.requestedDuration * (1.0 + Math.random() * 0.2)).toFixed(1)),
      Number((newReqData.requestedDuration * (1.05 + Math.random() * 0.25)).toFixed(1)),
      Number((newReqData.requestedDuration * (1.02 + Math.random() * 0.18)).toFixed(1)),
      Number((newReqData.requestedDuration * (1.08 + Math.random() * 0.22)).toFixed(1))
    ];
    const avgHistorical = Number((variance.reduce((a, b) => a + b, 0) / variance.length).toFixed(1));

    let prioScore = 70;
    if (newReqData.priority === 'Critical') prioScore = 93;
    else if (newReqData.priority === 'High') prioScore = 84;
    else if (newReqData.priority === 'Medium') prioScore = 65;
    else prioScore = 48;

    const newId = `REQ-${1024 + requests.length}`;
    const newReq: MaintenanceRequest = {
      id: newId,
      dept: newReqData.dept,
      sectionId: newReqData.sectionId,
      sectionName: secName,
      workType: newReqData.workType,
      description: newReqData.description,
      requestedDuration: newReqData.requestedDuration,
      predictedDuration: avgHistorical,
      historicalSamples: variance,
      preferredTimeWindow: newReqData.preferredTimeWindow,
      priority: newReqData.priority,
      priorityScore: prioScore,
      factors: {
        safetyImpact: Math.round(prioScore * 0.3),
        assetCriticality: Math.round(prioScore * 0.25),
        urgency: Math.round(prioScore * 0.2),
        failureProbability: Math.round(prioScore * 0.15),
        operationalImpact: Math.round(prioScore * 0.1)
      },
      deadline: newReqData.deadline,
      constraints: newReqData.constraints,
      resources: newReqData.resources,
      status: 'Pending',
      submissionDate: 'Just now'
    };

    setRequests(prev => [newReq, ...prev]);
    setNotifications(prev => [
      {
        id: `N-${Date.now()}`,
        title: `New Maintenance Request (${newId})`,
        desc: `${newReq.dept} requested ${newReq.workType} on ${secName}`,
        time: 'Just now',
        type: 'info'
      },
      ...prev
    ]);
  };

  const reportDelay = (blockId: string, extraMinutes: number, reason: string) => {
    setBlocks(prev =>
      prev.map(b => {
        if (b.id === blockId) {
          return {
            ...b,
            status: 'Delayed',
            expectedEnd: '04:45',
            notes: reason
          };
        }
        return b;
      })
    );

    setOverrunScenario(prev => ({
      ...prev,
      delayMinutes: extraMinutes,
      reason
    }));

    setNotifications(prev => [
      {
        id: `N-${Date.now()}`,
        title: `CRITICAL: Block ${blockId} Overrun`,
        desc: `Maintenance delayed by +${extraMinutes}m on ${selectedSection.fromCode}–${selectedSection.toCode}. Dynamic rescheduling required.`,
        time: 'Just now',
        type: 'critical'
      },
      ...prev
    ]);

    setCurrentPage('Dynamic Rescheduling');
  };

  const markBlockComplete = (blockId: string) => {
    setBlocks(prev =>
      prev.map(b => (b.id === blockId ? { ...b, status: 'Completed', progressPercent: 100 } : b))
    );
    setNotifications(prev => [
      {
        id: `N-${Date.now()}`,
        title: `Block ${blockId} Cleared`,
        desc: `Track possession released. Normal signaling & traction restored.`,
        time: 'Just now',
        type: 'success'
      },
      ...prev
    ]);
  };

  const applyRescheduleOption = (optionId: string) => {
    const selectedOpt = overrunScenario.options.find(o => o.id === optionId);
    if (!selectedOpt) return;

    setBlocks(prev =>
      prev.map(b => {
        if (b.id === overrunScenario.blockId) {
          return {
            ...b,
            status: 'Active',
            expectedEnd: optionId === 'OPT-EXTEND' ? '04:45' : '04:25',
            notes: `Rescheduled using ${selectedOpt.title}`
          };
        }
        return b;
      })
    );

    setNotifications(prev => [
      {
        id: `N-${Date.now()}`,
        title: `Dynamic Rescheduling Applied`,
        desc: `${selectedOpt.title} executed. Sectional controllers and station masters alerted.`,
        time: 'Just now',
        type: 'success'
      },
      ...prev
    ]);

    setCurrentPage('Active Blocks');
  };

  const runOptimizer = async () => {
    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 900));
    setOptimizationPlan(prev => ({
      ...prev,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      overallScore: 88,
      approvalStatus: 'Pending Review'
    }));
    setIsOptimizing(false);
  };

  const approvePlan = () => {
    setOptimizationPlan(prev => ({
      ...prev,
      approvalStatus: 'Approved',
      approvedBy: 'Adnan Saraf (Sr. DOM / PGT)',
      approvedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
    }));

    // Update requests to planned/scheduled
    setRequests(prev =>
      prev.map(r =>
        ['REQ-1024', 'REQ-1025', 'REQ-1026'].includes(r.id) ? { ...r, status: 'Planned' } : r
      )
    );

    setNotifications(prev => [
      {
        id: `N-${Date.now()}`,
        title: `Optimization Plan Approved`,
        desc: `Plan OPT-PGT-308 on A–B (PGT–OTP) signed off by Planner. Integrated into 24h schedule.`,
        time: 'Just now',
        type: 'success'
      },
      ...prev
    ]);
  };

  const rejectPlan = () => {
    setOptimizationPlan(prev => ({
      ...prev,
      approvalStatus: 'Rejected'
    }));
    setNotifications(prev => [
      {
        id: `N-${Date.now()}`,
        title: `Optimization Plan Rejected`,
        desc: `Plan OPT-PGT-308 returned to draft for planner adjustments.`,
        time: 'Just now',
        type: 'warning'
      },
      ...prev
    ]);
  };

  const updateSettings = (newSettings: Partial<EngineSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetAllDemoData = () => {
    setSections(SECTIONS);
    setRequests(INITIAL_REQUESTS);
    setBlocks(INITIAL_BLOCKS);
    setConflicts(INITIAL_CONFLICTS);
    setOptimizationPlan(INITIAL_OPTIMIZATION_PLAN);
    setOverrunScenario(OVERRUN_SCENARIO_DATA);
    setSelectedSectionId('A-B');
    setNotifications([
      {
        id: `N-${Date.now()}`,
        title: 'Demo State Reset',
        desc: 'All operational blocks, requests, and conflicts reloaded to standard Palakkad Division state.',
        time: 'Just now',
        type: 'info'
      }
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        login: () => setIsLoggedIn(true),
        logout: () => setIsLoggedIn(false),
        currentPage,
        navigateTo: setCurrentPage,
        selectedSectionId,
        setSelectedSectionId,
        selectedSection,
        sections,
        requests,
        blocks,
        conflicts,
        optimizationPlan,
        overrunScenario,
        notifications,
        settings,
        inspectingBlock,
        setInspectingBlock,
        inspectingConflict,
        setInspectingConflict,
        isNewRequestModalOpen,
        setIsNewRequestModalOpen,
        addRequest,
        reportDelay,
        markBlockComplete,
        applyRescheduleOption,
        isOptimizing,
        runOptimizer,
        approvePlan,
        rejectPlan,
        whatIfState,
        setWhatIfState,
        whatIfResults,
        updateSettings,
        resetAllDemoData,
        searchQuery,
        setSearchQuery,
        division,
        setDivision
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
