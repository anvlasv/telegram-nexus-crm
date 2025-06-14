
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, BarChart3, Calendar, Bot, Users, Target, Bell, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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

export const MiniAppMenu = ({ onSelect }: { onSelect: () => void }) => {
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-1">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-base transition-all ${
              isActive
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "hover:bg-gray-100 text-gray-900"
            }`}
            onClick={onSelect}
          >
            <item.icon className="w-5 h-5" />
            {t(item.name)}
          </Link>
        );
      })}
    </nav>
  );
};
