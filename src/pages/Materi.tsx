import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/LearningCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, LogOut } from "lucide-react";
import { toast } from "sonner";
import { logout, getAllMateri, createMateri, updateMateri, deleteMateri } from "@/lib/api";

interface Materi {
  id: number;
  judul: string;
  deskripsi: string;
  isi_materi: string;
  nama_guru?: string;
}

const MateriPage = () => {
  const navigate = useNavigate();
  const [materies, setMateries] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    isi_materi: "",
  });

  // Fetch materi dari API saat komponen mount
  useEffect(() => {
    fetchMateries();
  }, []);

  const fetchMateries = async () => {
    try {
      setLoading(true);
      const data = await getAllMateri();
      setMateries(data);
    } catch (error: any) {
      toast.error("Gagal memuat materi: " + (error.message || ""));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.judul || !formData.deskripsi || !formData.isi_materi) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    try {
      const payload = {
        judul: formData.judul,
        deskripsi: formData.deskripsi,
        isi_materi: formData.isi_materi,
      };

      if (editingId) {
        await updateMateri(editingId, payload);
        toast.success("Materi berhasil diupdate!");
      } else {
        await createMateri(payload);
        toast.success("Materi berhasil ditambahkan!");
      }

      // Refresh list
      await fetchMateries();
      setEditingId(null);
    } catch (error: any) {
      toast.error("Gagal menyimpan materi: " + (error.message || ""));
      console.error(error);
      return;
    }

    setFormData({ judul: "", deskripsi: "", isi_materi: "" });
    setShowForm(false);
  };

  const handleEdit = (m: Materi) => {
    setFormData({
      judul: m.judul,
      deskripsi: m.deskripsi,
      isi_materi: m.isi_materi,
    });
    setEditingId(m.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus materi ini?")) return;
    
    try {
      await deleteMateri(id);
      toast.success("Materi berhasil dihapus!");
      await fetchMateries();
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
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 via-background to-primary/10 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => navigate("/teacher")}
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
            Kelola Materi 📚
          </h1>
          <p className="text-2xl text-foreground/70 font-bold">
            Tambah, edit, dan hapus materi pembelajaran
          </p>
        </div>

        <div className="mb-8">
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ judul: "", deskripsi: "", isi_materi: "" });
            }}
            size="lg"
            className="w-full md:w-auto text-xl h-14 px-8 rounded-2xl font-bold bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all"
          >
            <Plus className="mr-2 w-6 h-6" />
            Tambah Materi Baru
          </Button>
        </div>

        {showForm && (
          <LearningCard className="mb-8 bg-card/95">
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              {editingId ? "Edit Materi" : "Tambah Materi Baru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-lg font-bold">Judul Materi</Label>
                <Input
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Belajar Penjumlahan"
                  className="mt-2 h-12 text-lg rounded-xl"
                />
              </div>

              <div>
                <Label className="text-lg font-bold">Deskripsi</Label>
                <Textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Contoh: Materi tentang penjumlahan bilangan 1-10"
                  className="mt-2 text-lg rounded-xl min-h-[100px]"
                />
              </div>

              <div>
                <Label className="text-lg font-bold">Isi Materi</Label>
                <Textarea
                  value={formData.isi_materi}
                  onChange={(e) => setFormData({ ...formData, isi_materi: e.target.value })}
                  placeholder="Tulis isi materi di sini..."
                  className="mt-2 text-lg rounded-xl min-h-[200px]"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 h-12 text-lg rounded-xl font-bold"
                >
                  {editingId ? "Update Materi" : "Simpan Materi"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ judul: "", deskripsi: "", isi_materi: "" });
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
          <h2 className="text-3xl font-black text-foreground mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            Daftar Materi ({materies.length})
          </h2>

          {loading && (
            <LearningCard className="bg-card/95 text-center py-8">
              <p className="text-2xl font-bold text-foreground">Memuat materi...</p>
            </LearningCard>
          )}
          
          {materies.map((m) => (
            <LearningCard key={m.id} className="bg-card/95">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-2xl font-bold text-foreground mb-2">{m.judul}</p>
                  <p className="text-lg text-foreground/70 mb-3">{m.deskripsi}</p>
                  <p className="text-base text-foreground/60 line-clamp-3">{m.isi_materi}</p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    onClick={() => handleEdit(m)}
                    size="lg"
                    variant="outline"
                    className="rounded-xl font-bold text-lg px-6"
                  >
                    <Edit className="mr-2 w-5 h-5" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(m.id)}
                    size="lg"
                    variant="outline"
                    className="rounded-xl font-bold text-lg px-6 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="mr-2 w-5 h-5" />
                    Hapus
                  </Button>
                </div>
              </div>
            </LearningCard>
          ))}

          {!loading && materies.length === 0 && (
            <LearningCard className="bg-card/95 text-center py-12">
              <p className="text-2xl font-bold text-foreground">Belum ada materi</p>
              <p className="text-lg text-foreground/70 mt-2">Tambahkan materi baru untuk memulai</p>
            </LearningCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default MateriPage;
