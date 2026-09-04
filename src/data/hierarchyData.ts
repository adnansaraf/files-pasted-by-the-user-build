import {
  RailwayDivision,
  SectionStationNode,
  MaintenanceWorkZone,
  RailwaySection,
  RailwayStation
} from '../types';

/**
 * ═══════════════════════════════════════════════════════════════
 * HIERARCHICAL RAILWAY DATA MODEL (SCALABLE MULTI-DIVISION NETWORK)
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
    isPopulatedDemo: true,
    sectionsCount: 7,
    activeBlocksCount: 3,
    pendingRequestsCount: 6
  },
  {
    id: 'MAS',
    name: 'Chennai Division',
    code: 'MAS',
    zone: 'Southern Railway (SR)',
    routeKm: 697,
    hq: 'Chennai (Tamil Nadu)',
    isPopulatedDemo: true,
    sectionsCount: 7,
    activeBlocksCount: 4,
    pendingRequestsCount: 9
  },
  {
    id: 'MYS',
    name: 'Mysuru Division',
    code: 'MYS',
    zone: 'South Western Railway (SWR)',
    routeKm: 1109,
    hq: 'Mysuru (Karnataka)',
    isPopulatedDemo: true,
    sectionsCount: 6,
    activeBlocksCount: 2,
    pendingRequestsCount: 5
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
    isShowcase?: boolean;
  }[];
  sections: RailwaySection[];
}

export const DIVISION_NETWORKS: Record<string, DivisionMacroNetwork> = {
  // ── PALAKKAD DIVISION (PGT) ───────────────────────────────────
  PGT: {
    stations: [
      { code: 'PGT', name: 'Palakkad Jn', letter: 'A', km: 0, junction: true, x: 120, y: 140 },
      { code: 'OTP', name: 'Ottappalam', letter: 'B', km: 33, junction: false, x: 280, y: 140 },
      { code: 'SRR', name: 'Shoranur Jn', letter: 'C', km: 46, junction: true, x: 440, y: 180 },
      { code: 'TIR', name: 'Tirur', letter: 'D', km: 91, junction: false, x: 610, y: 130 },
      { code: 'CLT', name: 'Kozhikode', letter: 'E', km: 131, junction: true, x: 780, y: 130 },
      { code: 'TCR', name: 'Thrissur', letter: 'F', km: 79, junction: true, x: 440, y: 300 },
      { code: 'POY', name: 'Pollachi Jn', letter: 'G', km: 54, junction: true, x: 120, y: 280 }
    ],
    sectionLines: [
      { id: 'A-B', from: 'PGT', to: 'OTP', x1: 120, y1: 140, x2: 280, y2: 140, name: 'Palakkad – Ottappalam', labelX: 200, labelY: 118 },
      { id: 'B-C', from: 'OTP', to: 'SRR', x1: 280, y1: 140, x2: 440, y2: 180, name: 'Ottappalam – Shoranur Jn', labelX: 360, labelY: 148 },
      { id: 'C-D', from: 'SRR', to: 'TIR', x1: 440, y1: 180, x2: 610, y2: 130, name: 'Shoranur Jn – Tirur (Showcase)', labelX: 525, labelY: 138, isShowcase: true },
      { id: 'D-E', from: 'TIR', to: 'CLT', x1: 610, y1: 130, x2: 780, y2: 130, name: 'Tirur – Kozhikode', labelX: 695, labelY: 108 },
      { id: 'C-F', from: 'SRR', to: 'TCR', x1: 440, y1: 180, x2: 440, y2: 300, name: 'Shoranur – Thrissur Chord', labelX: 462, labelY: 245 },
      { id: 'A-G', from: 'PGT', to: 'POY', x1: 120, y1: 140, x2: 120, y2: 280, name: 'Palakkad – Pollachi Branch', labelX: 144, labelY: 215 }
    ],
    sections: [
      { id: 'A-B', fromCode: 'PGT', toCode: 'OTP', fromName: 'Palakkad Jn', toName: 'Ottappalam', lengthKm: 33, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Maintenance Planned', plannedBlockIds: ['BLK-204'], currentSpeedRestriction: '45 km/h at km 528/4-8', divisionId: 'PGT' },
      { id: 'B-C', fromCode: 'OTP', toCode: 'SRR', fromName: 'Ottappalam', toName: 'Shoranur Jn', lengthKm: 13, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 100, status: 'Available', divisionId: 'PGT' },
      { id: 'C-D', fromCode: 'SRR', toCode: 'TIR', fromName: 'Shoranur Jn', toName: 'Tirur', lengthKm: 45, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Active Block', activeBlockId: 'BLK-205', divisionId: 'PGT' },
      { id: 'D-E', fromCode: 'TIR', toCode: 'CLT', fromName: 'Tirur', toName: 'Kozhikode', lengthKm: 41, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Conflict', plannedBlockIds: ['BLK-206'], divisionId: 'PGT' },
      { id: 'C-F', fromCode: 'SRR', toCode: 'TCR', fromName: 'Shoranur Jn', toName: 'Thrissur', lengthKm: 33, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 105, status: 'Available', divisionId: 'PGT' },
      { id: 'A-G', fromCode: 'PGT', toCode: 'POY', fromName: 'Palakkad Jn', toName: 'Pollachi Jn', lengthKm: 54, tracks: 'Single Line', traction: '25 kV AC Electrified', mps: 90, status: 'Speed Restriction', currentSpeedRestriction: '30 km/h ghat curve', divisionId: 'PGT' }
    ]
  },

  // ── THIRUVANANTHAPURAM DIVISION (TVC) ─────────────────────────
  TVC: {
    stations: [
      { code: 'ERS', name: 'Ernakulam Jn', letter: 'A', km: 0, junction: true, x: 120, y: 120 },
      { code: 'ALLP', name: 'Alappuzha', letter: 'B', km: 57, junction: false, x: 230, y: 240 },
      { code: 'KTYM', name: 'Kottayam', letter: 'C', km: 60, junction: true, x: 280, y: 120 },
      { code: 'KYJ', name: 'Kayamkulam Jn', letter: 'D', km: 115, junction: true, x: 440, y: 190 },
      { code: 'QLN', name: 'Kollam Jn', letter: 'E', km: 156, junction: true, x: 590, y: 200 },
      { code: 'TVC', name: 'Thiruvananthapuram Central', letter: 'F', km: 220, junction: true, x: 740, y: 200 },
      { code: 'NCJ', name: 'Nagercoil Jn', letter: 'G', km: 291, junction: true, x: 880, y: 230 }
    ],
    sectionLines: [
      { id: 'TVC-S1', from: 'ERS', to: 'KTYM', x1: 120, y1: 120, x2: 280, y2: 120, name: 'Ernakulam – Kottayam Mainline', labelX: 200, labelY: 98, isShowcase: true },
      { id: 'TVC-S2', from: 'KTYM', to: 'KYJ', x1: 280, y1: 120, x2: 440, y2: 190, name: 'Kottayam – Kayamkulam Jn', labelX: 360, labelY: 145 },
      { id: 'TVC-S3', from: 'KYJ', to: 'QLN', x1: 440, y1: 190, x2: 590, y2: 200, name: 'Kayamkulam – Kollam Jn', labelX: 515, labelY: 178 },
      { id: 'TVC-S4', from: 'QLN', to: 'TVC', x1: 590, y1: 200, x2: 740, y2: 200, name: 'Kollam – Thiruvananthapuram', labelX: 665, labelY: 178, isShowcase: true },
      { id: 'TVC-S5', from: 'TVC', to: 'NCJ', x1: 740, y1: 200, x2: 880, y2: 230, name: 'Thiruvananthapuram – Nagercoil', labelX: 810, labelY: 200 },
      { id: 'TVC-S6', from: 'ERS', to: 'ALLP', x1: 120, y1: 120, x2: 230, y2: 240, name: 'Ernakulam – Alappuzha Coastal', labelX: 155, labelY: 195 },
      { id: 'TVC-S7', from: 'ALLP', to: 'KYJ', x1: 230, y1: 240, x2: 440, y2: 190, name: 'Alappuzha – Kayamkulam Chord', labelX: 330, labelY: 235 }
    ],
    sections: [
      { id: 'TVC-S1', fromCode: 'ERS', toCode: 'KTYM', fromName: 'Ernakulam Jn', toName: 'Kottayam', lengthKm: 60, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 105, status: 'Active Block', activeBlockId: 'BLK-TVC-01', divisionId: 'TVC' },
      { id: 'TVC-S2', fromCode: 'KTYM', toCode: 'KYJ', fromName: 'Kottayam', toName: 'Kayamkulam Jn', lengthKm: 55, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Maintenance Planned', plannedBlockIds: ['BLK-TVC-02'], divisionId: 'TVC' },
      { id: 'TVC-S3', fromCode: 'KYJ', toCode: 'QLN', fromName: 'Kayamkulam Jn', toName: 'Kollam Jn', lengthKm: 41, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Conflict', divisionId: 'TVC' },
      { id: 'TVC-S4', fromCode: 'QLN', toCode: 'TVC', fromName: 'Kollam Jn', toName: 'Thiruvananthapuram Central', lengthKm: 65, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 100, status: 'Active Block', activeBlockId: 'BLK-TVC-03', divisionId: 'TVC' },
      { id: 'TVC-S5', fromCode: 'TVC', toCode: 'NCJ', fromName: 'Thiruvananthapuram Central', toName: 'Nagercoil Jn', lengthKm: 71, tracks: 'Single Line', traction: '25 kV AC Electrified', mps: 90, status: 'Speed Restriction', currentSpeedRestriction: '40 km/h bridge work', divisionId: 'TVC' },
      { id: 'TVC-S6', fromCode: 'ERS', toCode: 'ALLP', fromName: 'Ernakulam Jn', toName: 'Alappuzha', lengthKm: 57, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 100, status: 'Available', divisionId: 'TVC' },
      { id: 'TVC-S7', fromCode: 'ALLP', toCode: 'KYJ', fromName: 'Alappuzha', toName: 'Kayamkulam Jn', lengthKm: 44, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 105, status: 'Available', divisionId: 'TVC' }
    ]
  },

  // ── CHENNAI DIVISION (MAS) ────────────────────────────────────
  MAS: {
    stations: [
      { code: 'MAS', name: 'Chennai Central', letter: 'A', km: 0, junction: true, x: 450, y: 170 },
      { code: 'AJJ', name: 'Arakkonam Jn', letter: 'B', km: 69, junction: true, x: 280, y: 170 },
      { code: 'KPD', name: 'Katpadi Jn', letter: 'C', km: 130, junction: true, x: 140, y: 170 },
      { code: 'JTJ', name: 'Jolarpettai Jn', letter: 'D', km: 214, junction: true, x: 60, y: 250 },
      { code: 'GPD', name: 'Gummidipoondi', letter: 'E', km: 47, junction: false, x: 550, y: 90 },
      { code: 'SPE', name: 'Sullurupeta', letter: 'F', km: 83, junction: false, x: 670, y: 70 },
      { code: 'GDR', name: 'Gudur Jn', letter: 'G', km: 138, junction: true, x: 800, y: 60 },
      { code: 'TBM', name: 'Tambaram', letter: 'H', km: 29, junction: true, x: 450, y: 260 },
      { code: 'CGL', name: 'Chengalpattu Jn', letter: 'I', km: 60, junction: true, x: 450, y: 325 }
    ],
    sectionLines: [
      { id: 'MAS-S1', from: 'MAS', to: 'AJJ', x1: 450, y1: 170, x2: 280, y2: 170, name: 'Chennai Central – Arakkonam Jn', labelX: 365, labelY: 148, isShowcase: true },
      { id: 'MAS-S2', from: 'AJJ', to: 'KPD', x1: 280, y1: 170, x2: 140, y2: 170, name: 'Arakkonam Jn – Katpadi Jn', labelX: 210, labelY: 148 },
      { id: 'MAS-S3', from: 'KPD', to: 'JTJ', x1: 140, y1: 170, x2: 60, y2: 250, name: 'Katpadi – Jolarpettai Jn', labelX: 85, labelY: 200 },
      { id: 'MAS-S4', from: 'MAS', to: 'GPD', x1: 450, y1: 170, x2: 550, y2: 90, name: 'Chennai Central – Gummidipoondi', labelX: 495, labelY: 118 },
      { id: 'MAS-S5', from: 'GPD', to: 'GDR', x1: 550, y1: 90, x2: 800, y2: 60, name: 'Gummidipoondi – Gudur Jn', labelX: 680, labelY: 45, isShowcase: true },
      { id: 'MAS-S6', from: 'MAS', to: 'TBM', x1: 450, y1: 170, x2: 450, y2: 260, name: 'Chennai Central – Tambaram Suburban', labelX: 472, labelY: 215 },
      { id: 'MAS-S7', from: 'TBM', to: 'CGL', x1: 450, y1: 260, x2: 450, y2: 325, name: 'Tambaram – Chengalpattu Jn', labelX: 472, labelY: 295 }
    ],
    sections: [
      { id: 'MAS-S1', fromCode: 'MAS', toCode: 'AJJ', fromName: 'Chennai Central', toName: 'Arakkonam Jn', lengthKm: 69, tracks: 'Multiple', traction: '25 kV AC Electrified', mps: 130, status: 'Active Block', activeBlockId: 'BLK-MAS-01', divisionId: 'MAS' },
      { id: 'MAS-S2', fromCode: 'AJJ', toCode: 'KPD', fromName: 'Arakkonam Jn', toName: 'Katpadi Jn', lengthKm: 61, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 130, status: 'Maintenance Planned', plannedBlockIds: ['BLK-MAS-02'], divisionId: 'MAS' },
      { id: 'MAS-S3', fromCode: 'KPD', toCode: 'JTJ', fromName: 'Katpadi Jn', toName: 'Jolarpettai Jn', lengthKm: 84, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 120, status: 'Available', divisionId: 'MAS' },
      { id: 'MAS-S4', fromCode: 'MAS', toCode: 'GPD', fromName: 'Chennai Central', toName: 'Gummidipoondi', lengthKm: 47, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Available', divisionId: 'MAS' },
      { id: 'MAS-S5', fromCode: 'GPD', toCode: 'GDR', fromName: 'Gummidipoondi', toName: 'Gudur Jn', lengthKm: 91, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 130, status: 'Conflict', plannedBlockIds: ['BLK-MAS-03'], divisionId: 'MAS' },
      { id: 'MAS-S6', fromCode: 'MAS', toCode: 'TBM', fromName: 'Chennai Central', toName: 'Tambaram', lengthKm: 29, tracks: 'Multiple', traction: '25 kV AC Electrified', mps: 100, status: 'Active Block', activeBlockId: 'BLK-MAS-04', divisionId: 'MAS' },
      { id: 'MAS-S7', fromCode: 'TBM', toCode: 'CGL', fromName: 'Tambaram', toName: 'Chengalpattu Jn', lengthKm: 31, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Speed Restriction', currentSpeedRestriction: '50 km/h yard remodelling', divisionId: 'MAS' }
    ]
  },

  // ── MYSURU DIVISION (MYS) ─────────────────────────────────────
  MYS: {
    stations: [
      { code: 'MYS', name: 'Mysuru Jn', letter: 'A', km: 0, junction: true, x: 130, y: 220 },
      { code: 'MYA', name: 'Mandya', letter: 'B', km: 45, junction: false, x: 290, y: 200 },
      { code: 'RMGM', name: 'Ramanagaram', letter: 'C', km: 93, junction: false, x: 450, y: 180 },
      { code: 'KGI', name: 'Kengeri', letter: 'D', km: 126, junction: false, x: 610, y: 160 },
      { code: 'SBC', name: 'KSR Bengaluru', letter: 'E', km: 138, junction: true, x: 770, y: 150 },
      { code: 'HAS', name: 'Hassan Jn', letter: 'F', km: 119, junction: true, x: 220, y: 90 },
      { code: 'ASK', name: 'Arsikere Jn', letter: 'G', km: 166, junction: true, x: 380, y: 70 },
      { code: 'RRB', name: 'Birur Jn', letter: 'H', km: 211, junction: true, x: 540, y: 70 }
    ],
    sectionLines: [
      { id: 'MYS-S1', from: 'MYS', to: 'MYA', x1: 130, y1: 220, x2: 290, y2: 200, name: 'Mysuru Jn – Mandya Express Route', labelX: 210, labelY: 198, isShowcase: true },
      { id: 'MYS-S2', from: 'MYA', to: 'RMGM', x1: 290, y1: 200, x2: 450, y2: 180, name: 'Mandya – Ramanagaram', labelX: 370, labelY: 178 },
      { id: 'MYS-S3', from: 'RMGM', to: 'SBC', x1: 450, y1: 180, x2: 770, y2: 150, name: 'Ramanagaram – KSR Bengaluru', labelX: 610, labelY: 148, isShowcase: true },
      { id: 'MYS-S4', from: 'MYS', to: 'HAS', x1: 130, y1: 220, x2: 220, y2: 90, name: 'Mysuru – Hassan Jn', labelX: 160, labelY: 140 },
      { id: 'MYS-S5', from: 'HAS', to: 'ASK', x1: 220, y1: 90, x2: 380, y2: 70, name: 'Hassan – Arsikere Jn Chord', labelX: 300, labelY: 65 },
      { id: 'MYS-S6', from: 'ASK', to: 'RRB', x1: 380, y1: 70, x2: 540, y2: 70, name: 'Arsikere – Birur Jn Mainline', labelX: 460, labelY: 55 }
    ],
    sections: [
      { id: 'MYS-S1', fromCode: 'MYS', toCode: 'MYA', fromName: 'Mysuru Jn', toName: 'Mandya', lengthKm: 45, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Active Block', activeBlockId: 'BLK-MYS-01', divisionId: 'MYS' },
      { id: 'MYS-S2', fromCode: 'MYA', toCode: 'RMGM', fromName: 'Mandya', toName: 'Ramanagaram', lengthKm: 48, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Available', divisionId: 'MYS' },
      { id: 'MYS-S3', fromCode: 'RMGM', toCode: 'SBC', fromName: 'Ramanagaram', toName: 'KSR Bengaluru', lengthKm: 45, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 110, status: 'Conflict', plannedBlockIds: ['BLK-MYS-02'], divisionId: 'MYS' },
      { id: 'MYS-S4', fromCode: 'MYS', toCode: 'HAS', fromName: 'Mysuru Jn', toName: 'Hassan Jn', lengthKm: 119, tracks: 'Single Line', traction: 'Non-Electrified', mps: 90, status: 'Maintenance Planned', divisionId: 'MYS' },
      { id: 'MYS-S5', fromCode: 'HAS', toCode: 'ASK', fromName: 'Hassan Jn', toName: 'Arsikere Jn', lengthKm: 47, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 100, status: 'Available', divisionId: 'MYS' },
      { id: 'MYS-S6', fromCode: 'ASK', toCode: 'RRB', fromName: 'Arsikere Jn', toName: 'Birur Jn', lengthKm: 45, tracks: 'Double Line', traction: '25 kV AC Electrified', mps: 100, status: 'Speed Restriction', currentSpeedRestriction: '45 km/h bridge rehabilitation', divisionId: 'MYS' }
    ]
  }
};

/**
 * ═══════════════════════════════════════════════════════════════
 * INTERMEDIATE STATIONS FOR ALL SECTIONS IN ALL DIVISIONS
 * Strictly using "Station", "Railway Station", or "Station Node"
 * ═══════════════════════════════════════════════════════════════
 */
