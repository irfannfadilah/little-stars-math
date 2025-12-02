import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/LearningCard";
import { Input } from "@/components/ui/input";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { toast } from "sonner";
import { getAllMateri } from "@/lib/api";

interface Materi {
  id: number;
  judul: string;
  deskripsi: string;
  isi_materi: string;
  nama_guru?: string;
}

const StudentMateri = () => {
  const navigate = useNavigate();
  const [materies, setMateries] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMateri, setSelectedMateri] = useState<Materi | null>(null);

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

  const filteredMateries = materies.filter((m) =>
    m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedMateri) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 via-background to-primary/10 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            onClick={() => setSelectedMateri(null)}
            variant="outline"
            size="lg"
            className="rounded-2xl border-2 text-xl font-bold mb-8"
          >
            <ArrowLeft className="mr-2 w-6 h-6" />
            Kembali ke Daftar Materi
          </Button>

          <LearningCard className="bg-card/95">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-black text-hero mb-4">
                {selectedMateri.judul}
              </h1>
              <p className="text-xl text-foreground/70 font-bold">
                {selectedMateri.deskripsi}
              </p>
            </div>

            <div className="bg-primary/5 rounded-2xl p-8 border-2 border-primary/20">
              <h2 className="text-3xl font-black text-foreground mb-6">Isi Materi</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-wrap text-foreground/80">
                  {selectedMateri.isi_materi}
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button
                onClick={() => navigate("/")}
                size="lg"
                className="text-xl h-14 px-12 rounded-2xl font-bold bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all"
              >
                Kembali ke Beranda
              </Button>
            </div>
          </LearningCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 via-background to-primary/10 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          size="lg"
          className="rounded-2xl border-2 text-xl font-bold mb-8"
        >
          <ArrowLeft className="mr-2 w-6 h-6" />
          Kembali
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-4 text-hero">
            Materi Pembelajaran 📚
          </h1>
          <p className="text-2xl text-foreground/70 font-bold">
            Pelajari berbagai materi matematika dengan mudah
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-foreground/50" />
            <Input
              type="text"
              placeholder="Cari materi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg rounded-xl border-2 border-primary/30"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-black text-foreground mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            Daftar Materi ({filteredMateries.length})
          </h2>

          {loading && (
            <LearningCard className="bg-card/95 text-center py-8">
              <p className="text-2xl font-bold text-foreground">Memuat materi...</p>
            </LearningCard>
          )}

          {!loading && filteredMateries.map((m) => (
            <LearningCard key={m.id} className="bg-card/95 hover:shadow-lg hover:scale-102 transition-all cursor-pointer">
              <div
                onClick={() => setSelectedMateri(m)}
                className="flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <p className="text-3xl font-bold text-hero mb-2">{m.judul}</p>
                  <p className="text-lg text-foreground/70 mb-4">{m.deskripsi}</p>
                  <p className="text-base text-foreground/60 line-clamp-2">
                    {m.isi_materi}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <Button
                    onClick={() => setSelectedMateri(m)}
                    size="lg"
                    className="rounded-xl font-bold text-lg px-8 bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all"
                  >
                    Baca Materi →
                  </Button>
                </div>
              </div>
            </LearningCard>
          ))}

          {!loading && filteredMateries.length === 0 && (
            <LearningCard className="bg-card/95 text-center py-12">
              <p className="text-2xl font-bold text-foreground">
                {searchQuery ? "Materi tidak ditemukan" : "Belum ada materi"}
              </p>
              <p className="text-lg text-foreground/70 mt-2">
                {searchQuery
                  ? "Coba gunakan kata kunci lain"
                  : "Materi akan segera ditambahkan oleh guru"}
              </p>
            </LearningCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMateri;
