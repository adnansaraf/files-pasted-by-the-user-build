import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { supabase } from './_supabaseClient.js';

// Helper to convert "HH:MM" to minutes from midnight
function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return 0;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  return (isNaN(hours) ? 0 : hours) * 60 + (isNaN(minutes) ? 0 : minutes);
}

// Helper to convert minutes from midnight to "HH:MM"
function minutesToTime(totalMinutes) {
  const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60).toString().padStart(2, '0');
  const minutes = (normalized % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Helper to load data/timetable.json from multiple candidate paths
function loadTimetableData() {
  const possiblePaths = [
    path.join(process.cwd(), 'data', 'timetable.json'),
    path.join(__dirname, '..', 'data', 'timetable.json'),
    path.resolve('data/timetable.json')
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw);
      } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
      }
    }
  }

  throw new Error('data/timetable.json could not be found');
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }

    const { section, startTime, duration, priority } = body || {};

    if (!section || !startTime) {
      return res.status(400).json({
        error: 'Missing required parameters: "section" and "startTime" are required.'
      });
    }

    const durationNum = parseFloat(duration) || 2;
    const startMin = timeToMinutes(startTime);
    const endMin = startMin + durationNum * 60;
    const endTimeStr = minutesToTime(endMin);

    // Load actual timetable
    const timetableData = loadTimetableData();
    const sectionMovements = timetableData.sectionMovements || [];
    const trainsList = timetableData.trains || [];

    // Create a fast lookup map for train metadata
    const trainMetaMap = new Map();
    trainsList.forEach(t => {
      trainMetaMap.set(String(t['Train Number']), t);
    });

    // Normalize section format (e.g., handles "PGT-SRR" or "SRR-PGT" if bi-directional search needed)
    const normalizedSection = section.trim().toUpperCase();

    // Filter section movements that overlap [startTime, startTime + duration]
    const overlappingMovements = sectionMovements.filter(m => {
      const movementSection = (m.Section || '').trim().toUpperCase();
      if (movementSection !== normalizedSection) {
        return false;
      }

      const depMin = timeToMinutes(m.Departure);
      const arrMin = timeToMinutes(m.Arrival);

      // Handle normal overlapping intervals (taking into account departure < arrival)
      // If arrival time is earlier than departure (e.g. crossing midnight), adjust
      const effectiveArrMin = arrMin >= depMin ? arrMin : arrMin + 1440;
      const effectiveEndMin = endMin >= startMin ? endMin : endMin + 1440;

      // Overlap condition: max(startMin, depMin) < min(effectiveEndMin, effectiveArrMin)
      return depMin < effectiveEndMin && effectiveArrMin > startMin;
    });

    // Build train details for prompt
    const trainDetails = overlappingMovements.map(m => {
      const trainNo = String(m['Train Number']);
      const meta = trainMetaMap.get(trainNo) || {};
      return {
        trainNumber: trainNo,
        trainName: m['Train Name'] || meta['Train Name'] || 'Unknown',
        trainType: meta['Train Type'] || 'Express',
        origin: meta['Origin'] || m['From Code'] || m['From'],
        destination: meta['Destination'] || m['To Code'] || m['To'],
        from: m['From'],
        fromCode: m['From Code'],
        departure: m['Departure'],
        to: m['To'],
        toCode: m['To Code'],
        arrival: m['Arrival'],
        occupationMinutes: m['Occupation (min)'],
        date: m['Calendar Date']
      };
    });

    // Check Gemini API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback response if GEMINI_API_KEY is not set
      const fallbackResult = {
        conflict: trainDetails.length > 0,
        conflictingTrain: trainDetails.length > 0 ? `${trainDetails[0].trainName} (${trainDetails[0].trainNumber})` : null,
        collisionTime: trainDetails.length > 0 ? trainDetails[0].departure : null,
        recommendedWindow: trainDetails.length > 0
          ? {
              start: minutesToTime(endMin + 30),
              end: minutesToTime(endMin + 30 + durationNum * 60)
            }
          : { start: startTime, end: endTimeStr },
        reasoning: `Evaluation completed via timetable inspection: ${trainDetails.length} train(s) identified in section ${section}. Note: GEMINI_API_KEY is not configured on the environment.`,
        priorityNote: `Priority ${priority || 'Normal'} processed without AI LLM fine-tuning.`
      };

      // Persist to Supabase if configured
      try {
        if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
          const startTimeIso = new Date(`2026-09-06T${startTime}:00+05:30`).toISOString();
          await supabase.from('maintenance_requests').insert({
            section: normalizedSection,
            start_time: startTimeIso,
            duration_minutes: Math.round(durationNum * 60),
            priority: priority || 'High',
            status: 'Pending',
            ai_result: fallbackResult
          });
        }
      } catch (dbErr) {
        console.error('Failed to persist request to Supabase:', dbErr);
      }

      return res.status(200).json(fallbackResult);
    }

    const ai = new GoogleGenAI({ apiKey });

    // Build the prompt
    const prompt = `You are an expert railway operations controller and block planning system for Indian Railways (Palakkad Division).
Analyze the requested railway maintenance block window and verify against the actual scheduled train movements.

REQUESTED MAINTENANCE BLOCK:
- Section: ${normalizedSection}
- Requested Start Time: ${startTime} IST
- Requested End Time: ${endTimeStr} IST
- Duration: ${durationNum} hours
- Priority: ${priority || 'High'}

ACTUAL TRAIN MOVEMENTS IN THIS SECTION & WINDOW (From verified Palakkad Division Timetable):
${JSON.stringify(trainDetails, null, 2)}

INSTRUCTIONS:
1. Determine if there is an operational conflict between the requested maintenance window and the scheduled train passages.
2. If trains pass through the section during the requested [${startTime} - ${endTimeStr}] window, mark conflict as true.
3. If there is a conflict, identify the primary conflicting train, the approximate collision point / time, and calculate a realistic recommended non-conflicting maintenance window (or lowest-impact window with minimum 15-minute headway) of duration ${durationNum} hours.
4. If there are no conflicting trains in this window, mark conflict as false, set conflictingTrain and collisionTime to null, and recommend the requested window.
5. Provide clear railway-grade reasoning citing the train numbers, types, and operational headway considerations, along with a note regarding the block priority.

Return STRICT JSON only matching this exact schema:
{
  "conflict": boolean,
  "conflictingTrain": string | null,
  "collisionTime": string | null,
  "recommendedWindow": { "start": string, "end": string } | null,
  "reasoning": string,
  "priorityNote": string
}`;

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    let rawText = response.text || '';
    
    // Strip markdown formatting if present
    rawText = rawText.trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', rawText, parseError);
      // Fallback response with defensiveness
      parsedResult = {
        conflict: trainDetails.length > 0,
        conflictingTrain: trainDetails.length > 0 ? `${trainDetails[0].trainName} (${trainDetails[0].trainNumber})` : null,
        collisionTime: trainDetails.length > 0 ? trainDetails[0].departure : null,
        recommendedWindow: trainDetails.length > 0
          ? {
              start: minutesToTime(endMin + 20),
              end: minutesToTime(endMin + 20 + durationNum * 60)
            }
          : { start: startTime, end: endTimeStr },
        reasoning: `AI response parsing fallback: ${trainDetails.length} trains detected in section ${normalizedSection}. Raw analysis: ${rawText.slice(0, 150)}`,
        priorityNote: `Assessed under priority ${priority || 'Standard'}`
      };
    }

    // Persist to Supabase if configured
    try {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
        const startTimeIso = new Date(`2026-09-06T${startTime}:00+05:30`).toISOString();
        await supabase.from('maintenance_requests').insert({
          section: normalizedSection,
          start_time: startTimeIso,
          duration_minutes: Math.round(durationNum * 60),
          priority: priority || 'High',
          status: 'Pending',
          ai_result: parsedResult
        });
      }
    } catch (dbErr) {
      console.error('Failed to persist request to Supabase:', dbErr);
    }

    return res.status(200).json(parsedResult);
  } catch (err) {
    console.error('Error processing maintenance request:', err);
    return res.status(500).json({
      error: 'Internal server error while evaluating maintenance request',
      details: err.message
    });
  }
}
