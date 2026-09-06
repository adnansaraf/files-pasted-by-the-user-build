-- Migration: add_stations_table
-- Creates stations table for Palakkad Division stations from timetable dataset

CREATE TABLE IF NOT EXISTS stations (
    station_code TEXT PRIMARY KEY,
    station_name TEXT NOT NULL,
    sequence INTEGER,
    route_branch TEXT,
    division TEXT DEFAULT 'Palakkad',
    is_junction BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for searching and filtering by division and route branch
CREATE INDEX IF NOT EXISTS idx_stations_division 
    ON stations(division);

CREATE INDEX IF NOT EXISTS idx_stations_route 
    ON stations(route_branch);
