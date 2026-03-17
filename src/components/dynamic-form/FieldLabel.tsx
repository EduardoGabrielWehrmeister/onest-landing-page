/**
 * FieldLabel Component
 *
 * Renders a label with optional tooltip icon
 * Reusable across all form field types
 */

import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface FieldLabelProps {
  htmlFor: string;
  label: string;
  required?: boolean;
  tooltipText?: string;
  className?: string;
}

export const FieldLabel = ({
  htmlFor,
  label,
  required = false,
  tooltipText,
  className = 'mb-2 block',
}: FieldLabelProps) => {
  return (
    <Label htmlFor={htmlFor} className={className}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
      {tooltipText && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 ml-1 inline-block text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </Label>
  );
};
