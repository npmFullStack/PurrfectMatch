-- database.sql
CREATE DATABASE IF NOT EXISTS purrfectmatch;
USE purrfectmatch;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar VARCHAR(255) DEFAULT 'avatarDefault.png',
  bio TEXT,
  phone_number VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  zip_code VARCHAR(20),
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  facebook_id VARCHAR(255) UNIQUE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verification_expires DATETIME,
  reset_password_token VARCHAR(255),
  reset_password_expires DATETIME,
  profile_setup_completed BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP NULL,
  login_count INT DEFAULT 0,
  account_status ENUM('active', 'suspended', 'deactivated') DEFAULT 'active',
  role ENUM('user', 'admin', 'moderator') DEFAULT 'user',
  preferences JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_google_id (google_id),
  INDEX idx_facebook_id (facebook_id),
  INDEX idx_account_status (account_status),
  INDEX idx_created_at (created_at),
  INDEX idx_profile_setup (profile_setup_completed)
);

