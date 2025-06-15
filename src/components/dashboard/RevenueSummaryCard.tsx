
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Partner {
  id: string;
  name: string;
  partnership_type: string;
}

interface Campaign {
  partner_id: string;
  status: string;
  price: number;
}

interface RevenueSummaryCardProps {
  partners: Partner[];
  campaigns: Campaign[];
  onViewAllPartners: () => void;
}

export const RevenueSummaryCard: React.FC<RevenueSummaryCardProps> = ({ 
  partners, 
  campaigns, 
  onViewAllPartners 
}) => {
  const { t } = useLanguage();

  // Calculate partner revenues from campaigns
  const getPartnerRevenue = (partnerId: string) => {
    return campaigns
      .filter(c => c.partner_id === partnerId && c.status === 'published')
      .reduce((sum, c) => sum + c.price, 0);
  };

  const totalRevenue = campaigns
    .filter(c => c.status === 'published')
    .reduce((sum, c) => sum + c.price, 0);

  return (
    <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
          <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          {t('revenue-summary')}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {t('partner-revenue-overview')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {t('total-revenue')}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t('revenue-by-partner')}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="font-bold text-green-600 dark:text-green-400 text-lg">
                  {totalRevenue.toLocaleString()} ₽
                </p>
              </div>
            </div>
          </div>
          
          {partners.slice(0, 3).map((partner) => {
            const partnerRevenue = getPartnerRevenue(partner.id);
            return (
              <div key={partner.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                    {partner.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {partner.partnership_type}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="font-bold text-green-600 dark:text-green-400 text-sm">
                    {partnerRevenue.toLocaleString()} ₽
                  </p>
                </div>
              </div>
            );
          })}
          {partners.length === 0 && (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              {t('no-partners')}
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          onClick={onViewAllPartners}
        >
          {t('view-all-partners')}
        </Button>
      </CardContent>
    </Card>
  );
};
