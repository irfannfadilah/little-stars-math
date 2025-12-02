import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/LearningCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Edit, Trash2, Users, BookOpen, LogOut } from "lucide-react";
import { toast } from "sonner";
import { 
  logout, 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  getAllLatihan,
  createLatihan,
  updateLatihan,
  deleteLatihan,
  getAllMateri,
  createMateri,
  updateMateri,
  deleteMateri
} from "@/lib/api";

interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
}

interface Question {
  id: number;
  judul: string;
  pertanyaan: string;
  jawaban_benar: number;
  tingkat_kesulitan: string;
}

interface Materi {
  id: number;
  judul: string;
  deskripsi: string;
  isi_materi: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("guru");
  const [loading, setLoading] = useState(false);

  // Guru/Users state
  const [users, setUsers] = useState<User[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userFormData, setUserFormData] = useState({
    nama: "",
    email: "",
    password: "",
    role: "guru"
  });

  // Latihan/Soal state
  const [latihanList, setLatihanList] = useState<Question[]>([]);
  const [showLatihanForm, setShowLatihanForm] = useState(false);
  const [editingLatihanId, setEditingLatihanId] = useState<number | null>(null);
  const [latihanFormData, setLatihanFormData] = useState({
    judul: "",
    pertanyaan: "",
    jawaban_benar: "",
    tingkat_kesulitan: "mudah"
  });

  // Materi state
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [showMateriForm, setShowMateriForm] = useState(false);
  const [editingMateriId, setEditingMateriId] = useState<number | null>(null);
  const [materiFormData, setMateriFormData] = useState({
    judul: "",
    deskripsi: "",
    isi_materi: ""
  });

