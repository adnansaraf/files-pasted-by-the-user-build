import {
  RailwayStation,
  RailwaySection,
  MaintenanceRequest,
  TrainMovement,
  MaintenanceBlock,
  OperationalConflict,
  OptimizationPlan,
  OverrunScenario
} from '../types';

export const STATIONS: RailwayStation[] = [
  { code: 'PGT', name: 'Palakkad Jn', letter: 'A', km: 0, junction: true, x: 120, y: 140 },
  { code: 'OTP', name: 'Ottappalam', letter: 'B', km: 33, junction: false, x: 290, y: 140 },
  { code: 'SRR', name: 'Shoranur Jn', letter: 'C', km: 46, junction: true, x: 450, y: 190 },
  { code: 'TIR', name: 'Tirur', letter: 'D', km: 91, junction: false, x: 620, y: 120 },
  { code: 'CLT', name: 'Kozhikode', letter: 'E', km: 131, junction: true, x: 780, y: 120 },
  { code: 'TCR', name: 'Thrissur', letter: 'F', km: 79, junction: true, x: 450, y: 310 },
  { code: 'POY', name: 'Pollachi Jn', letter: 'G', km: 54, junction: true, x: 120, y: 290 }
];

export const SECTIONS: RailwaySection[] = [
  {
    id: 'PGT-SRR',
    fromCode: 'PGT',
    toCode: 'SRR',
    fromName: 'Palakkad Jn',
    toName: 'Shoranur Jn',
    lengthKm: 44,
    tracks: 'Double Line',
    traction: '25 kV AC Electrified',
    mps: 110,
    status: 'Available'
  },
  {
    id: 'SRR-CLT',
    fromCode: 'SRR',
    toCode: 'CLT',
    fromName: 'Shoranur Jn',
    toName: 'Kozhikode',
    lengthKm: 85,
    tracks: 'Double Line',
    traction: '25 kV AC Electrified',
    mps: 110,
    status: 'Available'
  },
  {
    id: 'CLT-CAN',
    fromCode: 'CLT',
    toCode: 'CAN',
    fromName: 'Kozhikode',
    toName: 'Kannur',
    lengthKm: 89,
    tracks: 'Double Line',
    traction: '25 kV AC Electrified',
    mps: 110,
    status: 'Available'
  },
  {
    id: 'CAN-MAQ',
    fromCode: 'CAN',
    toCode: 'MAQ',
    fromName: 'Kannur',
    toName: 'Mangaluru Central',
    lengthKm: 138,
    tracks: 'Double Line',
    traction: '25 kV AC Electrified',
    mps: 110,
    status: 'Available'
  },
  {
    id: 'SRR-PGT',
    fromCode: 'SRR',
    toCode: 'PGT',
    fromName: 'Shoranur Jn',
    toName: 'Palakkad Jn',
    lengthKm: 44,
    tracks: 'Double Line',
    traction: '25 kV AC Electrified',
    mps: 110,
    status: 'Available'
  },
  {
    id: 'SRR-NIL',
    fromCode: 'SRR',
    toCode: 'NIL',
    fromName: 'Shoranur Jn',
    toName: 'Nilambur Road',
    lengthKm: 66,
    tracks: 'Single Line',
    traction: 'Non-Electrified',
    mps: 75,
    status: 'Available'
  },
  {
    id: 'PGT-PGTN',
    fromCode: 'PGT',
    toCode: 'PGTN',
    fromName: 'Palakkad Jn',
    toName: 'Palakkad Town',
    lengthKm: 4,
    tracks: 'Single Line',
    traction: '25 kV AC Electrified',
    mps: 60,
    status: 'Available'
  },
  {
    id: 'PGTN-POY',
    fromCode: 'PGTN',
    toCode: 'POY',
    fromName: 'Palakkad Town',
    toName: 'Pollachi Jn',
    lengthKm: 50,
    tracks: 'Single Line',
    traction: '25 kV AC Electrified',
    mps: 90,
    status: 'Available'
  }
];

// ==========================================
// PALAKKAD DIVISION (PGT) DATASET
// ==========================================

export const PGT_REQUESTS: MaintenanceRequest[] = [];

