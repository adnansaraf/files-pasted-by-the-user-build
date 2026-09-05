import {
  RailwayDivision,
  SectionStationNode,
  MaintenanceWorkZone,
  RailwaySection,
  RailwayStation,
  TractionFacility,
  FreightFacility,
  JunctionDetail
} from '../types';

/**
 * ═══════════════════════════════════════════════════════════════
 * HIERARCHICAL RAILWAY DATA MODEL (DIVISION-SPECIFIC REALISTIC TOPOLOGY)
 * Hierarchy: Railway Zone → Division → Route → Section → Station Node → Work Zone → Tasks
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
    sectionsCount: 8,
    activeBlocksCount: 3,
    pendingRequestsCount: 14
  },
  {
    id: 'MAQ',
    name: 'Mangaluru Division',
    code: 'MAQ',
    zone: 'Southern Railway / KRCL',
    routeKm: 342,
    hq: 'Mangaluru (Karnataka)',
    isPopulatedDemo: true,
    sectionsCount: 7,
    activeBlocksCount: 2,
    pendingRequestsCount: 8
  },
  {
    id: 'TVC',
    name: 'Thiruvananthapuram Division',
    code: 'TVC',
    zone: 'Southern Railway (SR)',
    routeKm: 625,
    hq: 'Thiruvananthapuram (Kerala)',
    isPopulatedDemo: true,
    sectionsCount: 7,
    activeBlocksCount: 3,
    pendingRequestsCount: 11
  }
];

export interface DivisionMacroNetwork {
  stations: RailwayStation[];
  sectionLines: {
    id: string;
    from: string;
    to: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    name: string;
    labelX: number;
    labelY: number;
    branchType?: 'main' | 'branch' | 'chord';
    isShowcase?: boolean;
  }[];
  sections: RailwaySection[];
}

export const DIVISION_NETWORKS: Record<string, DivisionMacroNetwork> = {
  // ─────────────────────────────────────────────────────────────
  // 1. PALAKKAD DIVISION (PGT) — PRIMARY DEMO DATASET
  // ─────────────────────────────────────────────────────────────
  PGT: {
    stations: [
      { code: 'PTJ', name: 'Podanur Jn', letter: 'A', km: 0, junction: true, x: 80, y: 150 },
      { code: 'PGT', name: 'Palakkad Jn', letter: 'B', km: 54, junction: true, x: 250, y: 150 },
      { code: 'PGTN', name: 'Palakkad Town', letter: 'BT', km: 58, junction: false, x: 250, y: 230 },
      { code: 'POY', name: 'Pollachi Jn', letter: 'P', km: 108, junction: true, x: 250, y: 315 },
      { code: 'OTP', name: 'Ottappalam', letter: 'C', km: 87, junction: false, x: 420, y: 150 },
      { code: 'SRR', name: 'Shoranur Jn', letter: 'D', km: 100, junction: true, x: 590, y: 180 },
      { code: 'NIL', name: 'Nilambur Road', letter: 'NR', km: 166, junction: false, x: 680, y: 60 },
      { code: 'TCR', name: 'Thrissur Connection', letter: 'TC', km: 133, junction: true, x: 590, y: 315 },
      { code: 'TIR', name: 'Tirur', letter: 'E', km: 145, junction: false, x: 760, y: 150 },
      { code: 'CLT', name: 'Kozhikode', letter: 'F', km: 186, junction: true, x: 940, y: 140 },
      { code: 'BDJ', name: 'Vadakara', letter: 'G', km: 232, junction: false, x: 1090, y: 140 },
      { code: 'TLY', name: 'Thalassery', letter: 'H', km: 254, junction: false, x: 1220, y: 140 },
      { code: 'CAN', name: 'Kannur', letter: 'I', km: 275, junction: true, x: 1350, y: 140 },
      { code: 'PAY', name: 'Payyanur', letter: 'J', km: 309, junction: false, x: 1470, y: 140 },
      { code: 'KZE', name: 'Kanhangad', letter: 'K', km: 338, junction: false, x: 1570, y: 140 },
      { code: 'KGQ', name: 'Kasaragod', letter: 'L', km: 361, junction: false, x: 1670, y: 140 },
      { code: 'MAQ', name: 'Mangaluru Central', letter: 'M', km: 407, junction: true, x: 1770, y: 140 }
    ],
    sectionLines: [
      { id: 'PTJ-PGT', from: 'PTJ', to: 'PGT', x1: 80, y1: 150, x2: 250, y2: 150, name: 'Podanur – Palakkad Jn', labelX: 165, labelY: 132, branchType: 'main' },
      { id: 'PGT-SRR', from: 'PGT', to: 'SRR', x1: 250, y1: 150, x2: 590, y2: 180, name: 'Palakkad Jn – Shoranur Jn', labelX: 340, labelY: 172, branchType: 'main' },
      { id: 'SRR-CLT', from: 'SRR', to: 'CLT', x1: 590, y1: 180, x2: 940, y2: 140, name: 'Shoranur Jn – Kozhikode (Showcase)', labelX: 850, labelY: 172, branchType: 'main', isShowcase: true },
      { id: 'CLT-CAN', from: 'CLT', to: 'CAN', x1: 940, y1: 140, x2: 1350, y2: 140, name: 'Kozhikode – Kannur Corridor', labelX: 1150, labelY: 115, branchType: 'main' },
      { id: 'CAN-MAQ', from: 'CAN', to: 'MAQ', x1: 1350, y1: 140, x2: 1770, y2: 140, name: 'Kannur – Mangaluru Coastal Route', labelX: 1560, labelY: 172, branchType: 'main' },
      { id: 'SRR-NIL', from: 'SRR', to: 'NIL', x1: 590, y1: 180, x2: 680, y2: 60, name: 'Shoranur – Nilambur Road Branch', labelX: 655, labelY: 115, branchType: 'branch' },
      { id: 'PGT-PGTN', from: 'PGT', to: 'PGTN', x1: 250, y1: 150, x2: 250, y2: 230, name: 'Palakkad Jn – Palakkad Town', labelX: 290, labelY: 190, branchType: 'branch' },
      { id: 'PGTN-POY', from: 'PGTN', to: 'POY', x1: 250, y1: 230, x2: 250, y2: 315, name: 'Palakkad Town – Pollachi Jn', labelX: 290, labelY: 275, branchType: 'chord' },
      { id: 'SRR-TCR', from: 'SRR', to: 'TCR', x1: 590, y1: 180, x2: 590, y2: 315, name: 'Shoranur – Thrissur / Southern SR Chord', labelX: 635, labelY: 250, branchType: 'chord' }
    ],
    sections: [
      { id: 'PTJ-PGT', fromCode: 'PTJ', toCode: 'PGT', fromName: 'Podanur Jn', toName: 'Palakkad Jn', lengthKm: 54, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Available', divisionId: 'PGT' },
      { id: 'PGT-SRR', fromCode: 'PGT', toCode: 'SRR', fromName: 'Palakkad Jn', toName: 'Shoranur Jn', lengthKm: 46, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Maintenance Planned', plannedBlockIds: ['BLK-PGT-01'], currentSpeedRestriction: '45 km/h at km 528/4-8', divisionId: 'PGT' },
      { id: 'SRR-CLT', fromCode: 'SRR', toCode: 'CLT', fromName: 'Shoranur Jn', toName: 'Kozhikode', lengthKm: 86, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Active Block', activeBlockId: 'BLK-PGT-02', divisionId: 'PGT' },
      { id: 'CLT-CAN', fromCode: 'CLT', toCode: 'CAN', fromName: 'Kozhikode', toName: 'Kannur', lengthKm: 89, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Conflict', plannedBlockIds: ['BLK-PGT-03'], divisionId: 'PGT' },
      { id: 'CAN-MAQ', fromCode: 'CAN', toCode: 'MAQ', fromName: 'Kannur', toName: 'Mangaluru Central', lengthKm: 132, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Available', divisionId: 'PGT' },
      { id: 'SRR-NIL', fromCode: 'SRR', toCode: 'NIL', fromName: 'Shoranur Jn', toName: 'Nilambur Road', lengthKm: 66, tracks: 'Single Line', traction: '25 kV AC Electrified', mps: 85, status: 'Speed Restriction', currentSpeedRestriction: '30 km/h forest curves', divisionId: 'PGT' },
      { id: 'PGT-PGTN', fromCode: 'PGT', toCode: 'PGTN', fromName: 'Palakkad Jn', toName: 'Palakkad Town', lengthKm: 4, tracks: 'Single Line', traction: '25 kV AC Electrified', mps: 60, status: 'Available', divisionId: 'PGT' },
      { id: 'PGTN-POY', fromCode: 'PGTN', toCode: 'POY', fromName: 'Palakkad Town', toName: 'Pollachi Jn', lengthKm: 50, tracks: 'Single Line', traction: '25 kV AC Electrified', mps: 90, status: 'Available', divisionId: 'PGT' }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 2. MANGALURU DIVISION (MAQ) — EXPANDED SPACING, ZERO COLLISION
  // ─────────────────────────────────────────────────────────────
  MAQ: {
    stations: [
      { code: 'MAQ', name: 'Mangaluru Central', letter: 'A', km: 0, junction: true, x: 100, y: 170 },
      { code: 'MAJN', name: 'Mangaluru Jn', letter: 'B', km: 6, junction: true, x: 300, y: 170 },
      { code: 'PNMB', name: 'Panambur Port Siding', letter: 'P', km: 18, junction: true, x: 300, y: 60 },
      { code: 'SBHR', name: 'Subrahmanya Road (Ghat Line)', letter: 'S', km: 86, junction: true, x: 300, y: 300 },
      { code: 'TOK', name: 'Thokur (KRCL Boundary)', letter: 'C', km: 22, junction: true, x: 520, y: 170 },
      { code: 'SL', name: 'Surathkal', letter: 'D', km: 28, junction: false, x: 720, y: 170 },
      { code: 'UD', name: 'Udupi', letter: 'E', km: 68, junction: true, x: 970, y: 170 },
      { code: 'KUDA', name: 'Kundapura', letter: 'F', km: 100, junction: false, x: 1220, y: 170 },
      { code: 'BYNR', name: 'Byndoor Mookambika', letter: 'G', km: 134, junction: false, x: 1470, y: 170 },
      { code: 'BTJL', name: 'Bhatkal', letter: 'H', km: 149, junction: true, x: 1700, y: 170 }
    ],
    sectionLines: [
      { id: 'MAQ-MAJN', from: 'MAQ', to: 'MAJN', x1: 100, y1: 170, x2: 300, y2: 170, name: 'Mangaluru Central – Mangaluru Jn', labelX: 200, labelY: 142, branchType: 'main' },
      { id: 'MAJN-TOK', from: 'MAJN', to: 'TOK', x1: 300, y1: 170, x2: 520, y2: 170, name: 'Mangaluru Jn – Thokur Junction', labelX: 410, labelY: 142, branchType: 'main' },
      { id: 'TOK-SL', from: 'TOK', to: 'SL', x1: 520, y1: 170, x2: 720, y2: 170, name: 'Thokur – Surathkal', labelX: 620, labelY: 142, branchType: 'main' },
      { id: 'SL-UD', from: 'SL', to: 'UD', x1: 720, y1: 170, x2: 970, y2: 170, name: 'Surathkal – Udupi (Showcase)', labelX: 845, labelY: 142, branchType: 'main', isShowcase: true },
      { id: 'UD-KUDA', from: 'UD', to: 'KUDA', x1: 970, y1: 170, x2: 1220, y2: 170, name: 'Udupi – Kundapura', labelX: 1095, labelY: 142, branchType: 'main' },
      { id: 'KUDA-BYNR', from: 'KUDA', to: 'BYNR', x1: 1220, y1: 170, x2: 1470, y2: 170, name: 'Kundapura – Byndoor', labelX: 1345, labelY: 142, branchType: 'main' },
      { id: 'BYNR-BTJL', from: 'BYNR', to: 'BTJL', x1: 1470, y1: 170, x2: 1700, y2: 170, name: 'Byndoor – Bhatkal Mainline', labelX: 1585, labelY: 142, branchType: 'main' },
      { id: 'MAJN-PNMB', from: 'MAJN', to: 'PNMB', x1: 300, y1: 170, x2: 300, y2: 60, name: 'Panambur Port Freight Line', labelX: 330, labelY: 110, branchType: 'branch' },
      { id: 'MAJN-SBHR', from: 'MAJN', to: 'SBHR', x1: 300, y1: 170, x2: 300, y2: 300, name: 'Mangaluru – Subrahmanya Road (Ghat line)', labelX: 335, labelY: 235, branchType: 'chord' }
    ],
    sections: [
      { id: 'MAQ-MAJN', fromCode: 'MAQ', toCode: 'MAJN', fromName: 'Mangaluru Central', toName: 'Mangaluru Jn', lengthKm: 6, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 80, status: 'Available', divisionId: 'MAQ' },
      { id: 'MAJN-TOK', fromCode: 'MAJN', toCode: 'TOK', fromName: 'Mangaluru Jn', toName: 'Thokur', lengthKm: 16, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 100, status: 'Maintenance Planned', plannedBlockIds: ['BLK-MAQ-01'], divisionId: 'MAQ' },
      { id: 'TOK-SL', fromCode: 'TOK', toCode: 'SL', fromName: 'Thokur', toName: 'Surathkal', lengthKm: 6, tracks: 'Single Line', traction: '25 kV AC Electrified', mps: 100, status: 'Available', divisionId: 'MAQ' },
      { id: 'SL-UD', fromCode: 'SL', toCode: 'UD', fromName: 'Surathkal', toName: 'Udupi', lengthKm: 40, tracks: 'Single Line', traction: '25 kV AC Electrified', mps: 110, status: 'Active Block', activeBlockId: 'BLK-MAQ-02', divisionId: 'MAQ' },
      { id: 'UD-KUDA', fromCode: 'UD', toCode: 'KUDA', fromName: 'Udupi', toName: 'Kundapura', lengthKm: 32, tracks: 'Single Line', traction: '25 kV AC Electrified', mps: 110, status: 'Conflict', divisionId: 'MAQ' },
      { id: 'KUDA-BYNR', fromCode: 'KUDA', toCode: 'BYNR', fromName: 'Kundapura', toName: 'Byndoor', lengthKm: 34, tracks: 'Single Line', traction: '25 kV AC Electrified', mps: 110, status: 'Available', divisionId: 'MAQ' },
      { id: 'BYNR-BTJL', fromCode: 'BYNR', toCode: 'BTJL', fromName: 'Byndoor', toName: 'Bhatkal', lengthKm: 15, tracks: 'Single Line', traction: '25 kV AC Electrified', mps: 100, status: 'Available', divisionId: 'MAQ' },
      { id: 'MAJN-PNMB', fromCode: 'MAJN', toCode: 'PNMB', fromName: 'Mangaluru Jn', toName: 'Panambur', lengthKm: 18, tracks: 'Single Line', traction: '25 kV AC Electrified', mps: 60, status: 'Speed Restriction', currentSpeedRestriction: '20 km/h port siding curve', divisionId: 'MAQ' },
      { id: 'MAJN-SBHR', fromCode: 'MAJN', toCode: 'SBHR', fromName: 'Mangaluru Jn', toName: 'Subrahmanya Road', lengthKm: 86, tracks: 'Single Line', traction: '25 kV AC Electrified', mps: 80, status: 'Available', divisionId: 'MAQ' }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 3. THIRUVANANTHAPURAM DIVISION (TVC) — EXPANDED DUAL BRANCH
  // ─────────────────────────────────────────────────────────────
  TVC: {
    stations: [
      { code: 'ERS', name: 'Ernakulam Jn', letter: 'A', km: 0, junction: true, x: 100, y: 170 },
      { code: 'ALLP', name: 'Alappuzha (Coastal)', letter: 'B', km: 57, junction: false, x: 380, y: 255 },
      { code: 'KTYM', name: 'Kottayam (Main)', letter: 'C', km: 60, junction: true, x: 340, y: 100 },
      { code: 'CNGR', name: 'Chengannur', letter: 'CN', km: 95, junction: false, x: 550, y: 100 },
      { code: 'KYJ', name: 'Kayamkulam Jn', letter: 'D', km: 115, junction: true, x: 740, y: 170 },
      { code: 'QLN', name: 'Kollam Jn', letter: 'E', km: 156, junction: true, x: 990, y: 170 },
      { code: 'VAK', name: 'Varkala Sivagiri', letter: 'V', km: 180, junction: false, x: 1220, y: 170 },
      { code: 'TVC', name: 'Thiruvananthapuram Central', letter: 'F', km: 220, junction: true, x: 1470, y: 170 },
      { code: 'NCJ', name: 'Nagercoil Jn', letter: 'G', km: 291, junction: true, x: 1720, y: 220 }
    ],
    sectionLines: [
      { id: 'ERS-KTYM', from: 'ERS', to: 'KTYM', x1: 100, y1: 170, x2: 340, y2: 100, name: 'Ernakulam – Kottayam Route', labelX: 220, labelY: 120, branchType: 'main' },
      { id: 'KTYM-KYJ', from: 'KTYM', to: 'KYJ', x1: 340, y1: 100, x2: 740, y2: 170, name: 'Kottayam – Kayamkulam Jn', labelX: 550, labelY: 122, branchType: 'main' },
      { id: 'ERS-ALLP', from: 'ERS', to: 'ALLP', x1: 100, y1: 170, x2: 380, y2: 255, name: 'Ernakulam – Alappuzha Coastal Line', labelX: 240, labelY: 225, branchType: 'branch' },
      { id: 'ALLP-KYJ', from: 'ALLP', to: 'KYJ', x1: 380, y1: 255, x2: 740, y2: 170, name: 'Alappuzha – Kayamkulam Chord', labelX: 560, labelY: 230, branchType: 'branch' },
      { id: 'KYJ-QLN', from: 'KYJ', to: 'QLN', x1: 740, y1: 170, x2: 990, y2: 170, name: 'Kayamkulam – Kollam Jn (Showcase)', labelX: 865, labelY: 142, branchType: 'main', isShowcase: true },
      { id: 'QLN-TVC', from: 'QLN', to: 'TVC', x1: 990, y1: 170, x2: 1470, y2: 170, name: 'Kollam – Thiruvananthapuram Mainline', labelX: 1230, labelY: 142, branchType: 'main' },
      { id: 'TVC-NCJ', from: 'TVC', to: 'NCJ', x1: 1470, y1: 170, x2: 1720, y2: 220, name: 'Thiruvananthapuram – Nagercoil Section', labelX: 1600, labelY: 182, branchType: 'main' }
    ],
    sections: [
      { id: 'ERS-KTYM', fromCode: 'ERS', toCode: 'KTYM', fromName: 'Ernakulam Jn', toName: 'Kottayam', lengthKm: 60, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 105, status: 'Active Block', activeBlockId: 'BLK-TVC-01', divisionId: 'TVC' },
      { id: 'KTYM-KYJ', fromCode: 'KTYM', toCode: 'KYJ', fromName: 'Kottayam', toName: 'Kayamkulam Jn', lengthKm: 55, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Maintenance Planned', plannedBlockIds: ['BLK-TVC-02'], divisionId: 'TVC' },
      { id: 'ERS-ALLP', fromCode: 'ERS', toCode: 'ALLP', fromName: 'Ernakulam Jn', toName: 'Alappuzha', lengthKm: 57, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 100, status: 'Available', divisionId: 'TVC' },
      { id: 'ALLP-KYJ', fromCode: 'ALLP', toCode: 'KYJ', fromName: 'Alappuzha', toName: 'Kayamkulam Jn', lengthKm: 44, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 105, status: 'Available', divisionId: 'TVC' },
      { id: 'KYJ-QLN', fromCode: 'KYJ', toCode: 'QLN', fromName: 'Kayamkulam Jn', toName: 'Kollam Jn', lengthKm: 41, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Conflict', divisionId: 'TVC' },
      { id: 'QLN-TVC', fromCode: 'QLN', toCode: 'TVC', fromName: 'Kollam Jn', toName: 'Thiruvananthapuram Central', lengthKm: 65, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 100, status: 'Active Block', activeBlockId: 'BLK-TVC-03', divisionId: 'TVC' },
      { id: 'TVC-NCJ', fromCode: 'TVC', toCode: 'NCJ', fromName: 'Thiruvananthapuram Central', toName: 'Nagercoil Jn', lengthKm: 71, tracks: 'Single Line', traction: '25 kV AC Electrified', mps: 90, status: 'Speed Restriction', currentSpeedRestriction: '40 km/h bridge work', divisionId: 'TVC' }
    ]
  }
};

/**
 * ═══════════════════════════════════════════════════════════════
 * COMPLETE INTERMEDIATE STATIONS (PROGRESSIVE DISCLOSURE LEVEL 2)
 * ═══════════════════════════════════════════════════════════════
 */
