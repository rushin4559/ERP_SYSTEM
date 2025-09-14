-- erp_systemdb.sql
-- ERP System Database for core_service, search_service, autocomplete_service, export_service

-- Create database
CREATE DATABASE IF NOT EXISTS erp_systemdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE erp_systemdb;

-- ========================
-- Customer Table
-- ========================
CREATE TABLE customer (
    customer_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    vendor_code VARCHAR(100),
    phone_no VARCHAR(20),
    email_id VARCHAR(100),
    contact_person VARCHAR(255),
    PAN_NO VARCHAR(20),
    GSTN VARCHAR(20),
    state_code VARCHAR(10),
    state_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================
-- Process Table
-- ========================
CREATE TABLE process (
    process_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    process_name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================
-- Part Table
-- ========================
CREATE TABLE part (
    part_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id CHAR(36),
    process_id CHAR(36),
    loading_pattern VARCHAR(255),
    pasting VARCHAR(10),
    pattern_no INT,
    shot_blasting VARCHAR(10),
    punching VARCHAR(10),
    tempering_temp INT,
    soaking_time VARCHAR(50),
    case_depth VARCHAR(50),
    checking_location VARCHAR(255),
    cut_off_value VARCHAR(50),
    core_hardness VARCHAR(50),
    surface_hardness VARCHAR(50),
    microstructure JSON,
    name VARCHAR(255),
    no VARCHAR(255),
    material VARCHAR(255),
    weight DECIMAL(10,2),
    furnace_capacity VARCHAR(50) DEFAULT '600kg',
    batch_qty INT,
    total_part_weight DECIMAL(10,2),
    drg VARCHAR(10),
    drawing VARCHAR(255),
    broach_spline VARCHAR(10),
    anti_carb_paste VARCHAR(10),
    hard_temp INT,
    rpm INT,
    part_image VARCHAR(255),
    charge_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_part_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    CONSTRAINT fk_part_process FOREIGN KEY (process_id) REFERENCES process(process_id)
);

-- ========================
-- Useful Indexes
-- ========================
CREATE INDEX idx_customer_name ON customer(customer_name);
CREATE INDEX idx_process_name ON process(process_name);
CREATE INDEX idx_part_customer ON part(customer_id);
CREATE INDEX idx_part_process ON part(process_id);
CREATE INDEX idx_part_name ON part(name);