export const PGT_TRAINS: TrainMovement[] = [
  {
    trainNo: '12685',
    trainName: 'MAS MAQ SF EXP',
    category: 'Superfast Express',
    sectionId: 'PGT-SRR',
    fromStation: 'Palakkad Jn (PGT)',
    toStation: 'Shoranur Jn (SRR)',
    entryTime: '00:50',
    exitTime: '01:40',
    priority: 1,
    allowedDelayMin: 5
  },
  {
    trainNo: '12601',
    trainName: 'MAS MAQ SF MAIL',
    category: 'Mail/Express',
    sectionId: 'PGT-SRR',
    fromStation: 'Palakkad Jn (PGT)',
    toStation: 'Shoranur Jn (SRR)',
    entryTime: '04:35',
    exitTime: '05:30',
    priority: 1,
    allowedDelayMin: 5
  },
  {
    trainNo: '22610',
    trainName: 'INTERCITY SF EX',
    category: 'Superfast Express',
    sectionId: 'PGT-SRR',
    fromStation: 'Shoranur Jn (SRR)',
    toStation: 'Tirur (TIR)',
    entryTime: '07:05',
    exitTime: '07:50',
    priority: 2,
    allowedDelayMin: 10
  },
  {
    trainNo: '16349',
    trainName: 'RAJYA RANI EXP',
    category: 'Mail/Express',
    sectionId: 'PGT-SRR',
    fromStation: 'Palakkad Jn (PGT)',
    toStation: 'Shoranur Jn (SRR)',
    entryTime: '03:10',
    exitTime: '03:45',
    priority: 2,
    allowedDelayMin: 10
  },
  {
    trainNo: '16326',
    trainName: 'KTYM NIL EXP',
    category: 'Mail/Express',
    sectionId: 'SRR-NIL',
    fromStation: 'Shoranur Jn (SRR)',
    toStation: 'Nilambur Road (NIL)',
    entryTime: '08:00',
    exitTime: '09:20',
    priority: 3,
    allowedDelayMin: 15
  },
  {
    trainNo: 'BTPN-7810',
    trainName: 'BPCL Petroleum Rake',
    category: 'Freight',
    sectionId: 'PGT-SRR',
    fromStation: 'Palakkad Jn (PGT)',
    toStation: 'Shoranur Jn (SRR)',
    entryTime: '01:10',
    exitTime: '02:00',
    priority: 4,
    allowedDelayMin: 60
  }
];

export const PGT_BLOCKS: MaintenanceBlock[] = [];

export const PGT_CONFLICTS: OperationalConflict[] = [];

export const PGT_OPTIMIZATION_PLAN: OptimizationPlan = {
  id: 'OPT-PGT-308',
  timestamp: '05 Sep 2026, 01:42 IST',
  targetSection: 'PGT–SRR (Palakkad–Shoranur)',
  recommendedWindow: '02:00–05:00',
  departments: ['Engineering', 'TRD', 'S&T'],
  coordinatedRequestIds: ['REQ-1024', 'REQ-1025', 'REQ-1026'],
  overallScore: 87,
  reasons: [
    'Combines 3 departmental requests into a single 3-hour corridor possession window',
    'Same physical work zone (Parli–Mankara km 531–534) enables zero duplicated track handovers',
    'TRD OHE de-energization safely encloses Engineering tamping and S&T relay checks',
    'Reduces separate individual block requests from 6.0 total hours down to 3.0 coordinated hours',
    'Predicted train impact 14 min (Option A achieves 8 min with minor reschedule of 12617)'
  ],
  scoreBreakdown: {
    safetyAndPriority: 92,
    corridorSynergy: 95,
    trainPunctualityImpact: 78,
    assetAvailabilityScore: 84
  },
  metrics: {
    totalBlockHours: 3.0,
    jobsCompleted: 3,
    conflictsRemaining: 1,
    estimatedTrainImpactMin: 14,
    blockUtilization: 88,
    assetDowntime: 3.0
  },
  alternatives: [
    {
      id: 'PLAN-A',
      name: 'Plan A: Coordinated Multi-Dept Window (SolveX Recommended)',
      score: 87,
      timeWindow: '02:00–05:00',
      sectionId: 'PGT-SRR',
      duration: 3.0,
      jobsCoordinated: 3,
      conflictsCount: 1,
      trainDelayMin: 14,
      assetDowntimeHours: 3.0,
      status: 'Recommended',
      tradeoffs: [
        'Highest maintenance yield (3 jobs in 1 block)',
        'Requires single OHE power shutdown',
        'Needs slight regulation of Express 12617'
      ]
    },
    {
      id: 'PLAN-B',
      name: 'Plan B: Split Windows (Separate Engineering & TRD)',
      score: 72,
      timeWindow: '01:30–03:30 & 04:00–06:00',
      sectionId: 'PGT-SRR',
      duration: 4.0,
      jobsCoordinated: 2,
      conflictsCount: 0,
      trainDelayMin: 6,
      assetDowntimeHours: 4.5,
      status: 'Alternative',
      tradeoffs: [
        'Lower train delay during night',
        'Requires two separate track possessions',
        'Leaves S&T job REQ-1026 postponed'
      ]
    },
    {
      id: 'PLAN-C',
      name: 'Plan C: Post-Morning Commuter Shift',
      score: 64,
      timeWindow: '11:00–14:00',
      sectionId: 'PGT-SRR',
      duration: 3.0,
      jobsCoordinated: 3,
      conflictsCount: 3,
      trainDelayMin: 42,
      assetDowntimeHours: 3.0,
      status: 'Alternative',
      tradeoffs: [
        'Daylight working condition for staff',
        'Severely affects daytime passenger trains',
        '3 major train path conflicts'
      ]
    }
  ],
  approvalStatus: 'Pending Review'
};

