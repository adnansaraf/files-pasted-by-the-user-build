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
    id: 'A-B',
    fromCode: 'PGT',
    toCode: 'OTP',
    fromName: 'Palakkad Jn',
    toName: 'Ottappalam',
    lengthKm: 33,
    tracks: 'Double Line',
    traction: '25 kV AC Electrified',
    mps: 110,
    status: 'Maintenance Planned',
    plannedBlockIds: ['BLK-204'],
    currentSpeedRestriction: '45 km/h at km 528/4-8'
  },
  {
    id: 'B-C',
    fromCode: 'OTP',
    toCode: 'SRR',
    fromName: 'Ottappalam',
    toName: 'Shoranur Jn',
    lengthKm: 13,
    tracks: 'Double Line',
    traction: '25 kV AC Electrified',
    mps: 100,
    status: 'Available'
  },
  {
    id: 'C-D',
    fromCode: 'SRR',
    toCode: 'TIR',
    fromName: 'Shoranur Jn',
    toName: 'Tirur',
    lengthKm: 45,
    tracks: 'Double Line',
    traction: '25 kV AC Electrified',
    mps: 110,
    status: 'Active Block',
    activeBlockId: 'BLK-205'
  },
  {
    id: 'D-E',
    fromCode: 'TIR',
    toCode: 'CLT',
    fromName: 'Tirur',
    toName: 'Kozhikode',
    lengthKm: 41,
    tracks: 'Double Line',
    traction: '25 kV AC Electrified',
    mps: 110,
    status: 'Conflict',
    plannedBlockIds: ['BLK-206']
  },
  {
    id: 'C-F',
    fromCode: 'SRR',
    toCode: 'TCR',
    fromName: 'Shoranur Jn',
    toName: 'Thrissur',
    lengthKm: 33,
    tracks: 'Double Line',
    traction: '25 kV AC Electrified',
    mps: 105,
    status: 'Available'
  },
  {
    id: 'A-G',
    fromCode: 'PGT',
    toCode: 'POY',
    fromName: 'Palakkad Jn',
    toName: 'Pollachi Jn',
    lengthKm: 54,
    tracks: 'Single Line',
    traction: '25 kV AC Electrified',
    mps: 90,
    status: 'Speed Restriction',
    currentSpeedRestriction: '30 km/h ghat section'
  }
];

