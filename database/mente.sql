-- Base de datos de Mente.
SET NAMES utf8mb4;

DROP DATABASE IF EXISTS mente;
CREATE DATABASE mente CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mente;

CREATE TABLE psychologists (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  modality ENUM('Online', 'Presencial', 'Online y presencial') NOT NULL,
  city VARCHAR(100) NOT NULL,
  price DECIMAL(8, 2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_price CHECK (price > 0)
) ENGINE = InnoDB;

INSERT INTO psychologists (name, specialty, modality, city, price) VALUES
  ('Dr. Samuel Frías', 'Ansiedad y estrés', 'Online', 'La Paz, B.C.S.', 650),
  ('Dra. Mariana Cota', 'Terapia de pareja', 'Online y presencial', 'La Paz, B.C.S.', 700),
  ('Psic. Andrés Geraldo', 'Depresión', 'Presencial', 'San José del Cabo, B.C.S.', 500),
  ('Dra. Lucía Amador', 'Infantil y adolescente', 'Online y presencial', 'Cabo San Lucas, B.C.S.', 800),
  ('Psic. Fernando Lucero', 'Autoestima y duelo', 'Online', 'Ciudad Constitución, B.C.S.', 450),
  ('Dra. Valeria Meza', 'Crecimiento personal', 'Online', 'Loreto, B.C.S.', 600),
  ('Juan Carlos', 'Ansiedad', 'Online y presencial', 'Tijuana', 800);
