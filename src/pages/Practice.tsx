import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/LearningCard";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import oceanImage from "@/assets/ocean-animals.jpg";
import { toast } from "sonner";
import { getAllLatihan } from "@/lib/api";

interface Question {
  id: number;
  judul: string;
  pertanyaan: string;
  jawaban_benar: number;
  tingkat_kesulitan: string;
}

const Practice = () => {
  const navigate = useNavigate();
  const { level } = useParams<{ level: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch latihan dari API berdasarkan level
  useEffect(() => {
    fetchQuestions();
  }, [level]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const allLatihan = await getAllLatihan();

      // Filter berdasarkan tingkat kesulitan
      const levelMap: { [key: string]: string } = {
        easy: "mudah",
        medium: "sedang",
        hard: "sulit",
      };

      let filteredQuestions = allLatihan.filter(
        (q: Question) =>
          q.tingkat_kesulitan === levelMap[level as string] ||
          levelMap[level as string] === undefined
      );

      // *** Sanitizer → pastikan jawaban_benar full bilangan ***
      filteredQuestions = filteredQuestions.map((q: Question) => ({
        ...q,
        jawaban_benar: Number(
          String(q.jawaban_benar).replace(/[^0-9]/g, "") // hilangkan "-", "/", dsb.
        ),
      }));

      setQuestions(filteredQuestions.length > 0 ? filteredQuestions : []);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (error: any) {
      toast.error("Gagal memuat soal: " + (error.message || ""));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestions = questions;
  const question = currentQuestions[currentQuestion];

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === question.jawaban_benar) {
      toast.success("Benar! Hebat!", {
        duration: 2000,
      });
    } else {
      toast.error("Belum tepat, coba lagi!", {
        duration: 2000,
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      toast.success("Kamu sudah menyelesaikan semua soal!", {
        duration: 3000,
      });
      navigate("/levels");
    }
  };

  const getLevelColor = () => {
    switch (level) {
      case "easy":
        return "from-green-100/50 to-green-50/50";
      case "medium":
        return "from-yellow-100/50 to-yellow-50/50";
      case "hard":
        return "from-red-100/50 to-red-50/50";
      default:
        return "from-green-100/50 to-green-50/50";
    }
  };

  const getLevelName = () => {
    switch (level) {
      case "easy":
        return "Mudah";
      case "medium":
        return "Sedang";
      case "hard":
        return "Sulit";
      default:
        return "Mudah";
    }
  };

  // Generate wrong answers (harus angka full & tidak negatif)
  const generateWrongAnswers = (correctAnswer: number): number[] => {
    const wrongAnswers: number[] = new Set<number>();

    while (wrongAnswers.size < 3) {
      const offset = Math.floor(Math.random() * 11) - 5; // -5 s/d +5
      const wrong = correctAnswer + offset;

      if (wrong > 0 && wrong !== correctAnswer) {
        wrongAnswers.add(wrong);
      }

      if (wrongAnswers.size > 20) break;
    }

    return Array.from(wrongAnswers);
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${getLevelColor()} py-8`}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-2xl font-bold text-foreground">Memuat soal...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${getLevelColor()} py-8`}>
        <div className="container mx-auto px-4">
          <Button
            onClick={() => navigate("/levels")}
            variant="outline"
            size="lg"
            className="mb-8 rounded-2xl border-2 text-xl font-bold"
          >
            <ArrowLeft className="mr-2 w-6 h-6" />
            Kembali
          </Button>
          <div className="text-center">
            <p className="text-2xl font-bold">Tidak ada soal untuk level ini</p>
            <Button
              onClick={() => navigate("/levels")}
              size="lg"
              className="mt-8 rounded-2xl font-bold"
            >
              Kembali ke Level
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getLevelColor()} py-8`}>
      <div className="container mx-auto px-4">
        <Button
          onClick={() => navigate("/levels")}
          variant="outline"
          size="lg"
          className="mb-8 rounded-2xl border-2 text-xl font-bold"
        >
          <ArrowLeft className="mr-2 w-6 h-6" />
          Kembali
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black mb-2 text-hero">
            Level {getLevelName()}
          </h1>
          <p className="text-xl font-bold text-foreground/70">
            Soal {currentQuestion + 1} dari {currentQuestions.length}
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8 rounded-3xl overflow-hidden shadow-[var(--shadow-card)] border-4 border-secondary/30">
          <img src={oceanImage} alt="Hewan laut" className="w-full h-auto" />
        </div>

        <div className="max-w-3xl mx-auto">
          <LearningCard className="bg-card/95 backdrop-blur-sm mb-8 min-h-[200px] flex items-center justify-center">
            <h2 className="text-4xl md:text-6xl font-black text-center text-foreground">
              {question.pertanyaan}
            </h2>
          </LearningCard>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {[
              question.jawaban_benar,
              ...generateWrongAnswers(question.jawaban_benar),
            ]
              .sort(() => Math.random() - 0.5)
              .map((option) => (
                <Button
                  key={option}
                  onClick={() => !showResult && handleAnswer(option)}
                  disabled={showResult}
                  size="lg"
                  className={`h-28 text-5xl font-black rounded-3xl ${showResult && option === question.jawaban_benar
                      ? "bg-green-500 text-white ring-4 ring-green-600"
                      : showResult && option === selectedAnswer
                        ? "bg-red-500 text-white"
                        : ""
                    }`}
                >
                  {option}
                  {showResult && option === question.jawaban_benar && (
                    <CheckCircle className="ml-4 w-8 h-8" />
                  )}
                  {showResult &&
                    option === selectedAnswer &&
                    option !== question.jawaban_benar && (
                      <XCircle className="ml-4 w-8 h-8" />
                    )}
                </Button>
              ))}
          </div>

          {showResult && (
            <div className="text-center">
              <Button
                onClick={handleNext}
                size="lg"
                className="text-2xl h-16 px-12 rounded-3xl font-black bg-gradient-to-r from-primary to-hero hover:scale-105 transition-all"
              >
                {currentQuestion < currentQuestions.length - 1
                  ? "Soal Berikutnya"
                  : "Selesai"}{" "}
                →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;
