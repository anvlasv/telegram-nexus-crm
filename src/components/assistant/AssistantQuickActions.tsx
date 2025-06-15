
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface QuickAction {
  label: string;
  onClick: () => void;
}

interface AssistantQuickActionsProps {
  quickActions: QuickAction[];
  t: (x: string) => string;
}

const AssistantQuickActions: React.FC<AssistantQuickActionsProps> = ({ quickActions, t }) => (
  <div className="flex flex-wrap gap-2">
    {quickActions.map((q, idx) => (
      <Badge
        key={idx}
        variant="secondary"
        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
        onClick={q.onClick}
      >
        {q.label}
      </Badge>
    ))}
  </div>
);

export default AssistantQuickActions;
