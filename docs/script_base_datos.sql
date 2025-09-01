	-- Crear base de datos si no existe y usarla
	CREATE DATABASE IF NOT EXISTS healthcare_system;
	USE healthcare_system;

	-- =====================================================
	-- ELIMINAR TABLAS EN ORDEN (por si ya existen)
	-- =====================================================
	DROP TABLE IF EXISTS inventories;
	DROP TABLE IF EXISTS pharmacists;
	DROP TABLE IF EXISTS users;
	DROP TABLE IF EXISTS authorized_points;
	DROP TABLE IF EXISTS medicines;
	DROP TABLE IF EXISTS eps;

	-- =====================================================
	-- CREAR TABLAS
	-- =====================================================

	-- 1. Tabla EPS (entidad fuerte)
	CREATE TABLE eps (
		id_eps INT NOT NULL AUTO_INCREMENT UNIQUE,
		name_eps VARCHAR(100) NOT NULL UNIQUE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY(id_eps)
	);

	-- 2. Tabla Medicines (entidad fuerte)
	CREATE TABLE medicines (
		id_medicine INT NOT NULL AUTO_INCREMENT UNIQUE,
		name VARCHAR(100) NOT NULL UNIQUE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY(id_medicine)
	);

	-- 3. Tabla Authorized Points (depende de EPS)
	CREATE TABLE authorized_points (
		id_authorized_point INT NOT NULL AUTO_INCREMENT UNIQUE,
		id_eps INT NOT NULL,
		point_name VARCHAR(50) NOT NULL,
		address VARCHAR(50),
		city VARCHAR(25) NOT NULL,
		latitude DECIMAL(20,7),
		longitude DECIMAL(20,7),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY(id_authorized_point),
		FOREIGN KEY(id_eps) REFERENCES eps(id_eps)
			ON UPDATE CASCADE
			ON DELETE CASCADE
	);

	-- 4. Tabla Users (depende de EPS)
	CREATE TABLE users (
		id_user INT NOT NULL AUTO_INCREMENT UNIQUE,
		id_eps INT,
		full_name VARCHAR(100) NOT NULL,
		document_type ENUM('CC','TI','CE'),
		document_number VARCHAR(20) NOT NULL UNIQUE,
		email VARCHAR(255) NOT NULL UNIQUE,
		phone VARCHAR(50) NOT NULL,
		password_hash VARCHAR(100) NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY(id_user),
		FOREIGN KEY(id_eps) REFERENCES eps(id_eps)
			ON UPDATE CASCADE
			ON DELETE SET NULL
	);

	-- 5. Tabla Inventories (depende de Authorized Points y Medicines)
	CREATE TABLE inventories (
		id_inventory INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		id_authorized_point INT NOT NULL,
		id_medicine INT,
		quantity INT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		FOREIGN KEY(id_authorized_point) REFERENCES authorized_points(id_authorized_point)
			ON UPDATE CASCADE
			ON DELETE CASCADE,
		FOREIGN KEY(id_medicine) REFERENCES medicines(id_medicine)
			ON UPDATE CASCADE
			ON DELETE SET NULL,
		UNIQUE KEY unique_inventory (id_authorized_point, id_medicine)
	);

	-- 6. Tabla Pharmacists (depende de Authorized Points)
	CREATE TABLE pharmacists (
		id_pharmacist INT NOT NULL AUTO_INCREMENT UNIQUE,
		id_authorized_point INT,
		name VARCHAR(100) NOT NULL,
		email VARCHAR(50) NOT NULL UNIQUE,
		password_hash VARCHAR(100) NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY(id_pharmacist),
		FOREIGN KEY(id_authorized_point) REFERENCES authorized_points(id_authorized_point)
			ON UPDATE CASCADE
			ON DELETE SET NULL
	);
