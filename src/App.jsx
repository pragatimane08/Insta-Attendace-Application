import React from "react";
import { Toaster } from "./components/ui/Toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import Leave from "./pages/Leave";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { authService } from "./api/services/auth.service";

// Create QueryClient instance
const queryClient = new QueryClient();

// ProtectedRoute component (JSX version)
const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    // return <Navigate to="/login" />;
    return <>{children}</>;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
          <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
          <Route path="/leave" element={<ProtectedRoute><Leave /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
