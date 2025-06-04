
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
    <Sidebar variant="inset" collapsible="icon" className="border-r-2 border-amber-100/50 dark:border-amber-800/30 bg-gradient-to-b from-amber-50/20 to-amber-100/10 dark:from-gray-900 dark:to-amber-900/5">
      <SidebarHeader className="border-b border-amber-100/50 dark:border-amber-800/30 bg-gradient-to-r from-amber-50/30 to-amber-100/20 dark:from-amber-900/10 dark:to-amber-900/5">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600/80 to-orange-600/80 shadow-md">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold bg-gradient-to-r from-amber-700/90 to-orange-600/90 bg-clip-text text-transparent">TelegramCRM</span>
            <span className="truncate text-xs text-amber-600/80 dark:text-amber-400/70 font-medium">v2.0</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive} 
                      tooltip={t(item.name)}
                      className={`
                        transition-all duration-200 
                        ${isActive 
                          ? 'bg-gradient-to-r from-amber-600/90 to-orange-600/90 text-white shadow-lg transform scale-105 border-l-4 border-white/80' 
                          : 'hover:bg-gradient-to-r hover:from-amber-50/60 hover:to-orange-50/60 dark:hover:from-amber-900/15 dark:hover:to-orange-900/15 hover:shadow-md'
                        }
                        rounded-lg mx-1
                      `}
                    >
                      <Link to={item.href}>
                        <item.icon className={isActive ? 'text-white' : 'text-amber-700/80 dark:text-amber-300/80'} />
                        <span className={`font-medium ${isActive ? 'text-white' : 'text-amber-800/90 dark:text-amber-200/90'}`}>{t(item.name)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-amber-100/50 dark:border-amber-800/30 bg-gradient-to-r from-amber-50/30 to-orange-50/20 dark:from-amber-900/10 dark:to-orange-900/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-amber-100/60 dark:hover:bg-amber-800/20">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600/80 to-orange-600/80 text-white font-bold shadow-md">
                {user?.first_name?.[0] || 'U'}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-gray-900 dark:text-gray-100">
                  {user?.first_name || 'User'} {user?.last_name || ''}
                </span>
                <span className="truncate text-xs text-amber-600/80 dark:text-amber-400/70 font-medium">Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
