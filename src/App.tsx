import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Numbers from "./pages/Numbers";
import Shapes from "./pages/Shapes";
import Levels from "./pages/Levels";
import Practice from "./pages/Practice";
import Teacher from "./pages/Teacher";
import Materi from "./pages/Materi";
import StudentMateri from "./pages/StudentMateri";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/numbers" element={<Numbers />} />
          <Route path="/shapes" element={<Shapes />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/practice/:level" element={<Practice />} />
          <Route path="/materi-siswa" element={<StudentMateri />} />
          <Route 
            path="/teacher" 
            element={
              <ProtectedRoute allowedRoles={["guru", "admin"]}>
                <Teacher />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/materi" 
            element={
              <ProtectedRoute allowedRoles={["guru", "admin"]}>
                <Materi />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Admin />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
