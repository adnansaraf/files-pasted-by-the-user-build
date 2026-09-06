import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from './_supabaseClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Helper to load data/timetable.json from candidate paths
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
  // 1. Set CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Preflight check
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Diagnostic mode to discover available models directly on Vercel with the configured key
  if (req.method === 'GET' && req.query && req.query.diag === 'models') {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({ error: 'GEMINI_API_KEY is not configured in environment' });
    }
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const data = await resp.json();
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'GET' && req.query && req.query.diag === 'test') {
    const apiKey = process.env.GEMINI_API_KEY;
    const modelToTest = req.query.m || 'gemini-2.5-flash';
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelToTest });
      const resAI = await model.generateContent('Say hello in 2 words');
      return res.status(200).json({ success: true, text: resAI.response.text(), model: modelToTest });
    } catch (e) {
      return res.status(200).json({ success: false, error: e.message, model: modelToTest });
    }
  }

  if (req.method === 'GET') {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
      return res.status(200).json({ requests: [] });
    }
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching maintenance requests:', error);
        return res.status(500).json({ error: error.message });
      }
      // Automatically purge sample dummy test entries from Supabase and response
      const samplePrefixes = ['4608e2ef', '8a8cbb8e', '0424c9a0', '22bd94f8', 'b218c599', '005c4695'];
      const isSample = (r) => {
        const idStr = String(r.id || '').toLowerCase();
        const meta = r.ai_result?.requestMeta || {};
        const workType = String(meta.workType || '').toLowerCase();
        const desc = String(meta.description || '').toLowerCase();
        return samplePrefixes.some(p => idStr.includes(p.toLowerCase())) ||
               idStr.includes('005c4695') ||
               workType.includes('kuthira') || desc.includes('kuthira') ||
               workType.includes('sample') || desc.includes('sample') ||
               workType.includes('test') || desc.includes('test') ||
               workType.includes('rail welding') || desc.includes('rail welding') ||
               idStr.startsWith('req-1024') || idStr.startsWith('req-1025') || idStr.startsWith('req-1026') ||
               idStr.startsWith('req-1027') || idStr.startsWith('req-1028');
      };

      const sampleRows = (data || []).filter(isSample);
      if (sampleRows.length > 0) {
        // Asynchronously delete the sample rows from Supabase
        const sampleIdsToDelete = sampleRows.map(r => r.id);
        supabase.from('maintenance_requests').delete().in('id', sampleIdsToDelete).then(() => {
          console.log(`Purged ${sampleIdsToDelete.length} sample requests from Supabase`);
        }).catch(err => {
          console.warn('Could not auto-purge sample requests:', err.message);
        });
      }

      const cleanRequests = (data || []).filter(r => !isSample(r));
      return res.status(200).json({ requests: cleanRequests });
    } catch (err) {
      console.error('Error fetching maintenance requests:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
      return res.status(200).json({ success: true, message: 'No Supabase configured' });
    }
    try {
      const id = req.query?.id || (req.body && typeof req.body === 'object' ? req.body.id : null);
      const clearAll = req.query?.all === 'true' || id === 'all';
      const purgeSample = req.query?.purgeSample === 'true';

      if (clearAll) {
        const { error } = await supabase
          .from('maintenance_requests')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) throw error;
        return res.status(200).json({ success: true, message: 'All maintenance requests cleared from Supabase' });
      }

      if (purgeSample) {
        const samplePrefixes = ['4608e2ef', '8a8cbb8e', '0424c9a0', '22bd94f8', 'b218c599', '005c4695'];
        const filterOr = samplePrefixes.map(p => `id.ilike.%${p}%`).join(',');
        const { error } = await supabase
          .from('maintenance_requests')
          .delete()
          .or(filterOr);
        if (error) console.warn('Supabase sample purge notice:', error.message);
        return res.status(200).json({ success: true, message: 'Sample requests purged' });
      }

      if (id) {
        const cleanId = String(id).replace(/^REQ-/, '');
        const { error } = await supabase
          .from('maintenance_requests')
          .delete()
          .or(`id.eq.${cleanId},id.ilike.${cleanId}%`);
        if (error) throw error;
        return res.status(200).json({ success: true, message: `Request ${id} deleted` });
      }

      return res.status(400).json({ error: 'Specify ?id=<id>, ?all=true, or ?purgeSample=true' });
    } catch (err) {
      console.error('Error during DELETE operation:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use GET, POST, or DELETE.' });
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

    // 1. Accept POST body: { section, startTime, duration, priority }
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

    // 2. Load data/timetable.json and filter sectionMovements
    const timetableData = loadTimetableData();
    const sectionMovements = timetableData.sectionMovements || [];
    const trainsList = timetableData.trains || [];

    const trainMetaMap = new Map();
    for (const tr of trainsList) {
      trainMetaMap.set(String(tr['Train Number']), tr);
    }

    const normalizedSection = section.trim().toUpperCase();

    const overlappingMovements = sectionMovements.filter(m => {
      const movementSection = (m.Section || '').trim().toUpperCase();
      if (movementSection !== normalizedSection) {
        return false;
      }

      const depMin = timeToMinutes(m.Departure);
      const arrMin = timeToMinutes(m.Arrival);

      const effectiveArrMin = arrMin >= depMin ? arrMin : arrMin + 1440;
      const effectiveEndMin = endMin >= startMin ? endMin : endMin + 1440;

      return depMin < effectiveEndMin && effectiveArrMin > startMin;
    });

    // 3. Build train details for the prompt
    const trainDetails = overlappingMovements.map(m => {
      const trainNo = String(m['Train Number']);
      const meta = trainMetaMap.get(trainNo) || {};
      return {
        trainNumber: trainNo,
        trainName: m['Train Name'] || meta['Train Name'] || 'Unknown',
        trainType: meta['Train Type'] || 'Express',
        departure: m['Departure'],
        arrival: m['Arrival'],
        from: m['From'],
        to: m['To'],
        date: m['Calendar Date']
      };
    });

    // Default fallback in case of no key or unexpected failure
    let parsedResult = {
      conflict: trainDetails.length > 0,
      conflictingTrain: trainDetails.length > 0 ? `${trainDetails[0].trainName} (${trainDetails[0].trainNumber})` : null,
      collisionTime: trainDetails.length > 0 ? trainDetails[0].departure : null,
      recommendedWindow: trainDetails.length > 0
        ? {
            start: minutesToTime(endMin + 30),
            end: minutesToTime(endMin + 30 + durationNum * 60)
          }
        : {
            start: startTime,
            end: endTimeStr
          },
      reasoning: trainDetails.length > 0
        ? `Found ${trainDetails.length} scheduled train passage(s) in section ${normalizedSection} during the requested window.`
        : `Section ${normalizedSection} has no scheduled train movements during the requested window.`,
      priorityNote: `Assessed under priority ${priority || 'High'}.`
    };

    // 4. Call Google Gemini API
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);

        const prompt = `You are an expert Indian Railways (Palakkad Division) operations and corridor block planning controller.
Analyze the requested railway maintenance possession against actual scheduled train movements.

REQUESTED MAINTENANCE BLOCK:
- Section: ${normalizedSection}
- Requested Start Time: ${startTime} IST
- Requested End Time: ${endTimeStr} IST
- Duration: ${durationNum} hours
- Priority: ${priority || 'High'}

ACTUAL TRAIN MOVEMENTS IN THIS SECTION & WINDOW (Palakkad Division Timetable):
${JSON.stringify(trainDetails, null, 2)}

INSTRUCTIONS:
1. Determine if there is an operational conflict between the requested maintenance possession and the scheduled train passages.
2. If any trains pass through the section during the requested [${startTime} - ${endTimeStr}] window, mark "conflict": true.
3. If conflict is true:
   - Identify the primary "conflictingTrain" (e.g. "Train Name (Number)")
   - Identify the approximate "collisionTime" (e.g. "HH:MM")
   - Suggest a realistic "recommendedWindow" with "start" and "end" (format "HH:MM") of duration ${durationNum} hours that minimizes delay to high-priority trains.
4. If there are no conflicting trains:
   - "conflict": false
   - "conflictingTrain": null
   - "collisionTime": null
   - "recommendedWindow": { "start": "${startTime}", "end": "${endTimeStr}" }
5. "reasoning": Clear explanation citing train movements, numbers, and operational considerations.
6. "priorityNote": Operational recommendation based on the ${priority || 'High'} priority.

Return STRICT JSON only matching this exact schema:
{
  "conflict": boolean,
  "conflictingTrain": string | null,
  "collisionTime": string | null,
  "recommendedWindow": { "start": string, "end": string } | null,
  "reasoning": string,
  "priorityNote": string
}`;

        // Candidate models in preference order (confirmed working on this API key)
        const candidateModels = [
          'gemini-3.6-flash',
          'gemini-3.7-flash',
          'gemini-3.8-flash',
          'gemini-3.5-flash'
        ];

        let result = null;
        let lastError = null;

        for (const modelName of candidateModels) {
          try {
            const m = genAI.getGenerativeModel({
              model: modelName,
              generationConfig: { responseMimeType: 'application/json' }
            });
            result = await m.generateContent(prompt);
            if (result) break;
          } catch (err) {
            lastError = err;
            console.warn(`Model ${modelName} failed:`, err.message);
          }
        }

        if (!result) {
          throw lastError || new Error('No available Gemini model succeeded.');
        }

        let rawText = result.response.text() || '';

        // 5. Parse response defensively (strip fences, handle JSON.parse)
        rawText = rawText.trim();
        if (rawText.startsWith('```json')) {
          rawText = rawText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
        } else if (rawText.startsWith('```')) {
          rawText = rawText.replace(/^```\s*/, '').replace(/```\s*$/, '');
        }

        parsedResult = JSON.parse(rawText);
      } catch (geminiError) {
        console.error('Error invoking or parsing Gemini API response:', geminiError);
        parsedResult.reasoning = `${parsedResult.reasoning} (AI fallback active: ${geminiError.message || 'Error communicating with model'})`;
      }
    } else {
      console.warn('GEMINI_API_KEY is not defined; returning timetable inspection fallback.');
      parsedResult.reasoning = `${parsedResult.reasoning} (Note: GEMINI_API_KEY not configured in environment).`;
    }

    // 6. Insert request + ai_result into maintenance_requests Supabase table
    let insertedId = null;
    try {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
        const startTimeIso = new Date(`2026-09-06T${startTime}:00+05:30`).toISOString();
        const requestMeta = {
          dept: body?.dept || 'Engineering',
          workType: body?.workType || 'Track Possession Maintenance',
          description: body?.description || '',
          preferredTimeWindow: body?.preferredTimeWindow || `${startTime}–${endTimeStr}`,
          constraints: body?.constraints || '',
          resources: body?.resources || ''
        };
        const aiResultToSave = {
          ...parsedResult,
          requestMeta
        };

        const { data: inserted, error: dbErr } = await supabase.from('maintenance_requests').insert({
          section: normalizedSection,
          start_time: startTimeIso,
          duration_minutes: Math.round(durationNum * 60),
          priority: priority || 'High',
          status: 'Pending',
          ai_result: aiResultToSave
        }).select();

        if (dbErr) {
          console.error('Failed to insert maintenance request into Supabase:', dbErr);
        } else if (inserted && inserted.length > 0) {
          insertedId = inserted[0].id;
        }
      }
    } catch (dbErr) {
      console.error('Failed to insert maintenance request into Supabase:', dbErr);
    }

    // 7. Return the parsed AI result to the frontend
    return res.status(200).json({
      ...parsedResult,
      id: insertedId ? `REQ-${insertedId.slice(0, 8)}` : undefined,
      dbId: insertedId
    });
  } catch (err) {
    console.error('Error processing maintenance request:', err);
    return res.status(500).json({
      error: 'Internal server error while evaluating maintenance request',
      details: err.message
    });
  }
}
