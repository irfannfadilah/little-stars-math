# Backend API - Aplikasi Pembelajaran Numerasi

Backend REST API menggunakan Node.js, Express, dan MySQL.

## 📋 Persiapan

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database MySQL
Buat database baru di phpMyAdmin dan jalankan query SQL berikut:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, 
    role ENUM('admin', 'guru') NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE aktivitas_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT, 
    jenis_aktivitas VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    waktu_aktivitas TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id)
);

INSERT INTO users (nama, email, password_hash, role) VALUES 
('Admin', 'admin@mail.com', 'admin123', 'admin'),
('Guru Kelas 1A', 'guru@mail.com', 'guru123', 'guru');
```

### 3. Konfigurasi Environment
Copy file `.env.example` menjadi `.env` dan sesuaikan dengan konfigurasi database Anda:

```bash
cp .env.example .env
```

Edit file `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=numerasi_db
PORT=3001
JWT_SECRET=your_secret_key_here
```

## 🚀 Menjalankan Server

### Development (dengan auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

Server akan berjalan di `http://localhost:3001`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Materi
- `GET /api/materi` - Get all materi
- `GET /api/materi/:id` - Get single materi
- `POST /api/materi` - Create materi (guru/admin only)
- `PUT /api/materi/:id` - Update materi (guru/admin only)
- `DELETE /api/materi/:id` - Delete materi (guru/admin only)

### Latihan
- `GET /api/latihan` - Get all latihan
- `GET /api/latihan/:id` - Get single latihan
- `POST /api/latihan` - Create latihan (guru/admin only)
- `PUT /api/latihan/:id` - Update latihan (guru/admin only)
- `DELETE /api/latihan/:id` - Delete latihan (guru/admin only)

### Aktivitas Log
- `GET /api/aktivitas` - Get all aktivitas (admin only)
- `GET /api/aktivitas/user/:userId` - Get user aktivitas
- `POST /api/aktivitas` - Create aktivitas log

## 📝 Contoh Request & Response

### Login
**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@mail.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nama": "Admin",
    "email": "admin@mail.com",
    "role": "admin"
  }
}
```

### Create Materi
**Request:**
```bash
POST /api/materi
Authorization: Bearer <token>
Content-Type: application/json

{
  "judul": "Belajar Angka 1-10",
  "deskripsi": "Pengenalan angka dasar",
  "isi_materi": "Mari belajar menghitung dari 1 sampai 10..."
}
```

**Response:**
```json
{
  "id": 1,
  "message": "Materi berhasil ditambahkan"
}
```

### Get All Latihan
**Request:**
```bash
GET /api/latihan?tingkat_kesulitan=mudah
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "judul": "Penjumlahan Dasar",
    "pertanyaan": "1 + 1 = ?",
    "jawaban_benar": "2",
    "tingkat_kesulitan": "mudah",
    "id_guru": 2,
    "nama_guru": "Guru Kelas 1A",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

## 🔐 Authentication

Semua endpoint (kecuali login) memerlukan JWT token di header:
```
Authorization: Bearer <your_token>
```

## 🌐 Deploy ke Hosting

### Deploy ke VPS/Dedicated Server
1. Upload folder `backend` ke server
2. Install Node.js di server
3. Install dependencies: `npm install`
4. Setup database MySQL di server
5. Konfigurasi `.env` sesuai server
6. Jalankan dengan PM2 (recommended):
```bash
npm install -g pm2
pm2 start server.js --name numerasi-api
pm2 save
pm2 startup
```

### Deploy ke Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create nama-app`
4. Add MySQL addon: `heroku addons:create jawsdb`
5. Deploy: `git push heroku main`

### Deploy ke Railway/Render
1. Push code ke GitHub
2. Connect repository di Railway/Render
3. Add environment variables
4. Deploy automatically

## 🔧 Troubleshooting

**Error: Cannot connect to database**
- Pastikan MySQL server berjalan
- Cek konfigurasi di `.env`
- Pastikan database sudah dibuat

**Error: JWT token invalid**
- Pastikan JWT_SECRET sudah di set di `.env`
- Cek format Authorization header

**Error: Port already in use**
- Ubah PORT di `.env`
- Atau stop process yang menggunakan port tersebut
