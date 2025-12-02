import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShapeCard } from "@/components/ShapeCard";
import { ArrowLeft } from "lucide-react";
import jungleImage from "@/assets/jungle-animals.jpg";

const Shapes = () => {
  const navigate = useNavigate();

  const shapes = [
    { name: "Persegi", shape: "square" as const, color: "bg-primary" },
    { name: "Persegi Panjang", shape: "rectangle" as const, color: "bg-secondary" },
    { name: "Segitiga", shape: "triangle" as const, color: "bg-accent" },
    { name: "Lingkaran", shape: "circle" as const, color: "bg-easy" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 via-background to-easy/20 py-8">
      <div className="container mx-auto px-4">
        <Button
          onClick={() => navigate("/numbers")}
          variant="outline"
          size="lg"
          className="mb-8 rounded-2xl border-2 text-xl font-bold"
        >
          <ArrowLeft className="mr-2 w-6 h-6" />
          Kembali
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-black mb-4 text-hero">
            Mengenal Bangun Datar 📐
          </h1>
          <p className="text-2xl text-foreground/70 font-bold">
            Ayo kenali berbagai bentuk!
          </p>
        </div>

        {/* Jungle animals decoration
        <div className="max-w-3xl mx-auto mb-8 rounded-3xl overflow-hidden shadow-[var(--shadow-card)] border-6 border-accent/30">
          <img 
            src={jungleImage} 
            alt="Hewan hutan" 
            className="w-full h-auto"
          />
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {shapes.map((shape) => (
            <ShapeCard
              key={shape.name}
              name={shape.name}
              shape={shape.shape}
              color={shape.color}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            onClick={() => navigate("/levels")}
            size="lg"
            className="text-2xl h-16 px-12 rounded-3xl font-black bg-gradient-to-r from-hero to-primary hover:scale-105 transition-all"
          >
            Mulai Latihan Soal 📝
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Shapes;
