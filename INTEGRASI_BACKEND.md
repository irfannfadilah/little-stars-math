# 📘 Panduan Integrasi Backend MySQL dengan Frontend Lovable

## 🎯 Ringkasan
Frontend tetap menggunakan React + Vite dari Lovable, tetapi backend dan database menggunakan server MySQL Anda sendiri dengan Node.js + Express.

---

## 📂 Struktur Folder Lengkap

```
project-root/
├── backend/                     # Backend Node.js + Express
│   ├── config/
│   │   └── db.js               # Koneksi database MySQL
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js             # Login endpoint
│   │   ├── materi.js           # CRUD materi
│   │   ├── latihan.js          # CRUD latihan
│   │   └── aktivitas.js        # Log aktivitas
│   ├── .env                    # Konfigurasi database (JANGAN UPLOAD KE GIT!)
│   ├── .env.example            # Template untuk .env
│   ├── package.json            # Dependencies backend
│   ├── server.js               # Entry point backend
│   ├── setup.sql               # SQL untuk setup database
│   └── README.md               # Dokumentasi backend
│
├── src/                        # Frontend React (dari Lovable)
│   ├── lib/
│   │   └── api.ts              # ⚠️ FILE PENTING - API client untuk koneksi ke backend
│   ├── pages/
│   │   ├── Login.tsx           # ✅ Sudah diupdate untuk pakai backend
│   │   ├── Admin.tsx           # ✅ Sudah diupdate untuk pakai backend
│   │   └── Teacher.tsx         # ✅ Sudah diupdate untuk pakai backend
│   └── components/
│       └── ProtectedRoute.tsx  # ✅ Sudah diupdate untuk pakai backend
```

---

## 🚀 Cara Menjalankan

### 1. Setup Database MySQL
1. Buka phpMyAdmin
2. Buat database baru: `numerasi_db`
3. Jalankan SQL dari file `backend/setup.sql`

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edit file `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=numerasi_db
PORT=3001
JWT_SECRET=ganti_dengan_secret_key_anda
```

Jalankan backend:
```bash
npm run dev
```

Backend akan berjalan di `http://localhost:3001`

### 3. Setup Frontend
```bash
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:8080` atau port lain dari Vite.

---

## 🔧 Konfigurasi API Base URL

**⚠️ LOKASI PENTING: File `src/lib/api.ts` baris 4**

```typescript
export const API_BASE_URL = 'http://localhost:3001/api';
```

### Untuk Production / Hosting:
Ubah menjadi URL backend Anda:
```typescript
export const API_BASE_URL = 'https://api.yoursite.com/api';
```

---

## 📡 Daftar Endpoint API

### Authentication
| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get user info | ✅ |
| POST | `/api/auth/logout` | Logout user | ✅ |

### Materi
| Method | Endpoint | Deskripsi | Auth Required | Role |
|--------|----------|-----------|---------------|------|
| GET | `/api/materi` | Get all materi | ✅ | All |
| GET | `/api/materi/:id` | Get single materi | ✅ | All |
| POST | `/api/materi` | Create materi | ✅ | Guru, Admin |
| PUT | `/api/materi/:id` | Update materi | ✅ | Guru, Admin |
| DELETE | `/api/materi/:id` | Delete materi | ✅ | Guru, Admin |

### Latihan
| Method | Endpoint | Deskripsi | Auth Required | Role |
|--------|----------|-----------|---------------|------|
| GET | `/api/latihan` | Get all latihan | ✅ | All |
| GET | `/api/latihan/:id` | Get single latihan | ✅ | All |
| POST | `/api/latihan` | Create latihan | ✅ | Guru, Admin |
| PUT | `/api/latihan/:id` | Update latihan | ✅ | Guru, Admin |
| DELETE | `/api/latihan/:id` | Delete latihan | ✅ | Guru, Admin |

### Aktivitas Log
| Method | Endpoint | Deskripsi | Auth Required | Role |
|--------|----------|-----------|---------------|------|
| GET | `/api/aktivitas` | Get all aktivitas | ✅ | Admin |
| GET | `/api/aktivitas/user/:id` | Get user aktivitas | ✅ | Owner/Admin |
| POST | `/api/aktivitas` | Create log | ✅ | All |

---

## 📝 Contoh Penggunaan dari Frontend

File `src/lib/api.ts` sudah menyediakan fungsi-fungsi berikut:

