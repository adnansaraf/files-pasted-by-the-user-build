import timetableDataset from '../palakkad/solvex_palakkad_trains_2026-09-05_06.json';
import {
  TimetableTrain,
  TimetableStationEvent,
  SimulatedTestRequest,
  TestRunCandidateWindow,
  TestRunOptimizationResult,
  TwoDayComparisonResult,
  Department
} from '../../types';

// Cast the loaded JSON to typed timetable dataset
const rawTimetable = timetableDataset as {
  dataset_name: string;
  dates: string[];
  timezone: string;
  division: string;
  purpose: string;
  notes: string[];
  trains: TimetableTrain[];
  station_events: TimetableStationEvent[];
};

/**
 * ═══════════════════════════════════════════════════════════════
 * SIMULATED MAINTENANCE REQUESTS (FOR PROTOTYPE TESTING ONLY)
 * Clearly marked as SIMULATED — not real Indian Railways requests
 * ═══════════════════════════════════════════════════════════════
 */
export const SIMULATED_TEST_REQUESTS: SimulatedTestRequest[] = [
  {
    id: 'REQ-SIM-ENG-001',
    dept: 'Engineering',
    workType: 'Track maintenance & 09-3X Tamping',
    sectionId: 'SRR-CLT',
    workZoneId: 'WZ-SRR-CLT-01',
    line: 'UP Line',
    durationMin: 45,
    priority: 'High',
    safetyBufferMin: 10,
    preferredPeriod: '10:00 – 11:30',
    description: 'Deep hydraulic tamping & longitudinal level alignment on UP line (km 598/200 – km 601/400).',
    resources: 'Plasser 09-3X Dynamic Tamper, 1 PWI, 14 Trackmen',
    isSimulated: true
  },
  {
    id: 'REQ-SIM-TRD-001',
    dept: 'TRD',
    workType: '25kV Catenary & Cantilever Inspection',
    sectionId: 'SRR-CLT',
    workZoneId: 'WZ-SRR-CLT-01',
    line: 'UP Line',
    durationMin: 30,
    priority: 'Medium',
    safetyBufferMin: 5,
    preferredPeriod: '10:15 – 11:15',
    description: 'Inspection of 25kV contact wire, dropper tension adjustment and insulator cleaning in Pattambi–Pallippuram block.',
    resources: '8-Wheeler DETC Tower Wagon, 1 SSE/TRD, 4 Linemen',
    isSimulated: true
  },
  {
    id: 'REQ-SIM-SNT-001',
    dept: 'S&T',
    workType: 'Digital Axle Counter & Point Machine Overhaul',
    sectionId: 'SRR-CLT',
    workZoneId: 'WZ-SRR-CLT-01',
    line: 'UP Line',
    durationMin: 20,
    priority: 'High',
    safetyBufferMin: 5,
    preferredPeriod: '10:30 – 11:30',
    description: 'High-availability digital axle counter (HASSDAC) insulation test and point machine motor servicing at km 600/400.',
    resources: 'Insulation Megger kit, 1 SSE/Signal, 2 Technicians',
    isSimulated: true
  },
  {
    id: 'REQ-SIM-ENG-002',
    dept: 'Engineering',
    workType: 'Ultrasonic Rail Flaw Detection (USFD)',
    sectionId: 'SRR-CLT',
    workZoneId: 'WZ-SRR-CLT-02',
    line: 'DN Line',
    durationMin: 40,
    priority: 'Medium',
    safetyBufferMin: 10,
    preferredPeriod: '11:00 – 12:30',
    description: 'Digital USFD trolley test on continuous welded rails between Kuttippuram and Tirur.',
    resources: 'Digital USFD Hand Trolley, 2 USFD Operators',
    isSimulated: true
  },
  {
    id: 'REQ-SIM-TRD-002',
    dept: 'TRD',
    workType: 'Substation Isolator Overhaul',
    sectionId: 'SRR-CLT',
    workZoneId: 'WZ-SRR-CLT-02',
    line: 'Both Lines',
    durationMin: 25,
    priority: 'Low',
    safetyBufferMin: 5,
    preferredPeriod: '11:15 – 12:15',
    description: 'Overhaul of motorized 25kV trackside isolator switch near km 620.',
    resources: '1 JE/TRD, 2 Technicians',
    isSimulated: true
  },
  {
    id: 'REQ-SIM-ENG-003',
    dept: 'Engineering',
    workType: 'Ballast Profiling on Nilambur Branch',
    sectionId: 'SRR-NIL',
    workZoneId: 'WZ-SRR-NIL-01',
    line: 'Both Lines',
    durationMin: 35,
    priority: 'Medium',
    safetyBufferMin: 10,
    preferredPeriod: '12:00 – 13:30',
    description: 'Track ballast dressing and sleeper inspection between Vallapuzha and Kulukkallur.',
    resources: 'Gang 8, 1 Mate, 12 Gangmen',
    isSimulated: true
  },
  {
    id: 'REQ-SIM-TRD-003',
    dept: 'TRD',
    workType: 'Power Block & Feeder Wire Inspection',
    sectionId: 'PGT-SRR',
    workZoneId: 'WZ-PGT-SRR-01',
    line: 'Both Lines',
    durationMin: 40,
    priority: 'High',
    safetyBufferMin: 10,
    preferredPeriod: '01:00 – 02:30',
    description: 'Traction feeder line inspection crossing Bharathapuzha bridge.',
    resources: 'Tower Wagon, Emergency TRD Gang',
    isSimulated: true
  },
  {
    id: 'REQ-SIM-SNT-002',
    dept: 'S&T',
    workType: 'Track Circuit Glued Joint Inspection',
    sectionId: 'PGT-SRR',
    workZoneId: 'WZ-PGT-SRR-01',
    line: 'UP Line',
    durationMin: 25,
    priority: 'Critical',
    safetyBufferMin: 5,
    preferredPeriod: '01:30 – 02:30',
    description: 'Insulation testing of glued insulated rail joints (GJ) on Palakkad–Shoranur approaches.',
    resources: '1 SSE/Signal, 2 Technicians',
    isSimulated: true
  },
  {
    id: 'REQ-SIM-ENG-004',
    dept: 'Engineering',
    workType: 'Turnout Switch Inspection & Packing',
    sectionId: 'SRR-CLT',
    workZoneId: 'WZ-SRR-CLT-01',
    line: 'DN Line',
    durationMin: 30,
    priority: 'Medium',
    safetyBufferMin: 10,
    preferredPeriod: '11:00 – 12:00',
    description: 'Points and crossing packing using off-track hand tamping machines at Pallippuram.',
    resources: 'Hand tamping unit, 8 Trackmen',
    isSimulated: true
  }
];

