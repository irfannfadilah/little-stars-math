import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard } from "lucide-react";
import { getCurrentUser, logout, getAuthToken } from "@/lib/api";
import { toast } from "sonner";

interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
}

const UserBadge = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Berhasil logout!");
      navigate("/");
      setUser(null);
    } catch (error) {
      toast.error("Gagal logout");
    }
  };

  const getDashboardRoute = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "guru") return "/teacher";
    return "/";
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case "admin":
        return "bg-destructive text-destructive-foreground";
      case "guru":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case "admin":
        return "Admin";
      case "guru":
        return "Guru";
      default:
        return "Siswa";
    }
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 flex items-center gap-3 z-50">
      <div className="bg-card/95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-3 border-2 border-secondary/30">
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-foreground">{user.nama}</span>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${getRoleBadge()}`}>
            {getRoleLabel()}
          </span>
        </div>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-hero flex items-center justify-center text-white font-black text-lg">
          {user.nama.charAt(0).toUpperCase()}
        </div>
      </div>

      <Button
        onClick={() => navigate(getDashboardRoute())}
        size="sm"
        variant="outline"
        className="rounded-full px-3 py-2 text-sm font-bold border-2"
      >
        <LayoutDashboard className="w-4 h-4 mr-1" />
        Dashboard
      </Button>

      <Button
        onClick={handleLogout}
        size="sm"
        variant="outline"
        className="rounded-full px-3 py-2 text-sm font-bold border-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        <LogOut className="w-4 h-4 mr-1" />
        Logout
      </Button>
    </div>
  );
};

export default UserBadge;
