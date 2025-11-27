import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/LearningCard";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import oceanImage from "@/assets/ocean-animals.jpg";
import { toast } from "sonner";

const Practice = () => {
  const navigate = useNavigate();
  const { level } = useParams<{ level: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const questions = {
    easy: [
      { question: "3 + 2 = ?", answer: 5, options: [4, 5, 6, 7] },
      { question: "5 - 1 = ?", answer: 4, options: [3, 4, 5, 6] },
      { question: "2 + 1 = ?", answer: 3, options: [2, 3, 4, 5] },
    ],
    medium: [
      { question: "6 + 3 = ?", answer: 9, options: [7, 8, 9, 10] },
      { question: "8 - 2 = ?", answer: 6, options: [5, 6, 7, 8] },
      { question: "Di laut ada 5 ikan, datang 3 ikan lagi. Berapa ikan sekarang?", answer: 8, options: [6, 7, 8, 9] },
    ],
    hard: [
      { question: "9 + 5 = ?", answer: 14, options: [12, 13, 14, 15] },
      { question: "12 - 4 = ?", answer: 8, options: [7, 8, 9, 10] },
      { question: "Ada 7 bintang laut di pantai. 4 bintang laut pergi. Berapa yang tersisa?", answer: 3, options: [2, 3, 4, 5] },
    ],
  };

  const currentQuestions = questions[level as keyof typeof questions] || questions.easy;
  const question = currentQuestions[currentQuestion];

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === question.answer) {
      toast.success("Benar! Hebat! 🎉", {
        duration: 2000,
      });
    } else {
      toast.error("Belum tepat, coba lagi! 💪", {
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
      toast.success("Kamu sudah menyelesaikan semua soal! 🌟", {
        duration: 3000,
      });
      navigate("/levels");
    }
  };

  const getLevelColor = () => {
    switch (level) {
      case "easy": return "from-easy/30 to-easy/10";
      case "medium": return "from-medium/30 to-medium/10";
      case "hard": return "from-hard/30 to-hard/10";
      default: return "from-easy/30 to-easy/10";
    }
  };

  const getLevelName = () => {
    switch (level) {
      case "easy": return "Mudah 🌟";
      case "medium": return "Sedang ⭐";
      case "hard": return "Sulit ✨";
      default: return "Mudah 🌟";
    }
  };

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

        {/* Ocean theme decoration */}
        <div className="max-w-2xl mx-auto mb-8 rounded-3xl overflow-hidden shadow-[var(--shadow-card)] border-4 border-secondary/30">
          <img 
            src={oceanImage} 
            alt="Hewan laut" 
            className="w-full h-auto"
          />
        </div>

        {/* Question Card */}
        <div className="max-w-3xl mx-auto">
          <LearningCard className="bg-card/95 backdrop-blur-sm mb-8 min-h-[200px] flex items-center justify-center">
            <h2 className="text-4xl md:text-6xl font-black text-center text-foreground">
              {question.question}
            </h2>
          </LearningCard>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {question.options.map((option) => (
              <Button
                key={option}
                onClick={() => !showResult && handleAnswer(option)}
                disabled={showResult}
                size="lg"
                className={`h-28 text-5xl font-black rounded-3xl transition-all duration-300 ${
                  showResult && option === question.answer
                    ? "bg-easy text-easy-foreground ring-4 ring-easy-foreground"
                    : showResult && option === selectedAnswer
                    ? "bg-hard text-hard-foreground"
                    : "bg-card hover:scale-105"
                }`}
              >
                {option}
                {showResult && option === question.answer && (
                  <CheckCircle className="ml-4 w-8 h-8" />
                )}
                {showResult && option === selectedAnswer && option !== question.answer && (
                  <XCircle className="ml-4 w-8 h-8" />
                )}
              </Button>
            ))}
          </div>

          {/* Next Button */}
          {showResult && (
            <div className="text-center">
              <Button
                onClick={handleNext}
                size="lg"
                className="text-2xl h-16 px-12 rounded-3xl font-black bg-gradient-to-r from-primary to-hero hover:scale-105 transition-all"
              >
                {currentQuestion < currentQuestions.length - 1 ? "Soal Berikutnya" : "Selesai"} →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;
