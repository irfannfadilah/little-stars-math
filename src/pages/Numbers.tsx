import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NumberCard } from "@/components/NumberCard";
import { ArrowLeft } from "lucide-react";

const Numbers = () => {
  const navigate = useNavigate();
  
  const colors = [
    "bg-primary/20",
    "bg-secondary/30", 
    "bg-accent/30",
    "bg-easy/30",
    "bg-medium/30",
    "bg-hard/30",
    "bg-primary/30",
    "bg-secondary/40",
    "bg-accent/40",
    "bg-easy/40"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary via-background to-primary/10 py-8">
      <div className="container mx-auto px-4">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          size="lg"
          className="mb-8 rounded-2xl border-2 text-xl font-bold"
        >
          <ArrowLeft className="mr-2 w-6 h-6" />
          Kembali
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-4 text-primary">
            Mengenal Angka 1-10 🔢
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num, idx) => (
            <NumberCard key={num} number={num} color={colors[idx]} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            onClick={() => navigate("/shapes")}
            size="lg"
            className="text-2xl h-16 px-12 rounded-3xl font-black bg-gradient-to-r from-secondary to-accent hover:scale-105 transition-all"
          >
            Lanjut ke Bangun Datar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Numbers;
