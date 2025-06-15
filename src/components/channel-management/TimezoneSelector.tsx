
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Расширенный список часовых поясов
const TIMEZONES = [
  // Россия и СНГ
  { value: 'Europe/Kaliningrad', label: 'Калининград (UTC+2)' },
  { value: 'Europe/Moscow', label: 'Москва (UTC+3)' },
  { value: 'Europe/Samara', label: 'Самара (UTC+4)' },
  { value: 'Asia/Yekaterinburg', label: 'Екатеринбург (UTC+5)' },
  { value: 'Asia/Omsk', label: 'Омск (UTC+6)' },
  { value: 'Asia/Krasnoyarsk', label: 'Красноярск (UTC+7)' },
  { value: 'Asia/Irkutsk', label: 'Иркутск (UTC+8)' },
  { value: 'Asia/Yakutsk', label: 'Якутск (UTC+9)' },
  { value: 'Asia/Vladivostok', label: 'Владивосток (UTC+10)' },
  { value: 'Asia/Magadan', label: 'Магадан (UTC+11)' },
  { value: 'Asia/Kamchatka', label: 'Камчатка (UTC+12)' },
  
  // СНГ
  { value: 'Europe/Kiev', label: 'Киев (UTC+2)' },
  { value: 'Europe/Minsk', label: 'Минск (UTC+3)' },
  { value: 'Asia/Almaty', label: 'Алматы (UTC+6)' },
  { value: 'Asia/Tashkent', label: 'Ташкент (UTC+5)' },
  { value: 'Asia/Yerevan', label: 'Ереван (UTC+4)' },
  { value: 'Asia/Baku', label: 'Баку (UTC+4)' },
  { value: 'Asia/Bishkek', label: 'Бишкек (UTC+6)' },
  { value: 'Asia/Dushanbe', label: 'Душанбе (UTC+5)' },
  { value: 'Asia/Ashgabat', label: 'Ашхабад (UTC+5)' },
  
  // Европа
  { value: 'Europe/London', label: 'Лондон (UTC+0)' },
  { value: 'Europe/Paris', label: 'Париж (UTC+1)' },
  { value: 'Europe/Berlin', label: 'Берлин (UTC+1)' },
  { value: 'Europe/Rome', label: 'Рим (UTC+1)' },
  { value: 'Europe/Madrid', label: 'Мадрид (UTC+1)' },
  { value: 'Europe/Amsterdam', label: 'Амстердам (UTC+1)' },
  { value: 'Europe/Brussels', label: 'Брюссель (UTC+1)' },
  { value: 'Europe/Vienna', label: 'Вена (UTC+1)' },
  { value: 'Europe/Prague', label: 'Прага (UTC+1)' },
  { value: 'Europe/Warsaw', label: 'Варшава (UTC+1)' },
  { value: 'Europe/Stockholm', label: 'Стокгольм (UTC+1)' },
  { value: 'Europe/Oslo', label: 'Осло (UTC+1)' },
  { value: 'Europe/Helsinki', label: 'Хельсинки (UTC+2)' },
  { value: 'Europe/Athens', label: 'Афины (UTC+2)' },
  { value: 'Europe/Istanbul', label: 'Стамбул (UTC+3)' },
  
  // Америка
  { value: 'America/New_York', label: 'Нью-Йорк (UTC-5)' },
  { value: 'America/Chicago', label: 'Чикаго (UTC-6)' },
  { value: 'America/Denver', label: 'Денвер (UTC-7)' },
  { value: 'America/Los_Angeles', label: 'Лос-Анджелес (UTC-8)' },
  { value: 'America/Toronto', label: 'Торонто (UTC-5)' },
  { value: 'America/Vancouver', label: 'Ванкувер (UTC-8)' },
  { value: 'America/Mexico_City', label: 'Мехико (UTC-6)' },
  { value: 'America/Sao_Paulo', label: 'Сан-Паулу (UTC-3)' },
  { value: 'America/Buenos_Aires', label: 'Буэнос-Айрес (UTC-3)' },
  
  // Азия
  { value: 'Asia/Tokyo', label: 'Токио (UTC+9)' },
  { value: 'Asia/Seoul', label: 'Сеул (UTC+9)' },
  { value: 'Asia/Shanghai', label: 'Шанхай (UTC+8)' },
  { value: 'Asia/Hong_Kong', label: 'Гонконг (UTC+8)' },
  { value: 'Asia/Singapore', label: 'Сингапур (UTC+8)' },
  { value: 'Asia/Bangkok', label: 'Бангкок (UTC+7)' },
  { value: 'Asia/Jakarta', label: 'Джакарта (UTC+7)' },
  { value: 'Asia/Manila', label: 'Манила (UTC+8)' },
  { value: 'Asia/Kuala_Lumpur', label: 'Куала-Лумпур (UTC+8)' },
  { value: 'Asia/Mumbai', label: 'Мумбаи (UTC+5:30)' },
  { value: 'Asia/Delhi', label: 'Дели (UTC+5:30)' },
  { value: 'Asia/Kolkata', label: 'Калькутта (UTC+5:30)' },
  { value: 'Asia/Dhaka', label: 'Дакка (UTC+6)' },
  { value: 'Asia/Karachi', label: 'Карачи (UTC+5)' },
  { value: 'Asia/Tehran', label: 'Тегеран (UTC+3:30)' },
  { value: 'Asia/Dubai', label: 'Дубай (UTC+4)' },
  { value: 'Asia/Riyadh', label: 'Эр-Рияд (UTC+3)' },
  { value: 'Asia/Jerusalem', label: 'Иерусалим (UTC+2)' },
  
  // Африка
  { value: 'Africa/Cairo', label: 'Каир (UTC+2)' },
  { value: 'Africa/Lagos', label: 'Лагос (UTC+1)' },
  { value: 'Africa/Johannesburg', label: 'Йоханнесбург (UTC+2)' },
  { value: 'Africa/Casablanca', label: 'Касабланка (UTC+1)' },
  
  // Океания
  { value: 'Australia/Sydney', label: 'Сидней (UTC+10)' },
  { value: 'Australia/Melbourne', label: 'Мельбурн (UTC+10)' },
  { value: 'Australia/Perth', label: 'Перт (UTC+8)' },
  { value: 'Pacific/Auckland', label: 'Окленд (UTC+12)' },
  { value: 'Pacific/Fiji', label: 'Фиджи (UTC+12)' },
];

interface TimezoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div>
      <Label className="text-gray-900 dark:text-gray-100">Часовой пояс</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-h-60">
          {TIMEZONES.map((tz) => (
            <SelectItem key={tz.value} value={tz.value} className="text-gray-900 dark:text-gray-100">
              {tz.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
