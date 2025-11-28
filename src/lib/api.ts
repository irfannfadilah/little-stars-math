// API Client untuk koneksi ke backend MySQL
// Ubah API_BASE_URL sesuai dengan URL backend Anda

// LOKASI PENTING: Ubah URL ini untuk mengarah ke backend Anda
export const API_BASE_URL = 'http://localhost:3001/api';

// Fungsi helper untuk menyimpan dan mengambil token
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// Fungsi helper untuk membuat request ke API
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Terjadi kesalahan');
  }

  return response.json();
};

// API Functions

// Auth
export const login = async (email: string, password: string) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const getCurrentUser = async () => {
  return apiRequest('/auth/me');
};

export const logout = async () => {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    removeAuthToken();
  }
};

// Materi
export const getAllMateri = async () => {
  return apiRequest('/materi');
};

export const getMateriById = async (id: number) => {
  return apiRequest(`/materi/${id}`);
};

export const createMateri = async (data: { judul: string; deskripsi: string; isi_materi: string }) => {
  return apiRequest('/materi', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateMateri = async (id: number, data: { judul: string; deskripsi: string; isi_materi: string }) => {
  return apiRequest(`/materi/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteMateri = async (id: number) => {
  return apiRequest(`/materi/${id}`, {
    method: 'DELETE',
  });
};

// Latihan
export const getAllLatihan = async (tingkatKesulitan?: string) => {
  const query = tingkatKesulitan ? `?tingkat_kesulitan=${tingkatKesulitan}` : '';
  return apiRequest(`/latihan${query}`);
};

export const getLatihanById = async (id: number) => {
  return apiRequest(`/latihan/${id}`);
};

export const createLatihan = async (data: { 
  judul: string; 
  pertanyaan: string; 
  jawaban_benar: string; 
  tingkat_kesulitan: string 
}) => {
  return apiRequest('/latihan', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateLatihan = async (id: number, data: { 
  judul: string; 
  pertanyaan: string; 
  jawaban_benar: string; 
  tingkat_kesulitan: string 
}) => {
  return apiRequest(`/latihan/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteLatihan = async (id: number) => {
  return apiRequest(`/latihan/${id}`, {
    method: 'DELETE',
  });
};

// Aktivitas
export const getAllAktivitas = async () => {
  return apiRequest('/aktivitas');
};

export const getUserAktivitas = async (userId: number) => {
  return apiRequest(`/aktivitas/user/${userId}`);
};

export const createAktivitas = async (data: { jenis_aktivitas: string; deskripsi: string }) => {
  return apiRequest('/aktivitas', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
