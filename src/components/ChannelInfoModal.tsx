
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface Channel {
  id: string;
  name: string;
  username: string;
  subscriber_count: number | null;
}

interface ChannelInfoModalProps {
  channel: Channel;
  isOpen: boolean;
  onClose: () => void;
}

export const ChannelInfoModal: React.FC<ChannelInfoModalProps> = ({
  channel,
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('channel-info')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" alt={channel.name} />
              <AvatarFallback className="text-lg font-semibold bg-sidebar-primary text-sidebar-primary-foreground">
                {channel.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Channel Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('channel-name')}
              </label>
              <p className="font-semibold">{channel.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('channel-username')}
              </label>
              <p className="font-mono">@{channel.username}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('subscribers')}
              </label>
              <p className="font-semibold">{(channel.subscriber_count || 0).toLocaleString()}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('owner')}
              </label>
              <p>Admin User</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('country')}
              </label>
              <p>🇷🇺 Россия</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('status')}
              </label>
              <Badge variant="default" className="bg-green-100 text-green-800">
                {t('active')}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