export const SECTION_STATION_NODES: Record<string, SectionStationNode[]> = {
  // ── PALAKKAD DIVISION (PGT) SECTIONS ──────────────────────────
  'C-D': [
    { id: 'ST-SRR', code: 'SRR', name: 'Shoranur Jn', km: 46.0, junction: true, sectionId: 'C-D', nodeType: 'Junction Station' },
    { id: 'ST-PTB', code: 'PTB', name: 'Pattambi', km: 57.5, junction: false, sectionId: 'C-D', nodeType: 'Intermediate Station' },
    { id: 'ST-PUM', code: 'PUM', name: 'Pallippuram', km: 66.8, junction: false, sectionId: 'C-D', nodeType: 'Intermediate Station' },
    { id: 'ST-KTU', code: 'KTU', name: 'Kuttippuram', km: 75.4, junction: false, sectionId: 'C-D', nodeType: 'Intermediate Station' },
    { id: 'ST-TNA', code: 'TNA', name: 'Tirunnavaya', km: 84.2, junction: false, sectionId: 'C-D', nodeType: 'Intermediate Station' },
    { id: 'ST-TIR', code: 'TIR', name: 'Tirur', km: 91.0, junction: false, sectionId: 'C-D', nodeType: 'Terminal Station' }
  ],
  'A-B': [
    { id: 'ST-PGT', code: 'PGT', name: 'Palakkad Jn', km: 0.0, junction: true, sectionId: 'A-B', nodeType: 'Junction Station' },
    { id: 'ST-PLL', code: 'PLL', name: 'Parli', km: 8.5, junction: false, sectionId: 'A-B', nodeType: 'Intermediate Station' },
    { id: 'ST-MNY', code: 'MNY', name: 'Mankara', km: 16.2, junction: false, sectionId: 'A-B', nodeType: 'Intermediate Station' },
    { id: 'ST-LDY', code: 'LDY', name: 'Lakkiti', km: 24.1, junction: false, sectionId: 'A-B', nodeType: 'Intermediate Station' },
    { id: 'ST-OTP', code: 'OTP', name: 'Ottappalam', km: 33.0, junction: false, sectionId: 'A-B', nodeType: 'Terminal Station' }
  ],
  'B-C': [
    { id: 'ST-OTP2', code: 'OTP', name: 'Ottappalam', km: 33.0, junction: false, sectionId: 'B-C', nodeType: 'Terminal Station' },
    { id: 'ST-MNUR', code: 'MNUR', name: 'Mannanur', km: 39.5, junction: false, sectionId: 'B-C', nodeType: 'Intermediate Station' },
    { id: 'ST-SRR2', code: 'SRR', name: 'Shoranur Jn', km: 46.0, junction: true, sectionId: 'B-C', nodeType: 'Junction Station' }
  ],
  'D-E': [
    { id: 'ST-TIR2', code: 'TIR', name: 'Tirur', km: 91.0, junction: false, sectionId: 'D-E', nodeType: 'Terminal Station' },
    { id: 'ST-TA', code: 'TA', name: 'Tanur', km: 99.2, junction: false, sectionId: 'D-E', nodeType: 'Intermediate Station' },
    { id: 'ST-PGI', code: 'PGI', name: 'Parappanangadi', km: 107.0, junction: false, sectionId: 'D-E', nodeType: 'Intermediate Station' },
    { id: 'ST-VLI', code: 'VLI', name: 'Vallikkunnu', km: 112.5, junction: false, sectionId: 'D-E', nodeType: 'Intermediate Station' },
    { id: 'ST-FK', code: 'FK', name: 'Ferok', km: 120.4, junction: false, sectionId: 'D-E', nodeType: 'Intermediate Station' },
    { id: 'ST-CLT', code: 'CLT', name: 'Kozhikode', km: 131.0, junction: true, sectionId: 'D-E', nodeType: 'Junction Station' }
  ],
  'C-F': [
    { id: 'ST-SRR3', code: 'SRR', name: 'Shoranur Jn', km: 46.0, junction: true, sectionId: 'C-F', nodeType: 'Junction Station' },
    { id: 'ST-VTK', code: 'VTK', name: 'Vallathol Nagar', km: 50.2, junction: false, sectionId: 'C-F', nodeType: 'Intermediate Station' },
    { id: 'ST-MUC', code: 'MUC', name: 'Mullurkara', km: 58.1, junction: false, sectionId: 'C-F', nodeType: 'Intermediate Station' },
    { id: 'ST-WKI', code: 'WKI', name: 'Wadakancheri', km: 64.1, junction: false, sectionId: 'C-F', nodeType: 'Intermediate Station' },
    { id: 'ST-PNQ', code: 'PNQ', name: 'Punkunnam', km: 76.5, junction: false, sectionId: 'C-F', nodeType: 'Intermediate Station' },
    { id: 'ST-TCR', code: 'TCR', name: 'Thrissur', km: 79.0, junction: true, sectionId: 'C-F', nodeType: 'Junction Station' }
  ],
  'A-G': [
    { id: 'ST-PGT2', code: 'PGT', name: 'Palakkad Jn', km: 0.0, junction: true, sectionId: 'A-G', nodeType: 'Junction Station' },
    { id: 'ST-PGTN', code: 'PGTN', name: 'Palakkad Town', km: 4.2, junction: false, sectionId: 'A-G', nodeType: 'Intermediate Station' },
    { id: 'ST-PDGM', code: 'PDGM', name: 'Pudunagaram', km: 15.0, junction: false, sectionId: 'A-G', nodeType: 'Intermediate Station' },
    { id: 'ST-KLGD', code: 'KLGD', name: 'Kollengode', km: 22.8, junction: false, sectionId: 'A-G', nodeType: 'Intermediate Station' },
    { id: 'ST-MMDA', code: 'MMDA', name: 'Muthalamada', km: 31.0, junction: false, sectionId: 'A-G', nodeType: 'Intermediate Station' },
    { id: 'ST-POY', code: 'POY', name: 'Pollachi Jn', km: 54.0, junction: true, sectionId: 'A-G', nodeType: 'Junction Station' }
  ],

  // ── THIRUVANANTHAPURAM DIVISION (TVC) SECTIONS ────────────────
  'TVC-S1': [
    { id: 'ST-ERS', code: 'ERS', name: 'Ernakulam Jn', km: 0.0, junction: true, sectionId: 'TVC-S1', nodeType: 'Junction Station' },
    { id: 'ST-TRTR', code: 'TRTR', name: 'Tripunithura', km: 9.8, junction: false, sectionId: 'TVC-S1', nodeType: 'Intermediate Station' },
    { id: 'ST-PVRD', code: 'PVRD', name: 'Piravom Road', km: 28.5, junction: false, sectionId: 'TVC-S1', nodeType: 'Intermediate Station' },
    { id: 'ST-VARD', code: 'VARD', name: 'Vaikom Road', km: 34.6, junction: false, sectionId: 'TVC-S1', nodeType: 'Intermediate Station' },
    { id: 'ST-ETM', code: 'ETM', name: 'Ettumanur', km: 49.8, junction: false, sectionId: 'TVC-S1', nodeType: 'Intermediate Station' },
    { id: 'ST-KTYM', code: 'KTYM', name: 'Kottayam', km: 60.0, junction: true, sectionId: 'TVC-S1', nodeType: 'Terminal Station' }
  ],
  'TVC-S2': [
    { id: 'ST-KTYM2', code: 'KTYM', name: 'Kottayam', km: 60.0, junction: true, sectionId: 'TVC-S2', nodeType: 'Terminal Station' },
    { id: 'ST-CGY', code: 'CGY', name: 'Changanassery', km: 77.8, junction: false, sectionId: 'TVC-S2', nodeType: 'Intermediate Station' },
    { id: 'ST-TRVL', code: 'TRVL', name: 'Tiruvalla', km: 85.8, junction: false, sectionId: 'TVC-S2', nodeType: 'Intermediate Station' },
    { id: 'ST-CNGR', code: 'CNGR', name: 'Chengannur', km: 95.1, junction: false, sectionId: 'TVC-S2', nodeType: 'Intermediate Station' },
    { id: 'ST-MVLK', code: 'MVLK', name: 'Mavelikara', km: 107.5, junction: false, sectionId: 'TVC-S2', nodeType: 'Intermediate Station' },
    { id: 'ST-KYJ', code: 'KYJ', name: 'Kayamkulam Jn', km: 115.0, junction: true, sectionId: 'TVC-S2', nodeType: 'Junction Station' }
  ],
  'TVC-S3': [
    { id: 'ST-KYJ2', code: 'KYJ', name: 'Kayamkulam Jn', km: 115.0, junction: true, sectionId: 'TVC-S3', nodeType: 'Junction Station' },
    { id: 'ST-KPY', code: 'KPY', name: 'Karunagappalli', km: 128.8, junction: false, sectionId: 'TVC-S3', nodeType: 'Intermediate Station' },
    { id: 'ST-STKT', code: 'STKT', name: 'Sasthankotta', km: 136.6, junction: false, sectionId: 'TVC-S3', nodeType: 'Intermediate Station' },
    { id: 'ST-MQO', code: 'MQO', name: 'Munroturuttu', km: 141.2, junction: false, sectionId: 'TVC-S3', nodeType: 'Intermediate Station' },
    { id: 'ST-QLN', code: 'QLN', name: 'Kollam Jn', km: 156.0, junction: true, sectionId: 'TVC-S3', nodeType: 'Terminal Station' }
  ],
  'TVC-S4': [
    { id: 'ST-QLN2', code: 'QLN', name: 'Kollam Jn', km: 156.0, junction: true, sectionId: 'TVC-S4', nodeType: 'Terminal Station' },
    { id: 'ST-PVU', code: 'PVU', name: 'Paravur', km: 168.4, junction: false, sectionId: 'TVC-S4', nodeType: 'Intermediate Station' },
    { id: 'ST-VAK', code: 'VAK', name: 'Varkala Sivagiri', km: 179.6, junction: false, sectionId: 'TVC-S4', nodeType: 'Intermediate Station' },
    { id: 'ST-KVU', code: 'KVU', name: 'Kadakkavur', km: 188.8, junction: false, sectionId: 'TVC-S4', nodeType: 'Intermediate Station' },
    { id: 'ST-KZK', code: 'KZK', name: 'Kazhakkuttam', km: 206.5, junction: false, sectionId: 'TVC-S4', nodeType: 'Intermediate Station' },
    { id: 'ST-TVC', code: 'TVC', name: 'Thiruvananthapuram Central', km: 220.0, junction: true, sectionId: 'TVC-S4', nodeType: 'Junction Station' }
  ],
  'TVC-S5': [
    { id: 'ST-TVC2', code: 'TVC', name: 'Thiruvananthapuram Central', km: 220.0, junction: true, sectionId: 'TVC-S5', nodeType: 'Junction Station' },
    { id: 'ST-NEM', code: 'NEM', name: 'Nemom', km: 227.4, junction: false, sectionId: 'TVC-S5', nodeType: 'Intermediate Station' },
    { id: 'ST-NYY', code: 'NYY', name: 'Neyyattinkara', km: 239.5, junction: false, sectionId: 'TVC-S5', nodeType: 'Intermediate Station' },
    { id: 'ST-PASA', code: 'PASA', name: 'Parassala', km: 251.8, junction: false, sectionId: 'TVC-S5', nodeType: 'Intermediate Station' },
    { id: 'ST-KZTW', code: 'KZTW', name: 'Kuzhitturai', km: 260.1, junction: false, sectionId: 'TVC-S5', nodeType: 'Intermediate Station' },
    { id: 'ST-NCJ', code: 'NCJ', name: 'Nagercoil Jn', km: 291.0, junction: true, sectionId: 'TVC-S5', nodeType: 'Terminal Station' }
  ],
  'TVC-S6': [
    { id: 'ST-ERS2', code: 'ERS', name: 'Ernakulam Jn', km: 0.0, junction: true, sectionId: 'TVC-S6', nodeType: 'Junction Station' },
    { id: 'ST-KUMM', code: 'KUMM', name: 'Kumbalam', km: 7.8, junction: false, sectionId: 'TVC-S6', nodeType: 'Intermediate Station' },
    { id: 'ST-TUVR', code: 'TUVR', name: 'Turavur', km: 23.4, junction: false, sectionId: 'TVC-S6', nodeType: 'Intermediate Station' },
    { id: 'ST-SRTL', code: 'SRTL', name: 'Cherthala', km: 33.2, junction: false, sectionId: 'TVC-S6', nodeType: 'Intermediate Station' },
    { id: 'ST-ALLP', code: 'ALLP', name: 'Alappuzha', km: 57.0, junction: false, sectionId: 'TVC-S6', nodeType: 'Terminal Station' }
  ],
  'TVC-S7': [
    { id: 'ST-ALLP2', code: 'ALLP', name: 'Alappuzha', km: 57.0, junction: false, sectionId: 'TVC-S7', nodeType: 'Terminal Station' },
    { id: 'ST-AMPA', code: 'AMPA', name: 'Ambalapuzha', km: 69.4, junction: false, sectionId: 'TVC-S7', nodeType: 'Intermediate Station' },
    { id: 'ST-HAD', code: 'HAD', name: 'Harippad', km: 87.8, junction: false, sectionId: 'TVC-S7', nodeType: 'Intermediate Station' },
    { id: 'ST-KYJ3', code: 'KYJ', name: 'Kayamkulam Jn', km: 101.0, junction: true, sectionId: 'TVC-S7', nodeType: 'Junction Station' }
  ],

  // ── CHENNAI DIVISION (MAS) SECTIONS ───────────────────────────
  'MAS-S1': [
    { id: 'ST-MAS', code: 'MAS', name: 'Chennai Central', km: 0.0, junction: true, sectionId: 'MAS-S1', nodeType: 'Junction Station' },
    { id: 'ST-PER', code: 'PER', name: 'Perambur', km: 5.5, junction: false, sectionId: 'MAS-S1', nodeType: 'Intermediate Station' },
    { id: 'ST-VLK', code: 'VLK', name: 'Villivakkam', km: 9.3, junction: false, sectionId: 'MAS-S1', nodeType: 'Intermediate Station' },
    { id: 'ST-AVD', code: 'AVD', name: 'Avadi', km: 21.2, junction: false, sectionId: 'MAS-S1', nodeType: 'Intermediate Station' },
    { id: 'ST-TRL', code: 'TRL', name: 'Tiruvallur', km: 41.8, junction: false, sectionId: 'MAS-S1', nodeType: 'Intermediate Station' },
    { id: 'ST-AJJ', code: 'AJJ', name: 'Arakkonam Jn', km: 69.0, junction: true, sectionId: 'MAS-S1', nodeType: 'Terminal Station' }
  ],
  'MAS-S2': [
    { id: 'ST-AJJ2', code: 'AJJ', name: 'Arakkonam Jn', km: 69.0, junction: true, sectionId: 'MAS-S2', nodeType: 'Terminal Station' },
    { id: 'ST-SHU', code: 'SHU', name: 'Sholinghur', km: 90.2, junction: false, sectionId: 'MAS-S2', nodeType: 'Intermediate Station' },
    { id: 'ST-WJR', code: 'WJR', name: 'Walajah Road', km: 105.4, junction: false, sectionId: 'MAS-S2', nodeType: 'Intermediate Station' },
    { id: 'ST-MCN', code: 'MCN', name: 'Mukundarayapuram', km: 113.2, junction: false, sectionId: 'MAS-S2', nodeType: 'Intermediate Station' },
    { id: 'ST-KPD', code: 'KPD', name: 'Katpadi Jn', km: 130.0, junction: true, sectionId: 'MAS-S2', nodeType: 'Junction Station' }
  ],
  'MAS-S3': [
    { id: 'ST-KPD2', code: 'KPD', name: 'Katpadi Jn', km: 130.0, junction: true, sectionId: 'MAS-S3', nodeType: 'Junction Station' },
    { id: 'ST-GYM', code: 'GYM', name: 'Gudiyattam', km: 154.5, junction: false, sectionId: 'MAS-S3', nodeType: 'Intermediate Station' },
    { id: 'ST-AB', code: 'AB', name: 'Ambur', km: 182.2, junction: false, sectionId: 'MAS-S3', nodeType: 'Intermediate Station' },
    { id: 'ST-VN', code: 'VN', name: 'Vaniyambadi', km: 198.3, junction: false, sectionId: 'MAS-S3', nodeType: 'Intermediate Station' },
    { id: 'ST-JTJ', code: 'JTJ', name: 'Jolarpettai Jn', km: 214.0, junction: true, sectionId: 'MAS-S3', nodeType: 'Terminal Station' }
  ],
  'MAS-S4': [
    { id: 'ST-MAS2', code: 'MAS', name: 'Chennai Central', km: 0.0, junction: true, sectionId: 'MAS-S4', nodeType: 'Junction Station' },
    { id: 'ST-BBQ', code: 'BBQ', name: 'Basin Bridge Jn', km: 2.2, junction: true, sectionId: 'MAS-S4', nodeType: 'Intermediate Station' },
    { id: 'ST-TNP', code: 'TNP', name: 'Tondiarpet', km: 5.6, junction: false, sectionId: 'MAS-S4', nodeType: 'Intermediate Station' },
    { id: 'ST-PON', code: 'PON', name: 'Ponneri', km: 34.2, junction: false, sectionId: 'MAS-S4', nodeType: 'Intermediate Station' },
    { id: 'ST-GPD', code: 'GPD', name: 'Gummidipoondi', km: 47.0, junction: false, sectionId: 'MAS-S4', nodeType: 'Terminal Station' }
  ],
  'MAS-S5': [
    { id: 'ST-GPD2', code: 'GPD', name: 'Gummidipoondi', km: 47.0, junction: false, sectionId: 'MAS-S5', nodeType: 'Terminal Station' },
    { id: 'ST-TADA', code: 'TADA', name: 'Tada', km: 69.1, junction: false, sectionId: 'MAS-S5', nodeType: 'Intermediate Station' },
    { id: 'ST-SPE', code: 'SPE', name: 'Sullurupeta', km: 83.2, junction: false, sectionId: 'MAS-S5', nodeType: 'Intermediate Station' },
    { id: 'ST-NYP', code: 'NYP', name: 'Nayudupeta', km: 110.5, junction: false, sectionId: 'MAS-S5', nodeType: 'Intermediate Station' },
    { id: 'ST-GDR', code: 'GDR', name: 'Gudur Jn', km: 138.0, junction: true, sectionId: 'MAS-S5', nodeType: 'Junction Station' }
  ],
  'MAS-S6': [
    { id: 'ST-MSB', code: 'MSB', name: 'Chennai Beach', km: 0.0, junction: true, sectionId: 'MAS-S6', nodeType: 'Junction Station' },
    { id: 'ST-MS', code: 'MS', name: 'Chennai Egmore', km: 4.3, junction: true, sectionId: 'MAS-S6', nodeType: 'Intermediate Station' },
    { id: 'ST-MBM', code: 'MBM', name: 'Mambalam', km: 11.2, junction: false, sectionId: 'MAS-S6', nodeType: 'Intermediate Station' },
    { id: 'ST-GDY', code: 'GDY', name: 'Guindy', km: 14.1, junction: false, sectionId: 'MAS-S6', nodeType: 'Intermediate Station' },
    { id: 'ST-TBM', code: 'TBM', name: 'Tambaram', km: 29.0, junction: true, sectionId: 'MAS-S6', nodeType: 'Terminal Station' }
  ],
  'MAS-S7': [
    { id: 'ST-TBM2', code: 'TBM', name: 'Tambaram', km: 29.0, junction: true, sectionId: 'MAS-S7', nodeType: 'Terminal Station' },
    { id: 'ST-VDR', code: 'VDR', name: 'Vandalur', km: 35.1, junction: false, sectionId: 'MAS-S7', nodeType: 'Intermediate Station' },
    { id: 'ST-GI', code: 'GI', name: 'Guduvancheri', km: 40.5, junction: false, sectionId: 'MAS-S7', nodeType: 'Intermediate Station' },
    { id: 'ST-MMK', code: 'MMK', name: 'Maraimalai Nagar', km: 47.3, junction: false, sectionId: 'MAS-S7', nodeType: 'Intermediate Station' },
    { id: 'ST-CGL', code: 'CGL', name: 'Chengalpattu Jn', km: 60.0, junction: true, sectionId: 'MAS-S7', nodeType: 'Junction Station' }
  ],

  // ── MYSURU DIVISION (MYS) SECTIONS ────────────────────────────
  'MYS-S1': [
    { id: 'ST-MYS', code: 'MYS', name: 'Mysuru Jn', km: 0.0, junction: true, sectionId: 'MYS-S1', nodeType: 'Junction Station' },
    { id: 'ST-NHY', code: 'NHY', name: 'Naganahalli', km: 8.2, junction: false, sectionId: 'MYS-S1', nodeType: 'Intermediate Station' },
    { id: 'ST-PANP', code: 'PANP', name: 'Pandavapura', km: 19.1, junction: false, sectionId: 'MYS-S1', nodeType: 'Intermediate Station' },
    { id: 'ST-BDRL', code: 'BDRL', name: 'Byadarahalli', km: 28.5, junction: false, sectionId: 'MYS-S1', nodeType: 'Intermediate Station' },
    { id: 'ST-MYA', code: 'MYA', name: 'Mandya', km: 45.0, junction: false, sectionId: 'MYS-S1', nodeType: 'Terminal Station' }
  ],
  'MYS-S2': [
    { id: 'ST-MYA2', code: 'MYA', name: 'Mandya', km: 45.0, junction: false, sectionId: 'MYS-S2', nodeType: 'Terminal Station' },
    { id: 'ST-MAD', code: 'MAD', name: 'Maddur', km: 64.2, junction: false, sectionId: 'MYS-S2', nodeType: 'Intermediate Station' },
    { id: 'ST-CPT', code: 'CPT', name: 'Channapatna', km: 82.5, junction: false, sectionId: 'MYS-S2', nodeType: 'Intermediate Station' },
    { id: 'ST-RMGM', code: 'RMGM', name: 'Ramanagaram', km: 93.0, junction: false, sectionId: 'MYS-S2', nodeType: 'Junction Station' }
  ],
  'MYS-S3': [
    { id: 'ST-RMGM2', code: 'RMGM', name: 'Ramanagaram', km: 93.0, junction: false, sectionId: 'MYS-S3', nodeType: 'Junction Station' },
    { id: 'ST-BID', code: 'BID', name: 'Bidadi', km: 107.5, junction: false, sectionId: 'MYS-S3', nodeType: 'Intermediate Station' },
    { id: 'ST-HJL', code: 'HJL', name: 'Hejjala', km: 114.2, junction: false, sectionId: 'MYS-S3', nodeType: 'Intermediate Station' },
    { id: 'ST-KGI', code: 'KGI', name: 'Kengeri', km: 126.0, junction: false, sectionId: 'MYS-S3', nodeType: 'Intermediate Station' },
    { id: 'ST-SBC', code: 'SBC', name: 'KSR Bengaluru', km: 138.0, junction: true, sectionId: 'MYS-S3', nodeType: 'Terminal Station' }
  ],
  'MYS-S4': [
    { id: 'ST-MYS2', code: 'MYS', name: 'Mysuru Jn', km: 0.0, junction: true, sectionId: 'MYS-S4', nodeType: 'Junction Station' },
    { id: 'ST-KRNR', code: 'KRNR', name: 'Krishnarajanagara', km: 35.1, junction: false, sectionId: 'MYS-S4', nodeType: 'Intermediate Station' },
    { id: 'ST-HLN', code: 'HLN', name: 'Holenarasipura', km: 88.6, junction: false, sectionId: 'MYS-S4', nodeType: 'Intermediate Station' },
    { id: 'ST-HAS', code: 'HAS', name: 'Hassan Jn', km: 119.0, junction: true, sectionId: 'MYS-S4', nodeType: 'Terminal Station' }
  ],
  'MYS-S5': [
    { id: 'ST-HAS2', code: 'HAS', name: 'Hassan Jn', km: 119.0, junction: true, sectionId: 'MYS-S5', nodeType: 'Terminal Station' },
    { id: 'ST-BGPA', code: 'BGPA', name: 'Bageshapura', km: 139.2, junction: false, sectionId: 'MYS-S5', nodeType: 'Intermediate Station' },
    { id: 'ST-BVR', code: 'BVR', name: 'Banavara', km: 154.5, junction: false, sectionId: 'MYS-S5', nodeType: 'Intermediate Station' },
    { id: 'ST-ASK', code: 'ASK', name: 'Arsikere Jn', km: 166.0, junction: true, sectionId: 'MYS-S5', nodeType: 'Junction Station' }
  ],
  'MYS-S6': [
    { id: 'ST-ASK2', code: 'ASK', name: 'Arsikere Jn', km: 166.0, junction: true, sectionId: 'MYS-S6', nodeType: 'Junction Station' },
    { id: 'ST-DRU', code: 'DRU', name: 'Kadur Jn', km: 205.2, junction: false, sectionId: 'MYS-S6', nodeType: 'Intermediate Station' },
    { id: 'ST-RRB', code: 'RRB', name: 'Birur Jn', km: 211.0, junction: true, sectionId: 'MYS-S6', nodeType: 'Terminal Station' }
  ]
};

