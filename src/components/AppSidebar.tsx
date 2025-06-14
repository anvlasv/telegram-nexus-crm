
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Users, 
  Settings, 
  Zap,
  Target,
  Bell,
  Bot
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
  SidebarTrigger
} from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/hooks/useTelegram';

const navigation = [
  { name: 'dashboard', href: '/', icon: BarChart3 },
  { name: 'channels', href: '/channels', icon: MessageSquare },
  { name: 'analytics', href: '/analytics', icon: BarChart3 },
  { name: 'scheduler', href: '/scheduler', icon: Calendar },
  { name: 'assistant', href: '/assistant', icon: Bot },
  { name: 'partners', href: '/partners', icon: Users },
  { name: 'marketplace', href: '/marketplace', icon: Target },
  { name: 'notifications', href: '/notifications', icon: Bell },
  { name: 'settings', href: '/settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useTelegram();

  return (
    <Sidebar variant="inset" collapsible="icon" className="sidebar-collapsed">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Zap className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">TelegramCRM</span>
            <span className="truncate text-xs text-muted-foreground">v2.0</span>
          </div>
          {/* Добавляем SidebarTrigger для сворачивания/разворачивания */}
          <SidebarTrigger className="ml-auto" />
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
                      <Link to={item.href}>
                        <item.icon className="text-sidebar-primary" />
                        <span>{t(item.name)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {user?.first_name?.[0] || 'U'}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.first_name || 'User'} {user?.last_name || ''}
                </span>
                <span className="truncate text-xs text-muted-foreground">Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