export const INITIAL_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'REQ-1024',
    dept: 'Engineering',
    sectionId: 'A-B',
    sectionName: 'PGT–OTP (Palakkad–Ottappalam)',
    workType: 'Track Geometry Correction & Tamping',
    description: '09-3X Dynamic Tamper deep tamping on UP line from km 531/0 to 534/2 including turnout packing.',
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
    submissionDate: '2026-08-26 14:30'
  },
  {
    id: 'REQ-1025',
    dept: 'TRD',
    sectionId: 'A-B',
    sectionName: 'PGT–OTP (Palakkad–Ottappalam)',
    workType: 'OHE Contact Wire & Dropper Inspection',
    description: 'Annual tower wagon inspection of 25kV catenary wire, dropper adjustment, and insulator washing.',
    requestedDuration: 2.0,
    predictedDuration: 2.3,
    historicalSamples: [2.0, 2.2, 2.4, 2.3, 2.5],
    preferredTimeWindow: '02:00–05:00',
    priority: 'Medium',
    priorityScore: 68,
    factors: { safetyImpact: 19, assetCriticality: 18, urgency: 14, failureProbability: 9, operationalImpact: 8 },
    deadline: 'Tonight (Shift 3)',
    constraints: 'Requires 25kV traction power shutdown (OHE isolated from Substation PGT).',
    resources: '8-Wheeler Tower Wagon, 1 SSE/TRD, 6 Linemen',
    status: 'Pending',
    submissionDate: '2026-08-26 16:15'
  },
  {
    id: 'REQ-1026',
    dept: 'S&T',
    sectionId: 'A-B',
    sectionName: 'PGT–OTP (Palakkad–Ottappalam)',
    workType: 'Signal Relay & Axle Counter Calibration',
    description: 'Routine calibration of HASSDAC digital axle counters and point machine 102B insulation testing.',
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
    submissionDate: '2026-08-26 17:00'
  },
  {
    id: 'REQ-1027',
    dept: 'Engineering',
    sectionId: 'B-C',
    sectionName: 'OTP–SRR (Ottappalam–Shoranur)',
    workType: 'Rail Weld Renewal & Ultrasonic Flaw Detection',
    description: 'Thermit weld replacement at km 562/14-16 following USFD defect detection.',
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
    submissionDate: '2026-08-26 18:20'
  },
  {
    id: 'REQ-1028',
    dept: 'TRD',
    sectionId: 'C-D',
    sectionName: 'SRR–TIR (Shoranur–Tirur)',
    workType: 'OHE Mast Foundation & Cantilever Audit',
    description: 'Audit of cantilever assemblies and corrosion inspection on Bharathapuzha coastal stretch.',
    requestedDuration: 2.0,
    predictedDuration: 2.2,
    historicalSamples: [2.1, 2.2, 2.3, 2.0, 2.4],
    preferredTimeWindow: '01:30–03:30',
    priority: 'High',
    priorityScore: 79,
    factors: { safetyImpact: 22, assetCriticality: 20, urgency: 16, failureProbability: 11, operationalImpact: 10 },
    deadline: '28 Aug 2026',
    constraints: 'Requires auxiliary feeder de-energization.',
    resources: 'Tower wagon unit 4, 1 JE/TRD, 4 Staff',
    status: 'Planned',
    submissionDate: '2026-08-26 11:10'
  },
  {
    id: 'REQ-1029',
    dept: 'S&T',
    sectionId: 'D-E',
    sectionName: 'TIR–CLT (Tirur–Kozhikode)',
    workType: 'Audio Frequency Track Circuit (AFTC) Testing',
    description: 'Testing of tuned zones and receiver units across 4 consecutive track circuits.',
    requestedDuration: 1.5,
    predictedDuration: 1.7,
    historicalSamples: [1.4, 1.6, 1.8, 1.7, 1.9],
    preferredTimeWindow: '04:00–05:30',
    priority: 'Medium',
    priorityScore: 61,
    factors: { safetyImpact: 16, assetCriticality: 16, urgency: 13, failureProbability: 9, operationalImpact: 7 },
    deadline: '29 Aug 2026',
    constraints: 'Non-interfering with adjacent UP mainline.',
    resources: 'AFTC analyzer, 1 Telecom Inspector, 2 Techs',
    status: 'Pending',
    submissionDate: '2026-08-26 09:40'
  },
  {
    id: 'REQ-1030',
    dept: 'Engineering',
    sectionId: 'C-F',
    sectionName: 'SRR–TCR (Shoranur–Thrissur)',
    workType: 'Ballast Deep Screening Machine (BCM)',
    description: 'BCM deployment for continuous shoulder ballast cleaning and muck removal.',
    requestedDuration: 4.0,
    predictedDuration: 4.6,
    historicalSamples: [4.2, 4.4, 4.8, 4.5, 4.9],
    preferredTimeWindow: '01:00–05:00',
    priority: 'High',
    priorityScore: 84,
    factors: { safetyImpact: 24, assetCriticality: 22, urgency: 17, failureProbability: 11, operationalImpact: 10 },
    deadline: '30 Aug 2026',
    constraints: 'Full track possession with OHE slewing equipment.',
    resources: 'Plasser BCM rake, 2 Loco Pilots, 24 Gangmen',
    status: 'Pending',
    submissionDate: '2026-08-26 08:15'
  },
  {
    id: 'REQ-1031',
    dept: 'TRD',
    sectionId: 'A-G',
    sectionName: 'PGT–POY (Palakkad–Pollachi)',
    workType: 'Substation Transformer Bushing Replacement',
    description: 'Muthalamada TSS 132kV/25kV 21.6MVA power transformer routine oil filtration and seal check.',
    requestedDuration: 3.5,
    predictedDuration: 3.7,
    historicalSamples: [3.4, 3.6, 3.8, 3.7, 3.9],
    preferredTimeWindow: '10:00–13:30',
    priority: 'Low',
    priorityScore: 45,
    factors: { safetyImpact: 12, assetCriticality: 12, urgency: 8, failureProbability: 6, operationalImpact: 7 },
    deadline: '02 Sep 2026',
    constraints: 'Feed to be back-fed from Shoranur FP (Feeding Post).',
    resources: 'Transformer filtration plant, 1 ADEE/TRD',
    status: 'Pending',
    submissionDate: '2026-08-25 17:50'
  },
  {
    id: 'REQ-1032',
    dept: 'Engineering',
    sectionId: 'A-B',
    sectionName: 'PGT–OTP (Palakkad–Ottappalam)',
    workType: 'Bridge Girder Painting & Bearing Greasing',
    description: 'Bridge No. 1102 over Kanjirapuzha tributary maintenance and inspection.',
    requestedDuration: 2.0,
    predictedDuration: 2.4,
    historicalSamples: [2.2, 2.3, 2.5, 2.6, 2.4],
    preferredTimeWindow: '09:00–11:00',
    priority: 'Medium',
    priorityScore: 64,
    factors: { safetyImpact: 17, assetCriticality: 16, urgency: 13, failureProbability: 9, operationalImpact: 9 },
    deadline: '31 Aug 2026',
    constraints: 'Scaffolding requires temporary speed restriction.',
    resources: 'Bridge Inspector PGT, 8 Khalasis',
    status: 'Pending',
    submissionDate: '2026-08-26 12:00'
  },
  {
    id: 'REQ-1033',
    dept: 'S&T',
    sectionId: 'B-C',
    sectionName: 'OTP–SRR (Ottappalam–Shoranur)',
    workType: 'Electronic Interlocking (EI) Diagnostic Audit',
    description: 'Redundant CPU card firmware synchronisation and fault log clearing at Shoranur cabin B.',
    requestedDuration: 1.5,
    predictedDuration: 1.6,
    historicalSamples: [1.4, 1.5, 1.7, 1.6, 1.8],
    preferredTimeWindow: '02:30–04:00',
    priority: 'High',
    priorityScore: 81,
    factors: { safetyImpact: 23, assetCriticality: 22, urgency: 16, failureProbability: 10, operationalImpact: 10 },
    deadline: 'Tonight',
    constraints: 'Station Master coordination required; manual route setting standby.',
    resources: 'Medha EI software laptop, 1 DSTE/Shoranur',
    status: 'Pending',
    submissionDate: '2026-08-26 19:10'
  },
  {
    id: 'REQ-1034',
    dept: 'Engineering',
    sectionId: 'D-E',
    sectionName: 'TIR–CLT (Tirur–Kozhikode)',
    workType: 'Turnout Switch Expansion Joint (SEJ) Gap Adjustment',
    description: 'Adjustment of 4 SEJs on coastal curvature due to thermal expansion.',
    requestedDuration: 2.0,
    predictedDuration: 2.3,
    historicalSamples: [2.1, 2.2, 2.4, 2.5, 2.3],
    preferredTimeWindow: '03:00–05:00',
    priority: 'High',
    priorityScore: 78,
    factors: { safetyImpact: 22, assetCriticality: 20, urgency: 16, failureProbability: 11, operationalImpact: 9 },
    deadline: 'Tonight',
    constraints: 'Requires track de-stressing clamps.',
    resources: '1 PWI/Kozhikode, 10 Track Maintainers',
    status: 'Pending',
    submissionDate: '2026-08-26 16:50'
  },
  {
    id: 'REQ-1035',
    dept: 'TRD',
    sectionId: 'B-C',
    sectionName: 'OTP–SRR (Ottappalam–Shoranur)',
    workType: 'Neutral Section Assembly Inspection',
    description: 'PTFE neutral section mechanical wear measurement at km 560/2.',
    requestedDuration: 1.5,
    predictedDuration: 1.8,
    historicalSamples: [1.6, 1.7, 1.9, 1.8, 2.0],
    preferredTimeWindow: '03:30–05:00',
    priority: 'Medium',
    priorityScore: 66,
    factors: { safetyImpact: 18, assetCriticality: 17, urgency: 14, failureProbability: 9, operationalImpact: 8 },
    deadline: '28 Aug 2026',
    constraints: 'Electric locos to coast through during test.',
    resources: 'OHE ladder trolley, 1 JE/TRD',
    status: 'Pending',
    submissionDate: '2026-08-26 15:40'
  }
];

