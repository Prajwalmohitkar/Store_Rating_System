-- This is database.sql

-- Create the database

CREATE DATABASE IF NOT EXISTS store_rating_platform;

-- Use the newly created database
USE store_rating_platform;

-- Create the roles table
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE
);

-- Insert initial roles
INSERT INTO roles (role_name) VALUES
('System Administrator'),
('Normal User'),
('Store Owner')
ON DUPLICATE KEY UPDATE role_name = role_name;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400) NOT NULL,
  role_id INT NOT NULL,
  CONSTRAINT chk_name_length CHECK (LENGTH(name) >= 20),
  FOREIGN KEY (role_id) REFERENCES roles (id)
);

-- Create the stores table
CREATE TABLE IF NOT EXISTS stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  address VARCHAR(400) NOT NULL,
  owner_id INT NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users (id)
);

-- Create the ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (store_id) REFERENCES stores (id),
  UNIQUE KEY unique_user_store (user_id, store_id) -- Ensures a user can only rate a store once
);

-- Index for sorting and filtering
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_name ON users (name);
CREATE INDEX idx_stores_name ON stores (name);
CREATE INDEX idx_stores_address ON stores (address);
CREATE INDEX idx_ratings_store_id ON ratings (store_id);

-- Sample Data (for quick testing)

-- Insert a System Administrator
INSERT INTO users (name, email, password, address, role_id) VALUES
('System Administrator Name', 'admin@example.com', '$2b$10$iEuZj2M07AqZvnh5j2xF.eLY.cYL9zUcSxKh7mLzmDYsbZUkfO4La', 'Admin Address', (SELECT id FROM roles WHERE role_name = 'System Administrator'));

-- Insert a Store Owner
INSERT INTO users (name, email, password, address, role_id) VALUES
('Store Owner User Name', 'owner@example.com', '$2b$10$iEuZj2M07AqZvnh5j2xF.eLY.cYL9zUcSxKh7mLzmDYsbZUkfO4La', 'Store Owner Address', (SELECT id FROM roles WHERE role_name = 'Store Owner'));

-- Insert a Normal User
INSERT INTO users (name, email, password, address, role_id) VALUES
('Normal User Account Name', 'user@example.com', '$2b$10$iEuZj2M07AqZvnh5j2xF.eLY.cYL9zUcSxKh7mLzmDYsbZUkfO4La', 'Normal User Address', (SELECT id FROM roles WHERE role_name = 'Normal User'));

-- Insert a sample store
INSERT INTO stores (name, address, owner_id) VALUES
('Super Store', '123 Main Street, Anytown', (SELECT id FROM users WHERE email = 'owner@example.com'));

-- Insert a sample rating
INSERT INTO ratings (user_id, store_id, rating) VALUES
((SELECT id FROM users WHERE email = 'user@example.com'), (SELECT id FROM stores WHERE name = 'Super Store'), 5);
