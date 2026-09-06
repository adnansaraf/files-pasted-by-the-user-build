-- Migration: init_schema
-- Created for SolveX Palakkad Division timetable and maintenance requests

-- 1. Trains table
CREATE TABLE IF NOT EXISTS trains (
    train_number TEXT PRIMARY KEY,
    train_name TEXT,
    train_type TEXT,
    origin TEXT,
    destination TEXT,
    running_days TEXT
);

-- 2. Section Movements table
CREATE TABLE IF NOT EXISTS section_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_date DATE NOT NULL,
    train_number TEXT REFERENCES trains(train_number) ON DELETE CASCADE,
    section TEXT NOT NULL,
    departure TIME,
    arrival TIME,
    occupation_minutes INTEGER
);

-- Index on section_movements(section, calendar_date)
CREATE INDEX IF NOT EXISTS idx_section_movements_section_date 
    ON section_movements(section, calendar_date);

-- 3. Maintenance Requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL,
    priority TEXT,
    status TEXT DEFAULT 'Pending',
    ai_result JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index on maintenance_requests(section)
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_section 
    ON maintenance_requests(section);