/**
 * ═══════════════════════════════════════════════════════════════
 * MAINTENANCE WORK ZONES FOR ALL DIVISIONS & SECTIONS
 * Highlighting specific localized track work zones between stations
 * ═══════════════════════════════════════════════════════════════
 */
export const MAINTENANCE_WORK_ZONES: MaintenanceWorkZone[] = [
  // ── PALAKKAD DIVISION (PGT) WORK ZONES ───────────────────────
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
      { trainNo: '12617', trainName: 'Mangala Lakshadweep Superfast Express', category: 'Superfast Express', scheduledPassage: '03:15 IST', impact: 'Overlaps uncoordinated slot by 15 min' },
      { trainNo: '16347', trainName: 'Mangalore Express', category: 'Mail/Express', scheduledPassage: '03:42 IST', impact: 'Headway buffer affected if block overruns' }
    ],
    conflictStatus: 'Operational Conflict',
    conflictDetail: 'Uncoordinated individual requests clash with 12617 Mangala Exp passage at 03:15 IST on UP mainline.',
    tasks: [
      { id: 'TASK-ENG-01', dept: 'Engineering', workType: 'Track maintenance & 09-3X Tamping', durationMin: 60, description: 'Deep tamping & track alignment correction between km 598/200 and 601/400.', priority: 'High', resources: 'Plasser 09-3X Tamper, 1 PWI, 16 Trackmen' },
      { id: 'TASK-TRD-01', dept: 'TRD', workType: 'OHE inspection & Cantilever audit', durationMin: 30, description: 'Inspection of 25kV catenary wire, dropper adjustment, and insulator washing.', priority: 'Medium', resources: '8-Wheeler Tower Wagon, 1 SSE/TRD, 5 Linemen' },
      { id: 'TASK-SNT-01', dept: 'S&T', workType: 'Signal & telecom maintenance', durationMin: 20, description: 'High-availability digital axle counter (HASSDAC) insulation test and point machine check.', priority: 'High', resources: 'Digital Megger kit, 1 SSE/Signal, 2 Technicians' }
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
        { id: 'ALT-1', window: '02:30 – 03:30', durationMin: 60, operationalImpact: 'Low', conflicts: 0, isRecommended: true, reason: 'Clear 60m path between Express 16343 and 12617; 0 passenger train detentions.' },
        { id: 'ALT-2', window: '03:15 – 04:15', durationMin: 60, operationalImpact: 'Medium', conflicts: 1, reason: 'Requires regulating container freight BOXN-4022 at Shoranur yard for 14 min.' },
        { id: 'ALT-3', window: '01:45 – 02:45', durationMin: 60, operationalImpact: 'Medium', conflicts: 1, reason: 'Compresses signaling headway behind Down Malabar Express.' }
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
      { trainNo: '16604', trainName: 'Maveli Express', category: 'Mail/Express', scheduledPassage: '04:55 IST', impact: 'Safe 10-minute clear buffer' }
    ],
    conflictStatus: 'Potential Conflict',
    conflictDetail: 'Work zone sits adjacent to UP track crossover switch 14B.',
    tasks: [
      { id: 'TASK-ENG-02', dept: 'Engineering', workType: 'Thermit Weld Renewal & Rail Grinding', durationMin: 45, description: 'USFD weld defect renewal at km 605/12-14 with fishplate temporary joint.', priority: 'Medium', resources: 'Thermit crew, 1 PWI, 8 Gangmen' },
      { id: 'TASK-SNT-02', dept: 'S&T', workType: 'AFTC Track Circuit Tuning', durationMin: 25, description: 'Tuning audio frequency track circuit receiver sensitivity post-grinding.', priority: 'Low', resources: 'AFTC analyzer, 1 Inspector' }
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
        { id: 'ALT-201', window: '04:00 – 04:45', durationMin: 45, operationalImpact: 'Low', conflicts: 0, isRecommended: true, reason: 'Optimal pre-dawn traffic lull; 0 delays recorded.' },
        { id: 'ALT-202', window: '05:00 – 05:45', durationMin: 45, operationalImpact: 'High', conflicts: 2, reason: 'Causes 20m detention to morning commuter MEMU.' }
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
      { id: 'TASK-ENG-03', dept: 'Engineering', workType: 'Ultrasonic Flaw Detection (USFD)', durationMin: 30, description: 'Trolley USFD testing of rails between km 612 and 613.5.', priority: 'Low', resources: 'Digital USFD trolley, 2 Operators' }
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
        { id: 'ALT-301', window: '05:00 – 05:30', durationMin: 30, operationalImpact: 'Low', conflicts: 0, isRecommended: true, reason: 'Natural gap in timetable; no train precedence change needed.' }
      ],
      approvalStatus: 'Pending Review'
    }
  },
  {
    id: 'WZ-PGT-OTP-01',
    sectionId: 'A-B',
    sectionName: 'Palakkad Jn – Ottappalam Section',
    startStationCode: 'PLL',
    startStationName: 'Parli',
    endStationCode: 'MNY',
    endStationName: 'Mankara',
    line: 'UP Line',
    chainage: 'km 531/000 – km 534/200',
    status: 'Operational Conflict',
    criticality: 'High',
    workSummary: 'Heavy Ballast Tamping & Catenary Overhaul',
    departments: ['Engineering', 'TRD'],
    estimatedDurationMin: 90,
    preferredWindow: '02:00 – 03:30',
    affectedTrains: [
      { trainNo: '12617', trainName: 'Mangala Lakshadweep Express', category: 'Superfast Express', scheduledPassage: '02:40 IST', impact: 'Path intersection at km 532' }
    ],
    conflictStatus: 'Operational Conflict',
    conflictDetail: 'Clashes with Express train 12617 UP movement at Mankara.',
    tasks: [
      { id: 'TASK-ENG-04', dept: 'Engineering', workType: 'Dynamic Track Stabilizer & Tamping', durationMin: 90, description: 'Tamping turnout 102A and UP mainline packing.', priority: 'High', resources: 'Duomatic 09-3X, 18 Staff' },
      { id: 'TASK-TRD-03', dept: 'TRD', workType: 'Section Isolator & Catenary Check', durationMin: 45, description: 'Insulator washing and dropper height gauge audit.', priority: 'Medium', resources: 'Tower wagon 8W' }
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
        { id: 'ALT-401', window: '02:00 – 03:30', durationMin: 90, operationalImpact: 'Medium', conflicts: 1, isRecommended: true, reason: 'Best fit with 14 min regulation on freight.' }
      ],
      approvalStatus: 'Pending Review'
    }
  },
  {
    id: 'WZ-OTP-SRR-01',
    sectionId: 'B-C',
    sectionName: 'Ottappalam – Shoranur Jn Section',
    startStationCode: 'MNUR',
    startStationName: 'Mannanur',
    endStationCode: 'SRR',
    endStationName: 'Shoranur Jn',
    line: 'DN Line',
    chainage: 'km 562/140 – km 564/200',
    status: 'Scheduled',
    criticality: 'Medium',
    workSummary: 'Track Weld Testing & Relay Overhaul',
    departments: ['Engineering', 'S&T'],
    estimatedDurationMin: 40,
    preferredWindow: '01:30 – 02:10',
    affectedTrains: [],
    conflictStatus: 'No Conflict',
    tasks: [
      { id: 'TASK-ENG-05', dept: 'Engineering', workType: 'USFD Testing & Fishplate Greasing', durationMin: 40, description: 'Routine USFD ultrasonic scan across Bharathapuzha bridge approaches.', priority: 'Medium', resources: 'USFD team, 6 Gangmen' },
      { id: 'TASK-SNT-05', dept: 'S&T', workType: 'Track Circuit Drop Test', durationMin: 20, description: 'Relay drop value testing in Mannanur relay room.', priority: 'Low', resources: 'S&T tech team' }
    ],
    optimization: {
      compatibleTasksCount: 2,
      combinedBlockDurationMin: 40,
      recommendedWindow: '01:30 – 02:10',
      operationalImpact: 'Low',
      conflictsAvoided: 0,
      timeSavedMin: 20,
      synergyScore: 92,
      explanation: 'Simultaneous S&T relay check during bridge approach track possession.',
      alternativeWindows: [{ id: 'ALT-501', window: '01:30 – 02:10', durationMin: 40, operationalImpact: 'Low', conflicts: 0, isRecommended: true, reason: 'Clean window without traffic.' }],
      approvalStatus: 'Pending Review'
    }
  },
  {
    id: 'WZ-TIR-CLT-01',
    sectionId: 'D-E',
    sectionName: 'Tirur – Kozhikode Section',
    startStationCode: 'TA',
    startStationName: 'Tanur',
    endStationCode: 'PGI',
    endStationName: 'Parappanangadi',
    line: 'UP Line',
    chainage: 'km 632/100 – km 635/000',
    status: 'Operational Conflict',
    criticality: 'High',
    workSummary: 'OHE Feeder Isolation & Curve Rail Dressing',
    departments: ['Engineering', 'TRD'],
    estimatedDurationMin: 60,
    preferredWindow: '03:30 – 04:30',
    affectedTrains: [
      { trainNo: '16347', trainName: 'Mangalore Express', category: 'Mail/Express', scheduledPassage: '04:10 IST', impact: 'Path regulated by 12m' }
    ],
    conflictStatus: 'Operational Conflict',
    conflictDetail: 'Requires regulating Down Mangalore express by 12 mins at Parappanangadi.',
    tasks: [
      { id: 'TASK-ENG-06', dept: 'Engineering', workType: 'Curve Rail Transposition', durationMin: 60, description: 'Transposing high-rail on 4-degree coastal curve.', priority: 'High', resources: 'Curve dressing squad, 14 Gangmen' },
      { id: 'TASK-TRD-06', dept: 'TRD', workType: 'OHE Jumper Wire Inspection', durationMin: 30, description: 'Inspection of coastal saline corrosion on OHE return conductors.', priority: 'Medium', resources: 'TRD tower wagon' }
    ],
    optimization: {
      compatibleTasksCount: 2,
      combinedBlockDurationMin: 60,
      recommendedWindow: '03:30 – 04:30',
      operationalImpact: 'Low',
      conflictsAvoided: 1,
      timeSavedMin: 30,
      synergyScore: 94,
      explanation: 'Coordinated curve rail transposition and TRD insulator cleaning in single 60m block.',
      alternativeWindows: [{ id: 'ALT-601', window: '03:30 – 04:30', durationMin: 60, operationalImpact: 'Low', conflicts: 1, isRecommended: true, reason: 'Lowest overall passenger impact.' }],
      approvalStatus: 'Pending Review'
    }
  },

  // ── THIRUVANANTHAPURAM DIVISION (TVC) WORK ZONES ─────────────
  {
    id: 'WZ-TVC-01',
    sectionId: 'TVC-S1',
    sectionName: 'Ernakulam Jn – Kottayam Section',
    startStationCode: 'PVRD',
    startStationName: 'Piravom Road',
    endStationCode: 'VARD',
    endStationName: 'Vaikom Road',
    line: 'UP Line',
    chainage: 'km 29/400 – km 32/800',
    status: 'Active',
    criticality: 'High',
    workSummary: 'Track Ballast Packing & 25kV Catenary Alignment',
    departments: ['Engineering', 'TRD'],
    estimatedDurationMin: 75,
    preferredWindow: '01:30 – 02:45',
    affectedTrains: [
      { trainNo: '16343', trainName: 'Amritha Express', category: 'Express', scheduledPassage: '02:15 IST', impact: 'Platform regulation at Piravom Road' }
    ],
    conflictStatus: 'Operational Conflict',
    conflictDetail: 'Crosses passage window of 16343 Amritha Express at Piravom Road.',
    tasks: [
      { id: 'TASK-TVC-ENG-01', dept: 'Engineering', workType: 'Ballast Shoulder Cleaning & Packing', durationMin: 75, description: 'BCM shoulder screening machine deployment between km 29.4 and 32.8.', priority: 'High', resources: 'BCM Machine, 20 Trackmen' },
      { id: 'TASK-TVC-TRD-01', dept: 'TRD', workType: 'OHE Neutral Section Inspection', durationMin: 40, description: 'Piravom Road neutral section contact wire replacement.', priority: 'High', resources: 'Tower Wagon TVC-2' }
    ],
    optimization: {
      compatibleTasksCount: 2,
      combinedBlockDurationMin: 75,
      recommendedWindow: '01:30 – 02:45',
      operationalImpact: 'Low',
      conflictsAvoided: 2,
      timeSavedMin: 40,
      synergyScore: 95,
      explanation: 'SolveX bundled TRD power isolation with Civil Engineering ballast screening during 01:30–02:45 traffic lull, saving 40 min track downtime.',
      alternativeWindows: [
        { id: 'ALT-TVC-1', window: '01:30 – 02:45', durationMin: 75, operationalImpact: 'Low', conflicts: 0, isRecommended: true, reason: 'Optimal midnight freight interval.' }
      ],
      approvalStatus: 'Pending Review'
    }
  },
  {
    id: 'WZ-TVC-02',
    sectionId: 'TVC-S4',
    sectionName: 'Kollam Jn – Thiruvananthapuram Section',
    startStationCode: 'VAK',
    startStationName: 'Varkala Sivagiri',
    endStationCode: 'KVU',
    endStationName: 'Kadakkavur',
    line: 'UP Line',
    chainage: 'km 181/200 – km 184/500',
    status: 'Operational Conflict',
    criticality: 'High',
    workSummary: 'Tunnel & Cliff Catenary Overhaul & Point Machine Inspection',
    departments: ['TRD', 'S&T'],
    estimatedDurationMin: 60,
    preferredWindow: '02:15 – 03:15',
    affectedTrains: [
      { trainNo: '16127', trainName: 'Guruvayur Express', category: 'Express', scheduledPassage: '02:50 IST', impact: 'Controlled at Varkala' }
    ],
    conflictStatus: 'Operational Conflict',
    conflictDetail: 'Overlap with 16127 Guruvayur Express UP run.',
    tasks: [
      { id: 'TASK-TVC-TRD-02', dept: 'TRD', workType: 'Tunnel OHE Insulator Washing', durationMin: 60, description: 'High-pressure insulator jet washing in Varkala cliff cutting.', priority: 'High', resources: 'Tower Wagon with Jet System' },
      { id: 'TASK-TVC-SNT-02', dept: 'S&T', workType: 'Axle Counter Tuning & Point Testing', durationMin: 35, description: 'Testing dual detection axle counters at Kadakkavur entry.', priority: 'Medium', resources: 'S&T inspection squad' }
    ],
    optimization: {
      compatibleTasksCount: 2,
      combinedBlockDurationMin: 60,
      recommendedWindow: '02:15 – 03:15',
      operationalImpact: 'Low',
      conflictsAvoided: 1,
      timeSavedMin: 35,
      synergyScore: 93,
      explanation: 'Coordinated tunnel OHE power cut with S&T axle counter overhaul; zero delay to morning passenger services.',
      alternativeWindows: [
        { id: 'ALT-TVC-201', window: '02:15 – 03:15', durationMin: 60, operationalImpact: 'Low', conflicts: 0, isRecommended: true, reason: 'Zero passenger impact.' }
      ],
      approvalStatus: 'Pending Review'
    }
  },

  // ── CHENNAI DIVISION (MAS) WORK ZONES ─────────────────────────
  {
    id: 'WZ-MAS-01',
    sectionId: 'MAS-S1',
    sectionName: 'Chennai Central – Arakkonam Jn Section',
    startStationCode: 'AVD',
    startStationName: 'Avadi',
    endStationCode: 'TRL',
    endStationName: 'Tiruvallur',
    line: 'UP Line',
    chainage: 'km 28/400 – km 33/100',
    status: 'Operational Conflict',
    criticality: 'High',
    workSummary: 'Quad-Track High Speed Tamping & OHE Cantilever Renewal',
    departments: ['Engineering', 'TRD', 'S&T'],
    estimatedDurationMin: 70,
    preferredWindow: '01:15 – 02:25',
    affectedTrains: [
      { trainNo: '12602', trainName: 'Mangalore – Chennai Mail', category: 'Superfast Express', scheduledPassage: '02:05 IST', impact: 'Diverted via Fast UP line' }
    ],
    conflictStatus: 'Operational Conflict',
    conflictDetail: 'Possession on Slow UP line clashes with late night suburban EMU rake repositioning.',
    tasks: [
      { id: 'TASK-MAS-ENG-01', dept: 'Engineering', workType: '09-3X High Speed Tamping', durationMin: 70, description: 'Turnout tamping and 130 km/h corridor lining from Avadi to Tiruvallur.', priority: 'High', resources: '09-3X Dynamic Tamper, 22 Trackmen' },
      { id: 'TASK-MAS-TRD-01', dept: 'TRD', workType: 'OHE Cantilever & Contact Wire Check', durationMin: 45, description: 'Thermal scan and cantilever adjustment for 130 km/h running.', priority: 'High', resources: '8W Tower Wagon' },
      { id: 'TASK-MAS-SNT-01', dept: 'S&T', workType: 'Electronic Interlocking (EI) Diagnostic', durationMin: 30, description: 'Avadi west cabin electronic interlocking standby card diagnostics.', priority: 'Medium', resources: 'Signal Inspector team' }
    ],
    optimization: {
      compatibleTasksCount: 3,
      combinedBlockDurationMin: 70,
      recommendedWindow: '01:15 – 02:25',
      operationalImpact: 'Low',
      conflictsAvoided: 2,
      timeSavedMin: 75,
      synergyScore: 97,
      explanation: 'SolveX synchronized Civil Tamping, TRD inspection, and Signal diagnostic into ONE 70-minute shadow block on Slow UP, diverting mail train via Fast Line with 0 min delay.',
      alternativeWindows: [
        { id: 'ALT-MAS-1', window: '01:15 – 02:25', durationMin: 70, operationalImpact: 'Low', conflicts: 0, isRecommended: true, reason: 'Seamless diversion over Fast line; 0 passenger delay.' }
      ],
      approvalStatus: 'Pending Review'
    }
  },
  {
    id: 'WZ-MAS-02',
    sectionId: 'MAS-S5',
    sectionName: 'Gummidipoondi – Gudur Jn Section',
    startStationCode: 'SPE',
    startStationName: 'Sullurupeta',
    endStationCode: 'NYP',
    endStationName: 'Nayudupeta',
    line: 'DN Line',
    chainage: 'km 94/000 – km 98/200',
    status: 'Scheduled',
    criticality: 'Medium',
    workSummary: 'Corridor Rail Renewal & Glued Joint Replacement',
    departments: ['Engineering', 'S&T'],
    estimatedDurationMin: 50,
    preferredWindow: '02:30 – 03:20',
    affectedTrains: [],
    conflictStatus: 'No Conflict',
    tasks: [
      { id: 'TASK-MAS-ENG-02', dept: 'Engineering', workType: 'Glued Joint Replacement & Weld Finishing', durationMin: 50, description: 'G3L glued insulated rail joint installation for track circuit renewal.', priority: 'Medium', resources: 'P-Way team' },
      { id: 'TASK-MAS-SNT-02', dept: 'S&T', workType: 'Track Feed Voltage Calibration', durationMin: 25, description: 'Calibration of battery chargers and relay voltages.', priority: 'Low', resources: 'S&T field crew' }
    ],
    optimization: {
      compatibleTasksCount: 2,
      combinedBlockDurationMin: 50,
      recommendedWindow: '02:30 – 03:20',
      operationalImpact: 'Low',
      conflictsAvoided: 0,
      timeSavedMin: 25,
      synergyScore: 90,
      explanation: 'Glued joint mechanical renewal synchronized with S&T track circuit voltage testing.',
      alternativeWindows: [
        { id: 'ALT-MAS-201', window: '02:30 – 03:20', durationMin: 50, operationalImpact: 'Low', conflicts: 0, isRecommended: true, reason: 'Clean freight window.' }
      ],
      approvalStatus: 'Pending Review'
    }
  },

  // ── MYSURU DIVISION (MYS) WORK ZONES ──────────────────────────
  {
    id: 'WZ-MYS-01',
    sectionId: 'MYS-S1',
    sectionName: 'Mysuru Jn – Mandya Section',
    startStationCode: 'PANP',
    startStationName: 'Pandavapura',
    endStationCode: 'BDRL',
    endStationName: 'Byadarahalli',
    line: 'UP Line',
    chainage: 'km 22/100 – km 25/800',
    status: 'Active',
    criticality: 'High',
    workSummary: 'Vande Bharat Speed Upgrade Tamping & Catenary Tensioning',
    departments: ['Engineering', 'TRD'],
    estimatedDurationMin: 60,
    preferredWindow: '01:00 – 02:00',
    affectedTrains: [],
    conflictStatus: 'No Conflict',
    tasks: [
      { id: 'TASK-MYS-ENG-01', dept: 'Engineering', workType: 'CSM Track Tamping for 110kph Upgradation', durationMin: 60, description: 'Continuous tamping across Cauvery bridge approach lines.', priority: 'High', resources: 'CSM Machine, 16 Gangmen' },
      { id: 'TASK-MYS-TRD-01', dept: 'TRD', workType: 'Auto-Tensioning Device (ATD) Inspection', durationMin: 35, description: 'ATD balance weight measurement and pulley greasing.', priority: 'Medium', resources: 'TRD squad' }
    ],
    optimization: {
      compatibleTasksCount: 2,
      combinedBlockDurationMin: 60,
      recommendedWindow: '01:00 – 02:00',
      operationalImpact: 'Low',
      conflictsAvoided: 1,
      timeSavedMin: 35,
      synergyScore: 95,
      explanation: 'Combined civil track packing and electrical ATD overhaul in a single 60m block prior to first departure (Mysuru–Bengaluru Express).',
      alternativeWindows: [
        { id: 'ALT-MYS-101', window: '01:00 – 02:00', durationMin: 60, operationalImpact: 'Low', conflicts: 0, isRecommended: true, reason: 'Completely unhindered pre-dawn corridor.' }
      ],
      approvalStatus: 'Pending Review'
    }
  },
  {
    id: 'WZ-MYS-02',
    sectionId: 'MYS-S3',
    sectionName: 'Ramanagaram – KSR Bengaluru Section',
    startStationCode: 'BID',
    startStationName: 'Bidadi',
    endStationCode: 'KGI',
    endStationName: 'Kengeri',
    line: 'UP Line',
    chainage: 'km 112/000 – km 116/500',
    status: 'Operational Conflict',
    criticality: 'High',
    workSummary: 'Automatic Block Signalling (ABS) & Rail Weld Testing',
    departments: ['Engineering', 'S&T'],
    estimatedDurationMin: 60,
    preferredWindow: '02:00 – 03:00',
    affectedTrains: [
      { trainNo: '16231', trainName: 'Mayiladuturai – Mysuru Express', category: 'Express', scheduledPassage: '02:35 IST', impact: 'Crosses block boundary' }
    ],
    conflictStatus: 'Operational Conflict',
    conflictDetail: 'Overlaps Mayiladuturai–Mysuru Express passage on UP line at Bidadi.',
    tasks: [
      { id: 'TASK-MYS-ENG-02', dept: 'Engineering', workType: 'Thermit Weld Dressing & Tamping', durationMin: 60, description: 'Dressing 4 thermit welds and turnout packing at Bidadi.', priority: 'High', resources: 'Welding squad, 12 Staff' },
      { id: 'TASK-MYS-SNT-02', dept: 'S&T', workType: 'Automatic Signal Post 4-Aspect Overhaul', durationMin: 40, description: 'Lamp unit replacement and LED aspect testing on ABS signals.', priority: 'Medium', resources: 'Signal Inspector' }
    ],
    optimization: {
      compatibleTasksCount: 2,
      combinedBlockDurationMin: 60,
      recommendedWindow: '02:00 – 03:00',
      operationalImpact: 'Low',
      conflictsAvoided: 1,
      timeSavedMin: 40,
      synergyScore: 92,
      explanation: 'SolveX adjusted start by 15 minutes to allow Express 16231 to pass, bundling ABS overhaul with weld renewal in 60 minutes with 0 passenger delay.',
      alternativeWindows: [
        { id: 'ALT-MYS-201', window: '02:40 – 03:40', durationMin: 60, operationalImpact: 'Low', conflicts: 0, isRecommended: true, reason: 'Post-passage of Express 16231.' }
      ],
      approvalStatus: 'Pending Review'
    }
  }
];