export const SECTION_STATION_NODES: Record<string, SectionStationNode[]> = {
  // ── PALAKKAD DIVISION (PGT) ──────────────────────────────────
  'PTJ-PGT': [
    { id: 'ST-PTJ', code: 'PTJ', name: 'Podanur Jn', km: 0.0, junction: true, sectionId: 'PTJ-PGT', nodeType: 'Junction Station' },
    { id: 'ST-MDKI', code: 'MDKI', name: 'Madukkarai', km: 9.8, junction: false, sectionId: 'PTJ-PGT', nodeType: 'Intermediate Station' },
    { id: 'ST-ETMD', code: 'ETMD', name: 'Ettimadai', km: 18.2, junction: false, sectionId: 'PTJ-PGT', nodeType: 'Intermediate Station' },
    { id: 'ST-WRA', code: 'WRA', name: 'Walayar', km: 26.5, junction: false, sectionId: 'PTJ-PGT', nodeType: 'Intermediate Station' },
    { id: 'ST-KJKD', code: 'KJKD', name: 'Kanjikode', km: 38.8, junction: false, sectionId: 'PTJ-PGT', nodeType: 'Intermediate Station' },
    { id: 'ST-PGT', code: 'PGT', name: 'Palakkad Jn', km: 54.0, junction: true, sectionId: 'PTJ-PGT', nodeType: 'Terminal Station' }
  ],
  'PGT-SRR': [
    { id: 'ST-PGT-2', code: 'PGT', name: 'Palakkad Jn', km: 0.0, junction: true, sectionId: 'PGT-SRR', nodeType: 'Junction Station' },
    { id: 'ST-PLL', code: 'PLL', name: 'Parli', km: 8.5, junction: false, sectionId: 'PGT-SRR', nodeType: 'Intermediate Station' },
    { id: 'ST-MNY', code: 'MNY', name: 'Mankara', km: 16.2, junction: false, sectionId: 'PGT-SRR', nodeType: 'Intermediate Station' },
    { id: 'ST-LDY', code: 'LDY', name: 'Lakkidi', km: 24.1, junction: false, sectionId: 'PGT-SRR', nodeType: 'Intermediate Station' },
    { id: 'ST-OTP', code: 'OTP', name: 'Ottappalam', km: 33.0, junction: false, sectionId: 'PGT-SRR', nodeType: 'Intermediate Station' },
    { id: 'ST-PLPM', code: 'PLPM', name: 'Palappuram', km: 37.2, junction: false, sectionId: 'PGT-SRR', nodeType: 'Intermediate Station' },
    { id: 'ST-MNUR', code: 'MNUR', name: 'Mannanur', km: 41.5, junction: false, sectionId: 'PGT-SRR', nodeType: 'Intermediate Station' },
    { id: 'ST-SRR', code: 'SRR', name: 'Shoranur Jn', km: 46.0, junction: true, sectionId: 'PGT-SRR', nodeType: 'Terminal Station' }
  ],
  'SRR-CLT': [
    { id: 'ST-SRR-2', code: 'SRR', name: 'Shoranur Jn', km: 0.0, junction: true, sectionId: 'SRR-CLT', nodeType: 'Junction Station' },
    { id: 'ST-PTB', code: 'PTB', name: 'Pattambi', km: 11.5, junction: false, sectionId: 'SRR-CLT', nodeType: 'Intermediate Station' },
    { id: 'ST-KODN', code: 'KODN', name: 'Kodumunda', km: 16.0, junction: false, sectionId: 'SRR-CLT', nodeType: 'Intermediate Station' },
    { id: 'ST-PUM', code: 'PUM', name: 'Pallippuram', km: 20.8, junction: false, sectionId: 'SRR-CLT', nodeType: 'Intermediate Station' },
    { id: 'ST-PEU', code: 'PEU', name: 'Perashannur', km: 26.2, junction: false, sectionId: 'SRR-CLT', nodeType: 'Intermediate Station' },
    { id: 'ST-KTU', code: 'KTU', name: 'Kuttippuram', km: 29.4, junction: false, sectionId: 'SRR-CLT', nodeType: 'Intermediate Station' },
    { id: 'ST-TUA', code: 'TUA', name: 'Tirunnavaya', km: 38.2, junction: false, sectionId: 'SRR-CLT', nodeType: 'Intermediate Station' },
    { id: 'ST-TIR', code: 'TIR', name: 'Tirur', km: 45.0, junction: false, sectionId: 'SRR-CLT', nodeType: 'Intermediate Station' },
    { id: 'ST-TA', code: 'TA', name: 'Tanur', km: 53.2, junction: false, sectionId: 'SRR-CLT', nodeType: 'Intermediate Station' },
    { id: 'ST-PGI', code: 'PGI', name: 'Parappanangadi', km: 61.0, junction: false, sectionId: 'SRR-CLT', nodeType: 'Intermediate Station' },
    { id: 'ST-VLI', code: 'VLI', name: 'Vallikkunnu', km: 66.5, junction: false, sectionId: 'SRR-CLT', nodeType: 'Intermediate Station' },
    { id: 'ST-KN', code: 'KN', name: 'Kadalundi', km: 72.1, junction: false, sectionId: 'SRR-CLT', nodeType: 'Intermediate Station' },
    { id: 'ST-FK', code: 'FK', name: 'Ferok', km: 76.4, junction: false, sectionId: 'SRR-CLT', nodeType: 'Intermediate Station' },
    { id: 'ST-KUL', code: 'KUL', name: 'Kallayi', km: 83.2, junction: false, sectionId: 'SRR-CLT', nodeType: 'Intermediate Station' },
    { id: 'ST-CLT', code: 'CLT', name: 'Kozhikode', km: 86.0, junction: true, sectionId: 'SRR-CLT', nodeType: 'Terminal Station' }
  ],
  'CLT-CAN': [
    { id: 'ST-CLT-2', code: 'CLT', name: 'Kozhikode', km: 0.0, junction: true, sectionId: 'CLT-CAN', nodeType: 'Junction Station' },
    { id: 'ST-WH', code: 'WH', name: 'West Hill', km: 5.1, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-ETR', code: 'ETR', name: 'Elathur', km: 11.2, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-CMC', code: 'CMC', name: 'Chemancheri', km: 19.5, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-QLD', code: 'QLD', name: 'Quilandi', km: 24.2, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-VEK', code: 'VEK', name: 'Vellarakkad', km: 29.8, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-TKT', code: 'TKT', name: 'Tikkotti', km: 34.0, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-PYOL', code: 'PYOL', name: 'Payyoli', km: 37.5, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-IGL', code: 'IGL', name: 'Iringal', km: 41.2, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-BDJ', code: 'BDJ', name: 'Vadakara', km: 46.0, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-NAU', code: 'NAU', name: 'Nadapuram Road', km: 51.5, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-MUKE', code: 'MUKE', name: 'Mukkali', km: 55.2, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-MAHE', code: 'MAHE', name: 'Mahe', km: 59.0, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-JGE', code: 'JGE', name: 'Jagannath Temple Gate', km: 64.0, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-TLY', code: 'TLY', name: 'Thalassery', km: 68.0, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-DMD', code: 'DMD', name: 'Dharmadam', km: 72.5, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-ETK', code: 'ETK', name: 'Etakkot', km: 76.1, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-CS', code: 'CS', name: 'Kannur South', km: 84.8, junction: false, sectionId: 'CLT-CAN', nodeType: 'Intermediate Station' },
    { id: 'ST-CAN', code: 'CAN', name: 'Kannur', km: 89.0, junction: true, sectionId: 'CLT-CAN', nodeType: 'Terminal Station' }
  ],
  'CAN-MAQ': [
    { id: 'ST-CAN-2', code: 'CAN', name: 'Kannur', km: 0.0, junction: true, sectionId: 'CAN-MAQ', nodeType: 'Junction Station' },
    { id: 'ST-CQL', code: 'CQL', name: 'Chirakkal', km: 4.8, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-VAPM', code: 'VAPM', name: 'Valapattanam', km: 7.2, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-PPNS', code: 'PPNS', name: 'Pappinisseri', km: 9.8, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-KPQ', code: 'KPQ', name: 'Kannapuram', km: 16.0, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-PAZ', code: 'PAZ', name: 'Payangadi', km: 23.5, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-ELM', code: 'ELM', name: 'Elimala', km: 28.0, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-PAY', code: 'PAY', name: 'Payyanur', km: 34.0, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-TKQ', code: 'TKQ', name: 'Trikaripur', km: 40.5, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-CDRA', code: 'CDRA', name: 'Chandera', km: 44.8, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-CHV', code: 'CHV', name: 'Charvattur', km: 49.0, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-NLE', code: 'NLE', name: 'Nileshwar', km: 54.0, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-KZE', code: 'KZE', name: 'Kanhangad', km: 63.5, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-KLAD', code: 'KLAD', name: 'Kalanad', km: 77.2, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-KGQ', code: 'KGQ', name: 'Kasaragod', km: 86.0, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-KMQ', code: 'KMQ', name: 'Kumbla', km: 98.4, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-UAA', code: 'UAA', name: 'Uppala', km: 108.1, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-MJS', code: 'MJS', name: 'Manjeshwar', km: 118.5, junction: false, sectionId: 'CAN-MAQ', nodeType: 'Intermediate Station' },
    { id: 'ST-MAQ', code: 'MAQ', name: 'Mangaluru Central', km: 132.0, junction: true, sectionId: 'CAN-MAQ', nodeType: 'Terminal Station' }
  ],
  'SRR-NIL': [
    { id: 'ST-SRR-3', code: 'SRR', name: 'Shoranur Jn', km: 0.0, junction: true, sectionId: 'SRR-NIL', nodeType: 'Junction Station' },
    { id: 'ST-VDKS', code: 'VDKS', name: 'Vadanamkurissi', km: 4.2, junction: false, sectionId: 'SRR-NIL', nodeType: 'Intermediate Station' },
    { id: 'ST-VPZ', code: 'VPZ', name: 'Vallapuzha', km: 10.5, junction: false, sectionId: 'SRR-NIL', nodeType: 'Intermediate Station' },
    { id: 'ST-KZC', code: 'KZC', name: 'Kulukkallur', km: 14.8, junction: false, sectionId: 'SRR-NIL', nodeType: 'Intermediate Station' },
    { id: 'ST-CQA', code: 'CQA', name: 'Cherukara', km: 21.3, junction: false, sectionId: 'SRR-NIL', nodeType: 'Intermediate Station' },
    { id: 'ST-AAM', code: 'AAM', name: 'Angadippuram', km: 28.0, junction: false, sectionId: 'SRR-NIL', nodeType: 'Intermediate Station' },
    { id: 'ST-PKQ', code: 'PKQ', name: 'Pattikkad', km: 33.6, junction: false, sectionId: 'SRR-NIL', nodeType: 'Intermediate Station' },
    { id: 'ST-MLTR', code: 'MLTR', name: 'Melattur', km: 40.8, junction: false, sectionId: 'SRR-NIL', nodeType: 'Intermediate Station' },
    { id: 'ST-TUV', code: 'TUV', name: 'Tuvvur', km: 47.2, junction: false, sectionId: 'SRR-NIL', nodeType: 'Intermediate Station' },
    { id: 'ST-TDPM', code: 'TDPM', name: 'Todiyappulam', km: 51.5, junction: false, sectionId: 'SRR-NIL', nodeType: 'Intermediate Station' },
    { id: 'ST-VNB', code: 'VNB', name: 'Vaniyambalam', km: 55.9, junction: false, sectionId: 'SRR-NIL', nodeType: 'Intermediate Station' },
    { id: 'ST-NIL', code: 'NIL', name: 'Nilambur Road', km: 66.0, junction: true, sectionId: 'SRR-NIL', nodeType: 'Terminal Station' }
  ],
  'PGT-PGTN': [
    { id: 'ST-PGT-3', code: 'PGT', name: 'Palakkad Jn', km: 0.0, junction: true, sectionId: 'PGT-PGTN', nodeType: 'Junction Station' },
    { id: 'ST-PGTN', code: 'PGTN', name: 'Palakkad Town', km: 4.2, junction: false, sectionId: 'PGT-PGTN', nodeType: 'Terminal Station' }
  ],
  'PGTN-POY': [
    { id: 'ST-PGTN-2', code: 'PGTN', name: 'Palakkad Town', km: 0.0, junction: false, sectionId: 'PGTN-POY', nodeType: 'Junction Station' },
    { id: 'ST-PDGM', code: 'PDGM', name: 'Pudunagaram', km: 11.0, junction: false, sectionId: 'PGTN-POY', nodeType: 'Intermediate Station' },
    { id: 'ST-KLGD', code: 'KLGD', name: 'Kollengode', km: 19.5, junction: false, sectionId: 'PGTN-POY', nodeType: 'Intermediate Station' },
    { id: 'ST-MMDA', code: 'MMDA', name: 'Muthalamada', km: 28.0, junction: false, sectionId: 'PGTN-POY', nodeType: 'Intermediate Station' },
    { id: 'ST-MXM', code: 'MXM', name: 'Minatchipuram', km: 38.6, junction: false, sectionId: 'PGTN-POY', nodeType: 'Intermediate Station' },
    { id: 'ST-POY', code: 'POY', name: 'Pollachi Jn', km: 50.0, junction: true, sectionId: 'PGTN-POY', nodeType: 'Terminal Station' }
  ],

  // ── MANGALURU DIVISION (MAQ) ─────────────────────────────────
  'MAQ-MAJN': [
    { id: 'ST-MAQ-M', code: 'MAQ', name: 'Mangaluru Central', km: 0.0, junction: true, sectionId: 'MAQ-MAJN', nodeType: 'Terminal Station' },
    { id: 'ST-MAJN-M', code: 'MAJN', name: 'Mangaluru Jn', km: 5.8, junction: true, sectionId: 'MAQ-MAJN', nodeType: 'Junction Station' }
  ],
  'MAJN-TOK': [
    { id: 'ST-MAJN-T', code: 'MAJN', name: 'Mangaluru Jn', km: 0.0, junction: true, sectionId: 'MAJN-TOK', nodeType: 'Junction Station' },
    { id: 'ST-JKT', code: 'JKT', name: 'Jokatte', km: 9.4, junction: false, sectionId: 'MAJN-TOK', nodeType: 'Intermediate Station' },
    { id: 'ST-TOK', code: 'TOK', name: 'Thokur (KRCL Interchange)', km: 16.2, junction: true, sectionId: 'MAJN-TOK', nodeType: 'Junction Station' }
  ],
  'TOK-SL': [
    { id: 'ST-TOK-S', code: 'TOK', name: 'Thokur', km: 0.0, junction: true, sectionId: 'TOK-SL', nodeType: 'Junction Station' },
    { id: 'ST-SL', code: 'SL', name: 'Surathkal', km: 6.1, junction: false, sectionId: 'TOK-SL', nodeType: 'Terminal Station' }
  ],
  'SL-UD': [
    { id: 'ST-SL-U', code: 'SL', name: 'Surathkal', km: 0.0, junction: false, sectionId: 'SL-UD', nodeType: 'Terminal Station' },
    { id: 'ST-MULK', code: 'MULK', name: 'Mulki', km: 9.2, junction: false, sectionId: 'SL-UD', nodeType: 'Intermediate Station' },
    { id: 'ST-NAND', code: 'NAND', name: 'Nandikoor', km: 17.0, junction: false, sectionId: 'SL-UD', nodeType: 'Intermediate Station' },
    { id: 'ST-PDD', code: 'PDD', name: 'Padubidri', km: 23.5, junction: false, sectionId: 'SL-UD', nodeType: 'Intermediate Station' },
    { id: 'ST-INJ', code: 'INJ', name: 'Innanje', km: 31.8, junction: false, sectionId: 'SL-UD', nodeType: 'Intermediate Station' },
    { id: 'ST-UD', code: 'UD', name: 'Udupi', km: 40.0, junction: true, sectionId: 'SL-UD', nodeType: 'Terminal Station' }
  ],
  'UD-KUDA': [
    { id: 'ST-UD-K', code: 'UD', name: 'Udupi', km: 0.0, junction: true, sectionId: 'UD-KUDA', nodeType: 'Terminal Station' },
    { id: 'ST-BKJ', code: 'BKJ', name: 'Barkur', km: 16.4, junction: false, sectionId: 'UD-KUDA', nodeType: 'Intermediate Station' },
    { id: 'ST-KUDA', code: 'KUDA', name: 'Kundapura', km: 32.0, junction: false, sectionId: 'UD-KUDA', nodeType: 'Terminal Station' }
  ],
  'KUDA-BYNR': [
    { id: 'ST-KUDA-B', code: 'KUDA', name: 'Kundapura', km: 0.0, junction: false, sectionId: 'KUDA-BYNR', nodeType: 'Terminal Station' },
    { id: 'ST-SEN', code: 'SEN', name: 'Senapura', km: 14.1, junction: false, sectionId: 'KUDA-BYNR', nodeType: 'Intermediate Station' },
    { id: 'ST-BIJR', code: 'BIJR', name: 'Bijoor', km: 24.8, junction: false, sectionId: 'KUDA-BYNR', nodeType: 'Intermediate Station' },
    { id: 'ST-BYNR', code: 'BYNR', name: 'Byndoor Mookambika Road', km: 34.0, junction: false, sectionId: 'KUDA-BYNR', nodeType: 'Terminal Station' }
  ],
  'BYNR-BTJL': [
    { id: 'ST-BYNR-B', code: 'BYNR', name: 'Byndoor Mookambika Road', km: 0.0, junction: false, sectionId: 'BYNR-BTJL', nodeType: 'Terminal Station' },
    { id: 'ST-SHMI', code: 'SHMI', name: 'Shiroor', km: 7.9, junction: false, sectionId: 'BYNR-BTJL', nodeType: 'Intermediate Station' },
    { id: 'ST-BTJL', code: 'BTJL', name: 'Bhatkal', km: 15.2, junction: true, sectionId: 'BYNR-BTJL', nodeType: 'Terminal Station' }
  ],

  // ── THIRUVANANTHAPURAM DIVISION (TVC) ────────────────────────
  'ERS-KTYM': [
    { id: 'ST-ERS', code: 'ERS', name: 'Ernakulam Jn', km: 0.0, junction: true, sectionId: 'ERS-KTYM', nodeType: 'Junction Station' },
    { id: 'ST-TRTR', code: 'TRTR', name: 'Tripunithura', km: 9.8, junction: false, sectionId: 'ERS-KTYM', nodeType: 'Intermediate Station' },
    { id: 'ST-PVRD', code: 'PVRD', name: 'Piravom Road', km: 28.5, junction: false, sectionId: 'ERS-KTYM', nodeType: 'Intermediate Station' },
    { id: 'ST-VARD', code: 'VARD', name: 'Vaikom Road', km: 34.6, junction: false, sectionId: 'ERS-KTYM', nodeType: 'Intermediate Station' },
    { id: 'ST-ETM', code: 'ETM', name: 'Ettumanur', km: 49.8, junction: false, sectionId: 'ERS-KTYM', nodeType: 'Intermediate Station' },
    { id: 'ST-KTYM', code: 'KTYM', name: 'Kottayam', km: 60.0, junction: true, sectionId: 'ERS-KTYM', nodeType: 'Terminal Station' }
  ],
  'KTYM-KYJ': [
    { id: 'ST-KTYM-2', code: 'KTYM', name: 'Kottayam', km: 0.0, junction: true, sectionId: 'KTYM-KYJ', nodeType: 'Terminal Station' },
    { id: 'ST-CGY', code: 'CGY', name: 'Changanassery', km: 17.8, junction: false, sectionId: 'KTYM-KYJ', nodeType: 'Intermediate Station' },
    { id: 'ST-TRVL', code: 'TRVL', name: 'Tiruvalla', km: 25.8, junction: false, sectionId: 'KTYM-KYJ', nodeType: 'Intermediate Station' },
    { id: 'ST-CNGR', code: 'CNGR', name: 'Chengannur', km: 35.1, junction: false, sectionId: 'KTYM-KYJ', nodeType: 'Intermediate Station' },
    { id: 'ST-MVLK', code: 'MVLK', name: 'Mavelikara', km: 47.5, junction: false, sectionId: 'KTYM-KYJ', nodeType: 'Intermediate Station' },
    { id: 'ST-KYJ', code: 'KYJ', name: 'Kayamkulam Jn', km: 55.0, junction: true, sectionId: 'KTYM-KYJ', nodeType: 'Junction Station' }
  ],
  'ERS-ALLP': [
    { id: 'ST-ERS-A', code: 'ERS', name: 'Ernakulam Jn', km: 0.0, junction: true, sectionId: 'ERS-ALLP', nodeType: 'Junction Station' },
    { id: 'ST-KUMM', code: 'KUMM', name: 'Kumbalam', km: 7.8, junction: false, sectionId: 'ERS-ALLP', nodeType: 'Intermediate Station' },
    { id: 'ST-TUVR', code: 'TUVR', name: 'Turavur', km: 23.4, junction: false, sectionId: 'ERS-ALLP', nodeType: 'Intermediate Station' },
    { id: 'ST-SRTL', code: 'SRTL', name: 'Cherthala', km: 33.2, junction: false, sectionId: 'ERS-ALLP', nodeType: 'Intermediate Station' },
    { id: 'ST-ALLP', code: 'ALLP', name: 'Alappuzha', km: 57.0, junction: false, sectionId: 'ERS-ALLP', nodeType: 'Terminal Station' }
  ],
  'ALLP-KYJ': [
    { id: 'ST-ALLP-K', code: 'ALLP', name: 'Alappuzha', km: 0.0, junction: false, sectionId: 'ALLP-KYJ', nodeType: 'Terminal Station' },
    { id: 'ST-AMPA', code: 'AMPA', name: 'Ambalapuzha', km: 12.4, junction: false, sectionId: 'ALLP-KYJ', nodeType: 'Intermediate Station' },
    { id: 'ST-HAD', code: 'HAD', name: 'Harippad', km: 30.8, junction: false, sectionId: 'ALLP-KYJ', nodeType: 'Intermediate Station' },
    { id: 'ST-KYJ-A', code: 'KYJ', name: 'Kayamkulam Jn', km: 44.0, junction: true, sectionId: 'ALLP-KYJ', nodeType: 'Junction Station' }
  ],
  'KYJ-QLN': [
    { id: 'ST-KYJ-Q', code: 'KYJ', name: 'Kayamkulam Jn', km: 0.0, junction: true, sectionId: 'KYJ-QLN', nodeType: 'Junction Station' },
    { id: 'ST-KPY', code: 'KPY', name: 'Karunagappalli', km: 13.8, junction: false, sectionId: 'KYJ-QLN', nodeType: 'Intermediate Station' },
    { id: 'ST-STKT', code: 'STKT', name: 'Sasthankotta', km: 21.6, junction: false, sectionId: 'KYJ-QLN', nodeType: 'Intermediate Station' },
    { id: 'ST-MQO', code: 'MQO', name: 'Munroturuttu', km: 26.2, junction: false, sectionId: 'KYJ-QLN', nodeType: 'Intermediate Station' },
    { id: 'ST-QLN', code: 'QLN', name: 'Kollam Jn', km: 41.0, junction: true, sectionId: 'KYJ-QLN', nodeType: 'Terminal Station' }
  ],
  'QLN-TVC': [
    { id: 'ST-QLN-T', code: 'QLN', name: 'Kollam Jn', km: 0.0, junction: true, sectionId: 'QLN-TVC', nodeType: 'Terminal Station' },
    { id: 'ST-PVU', code: 'PVU', name: 'Paravur', km: 12.4, junction: false, sectionId: 'QLN-TVC', nodeType: 'Intermediate Station' },
    { id: 'ST-VAK', code: 'VAK', name: 'Varkala Sivagiri', km: 23.6, junction: false, sectionId: 'QLN-TVC', nodeType: 'Intermediate Station' },
    { id: 'ST-KVU', code: 'KVU', name: 'Kadakkavur', km: 32.8, junction: false, sectionId: 'QLN-TVC', nodeType: 'Intermediate Station' },
    { id: 'ST-KZK', code: 'KZK', name: 'Kazhakkuttam', km: 50.5, junction: false, sectionId: 'QLN-TVC', nodeType: 'Intermediate Station' },
    { id: 'ST-KCVL', code: 'KCVL', name: 'Kochuveli', km: 57.0, junction: false, sectionId: 'QLN-TVC', nodeType: 'Intermediate Station' },
    { id: 'ST-TVC', code: 'TVC', name: 'Thiruvananthapuram Central', km: 65.0, junction: true, sectionId: 'QLN-TVC', nodeType: 'Junction Station' }
  ],
  'TVC-NCJ': [
    { id: 'ST-TVC-N', code: 'TVC', name: 'Thiruvananthapuram Central', km: 0.0, junction: true, sectionId: 'TVC-NCJ', nodeType: 'Junction Station' },
    { id: 'ST-NEM', code: 'NEM', name: 'Nemom', km: 7.4, junction: false, sectionId: 'TVC-NCJ', nodeType: 'Intermediate Station' },
    { id: 'ST-NYY', code: 'NYY', name: 'Neyyattinkara', km: 19.5, junction: false, sectionId: 'TVC-NCJ', nodeType: 'Intermediate Station' },
    { id: 'ST-PASA', code: 'PASA', name: 'Parassala', km: 31.8, junction: false, sectionId: 'TVC-NCJ', nodeType: 'Intermediate Station' },
    { id: 'ST-KZTW', code: 'KZTW', name: 'Kuzhitturai', km: 40.1, junction: false, sectionId: 'TVC-NCJ', nodeType: 'Intermediate Station' },
    { id: 'ST-NCJ', code: 'NCJ', name: 'Nagercoil Jn', km: 71.0, junction: true, sectionId: 'TVC-NCJ', nodeType: 'Terminal Station' }
  ]
};

