CREATE DATABASE IF NOT EXISTS TCC
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE TCC;

-- =========================
-- TABELA: Funcionarios
-- =========================
CREATE TABLE IF NOT EXISTS funcionario (
  id_funcionario INT NOT NULL,
  nome_funcionario VARCHAR(65) NOT NULL,
  senha VARCHAR(200),
  coordenador BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id_funcionario)
) ENGINE=InnoDB;

-- =========================
-- TABELA: Sala
-- =========================
CREATE TABLE IF NOT EXISTS sala (
  id_sala INT NOT NULL AUTO_INCREMENT,
  numero_sala VARCHAR(10) NOT NULL,
  PRIMARY KEY (id_sala),
  UNIQUE KEY uk_sala_numero (numero_sala)
) ENGINE=InnoDB;

-- =========================
-- TABELA: Equipamentos
-- status_equipamento: 0=inativo, 1=ativo, 2=em manutencao
-- =========================
CREATE TABLE IF NOT EXISTS equipamento (
  id_equipamento INT NOT NULL AUTO_INCREMENT,
  numero_equipamento VARCHAR(10) NOT NULL,
  status_equipamento TINYINT UNSIGNED NOT NULL DEFAULT 1,
  code_sala INT NOT NULL,
  PRIMARY KEY (id_equipamento),
  KEY idx_equipamentos_sala (code_sala),
  CONSTRAINT fk_equipamentos_sala
    FOREIGN KEY (code_sala) REFERENCES sala (id_sala)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================
-- TABELA: Ordem_de_servico
-- status_conserto: 0=aberto, 1=concluido, 2=em andamento
-- =========================
CREATE TABLE IF NOT EXISTS chamado (
  id_chamado INT NOT NULL AUTO_INCREMENT,
  code_funcionario INT NOT NULL,
  code_equipamento INT NOT NULL,
  defeito varchar(255),
  relato VARCHAR(255),
  foto VARCHAR(255),
  status_conserto TINYINT UNSIGNED NOT NULL DEFAULT 0,
  horario TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_chamado),
  KEY idx_os_funcionario (code_funcionario),
  KEY idx_os_equipamento (code_equipamento),
  CONSTRAINT fk_os_funcionario
    FOREIGN KEY (code_funcionario) REFERENCES funcionario (id_funcionario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_os_equipamento
    FOREIGN KEY (code_equipamento) REFERENCES equipamento (id_equipamento)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;