### Login
```typescript
import { login, setAuthToken } from '@/lib/api';

const handleLogin = async () => {
  const response = await login('admin@mail.com', 'admin123');
  setAuthToken(response.token);
  console.log(response.user); // { id, nama, email, role }
};
```

### Get All Materi
```typescript
import { getAllMateri } from '@/lib/api';

const fetchMateri = async () => {
  const materi = await getAllMateri();
  console.log(materi);
};
```

### Create Latihan
```typescript
import { createLatihan } from '@/lib/api';

const addLatihan = async () => {
  await createLatihan({
    judul: 'Penjumlahan 1-10',
    pertanyaan: '5 + 3 = ?',
    jawaban_benar: '8',
    tingkat_kesulitan: 'mudah'
  });
};
```

---

## 🔐 Cara Kerja Authentication

1. **Login** → Mendapat JWT token
2. **Token disimpan** di localStorage
3. **Setiap request** → Token dikirim di header `Authorization: Bearer <token>`
4. **Backend verify** token sebelum eksekusi endpoint
5. **Logout** → Token dihapus dari localStorage

---

## 🌐 Deploy ke Hosting

### Backend (VPS/Cloud Server)
1. Upload folder `backend` ke server
2. Install Node.js di server
3. Install dependencies: `npm install`
4. Setup MySQL database
5. Edit `.env` dengan konfigurasi server
6. Jalankan dengan PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name numerasi-api
   pm2 save
   pm2 startup
   ```

### Frontend (Netlify/Vercel/Static Hosting)
1. Build frontend: `npm run build`
2. Upload folder `dist` ke hosting
3. **PENTING:** Ubah `API_BASE_URL` di `src/lib/api.ts` ke URL backend production

---

## 🔍 File-File yang Sudah Diubah untuk Integrasi

✅ **File baru yang ditambahkan:**
- `src/lib/api.ts` - API client utama
- `backend/*` - Semua file backend

✅ **File yang diupdate:**
- `src/pages/Login.tsx` - Menggunakan API backend
- `src/components/ProtectedRoute.tsx` - Validasi menggunakan backend
- `src/pages/Admin.tsx` - Logout menggunakan backend
- `src/pages/Teacher.tsx` - Logout menggunakan backend

---

## ⚙️ Environment Variables

### Backend (`.env`)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=numerasi_db
PORT=3001
JWT_SECRET=your_secret_key_here
```

### Frontend
Tidak perlu .env khusus. Ubah langsung di `src/lib/api.ts`:
```typescript
export const API_BASE_URL = 'http://localhost:3001/api';
```

---

## 🧪 Testing API dengan Postman/Thunder Client

### Login
```http
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "admin@mail.com",
  "password": "admin123"
}
```

### Get Materi (dengan token)
```http
GET http://localhost:3001/api/materi
Authorization: Bearer <your_token_here>
```

---

## 🆘 Troubleshooting

### Error: CORS blocked
Pastikan backend sudah menggunakan `cors()` middleware (sudah ada di `server.js`)

### Error: Cannot connect to database
- Cek MySQL server sudah berjalan
- Cek konfigurasi di `.env`
- Cek database `numerasi_db` sudah dibuat

### Frontend tidak bisa koneksi ke backend
- Pastikan backend berjalan di `http://localhost:3001`
- Cek `API_BASE_URL` di `src/lib/api.ts`
- Cek console browser untuk error detail

### Token invalid
- Pastikan `JWT_SECRET` di `.env` sudah di-set
- Cek format Authorization header: `Bearer <token>`

---

## 📞 Support

Untuk pertanyaan lebih lanjut, silakan:
1. Cek file `backend/README.md` untuk dokumentasi backend
2. Cek console browser untuk error frontend
3. Cek log server untuk error backend

---

## ✅ Checklist Deployment

**Backend:**
- [ ] Database MySQL sudah setup
- [ ] File `.env` sudah dikonfigurasi
- [ ] Dependencies sudah diinstall
- [ ] Backend berjalan tanpa error
- [ ] Test semua endpoint dengan Postman

**Frontend:**
- [ ] `API_BASE_URL` sudah diubah ke production URL
- [ ] Test login berhasil
- [ ] Test CRUD materi/latihan berhasil
- [ ] Build frontend berhasil: `npm run build`
- [ ] Upload `dist` folder ke hosting

---

**🎉 Selamat! Integrasi backend MySQL dengan frontend Lovable sudah selesai!**
