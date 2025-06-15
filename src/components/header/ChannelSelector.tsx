
import React, { useState } from 'react';
import { ChevronDown, Info, Check, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChannels } from '@/hooks/useChannels';
import { Badge } from '@/components/ui/badge';

interface ChannelSelectorProps {
  showChannelSelect: boolean;
  setShowChannelSelect: (show: boolean) => void;
  setShowChannelInfo: (show: boolean) => void;
}

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({
  showChannelSelect,
  setShowChannelSelect,
  setShowChannelInfo
}) => {
  const { t } = useLanguage();
  const { channels, selectedChannelId, setSelectedChannelId, isLoading } = useChannels();
  const [switching, setSwitching] = useState(false);

  const selectedChannel = channels.find(c => c.id === selectedChannelId);

  const handleChannelSelect = async (channelId: string) => {
    if (channelId === selectedChannelId) {
      setShowChannelSelect(false);
      return;
    }

    setSwitching(true);
    console.log('[ChannelSelector] Переключение на канал:', channelId);
    
    // Добавляем небольшую задержку для плавности переключения
    setTimeout(() => {
      setSelectedChannelId(channelId);
      setShowChannelSelect(false);
      setSwitching(false);
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 h-auto p-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">{t('loading')}</span>
      </div>
    );
  }

  if (!selectedChannel) {
    return (
      <div className="flex items-center gap-2 h-auto p-2">
        <span className="text-sm text-muted-foreground">{t('no-channels')}</span>
      </div>
    );
  }

  return (
    <DropdownMenu open={showChannelSelect} onOpenChange={setShowChannelSelect}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 h-auto p-2 hover:bg-accent transition-colors"
          disabled={switching}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={selectedChannel.avatar_url || undefined} 
              alt={selectedChannel.name} 
            />
            <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
              {selectedChannel.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          {/* Channel info with responsive design */}
          <div className="hidden lg:flex flex-col items-start min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate max-w-32">
                {selectedChannel.name}
              </span>
              {selectedChannel.status === 'active' && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </div>
            <span className="text-xs text-muted-foreground truncate max-w-32">
              @{selectedChannel.username}
            </span>
          </div>
          
          {switching ? (
            <Loader2 className="h-4 w-4 animate-spin ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-80 bg-background border shadow-lg">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{t('channels')}</span>
          <Badge variant="outline" className="text-xs">
            {channels.length} {t('total')}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-64 overflow-y-auto">
          {channels.map((channel) => (
            <DropdownMenuItem
              key={channel.id}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                channel.id === selectedChannelId ? 'bg-accent' : 'hover:bg-accent/50'
              }`}
              onClick={() => handleChannelSelect(channel.id)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={channel.avatar_url || undefined} 
                  alt={channel.name} 
                />
                <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                  {channel.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{channel.name}</span>
                  {channel.status === 'active' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground truncate">
                  @{channel.username}
                </span>
                <span className="text-xs text-muted-foreground">
                  {channel.subscriber_count?.toLocaleString() || '0'} {t('subscribers')}
                </span>
              </div>
              
              {channel.id === selectedChannelId && (
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => {
            setShowChannelInfo(true);
            setShowChannelSelect(false);
          }}
          className="flex items-center gap-2 p-3"
        >
          <Info className="h-4 w-4" />
          {t('channel-info')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
