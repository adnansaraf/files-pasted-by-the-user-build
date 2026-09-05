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
    status: 'Maintenance Planned',
    plannedBlockIds: ['BLK-PGT-204'],
    currentSpeedRestriction: '45 km/h at km 532/4-8'
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
    status: 'Active Block',
    activeBlockId: 'BLK-PGT-205'
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
    status: 'Conflict',
    plannedBlockIds: ['BLK-PGT-206']
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
    id: 'SRR-NIL',
    fromCode: 'SRR',
    toCode: 'NIL',
    fromName: 'Shoranur Jn',
    toName: 'Nilambur Road',
    lengthKm: 66,
    tracks: 'Single Line',
    traction: 'Non-Electrified',
    mps: 75,
    status: 'Maintenance Planned'
  },
  {
    id: 'PTJ-PGT',
    fromCode: 'PTJ',
    toCode: 'PGT',
    fromName: 'Podanur Jn',
    toName: 'Palakkad Jn',
    lengthKm: 52,
    tracks: 'Double Line',
    traction: '25 kV AC Electrified',
    mps: 110,
    status: 'Available'
  }
];

// ==========================================
// PALAKKAD DIVISION (PGT) DATASET
// ==========================================

export const PGT_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'REQ-1024',
    dept: 'Engineering',
    sectionId: 'PGT-SRR',
    sectionName: 'PGT–SRR (Palakkad–Shoranur)',
    workType: 'Track Geometry Correction & Tamping',
    description: '09-3X Dynamic Tamper deep tamping on UP line from km 531/0 to 534/2 including turnout packing near Parli–Mankara.',
    requestedDuration: 3.0,
    predictedDuration: 3.4,
    historicalSamples: [2.9, 3.2, 3.5, 3.4, 3.6],
    preferredTimeWindow: '02:00–05:00',
    priority: 'High',
    priorityScore: 87,
    factors: { safetyImpact: 26, assetCriticality: 22, urgency: 18, failureProbability: 11, operationalImpact: 10 },
    deadline: 'Tonight (Shift 3)',
    constraints: 'Requires continuous traffic block; speed restriction of 45 km/h post-work.',
    resources: 'Duomatic 09-3X, 1 JE/P-Way, 18 Gangmen',
    status: 'Pending',
    submissionDate: '2026-09-04 14:30'
  },
  {
    id: 'REQ-1025',
    dept: 'TRD',
    sectionId: 'PGT-SRR',
    sectionName: 'PGT–SRR (Palakkad–Shoranur)',
    workType: 'OHE Contact Wire & Dropper Inspection',
    description: 'Annual tower wagon inspection of 25kV catenary wire, dropper adjustment, and insulator washing between Mankara and Ottappalam.',
    requestedDuration: 2.0,
    predictedDuration: 2.3,
    historicalSamples: [2.0, 2.2, 2.4, 2.3, 2.5],
    preferredTimeWindow: '02:00–05:00',
    priority: 'Medium',
    priorityScore: 68,
    factors: { safetyImpact: 19, assetCriticality: 18, urgency: 14, failureProbability: 9, operationalImpact: 8 },
    deadline: 'Tonight (Shift 3)',
    constraints: 'Requires 25kV traction power shutdown (OHE isolated from Shoranur TSS).',
    resources: '8-Wheeler Tower Wagon, 1 SSE/TRD, 6 Linemen',
    status: 'Pending',
    submissionDate: '2026-09-04 16:15'
  },
  {
    id: 'REQ-1026',
    dept: 'S&T',
    sectionId: 'PGT-SRR',
    sectionName: 'PGT–SRR (Palakkad–Shoranur)',
    workType: 'Signal Relay & Axle Counter Calibration',
    description: 'Routine calibration of HASSDAC digital axle counters and point machine 102B insulation testing at Lakkidi.',
    requestedDuration: 1.0,
    predictedDuration: 1.2,
    historicalSamples: [1.0, 1.1, 1.3, 1.2, 1.2],
    preferredTimeWindow: '03:00–04:00',
    priority: 'High',
    priorityScore: 82,
    factors: { safetyImpact: 24, assetCriticality: 21, urgency: 16, failureProbability: 12, operationalImpact: 9 },
    deadline: 'Tonight (Shift 3)',
    constraints: 'Co-terminus with Engineering block; signal failure alarm bypass needed.',
    resources: 'Digital Megger test kit, 1 SSE/Signal, 2 Technicians',
    status: 'Pending',
    submissionDate: '2026-09-04 17:00'
  },
  {
    id: 'REQ-1027',
    dept: 'Engineering',
    sectionId: 'SRR-CLT',
    sectionName: 'SRR–CLT (Shoranur–Kozhikode)',
    workType: 'Rail Weld Renewal & Ultrasonic Flaw Detection',
    description: 'Thermit weld replacement at km 598/2-4 near Kuttippuram–Tirur following USFD defect detection.',
    requestedDuration: 2.5,
    predictedDuration: 2.8,
    historicalSamples: [2.6, 2.7, 2.9, 3.0, 2.8],
    preferredTimeWindow: '05:00–07:30',
    priority: 'Critical',
    priorityScore: 94,
    factors: { safetyImpact: 30, assetCriticality: 24, urgency: 20, failureProbability: 12, operationalImpact: 8 },
    deadline: 'Within 24h',
    constraints: 'Fishplated temporary joint in place with 20 km/h caution order.',
    resources: 'Thermit welding kit, 1 PWI, 12 Trackmen',
    status: 'Planned',
    submissionDate: '2026-09-04 18:20'
  },
  {
    id: 'REQ-1028',
    dept: 'TRD',
    sectionId: 'SRR-CLT',
    sectionName: 'SRR–CLT (Shoranur–Kozhikode)',
    workType: 'OHE Mast Foundation & Cantilever Audit',
    description: 'Audit of cantilever assemblies and corrosion inspection on Tirur TSS feeding zone.',
    requestedDuration: 2.0,
    predictedDuration: 2.2,
    historicalSamples: [2.1, 2.2, 2.3, 2.0, 2.4],
    preferredTimeWindow: '01:30–03:30',
    priority: 'High',
    priorityScore: 79,
    factors: { safetyImpact: 22, assetCriticality: 20, urgency: 16, failureProbability: 11, operationalImpact: 10 },
    deadline: '06 Sep 2026',
    constraints: 'Requires auxiliary feeder de-energization at Tirur TSS.',
    resources: 'Tower wagon unit 4, 1 JE/TRD, 4 Staff',
    status: 'Planned',
    submissionDate: '2026-09-04 11:10'
  },
  {
    id: 'REQ-1029',
    dept: 'S&T',
    sectionId: 'CLT-CAN',
    sectionName: 'CLT–CAN (Kozhikode–Kannur)',
    workType: 'Audio Frequency Track Circuit (AFTC) Testing',
    description: 'Testing of tuned zones and receiver units across 4 consecutive track circuits near Vadakara.',
    requestedDuration: 1.5,
    predictedDuration: 1.7,
    historicalSamples: [1.4, 1.6, 1.8, 1.7, 1.9],
    preferredTimeWindow: '04:00–05:30',
    priority: 'Medium',
    priorityScore: 61,
    factors: { safetyImpact: 16, assetCriticality: 16, urgency: 13, failureProbability: 9, operationalImpact: 7 },
    deadline: '06 Sep 2026',
    constraints: 'Non-interfering with adjacent UP mainline.',
    resources: 'AFTC analyzer, 1 Telecom Inspector, 2 Techs',
    status: 'Pending',
    submissionDate: '2026-09-04 09:40'
  },
  {
    id: 'REQ-1030',
    dept: 'Engineering',
    sectionId: 'SRR-NIL',
    sectionName: 'SRR–NIL (Shoranur–Nilambur Road)',
    workType: 'Ballast Deep Screening Machine (BCM)',
    description: 'Shoulder ballast cleaning and muck removal on branch line between Angadippuram and Melattur.',
    requestedDuration: 4.0,
    predictedDuration: 4.5,
    historicalSamples: [4.1, 4.3, 4.6, 4.4, 4.7],
    preferredTimeWindow: '01:00–05:00',
    priority: 'High',
    priorityScore: 83,
    factors: { safetyImpact: 24, assetCriticality: 22, urgency: 17, failureProbability: 11, operationalImpact: 9 },
    deadline: '07 Sep 2026',
    constraints: 'Full single line traffic block possession.',
    resources: 'Plasser BCM rake, 2 Loco Pilots, 20 Gangmen',
    status: 'Pending',
    submissionDate: '2026-09-04 08:15'
  }
];