export const TRAIN_MOVEMENTS: TrainMovement[] = [
  {
    trainNo: '12617',
    trainName: 'Mangala Lakshadweep Superfast',
    category: 'Superfast Express',
    sectionId: 'A-B',
    entryTime: '03:15',
    exitTime: '03:38',
    priority: 2,
    allowedDelayMin: 15
  },
  {
    trainNo: '20631',
    trainName: 'Kasaragod–TVC Vande Bharat',
    category: 'Vande Bharat',
    sectionId: 'D-E',
    entryTime: '07:22',
    exitTime: '07:44',
    priority: 1,
    allowedDelayMin: 5
  },
  {
    trainNo: '12626',
    trainName: 'Kerala Superfast Express',
    category: 'Superfast Express',
    sectionId: 'A-B',
    entryTime: '01:25',
    exitTime: '01:48',
    priority: 2,
    allowedDelayMin: 15
  },
  {
    trainNo: '16347',
    trainName: 'Mangalore Express',
    category: 'Mail/Express',
    sectionId: 'C-D',
    entryTime: '02:10',
    exitTime: '02:45',
    priority: 3,
    allowedDelayMin: 25
  },
  {
    trainNo: '12686',
    trainName: 'Mangaluru–Chennai Superfast',
    category: 'Superfast Express',
    sectionId: 'B-C',
    entryTime: '04:10',
    exitTime: '04:24',
    priority: 2,
    allowedDelayMin: 15
  },
  {
    trainNo: 'BOXN-4022',
    trainName: 'Cochin Port Container Rake',
    category: 'Freight',
    sectionId: 'C-F',
    entryTime: '02:40',
    exitTime: '03:15',
    priority: 4,
    allowedDelayMin: 60
  },
  {
    trainNo: 'BTPN-7810',
    trainName: 'BPCL Petroleum Rake',
    category: 'Freight',
    sectionId: 'A-B',
    entryTime: '05:30',
    exitTime: '06:05',
    priority: 4,
    allowedDelayMin: 45
  },
  {
    trainNo: '06797',
    trainName: 'Palakkad–Ernakulam MEMU',
    category: 'MEMU Passenger',
    sectionId: 'A-B',
    entryTime: '06:20',
    exitTime: '06:48',
    priority: 4,
    allowedDelayMin: 20
  }
];