/**
 * ═══════════════════════════════════════════════════════════════
 * INTERACTIVE JUNCTION HUBS
 * ═══════════════════════════════════════════════════════════════
 */
export const JUNCTION_DETAILS: Record<string, JunctionDetail> = {
  SRR: {
    code: 'SRR',
    name: 'Shoranur Junction',
    divisionId: 'PGT',
    hubRole: 'Principal Railway Junction of Southern Railway in Kerala connecting 4 major traffic arteries',
    branches: [
      {
        branchId: 'SRR-PGT-BR',
        name: 'Palakkad & Coimbatore Corridor',
        direction: 'East (UP Mainline)',
        targetStation: 'Palakkad Jn (PGT) / Coimbatore (CBE)',
        gauge: 'Broad Gauge 1676 mm',
        traction: '25 kV AC Electrified Double Line',
        tracks: 'Double Line (Track 1 & 2)',
        operationalRole: 'Principal freight and long-distance passenger flow to Chennai/Bangalore/North India'
      },
      {
        branchId: 'SRR-CLT-BR',
        name: 'Kozhikode, Kannur & Mangaluru Corridor',
        direction: 'North-West (DN Mainline)',
        targetStation: 'Kozhikode (CLT) / Mangaluru (MAQ)',
        gauge: 'Broad Gauge 1676 mm',
        traction: '25 kV AC Electrified Double Line',
        tracks: 'Double Line (Track 3 & 4)',
        operationalRole: 'High-density Konkan & Malabar trunk corridor'
      },
      {
        branchId: 'SRR-NIL-BR',
        name: 'Nilambur Road Branch Line',
        direction: 'North-East (Branch)',
        targetStation: 'Nilambur Road (NIL)',
        gauge: 'Broad Gauge 1676 mm',
        traction: '25 kV AC Electrified Single Line',
        tracks: 'Single Line with tokenless block working',
        operationalRole: 'Feeder passenger and timber/bamboo transit corridor'
      },
      {
        branchId: 'SRR-TCR-BR',
        name: 'Thrissur & Ernakulam / Southern SR Line',
        direction: 'South (Chord Line)',
        targetStation: 'Thrissur (TCR) / Ernakulam (ERS)',
        gauge: 'Broad Gauge 1676 mm',
        traction: '25 kV AC Electrified Double Line',
        tracks: 'Double Line via Bharatapuzha Bridge',
        operationalRole: 'Trunk line connecting Central & South Kerala to TVC Division'
      }
    ],
    yards: ['SRR Marshalling Yard', 'Shoranur Coaching Depot', 'Down Goods Bypass Yard'],
    maintenanceFacilities: ['Tower Wagon Shed (TRD)', 'Carriage & Wagon Sick Line', 'P-Way Machine Depot (09-3X Base)']
  },
  PGT: {
    code: 'PGT',
    name: 'Palakkad Junction (Olavakkode)',
    divisionId: 'PGT',
    hubRole: 'Divisional Headquarters Station & Western Ghats Gateway Corridor Hub',
    branches: [
      {
        branchId: 'PGT-PTJ-BR',
        name: 'Podanur / Salem / Chennai Mainline',
        direction: 'East',
        targetStation: 'Podanur (PTJ) / Erode (ED)',
        gauge: 'Broad Gauge 1676 mm',
        traction: '25 kV AC Electrified Double Line',
        tracks: 'Double Line through Palakkad Gap',
        operationalRole: 'Interstate high-speed freight & passenger artery'
      },
      {
        branchId: 'PGT-SRR-BR',
        name: 'Shoranur / Malabar Coast Trunk',
        direction: 'West',
        targetStation: 'Shoranur Jn (SRR)',
        gauge: 'Broad Gauge 1676 mm',
        traction: '25 kV AC Electrified Double Line',
        tracks: 'Double Line',
        operationalRole: 'High-density passenger & petroleum rake traffic'
      },
      {
        branchId: 'PGT-PGTN-BR',
        name: 'Palakkad Town – Pollachi – Dindigul Connection',
        direction: 'South-East',
        targetStation: 'Palakkad Town (PGTN) / Pollachi (POY)',
        gauge: 'Broad Gauge 1676 mm',
        traction: '25 kV AC Electrified Single Line',
        tracks: 'Single Line branch',
        operationalRole: 'Inter-zonal bypass connecting Southern Railway Madurai Division'
      }
    ],
    yards: ['Palakkad Coaching Terminal', 'FCI Inland Siding Yard', 'MEMU Shed Pitline'],
    maintenanceFacilities: ['MEMU Shed Palakkad', 'Divisional Electrical Control (Traction)', 'OHE Maintenance Depot']
  },
  MAQ: {
    code: 'MAQ',
    name: 'Mangaluru Central',
    divisionId: 'MAQ',
    hubRole: 'Terminal Hub & Konkan / South Western Railway Interchange Junction',
    branches: [
      {
        branchId: 'MAQ-CAN-BR',
        name: 'Kerala Trunk Route (PGT Division)',
        direction: 'South',
        targetStation: 'Kasaragod (KGQ) / Kannur (CAN)',
        gauge: 'Broad Gauge 1676 mm',
        traction: '25 kV AC Electrified Double Line',
        tracks: 'Double Line',
        operationalRole: 'Direct connectivity to Southern Railway headquarters and Kerala capital'
      },
      {
        branchId: 'MAQ-MAJN-BR',
        name: 'Mangaluru Junction & Konkan Interchange',
        direction: 'North-East',
        targetStation: 'Mangaluru Jn (MAJN) / Thokur (TOK)',
        gauge: 'Broad Gauge 1676 mm',
        traction: '25 kV AC Electrified',
        tracks: 'Multiple Line Chord',
        operationalRole: 'Connects to Konkan Railway route to Goa/Mumbai and Hassan Ghat line'
      }
    ],
    yards: ['Mangaluru Central Coaching Yard', 'Bunder Goods Shed'],
    maintenanceFacilities: ['Coaching Depot Pitlines', 'Tower Wagon Facility']
  }
};

