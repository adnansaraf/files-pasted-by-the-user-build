export type Department = 'Engineering' | 'TRD' | 'S&T' | 'Operating';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type RequestStatus = 'Pending' | 'Planned' | 'Under Review' | 'Approved' | 'Rejected';

export type BlockStatus = 'Planned' | 'Active' | 'Delayed' | 'Completed' | 'Cancelled';

export type SectionStatus = 'Available' | 'Maintenance Planned' | 'Active Block' | 'Conflict' | 'Speed Restriction';

export type ConflictSeverity = 'Critical' | 'High' | 'Medium' | 'Resolved';

export interface RailwayStation {
  code: string;
  name: string;
  letter: string; // A, B, C, D, E, F
  km: number;
  junction: boolean;
  x: number;
  y: number;
  sectionId?: string;
  isIntermediate?: boolean;
}

export interface RailwaySection {
  id: string; // e.g. 'C-D' or 'SRR-TIR'
  fromCode: string;
  toCode: string;
  fromName: string;
  toName: string;
  lengthKm: number;
  tracks: 'Double Line' | 'Single Line' | 'Multiple';
  traction: '25 kV AC Electrified' | 'Non-Electrified';
  mps: number; // km/h
  status: SectionStatus;
  activeBlockId?: string;
  plannedBlockIds?: string[];
  currentSpeedRestriction?: string;
  divisionId?: string;
  intermediateStationIds?: string[];
  workZoneIds?: string[];
}

export interface RailwayDivision {
  id: string;
  name: string;
  code: string;
  zone: string;
  routeKm: number;
  hq: string;
  isPopulatedDemo: boolean;
  sectionsCount: number;
  activeBlocksCount: number;
  pendingRequestsCount: number;
}

export interface SectionStationNode {
  id: string;
  code: string;
  name: string;
  km: number;
  junction: boolean;
  sectionId: string;
  nodeType: 'Junction Station' | 'Terminal Station' | 'Intermediate Station' | 'Station Node';
}

export interface WorkZoneTask {
  id: string;
  dept: Department;
  workType: string;
  durationMin: number;
  description: string;
  priority: PriorityLevel;
  resources: string;
}

export interface WorkZoneAlternativeWindow {
  id: string;
  window: string;
  durationMin: number;
  operationalImpact: 'Low' | 'Medium' | 'High';
  conflicts: number;
  isRecommended?: boolean;
  reason: string;
}

export interface WorkZoneOptimization {
  compatibleTasksCount: number;
  combinedBlockDurationMin: number;
  recommendedWindow: string;
  operationalImpact: 'Low' | 'Medium' | 'High';
  conflictsAvoided: number;
  timeSavedMin: number;
  synergyScore: number;
  explanation: string;
  alternativeWindows: WorkZoneAlternativeWindow[];
  approvalStatus: 'Pending Review' | 'Approved by Officer' | 'Dispatched to Control';
  approvedBy?: string;
  approvedAt?: string;
}

export interface MaintenanceWorkZone {
  id: string;
  sectionId: string;
  sectionName: string;
  startStationCode: string;
  startStationName: string;
  endStationCode: string;
  endStationName: string;
  line: 'UP Line' | 'DN Line' | 'Both Lines';
  chainage: string; // e.g. 'km 598/200 – km 601/400'
  status: 'Scheduled' | 'Active' | 'Pending' | 'Operational Conflict' | 'Available';
  criticality: PriorityLevel;
  workSummary: string;
  departments: Department[];
  estimatedDurationMin: number;
  preferredWindow: string;
  affectedTrains: {
    trainNo: string;
    trainName: string;
    category: string;
    scheduledPassage: string;
    impact: string;
  }[];
  conflictStatus: 'No Conflict' | 'Operational Conflict' | 'Potential Conflict';
  conflictDetail?: string;
  tasks: WorkZoneTask[];
  optimization: WorkZoneOptimization;
}