export const PGT_TRAINS: TrainMovement[] = [
  {
    trainNo: '12617',
    trainName: 'Mangala Lakshadweep Superfast',
    category: 'Superfast Express',
    sectionId: 'PGT-SRR',
    entryTime: '03:15',
    exitTime: '03:38',
    priority: 2,
    allowedDelayMin: 15
  },
  {
    trainNo: '20631',
    trainName: 'Kasaragod–TVC Vande Bharat',
    category: 'Vande Bharat',
    sectionId: 'CLT-CAN',
    entryTime: '07:22',
    exitTime: '07:44',
    priority: 1,
    allowedDelayMin: 5
  },
  {
    trainNo: '12626',
    trainName: 'Kerala Superfast Express',
    category: 'Superfast Express',
    sectionId: 'PGT-SRR',
    entryTime: '01:25',
    exitTime: '01:48',
    priority: 2,
    allowedDelayMin: 15
  },
  {
    trainNo: '16347',
    trainName: 'Mangalore Express',
    category: 'Mail/Express',
    sectionId: 'SRR-CLT',
    entryTime: '02:10',
    exitTime: '02:45',
    priority: 3,
    allowedDelayMin: 25
  },
  {
    trainNo: '12686',
    trainName: 'Mangaluru–Chennai Superfast',
    category: 'Superfast Express',
    sectionId: 'PGT-SRR',
    entryTime: '04:10',
    exitTime: '04:24',
    priority: 2,
    allowedDelayMin: 15
  },
  {
    trainNo: 'BOXN-4022',
    trainName: 'Cochin Port Container Rake',
    category: 'Freight',
    sectionId: 'PTJ-PGT',
    entryTime: '02:40',
    exitTime: '03:15',
    priority: 4,
    allowedDelayMin: 60
  },
  {
    trainNo: 'BTPN-7810',
    trainName: 'BPCL Petroleum Rake',
    category: 'Freight',
    sectionId: 'PGT-SRR',
    entryTime: '05:30',
    exitTime: '06:05',
    priority: 4,
    allowedDelayMin: 45
  },
  {
    trainNo: '06797',
    trainName: 'Palakkad–Ernakulam MEMU',
    category: 'MEMU Passenger',
    sectionId: 'PGT-SRR',
    entryTime: '06:20',
    exitTime: '06:48',
    priority: 4,
    allowedDelayMin: 20
  }
];

