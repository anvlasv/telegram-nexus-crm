
import React from 'react';
import { ChevronDown, Info } from 'lucide-react';
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
  const { channels, selectedChannelId, setSelectedChannelId } = useChannels();

  const selectedChannel = channels.find(c => c.id === selectedChannelId) || channels[0];

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId);
    setShowChannelSelect(false);
  };

  if (!selectedChannel) return null;

  return (
    <DropdownMenu open={showChannelSelect} onOpenChange={setShowChannelSelect}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={selectedChannel.avatar_url || undefined} 
              alt={selectedChannel.name} 
            />
            <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
              {selectedChannel.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {/* Show channel name only on desktop */}
          <div className="hidden lg:flex flex-col items-start">
            <span className="text-sm font-medium">{selectedChannel.name}</span>
            <span className="text-xs text-muted-foreground">
              @{selectedChannel.username}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>{t('channels')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {channels.map((channel) => (
          <DropdownMenuItem
            key={channel.id}
            className="flex items-center gap-3 p-3"
            onClick={() => handleChannelSelect(channel.id)}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={channel.avatar_url || undefined} 
                alt={channel.name} 
              />
              <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                {channel.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{channel.name}</span>
              <span className="text-xs text-muted-foreground">
                @{channel.username}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setShowChannelInfo(true)}>
          <Info className="mr-2 h-4 w-4" />
          {t('channel-info')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
