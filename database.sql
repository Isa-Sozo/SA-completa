CREATE DATABASE MOBILIDADE;


CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  saldo DECIMAL(10,2) DEFAULT 0
  cpf VARCHAR(14) UNIQUE
);

CREATE TABLE empresas (
  id_empresa SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cidade VARCHAR(100)
);

CREATE TABLE cartoes (
  id_cartao SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES usuarios(id_usuario),
  numero_cartao VARCHAR(50) UNIQUE NOT NULL,
  saldo DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE usos_cartao (
  id_uso SERIAL PRIMARY KEY,
  id_cartao INTEGER REFERENCES cartoes(id_cartao),
  id_empresa INTEGER REFERENCES empresas(id_empresa),
  valor DECIMAL(10,2) NOT NULL,
  data_uso TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recargas (
  id_recarga SERIAL PRIMARY KEY,
  id_cartao INTEGER REFERENCES cartoes(id_cartao),
  valor DECIMAL(10,2) NOT NULL,
  data_recarga TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dados de empresas
INSERT INTO empresas (nome, cidade)
VALUES ('Ônibus São José', 'São José'),
       ('Mobilidade SP', 'São Paulo'),
       ('TransFloripa', 'Florianópolis');