export const PGT_BLOCKS: MaintenanceBlock[] = [
  {
    id: 'BLK-PGT-204',
    sectionId: 'PGT-SRR',
    sectionName: 'PGT–SRR (Palakkad–Shoranur)',
    departments: ['Engineering', 'TRD'],
    requestIds: ['REQ-1024', 'REQ-1025'],
    workSummary: 'Track geometry tamping + OHE catenary dropper overhaul (Parli–Mankara)',
    scheduledStart: '02:00',
    scheduledEnd: '04:00',
    actualStart: '02:05',
    expectedEnd: '04:45', // Overrun
    durationHours: 2.67,
    progressPercent: 78,
    status: 'Active',
    priority: 'High',
    affectedTrains: ['12617 Mangala Exp (at 03:15)'],
    crewAssigned: '24 Staff (Plasser crew + PGT TRD team)',
    overheadPowerCutRequired: true,
    speedRestrictionImposed: '45 km/h temporary caution order',
    notes: 'Ballast consolidation took longer than expected due to wet formation near km 532.'
  },
  {
    id: 'BLK-PGT-205',
    sectionId: 'SRR-CLT',
    sectionName: 'SRR–CLT (Shoranur–Kozhikode)',
    departments: ['S&T'],
    requestIds: ['REQ-1028'],
    workSummary: 'Axle counter heads replacement & cable insulation test (Kuttippuram–Tirur)',
    scheduledStart: '01:30',
    scheduledEnd: '03:30',
    actualStart: '01:30',
    expectedEnd: '03:30',
    durationHours: 2.0,
    progressPercent: 92,
    status: 'Active',
    priority: 'High',
    affectedTrains: ['16347 Mangalore Exp'],
    crewAssigned: '6 Staff (SSE/Sig Tirur)',
    overheadPowerCutRequired: false,
    notes: 'Work finishing ahead of schedule. Track clearance expected in 15 minutes.'
  },
  {
    id: 'BLK-PGT-206',
    sectionId: 'CLT-CAN',
    sectionName: 'CLT–CAN (Kozhikode–Kannur)',
    departments: ['Engineering'],
    requestIds: ['REQ-1029'],
    workSummary: 'AFTC calibration and signal testing near Vadakara',
    scheduledStart: '05:00',
    scheduledEnd: '07:00',
    expectedEnd: '07:00',
    durationHours: 2.0,
    progressPercent: 0,
    status: 'Planned',
    priority: 'Medium',
    affectedTrains: ['20631 Vande Bharat Express'],
    crewAssigned: '10 Technicians (PWI BDJ)',
    overheadPowerCutRequired: false
  }
];

