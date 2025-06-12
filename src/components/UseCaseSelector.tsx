
import React from 'react';
import { Check, ChevronDown, Users, Headphones, LineChart, ShoppingCart, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UseCase {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface UseCaseSelectorProps {
  selectedUseCase: UseCase | null;
  onSelectUseCase: (useCase: UseCase) => void;
}

const useCases: UseCase[] = [
  {
    id: 'customer-support',
    name: 'Customer Support',
    description: 'AI-powered chatbots and virtual assistants to handle customer inquiries',
    icon: <Headphones className="h-5 w-5" />,
  },
  {
    id: 'marketing',
    name: 'Marketing & Sales',
    description: 'Automated content creation and personalized customer interactions',
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Automated insights generation and pattern recognition in large datasets',
    icon: <LineChart className="h-5 w-5" />,
  },
  {
    id: 'hr',
    name: 'HR & Recruitment',
    description: 'Streamlined recruitment process and employee onboarding',
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: 'scheduling',
    name: 'Meeting Scheduling',
    description: 'Automated meeting scheduling and calendar management',
    icon: <Calendar className="h-5 w-5" />,
  }
];

const UseCaseSelector: React.FC<UseCaseSelectorProps> = ({
  selectedUseCase,
  onSelectUseCase
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full space-y-4 animate-slide-up">
      <div className="space-y-2">
        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
          Step 1
        </span>
        <h2 className="text-2xl font-semibold">Select an AI Use Case</h2>
        <p className="text-muted-foreground">
          Choose the AI implementation you want to analyze for ROI and value creation.
        </p>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white/50 backdrop-blur-md border border-border rounded-lg shadow-sm transition-all duration-200 hover:bg-white/70"
        >
          <div className="flex items-center gap-3">
            {selectedUseCase ? (
              <>
                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                  {selectedUseCase.icon}
                </div>
                <div className="text-left">
                  <p className="font-medium">{selectedUseCase.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUseCase.description}</p>
                </div>
              </>
            ) : (
              <span className="text-muted-foreground">Select a use case</span>
            )}
          </div>
          <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white/90 backdrop-blur-lg border border-border rounded-lg shadow-lg overflow-hidden animate-scale-in">
            <ul className="py-1 max-h-60 overflow-auto">
              {useCases.map((useCase) => (
                <li key={useCase.id}>
                  <button
                    type="button"
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200",
                      selectedUseCase?.id === useCase.id ? "bg-primary/10" : "hover:bg-secondary"
                    )}
                    onClick={() => {
                      onSelectUseCase(useCase);
                      setIsOpen(false);
                    }}
                  >
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                      {useCase.icon}
                    </div>
                    <div>
                      <p className="font-medium">{useCase.name}</p>
                      <p className="text-sm text-muted-foreground">{useCase.description}</p>
                    </div>
                    {selectedUseCase?.id === useCase.id && (
                      <Check className="h-5 w-5 text-primary ml-auto" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UseCaseSelector;