export const PGT_OVERRUN_SCENARIO: OverrunScenario = {
  blockId: 'BLK-PGT-204',
  sectionId: 'PGT-SRR',
  plannedEnd: '04:00',
  expectedEnd: '04:45',
  delayMinutes: 45,
  reason: 'Track tamping machine encountered subgrade instability at km 532/6 requiring 2 additional packing passes.',
  options: [
    {
      id: 'OPT-EXTEND',
      title: 'Option A: Extend Current Block (+45 min to 04:45)',
      description: 'Keep track possession open until 04:45. Regulate approaching freight BTPN-7810 and loop Express 12686.',
      trainImpactMin: 22,
      maintenanceImpact: 'Completes 100% of planned track geometry work without speed restriction penalty.',
      conflicts: 1,
      assetAvailability: 90,
      isRecommended: false,
      reasoning: 'Causes cascading detention to early morning passenger trains.'
    },
    {
      id: 'OPT-MOVE-ST',
      title: 'Option B: Complete Track Work, Transfer S&T to Shadow Block (SolveX Recommended)',
      description: 'Hand over Engineering track at 04:25; transfer S&T calibration to off-track shadow window without power cut.',
      trainImpactMin: 8,
      maintenanceImpact: 'Engineering completed; S&T safely continues with lookout men under caution order.',
      conflicts: 0,
      assetAvailability: 93,
      isRecommended: true,
      reasoning: 'Lowest overall train impact (8 min delay only) while maintaining full safety protocols.'
    },
    {
      id: 'OPT-POSTPONE',
      title: 'Option C: Clamp Joint & Immediate Track Handover at 04:00',
      description: 'Impose emergency 20 km/h caution order, clamp turnout, and postpone remaining tamping to tomorrow.',
      trainImpactMin: 18,
      maintenanceImpact: 'Work left incomplete; speed restriction imposes 6-minute permanent run-time loss for 24h.',
      conflicts: 0,
      assetAvailability: 87,
      isRecommended: false,
      reasoning: 'High residual impact on all following trains for the next 24 hours.'
    },
    {
      id: 'OPT-REROUTE',
      title: 'Option D: Single-Line Bi-Directional Working on DOWN Line',
      description: 'Pilot trains on adjacent line between Palakkad and Shoranur under paper line clear ticket.',
      trainImpactMin: 28,
      maintenanceImpact: 'Engineering gets full time requested, but sectional capacity drops by 60%.',
      conflicts: 2,
      assetAvailability: 88,
      isRecommended: false,
      reasoning: 'High operational workload on station masters and risk of line congestion.'
    }
  ]
};

// ==========================================
// MANGALURU DIVISION (MAQ) DATASET
// ==========================================

export const MAQ_REQUESTS: MaintenanceRequest[] = [];

export const MAQ_TRAINS: TrainMovement[] = [
  {
    trainNo: '12134',
    trainName: 'Mangaluru–CSMT Mumbai Express',
    category: 'Superfast Express',
    sectionId: 'SL-UD',
    entryTime: '04:10',
    exitTime: '04:42',
    priority: 2,
    allowedDelayMin: 15
  },
  {
    trainNo: '20608',
    trainName: 'Madgaon–Mangaluru Vande Bharat',
    category: 'Vande Bharat',
    sectionId: 'UD-KUDA',
    entryTime: '08:15',
    exitTime: '08:35',
    priority: 1,
    allowedDelayMin: 5
  },
  {
    trainNo: '16586',
    trainName: 'Karwar–Bangalore Express',
    category: 'Mail/Express',
    sectionId: 'KUDA-BYNR',
    entryTime: '02:45',
    exitTime: '03:20',
    priority: 3,
    allowedDelayMin: 20
  },
  {
    trainNo: 'NMPT-882',
    trainName: 'Panambur Port Coal Container Rake',
    category: 'Freight',
    sectionId: 'MAJN-PNMB',
    entryTime: '02:30',
    exitTime: '03:15',
    priority: 4,
    allowedDelayMin: 60
  }
];