export const PGT_CONFLICTS: OperationalConflict[] = [
  {
    id: 'CONF-PGT-801',
    severity: 'Critical',
    sectionId: 'PGT-SRR',
    sectionName: 'PGT–SRR (Palakkad–Shoranur)',
    blockTime: '02:00–05:00',
    conflictPointTime: '03:15',
    conflictingTrain: PGT_TRAINS[0], // 12617 Mangala Exp
    description: 'Requested maintenance block overlaps high-priority passenger movement (12617 Mangala Superfast).',
    impactScore: 89,
    status: 'Unresolved',
    alternatives: [
      {
        optionId: 'ALT-1',
        label: 'Option A: Advance Block Window (01:00–04:00)',
        window: '01:00–04:00',
        trainImpact: 'Low Train Impact (8 min delay to 12626)',
        trainDelayMin: 8,
        isRecommended: true,
        reason: 'Avoids prime passenger rush; 12617 passes safely at 03:15 on cleared track.'
      },
      {
        optionId: 'ALT-2',
        label: 'Option B: Retain Requested Window (02:00–05:00)',
        window: '02:00–05:00',
        trainImpact: 'Severe Passenger Disruption (35 min detention)',
        trainDelayMin: 35,
        isRecommended: false,
        reason: 'Requires regulating 12617 at Palakkad outer loop; high punctuality loss.'
      },
      {
        optionId: 'ALT-3',
        label: 'Option C: Postpone to Post-Dawn Window (04:30–07:30)',
        window: '04:30–07:30',
        trainImpact: 'High Congestion (Conflicts with 06797 MEMU & Freight)',
        trainDelayMin: 24,
        isRecommended: false,
        reason: 'Collides with early morning commuter trains and Palakkad yard shunting.'
      }
    ]
  },
  {
    id: 'CONF-PGT-802',
    severity: 'High',
    sectionId: 'SRR-CLT',
    sectionName: 'SRR–CLT (Shoranur–Kozhikode)',
    blockTime: '04:00–05:30',
    conflictPointTime: '04:45',
    conflictingTrain: {
      trainNo: '16606',
      trainName: 'Ernad Express',
      category: 'Mail/Express',
      sectionId: 'SRR-CLT',
      entryTime: '04:45',
      exitTime: '05:12',
      priority: 3,
      allowedDelayMin: 20
    },
    description: 'S&T AFTC testing on track circuits interferes with automatic block signalling ahead of Ernad Express.',
    impactScore: 72,
    status: 'Unresolved',
    alternatives: [
      {
        optionId: 'ALT-4',
        label: 'Option A: Reschedule to 02:00–03:30',
        window: '02:00–03:30',
        trainImpact: 'Zero Train Delay',
        trainDelayMin: 0,
        isRecommended: true,
        reason: 'Completely clear of passenger traffic.'
      },
      {
        optionId: 'ALT-5',
        label: 'Option B: Restrict to UP loop line only',
        window: '04:00–05:30',
        trainImpact: '5 min speed restriction',
        trainDelayMin: 5,
        isRecommended: false,
        reason: 'Partial testing only, requires second visit.'
      }
    ]
  },
  {
    id: 'CONF-PGT-803',
    severity: 'Medium',
    sectionId: 'SRR-NIL',
    sectionName: 'SRR–NIL (Shoranur–Nilambur Road)',
    blockTime: '01:00–05:00',
    conflictPointTime: '02:40',
    conflictingTrain: PGT_TRAINS[5], // Freight
    description: 'BCM Ballast screening block holds container freight on single line branch.',
    impactScore: 48,
    status: 'Unresolved',
    alternatives: [
      {
        optionId: 'ALT-6',
        label: 'Option A: Regulate freight at Angadippuram loop',
        window: '01:00–05:00',
        trainImpact: '25 min freight regulation (Acceptable)',
        trainDelayMin: 25,
        isRecommended: true,
        reason: 'Freight has 60 min delay tolerance buffer.'
      }
    ]
  }
];

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

