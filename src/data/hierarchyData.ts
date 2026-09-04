import {
  RailwayDivision,
  SectionStationNode,
  MaintenanceWorkZone,
  RailwaySection,
  RailwayStation
} from '../types';

/**
 * ═══════════════════════════════════════════════════════════════
 * HIERARCHICAL RAILWAY DATA MODEL (SCALABLE ARCHITECTURE)
 * Hierarchy: Railway Zone → Division → Section → Station Node → Work Zone → Tasks
 * ═══════════════════════════════════════════════════════════════
 */

export const RAILWAY_DIVISIONS: RailwayDivision[] = [
  {
    id: 'PGT',
    name: 'Palakkad Division',
    code: 'PGT',
    zone: 'Southern Railway (SR)',
    routeKm: 588,
    hq: 'Palakkad (Kerala)',
    isPopulatedDemo: true,
    sectionsCount: 6,
    activeBlocksCount: 3,
    pendingRequestsCount: 8
  },
  {
    id: 'TVC',
    name: 'Thiruvananthapuram Division',
    code: 'TVC',
    zone: 'Southern Railway (SR)',
    routeKm: 625,
    hq: 'Thiruvananthapuram (Kerala)',
    isPopulatedDemo: false,
    sectionsCount: 5,
    activeBlocksCount: 1,
    pendingRequestsCount: 2
  },
  {
    id: 'MAS',
    name: 'Chennai Division',
    code: 'MAS',
    zone: 'Southern Railway (SR)',
    routeKm: 697,
    hq: 'Chennai (Tamil Nadu)',
    isPopulatedDemo: false,
    sectionsCount: 7,
    activeBlocksCount: 2,
    pendingRequestsCount: 4
  },
  {
    id: 'MYS',
    name: 'Mysuru Division',
    code: 'MYS',
    zone: 'South Western Railway (SWR)',
    routeKm: 1109,
    hq: 'Mysuru (Karnataka)',
    isPopulatedDemo: false,
    sectionsCount: 6,
    activeBlocksCount: 1,
    pendingRequestsCount: 3
  }
];

/**
 * Intermediate stations for sections
 * Notice: We strictly use "Station", "Railway Station", or "Station Node" (NEVER "substation")
 */