export const MAQ_BLOCKS: MaintenanceBlock[] = [];

export const MAQ_CONFLICTS: OperationalConflict[] = [];

export const MAQ_OPTIMIZATION_PLAN: OptimizationPlan = {
  id: 'OPT-MAQ-402',
  timestamp: '05 Sep 2026, 02:15 IST',
  targetSection: 'SL–UD (Surathkal–Udupi)',
  recommendedWindow: '01:00–03:30',
  departments: ['Engineering', 'TRD'],
  coordinatedRequestIds: ['REQ-MAQ-201', 'REQ-MAQ-202'],
  overallScore: 89,
  reasons: [
    'Combines track sleeper renewal and OHE insulator washing into a single 2.5h night window',
    'Advances window ahead of 12134 CSMT Express to achieve zero passenger train delay',
    'Consolidates coastal corrosion maintenance under one electrical shutdown'
  ],
  scoreBreakdown: {
    safetyAndPriority: 90,
    corridorSynergy: 92,
    trainPunctualityImpact: 94,
    assetAvailabilityScore: 82
  },
  metrics: {
    totalBlockHours: 2.5,
    jobsCompleted: 2,
    conflictsRemaining: 0,
    estimatedTrainImpactMin: 0,
    blockUtilization: 91,
    assetDowntime: 2.5
  },
  alternatives: [
    {
      id: 'PLAN-MAQ-A',
      name: 'Plan A: Advanced Night Coordinated Window (SolveX Recommended)',
      score: 89,
      timeWindow: '01:00–03:30',
      sectionId: 'SL-UD',
      duration: 2.5,
      jobsCoordinated: 2,
      conflictsCount: 0,
      trainDelayMin: 0,
      assetDowntimeHours: 2.5,
      status: 'Recommended',
      tradeoffs: ['Requires early staff mobilization at 00:30', 'Zero train delays']
    }
  ],
  approvalStatus: 'Pending Review'
};

export const MAQ_OVERRUN_SCENARIO: OverrunScenario = {
  blockId: 'BLK-MAQ-201',
  sectionId: 'SL-UD',
  plannedEnd: '04:30',
  expectedEnd: '05:00',
  delayMinutes: 30,
  reason: 'Sleeper screw extraction seized due to coastal rust near km 742/2.',
  options: [
    {
      id: 'OPT-MAQ-1',
      title: 'Option A: Complete remaining 4 sleepers under 20 km/h caution order',
      description: 'Clamp rail, clear track at 04:30, and impose 20 km/h caution order for 12134.',
      trainImpactMin: 6,
      maintenanceImpact: 'Sleepers secured with clamps; permanent fastening tomorrow.',
      conflicts: 0,
      assetAvailability: 92,
      isRecommended: true,
      reasoning: 'Reduces delay to 6 minutes while maintaining safety.'
    }
  ]
};

// ==========================================
// THIRUVANANTHAPURAM DIVISION (TVC) DATASET
// ==========================================

export const TVC_REQUESTS: MaintenanceRequest[] = [];

export const TVC_TRAINS: TrainMovement[] = [
  {
    trainNo: '20632',
    trainName: 'TVC–Kasaragod Vande Bharat Express',
    category: 'Vande Bharat',
    sectionId: 'QLN-TVC',
    entryTime: '06:05',
    exitTime: '06:45',
    priority: 1,
    allowedDelayMin: 5
  },
  {
    trainNo: '16346',
    trainName: 'Netravati Express',
    category: 'Superfast Express',
    sectionId: 'KYJ-QLN',
    entryTime: '03:40',
    exitTime: '04:12',
    priority: 2,
    allowedDelayMin: 15
  },
  {
    trainNo: '12624',
    trainName: 'Chennai Mail Express',
    category: 'Mail/Express',
    sectionId: 'QLN-TVC',
    entryTime: '01:20',
    exitTime: '02:00',
    priority: 2,
    allowedDelayMin: 15
  },
  {
    trainNo: '16604',
    trainName: 'Maveli Express',
    category: 'Mail/Express',
    sectionId: 'ERS-ALLP',
    entryTime: '04:15',
    exitTime: '04:50',
    priority: 3,
    allowedDelayMin: 20
  }
];

export const TVC_BLOCKS: MaintenanceBlock[] = [];

export const TVC_CONFLICTS: OperationalConflict[] = [];