export const MAQ_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'REQ-MAQ-201',
    dept: 'Engineering',
    sectionId: 'SL-UD',
    sectionName: 'SL–UD (Surathkal–Udupi)',
    workType: 'Track Packing & Joint Sleepers Replacement',
    description: 'Replacement of damaged PSC sleepers and track alignment around km 742/2 near Nandikoor.',
    requestedDuration: 2.5,
    predictedDuration: 2.8,
    historicalSamples: [2.4, 2.7, 2.9, 2.8, 3.0],
    preferredTimeWindow: '02:00–04:30',
    priority: 'High',
    priorityScore: 84,
    factors: { safetyImpact: 25, assetCriticality: 21, urgency: 17, failureProbability: 11, operationalImpact: 10 },
    deadline: '06 Sep 2026',
    constraints: 'Requires complete track possession.',
    resources: '1 PWI/Surathkal, 14 Track Maintainers',
    status: 'Pending',
    submissionDate: '2026-09-04 15:00'
  },
  {
    id: 'REQ-MAQ-202',
    dept: 'TRD',
    sectionId: 'UD-KUDA',
    sectionName: 'UD–KUDA (Udupi–Kundapura)',
    workType: 'OHE Mast Inspection & Insulator Washing',
    description: 'Insulator washing along coastal salinity zone between Udupi and Kundapura.',
    requestedDuration: 2.0,
    predictedDuration: 2.2,
    historicalSamples: [1.9, 2.1, 2.3, 2.2, 2.4],
    preferredTimeWindow: '01:30–03:30',
    priority: 'Medium',
    priorityScore: 66,
    factors: { safetyImpact: 18, assetCriticality: 17, urgency: 13, failureProbability: 10, operationalImpact: 8 },
    deadline: '07 Sep 2026',
    constraints: 'Requires 25kV OHE isolation at Udupi TSS.',
    resources: 'Tower Wagon MAQ-1, 1 SSE/TRD, 5 Linemen',
    status: 'Pending',
    submissionDate: '2026-09-04 16:20'
  },
  {
    id: 'REQ-MAQ-203',
    dept: 'S&T',
    sectionId: 'KUDA-BYNR',
    sectionName: 'KUDA–BYNR (Kundapura–Byndoor)',
    workType: 'Electronic Interlocking Maintenance',
    description: 'Card diagnostic and standby CPU failover verification at Byndoor cabin.',
    requestedDuration: 1.5,
    predictedDuration: 1.6,
    historicalSamples: [1.4, 1.5, 1.7, 1.6, 1.8],
    preferredTimeWindow: '03:00–04:30',
    priority: 'High',
    priorityScore: 80,
    factors: { safetyImpact: 22, assetCriticality: 22, urgency: 16, failureProbability: 11, operationalImpact: 9 },
    deadline: '06 Sep 2026',
    constraints: 'Station Master manual control standby required.',
    resources: 'Signal Tester Kit, 1 DSTE/MAQ',
    status: 'Planned',
    submissionDate: '2026-09-04 18:00'
  },
  {
    id: 'REQ-MAQ-204',
    dept: 'Operating',
    sectionId: 'MAJN-PNMB',
    sectionName: 'MAJN–PNMB (Mangaluru Jn–Panambur Port)',
    workType: 'Port Siding Point Calibration',
    description: 'Calibration of electric point machines and cross-over track circuits for New Mangalore Port coal terminal.',
    requestedDuration: 3.0,
    predictedDuration: 3.3,
    historicalSamples: [2.9, 3.1, 3.4, 3.2, 3.5],
    preferredTimeWindow: '02:00–05:00',
    priority: 'Medium',
    priorityScore: 70,
    factors: { safetyImpact: 19, assetCriticality: 18, urgency: 15, failureProbability: 10, operationalImpact: 8 },
    deadline: '07 Sep 2026',
    constraints: 'Coordinate with New Mangalore Port Authority.',
    resources: '1 Traffic Inspector, 1 SSE/Points',
    status: 'Pending',
    submissionDate: '2026-09-04 11:30'
  }
];

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

