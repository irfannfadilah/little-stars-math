import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/LearningCard";
import { ArrowLeft, Users, BookOpen, BarChart3, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil logout!");
    navigate("/login");
  };

  const stats = [
    { label: "Total Guru", value: "5", icon: Users, color: "bg-primary" },
    { label: "Total Soal", value: "24", icon: BookOpen, color: "bg-secondary" },
    { label: "Siswa Aktif", value: "120", icon: Users, color: "bg-easy" },
    { label: "Soal Dikerjakan", value: "456", icon: BarChart3, color: "bg-medium" },
  ];

  const menuItems = [
    { title: "Kelola Guru", icon: Users, color: "bg-hero", action: () => {} },
    { title: "Kelola Soal", icon: BookOpen, color: "bg-primary", action: () => navigate("/teacher") },
    { title: "Statistik", icon: BarChart3, color: "bg-secondary", action: () => {} },
    { title: "Pengaturan", icon: Settings, color: "bg-accent", action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-secondary/10 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
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
            onClick={handleLogout}
            variant="outline"
            size="lg"
            className="rounded-2xl border-2 text-xl font-bold text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="mr-2 w-6 h-6" />
            Logout
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-4 text-hero">
            Dashboard Admin 👨‍💼
          </h1>
          <p className="text-2xl text-foreground/70 font-bold">
            Kelola sistem pembelajaran numerasi
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <LearningCard key={stat.label} className={`${stat.color}/20 text-center`}>
              <stat.icon className="w-12 h-12 mx-auto mb-3 text-foreground" />
              <div className="text-4xl font-black text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-bold text-foreground/70">
                {stat.label}
              </div>
            </LearningCard>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <LearningCard
              key={item.title}
              onClick={item.action}
              className={`${item.color}/20 hover:scale-105 transition-all cursor-pointer`}
            >
              <div className="flex items-center gap-6 p-4">
                <div className={`${item.color} p-6 rounded-2xl`}>
                  <item.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-black text-foreground">
                  {item.title}
                </h3>
              </div>
            </LearningCard>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-3xl font-black text-foreground mb-6">
            Aktivitas Terbaru
          </h2>
          <LearningCard className="bg-card/95">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-bold text-lg">Guru Ani menambahkan 3 soal baru</p>
                  <p className="text-sm text-muted-foreground">2 jam yang lalu</p>
                </div>
                <span className="px-4 py-2 bg-easy text-easy-foreground rounded-full text-sm font-bold">
                  Soal Baru
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-bold text-lg">15 siswa menyelesaikan level mudah</p>
                  <p className="text-sm text-muted-foreground">5 jam yang lalu</p>
                </div>
                <span className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-bold">
                  Progress
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-bold text-lg">Guru Budi mengupdate 2 soal</p>
                  <p className="text-sm text-muted-foreground">1 hari yang lalu</p>
                </div>
                <span className="px-4 py-2 bg-medium text-medium-foreground rounded-full text-sm font-bold">
                  Update
                </span>
              </div>
            </div>
          </LearningCard>
        </div>
      </div>
    </div>
  );
};

export default Admin;