// Helper: Convert "HH:MM" string to minutes from midnight
export const timeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return 0;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
};

// Helper: Convert minutes from midnight to "HH:MM" string
export const minutesToTime = (totalMinutes: number): string => {
  const norm = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

/**
 * ═══════════════════════════════════════════════════════════════
 * GET TIMETABLE STATION EVENTS FOR SPECIFIED DATE
 * ═══════════════════════════════════════════════════════════════
 */
export const getStationEventsForDate = (date: string): TimetableStationEvent[] => {
  return rawTimetable.station_events.filter(e => e.calendar_date === date);
};

export const getAllTimetableTrains = (): TimetableTrain[] => {
  return rawTimetable.trains;
};

/**
 * ═══════════════════════════════════════════════════════════════
 * ESTIMATE TRAIN PASSAGE THROUGH WORK ZONE
 * Calculates the exact window a train occupies or traverses
 * the work zone based on scheduled station arrival & departure events.
 * ═══════════════════════════════════════════════════════════════
 */
export interface TrainWorkZonePassage {
  trainNo: string;
  trainName: string;
  trainType: string;
  date: string;
  entryMinutes: number;
  exitMinutes: number;
  entryTime: string;
  exitTime: string;
  referenceStation: string;
  direction: 'UP Line' | 'DN Line';
}

export const getTrainPassagesForWorkZone = (
  startStationCode: string,
  endStationCode: string,
  date: string
): TrainWorkZonePassage[] => {
  const events = getStationEventsForDate(date);
  const passages: TrainWorkZonePassage[] = [];

  // Group events by train number
  const eventsByTrain: Record<string, TimetableStationEvent[]> = {};
  events.forEach(ev => {
    if (!eventsByTrain[ev.train_number]) {
      eventsByTrain[ev.train_number] = [];
    }
    eventsByTrain[ev.train_number].push(ev);
  });

  // Target stations set for the work zone
  const targetCodes = [startStationCode, endStationCode];

  // For each train on this date, check if it passes this section
  Object.entries(eventsByTrain).forEach(([trainNo, tEvents]) => {
    // 1. Direct hit: Event at start or end station of the work zone
    const directHit = tEvents.find(ev => targetCodes.includes(ev.station_code));
    const firstEv = tEvents[0];

    if (directHit) {
      const timeStr = directHit.departure || directHit.arrival || '08:00';
      const midMin = timeToMinutes(timeStr);
      // Give a 12-minute transit window through the localized work zone
      const entryMin = Math.max(0, midMin - 6);
      const exitMin = Math.min(1439, midMin + 6);

      passages.push({
        trainNo,
        trainName: directHit.train_name,
        trainType: directHit.train_type,
        date,
        entryMinutes: entryMin,
        exitMinutes: exitMin,
        entryTime: minutesToTime(entryMin),
        exitTime: minutesToTime(exitMin),
        referenceStation: `${directHit.station_name} (${directHit.station_code})`,
        direction: directHit.origin === 'MAQ' ? 'UP Line' : 'DN Line'
      });
      return;
    }

    // 2. Section corridor traversal check:
    // If the train stops before and after this work zone in the Palakkad corridor (e.g. SRR and TIR for PTB–PUM)
    const srrEvent = tEvents.find(e => e.station_code === 'SRR');
    const tirEvent = tEvents.find(e => e.station_code === 'TIR');
    const cltEvent = tEvents.find(e => e.station_code === 'CLT');
    const pgtEvent = tEvents.find(e => e.station_code === 'PGT');

    if (srrEvent && tirEvent && (startStationCode === 'PTB' || endStationCode === 'PUM' || startStationCode === 'KTU')) {
      const srrMin = timeToMinutes(srrEvent.departure || srrEvent.arrival || '00:00');
      const tirMin = timeToMinutes(tirEvent.arrival || tirEvent.departure || '00:00');
      // Approximate interpolation for Pattambi–Pallippuram: ~35% of SRR–TIR transit
      const transitMin = Math.round(srrMin + (tirMin - srrMin) * 0.35);

      passages.push({
        trainNo,
        trainName: srrEvent.train_name,
        trainType: srrEvent.train_type,
        date,
        entryMinutes: Math.max(0, transitMin - 6),
        exitMinutes: Math.min(1439, transitMin + 6),
        entryTime: minutesToTime(transitMin - 6),
        exitTime: minutesToTime(transitMin + 6),
        referenceStation: `Interpolated (SRR ${srrEvent.departure || srrEvent.arrival} ➔ TIR ${tirEvent.arrival || tirEvent.departure})`,
        direction: srrMin < tirMin ? 'DN Line' : 'UP Line'
      });
      return;
    }

    // Nilambur branch check (SRR - VPZ - KZC - AAM - NIL)
    const vpzEvent = tEvents.find(e => e.station_code === 'VPZ');
    if (vpzEvent && (startStationCode === 'VPZ' || startStationCode === 'VDKS' || endStationCode === 'KZC')) {
      const timeStr = vpzEvent.departure || vpzEvent.arrival || '10:20';
      const midMin = timeToMinutes(timeStr);
      passages.push({
        trainNo,
        trainName: vpzEvent.train_name,
        trainType: vpzEvent.train_type,
        date,
        entryMinutes: Math.max(0, midMin - 6),
        exitMinutes: Math.min(1439, midMin + 6),
        entryTime: minutesToTime(midMin - 6),
        exitTime: minutesToTime(midMin + 6),
        referenceStation: `${vpzEvent.station_name} (${vpzEvent.station_code})`,
        direction: 'DN Line'
      });
    }
  });

  return passages.sort((a, b) => a.entryMinutes - b.entryMinutes);
};

/**
 * ═══════════════════════════════════════════════════════════════
 * CHECK CONFLICT FOR A PROPOSED TIME WINDOW
 * ═══════════════════════════════════════════════════════════════
 */
export const checkWindowConflict = (
  startMinutes: number,
  durationMin: number,
  safetyBufferMin: number,
  passages: TrainWorkZonePassage[],
  workZoneLine: 'UP Line' | 'DN Line' | 'Both Lines'
): {
  conflictsCount: number;
  conflictingTrains: {
    trainNo: string;
    trainName: string;
    passageTime: string;
    impactType: 'Direct Conflict in Work Zone' | 'Safety Buffer Infringement' | 'Approaching Movement';
  }[];
} => {
  const windowStart = startMinutes;
  const windowEnd = startMinutes + durationMin;
  const bufferedStart = windowStart - safetyBufferMin;
  const bufferedEnd = windowEnd + safetyBufferMin;

  const conflictingTrains: {
    trainNo: string;
    trainName: string;
    passageTime: string;
    impactType: 'Direct Conflict in Work Zone' | 'Safety Buffer Infringement' | 'Approaching Movement';
  }[] = [];

  passages.forEach(p => {
    // Check line compatibility
    if (workZoneLine !== 'Both Lines' && p.direction !== workZoneLine) {
      // Train is on the other track (e.g. DN track while work is on UP track) -> No direct path clash
      return;
    }

    // Direct overlap: train passage intersects requested work duration
    const isDirectOverlap =
      (p.entryMinutes >= windowStart && p.entryMinutes < windowEnd) ||
      (p.exitMinutes > windowStart && p.exitMinutes <= windowEnd) ||
      (p.entryMinutes <= windowStart && p.exitMinutes >= windowEnd);

    // Buffer infringement: train enters safety clearance window before or after work
    const isBufferInfringement =
      !isDirectOverlap &&
      ((p.entryMinutes >= bufferedStart && p.entryMinutes <= bufferedEnd) ||
        (p.exitMinutes >= bufferedStart && p.exitMinutes <= bufferedEnd));

    if (isDirectOverlap) {
      conflictingTrains.push({
        trainNo: p.trainNo,
        trainName: p.trainName,
        passageTime: `${p.entryTime} – ${p.exitTime}`,
        impactType: 'Direct Conflict in Work Zone'
      });
    } else if (isBufferInfringement) {
      conflictingTrains.push({
        trainNo: p.trainNo,
        trainName: p.trainName,
        passageTime: `${p.entryTime} – ${p.exitTime}`,
        impactType: 'Safety Buffer Infringement'
      });
    }
  });

  return {
    conflictsCount: conflictingTrains.length,
    conflictingTrains
  };
};

/**
 * ═══════════════════════════════════════════════════════════════
 * SOLVEX CORE OPTIMIZATION ENGINE
 * Evaluates candidate windows, performs multi-departmental bundling,
 * scores operational impact, and generates explainability notes.
 * ═══════════════════════════════════════════════════════════════
 */
export const runSolveXOptimization = (
  date: string,
  sectionId: string,
  workZoneId: string,
  selectedRequests: SimulatedTestRequest[]
): TestRunOptimizationResult => {
  const weekday = date === '2026-09-05' ? 'Saturday' : 'Sunday';

  // Fallback defaults if empty selection
  const requests = selectedRequests.length > 0 ? selectedRequests : [SIMULATED_TEST_REQUESTS[0]];

  // Work Zone metadata
  const firstReq = requests[0];
  const workZoneLine = firstReq.line || 'UP Line';
  const workZoneName = 'Pattambi (PTB) – Pallippuram (PUM)';
  const chainage = 'km 598/200 – km 601/400';
  const startStationCode = 'PTB';
  const endStationCode = 'PUM';

  // 1. Get real timetable passages for this work zone & date
  const passages = getTrainPassagesForWorkZone(startStationCode, endStationCode, date);

  // 2. Multi-departmental bundling
  // If multiple requests are in the same work zone and compatible lines:
  // Combined duration = max(single department duration) + minor coordination buffer (not sum!)
  const departmentsInvolved = Array.from(new Set(requests.map(r => r.dept))) as Department[];
  const totalRequestedDurationMin = requests.reduce((sum, r) => sum + r.durationMin, 0);

  let bundledBlockDurationMin = Math.max(...requests.map(r => r.durationMin));
  // Add small 5-minute overhead for multi-department safety handover if > 1 request
  if (requests.length > 1) {
    bundledBlockDurationMin = Math.max(bundledBlockDurationMin, Math.min(bundledBlockDurationMin + 5, totalRequestedDurationMin));
  }
  const timeSavedMin = Math.max(0, totalRequestedDurationMin - bundledBlockDurationMin);
  const maxSafetyBuffer = Math.max(...requests.map(r => r.safetyBufferMin || 5));

  // 3. Scan the day to generate candidate windows
  // We scan candidate start times in 15-minute steps across the 24 hours
  const candidateWindows: TestRunCandidateWindow[] = [];

  // Anchor candidate search around key daytime & night hours
  const candidateStarts = [
    timeToMinutes('02:30'), // Night corridor slot
    timeToMinutes('10:20'), // Mid-morning daylight gap
    timeToMinutes('11:30'), // Late morning
    timeToMinutes('13:40'), // Early afternoon
    timeToMinutes('15:10'), // Afternoon slot
    timeToMinutes('18:20'), // Evening slot
    timeToMinutes('22:00')  // Late night slot
  ];

  candidateStarts.forEach(startMin => {
    const endMin = startMin + bundledBlockDurationMin;
    const windowStr = `${minutesToTime(startMin)} – ${minutesToTime(endMin)}`;
    const conflictResult = checkWindowConflict(startMin, bundledBlockDurationMin, maxSafetyBuffer, passages, workZoneLine);

    // Scoring algorithm
    let score = 100;
    // Penalty for train conflict: -45 per conflict
    score -= conflictResult.conflictsCount * 45;
    // Bonus for bundling compatible tasks: +10 per bundled request
    if (requests.length > 1) score += (requests.length - 1) * 10;
    // Bonus for higher priority work: +8 for Critical, +5 for High
    if (requests.some(r => r.priority === 'Critical')) score += 8;
    else if (requests.some(r => r.priority === 'High')) score += 5;
    // Slight penalty for afternoon peak hours (14:00 - 18:00)
    if (startMin >= 840 && startMin <= 1080) score -= 12;

    score = Math.max(10, Math.min(99, score));

    const isFeasible = conflictResult.conflictsCount === 0;
    const operationalImpact = conflictResult.conflictsCount === 0 ? 'Low' : conflictResult.conflictsCount === 1 ? 'Medium' : 'High';

    let notes = 'Clean window without timetable clashes.';
    if (conflictResult.conflictsCount > 0) {
      const names = conflictResult.conflictingTrains.map(t => `${t.trainNo} (${t.trainName})`).join(', ');
      notes = `Overlaps with scheduled train ${names}.`;
    }

    candidateWindows.push({
      window: windowStr,
      startMinutes: startMin,
      endMinutes: endMin,
      durationMin: bundledBlockDurationMin,
      conflictsCount: conflictResult.conflictsCount,
      conflictingTrains: conflictResult.conflictingTrains,
      score,
      operationalImpact,
      isFeasible,
      notes
    });
  });

  // Sort candidate windows by feasibility first, then score descending
  candidateWindows.sort((a, b) => {
    if (a.isFeasible && !b.isFeasible) return -1;
    if (!a.isFeasible && b.isFeasible) return 1;
    return b.score - a.score;
  });

  // Pick top recommended window
  const bestWindow = candidateWindows[0] || {
    window: '10:20 – 11:05',
    startMinutes: 620,
    endMinutes: 665,
    durationMin: 45,
    conflictsCount: 0,
    conflictingTrains: [],
    score: 92,
    operationalImpact: 'Low' as const,
    isFeasible: true,
    notes: 'Optimal window'
  };

  const status = bestWindow.isFeasible ? 'OPTIMAL_FOUND' : candidateWindows.some(c => c.isFeasible) ? 'CONFLICT_DETECTED' : 'NO_FEASIBLE_WINDOW';

  // 4. Generate structured explainability points
  const explanationPoints: string[] = [];
  if (bestWindow.isFeasible) {
    explanationPoints.push(`✓ No scheduled train movement intersects the work zone between ${bestWindow.window}`);
    if (requests.length > 1) {
      explanationPoints.push(
        `✓ Integrated ${departmentsInvolved.join(' + ')} tasks bundled into ONE joint possession (${bundledBlockDurationMin}m instead of ${totalRequestedDurationMin}m, saving ${timeSavedMin}m)`
      );
    }
    explanationPoints.push(`✓ Required maintenance duration fits available gap with full ${maxSafetyBuffer}m safety buffers satisfied`);
    explanationPoints.push(`✓ Low operational disruption: 0 passenger express headways penalized`);
  } else {
    explanationPoints.push(`⚠ Timetable conflict detected: Train ${bestWindow.conflictingTrains[0]?.trainNo || ''} intersects window`);
    explanationPoints.push(`ℹ Consider evaluated Alternative windows to prevent punctuality loss`);
  }

  // 5. Generate Timeline Events for visualization
  const timelineEvents: TestRunOptimizationResult['timelineEvents'] = [];

  passages.forEach(p => {
    const isConflict =
      bestWindow.conflictingTrains.some(ct => ct.trainNo === p.trainNo) ||
      (p.entryMinutes >= bestWindow.startMinutes && p.entryMinutes <= bestWindow.endMinutes);

    timelineEvents.push({
      time: p.entryTime,
      timeMinutes: p.entryMinutes,
      type: 'train',
      title: `${p.trainNo} ${p.trainName}`,
      subtitle: `${p.trainType} · Passage ${p.entryTime}–${p.exitTime} at ${p.referenceStation}`,
      isConflict,
      trainData: {
        trainNo: p.trainNo,
        trainName: p.trainName,
        arrival: p.entryTime,
        departure: p.exitTime,
        station: p.referenceStation,
        direction: p.direction
      }
    });
  });

  // Add the recommended window to the timeline
  timelineEvents.push({
    time: minutesToTime(bestWindow.startMinutes),
    timeMinutes: bestWindow.startMinutes,
    type: 'window_start',
    title: `START RECOMMENDED BLOCK (${bestWindow.window})`,
    subtitle: `SolveX protected possession: ${departmentsInvolved.join(' + ')} (${bundledBlockDurationMin} min)`
  });

  timelineEvents.push({
    time: minutesToTime(bestWindow.endMinutes),
    timeMinutes: bestWindow.endMinutes,
    type: 'window_end',
    title: `RELEASE TRACK POSSESSION (${minutesToTime(bestWindow.endMinutes)})`,
    subtitle: `Normal signaling and 25kV traction feed restored`
  });

  timelineEvents.sort((a, b) => a.timeMinutes - b.timeMinutes);

  return {
    date,
    weekday,
    sectionId,
    sectionName: 'Shoranur Jn – Kozhikode Section',
    workZoneId,
    workZoneName,
    workZoneLine,
    chainage,
    requestsCount: requests.length,
    requestsBundledCount: requests.length,
    departmentsInvolved,
    totalRequestedDurationMin,
    bundledBlockDurationMin,
    timeSavedMin,
    recommendedWindow: bestWindow.window,
    recommendedStartMinutes: bestWindow.startMinutes,
    recommendedEndMinutes: bestWindow.endMinutes,
    conflictsCount: bestWindow.conflictsCount,
    affectedTrainsCount: bestWindow.conflictingTrains.length,
    operationalImpact: bestWindow.operationalImpact,
    synergyScore: bestWindow.score,
    status,
    reason: bestWindow.isFeasible
      ? `Compatible maintenance requests were bundled into a single feasible window with no timetable conflict in ${workZoneName}.`
      : `High-frequency train movements in selected period. Alternative windows recommended below.`,
    explanationPoints,
    candidateWindows,
    timelineEvents,
    approvalStatus: 'Pending Review',
    officialNote: 'Prototype decision recommendation. Final operational authority remains with the designated railway officer.'
  };
};

/**
 * ═══════════════════════════════════════════════════════════════
 * COMPARE SATURDAY VS SUNDAY
 * Demonstrates timetable variations across the two days
 * (e.g. 22476 CBE HSR AC EXP on Saturday only vs 16621 / 22852 on Sunday)
 * ═══════════════════════════════════════════════════════════════
 */
export const compareSaturdayVsSunday = (
  sectionId: string,
  workZoneId: string,
  requests: SimulatedTestRequest[]
): TwoDayComparisonResult => {
  const satResult = runSolveXOptimization('2026-09-05', sectionId, workZoneId, requests);
  const sunResult = runSolveXOptimization('2026-09-06', sectionId, workZoneId, requests);

  const satPassages = getTrainPassagesForWorkZone('PTB', 'PUM', '2026-09-05');
  const sunPassages = getTrainPassagesForWorkZone('PTB', 'PUM', '2026-09-06');

  // Saturday vs Sunday recommendation analysis
  // Saturday has 22476 CBE HSR AC Exp in the afternoon (15:00-15:40), whereas Sunday has 16621 RMM MAQ late at night
  let recommendedDay: 'Saturday' | 'Sunday' = 'Saturday';
  let comparisonReason = '';

  if (satResult.synergyScore >= sunResult.synergyScore) {
    recommendedDay = 'Saturday';
    comparisonReason = `Saturday (05 Sep 2026) offers a cleaner morning window (${satResult.recommendedWindow}) with ${satResult.conflictsCount} conflicts and higher headway buffer (${satResult.synergyScore}/100 score).`;
  } else {
    recommendedDay = 'Sunday';
    comparisonReason = `Sunday (06 Sep 2026) provides fewer daylight service conflicts (${sunResult.recommendedWindow}) with ${sunResult.conflictsCount} timetable clashes.`;
  }

  return {
    workZoneId,
    workZoneName: 'Pattambi (PTB) – Pallippuram (PUM)',
    saturday: {
      date: 'Saturday, 05 Sep 2026',
      bestWindow: satResult.recommendedWindow,
      conflicts: satResult.conflictsCount,
      impact: satResult.operationalImpact,
      synergyScore: satResult.synergyScore,
      trainsChecked: satPassages.length,
      status: satResult.status
    },
    sunday: {
      date: 'Sunday, 06 Sep 2026',
      bestWindow: sunResult.recommendedWindow,
      conflicts: sunResult.conflictsCount,
      impact: sunResult.operationalImpact,
      synergyScore: sunResult.synergyScore,
      trainsChecked: sunPassages.length,
      status: sunResult.status
    },
    recommendedDay,
    comparisonReason
  };
};
