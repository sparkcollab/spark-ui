
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Staff from "./pages/Staff";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import StaffInviteRegistration from "./pages/StaffInviteRegistration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/staff-invite" element={<StaffInviteRegistration />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="inventory/products" element={<Inventory />} />
              <Route path="inventory/lots" element={<Inventory />} />
              <Route path="inventory/adjustments" element={<Inventory />} />
              <Route path="sales" element={<Sales />} />
              <Route path="sales/invoices" element={<Sales />} />
              <Route path="sales/returns" element={<Sales />} />
              <Route path="customers" element={<Customers />} />
              <Route path="staff" element={<Staff />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;