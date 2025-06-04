import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { ChannelManagement } from "./components/ChannelManagement";
import { Analytics } from "./components/Analytics";
import { Settings } from "./components/Settings";
import { Scheduler } from "./components/Scheduler";
import { Partners } from "./components/Partners";
import { Marketplace } from "./components/Marketplace";
import { Notifications } from "./components/Notifications";
import NotFound from "./pages/NotFound";
import { Assistant } from './components/Assistant';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/channels" element={<ChannelManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/scheduler" element={<Scheduler />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/assistant" element={<Assistant />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
