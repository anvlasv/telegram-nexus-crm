
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
  Bell
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
    <Sidebar variant="inset" collapsible="icon" className="border-r-2 border-blue-100 dark:border-blue-800 bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
      <SidebarHeader className="border-b border-blue-100 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TelegramCRM</span>
            <span className="truncate text-xs text-blue-600 dark:text-blue-400 font-medium">v2.0</span>
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
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105 border-l-4 border-white' 
                          : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:shadow-md'
                        }
                        rounded-lg mx-1
                      `}
                    >
                      <Link to={item.href}>
                        <item.icon className={isActive ? 'text-white' : ''} />
                        <span className={`font-medium ${isActive ? 'text-white' : ''}`}>{t(item.name)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-blue-100 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-blue-100 dark:hover:bg-blue-800/30">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold shadow-md">
                {user?.first_name?.[0] || 'U'}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-gray-900 dark:text-gray-100">
                  {user?.first_name || 'User'} {user?.last_name || ''}
                </span>
                <span className="truncate text-xs text-blue-600 dark:text-blue-400 font-medium">Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
