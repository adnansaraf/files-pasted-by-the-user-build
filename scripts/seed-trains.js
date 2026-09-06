import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load .env.local if present
dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function seed() {
  console.log('--- Starting Seed: trains and section_movements ---');

  const { supabase } = await import('../api/_supabaseClient.js');

  const timetablePath = path.join(projectRoot, 'data', 'timetable.json');
  if (!fs.existsSync(timetablePath)) {
    console.error(`Error: ${timetablePath} not found.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(timetablePath, 'utf8');
  const data = JSON.parse(raw);

  const rawTrains = data.trains || [];
  const rawMovements = data.sectionMovements || [];

  console.log(`Found ${rawTrains.length} trains and ${rawMovements.length} section movements in timetable.json`);

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    console.error(
      'Error: SUPABASE_URL or SUPABASE_SECRET_KEY is not defined in the environment or .env.local.'
    );
    console.error(
      'Run `vercel env pull .env.local` to populate your local environment variables.'
    );
    process.exit(1);
  }

  // 1. Prepare trains
  const trainsToUpsert = rawTrains.map(t => ({
    train_number: String(t['Train Number']),
    train_name: t['Train Name'] || null,
    train_type: t['Train Type'] || null,
    origin: t['Origin'] || null,
    destination: t['Destination'] || null,
    running_days: t['Running Days'] || null
  }));

  console.log(`Upserting ${trainsToUpsert.length} trains...`);
  const { data: insertedTrains, error: trainError } = await supabase
    .from('trains')
    .upsert(trainsToUpsert, { onConflict: 'train_number' })
    .select();

  if (trainError) {
    console.error('Failed to upsert trains:', trainError);
    process.exit(1);
  }
  console.log(`Successfully upserted trains. Count returned: ${insertedTrains?.length || trainsToUpsert.length}`);

  // 2. Prepare section movements
  const movementsToUpsert = rawMovements.map(m => {
    // Convert Departure "HH:MM" to "HH:MM:00" format for postgres TIME
    const depTime = m['Departure'] ? (m['Departure'].split(':').length === 2 ? `${m['Departure']}:00` : m['Departure']) : null;
    const arrTime = m['Arrival'] ? (m['Arrival'].split(':').length === 2 ? `${m['Arrival']}:00` : m['Arrival']) : null;

    return {
      calendar_date: m['Calendar Date'],
      train_number: String(m['Train Number']),
      section: m['Section'],
      departure: depTime,
      arrival: arrTime,
      occupation_minutes: parseInt(m['Occupation (min)'], 10) || null
    };
  });

  console.log(`Inserting ${movementsToUpsert.length} section movements...`);
  // Clear or bulk insert
  const { data: insertedMovements, error: movError } = await supabase
    .from('section_movements')
    .insert(movementsToUpsert)
    .select();

  if (movError) {
    console.error('Failed to insert section movements:', movError);
    process.exit(1);
  }
  console.log(`Successfully inserted section movements. Count returned: ${insertedMovements?.length || movementsToUpsert.length}`);

  // Verify counts
  const { count: totalTrains, error: countTrainErr } = await supabase
    .from('trains')
    .select('*', { count: 'exact', head: true });

  const { count: totalMovements, error: countMovErr } = await supabase
    .from('section_movements')
    .select('*', { count: 'exact', head: true });

  // Fetch sample rows
  const { data: sampleTrain } = await supabase
    .from('trains')
    .select('*')
    .limit(1);

  const { data: sampleMovement } = await supabase
    .from('section_movements')
    .select('*')
    .limit(1);

  console.log('--- Verification Summary ---');
  console.log(`Total rows in 'trains' table: ${totalTrains}`);
  console.log(`Total rows in 'section_movements' table: ${totalMovements}`);
  console.log('\nSample row from trains:');
  console.log(JSON.stringify(sampleTrain?.[0] || null, null, 2));
  console.log('\nSample row from section_movements:');
  console.log(JSON.stringify(sampleMovement?.[0] || null, null, 2));
}

seed().catch(err => {
  console.error('Unexpected error during seeding:', err);
  process.exit(1);
});