export const MAQ_BLOCKS: MaintenanceBlock[] = [
  {
    id: 'BLK-MAQ-201',
    sectionId: 'SL-UD',
    sectionName: 'SL–UD (Surathkal–Udupi)',
    departments: ['Engineering', 'TRD'],
    requestIds: ['REQ-MAQ-201', 'REQ-MAQ-202'],
    workSummary: 'Track packing & joint sleeper replacement near Nandikoor',
    scheduledStart: '02:00',
    scheduledEnd: '04:30',
    actualStart: '02:00',
    expectedEnd: '04:30',
    durationHours: 2.5,
    progressPercent: 65,
    status: 'Active',
    priority: 'High',
    affectedTrains: ['12134 CSMT Express'],
    crewAssigned: '18 Staff (PWI Surathkal + TRD crew)',
    overheadPowerCutRequired: true,
    speedRestrictionImposed: '30 km/h pilot track'
  },
  {
    id: 'BLK-MAQ-202',
    sectionId: 'MAJN-PNMB',
    sectionName: 'MAJN–PNMB (Mangaluru Jn–Panambur)',
    departments: ['Operating'],
    requestIds: ['REQ-MAQ-204'],
    workSummary: 'Port siding point calibration and circuit overhaul',
    scheduledStart: '05:00',
    scheduledEnd: '06:30',
    expectedEnd: '06:30',
    durationHours: 1.5,
    progressPercent: 0,
    status: 'Planned',
    priority: 'Medium',
    affectedTrains: ['NMPT-882 Port Coal Rake'],
    crewAssigned: '6 Staff',
    overheadPowerCutRequired: false
  }
];

export const MAQ_CONFLICTS: OperationalConflict[] = [
  {
    id: 'CONF-MAQ-801',
    severity: 'High',
    sectionId: 'SL-UD',
    sectionName: 'SL–UD (Surathkal–Udupi)',
    blockTime: '02:00–04:30',
    conflictPointTime: '04:10',
    conflictingTrain: MAQ_TRAINS[0], // 12134 CSMT Express
    description: 'Maintenance block overlaps approaching 12134 Mangaluru-CSMT Superfast near Surathkal.',
    impactScore: 82,
    status: 'Unresolved',
    alternatives: [
      {
        optionId: 'ALT-MAQ-1',
        label: 'Option A: Advance Block Window to 01:00–03:30',
        window: '01:00–03:30',
        trainImpact: 'Zero Passenger Delay',
        trainDelayMin: 0,
        isRecommended: true,
        reason: 'Leaves clear section ahead of 12134 passage.'
      },
      {
        optionId: 'ALT-MAQ-2',
        label: 'Option B: Regulate 12134 at Mangaluru Jn',
        window: '02:00–04:30',
        trainImpact: '25 min departure delay',
        trainDelayMin: 25,
        isRecommended: false,
        reason: 'Significant punctuality penalty on Konkan corridor.'
      }
    ]
  },
  {
    id: 'CONF-MAQ-802',
    severity: 'Medium',
    sectionId: 'MAJN-PNMB',
    sectionName: 'MAJN–PNMB (Mangaluru Jn–Panambur)',
    blockTime: '02:00–05:00',
    conflictPointTime: '02:30',
    conflictingTrain: MAQ_TRAINS[3], // NMPT-882 Freight
    description: 'Siding maintenance delays outbound coal train from New Mangalore Port.',
    impactScore: 45,
    status: 'Unresolved',
    alternatives: [
      {
        optionId: 'ALT-MAQ-3',
        label: 'Option A: Stagger block after port rake exit (03:30–06:00)',
        window: '03:30–06:00',
        trainImpact: '0 min delay',
        trainDelayMin: 0,
        isRecommended: true,
        reason: 'Port dispatch completed before track isolation.'
      }
    ]
  }
];

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

