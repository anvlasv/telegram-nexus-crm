import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { TopNav } from './TopNav';
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background telegram-viewport">
        <AppSidebar />
        <SidebarInset className="flex flex-col w-full">
          <TopNav />
          <main className="flex-1 overflow-auto scrollable-content">
            <div className="min-h-full">
              {children}
            </div>
            <Toaster />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
