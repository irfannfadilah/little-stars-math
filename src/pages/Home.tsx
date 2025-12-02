import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserBadge from "@/components/UserBadge";
import heroImage from "@/assets/hero-kids-learning.jpg";
import { Sparkles, BookOpen, GraduationCap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary via-background to-accent/30">
      <UserBadge />
      {/* Decorative elements */}
      <div className="fixed top-10 left-10 animate-bounce">
        <Sparkles className="w-12 h-12 text-primary" />
      </div>
      <div className="fixed top-20 right-20 animate-pulse">
        <div className="text-6xl">⭐</div>
      </div>
      <div className="fixed bottom-20 left-20 animate-bounce delay-300">
        <div className="text-5xl">☁️</div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-primary via-hero to-secondary bg-clip-text text-transparent animate-pulse">
            NINA 🎉
          </h1>
          <p className="text-2xl md:text-3xl text-foreground/80 font-bold mb-8">
           Numerasi Interaktif Anak
          </p>
        </div>

        {/* Hero Image */}
        <div className="max-w-4xl mx-auto mb-12 rounded-3xl overflow-hidden shadow-[var(--shadow-card)] border-8 border-primary/30">
          <img 
            src={heroImage} 
            alt="Anak-anak belajar bersama" 
            className="w-full h-auto"
          />
        </div>

        {/* Main Buttons */}
        <div className="max-w-2xl mx-auto space-y-6">
          <Button
            onClick={() => navigate("/numbers")}
            size="lg"
            className="w-full h-20 text-3xl font-black rounded-3xl bg-gradient-to-r from-primary to-hero hover:scale-105 transition-all duration-300 shadow-[var(--shadow-card)] border-4 border-primary-foreground/20"
          >
            <BookOpen className="mr-4 w-10 h-10" />
            Mulai Belajar
          </Button>

          <Button
            onClick={() => navigate("/materi-siswa")}
            size="lg"
            variant="outline"
            className="w-full h-20 text-3xl font-black rounded-3xl border-4 hover:scale-105 transition-all duration-300 shadow-[var(--shadow-soft)] bg-card"
          >
            <BookOpen className="mr-4 w-10 h-10" />
            Baca Materi
          </Button>

          <Button
            onClick={() => navigate("/login")}
            size="lg"
            variant="outline"
            className="w-full h-20 text-3xl font-black rounded-3xl border-4 hover:scale-105 transition-all duration-300 shadow-[var(--shadow-soft)] bg-card"
          >
            <GraduationCap className="mr-4 w-10 h-10" />
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
