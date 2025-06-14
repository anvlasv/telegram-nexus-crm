
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface PollPostFormProps {
  pollQuestion: string;
  pollOptions: string[];
  onPollQuestionChange: (question: string) => void;
  onPollOptionsChange: (options: string[]) => void;
}

export const PollPostForm: React.FC<PollPostFormProps> = ({
  pollQuestion,
  pollOptions,
  onPollQuestionChange,
  onPollOptionsChange,
}) => {
  const { t } = useLanguage();

  const addPollOption = () => {
    onPollOptionsChange([...pollOptions, '']);
  };

  const removePollOption = (index: number) => {
    onPollOptionsChange(pollOptions.filter((_, i) => i !== index));
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    onPollOptionsChange(newOptions);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="poll-question">{t('poll-question')}</Label>
        <Textarea
          id="poll-question"
          value={pollQuestion}
          onChange={(e) => onPollQuestionChange(e.target.value)}
          placeholder={t('poll-question')}
          rows={3}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>{t('poll-option')}</Label>
        {pollOptions.map((option, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={option}
              onChange={(e) => updatePollOption(index, e.target.value)}
              placeholder={`${t('poll-option')} ${index + 1}`}
              required={index < 2}
            />
            {index >= 2 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removePollOption(index)}
              >
                {t('remove-poll-option')}
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPollOption}
          disabled={pollOptions.length >= 10}
        >
          {t('add-poll-option')}
        </Button>
      </div>
    </div>
  );
};