export const TVC_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'REQ-TVC-301',
    dept: 'Engineering',
    sectionId: 'KYJ-QLN',
    sectionName: 'KYJ–QLN (Kayamkulam–Kollam)',
    workType: 'Track Geometry Tamping & Ballast Regulation',
    description: '09-3X tamper packing on UP line between Ochira and Sasthankotta near km 128.',
    requestedDuration: 3.0,
    predictedDuration: 3.3,
    historicalSamples: [2.9, 3.2, 3.4, 3.3, 3.6],
    preferredTimeWindow: '02:00–05:00',
    priority: 'Critical',
    priorityScore: 92,
    factors: { safetyImpact: 28, assetCriticality: 23, urgency: 19, failureProbability: 12, operationalImpact: 10 },
    deadline: 'Tonight (Shift 3)',
    constraints: 'Requires complete track possession; heavy commuter corridor.',
    resources: 'Duomatic tamper, 1 PWI/Kollam, 16 Gangmen',
    status: 'Pending',
    submissionDate: '2026-09-04 16:40'
  },
  {
    id: 'REQ-TVC-302',
    dept: 'TRD',
    sectionId: 'QLN-TVC',
    sectionName: 'QLN–TVC (Kollam–Thiruvananthapuram)',
    workType: 'OHE Cantilever Replacement & Dropper Alignment',
    description: 'Replacement of corroded cantilever brackets and contact wire height check near Varkala Sivagiri.',
    requestedDuration: 2.0,
    predictedDuration: 2.3,
    historicalSamples: [2.0, 2.2, 2.4, 2.3, 2.5],
    preferredTimeWindow: '01:30–03:30',
    priority: 'High',
    priorityScore: 81,
    factors: { safetyImpact: 23, assetCriticality: 21, urgency: 16, failureProbability: 11, operationalImpact: 10 },
    deadline: '06 Sep 2026',
    constraints: 'Requires 25kV traction power shutdown from Varkala feeding post.',
    resources: 'Tower wagon unit TVC-2, 1 SSE/TRD, 6 Linemen',
    status: 'Pending',
    submissionDate: '2026-09-04 17:15'
  },
  {
    id: 'REQ-TVC-303',
    dept: 'S&T',
    sectionId: 'ERS-ALLP',
    sectionName: 'ERS–ALLP (Ernakulam–Alappuzha)',
    workType: 'Signalling Cable Insulation & Relay Testing',
    description: 'Megger testing of underground copper signalling cables between Kumbalam and Cherthala.',
    requestedDuration: 2.0,
    predictedDuration: 2.2,
    historicalSamples: [1.9, 2.1, 2.3, 2.2, 2.4],
    preferredTimeWindow: '02:30–04:30',
    priority: 'Medium',
    priorityScore: 68,
    factors: { safetyImpact: 18, assetCriticality: 18, urgency: 14, failureProbability: 9, operationalImpact: 9 },
    deadline: '07 Sep 2026',
    constraints: 'Requires coordinated station clearance with Cherthala Station Master.',
    resources: 'Insulation Tester, 1 SSE/Sig Cherthala',
    status: 'Planned',
    submissionDate: '2026-09-04 18:30'
  },
  {
    id: 'REQ-TVC-304',
    dept: 'Engineering',
    sectionId: 'KTYM-KYJ',
    sectionName: 'KTYM–KYJ (Kottayam–Kayamkulam)',
    workType: 'Turnout Curve De-Stressing',
    description: 'Thermal de-stressing of turnout curves and switch expansion joints at Chengannur Jn.',
    requestedDuration: 2.5,
    predictedDuration: 2.7,
    historicalSamples: [2.4, 2.6, 2.8, 2.7, 2.9],
    preferredTimeWindow: '03:00–05:30',
    priority: 'High',
    priorityScore: 83,
    factors: { safetyImpact: 24, assetCriticality: 22, urgency: 17, failureProbability: 11, operationalImpact: 9 },
    deadline: '06 Sep 2026',
    constraints: 'Requires rail tensor and joint gap shims.',
    resources: 'Rail tensor set, 1 PWI/Chengannur, 12 Track Maintainers',
    status: 'Pending',
    submissionDate: '2026-09-04 19:10'
  }
];

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