  // Fetch semua data saat komponen mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchLatihan(),
        fetchMateri()
      ]);
    } catch (error) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error: any) {
      toast.error("Gagal memuat data guru: " + (error.message || ""));
    }
  };

  const fetchLatihan = async () => {
    try {
      const data = await getAllLatihan();
      setLatihanList(data);
    } catch (error: any) {
      toast.error("Gagal memuat data soal: " + (error.message || ""));
    }
  };

  const fetchMateri = async () => {
    try {
      const data = await getAllMateri();
      setMateriList(data);
    } catch (error: any) {
      toast.error("Gagal memuat data materi: " + (error.message || ""));
    }
  };

  // User management functions
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userFormData.nama || !userFormData.email || (!editingUserId && !userFormData.password)) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    try {
      if (editingUserId) {
        await updateUser(editingUserId, {
          nama: userFormData.nama,
          email: userFormData.email,
          role: userFormData.role,
          ...(userFormData.password && { password: userFormData.password })
        });
        toast.success("Akun guru berhasil diupdate!");
        setEditingUserId(null);
      } else {
        await createUser({
          nama: userFormData.nama,
          email: userFormData.email,
          password: userFormData.password,
          role: userFormData.role
        });
        toast.success("Akun guru berhasil dibuat!");
      }
      await fetchUsers();
    } catch (error: any) {
      toast.error("Gagal menyimpan akun: " + (error.message || ""));
    }
    
    setUserFormData({ nama: "", email: "", password: "", role: "guru" });
    setShowUserForm(false);
  };

  const handleEditUser = (user: User) => {
    setUserFormData({
      nama: user.nama,
      email: user.email,
      password: "",
      role: user.role
    });
    setEditingUserId(user.id);
    setShowUserForm(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus akun ini?")) return;
    
    try {
      await deleteUser(id);
      toast.success("Akun berhasil dihapus!");
      await fetchUsers();
    } catch (error: any) {
      toast.error("Gagal menghapus akun: " + (error.message || ""));
    }
  };

  // Latihan management functions
  const handleLatihanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!latihanFormData.judul || !latihanFormData.pertanyaan || !latihanFormData.jawaban_benar) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    try {
      const payload = {
        judul: latihanFormData.judul,
        pertanyaan: latihanFormData.pertanyaan,
        jawaban_benar: parseInt(latihanFormData.jawaban_benar),
        tingkat_kesulitan: latihanFormData.tingkat_kesulitan
      };

      if (editingLatihanId) {
        await updateLatihan(editingLatihanId, payload);
        toast.success("Soal berhasil diupdate!");
        setEditingLatihanId(null);
      } else {
        await createLatihan(payload);
        toast.success("Soal berhasil ditambahkan!");
      }
      await fetchLatihan();
    } catch (error: any) {
      toast.error("Gagal menyimpan soal: " + (error.message || ""));
    }
    
    setLatihanFormData({ judul: "", pertanyaan: "", jawaban_benar: "", tingkat_kesulitan: "mudah" });
    setShowLatihanForm(false);
  };

  const handleEditLatihan = (q: Question) => {
    setLatihanFormData({
      judul: q.judul,
      pertanyaan: q.pertanyaan,
      jawaban_benar: q.jawaban_benar.toString(),
      tingkat_kesulitan: q.tingkat_kesulitan
    });
    setEditingLatihanId(q.id);
    setShowLatihanForm(true);
  };

  const handleDeleteLatihan = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus soal ini?")) return;
    
    try {
      await deleteLatihan(id);
      toast.success("Soal berhasil dihapus!");
      await fetchLatihan();
    } catch (error: any) {
      toast.error("Gagal menghapus soal: " + (error.message || ""));
    }
  };

  // Materi management functions
  const handleMateriSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!materiFormData.judul || !materiFormData.deskripsi || !materiFormData.isi_materi) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    try {
      if (editingMateriId) {
        await updateMateri(editingMateriId, materiFormData);
        toast.success("Materi berhasil diupdate!");
        setEditingMateriId(null);
      } else {
        await createMateri(materiFormData);
        toast.success("Materi berhasil ditambahkan!");
      }
      await fetchMateri();
    } catch (error: any) {
      toast.error("Gagal menyimpan materi: " + (error.message || ""));
    }
    
    setMateriFormData({ judul: "", deskripsi: "", isi_materi: "" });
    setShowMateriForm(false);
  };

  const handleEditMateri = (m: Materi) => {
    setMateriFormData({
      judul: m.judul,
      deskripsi: m.deskripsi,
      isi_materi: m.isi_materi
    });
    setEditingMateriId(m.id);
    setShowMateriForm(true);
  };

  const handleDeleteMateri = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus materi ini?")) return;
    
    try {
      await deleteMateri(id);
      toast.success("Materi berhasil dihapus!");
      await fetchMateri();
    } catch (error: any) {
      toast.error("Gagal menghapus materi: " + (error.message || ""));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Berhasil logout!");
      navigate("/login");
    } catch (error) {
      toast.error("Gagal logout");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-secondary/10 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="lg"
            className="rounded-2xl border-2 text-xl font-bold"
          >
            <ArrowLeft className="mr-2 w-6 h-6" />
            Kembali
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            size="lg"
            className="rounded-2xl border-2 text-xl font-bold text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="mr-2 w-6 h-6" />
            Logout
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-4 text-hero">
            Dashboard Admin
          </h1>
          <p className="text-2xl text-foreground/70 font-bold">
            Kelola guru, soal, dan materi pembelajaran
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
            <TabsTrigger value="guru" className="text-lg font-bold">
              <Users className="mr-2 w-5 h-5" />
              Kelola Guru
            </TabsTrigger>
            <TabsTrigger value="soal" className="text-lg font-bold">
              <BookOpen className="mr-2 w-5 h-5" />
              Kelola Soal
            </TabsTrigger>
            <TabsTrigger value="materi" className="text-lg font-bold">
              <BookOpen className="mr-2 w-5 h-5" />
              Kelola Materi
            </TabsTrigger>
          </TabsList>

          {/* Tab Guru */}
          <TabsContent value="guru" className="space-y-6">
            <div className="mb-8">
              <Button
                onClick={() => {
                  setShowUserForm(!showUserForm);
                  setEditingUserId(null);
                  setUserFormData({ nama: "", email: "", password: "", role: "guru" });
                }}
                size="lg"
                className="w-full md:w-auto text-xl h-14 px-8 rounded-2xl font-bold bg-gradient-to-r from-primary to-secondary"
              >
                <Plus className="mr-2 w-6 h-6" />
                Tambah Akun Guru Baru
              </Button>
            </div>

            {showUserForm && (
              <LearningCard className="mb-8 bg-card/95">
                <h3 className="text-2xl font-bold mb-6 text-foreground">
                  {editingUserId ? "Edit Akun Guru" : "Tambah Akun Guru Baru"}
                </h3>
                <form onSubmit={handleUserSubmit} className="space-y-6">
                  <div>
                    <Label className="text-lg font-bold">Nama</Label>
                    <Input
                      value={userFormData.nama}
                      onChange={(e) => setUserFormData({ ...userFormData, nama: e.target.value })}
                      placeholder="Nama guru"
                      className="mt-2 h-12 text-lg rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-lg font-bold">Email</Label>
                    <Input
                      type="email"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="mt-2 h-12 text-lg rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-lg font-bold">Password {editingUserId && "(Kosongkan jika tidak ingin ubah)"}</Label>
                    <Input
                      type="password"
                      value={userFormData.password}
                      onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                      placeholder="Kata sandi"
                      className="mt-2 h-12 text-lg rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-lg font-bold">Role</Label>
                    <Select value={userFormData.role} onValueChange={(value) => setUserFormData({ ...userFormData, role: value })}>
                      <SelectTrigger className="mt-2 h-12 text-lg rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guru">Guru</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="siswa">Siswa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" size="lg" className="flex-1 h-12 text-lg rounded-xl font-bold">
                      {editingUserId ? "Update Akun" : "Simpan Akun"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setShowUserForm(false);
                        setEditingUserId(null);
                        setUserFormData({ nama: "", email: "", password: "", role: "guru" });
                      }}
                      className="flex-1 h-12 text-lg rounded-xl font-bold"
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </LearningCard>
            )}

            <div className="space-y-4">
              <h2 className="text-3xl font-black text-foreground mb-6">
                Daftar Guru ({users.filter(u => u.role === 'guru').length})
              </h2>
              {users.filter(u => u.role === 'guru').map((user) => (
                <LearningCard key={user.id} className="bg-card/95">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-foreground">{user.nama}</p>
                      <p className="text-lg text-foreground/60">{user.email}</p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <Button
                        onClick={() => handleEditUser(user)}
                        variant="outline"
                        size="lg"
                        className="rounded-xl font-bold"
                      >
                        <Edit className="w-5 h-5 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteUser(user.id)}
                        variant="outline"
                        size="lg"
                        className="rounded-xl font-bold text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </LearningCard>
              ))}
              {users.filter(u => u.role === 'guru').length === 0 && (
                <LearningCard className="bg-card/95 text-center py-8">
                  <p className="text-2xl font-bold text-foreground">Belum ada guru</p>
                </LearningCard>
              )}
            </div>
          </TabsContent>

          {/* Tab Soal */}
          <TabsContent value="soal" className="space-y-6">
            <div className="mb-8">
              <Button
                onClick={() => {
                  setShowLatihanForm(!showLatihanForm);
                  setEditingLatihanId(null);
                  setLatihanFormData({ judul: "", pertanyaan: "", jawaban_benar: "", tingkat_kesulitan: "mudah" });
                }}
                size="lg"
                className="w-full md:w-auto text-xl h-14 px-8 rounded-2xl font-bold bg-gradient-to-r from-primary to-secondary"
              >
                <Plus className="mr-2 w-6 h-6" />
                Tambah Soal Baru
              </Button>
            </div>

            {showLatihanForm && (
              <LearningCard className="mb-8 bg-card/95">
                <h3 className="text-2xl font-bold mb-6 text-foreground">
                  {editingLatihanId ? "Edit Soal" : "Tambah Soal Baru"}
                </h3>
                <form onSubmit={handleLatihanSubmit} className="space-y-6">
                  <div>
                    <Label className="text-lg font-bold">Judul Soal</Label>
                    <Input
                      value={latihanFormData.judul}
                      onChange={(e) => setLatihanFormData({ ...latihanFormData, judul: e.target.value })}
                      placeholder="Soal Penjumlahan 1"
                      className="mt-2 h-12 text-lg rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-lg font-bold">Pertanyaan</Label>
                    <Input
                      value={latihanFormData.pertanyaan}
                      onChange={(e) => setLatihanFormData({ ...latihanFormData, pertanyaan: e.target.value })}
                      placeholder="3 + 2 = ?"
                      className="mt-2 h-12 text-lg rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-lg font-bold">Jawaban (angka)</Label>
                    <Input
                      type="number"
                      value={latihanFormData.jawaban_benar}
                      onChange={(e) => setLatihanFormData({ ...latihanFormData, jawaban_benar: e.target.value })}
                      placeholder="5"
                      className="mt-2 h-12 text-lg rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-lg font-bold">Level Kesulitan</Label>
                    <Select value={latihanFormData.tingkat_kesulitan} onValueChange={(value) => setLatihanFormData({ ...latihanFormData, tingkat_kesulitan: value })}>
                      <SelectTrigger className="mt-2 h-12 text-lg rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mudah">Mudah</SelectItem>
                        <SelectItem value="sedang">Sedang</SelectItem>
                        <SelectItem value="sulit">Sulit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" size="lg" className="flex-1 h-12 text-lg rounded-xl font-bold">
                      {editingLatihanId ? "Update Soal" : "Simpan Soal"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setShowLatihanForm(false);
                        setEditingLatihanId(null);
                        setLatihanFormData({ judul: "", pertanyaan: "", jawaban_benar: "", tingkat_kesulitan: "mudah" });
                      }}
                      className="flex-1 h-12 text-lg rounded-xl font-bold"
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </LearningCard>
            )}

            <div className="space-y-4">
              <h2 className="text-3xl font-black text-foreground mb-6">
                Daftar Soal ({latihanList.length})
              </h2>
              {latihanList.map((q) => (
                <LearningCard key={q.id} className="bg-card/95">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                          q.tingkat_kesulitan === "mudah" ? "bg-green-100 text-green-700" :
                          q.tingkat_kesulitan === "sedang" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {q.tingkat_kesulitan.charAt(0).toUpperCase() + q.tingkat_kesulitan.slice(1)}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-foreground mb-2">{q.judul}</p>
                      <p className="text-2xl font-bold text-foreground">{q.pertanyaan}</p>
                      <p className="text-lg text-muted-foreground mt-2">
                        Jawaban: <span className="font-bold text-foreground">{q.jawaban_benar}</span>
                      </p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <Button
                        onClick={() => handleEditLatihan(q)}
                        variant="outline"
                        size="lg"
                        className="rounded-xl font-bold"
                      >
                        <Edit className="w-5 h-5 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteLatihan(q.id)}
                        variant="outline"
                        size="lg"
                        className="rounded-xl font-bold text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </LearningCard>
              ))}
              {latihanList.length === 0 && (
                <LearningCard className="bg-card/95 text-center py-8">
                  <p className="text-2xl font-bold text-foreground">Belum ada soal</p>
                </LearningCard>
              )}
            </div>
          </TabsContent>

          {/* Tab Materi */}
          <TabsContent value="materi" className="space-y-6">
            <div className="mb-8">
              <Button
                onClick={() => {
                  setShowMateriForm(!showMateriForm);
                  setEditingMateriId(null);
                  setMateriFormData({ judul: "", deskripsi: "", isi_materi: "" });
                }}
                size="lg"
                className="w-full md:w-auto text-xl h-14 px-8 rounded-2xl font-bold bg-gradient-to-r from-primary to-secondary"
              >
                <Plus className="mr-2 w-6 h-6" />
                Tambah Materi Baru
              </Button>
            </div>

            {showMateriForm && (
              <LearningCard className="mb-8 bg-card/95">
                <h3 className="text-2xl font-bold mb-6 text-foreground">
                  {editingMateriId ? "Edit Materi" : "Tambah Materi Baru"}
                </h3>
                <form onSubmit={handleMateriSubmit} className="space-y-6">
                  <div>
                    <Label className="text-lg font-bold">Judul Materi</Label>
                    <Input
                      value={materiFormData.judul}
                      onChange={(e) => setMateriFormData({ ...materiFormData, judul: e.target.value })}
                      placeholder="Belajar Penjumlahan"
                      className="mt-2 h-12 text-lg rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-lg font-bold">Deskripsi</Label>
                    <Textarea
                      value={materiFormData.deskripsi}
                      onChange={(e) => setMateriFormData({ ...materiFormData, deskripsi: e.target.value })}
                      placeholder="Deskripsi singkat materi"
                      className="mt-2 text-lg rounded-xl min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label className="text-lg font-bold">Isi Materi</Label>
                    <Textarea
                      value={materiFormData.isi_materi}
                      onChange={(e) => setMateriFormData({ ...materiFormData, isi_materi: e.target.value })}
                      placeholder="Tulis isi materi di sini..."
                      className="mt-2 text-lg rounded-xl min-h-[200px]"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" size="lg" className="flex-1 h-12 text-lg rounded-xl font-bold">
                      {editingMateriId ? "Update Materi" : "Simpan Materi"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setShowMateriForm(false);
                        setEditingMateriId(null);
                        setMateriFormData({ judul: "", deskripsi: "", isi_materi: "" });
                      }}
                      className="flex-1 h-12 text-lg rounded-xl font-bold"
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </LearningCard>
            )}

            <div className="space-y-4">
              <h2 className="text-3xl font-black text-foreground mb-6">
                Daftar Materi ({materiList.length})
              </h2>
              {materiList.map((m) => (
                <LearningCard key={m.id} className="bg-card/95">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-foreground mb-2">{m.judul}</p>
                      <p className="text-lg text-foreground/70 mb-3">{m.deskripsi}</p>
                      <p className="text-base text-foreground/60 line-clamp-3">{m.isi_materi}</p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <Button
                        onClick={() => handleEditMateri(m)}
                        variant="outline"
                        size="lg"
                        className="rounded-xl font-bold"
                      >
                        <Edit className="w-5 h-5 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteMateri(m.id)}
                        variant="outline"
                        size="lg"
                        className="rounded-xl font-bold text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </LearningCard>
              ))}
              {materiList.length === 0 && (
                <LearningCard className="bg-card/95 text-center py-8">
                  <p className="text-2xl font-bold text-foreground">Belum ada materi</p>
                </LearningCard>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
