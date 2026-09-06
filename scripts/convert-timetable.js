import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const excelFileName = 'SolveX_Palakkad_Division_Timetable_2026-09-05_06.xlsx';
const excelFilePath = path.join(projectRoot, excelFileName);

if (!fs.existsSync(excelFilePath)) {
  console.error(`Error: Excel file not found at ${excelFilePath}`);
  process.exit(1);
}

console.log(`Reading Excel file from ${excelFilePath}...`);
const workbook = xlsx.readFile(excelFilePath);

const trains = xlsx.utils.sheet_to_json(workbook.Sheets['Train_Master'] || workbook.Sheets['Train Master'] || {}) || [];
const timetable = xlsx.utils.sheet_to_json(workbook.Sheets['Timetable'] || {}) || [];
const stations = xlsx.utils.sheet_to_json(workbook.Sheets['Stations'] || {}) || [];
const sectionMovements = xlsx.utils.sheet_to_json(workbook.Sheets['Section_Movements'] || workbook.Sheets['Section Movements'] || {}) || [];

const outputData = {
  trains,
  timetable,
  stations,
  sectionMovements
};

const outputDir = path.join(projectRoot, 'data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'timetable.json');
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');

console.log(`Successfully converted Excel to ${outputPath}`);
console.log(`Counts:`);
console.log(`- Trains: ${trains.length}`);
console.log(`- Timetable entries: ${timetable.length}`);
console.log(`- Stations: ${stations.length}`);
console.log(`- Section Movements: ${sectionMovements.length}`);
