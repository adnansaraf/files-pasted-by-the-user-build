import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function seedStations() {
  console.log('--- Starting Seed: stations ---');

  const timetablePath = path.join(projectRoot, 'data', 'timetable.json');
  if (!fs.existsSync(timetablePath)) {
    console.error(`Error: ${timetablePath} not found.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(timetablePath, 'utf8');
  const data = JSON.parse(raw);
  const rawStations = data.stations || [];

  console.log(`Found ${rawStations.length} stations in timetable.json`);

  // Filter to Palakkad Division (all entries where 'Palakkad Division' === 'Yes' or default)
  const palakkadStations = rawStations.filter(s => 
    !s['Palakkad Division'] || s['Palakkad Division'].toLowerCase() === 'yes'
  );

  console.log(`Palakkad Division stations to upsert: ${palakkadStations.length}`);

  const stationsToUpsert = palakkadStations.map(s => {
    const name = s['Station Name'] || '';
    const isJunction = name.toLowerCase().includes('jn') || name.toLowerCase().includes('junction');
    return {
      station_code: s['Station Code'],
      station_name: name,
      sequence: s['Sequence'] != null ? parseInt(s['Sequence'], 10) : null,
      route_branch: s['Route / Branch'] || null,
      division: 'Palakkad',
      is_junction: isJunction
    };
  });

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    console.log('[DRY-RUN / LOCAL MODE] SUPABASE_URL or SUPABASE_SECRET_KEY not set locally.');
    console.log(`Successfully verified ${stationsToUpsert.length} station records ready for Supabase:`);
    console.log(stationsToUpsert.slice(0, 5));
    return stationsToUpsert.length;
  }

  const { supabase } = await import('../api/_supabaseClient.js');

  console.log(`Upserting ${stationsToUpsert.length} stations into Supabase...`);
  const { data: inserted, error } = await supabase
    .from('stations')
    .upsert(stationsToUpsert, { onConflict: 'station_code' })
    .select();

  if (error) {
    console.error('Failed to upsert stations into Supabase:', error);
    process.exit(1);
  }

  console.log(`Successfully upserted ${inserted?.length || stationsToUpsert.length} stations.`);

  const { count, error: countErr } = await supabase
    .from('stations')
    .select('*', { count: 'exact', head: true });

  if (countErr) {
    console.error('Error counting stations:', countErr);
  } else {
    console.log(`Total stations count in Supabase table: ${count}`);
  }

  return count || stationsToUpsert.length;
}

seedStations().catch(err => {
  console.error('Unexpected error during station seed:', err);
  process.exit(1);
});
