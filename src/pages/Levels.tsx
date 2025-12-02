import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/LearningCard";
import { ArrowLeft, Star } from "lucide-react";

const Levels = () => {
  const navigate = useNavigate();

  const levels = [
    {
      name: "Mudah",
      color: "bg-easy hover:bg-easy/80",
      path: "/practice/easy"
    },
    {
      name: "Sedang",
      color: "bg-medium hover:bg-medium/80",
      path: "/practice/medium"
    },
    {
      name: "Sulit",
      color: "bg-hard hover:bg-hard/80",
      path: "/practice/hard"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-easy/20 via-background to-medium/20 py-8">
      <div className="container mx-auto px-4">
        <Button
          onClick={() => navigate("/shapes")}
          variant="outline"
          size="lg"
          className="mb-8 rounded-2xl border-2 text-xl font-bold"
        >
          <ArrowLeft className="mr-2 w-6 h-6" />
          Kembali
        </Button>

        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-easy via-medium to-hard bg-clip-text text-transparent">
            Latihan Soal!
          </h1>
          <p className="text-3xl text-foreground/70 font-bold">
            Pilih tingkat kesulitan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {levels.map((level) => (
            <LearningCard
              key={level.name}
              onClick={() => navigate(level.path)}
              className={`min-h-[280px] flex flex-col items-center justify-center gap-6 ${level.color} transition-all duration-300`}
            >
              <h2 className="text-4xl font-black text-foreground">{level.name}</h2>
              <Star className="w-12 h-12 text-foreground/50" />
            </LearningCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Levels;
