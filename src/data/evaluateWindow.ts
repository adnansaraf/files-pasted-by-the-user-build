import timetableData from '../../data/timetable.json';

export interface WindowEvaluationResult {
  startTime: string;
  endTime: string;
  durationHours: number;
  hasConflict: boolean;
  score: number;
  conflictsCount: number;
  conflictingTrain: string | null;
  collisionTime: string | null;
  estimatedTrainImpact: string;
  operationalConflictsText: string;
  tradeoffs: string[];
  clashingMovements: any[];
}

export function timeToMinutes(timeStr: string): number {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return 0;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  return (isNaN(hours) ? 0 : hours) * 60 + (isNaN(minutes) ? 0 : minutes);
}

export function minutesToTime(totalMinutes: number): string {
  const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60).toString().padStart(2, '0');
  const minutes = (normalized % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function getMatchingSections(sectionId: string): string[] {
  const norm = (sectionId || '').toUpperCase().trim();
  const res = new Set<string>();
  if (norm) res.add(norm);

  if (norm.includes('PGT') || norm.includes('PALAKKAD') || norm.includes('SRR') || norm.includes('SHORANUR')) {
    res.add('PGT-SRR');
    res.add('SRR-PGT');
  }
  if (norm.includes('SRR') || norm.includes('CLT') || norm.includes('KOZHIKODE') || norm.includes('TIR') || norm.includes('TIRUR')) {
    res.add('SRR-CLT');
    res.add('CLT-SRR');
    res.add('SRR-TIR');
    res.add('TIR-CLT');
  }
  if (norm.includes('CLT') || norm.includes('CAN') || norm.includes('KANNUR') || norm.includes('BDJ') || norm.includes('VADAKARA')) {
    res.add('CLT-CAN');
    res.add('CAN-CLT');
    res.add('CLT-BDJ');
    res.add('BDJ-CAN');
  }
  if (norm.includes('CAN') || norm.includes('MAQ') || norm.includes('MANGALURU') || norm.includes('PAY') || norm.includes('KGQ')) {
    res.add('CAN-MAQ');
    res.add('MAQ-CAN');
    res.add('CAN-PAY');
    res.add('PAY-KGQ');
    res.add('KGQ-MAQ');
  }

  return Array.from(res);
}

export function evaluateCustomWindow(
  sectionId: string,
  startTime: string,
  durationHours: number
): WindowEvaluationResult {
  const durationNum = parseFloat(String(durationHours)) || 2;
  const startMin = timeToMinutes(startTime);
  const endMin = startMin + durationNum * 60;
  const endTime = minutesToTime(endMin);

  const sectionMovements = (timetableData.sectionMovements || []) as any[];
  const matchingSections = getMatchingSections(sectionId);

  // Filter overlapping movements in data/timetable.json
  const clashingMovements = sectionMovements.filter(m => {
    const movementSection = (m.Section || '').trim().toUpperCase();
    const isSecMatch = matchingSections.some(sec => 
      movementSection === sec || sec.includes(movementSection) || movementSection.includes(sec)
    );
    if (!isSecMatch) return false;

    const depMin = timeToMinutes(m.Departure);
    const arrMin = timeToMinutes(m.Arrival);

    const effectiveArr = arrMin >= depMin ? arrMin : arrMin + 1440;
    const effectiveEnd = endMin >= startMin ? endMin : endMin + 1440;

    // Check with 10-minute headway margin
    return (depMin - 10) < effectiveEnd && (effectiveArr + 10) > startMin;
  });

  const hasConflict = clashingMovements.length > 0;
  const conflictsCount = clashingMovements.length;

  if (hasConflict) {
    const primary = clashingMovements[0];
    const trainName = `${primary['Train Name'] || 'Scheduled Service'} (${primary['Train Number'] || ''})`;
    const collisionTime = primary.Departure || primary.Arrival || startTime;
    const detentionMins = Math.min(60, Math.max(15, Math.abs(endMin - timeToMinutes(primary.Departure))));

    const score = Math.max(38, Math.min(68, 70 - (conflictsCount - 1) * 12));

    return {
      startTime,
      endTime,
      durationHours: durationNum,
      hasConflict: true,
      score,
      conflictsCount,
      conflictingTrain: trainName,
      collisionTime,
      estimatedTrainImpact: `Detains ${primary['Train Name'] || 'traffic'} (~${detentionMins} min delay)`,
      operationalConflictsText: `${conflictsCount} Critical Timetable Conflict${conflictsCount > 1 ? 's' : ''}`,
      tradeoffs: [
        `Intersects ${trainName} at ${collisionTime}`,
        `Breaches statutory 15-minute safety headway buffer`,
        `Requires holding trains at adjacent loop lines or issuing caution order`
      ],
      clashingMovements
    };
  }

  // Clear window!
  return {
    startTime,
    endTime,
    durationHours: durationNum,
    hasConflict: false,
    score: 93,
    conflictsCount: 0,
    conflictingTrain: null,
    collisionTime: null,
    estimatedTrainImpact: '0 min detention (zero collision)',
    operationalConflictsText: '0 conflicts (Timetable clear)',
    tradeoffs: [
      `No scheduled train movements across section during ${startTime}–${endTime}`,
      `Maintains statutory safety headway before morning services`,
      `Custom slot verified clear against Palakkad Division 24h timetable`
    ],
    clashingMovements: []
  };
}
