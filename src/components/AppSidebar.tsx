
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
    <Sidebar variant="inset" collapsible="icon" className="border-r-2 border-gray-200 dark:border-gray-700 bg-gradient-to-b from-amber-50/30 to-amber-100/20 dark:from-gray-900 dark:to-amber-900/5">
      <SidebarHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-50/40 to-amber-100/30 dark:from-amber-900/10 dark:to-amber-900/5">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 shadow-md">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-gray-900 dark:text-gray-100">TelegramCRM</span>
            <span className="truncate text-xs text-gray-600 dark:text-gray-400 font-medium">v2.0</span>
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
                          ? 'bg-blue-50 text-blue-700 shadow-lg border-l-4 border-blue-500 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md text-gray-600 dark:text-gray-300'
                        }
                        rounded-lg mx-1 group-data-[collapsible=icon]:rounded-r-none
                      `}
                    >
                      <Link to={item.href}>
                        <item.icon className={isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'} />
                        <span className={`font-medium ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{t(item.name)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-50/40 to-amber-100/30 dark:from-amber-900/10 dark:to-amber-900/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white font-bold shadow-md">
                {user?.first_name?.[0] || 'U'}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-gray-900 dark:text-gray-100">
                  {user?.first_name || 'User'} {user?.last_name || ''}
                </span>
                <span className="truncate text-xs text-gray-600 dark:text-gray-400 font-medium">Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
