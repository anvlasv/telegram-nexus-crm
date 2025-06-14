
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  UserPlus, 
  Mail, 
  Phone, 
  MessageSquare, 
  Check, 
  X, 
  Eye, 
  Plus,
  Target,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePartners, useCreatePartner } from '@/hooks/usePartners';
import { useAdvertisingCampaigns } from '@/hooks/useAdvertisingCampaigns';
import { useToast } from '@/hooks/use-toast';
import { CreateCampaignModal } from './partners/CreateCampaignModal';
import { CampaignCard } from './partners/CampaignCard';

interface ContactInfo {
  email?: string;
  phone?: string;
}

export const Partners: React.FC = () => {
  const { t } = useLanguage();
  const { partners, updatePartnerStatus } = usePartners();
  const { data: campaigns = [] } = useAdvertisingCampaigns();
  const createPartner = useCreatePartner();
  const { toast } = useToast();
  
  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
    phone: '',
    partnership_type: 'advertiser',
    commission_rate: 10
  });
  
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);

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

  const handleCreatePartner = async () => {
    if (!newPartner.name || !newPartner.email) {
      toast({
        title: t('error'),
        description: 'Заполните обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createPartner.mutateAsync({
        name: newPartner.name,
        contact_info: {
          email: newPartner.email,
          phone: newPartner.phone
        },
        partnership_type: newPartner.partnership_type,
        commission_rate: newPartner.commission_rate,
        status: 'pending'
      });

      toast({
        title: t('success'),
        description: 'Партнер добавлен',
      });

      setIsAddPartnerOpen(false);
      setNewPartner({
        name: '',
        email: '',
        phone: '',
        partnership_type: 'advertiser',
        commission_rate: 10
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Ошибка при добавлении партнера',
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

  // Статистика
  const totalRevenue = campaigns
    .filter(c => c.status === 'published')
    .reduce((sum, c) => sum + c.price, 0);
  
  const activeCampaigns = campaigns.filter(c => ['approved', 'published'].includes(c.status)).length;
  const pendingCampaigns = campaigns.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('partners')}</h1>
          <p className="text-muted-foreground">
            Управление партнерскими отношениями и рекламными кампаниями
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateCampaignOpen(true)}>
            <Target className="mr-2 h-4 w-4" />
            Создать кампанию
          </Button>
          <Dialog open={isAddPartnerOpen} onOpenChange={setIsAddPartnerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
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
                  placeholder="Название компании *"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                />
                <Input
                  type="email"
                  placeholder="Email *"
                  value={newPartner.email}
                  onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
                />
                <Input
                  placeholder="Телефон"
                  value={newPartner.phone}
                  onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Комиссия (%)"
                  value={newPartner.commission_rate}
                  onChange={(e) => setNewPartner({...newPartner, commission_rate: Number(e.target.value)})}
                />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsAddPartnerOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleCreatePartner} disabled={createPartner.isPending}>
                    {createPartner.isPending ? 'Добавление...' : 'Добавить партнера'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Общий доход</p>
                <p className="text-xl font-bold">{totalRevenue} ₽</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Активные кампании</p>
                <p className="text-xl font-bold">{activeCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">На рассмотрении</p>
                <p className="text-xl font-bold">{pendingCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Всего партнеров</p>
                <p className="text-xl font-bold">{partners.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList>
          <TabsTrigger value="campaigns">Рекламные кампании</TabsTrigger>
          <TabsTrigger value="partners">Партнеры</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {campaigns.length > 0 ? (
            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Нет рекламных кампаний</h3>
                <p className="text-muted-foreground mb-4">
                  Создайте первую рекламную кампанию для работы с партнерами
                </p>
                <Button onClick={() => setIsCreateCampaignOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Создать кампанию
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="partners" className="space-y-4">
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
        </TabsContent>
      </Tabs>

      <CreateCampaignModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
      />
    </div>
  );
};