export const SECTION_STATION_NODES: Record<string, SectionStationNode[]> = {
  // Shoranur Jn – Tirur Section (Primary Prototype Demo)
  'C-D': [
    { id: 'ST-SRR', code: 'SRR', name: 'Shoranur Jn', km: 46.0, junction: true, sectionId: 'C-D', nodeType: 'Junction Station' },
    { id: 'ST-PTB', code: 'PTB', name: 'Pattambi', km: 57.5, junction: false, sectionId: 'C-D', nodeType: 'Intermediate Station' },
    { id: 'ST-PUM', code: 'PUM', name: 'Pallippuram', km: 66.8, junction: false, sectionId: 'C-D', nodeType: 'Intermediate Station' },
    { id: 'ST-KTU', code: 'KTU', name: 'Kuttippuram', km: 75.4, junction: false, sectionId: 'C-D', nodeType: 'Intermediate Station' },
    { id: 'ST-TNA', code: 'TNA', name: 'Tirunnavaya', km: 84.2, junction: false, sectionId: 'C-D', nodeType: 'Intermediate Station' },
    { id: 'ST-TIR', code: 'TIR', name: 'Tirur', km: 91.0, junction: false, sectionId: 'C-D', nodeType: 'Terminal Station' }
  ],
  // Palakkad Jn – Ottappalam Section
  'A-B': [
    { id: 'ST-PGT', code: 'PGT', name: 'Palakkad Jn', km: 0.0, junction: true, sectionId: 'A-B', nodeType: 'Junction Station' },
    { id: 'ST-PLL', code: 'PLL', name: 'Parli', km: 8.5, junction: false, sectionId: 'A-B', nodeType: 'Intermediate Station' },
    { id: 'ST-MNY', code: 'MNY', name: 'Mankara', km: 16.2, junction: false, sectionId: 'A-B', nodeType: 'Intermediate Station' },
    { id: 'ST-LDY', code: 'LDY', name: 'Lakkiti', km: 24.1, junction: false, sectionId: 'A-B', nodeType: 'Intermediate Station' },
    { id: 'ST-OTP', code: 'OTP', name: 'Ottappalam', km: 33.0, junction: false, sectionId: 'A-B', nodeType: 'Terminal Station' }
  ],
  // Ottappalam – Shoranur Jn Section
  'B-C': [
    { id: 'ST-OTP2', code: 'OTP', name: 'Ottappalam', km: 33.0, junction: false, sectionId: 'B-C', nodeType: 'Terminal Station' },
    { id: 'ST-MNUR', code: 'MNUR', name: 'Mannanur', km: 39.5, junction: false, sectionId: 'B-C', nodeType: 'Intermediate Station' },
    { id: 'ST-SRR2', code: 'SRR', name: 'Shoranur Jn', km: 46.0, junction: true, sectionId: 'B-C', nodeType: 'Junction Station' }
  ],
  // Tirur – Kozhikode Section
  'D-E': [
    { id: 'ST-TIR2', code: 'TIR', name: 'Tirur', km: 91.0, junction: false, sectionId: 'D-E', nodeType: 'Terminal Station' },
    { id: 'ST-TA', code: 'TA', name: 'Tanur', km: 99.2, junction: false, sectionId: 'D-E', nodeType: 'Intermediate Station' },
    { id: 'ST-PGI', code: 'PGI', name: 'Parappanangadi', km: 107.0, junction: false, sectionId: 'D-E', nodeType: 'Intermediate Station' },
    { id: 'ST-FK', code: 'FK', name: 'Ferok', km: 120.4, junction: false, sectionId: 'D-E', nodeType: 'Intermediate Station' },
    { id: 'ST-CLT', code: 'CLT', name: 'Kozhikode', km: 131.0, junction: true, sectionId: 'D-E', nodeType: 'Junction Station' }
  ],
  // Shoranur – Thrissur Chord
  'C-F': [
    { id: 'ST-SRR3', code: 'SRR', name: 'Shoranur Jn', km: 46.0, junction: true, sectionId: 'C-F', nodeType: 'Junction Station' },
    { id: 'ST-VTK', code: 'VTK', name: 'Vallathol Nagar', km: 50.2, junction: false, sectionId: 'C-F', nodeType: 'Intermediate Station' },
    { id: 'ST-WKI', code: 'WKI', name: 'Wadakancheri', km: 62.1, junction: false, sectionId: 'C-F', nodeType: 'Intermediate Station' },
    { id: 'ST-PNQ', code: 'PNQ', name: 'Punkunnam', km: 76.5, junction: false, sectionId: 'C-F', nodeType: 'Intermediate Station' },
    { id: 'ST-TCR', code: 'TCR', name: 'Thrissur', km: 79.0, junction: true, sectionId: 'C-F', nodeType: 'Junction Station' }
  ],
  // Palakkad – Pollachi Branch
  'A-G': [
    { id: 'ST-PGT2', code: 'PGT', name: 'Palakkad Jn', km: 0.0, junction: true, sectionId: 'A-G', nodeType: 'Junction Station' },
    { id: 'ST-PGTN', code: 'PGTN', name: 'Palakkad Town', km: 4.2, junction: false, sectionId: 'A-G', nodeType: 'Intermediate Station' },
    { id: 'ST-PDGM', code: 'PDGM', name: 'Pudunagaram', km: 15.0, junction: false, sectionId: 'A-G', nodeType: 'Intermediate Station' },
    { id: 'ST-KLGD', code: 'KLGD', name: 'Kollengode', km: 22.8, junction: false, sectionId: 'A-G', nodeType: 'Intermediate Station' },
    { id: 'ST-MMDA', code: 'MMDA', name: 'Muthalamada', km: 31.0, junction: false, sectionId: 'A-G', nodeType: 'Intermediate Station' },
    { id: 'ST-POY', code: 'POY', name: 'Pollachi Jn', km: 54.0, junction: true, sectionId: 'A-G', nodeType: 'Junction Station' }
  ]
};

/**
 * Specific Maintenance Work Zones located between intermediate stations.
 * Notice: These highlight specific track locations, rather than implying the whole section is blocked!
 */
