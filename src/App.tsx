import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import RegistrationPage from "./pages/RegistrationPage";
import AcademicsPage from "./pages/AcademicsPage";
import MerchandisePage from "./pages/MerchandisePage";
import PortalPage from "./pages/PortalPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LearnerDashboard from "./pages/dashboards/LearnerDashboard";
import TeacherDashboard from "./pages/dashboards/TeacherDashboard";
import GradeHeadDashboard from "./pages/dashboards/GradeHeadDashboard";
import PrincipalDashboard from "./pages/dashboards/PrincipalDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/academics" element={<AcademicsPage />} />
            <Route path="/merchandise" element={<MerchandisePage />} />
            <Route path="/portal" element={<PortalPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard/learner" element={<LearnerDashboard />} />
            <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
            <Route path="/dashboard/grade-head" element={<GradeHeadDashboard />} />
            <Route path="/dashboard/principal" element={<PrincipalDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
