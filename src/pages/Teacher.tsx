import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/LearningCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, LogOut } from "lucide-react";
import { toast } from "sonner";
import { logout, getAllLatihan, createLatihan, updateLatihan, deleteLatihan } from "@/lib/api";

interface Question {
  id: number;
  judul: string;
  pertanyaan: string;
  jawaban_benar: number;
  tingkat_kesulitan: string;
}

const Teacher = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    judul: "",
    pertanyaan: "",
    jawaban_benar: "",
    tingkat_kesulitan: "mudah"
  });

  // Fetch latihan dari API saat komponen mount
  useEffect(() => {
    fetchLatihan();
  }, []);

  const fetchLatihan = async () => {
    try {
      setLoading(true);
      const data = await getAllLatihan();
      setQuestions(data);
    } catch (error: any) {
      toast.error("Gagal memuat latihan: " + (error.message || ""));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.judul || !formData.pertanyaan || !formData.jawaban_benar) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    try {
      const payload = {
        judul: formData.judul,
        pertanyaan: formData.pertanyaan,
        jawaban_benar: parseInt(formData.jawaban_benar),
        tingkat_kesulitan: formData.tingkat_kesulitan,
      };

      if (editingId) {
        await updateLatihan(editingId, payload);
        toast.success("Soal berhasil diupdate!");
      } else {
        await createLatihan(payload);
        toast.success("Soal berhasil ditambahkan!");
      }

      // Refresh list
      await fetchLatihan();
      setEditingId(null);
    } catch (error: any) {
      toast.error("Gagal menyimpan soal: " + (error.message || ""));
      console.error(error);
      return;
    }

    setFormData({ judul: "", pertanyaan: "", jawaban_benar: "", tingkat_kesulitan: "mudah" });
    setShowForm(false);
  };

  const handleEdit = (q: Question) => {
    setFormData({
      judul: q.judul,
      pertanyaan: q.pertanyaan,
      jawaban_benar: q.jawaban_benar.toString(),
      tingkat_kesulitan: q.tingkat_kesulitan
    });
    setEditingId(q.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus soal ini?")) return;
    
    try {
      await deleteLatihan(id);
      toast.success("Soal berhasil dihapus!");
      await fetchLatihan();
    } catch (error: any) {
      toast.error("Gagal menghapus soal: " + (error.message || ""));
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
            onClick={() => navigate("/")}
            variant="outline"
            size="lg"
            className="rounded-2xl border-2 text-xl font-bold"
          >
            <ArrowLeft className="mr-2 w-6 h-6" />
            Kembali
          </Button>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/materi")}
              variant="outline"
              size="lg"
              className="rounded-2xl border-2 text-xl font-bold"
            >
              Kelola Materi
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
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-4 text-hero">
            Dashboard Guru
          </h1>
          <p className="text-2xl text-foreground/70 font-bold">
            Kelola soal latihan untuk siswa
          </p>
        </div>

        <div className="mb-8">
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ judul: "", pertanyaan: "", jawaban_benar: "", tingkat_kesulitan: "mudah" });
            }}
            size="lg"
            className="w-full md:w-auto text-xl h-14 px-8 rounded-2xl font-bold bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all"
          >
            <Plus className="mr-2 w-6 h-6" />
            Tambah Soal Baru
          </Button>
        </div>

        {showForm && (
          <LearningCard className="mb-8 bg-card/95">
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              {editingId ? "Edit Soal" : "Tambah Soal Baru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-lg font-bold">Judul Soal</Label>
                <Input
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Soal Penjumlahan 1"
                  className="mt-2 h-12 text-lg rounded-xl"
                />
              </div>

              <div>
                <Label className="text-lg font-bold">Pertanyaan</Label>
                <Input
                  value={formData.pertanyaan}
                  onChange={(e) => setFormData({ ...formData, pertanyaan: e.target.value })}
                  placeholder="Contoh: 3 + 2 = ?"
                  className="mt-2 h-12 text-lg rounded-xl"
                />
              </div>

              <div>
                <Label className="text-lg font-bold">Jawaban (angka)</Label>
                <Input
                  type="number"
                  value={formData.jawaban_benar}
                  onChange={(e) => setFormData({ ...formData, jawaban_benar: e.target.value })}
                  placeholder="Contoh: 5"
                  className="mt-2 h-12 text-lg rounded-xl"
                />
              </div>

              <div>
                <Label className="text-lg font-bold">Level Kesulitan</Label>
                <Select value={formData.tingkat_kesulitan} onValueChange={(value) => setFormData({ ...formData, tingkat_kesulitan: value })}>
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
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 h-12 text-lg rounded-xl font-bold"
                >
                  {editingId ? "Update Soal" : "Simpan Soal"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ judul: "", pertanyaan: "", jawaban_benar: "", tingkat_kesulitan: "mudah" });
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
            Daftar Soal ({questions.length})
          </h2>

          {loading && (
            <LearningCard className="bg-card/95 text-center py-8">
              <p className="text-2xl font-bold text-foreground">Memuat soal...</p>
            </LearningCard>
          )}
          
          {!loading && questions.map((q) => (
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
                    onClick={() => handleEdit(q)}
                    variant="outline"
                    size="lg"
                    className="rounded-xl font-bold"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(q.id)}
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

          {!loading && questions.length === 0 && (
            <LearningCard className="bg-card/95 text-center py-12">
              <p className="text-2xl font-bold text-foreground">Belum ada soal</p>
              <p className="text-lg text-foreground/70 mt-2">Tambahkan soal baru untuk memulai</p>
            </LearningCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teacher;
