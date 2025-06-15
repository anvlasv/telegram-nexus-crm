
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Users, 
  Zap,
  Target,
  Bell,
  Bot,
  Moon,
  Sun
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/hooks/useTelegram';
import { useIsMobile } from '@/hooks/use-mobile';

const navigation = [
  { name: 'dashboard', href: '/', icon: BarChart3 },
  { name: 'channels', href: '/channels', icon: MessageSquare },
  { name: 'analytics', href: '/analytics', icon: BarChart3 },
  { name: 'scheduler', href: '/scheduler', icon: Calendar },
  { name: 'assistant', href: '/assistant', icon: Bot },
  { name: 'partners', href: '/partners', icon: Users },
  { name: 'marketplace', href: '/marketplace', icon: Target },
  { name: 'notifications', href: '/notifications', icon: Bell },
];

export function AppSidebar() {
  const location = useLocation();
  const { t } = useLanguage();
  const { setOpenMobile, isMobile: sidebarIsMobile, state } = useSidebar();
  const { isDarkTheme, toggleTheme } = useTelegram();
  const isMobile = useIsMobile();

  const handleLinkClick = () => {
    if (sidebarIsMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar variant="inset" collapsible="icon" className="sidebar-collapsed w-16 group-data-[state=expanded]:w-64">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">TelegramCRM</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive} 
                      tooltip={t(item.name)}
                      className="sidebar-menu-button"
                      data-active={isActive}
                    >
                      <Link to={item.href} onClick={handleLinkClick}>
                        <item.icon className="text-sky-400" />
                        <span>{t(item.name)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Mobile theme toggle - at bottom of menu */}
        {isMobile && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild
                    tooltip={isDarkTheme ? t('light-theme') : t('dark-theme')}
                  >
                    <Button
                      variant="ghost"
                      onClick={toggleTheme}
                      className="w-full justify-start"
                    >
                      {isDarkTheme ? <Sun className="text-sky-400" /> : <Moon className="text-sky-400" />}
                      <span>{isDarkTheme ? t('light-theme') : t('dark-theme')}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2">
          {/* Desktop/Tablet theme toggle - above version */}
          {!isMobile && (
            <div className="flex items-center justify-center px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-8 w-8 p-0"
                title={isDarkTheme ? t('light-theme') : t('dark-theme')}
              >
                {isDarkTheme ? <Sun className="h-4 w-4 text-sky-400" /> : <Moon className="h-4 w-4 text-sky-400" />}
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-between px-4 py-2">
            <span className="truncate text-xs text-muted-foreground">v2.0</span>
            {state === 'collapsed' ? (
              <SidebarTrigger />
            ) : (
              <SidebarTrigger />
            )}
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