export const INITIAL_BLOCKS: MaintenanceBlock[] = [
  {
    id: 'BLK-204',
    sectionId: 'A-B',
    sectionName: 'PGT–OTP (Palakkad–Ottappalam)',
    departments: ['Engineering', 'TRD'],
    requestIds: ['REQ-1024', 'REQ-1025'],
    workSummary: 'Track geometry tamping + OHE catenary dropper overhaul',
    scheduledStart: '02:00',
    scheduledEnd: '04:00',
    actualStart: '02:05',
    expectedEnd: '04:45', // OVERRUN SCENARIO
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
    id: 'BLK-205',
    sectionId: 'C-D',
    sectionName: 'SRR–TIR (Shoranur–Tirur)',
    departments: ['S&T'],
    requestIds: ['REQ-1028'],
    workSummary: 'Axle counter heads replacement & cable insulation test',
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
    id: 'BLK-206',
    sectionId: 'B-C',
    sectionName: 'OTP–SRR (Ottappalam–Shoranur)',
    departments: ['Engineering'],
    requestIds: ['REQ-1027'],
    workSummary: 'Thermit weld renewal at km 562/14-16',
    scheduledStart: '05:00',
    scheduledEnd: '07:00',
    expectedEnd: '07:00',
    durationHours: 2.0,
    progressPercent: 0,
    status: 'Planned',
    priority: 'Critical',
    affectedTrains: ['12686 Superfast', '06797 MEMU'],
    crewAssigned: '14 Trackmen (PWI OTP)',
    overheadPowerCutRequired: false,
    speedRestrictionImposed: '20 km/h pilot train'
  }
];

