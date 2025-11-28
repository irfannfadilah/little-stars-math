-- Database Setup untuk Aplikasi Pembelajaran Numerasi
-- Jalankan query ini di phpMyAdmin

-- 1. Buat database (jika belum ada)
CREATE DATABASE IF NOT EXISTS numerasi_db;
USE numerasi_db;

-- 2. Tabel Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, 
    role ENUM('admin', 'guru') NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Materi
CREATE TABLE materi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    isi_materi TEXT NOT NULL, 
    id_guru INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_guru) REFERENCES users(id)
);

-- 4. Tabel Latihan
CREATE TABLE latihan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    pertanyaan TEXT NOT NULL,
    jawaban_benar VARCHAR(255) NOT NULL,
    tingkat_kesulitan ENUM('mudah', 'sedang', 'sulit') NOT NULL,
    id_guru INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_guru) REFERENCES users(id)
);

-- 5. Tabel Aktivitas Log
CREATE TABLE aktivitas_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT, 
    jenis_aktivitas VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    waktu_aktivitas TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id)
);

-- 6. Insert data awal untuk testing
INSERT INTO users (nama, email, password_hash, role) VALUES 
('Admin', 'admin@mail.com', 'admin123', 'admin'),
('Guru Kelas 1A', 'guru@mail.com', 'guru123', 'guru');

-- Selesai! Database siap digunakan.
