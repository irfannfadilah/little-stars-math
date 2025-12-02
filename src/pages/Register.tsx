import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LearningCard } from "@/components/LearningCard";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { register, setAuthToken } from "@/lib/api";

const Register = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("siswa");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Password tidak cocok!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter!");
      return;
    }

    setLoading(true);

    try {
      const response = await register(nama, email, password, role);
      
      // Simpan token
      setAuthToken(response.token);

      toast.success("Pendaftaran berhasil! Selamat datang!");

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "guru") {
        navigate("/teacher");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Pendaftaran gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <LearningCard className="w-full max-w-md bg-card/95">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
            <UserPlus className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-hero mb-2">
            Daftar
          </h1>
          <p className="text-lg text-foreground/70 font-bold">
            Buat akun baru untuk mulai belajar
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama" className="text-lg font-bold">
              Nama Lengkap
            </Label>
            <Input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Anda"
              required
              className="text-lg h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg font-bold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="text-lg h-12 rounded-xl"
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
              className="text-lg h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-lg font-bold">
              Konfirmasi Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="text-lg h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-lg font-bold">
              Tipe Akun
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="h-12 text-lg rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="siswa">Siswa</SelectItem>
                <SelectItem value="guru">Guru</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-lg font-black rounded-xl mt-6"
            size="lg"
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-foreground/70 font-bold mb-3">
            Sudah punya akun?
          </p>
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="text-base font-bold"
          >
            Login di sini
          </Button>
        </div>

        <div className="mt-4 text-center">
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

export default Register;