export const INITIAL_CONFLICTS: OperationalConflict[] = [
  {
    id: 'CONF-801',
    severity: 'Critical',
    sectionId: 'A-B',
    sectionName: 'PGT–OTP (Palakkad–Ottappalam)',
    blockTime: '02:00–05:00',
    conflictPointTime: '03:15',
    conflictingTrain: TRAIN_MOVEMENTS[0], // 12617 Mangala Exp
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
    id: 'CONF-802',
    severity: 'High',
    sectionId: 'D-E',
    sectionName: 'TIR–CLT (Tirur–Kozhikode)',
    blockTime: '04:00–05:30',
    conflictPointTime: '04:45',
    conflictingTrain: {
      trainNo: '16606',
      trainName: 'Ernad Express',
      category: 'Mail/Express',
      sectionId: 'D-E',
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
    id: 'CONF-803',
    severity: 'Medium',
    sectionId: 'C-F',
    sectionName: 'SRR–TCR (Shoranur–Thrissur)',
    blockTime: '01:00–05:00',
    conflictPointTime: '02:40',
    conflictingTrain: TRAIN_MOVEMENTS[5], // Freight BOXN-4022
    description: 'BCM Ballast screening block holds container freight from Cochin Port.',
    impactScore: 48,
    status: 'Unresolved',
    alternatives: [
      {
        optionId: 'ALT-6',
        label: 'Option A: Regulate freight at Vallathol Nagar loop',
        window: '01:00–05:00',
        trainImpact: '25 min freight regulation (Acceptable)',
        trainDelayMin: 25,
        isRecommended: true,
        reason: 'Freight has 60 min delay tolerance buffer.'
      }
    ]
  },
  {
    id: 'CONF-804',
    severity: 'Resolved',
    sectionId: 'C-D',
    sectionName: 'SRR–TIR (Shoranur–Tirur)',
    blockTime: '01:30–03:30',
    conflictPointTime: '02:10',
    conflictingTrain: TRAIN_MOVEMENTS[3], // 16347 Mangalore Exp
    description: 'Single-line working arranged via DOWN line; pilot pilotage active.',
    impactScore: 20,
    status: 'Resolved',
    alternatives: []
  }
];

export const INITIAL_OPTIMIZATION_PLAN: OptimizationPlan = {
  id: 'OPT-PGT-308',
  timestamp: '26 Aug 2026, 01:42 IST',
  targetSection: 'A-B (PGT–OTP: Palakkad–Ottappalam)',
  recommendedWindow: '02:00–05:00',
  departments: ['Engineering', 'TRD', 'S&T'],
  coordinatedRequestIds: ['REQ-1024', 'REQ-1025', 'REQ-1026'],
  overallScore: 87,
  reasons: [
    'Combines 3 departmental requests into a single 3-hour corridor possession window',
    'Same physical section (PGT–OTP km 531–534) enables zero duplicated track handovers',
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
      sectionId: 'A-B',
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
      sectionId: 'A-B',
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
      sectionId: 'A-B',
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

export const OVERRUN_SCENARIO_DATA: OverrunScenario = {
  blockId: 'BLK-204',
  sectionId: 'A-B',
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
      description: 'Pilot trains on adjacent line between Palakkad and Ottappalam under paper line clear ticket.',
      trainImpactMin: 28,
      maintenanceImpact: 'Engineering gets full time requested, but sectional capacity drops by 60%.',
      conflicts: 2,
      assetAvailability: 88,
      isRecommended: false,
      reasoning: 'High operational workload on station masters and risk of line congestion.'
    }
  ]
};