/**
 * ═══════════════════════════════════════════════════════════════
 * TRACTION & ELECTRICAL INFRASTRUCTURE (TSS, SP, SSP, OHE DEPOTS)
 * ═══════════════════════════════════════════════════════════════
 */
export const TRACTION_FACILITIES: TractionFacility[] = [
  // ── PALAKKAD DIVISION TRACTION ────────────────────────────────
  {
    id: 'TR-SRR-TSS',
    divisionId: 'PGT',
    name: 'Shoranur Traction Substation (TSS)',
    type: 'Traction Substation (TSS)',
    stationCode: 'SRR',
    location: 'Shoranur North Yard (km 579/4)',
    sectionId: 'SRR-CLT',
    x: 600,
    y: 195,
    voltage: '25 kV AC, 110 kV Feeding Grid',
    feedCapacityMVA: 30,
    notes: 'Critical power feeding station for SRR–CLT and SRR–PGT sections'
  },
  {
    id: 'TR-TIR-TSS',
    divisionId: 'PGT',
    name: 'Tirur Traction Substation (TSS)',
    type: 'Traction Substation (TSS)',
    stationCode: 'TIR',
    location: 'Near Tirur Goods Yard (km 625/8)',
    sectionId: 'SRR-CLT',
    x: 770,
    y: 165,
    voltage: '25 kV AC, 110 kV KSEB Grid',
    feedCapacityMVA: 25,
    notes: 'Supplies catenary voltage from Kuttippuram to Parappanangadi'
  },
  {
    id: 'TR-CHV-TSS',
    divisionId: 'PGT',
    name: 'Cheruvathur Traction Substation (TSS)',
    type: 'Traction Substation (TSS)',
    stationCode: 'CHV',
    location: 'Charvattur Rail Enclave (km 764/2)',
    sectionId: 'CAN-MAQ',
    x: 1520,
    y: 125,
    voltage: '25 kV AC, 110 kV Grid Feed',
    feedCapacityMVA: 25,
    notes: 'Power feeding facility for Payyanur–Kasaragod coastal sector'
  },
  {
    id: 'TR-UAA-TSS',
    divisionId: 'PGT',
    name: 'Uppala Traction Substation (TSS)',
    type: 'Traction Substation (TSS)',
    stationCode: 'UAA',
    location: 'Uppala Trackside (km 823/0)',
    sectionId: 'CAN-MAQ',
    x: 1720,
    y: 125,
    voltage: '25 kV AC, 110 kV Grid Feed',
    feedCapacityMVA: 30,
    notes: 'Supplies OHE power up to Mangaluru Southern boundary'
  },
  {
    id: 'TR-PGT-SP',
    divisionId: 'PGT',
    name: 'Parli Sectioning Post (SP)',
    type: 'Sectioning Post (SP)',
    stationCode: 'PLL',
    location: 'Parli km 536/8',
    sectionId: 'PGT-SRR',
    x: 340,
    y: 160,
    voltage: '25 kV AC Bridging Post',
    notes: 'Sectioning Post separating Kanjikode and Shoranur sub-sectors'
  },
  {
    id: 'TR-CAN-DEPOT',
    divisionId: 'PGT',
    name: 'Kannur OHE Depot & Tower Wagon Base',
    type: 'OHE Depot',
    stationCode: 'CAN',
    location: 'Kannur South Yard',
    sectionId: 'CLT-CAN',
    x: 1360,
    y: 115,
    voltage: 'Maintenance Depot',
    notes: 'Equipped with 8-wheeler DETC Tower Wagon and breakdown crane'
  },

  // ── MANGALURU DIVISION TRACTION ──────────────────────────────
  {
    id: 'TR-TOK-TSS',
    divisionId: 'MAQ',
    name: 'Thokur Traction Substation (TSS)',
    type: 'Traction Substation (TSS)',
    stationCode: 'TOK',
    location: 'Thokur KRCL Junction (km 16/4)',
    sectionId: 'MAJN-TOK',
    x: 530,
    y: 185,
    voltage: '25 kV AC, 110 kV MESCOM Grid',
    feedCapacityMVA: 30,
    notes: 'Main feeding station for Panambur Port lines and Konkan gateway'
  },
  {
    id: 'TR-UD-TSS',
    divisionId: 'MAQ',
    name: 'Udupi Traction Substation (TSS)',
    type: 'Traction Substation (TSS)',
    stationCode: 'UD',
    location: 'Udupi Station North (km 58/2)',
    sectionId: 'SL-UD',
    x: 980,
    y: 185,
    voltage: '25 kV AC, 110 kV Grid',
    feedCapacityMVA: 25,
    notes: 'Supplies coastal sector from Mulki to Kundapura'
  },
  {
    id: 'TR-BYNR-SP',
    divisionId: 'MAQ',
    name: 'Byndoor Sectioning Post (SP)',
    type: 'Sectioning Post (SP)',
    stationCode: 'BYNR',
    location: 'Byndoor Yard (km 134/6)',
    sectionId: 'KUDA-BYNR',
    x: 1480,
    y: 185,
    voltage: '25 kV AC Bridging Post',
    notes: 'Neutral section & zone demarcation point'
  },

  // ── THIRUVANANTHAPURAM DIVISION TRACTION ─────────────────────
  {
    id: 'TR-QLN-TSS',
    divisionId: 'TVC',
    name: 'Kollam Traction Substation (TSS)',
    type: 'Traction Substation (TSS)',
    stationCode: 'QLN',
    location: 'Kollam Goods Complex',
    sectionId: 'KYJ-QLN',
    x: 1000,
    y: 190,
    voltage: '25 kV AC, 110 kV Feed',
    feedCapacityMVA: 30,
    notes: 'Feeds Kayamkulam–Kollam–Varkala mainline'
  },
  {
    id: 'TR-KTYM-TSS',
    divisionId: 'TVC',
    name: 'Kottayam Traction Substation (TSS)',
    type: 'Traction Substation (TSS)',
    stationCode: 'KTYM',
    location: 'Kottayam South (km 62/4)',
    sectionId: 'ERS-KTYM',
    x: 350,
    y: 115,
    voltage: '25 kV AC, 110 kV Feed',
    feedCapacityMVA: 25,
    notes: 'Feeds central Kerala chord route'
  },
  {
    id: 'TR-ALLP-TSS',
    divisionId: 'TVC',
    name: 'Alappuzha Traction Substation (TSS)',
    type: 'Traction Substation (TSS)',
    stationCode: 'ALLP',
    location: 'Alappuzha Station Yard',
    sectionId: 'ERS-ALLP',
    x: 390,
    y: 270,
    voltage: '25 kV AC, 66 kV Coastal Feed',
    feedCapacityMVA: 20,
    notes: 'Feeds Ernakulam–Alappuzha coastal railway'
  }
];

