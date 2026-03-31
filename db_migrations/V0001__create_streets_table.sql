CREATE TABLE streets (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    era TEXT,
    year TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);