export const TVC_OPTIMIZATION_PLAN: OptimizationPlan = {
  id: 'OPT-TVC-501',
  timestamp: '05 Sep 2026, 01:10 IST',
  targetSection: 'KYJ–QLN (Kayamkulam–Kollam)',
  recommendedWindow: '01:00–03:30',
  departments: ['Engineering', 'TRD'],
  coordinatedRequestIds: ['REQ-TVC-301'],
  overallScore: 88,
  reasons: [
    'Advances track tamping window ahead of 16346 Netravati Express',
    'Maintains uninterrupted double-line passenger clearance during early morning peak',
    'Zero train delay on prime high-density coastal corridor'
  ],
  scoreBreakdown: {
    safetyAndPriority: 94,
    corridorSynergy: 86,
    trainPunctualityImpact: 92,
    assetAvailabilityScore: 82
  },
  metrics: {
    totalBlockHours: 2.5,
    jobsCompleted: 1,
    conflictsRemaining: 0,
    estimatedTrainImpactMin: 0,
    blockUtilization: 92,
    assetDowntime: 2.5
  },
  alternatives: [
    {
      id: 'PLAN-TVC-A',
      name: 'Plan A: Early Shift Window (SolveX Recommended)',
      score: 88,
      timeWindow: '01:00–03:30',
      sectionId: 'KYJ-QLN',
      duration: 2.5,
      jobsCoordinated: 1,
      conflictsCount: 0,
      trainDelayMin: 0,
      assetDowntimeHours: 2.5,
      status: 'Recommended',
      tradeoffs: ['Work commences at 01:00', 'Protects Netravati Exp schedule']
    }
  ],
  approvalStatus: 'Pending Review'
};

export const TVC_OVERRUN_SCENARIO: OverrunScenario = {
  blockId: 'BLK-TVC-301',
  sectionId: 'KYJ-QLN',
  plannedEnd: '04:30',
  expectedEnd: '05:00',
  delayMinutes: 30,
  reason: 'Ballast regulator hydraulic hose leak near Sasthankotta.',
  options: [
    {
      id: 'OPT-TVC-1',
      title: 'Option A: Hand over track at 04:30 with 30 km/h caution order',
      description: 'Clear track possession, allow Netravati Express through at reduced speed.',
      trainImpactMin: 12,
      maintenanceImpact: 'Ballast profiling completed manually by gang.',
      conflicts: 0,
      assetAvailability: 90,
      isRecommended: true,
      reasoning: 'Safely avoids full line detention.'
    }
  ]
};

// ==========================================
// DIVISION DATA REGISTRY
// ==========================================

export interface DivisionMockBundle {
  requests: MaintenanceRequest[];
  blocks: MaintenanceBlock[];
  conflicts: OperationalConflict[];
  trains: TrainMovement[];
  optimizationPlan: OptimizationPlan;
  overrunScenario: OverrunScenario;
}

export const DIVISION_MOCK_DATA: Record<string, DivisionMockBundle> = {
  PGT: {
    requests: PGT_REQUESTS,
    blocks: PGT_BLOCKS,
    conflicts: PGT_CONFLICTS,
    trains: PGT_TRAINS,
    optimizationPlan: PGT_OPTIMIZATION_PLAN,
    overrunScenario: PGT_OVERRUN_SCENARIO
  },
  MAQ: {
    requests: MAQ_REQUESTS,
    blocks: MAQ_BLOCKS,
    conflicts: MAQ_CONFLICTS,
    trains: MAQ_TRAINS,
    optimizationPlan: MAQ_OPTIMIZATION_PLAN,
    overrunScenario: MAQ_OVERRUN_SCENARIO
  },
  TVC: {
    requests: TVC_REQUESTS,
    blocks: TVC_BLOCKS,
    conflicts: TVC_CONFLICTS,
    trains: TVC_TRAINS,
    optimizationPlan: TVC_OPTIMIZATION_PLAN,
    overrunScenario: TVC_OVERRUN_SCENARIO
  }
};

export function getDivisionMockData(divisionId: string): DivisionMockBundle {
  return DIVISION_MOCK_DATA[divisionId] || DIVISION_MOCK_DATA['PGT'];
}

// Backward compatibility defaults
export const INITIAL_REQUESTS: MaintenanceRequest[] = PGT_REQUESTS;
export const TRAIN_MOVEMENTS: TrainMovement[] = PGT_TRAINS;
export const INITIAL_BLOCKS: MaintenanceBlock[] = PGT_BLOCKS;
export const INITIAL_CONFLICTS: OperationalConflict[] = PGT_CONFLICTS;
export const INITIAL_OPTIMIZATION_PLAN: OptimizationPlan = PGT_OPTIMIZATION_PLAN;
export const OVERRUN_SCENARIO_DATA: OverrunScenario = PGT_OVERRUN_SCENARIO;