/**
 * ═══════════════════════════════════════════════════════════════
 * FREIGHT & INDUSTRIAL SIDINGS (TOGGLEABLE INFRASTRUCTURE LAYER)
 * ═══════════════════════════════════════════════════════════════
 */
export const FREIGHT_FACILITIES: FreightFacility[] = [
  // ── PALAKKAD DIVISION FREIGHT SIDINGS ────────────────────────
  {
    id: 'FR-ETR-HPCL',
    divisionId: 'PGT',
    name: 'HPCL Petroleum Siding',
    type: 'Oil Depot / Refinery Siding',
    stationCode: 'ETR',
    location: 'Elathur (km 678/4)',
    sectionId: 'CLT-CAN',
    x: 990,
    y: 130,
    operator: 'Hindustan Petroleum Corporation Ltd',
    commodity: 'POL (Petroleum, Oil & Lubricants)',
    sidingTracks: 3
  },
  {
    id: 'FR-FK-IOC',
    divisionId: 'PGT',
    name: 'IOCPOL Petroleum Depot Siding',
    type: 'Oil Depot / Refinery Siding',
    stationCode: 'FK',
    location: 'Ferok (km 652/8)',
    sectionId: 'SRR-CLT',
    x: 890,
    y: 145,
    operator: 'Indian Oil Corporation Ltd',
    commodity: 'Motor Spirit, HSD & Aviation Turbine Fuel',
    sidingTracks: 4
  },
  {
    id: 'FR-MDKI-ACC',
    divisionId: 'PGT',
    name: 'Associated Cement (ACC) Siding',
    type: 'Cement Siding',
    stationCode: 'MDKI',
    location: 'Madukkarai (km 512/0)',
    sectionId: 'PTJ-PGT',
    x: 130,
    y: 165,
    operator: 'ACC Limited / Adani Cement',
    commodity: 'Cement & Clinker Rakes',
    sidingTracks: 5
  },
  {
    id: 'FR-MDKI-ADANI',
    divisionId: 'PGT',
    name: 'Adani Agri Logistics Silo Siding',
    type: 'Industrial Siding',
    stationCode: 'MDKI',
    location: 'Madukkarai Yard',
    sectionId: 'PTJ-PGT',
    x: 140,
    y: 135,
    operator: 'Adani Agri Logistics',
    commodity: 'Bulk Foodgrains (Wheat/Paddy)',
    sidingTracks: 2
  },
  {
    id: 'FR-PAY-FCI',
    divisionId: 'PGT',
    name: 'FCI Grain Depot Siding',
    type: 'FCI Siding',
    stationCode: 'PAY',
    location: 'Payyanur Goods Yard',
    sectionId: 'CAN-MAQ',
    x: 1470,
    y: 110,
    operator: 'Food Corporation of India',
    commodity: 'Foodgrains & Rice bags (BCN rakes)',
    sidingTracks: 2
  },
  {
    id: 'FR-PGT-FCI',
    divisionId: 'PGT',
    name: 'Palakkad FCI Buffer Siding',
    type: 'FCI Siding',
    stationCode: 'PGT',
    location: 'Olavakkode Goods Yard',
    sectionId: 'PGT-SRR',
    x: 280,
    y: 135,
    operator: 'Food Corporation of India',
    commodity: 'Strategic foodgrain buffer',
    sidingTracks: 3
  },
  {
    id: 'FR-TKT-FCI',
    divisionId: 'PGT',
    name: 'Tikkotti FCI Goods Siding',
    type: 'FCI Siding',
    stationCode: 'TKT',
    location: 'Tikkotti Station Road',
    sectionId: 'CLT-CAN',
    x: 1070,
    y: 120,
    operator: 'Food Corporation of India',
    commodity: 'Grain distribution rakes',
    sidingTracks: 2
  },
  {
    id: 'FR-WH-FCI',
    divisionId: 'PGT',
    name: 'West Hill FCI Siding',
    type: 'FCI Siding',
    stationCode: 'WH',
    location: 'Kozhikode West Hill',
    sectionId: 'CLT-CAN',
    x: 960,
    y: 120,
    operator: 'Food Corporation of India',
    commodity: 'Public distribution grain',
    sidingTracks: 2
  },
  {
    id: 'FR-WRA-CEMENT',
    divisionId: 'PGT',
    name: 'Malabar Cements Siding',
    type: 'Cement Siding',
    stationCode: 'WRA',
    location: 'Walayar Industrial Belt',
    sectionId: 'PTJ-PGT',
    x: 190,
    y: 165,
    operator: 'Malabar Cements Ltd',
    commodity: 'Raw limestone, clinker, cement',
    sidingTracks: 3
  },

  // ── MANGALURU DIVISION FREIGHT SIDINGS ────────────────────────
  {
    id: 'FR-PNMB-NMPT',
    divisionId: 'MAQ',
    name: 'New Mangalore Port Trust (NMPT) Rail Wharf',
    type: 'Major Port / Terminal',
    stationCode: 'PNMB',
    location: 'Panambur Deep Water Port',
    sectionId: 'MAJN-PNMB',
    x: 295,
    y: 40,
    operator: 'New Mangalore Port Authority',
    commodity: 'Containers, Coal, Fertilizers, Steel Coils',
    sidingTracks: 8
  },
  {
    id: 'FR-PNMB-MCF',
    divisionId: 'MAQ',
    name: 'Mangalore Chemicals & Fertilizers (MCF) Siding',
    type: 'Industrial Siding',
    stationCode: 'PNMB',
    location: 'Panambur Industrial Area',
    sectionId: 'MAJN-PNMB',
    x: 320,
    y: 40,
    operator: 'MCF Adventz Group',
    commodity: 'Urea, Complex Chemical Fertilizers',
    sidingTracks: 4
  },
  {
    id: 'FR-PNMB-CONCOR',
    divisionId: 'MAQ',
    name: 'CONCOR Inland Container Depot (ICD)',
    type: 'Container Depot (CONCOR)',
    stationCode: 'PNMB',
    location: 'Panambur Rail Yard',
    sectionId: 'MAJN-PNMB',
    x: 335,
    y: 75,
    operator: 'Container Corporation of India',
    commodity: 'ISO Shipping Containers & EXIM cargo',
    sidingTracks: 3
  },
  {
    id: 'FR-PNMB-COAL',
    divisionId: 'MAQ',
    name: 'Mangalore Coal Terminal / UPC Siding',
    type: 'Power Plant Siding',
    stationCode: 'PNMB',
    location: 'Panambur Port Terminal 1',
    sectionId: 'MAJN-PNMB',
    x: 275,
    y: 50,
    operator: 'Udupi Power Corp / Adani Power',
    commodity: 'Thermal Coal for Udupi Power Station',
    sidingTracks: 4
  }
];

