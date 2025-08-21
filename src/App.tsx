import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react"; // ΝΕΟ
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AccessCode from "./pages/AccessCode"; // ΝΕΟ

const queryClient = new QueryClient();

const App = () => {
  // ΝΕΟ STATE
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  
  // ΝΕΑ ΛΟΓΙΚΗ
  useEffect(() => {
    const accessCode = import.meta.env.VITE_ACCESS_CODE;
    
    // Αν δεν υπάρχει κωδικός ή είναι κενός, δώσε πρόσβαση
    if (!accessCode || accessCode.trim() === '') {
      setHasAccess(true);
    }
    
    setIsCheckingAccess(false);
  }, []);
  
  // ΝΕΑ ΛΟΓΙΚΗ RENDERING
  if (isCheckingAccess) {
    return <div>Loading...</div>;
  }
  
  const accessCode = import.meta.env.VITE_ACCESS_CODE;
  const needsAccessCode = accessCode && accessCode.trim() !== '';
  
  if (needsAccessCode && !hasAccess) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AccessCode 
            onAccessGranted={() => setHasAccess(true)}
            requiredCode={accessCode}
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }
  
  // ΥΠΑΡΧΟΥΣΑ ΛΟΓΙΚΗ (αμετάβλητη)
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