export const TVC_BLOCKS: MaintenanceBlock[] = [
  {
    id: 'BLK-TVC-301',
    sectionId: 'KYJ-QLN',
    sectionName: 'KYJ–QLN (Kayamkulam–Kollam)',
    departments: ['Engineering', 'TRD'],
    requestIds: ['REQ-TVC-301'],
    workSummary: 'Track geometry tamping on UP line (Ochira–Sasthankotta)',
    scheduledStart: '02:00',
    scheduledEnd: '04:30',
    actualStart: '02:00',
    expectedEnd: '04:30',
    durationHours: 2.5,
    progressPercent: 70,
    status: 'Active',
    priority: 'Critical',
    affectedTrains: ['16346 Netravati Express'],
    crewAssigned: '16 Staff (PWI Kollam)',
    overheadPowerCutRequired: false,
    speedRestrictionImposed: '45 km/h caution order'
  },
  {
    id: 'BLK-TVC-302',
    sectionId: 'QLN-TVC',
    sectionName: 'QLN–TVC (Kollam–Thiruvananthapuram)',
    departments: ['TRD'],
    requestIds: ['REQ-TVC-302'],
    workSummary: 'OHE cantilever replacement near Varkala Sivagiri',
    scheduledStart: '01:30',
    scheduledEnd: '03:30',
    expectedEnd: '03:30',
    durationHours: 2.0,
    progressPercent: 0,
    status: 'Planned',
    priority: 'High',
    affectedTrains: ['12624 Chennai Mail'],
    crewAssigned: '8 Staff (SSE/TRD TVC)',
    overheadPowerCutRequired: true
  }
];

export const TVC_CONFLICTS: OperationalConflict[] = [
  {
    id: 'CONF-TVC-801',
    severity: 'Critical',
    sectionId: 'KYJ-QLN',
    sectionName: 'KYJ–QLN (Kayamkulam–Kollam)',
    blockTime: '02:00–04:30',
    conflictPointTime: '03:40',
    conflictingTrain: TVC_TRAINS[1], // 16346 Netravati Express
    description: 'Requested tamping window directly interferes with scheduled run of 16346 Netravati Express.',
    impactScore: 88,
    status: 'Unresolved',
    alternatives: [
      {
        optionId: 'ALT-TVC-1',
        label: 'Option A: Advance Window to 01:00–03:30',
        window: '01:00–03:30',
        trainImpact: 'Zero Passenger Delay',
        trainDelayMin: 0,
        isRecommended: true,
        reason: 'Track cleared 10 min before Netravati enters section.'
      },
      {
        optionId: 'ALT-TVC-2',
        label: 'Option B: Divert Netravati via Alappuzha (ERS–ALLP–KYJ)',
        window: '02:00–04:30',
        trainImpact: '18 min run-time increase',
        trainDelayMin: 18,
        isRecommended: false,
        reason: 'Requires routing coordination across Alappuzha chord.'
      }
    ]
  },
  {
    id: 'CONF-TVC-802',
    severity: 'High',
    sectionId: 'QLN-TVC',
    sectionName: 'QLN–TVC (Kollam–Thiruvananthapuram)',
    blockTime: '01:30–03:30',
    conflictPointTime: '01:50',
    conflictingTrain: TVC_TRAINS[2], // 12624 Chennai Mail
    description: 'TRD OHE isolation at Varkala delays 12624 Chennai Mail.',
    impactScore: 75,
    status: 'Unresolved',
    alternatives: [
      {
        optionId: 'ALT-TVC-3',
        label: 'Option A: Delay OHE isolation to 02:15–04:15',
        window: '02:15–04:15',
        trainImpact: '0 min delay to 12624',
        trainDelayMin: 0,
        isRecommended: true,
        reason: 'Chennai Mail clears Varkala prior to power shutdown.'
      }
    ]
  }
];

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
