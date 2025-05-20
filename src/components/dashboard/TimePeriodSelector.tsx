import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { TimePeriod } from '@/lib/types';

interface TimePeriodSelectorProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
  disabled?: boolean;
}

export function TimePeriodSelector({ value, onChange, disabled = false }: TimePeriodSelectorProps) {
  // Time period options with display labels
  const periods: { value: TimePeriod; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' }
  ];

  // Get the current period's label
  const getCurrentLabel = (): string => {
    const period = periods.find(p => p.value === value);
    return period ? period.label : 'Select Period';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="min-w-36 flex items-center justify-between"
          disabled={disabled}
        >
          <span>{getCurrentLabel()}</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {periods.map((period) => (
          <DropdownMenuItem 
            key={period.value}
            onClick={() => onChange(period.value)}
            className={value === period.value ? "bg-accent/50" : ""}
          >
            {period.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}