/**
 * ═══════════════════════════════════════════════════════════════
 * LOCALIZED MAINTENANCE WORK ZONES (LEVEL 3 INSPECTION)
 * Highlighting strictly specific track chainage, NOT entire sections
 * ═══════════════════════════════════════════════════════════════
 */
export const MAINTENANCE_WORK_ZONES: MaintenanceWorkZone[] = [
  // ── PALAKKAD DIVISION (PGT) ──────────────────────────────────
  {
    id: 'WZ-SRR-CLT-01',
    sectionId: 'SRR-CLT',
    sectionName: 'Shoranur Jn – Kozhikode Section',
    startStationCode: 'PTB',
    startStationName: 'Pattambi',
    endStationCode: 'PUM',
    endStationName: 'Pallippuram',
    line: 'UP Line',
    chainage: 'km 598/200 – km 601/400',
    status: 'Operational Conflict',
    criticality: 'High',
    workSummary: 'Integrated Track Tamping, 25kV OHE Inspection & Digital Axle Counter Overhaul',
    departments: ['Engineering', 'TRD', 'S&T'],
    estimatedDurationMin: 60,
    preferredWindow: '02:00 – 04:00',
    affectedTrains: [
      { trainNo: '12685', trainName: 'MAS MAQ SF EXP', category: 'Superfast Express', scheduledPassage: '02:10 IST', impact: 'Intersects requested slot on UP Line by 20 min' },
      { trainNo: '12601', trainName: 'MAS MAQ SF MAIL', category: 'Mail/Express', scheduledPassage: '05:54 IST', impact: 'Clean buffer available before passage' }
    ],
    conflictStatus: 'Operational Conflict',
    conflictDetail: 'Uncoordinated engineering and OHE possession clashing with train 12685 MAS MAQ SF EXP passage at 02:10 IST.',
    tasks: [
      { id: 'TASK-ENG-01', dept: 'Engineering', workType: 'Track maintenance & 09-3X Tamping', durationMin: 60, description: 'Deep hydraulic tamping & track cross-level alignment correction between km 598/200 and 601/400.', priority: 'High', resources: 'Plasser 09-3X Tamper, 1 PWI, 16 Gangmen' },
      { id: 'TASK-TRD-01', dept: 'TRD', workType: 'OHE inspection & Cantilever audit', durationMin: 30, description: 'Inspection of 25kV contact wire, dropper calibration, and insulator de-dusting.', priority: 'Medium', resources: '8-Wheeler Tower Wagon, 1 SSE/TRD, 5 Linemen' },
      { id: 'TASK-SNT-01', dept: 'S&T', workType: 'Digital Axle Counter & Point Maintenance', durationMin: 20, description: 'High-availability digital axle counter (HASSDAC) insulation test and point machine motor servicing.', priority: 'High', resources: 'Megger calibration kit, 1 SSE/Signal, 2 Technicians' }
    ],
    optimization: {
      compatibleTasksCount: 3,
      combinedBlockDurationMin: 60,
      recommendedWindow: '02:30 – 03:30',
      operationalImpact: 'Low',
      conflictsAvoided: 2,
      timeSavedMin: 50,
      synergyScore: 92,
      explanation: 'SolveX synchronized Engineering track possession, TRD OHE power shutdown, and S&T signaling checks into a single 60-minute window between 02:30 and 03:30 IST. Train 12685 safely clears Pattambi at 02:10, and Train 12601 approaches only at 05:54, ensuring 0 timetable clashes.',
      alternativeWindows: [
        { id: 'ALT-1', window: '02:30 – 03:30', durationMin: 60, operationalImpact: 'Low', conflicts: 0, isRecommended: true, reason: 'Optimal night freight/express gap. Zero passenger train headway penalties.' },
        { id: 'ALT-2', window: '03:45 – 04:45', durationMin: 60, operationalImpact: 'Medium', conflicts: 1, reason: 'Slight risk of delay propagation to early morning passenger trains.' },
        { id: 'ALT-3', window: '11:00 – 12:00', durationMin: 60, operationalImpact: 'High', conflicts: 3, reason: 'Major daytime corridor block; severe punctuality disruption on Malabar express trains.' }
      ],
      approvalStatus: 'Pending Review'
    }
  },
  {
    id: 'WZ-SRR-CLT-02',
    sectionId: 'SRR-CLT',
    sectionName: 'Shoranur Jn – Kozhikode Section',
    startStationCode: 'KTU',
    startStationName: 'Kuttippuram',
    endStationCode: 'TIR',
    endStationName: 'Tirur',
    line: 'DN Line',
    chainage: 'km 618/100 – km 622/500',
    status: 'Scheduled',
    criticality: 'Medium',
    workSummary: 'Sleeper renewal and ultrasonic rail flaw detection (USFD)',
    departments: ['Engineering'],
    estimatedDurationMin: 45,
    preferredWindow: '10:15 – 11:00',
    affectedTrains: [],
    conflictStatus: 'No Conflict',
    tasks: [
      { id: 'TASK-ENG-02', dept: 'Engineering', workType: 'USFD Testing & Rail Tensor Adjustment', durationMin: 45, description: 'Ultrasonic testing of welded rail joints on DN line.', priority: 'Medium', resources: 'Digital USFD trolley, 2 Technicians' }
    ],
    optimization: {
      compatibleTasksCount: 1,
      combinedBlockDurationMin: 45,
      recommendedWindow: '10:15 – 11:00',
      operationalImpact: 'Low',
      conflictsAvoided: 0,
      timeSavedMin: 0,
      synergyScore: 78,
      explanation: 'Standalone daylight possession safely scheduled during timetable gap between 22610 and 16346.',
      alternativeWindows: [
        { id: 'ALT-1', window: '10:15 – 11:00', durationMin: 45, operationalImpact: 'Low', conflicts: 0, isRecommended: true, reason: 'Clean scheduled window.' }
      ],
      approvalStatus: 'Approved by Officer',
      approvedBy: 'Sr. DOM / PGT',
      approvedAt: '08:30 IST'
    }
  },
  {
    id: 'WZ-PGT-SRR-01',
    sectionId: 'PGT-SRR',
    sectionName: 'Palakkad Jn – Shoranur Jn Section',
    startStationCode: 'PLL',
    startStationName: 'Parli',
    endStationCode: 'OTP',
    endStationName: 'Ottappalam',
    line: 'Both Lines',
    chainage: 'km 538/400 – km 541/200',
    status: 'Scheduled',
    criticality: 'High',
    workSummary: 'Power block & contact wire replacement at Bharathapuzha feeder',
    departments: ['TRD', 'Engineering'],
    estimatedDurationMin: 40,
    preferredWindow: '01:30 – 02:10',
    affectedTrains: [],
    conflictStatus: 'No Conflict',
    tasks: [
      { id: 'TASK-TRD-03', dept: 'TRD', workType: 'Feeder Wire Replacement', durationMin: 40, description: 'Re-stringing 107 sq.mm copper contact wire.', priority: 'High', resources: 'Tower Wagon, TRD Gang' }
    ],
    optimization: {
      compatibleTasksCount: 2,
      combinedBlockDurationMin: 40,
      recommendedWindow: '01:30 – 02:10',
      operationalImpact: 'Low',
      conflictsAvoided: 1,
      timeSavedMin: 20,
      synergyScore: 89,
      explanation: 'Synchronized with Palakkad yard shunt release.',
      alternativeWindows: [],
      approvalStatus: 'Approved by Officer',
      approvedBy: 'Sr. DEE/TRD / PGT',
      approvedAt: 'Yesterday 19:40 IST'
    }
  },

  // ── MANGALURU DIVISION (MAQ) ─────────────────────────────────
  {
    id: 'WZ-MAQ-SL-01',
    sectionId: 'SL-UD',
    sectionName: 'Surathkal – Udupi Section',
    startStationCode: 'MULK',
    startStationName: 'Mulki',
    endStationCode: 'PDD',
    endStationName: 'Padubidri',
    line: 'UP Line',
    chainage: 'km 32/200 – km 35/800',
    status: 'Operational Conflict',
    criticality: 'High',
    workSummary: 'Deep Ballast Screening & Bridge Pier Scour Inspection',
    departments: ['Engineering', 'S&T'],
    estimatedDurationMin: 50,
    preferredWindow: '11:15 – 12:05',
    affectedTrains: [
      { trainNo: '16586', trainName: 'Karwar Express', category: 'Mail/Express', scheduledPassage: '11:40 IST', impact: 'Clashes with single-line token working' }
    ],
    conflictStatus: 'Operational Conflict',
    conflictDetail: 'Single line block section clashing with Karwar Express arrival at Padubidri.',
    tasks: [
      { id: 'TASK-MAQ-ENG-01', dept: 'Engineering', workType: 'Ballast Cleaning Machine (BCM) working', durationMin: 50, description: 'Screening of track ballast and shoulder profiling.', priority: 'High', resources: 'BCM Machine, PWI Kundapura' },
      { id: 'TASK-MAQ-SNT-01', dept: 'S&T', workType: 'Optical Fiber Cable (OFC) realignment', durationMin: 30, description: 'OFC trench protection alongside bridge No. 44.', priority: 'Medium', resources: 'S&T Team' }
    ],
    optimization: {
      compatibleTasksCount: 2,
      combinedBlockDurationMin: 50,
      recommendedWindow: '12:20 – 13:10',
      operationalImpact: 'Low',
      conflictsAvoided: 1,
      timeSavedMin: 30,
      synergyScore: 88,
      explanation: 'SolveX shifted maintenance window past 16586 crossing at Padubidri. Achieved 0 delay on Konkan corridor.',
      alternativeWindows: [
        { id: 'ALT-M1', window: '12:20 – 13:10', durationMin: 50, operationalImpact: 'Low', conflicts: 0, isRecommended: true, reason: 'Optimal window following Karwar Exp clearance.' }
      ],
      approvalStatus: 'Pending Review'
    }
  },

  // ── THIRUVANANTHAPURAM DIVISION (TVC) ────────────────────────
  {
    id: 'WZ-TVC-KYJ-01',
    sectionId: 'KYJ-QLN',
    sectionName: 'Kayamkulam Jn – Kollam Jn Section',
    startStationCode: 'KPY',
    startStationName: 'Karunagappalli',
    endStationCode: 'STKT',
    endStationName: 'Sasthankotta',
    line: 'UP Line',
    chainage: 'km 132/400 – km 135/200',
    status: 'Operational Conflict',
    criticality: 'High',
    workSummary: 'Corridor Tamping & High-Speed Turnout Replacement',
    departments: ['Engineering', 'TRD'],
    estimatedDurationMin: 55,
    preferredWindow: '02:45 – 03:40',
    affectedTrains: [
      { trainNo: '16343', trainName: 'Amritha Express', category: 'Express', scheduledPassage: '03:15 IST', impact: 'Path overlap on UP mainline' }
    ],
    conflictStatus: 'Operational Conflict',
    conflictDetail: '16343 Amritha Express passage overlaps with requested track renewal window.',
    tasks: [
      { id: 'TASK-TVC-01', dept: 'Engineering', workType: 'Track Renewal', durationMin: 55, description: 'Turnout renewal at Sasthankotta.', priority: 'High', resources: 'UNIMAT Tamper, Gang 4' }
    ],
    optimization: {
      compatibleTasksCount: 1,
      combinedBlockDurationMin: 55,
      recommendedWindow: '03:30 – 04:25',
      operationalImpact: 'Low',
      conflictsAvoided: 1,
      timeSavedMin: 0,
      synergyScore: 84,
      explanation: 'Window deferred by 45 minutes to let Amritha Express clear Kollam. Punctuality preserved.',
      alternativeWindows: [],
      approvalStatus: 'Pending Review'
    }
  }
];

