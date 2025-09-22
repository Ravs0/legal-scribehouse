import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Gavel, Scale, FileText } from 'lucide-react';

interface LegalCalloutProps {
  type: 'holding' | 'ratio' | 'obiter';
  children: ReactNode;
  className?: string;
}

const LegalCallout = ({ type, children, className }: LegalCalloutProps) => {
  const configs = {
    holding: {
      icon: Gavel,
      title: 'Holding',
      bgClass: 'bg-legal-holding-bg border-legal-holding',
      textClass: 'text-legal-holding',
    },
    ratio: {
      icon: Scale,
      title: 'Ratio Decidendi',
      bgClass: 'bg-legal-ratio-bg border-legal-ratio',
      textClass: 'text-legal-ratio',
    },
    obiter: {
      icon: FileText,
      title: 'Obiter Dictum',
      bgClass: 'bg-legal-obiter-bg border-legal-obiter',
      textClass: 'text-legal-obiter',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      'rounded-lg border-l-4 p-4 my-4',
      config.bgClass,
      className
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn('h-4 w-4', config.textClass)} />
        <h4 className={cn('font-semibold text-sm', config.textClass)}>
          {config.title}
        </h4>
      </div>
      <div className="text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default LegalCallout;