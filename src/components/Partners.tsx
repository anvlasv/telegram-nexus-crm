
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Mail, Phone, MessageSquare, Check, X, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePartners } from '@/hooks/usePartners';
import { useToast } from '@/hooks/use-toast';

interface ContactInfo {
  email?: string;
  phone?: string;
}

export const Partners: React.FC = () => {
  const { t } = useLanguage();
  const { partners, updatePartnerStatus } = usePartners();
  const { toast } = useToast();
  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'advertiser'
  });

  const handleAcceptPartner = async (partnerId: string) => {
    try {
      await updatePartnerStatus(partnerId, 'active');
      toast({
        title: t('success'),
        description: 'Партнер одобрен',
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Ошибка при одобрении партнера',
        variant: 'destructive',
      });
    }
  };

  const handleDeclinePartner = async (partnerId: string) => {
    try {
      await updatePartnerStatus(partnerId, 'inactive');
      toast({
        title: t('success'),
        description: 'Партнер отклонен',
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Ошибка при отклонении партнера',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getContactInfo = (contactInfo: any): ContactInfo => {
    if (typeof contactInfo === 'string') {
      try {
        return JSON.parse(contactInfo);
      } catch {
        return {};
      }
    }
    return contactInfo || {};
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('partners')}</h1>
          <p className="text-muted-foreground">
            Управление партнерскими отношениями и рекламодателями
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              Добавить партнера
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый партнер</DialogTitle>
              <DialogDescription>
                Добавьте информацию о новом партнере
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Название компании"
                value={newPartner.name}
                onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
              />
              <Input
                type="email"
                placeholder="Email"
                value={newPartner.email}
                onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
              />
              <Input
                placeholder="Телефон"
                value={newPartner.phone}
                onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})}
              />
              <Button className="w-full">
                Добавить партнера
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {partners.map((partner) => {
          const contactInfo = getContactInfo(partner.contact_info);
          
          return (
            <Card key={partner.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{partner.name}</h3>
                      <Badge className={getStatusColor(partner.status || 'pending')}>
                        {t(partner.status || 'pending')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {contactInfo.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {contactInfo.email}
                        </div>
                      )}
                      {contactInfo.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {contactInfo.phone}
                        </div>
                      )}
                    </div>
                    {partner.commission_rate && (
                      <p className="text-sm">
                        Комиссия: {partner.commission_rate}%
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {partner.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleAcceptPartner(partner.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeclinePartner(partner.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