/**
 * ═══════════════════════════════════════════════════════════════
 * HELPER GETTERS
 * ═══════════════════════════════════════════════════════════════
 */
export const getDivisionById = (id: string): RailwayDivision => {
  return (
    RAILWAY_DIVISIONS.find(d => d.id === id || d.code === id) ||
    RAILWAY_DIVISIONS[0]
  );
};

export const getDivisionNetwork = (divId: string): DivisionMacroNetwork => {
  return DIVISION_NETWORKS[divId] || DIVISION_NETWORKS['PGT'];
};

export const getSectionStations = (sectionId: string): SectionStationNode[] => {
  return SECTION_STATION_NODES[sectionId] || [];
};

export const getWorkZonesForSection = (sectionId: string): MaintenanceWorkZone[] => {
  return MAINTENANCE_WORK_ZONES.filter(wz => wz.sectionId === sectionId);
};

export const getJunctionDetails = (code: string): JunctionDetail | null => {
  return JUNCTION_DETAILS[code] || null;
};

export const getTractionFacilitiesForDivision = (divId: string): TractionFacility[] => {
  return TRACTION_FACILITIES.filter(f => f.divisionId === divId);
};

export const getFreightFacilitiesForDivision = (divId: string): FreightFacility[] => {
  return FREIGHT_FACILITIES.filter(f => f.divisionId === divId);
};

