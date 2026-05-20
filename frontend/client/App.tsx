import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Digitizer from "./pages/Digitizer";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import NewScan from "./pages/NewScan";
import RecentScans from "./pages/RecentScans";
import Downloads from "./pages/Downloads";
import Classification from "./pages/Classification";
import ClassificationDetail from "./pages/ClassificationDetail";
import ActivityLog from "./pages/ActivityLog";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/digitizer" element={<Digitizer />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/new-scan" element={<ProtectedRoute><NewScan /></ProtectedRoute>} />
      <Route path="/recent-scans" element={<ProtectedRoute><RecentScans /></ProtectedRoute>} />
      <Route path="/downloads" element={<ProtectedRoute><Downloads /></ProtectedRoute>} />
      <Route path="/classification" element={<ProtectedRoute><Classification /></ProtectedRoute>} />
      <Route path="/classification/:category" element={<ProtectedRoute><ClassificationDetail /></ProtectedRoute>} />
      <Route path="/activity" element={<ProtectedRoute><ActivityLog /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Old auth redirects */}
      <Route path="/sign-in" element={<Navigate to="/login" replace />} />
      <Route path="/sign-up" element={<Navigate to="/register" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const rootContainer = document.getElementById("root");
if (rootContainer && !rootContainer.hasChildNodes()) {
  createRoot(rootContainer).render(<App />);
}
