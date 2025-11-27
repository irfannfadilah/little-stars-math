import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/LearningCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  answer: number;
  options: number[];
  level: string;
}

const Teacher = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, question: "3 + 2 = ?", answer: 5, options: [4, 5, 6, 7], level: "easy" },
    { id: 2, question: "6 + 3 = ?", answer: 9, options: [7, 8, 9, 10], level: "medium" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    level: "easy"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question || !formData.answer) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    const answer = parseInt(formData.answer);
    const options = [
      answer - 2,
      answer - 1,
      answer,
      answer + 1
    ].sort(() => Math.random() - 0.5);

    if (editingId) {
      setQuestions(questions.map(q => 
        q.id === editingId 
          ? { ...q, question: formData.question, answer, options, level: formData.level }
          : q
      ));
      toast.success("Soal berhasil diupdate!");
      setEditingId(null);
    } else {
      const newQuestion: Question = {
        id: Date.now(),
        question: formData.question,
        answer,
        options,
        level: formData.level
      };
      setQuestions([...questions, newQuestion]);
      toast.success("Soal berhasil ditambahkan!");
    }

    setFormData({ question: "", answer: "", level: "easy" });
    setShowForm(false);
  };

  const handleEdit = (q: Question) => {
    setFormData({
      question: q.question,
      answer: q.answer.toString(),
      level: q.level
    });
    setEditingId(q.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast.success("Soal berhasil dihapus!");
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

          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            size="lg"
            className="rounded-2xl border-2 text-xl font-bold"
          >
            Ke Admin Panel
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-4 text-hero">
            Dashboard Guru 👩‍🏫
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
              setFormData({ question: "", answer: "", level: "easy" });
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
                <Label className="text-lg font-bold">Pertanyaan</Label>
                <Input
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Contoh: 3 + 2 = ?"
                  className="mt-2 h-12 text-lg rounded-xl"
                />
              </div>

              <div>
                <Label className="text-lg font-bold">Jawaban (angka)</Label>
                <Input
                  type="number"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Contoh: 5"
                  className="mt-2 h-12 text-lg rounded-xl"
                />
              </div>

              <div>
                <Label className="text-lg font-bold">Level Kesulitan</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                  <SelectTrigger className="mt-2 h-12 text-lg rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Mudah</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="hard">Sulit</SelectItem>
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
                    setFormData({ question: "", answer: "", level: "easy" });
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
          
          {questions.map((q) => (
            <LearningCard key={q.id} className="bg-card/95">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                      q.level === "easy" ? "bg-easy text-easy-foreground" :
                      q.level === "medium" ? "bg-medium text-medium-foreground" :
                      "bg-hard text-hard-foreground"
                    }`}>
                      {q.level === "easy" ? "Mudah" : q.level === "medium" ? "Sedang" : "Sulit"}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{q.question}</p>
                  <p className="text-lg text-muted-foreground mt-2">
                    Jawaban: <span className="font-bold text-foreground">{q.answer}</span>
                  </p>
                </div>
                
                <div className="flex gap-3">
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
        </div>
      </div>
    </div>
  );
};

export default Teacher;