export const MAINTENANCE_WORK_ZONES: MaintenanceWorkZone[] = [
  {
    id: 'WZ-SRR-TIR-01',
    sectionId: 'C-D',
    sectionName: 'Shoranur Jn – Tirur Section',
    startStationCode: 'PTB',
    startStationName: 'Pattambi',
    endStationCode: 'PUM',
    endStationName: 'Pallippuram',
    line: 'UP Line',
    chainage: 'km 598/200 – km 601/400',
    status: 'Operational Conflict',
    criticality: 'High',
    workSummary: 'Integrated Track, OHE & S&T Corridor Possession',
    departments: ['Engineering', 'TRD', 'S&T'],
    estimatedDurationMin: 60,
    preferredWindow: '02:00 – 04:00',
    affectedTrains: [
      {
        trainNo: '12617',
        trainName: 'Mangala Lakshadweep Superfast Express',
        category: 'Superfast Express',
        scheduledPassage: '03:15 IST',
        impact: 'Overlaps uncoordinated slot by 15 min'
      },
      {
        trainNo: '16347',
        trainName: 'Mangalore Express',
        category: 'Mail/Express',
        scheduledPassage: '03:42 IST',
        impact: 'Headway buffer affected if block overruns'
      }
    ],
    conflictStatus: 'Operational Conflict',
    conflictDetail: 'Uncoordinated individual requests clash with 12617 Mangala Exp passage at 03:15 IST on UP mainline.',
    tasks: [
      {
        id: 'TASK-ENG-01',
        dept: 'Engineering',
        workType: 'Track maintenance & 09-3X Tamping',
        durationMin: 60,
        description: 'Deep tamping & track alignment correction between km 598/200 and 601/400.',
        priority: 'High',
        resources: 'Plasser 09-3X Tamper, 1 PWI, 16 Trackmen'
      },
      {
        id: 'TASK-TRD-01',
        dept: 'TRD',
        workType: 'OHE inspection & Cantilever audit',
        durationMin: 30,
        description: 'Inspection of 25kV catenary wire, dropper adjustment, and insulator washing.',
        priority: 'Medium',
        resources: '8-Wheeler Tower Wagon, 1 SSE/TRD, 5 Linemen'
      },
      {
        id: 'TASK-SNT-01',
        dept: 'S&T',
        workType: 'Signal & telecom maintenance',
        durationMin: 20,
        description: 'High-availability digital axle counter (HASSDAC) insulation test and point machine check.',
        priority: 'High',
        resources: 'Digital Megger kit, 1 SSE/Signal, 2 Technicians'
      }
    ],
    optimization: {
      compatibleTasksCount: 3,
      combinedBlockDurationMin: 60,
      recommendedWindow: '02:30 – 03:30',
      operationalImpact: 'Low',
      conflictsAvoided: 2,
      timeSavedMin: 50,
      synergyScore: 96,
      explanation: 'SolveX multi-departmental bundling engine identified simultaneous possession opportunity on the UP Line between Pattambi (PTB) and Pallippuram (PUM). Civil Engineering tamping (60m), TRD catenary inspection (30m), and S&T axle counter calibration (20m) execute concurrently in ONE 60-minute coordinated block (02:30–03:30), bypassing 12617 Express passage and eliminating 50 minutes of isolated track downtime.',
      alternativeWindows: [
        {
          id: 'ALT-1',
          window: '02:30 – 03:30',
          durationMin: 60,
          operationalImpact: 'Low',
          conflicts: 0,
          isRecommended: true,
          reason: 'Clear 60m path between Express 16343 and 12617; 0 passenger train detentions.'
        },
        {
          id: 'ALT-2',
          window: '03:15 – 04:15',
          durationMin: 60,
          operationalImpact: 'Medium',
          conflicts: 1,
          reason: 'Requires regulating container freight BOXN-4022 at Shoranur yard for 14 min.'
        },
        {
          id: 'ALT-3',
          window: '01:45 – 02:45',
          durationMin: 60,
          operationalImpact: 'Medium',
          conflicts: 1,
          reason: 'Compresses signaling headway behind Down Malabar Express.'
        }
      ],
      approvalStatus: 'Pending Review'
    }
  },
  {
    id: 'WZ-SRR-TIR-02',
    sectionId: 'C-D',
    sectionName: 'Shoranur Jn – Tirur Section',
    startStationCode: 'PUM',
    startStationName: 'Pallippuram',
    endStationCode: 'KTU',
    endStationName: 'Kuttippuram',
    line: 'DN Line',
    chainage: 'km 604/100 – km 606/300',
    status: 'Pending',
    criticality: 'Medium',
    workSummary: 'Rail Joint Welding & S&T Track Circuit Calibration',
    departments: ['Engineering', 'S&T'],
    estimatedDurationMin: 45,
    preferredWindow: '04:00 – 04:45',
    affectedTrains: [
      {
        trainNo: '16604',
        trainName: 'Maveli Express',
        category: 'Mail/Express',
        scheduledPassage: '04:55 IST',
        impact: 'Safe 10-minute clear buffer'
      }
    ],
    conflictStatus: 'Potential Conflict',
    conflictDetail: 'Work zone sits adjacent to UP track crossover switch 14B.',
    tasks: [
      {
        id: 'TASK-ENG-02',
        dept: 'Engineering',
        workType: 'Thermit Weld Renewal & Rail Grinding',
        durationMin: 45,
        description: 'USFD weld defect renewal at km 605/12-14 with fishplate temporary joint.',
        priority: 'Medium',
        resources: 'Thermit crew, 1 PWI, 8 Gangmen'
      },
      {
        id: 'TASK-SNT-02',
        dept: 'S&T',
        workType: 'AFTC Track Circuit Tuning',
        durationMin: 25,
        description: 'Tuning audio frequency track circuit receiver sensitivity post-grinding.',
        priority: 'Low',
        resources: 'AFTC analyzer, 1 Inspector'
      }
    ],
    optimization: {
      compatibleTasksCount: 2,
      combinedBlockDurationMin: 45,
      recommendedWindow: '04:00 – 04:45',
      operationalImpact: 'Low',
      conflictsAvoided: 1,
      timeSavedMin: 25,
      synergyScore: 91,
      explanation: 'S&T tuning synchronized with Engineering rail weld finishing on DN Line, releasing track 10 minutes prior to Maveli Express arrival.',
      alternativeWindows: [
        {
          id: 'ALT-201',
          window: '04:00 – 04:45',
          durationMin: 45,
          operationalImpact: 'Low',
          conflicts: 0,
          isRecommended: true,
          reason: 'Optimal pre-dawn traffic lull; 0 delays recorded.'
        },
        {
          id: 'ALT-202',
          window: '05:00 – 05:45',
          durationMin: 45,
          operationalImpact: 'High',
          conflicts: 2,
          reason: 'Causes 20m detention to morning commuter MEMU.'
        }
      ],
      approvalStatus: 'Pending Review'
    }
  },
  {
    id: 'WZ-SRR-TIR-03',
    sectionId: 'C-D',
    sectionName: 'Shoranur Jn – Tirur Section',
    startStationCode: 'KTU',
    startStationName: 'Kuttippuram',
    endStationCode: 'TNA',
    endStationName: 'Tirunnavaya',
    line: 'UP Line',
    chainage: 'km 612/000 – km 613/500',
    status: 'Scheduled',
    criticality: 'Low',
    workSummary: 'Routine Sleeper Ultrasonic Flaw Inspection',
    departments: ['Engineering'],
    estimatedDurationMin: 30,
    preferredWindow: '05:00 – 05:30',
    affectedTrains: [],
    conflictStatus: 'No Conflict',
    tasks: [
      {
        id: 'TASK-ENG-03',
        dept: 'Engineering',
        workType: 'Ultrasonic Flaw Detection (USFD)',
        durationMin: 30,
        description: 'Trolley USFD testing of rails between km 612 and 613.5.',
        priority: 'Low',
        resources: 'Digital USFD trolley, 2 Operators'
      }
    ],
    optimization: {
      compatibleTasksCount: 1,
      combinedBlockDurationMin: 30,
      recommendedWindow: '05:00 – 05:30',
      operationalImpact: 'Low',
      conflictsAvoided: 0,
      timeSavedMin: 0,
      synergyScore: 82,
      explanation: 'Single-department mobile trolley inspection; non-infringing on adjacent track.',
      alternativeWindows: [
        {
          id: 'ALT-301',
          window: '05:00 – 05:30',
          durationMin: 30,
          operationalImpact: 'Low',
          conflicts: 0,
          isRecommended: true,
          reason: 'Natural gap in timetable; no train precedence change needed.'
        }
      ],
      approvalStatus: 'Pending Review'
    }
  },
  {
    id: 'WZ-PGT-OTP-01',
    sectionId: 'A-B',
    sectionName: 'Palakkad Jn – Ottappalam Section',
    startStationCode: 'MNY',
    startStationName: 'Mankara',
    endStationCode: 'LDY',
    endStationName: 'Lakkiti',
    line: 'UP Line',
    chainage: 'km 531/000 – km 534/200',
    status: 'Operational Conflict',
    criticality: 'High',
    workSummary: 'Heavy Ballast Tamping & Catenary Overhaul',
    departments: ['Engineering', 'TRD'],
    estimatedDurationMin: 90,
    preferredWindow: '02:00 – 03:30',
    affectedTrains: [
      {
        trainNo: '12617',
        trainName: 'Mangala Lakshadweep Express',
        category: 'Superfast Express',
        scheduledPassage: '02:40 IST',
        impact: 'Path intersection at km 532'
      }
    ],
    conflictStatus: 'Operational Conflict',
    conflictDetail: 'Clashes with Express train 12617 UP movement at Mankara.',
    tasks: [
      {
        id: 'TASK-ENG-04',
        dept: 'Engineering',
        workType: 'Dynamic Track Stabilizer & Tamping',
        durationMin: 90,
        description: 'Tamping turnout 102A and UP mainline packing.',
        priority: 'High',
        resources: 'Duomatic 09-3X, 18 Staff'
      },
      {
        id: 'TASK-TRD-03',
        dept: 'TRD',
        workType: 'Section Isolator & Catenary Check',
        durationMin: 45,
        description: 'Insulator washing and dropper height gauge audit.',
        priority: 'Medium',
        resources: 'Tower wagon 8W'
      }
    ],
    optimization: {
      compatibleTasksCount: 2,
      combinedBlockDurationMin: 90,
      recommendedWindow: '02:00 – 03:30',
      operationalImpact: 'Medium',
      conflictsAvoided: 1,
      timeSavedMin: 45,
      synergyScore: 89,
      explanation: 'Combined track tamping with OHE power block; OHE restored 20 minutes before track handover.',
      alternativeWindows: [
        {
          id: 'ALT-401',
          window: '02:00 – 03:30',
          durationMin: 90,
          operationalImpact: 'Medium',
          conflicts: 1,
          isRecommended: true,
          reason: 'Best fit with 14 min regulation on freight.'
        }
      ],
      approvalStatus: 'Pending Review'
    }
  }
];

