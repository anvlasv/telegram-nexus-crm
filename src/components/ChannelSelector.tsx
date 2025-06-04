
import React, { useState } from 'react';
import { ChevronDown, Settings, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useChannels } from '@/hooks/useChannels';
import { ChannelInfoDialog } from '@/components/ChannelInfoDialog';

export const ChannelSelector: React.FC = () => {
  const { channels } = useChannels();
  const [selectedChannel, setSelectedChannel] = useState(channels[0] || null);
  const [showChannelInfo, setShowChannelInfo] = useState(false);

  React.useEffect(() => {
    if (channels.length > 0 && !selectedChannel) {
      setSelectedChannel(channels[0]);
    }
  }, [channels, selectedChannel]);

  if (channels.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <MessageSquare className="h-4 w-4" />
        <span>Нет подключенных каналов</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="max-w-32 truncate">
                {selectedChannel?.name || selectedChannel?.username || 'Выберите канал'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            {channels.map((channel) => (
              <DropdownMenuItem
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {channel.name || channel.username}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    @{channel.username}
                  </div>
                </div>
                {selectedChannel?.id === channel.id && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedChannel && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowChannelInfo(true)}
            className="h-8 w-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>

      {selectedChannel && (
        <ChannelInfoDialog
          channel={selectedChannel}
          open={showChannelInfo}
          onOpenChange={setShowChannelInfo}
        />
      )}
    </>
  );
};
