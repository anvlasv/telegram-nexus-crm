
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { ChannelManagement } from "./components/ChannelManagement";
import { Analytics } from "./components/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/channels" element={<ChannelManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/scheduler" element={<div className="p-8 text-center text-gray-500">Scheduler module coming soon...</div>} />
            <Route path="/partners" element={<div className="p-8 text-center text-gray-500">Partners module coming soon...</div>} />
            <Route path="/marketplace" element={<div className="p-8 text-center text-gray-500">Marketplace module coming soon...</div>} />
            <Route path="/notifications" element={<div className="p-8 text-center text-gray-500">Notifications module coming soon...</div>} />
            <Route path="/settings" element={<div className="p-8 text-center text-gray-500">Settings module coming soon...</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