export interface SearchResultItem {
  id: string;
  type: 'Division' | 'Section' | 'Station' | 'Work Zone' | 'Train' | 'Traction' | 'Freight';
  title: string;
  subtitle: string;
  divisionId: string;
  sectionId?: string;
  workZoneId?: string;
  stationCode?: string;
  actionHint: string;
}

/**
 * DIVISION-AWARE SEARCH
 * When Palakkad is selected, search strictly returns Palakkad stations,
 * sections, work zones, infrastructure, and trains.
 */
export const searchHierarchy = (
  query: string,
  divisionId: string
): SearchResultItem[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResultItem[] = [];
  const net = getDivisionNetwork(divisionId);
  const divObj = getDivisionById(divisionId);

  // 1. Search Sections in active division
  net.sections.forEach(sec => {
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
        subtitle: `${divObj.name} · Section ${sec.id} · ${sec.lengthKm} km · ${sec.status}`,
        divisionId: divisionId,
        sectionId: sec.id,
        actionHint: 'Drill down into Section'
      });
    }
  });

  // 2. Search Stations in active division
  const seenStations = new Set<string>();
  Object.entries(SECTION_STATION_NODES).forEach(([secId, nodes]) => {
    if (!net.sections.some(s => s.id === secId)) return; // Only active division

    nodes.forEach(node => {
      if (
        node.name.toLowerCase().includes(q) ||
        node.code.toLowerCase().includes(q)
      ) {
        if (!seenStations.has(node.code)) {
          seenStations.add(node.code);
          results.push({
            id: `ST-${node.code}-${secId}`,
            type: 'Station',
            title: `${node.name} (${node.code})`,
            subtitle: `${node.nodeType} · km ${node.km} · ${divObj.name}`,
            divisionId: divisionId,
            sectionId: secId,
            stationCode: node.code,
            actionHint: 'View in Section Map'
          });
        }
      }
    });
  });

  // 3. Search Work Zones in active division
  MAINTENANCE_WORK_ZONES.filter(wz => net.sections.some(s => s.id === wz.sectionId)).forEach(wz => {
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
        divisionId: divisionId,
        sectionId: wz.sectionId,
        workZoneId: wz.id,
        actionHint: 'Inspect SolveX Block Optimization'
      });
    }
  });

  // 4. Search Traction Infrastructure in active division
  TRACTION_FACILITIES.filter(f => f.divisionId === divisionId).forEach(f => {
    if (
      f.name.toLowerCase().includes(q) ||
      f.type.toLowerCase().includes(q) ||
      f.location.toLowerCase().includes(q) ||
      (f.stationCode && f.stationCode.toLowerCase().includes(q))
    ) {
      results.push({
        id: f.id,
        type: 'Traction',
        title: f.name,
        subtitle: `${f.type} · ${f.location} · ${f.voltage}`,
        divisionId: divisionId,
        sectionId: f.sectionId,
        actionHint: 'Inspect Electrical Facility'
      });
    }
  });

  // 5. Search Freight Infrastructure in active division
  FREIGHT_FACILITIES.filter(f => f.divisionId === divisionId).forEach(f => {
    if (
      f.name.toLowerCase().includes(q) ||
      f.type.toLowerCase().includes(q) ||
      f.commodity.toLowerCase().includes(q) ||
      f.location.toLowerCase().includes(q) ||
      f.stationCode.toLowerCase().includes(q)
    ) {
      results.push({
        id: f.id,
        type: 'Freight',
        title: f.name,
        subtitle: `${f.type} · ${f.commodity} · ${f.location}`,
        divisionId: divisionId,
        sectionId: f.sectionId,
        actionHint: 'View Freight Infrastructure'
      });
    }
  });

  // 6. Search Trains in active division
  const simulatedTrainsByDiv: Record<string, { no: string; name: string; section: string; wzId?: string }[]> = {
    PGT: [
      { no: '12685', name: 'MAS MAQ SF EXP', section: 'SRR-CLT', wzId: 'WZ-SRR-CLT-01' },
      { no: '12601', name: 'MAS MAQ SF MAIL', section: 'SRR-CLT', wzId: 'WZ-SRR-CLT-01' },
      { no: '22610', name: 'INTERCITY SF EX', section: 'SRR-CLT', wzId: 'WZ-SRR-CLT-02' },
      { no: '20632', name: 'TVC MAQ VB EXP', section: 'SRR-CLT', wzId: 'WZ-SRR-CLT-01' },
      { no: '16512', name: 'CLT SBC EXPRESS', section: 'CLT-CAN' },
      { no: '16346', name: 'NETHRAVATHI EXP', section: 'SRR-CLT' },
      { no: '16621', name: 'RMM MAQ EXPRESS', section: 'PGTN-POY' },
      { no: '4022', name: 'BOXN Container Freight', section: 'PGT-SRR', wzId: 'WZ-PGT-SRR-01' }
    ],
    MAQ: [
      { no: '16586', name: 'Karwar Express', section: 'SL-UD', wzId: 'WZ-MAQ-SL-01' },
      { no: '20658', name: 'MAQ Vande Bharat', section: 'MAQ-MAJN' },
      { no: '56214', name: 'Hassan Passenger', section: 'MAJN-SBHR' },
      { no: '8821', name: 'NMPT Coal Freight', section: 'MAJN-PNMB' }
    ],
    TVC: [
      { no: '20633', name: 'TVC Vande Bharat Express', section: 'QLN-TVC' },
      { no: '16343', name: 'Amritha Express', section: 'KYJ-QLN', wzId: 'WZ-TVC-KYJ-01' },
      { no: '16127', name: 'Guruvayur Express', section: 'QLN-TVC' }
    ]
  };

  (simulatedTrainsByDiv[divisionId] || []).forEach(t => {
    if (t.no.includes(q) || t.name.toLowerCase().includes(q)) {
      results.push({
        id: `TRAIN-${t.no}`,
        type: 'Train',
        title: `${t.no} ${t.name}`,
        subtitle: `Path through ${divObj.name} (Section ${t.section})`,
        divisionId: divisionId,
        sectionId: t.section,
        workZoneId: t.wzId,
        actionHint: 'View Track Section'
      });
    }
  });

  return results.slice(0, 10);
};