/**
 * Helper to fetch division by code or ID
 */
export const getDivisionById = (divisionId: string): RailwayDivision => {
  return RAILWAY_DIVISIONS.find(d => d.id === divisionId || d.code === divisionId) || RAILWAY_DIVISIONS[0];
};

/**
 * Helper to fetch intermediate stations for a given section
 */
export const getSectionStations = (sectionId: string): SectionStationNode[] => {
  return SECTION_STATION_NODES[sectionId] || [];
};

/**
 * Helper to fetch work zones for a given section
 */
export const getWorkZonesForSection = (sectionId: string): MaintenanceWorkZone[] => {
  return MAINTENANCE_WORK_ZONES.filter(wz => wz.sectionId === sectionId);
};

/**
 * Unified hierarchical search helper
 * Searches Divisions, Sections, Stations, Work Zones, Trains, and Maintenance Requests
 */
export interface SearchResultItem {
  id: string;
  type: 'Station' | 'Section' | 'Work Zone' | 'Train' | 'Request' | 'Division';
  title: string;
  subtitle: string;
  divisionId: string;
  sectionId?: string;
  workZoneId?: string;
  actionHint: string;
}

export const searchHierarchy = (
  query: string,
  sections: RailwaySection[],
  currentDivisionId: string = 'PGT'
): SearchResultItem[] => {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResultItem[] = [];

  // 1. Search Divisions
  RAILWAY_DIVISIONS.forEach(div => {
    if (div.name.toLowerCase().includes(q) || div.code.toLowerCase().includes(q)) {
      results.push({
        id: `DIV-${div.id}`,
        type: 'Division',
        title: div.name,
        subtitle: `${div.zone} · ${div.routeKm} Route km`,
        divisionId: div.id,
        actionHint: 'Switch to Division'
      });
    }
  });

  // 2. Search Sections
  sections.forEach(sec => {
    if (
      sec.id.toLowerCase().includes(q) ||
      sec.fromCode.toLowerCase().includes(q) ||
      sec.toCode.toLowerCase().includes(q) ||
      sec.fromName.toLowerCase().includes(q) ||
      sec.toName.toLowerCase().includes(q)
    ) {
      results.push({
        id: `SEC-${sec.id}`,
        type: 'Section',
        title: `${sec.fromName} (${sec.fromCode}) ↔ ${sec.toName} (${sec.toCode})`,
        subtitle: `Section ${sec.id} · ${sec.lengthKm} km · ${sec.status}`,
        divisionId: currentDivisionId,
        sectionId: sec.id,
        actionHint: 'Drill down into Section'
      });
    }
  });

  // 3. Search Stations (both major stations and intermediate station nodes)
  Object.entries(SECTION_STATION_NODES).forEach(([secId, nodes]) => {
    nodes.forEach(node => {
      if (
        node.name.toLowerCase().includes(q) ||
        node.code.toLowerCase().includes(q)
      ) {
        // avoid duplicates
        if (!results.some(r => r.title.includes(node.name) && r.type === 'Station')) {
          results.push({
            id: `ST-${node.code}`,
            type: 'Station',
            title: `${node.name} (${node.code})`,
            subtitle: `${node.nodeType} · km ${node.km} · Section ${node.sectionId}`,
            divisionId: currentDivisionId,
            sectionId: node.sectionId,
            actionHint: 'View in Section Map'
          });
        }
      }
    });
  });

  // 4. Search Work Zones
  MAINTENANCE_WORK_ZONES.forEach(wz => {
    if (
      wz.id.toLowerCase().includes(q) ||
      wz.workSummary.toLowerCase().includes(q) ||
      wz.startStationName.toLowerCase().includes(q) ||
      wz.endStationName.toLowerCase().includes(q) ||
      wz.startStationCode.toLowerCase().includes(q) ||
      wz.endStationCode.toLowerCase().includes(q) ||
      wz.chainage.toLowerCase().includes(q) ||
      wz.departments.some(d => d.toLowerCase().includes(q))
    ) {
      results.push({
        id: wz.id,
        type: 'Work Zone',
        title: `Work Zone: ${wz.startStationName}–${wz.endStationName} (${wz.line})`,
        subtitle: `${wz.workSummary} · ${wz.chainage} · ${wz.departments.join(' + ')}`,
        divisionId: currentDivisionId,
        sectionId: wz.sectionId,
        workZoneId: wz.id,
        actionHint: 'Inspect SolveX Block Optimization'
      });
    }
  });

  // 5. Search Trains
  const simulatedTrains = [
    { no: '12617', name: 'Mangala Lakshadweep Superfast Express', section: 'C-D', wzId: 'WZ-SRR-TIR-01' },
    { no: '16347', name: 'Mangalore Express', section: 'C-D', wzId: 'WZ-SRR-TIR-01' },
    { no: '16604', name: 'Maveli Express', section: 'C-D', wzId: 'WZ-SRR-TIR-02' },
    { no: '4022', name: 'BOXN-4022 Container Freight', section: 'C-F' },
    { no: '20631', name: 'Vande Bharat Express', section: 'A-B' }
  ];

  simulatedTrains.forEach(t => {
    if (t.no.includes(q) || t.name.toLowerCase().includes(q)) {
      results.push({
        id: `TRAIN-${t.no}`,
        type: 'Train',
        title: `${t.no} ${t.name}`,
        subtitle: `Simulated path through Section ${t.section}`,
        divisionId: currentDivisionId,
        sectionId: t.section,
        workZoneId: t.wzId,
        actionHint: 'View Track Section'
      });
    }
  });

  return results.slice(0, 8);
};
