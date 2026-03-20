CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  username TEXT,
  password TEXT
);

CREATE TABLE chamados (
  id SERIAL PRIMARY KEY,
  titulo TEXT,
  descricao TEXT,
  responsavel_id INTEGER,
  criado_em TIMESTAMP DEFAULT NOW()
);