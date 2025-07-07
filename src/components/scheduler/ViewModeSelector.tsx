
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { List, Calendar as CalendarIcon, Search, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ViewModeSelectorProps {
  viewMode: 'list' | 'calendar';
  onViewModeChange: (mode: 'list' | 'calendar') => void;
  searchOpen: boolean;
  searchQuery: string;
  onSearchToggle: () => void;
  onSearchQueryChange: (query: string) => void;
}

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  viewMode,
  onViewModeChange,
  searchOpen,
  searchQuery,
  onSearchToggle,
  onSearchQueryChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex gap-2">
        <Button 
          variant={viewMode === 'list' ? 'default' : 'outline'} 
          onClick={() => onViewModeChange('list')}
          size="default"
          className="flex-1 md:flex-initial"
        >
          <List className="mr-2 h-4 w-4" />
          <span>{t('list')}</span>
        </Button>
        <Button 
          variant={viewMode === 'calendar' ? 'default' : 'outline'} 
          onClick={() => onViewModeChange('calendar')}
          size="default"
          className="flex-1 md:flex-initial"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{t('calendar')}</span>
        </Button>
      </div>
      
      {/* Search Bar - только для списочного режима */}
      {viewMode === 'list' && (
        <div className="flex items-center justify-end gap-2">
          <div className={cn(
            "relative transition-all duration-300 ease-in-out",
            searchOpen ? "w-40 sm:w-48 md:w-64" : "w-0"
          )}>
            <Input
              placeholder={t('search-posts-placeholder') || 'Поиск по постам...'}
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className={cn(
                "w-full h-10 pl-4 pr-4 transition-opacity",
                !searchOpen && "opacity-0 p-0 border-0"
              )}
              disabled={!searchOpen}
              ref={input => searchOpen && input?.focus()}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onSearchToggle}
            className="h-10 w-10 flex-shrink-0"
          >
            {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );
};
