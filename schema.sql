-- Schema for Rede Soma Av. Sete NPS Survey

-- Table for tracking accesses
CREATE TABLE acessos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for survey responses
CREATE TABLE respostas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nps_score INTEGER NOT NULL CHECK (nps_score >= 0 AND nps_score <= 10),
  q1 INTEGER NOT NULL CHECK (q1 >= 1 AND q1 <= 5),
  q2 INTEGER NOT NULL CHECK (q2 >= 1 AND q2 <= 5),
  q3 INTEGER NOT NULL CHECK (q3 >= 1 AND q3 <= 5),
  q4 INTEGER NOT NULL CHECK (q4 >= 1 AND q4 <= 5),
  q5 INTEGER NOT NULL CHECK (q5 >= 1 AND q5 <= 5),
  nome TEXT,
  telefone TEXT UNIQUE,
  origem TEXT,
  duration INTEGER, -- in milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_acessos_created_at ON acessos(created_at);
CREATE INDEX idx_respostas_created_at ON respostas(created_at);