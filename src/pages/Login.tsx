import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LearningCard } from "@/components/LearningCard";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import { login, setAuthToken, getCurrentUser } from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        redirectBasedOnRole(user.role);
      }
    } catch (error) {
      // No valid session, stay on login page
    }
  };

  const redirectBasedOnRole = (role: string) => {
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "guru") {
      navigate("/teacher");
    } else {
      navigate("/");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(email, password);
      
      // Simpan token
      setAuthToken(response.token);

      toast({
        title: "Login berhasil!",
        description: "Selamat datang kembali",
      });

      redirectBasedOnRole(response.user.role);
    } catch (error: any) {
      toast({
        title: "Login gagal",
        description: error.message || "Email atau password salah",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <LearningCard className="w-full max-w-md bg-card/95">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
            <LogIn className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-hero mb-2">
            Masuk
          </h1>
          <p className="text-lg text-foreground/70 font-bold">
            Login untuk melanjutkan
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg font-bold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@email.com"
              required
              className="text-lg h-14 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-lg font-bold">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="text-lg h-14 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-xl font-black rounded-xl"
            size="lg"
          >
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-base font-bold"
          >
            ← Kembali ke Beranda
          </Button>
        </div>
      </LearningCard>
    </div>
  );
};

export default Login;
