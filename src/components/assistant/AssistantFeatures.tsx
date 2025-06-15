
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface AssistantFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}

interface FeaturesProps {
  assistantFeatures: AssistantFeature[];
}

const AssistantFeatures: React.FC<FeaturesProps> = ({ assistantFeatures }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold flex items-center gap-2">
      <Sparkles className="h-5 w-5 text-primary" />
      AI-функции
    </h2>
    <div className="grid gap-4">
      {assistantFeatures.map((feature, index) => (
        <Card key={index} className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <feature.icon className="h-5 w-5 text-primary" />
              {feature.title}
            </CardTitle>
            <CardDescription>{feature.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" onClick={feature.onClick}>
              {feature.action}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default AssistantFeatures;