export interface MaintenanceRequest {
  id: string;
  dept: Department;
  sectionId: string;
  sectionName: string;
  workType: string;
  description: string;
  requestedDuration: number; // hours
  predictedDuration: number; // hours based on simulated historical variance
  historicalSamples: number[]; // e.g. [2.8, 3.1, 3.2, 3.0]
  preferredTimeWindow: string; // '02:00–05:00'
  priority: PriorityLevel;
  priorityScore: number; // 0-100
  factors: {
    safetyImpact: number;
    assetCriticality: number;
    urgency: number;
    failureProbability: number;
    operationalImpact: number;
  };
  deadline: string;
  constraints: string;
  resources: string;
  status: RequestStatus;
  coordinatedWith?: string[];
  submissionDate: string;
}

export interface TrainMovement {
  trainNo: string;
  trainName: string;
  category: 'Vande Bharat' | 'Superfast Express' | 'Mail/Express' | 'Freight' | 'MEMU Passenger';
  sectionId: string;
  entryTime: string; // '03:15'
  exitTime: string;  // '03:42'
  priority: number; // 1 = highest
  allowedDelayMin: number;
}

export interface MaintenanceBlock {
  id: string;
  sectionId: string;
  sectionName: string;
  departments: Department[];
  requestIds: string[];
  workSummary: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  expectedEnd: string;
  durationHours: number;
  progressPercent: number;
  status: BlockStatus;
  priority: PriorityLevel;
  affectedTrains: string[];
  crewAssigned: string;
  overheadPowerCutRequired: boolean;
  speedRestrictionImposed?: string;
  notes?: string;
}

export interface OperationalConflict {
  id: string;
  severity: ConflictSeverity;
  sectionId: string;
  sectionName: string;
  blockTime: string;
  conflictingTrain: TrainMovement;
  description: string;
  conflictPointTime: string;
  impactScore: number;
  status: 'Unresolved' | 'Resolved';
  alternatives: {
    optionId: string;
    label: string;
    window: string;
    trainImpact: string;
    trainDelayMin: number;
    isRecommended?: boolean;
    reason: string;
  }[];
}

export interface OptimizationAlternative {
  id: string;
  name: string;
  score: number;
  timeWindow: string;
  sectionId: string;
  duration: number;
  jobsCoordinated: number;
  conflictsCount: number;
  trainDelayMin: number;
  assetDowntimeHours: number;
  status: 'Recommended' | 'Alternative';
  tradeoffs: string[];
}

export interface OptimizationPlan {
  id: string;
  timestamp: string;
  targetSection: string;
  recommendedWindow: string;
  departments: Department[];
  coordinatedRequestIds: string[];
  overallScore: number;
  reasons: string[];
  scoreBreakdown: {
    safetyAndPriority: number;
    corridorSynergy: number;
    trainPunctualityImpact: number;
    assetAvailabilityScore: number;
  };
  metrics: {
    totalBlockHours: number;
    jobsCompleted: number;
    conflictsRemaining: number;
    estimatedTrainImpactMin: number;
    blockUtilization: number;
    assetDowntime: number;
  };
  alternatives: OptimizationAlternative[];
  approvalStatus: 'Pending Review' | 'Approved' | 'Modified' | 'Rejected';
  approvedBy?: string;
  approvedAt?: string;
}

export interface OverrunScenario {
  blockId: string;
  sectionId: string;
  plannedEnd: string;
  expectedEnd: string;
  delayMinutes: number;
  reason: string;
  options: {
    id: string;
    title: string;
    description: string;
    trainImpactMin: number;
    maintenanceImpact: string;
    conflicts: number;
    assetAvailability: number;
    isRecommended: boolean;
    reasoning: string;
  }[];
}

export interface WhatIfScenarioState {
  sectionId: string;
  blockStart: string;
  durationHours: number;
  priority: PriorityLevel;
  trainCondition: 'Normal Schedule' | 'Delayed Express 12617' | 'Heavy Freight Congestion' | 'Monsoon Speed Restriction';
  coordinatedJobsCount: number;
}