/**
 * Helper to fetch division network by ID (PGT, TVC, MAS, MYS)
 */
export const getDivisionNetwork = (divisionId: string): DivisionMacroNetwork => {
  return DIVISION_NETWORKS[divisionId] || DIVISION_NETWORKS['PGT'];
};

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
    if (div.name.toLowerCase().includes(q) || div.code.toLowerCase().includes(q) || div.hq.toLowerCase().includes(q)) {
      results.push({
        id: `DIV-${div.id}`,
        type: 'Division',
        title: div.name,
        subtitle: `${div.zone} · ${div.routeKm} Route km · HQ: ${div.hq}`,
        divisionId: div.id,
        actionHint: 'Switch to Division'
      });
    }
  });

  // 2. Search Sections across ALL divisions
  Object.entries(DIVISION_NETWORKS).forEach(([divId, net]) => {
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
          subtitle: `${getDivisionById(divId).name} · Section ${sec.id} · ${sec.lengthKm} km · ${sec.status}`,
          divisionId: divId,
          sectionId: sec.id,
          actionHint: 'Drill down into Section'
        });
      }
    });
  });

  // 3. Search Stations (both major stations and intermediate station nodes)
  Object.entries(SECTION_STATION_NODES).forEach(([secId, nodes]) => {
    // find which division this section belongs to
    let divId = 'PGT';
    for (const [d, net] of Object.entries(DIVISION_NETWORKS)) {
      if (net.sections.some(s => s.id === secId)) {
        divId = d;
        break;
      }
    }

    nodes.forEach(node => {
      if (
        node.name.toLowerCase().includes(q) ||
        node.code.toLowerCase().includes(q)
      ) {
        if (!results.some(r => r.title.includes(node.name) && r.type === 'Station')) {
          results.push({
            id: `ST-${node.code}-${secId}`,
            type: 'Station',
            title: `${node.name} (${node.code})`,
            subtitle: `${node.nodeType} · km ${node.km} · ${getDivisionById(divId).name} (Section ${node.sectionId})`,
            divisionId: divId,
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
      let divId = 'PGT';
      for (const [d, net] of Object.entries(DIVISION_NETWORKS)) {
        if (net.sections.some(s => s.id === wz.sectionId)) {
          divId = d;
          break;
        }
      }

      results.push({
        id: wz.id,
        type: 'Work Zone',
        title: `Work Zone: ${wz.startStationName}–${wz.endStationName} (${wz.line})`,
        subtitle: `${wz.workSummary} · ${wz.chainage} · ${wz.departments.join(' + ')}`,
        divisionId: divId,
        sectionId: wz.sectionId,
        workZoneId: wz.id,
        actionHint: 'Inspect SolveX Block Optimization'
      });
    }
  });

  // 5. Search Trains
  const simulatedTrains = [
    { no: '12617', name: 'Mangala Lakshadweep Superfast Express', section: 'C-D', divId: 'PGT', wzId: 'WZ-SRR-TIR-01' },
    { no: '16347', name: 'Mangalore Express', section: 'C-D', divId: 'PGT', wzId: 'WZ-SRR-TIR-01' },
    { no: '16604', name: 'Maveli Express', section: 'C-D', divId: 'PGT', wzId: 'WZ-SRR-TIR-02' },
    { no: '16343', name: 'Amritha Express', section: 'TVC-S1', divId: 'TVC', wzId: 'WZ-TVC-01' },
    { no: '16127', name: 'Guruvayur Express', section: 'TVC-S4', divId: 'TVC', wzId: 'WZ-TVC-02' },
    { no: '12602', name: 'Chennai Mail', section: 'MAS-S1', divId: 'MAS', wzId: 'WZ-MAS-01' },
    { no: '20631', name: 'Vande Bharat Express', section: 'A-B', divId: 'PGT' },
    { no: '16231', name: 'Mayiladuturai – Mysuru Express', section: 'MYS-S3', divId: 'MYS', wzId: 'WZ-MYS-02' },
    { no: '4022', name: 'BOXN-4022 Container Freight', section: 'C-F', divId: 'PGT' }
  ];

  simulatedTrains.forEach(t => {
    if (t.no.includes(q) || t.name.toLowerCase().includes(q)) {
      results.push({
        id: `TRAIN-${t.no}`,
        type: 'Train',
        title: `${t.no} ${t.name}`,
        subtitle: `Path through ${getDivisionById(t.divId).name} (Section ${t.section})`,
        divisionId: t.divId,
        sectionId: t.section,
        workZoneId: t.wzId,
        actionHint: 'View Track Section'
      });
    }
  });

  return results.slice(0, 10);
};
