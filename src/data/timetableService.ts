import timetableData from '../../data/timetable.json';

export interface StationInfo {
  code: string;
  name: string;
  sequence: number;
  route: string;
  isJunction: boolean;
}

export interface StationTimetableEvent {
  trainNumber: string;
  trainName: string;
  trainType: string;
  origin: string;
  destination: string;
  stationCode: string;
  stationName: string;
  arrival: string;
  departure: string;
  haltMin: number;
  calendarDate: string;
  routeBranch?: string;
}

// 1. All Palakkad Division stations from timetable dataset
export const PALAKKAD_STATIONS: StationInfo[] = (timetableData.stations || [])
  .filter((s: any) => !s['Palakkad Division'] || s['Palakkad Division'].toLowerCase() === 'yes')
  .map((s: any) => {
    const name = s['Station Name'] || '';
    const isJunction = name.toLowerCase().includes('jn') || name.toLowerCase().includes('junction');
    return {
      code: s['Station Code'],
      name,
      sequence: s['Sequence'] != null ? Number(s['Sequence']) : 999,
      route: s['Route / Branch'] || 'Palakkad Corridor',
      isJunction
    };
  })
  .sort((a, b) => a.sequence - b.sequence);

// 2. Query 24-hour chronological timetable for any given station
export function getStationTimetable(stationCode: string): StationTimetableEvent[] {
  if (!stationCode) return [];
  const targetCode = stationCode.trim().toUpperCase();

  const rawEvents = (timetableData.timetable || []).filter(
    (e: any) => (e['Station Code'] || '').trim().toUpperCase() === targetCode
  );

  // Map and deduplicate (e.g. for same train number across Saturday/Sunday)
  const seenKeys = new Set<string>();
  const events: StationTimetableEvent[] = [];

  for (const item of rawEvents) {
    const trainNumber = String(item['Train Number'] || '');
    const arr = item['Arrival'] || item['Departure'] || '00:00';
    const dep = item['Departure'] || item['Arrival'] || '00:00';
    const halt = item['Halt (min)'] != null ? Number(item['Halt (min)']) : 0;

    // Unique key for train run through this station
    const key = `${trainNumber}-${arr}-${dep}`;
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);

    const stationMeta = PALAKKAD_STATIONS.find(s => s.code === targetCode);

    events.push({
      trainNumber,
      trainName: item['Train Name'] || 'Express',
      trainType: item['Type'] || 'Mail/Express',
      origin: item['Origin'] || 'N/A',
      destination: item['Destination'] || 'N/A',
      stationCode: targetCode,
      stationName: item['Station Name'] || targetCode,
      arrival: arr,
      departure: dep,
      haltMin: halt,
      calendarDate: item['Calendar Date'] || '2026-09-06',
      routeBranch: stationMeta?.route || 'Main corridor'
    });
  }

  // Sort chronologically from 00:00 to 24:00
  return events.sort((a, b) => {
    const timeA = a.arrival || a.departure;
    const timeB = b.arrival || b.departure;
    return timeA.localeCompare(timeB);
  });
}
