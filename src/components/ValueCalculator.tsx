import React from 'react';
import { ArrowUpRight, Clock, DollarSign, Users, Heart } from 'lucide-react';

interface ValueParameter {
  id: string;
  name: string;
  description: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon: React.ReactNode;
}

interface ValueCalculatorProps {
  values: Record<string, number>;
  setValues: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onValueChange: (values: Record<string, number>) => void;
}

const ValueCalculator: React.FC<ValueCalculatorProps> = ({ values, setValues, onValueChange }) => {
  const valueParameters: ValueParameter[] = [
    {
      id: 'productivity',
      name: 'Productivity Improvement',
      description: 'Expected increase in employee productivity',
      defaultValue: 20,
      min: 5,
      max: 50,
      step: 1,
      unit: '%',
      icon: <Clock className="h-5 w-5" />
    },
    {
      id: 'cost-reduction',
      name: 'Cost Reduction',
      description: 'Expected reduction in operational costs',
      defaultValue: 15,
      min: 5,
      max: 40,
      step: 1,
      unit: '%',
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      id: 'revenue-growth',
      name: 'Revenue Growth',
      description: 'Expected increase in revenue',
      defaultValue: 10,
      min: 1,
      max: 30,
      step: 1,
      unit: '%',
      icon: <ArrowUpRight className="h-5 w-5" />
    },
    {
      id: 'customer-satisfaction',
      name: 'Customer Satisfaction',
      description: 'Expected improvement in customer satisfaction',
      defaultValue: 25,
      min: 5,
      max: 60,
      step: 1,
      unit: '%',
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: 'employees-impacted',
      name: 'Employees Impacted',
      description: 'Number of employees affected by the AI implementation',
      defaultValue: 50,
      min: 5,
      max: 1000,
      step: 5,
      unit: '',
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 'hourly-cost',
      name: 'Average Hourly Cost',
      description: 'Average hourly cost of an employee',
      defaultValue: 45,
      min: 15,
      max: 500,
      step: 10,
      unit: '$/hour',
      icon: <DollarSign className="h-5 w-5" />
    }
  ];

  const handleValueChange = (paramId: string, value: number) => {
    const updated = { ...values, [paramId]: value };
    setValues(updated);
    onValueChange(updated);
  };

  return (
    <div className="w-full space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <div className="space-y-2">
        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
          Step 3
        </span>
        <h2 className="text-2xl font-semibold">Value Parameters</h2>
        <p className="text-muted-foreground">
          Define the expected value and benefits your organization will gain from the AI implementation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {valueParameters.map((param) => (
          <div key={param.id} className="p-5 bg-white/50 backdrop-blur-md border border-border rounded-lg shadow-sm transition-all duration-200 hover:bg-white/70 dark:bg-gray-800/50 dark:hover:bg-gray-800/70">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-md bg-primary/10 text-primary mt-1">
                {param.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{param.name}</h3>
                <p className="text-sm text-muted-foreground">{param.description}</p>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Value:</span>
                    <span className="font-medium">
                      {param.id === 'employees-impacted' 
                        ? values[param.id]?.toLocaleString()
                        : param.unit.startsWith('$') 
                          ? `${param.unit.charAt(0)}${values[param.id]?.toLocaleString()}${param.unit.slice(1)}`
                          : `${values[param.id]?.toLocaleString()}${param.unit}`}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={values[param.id] ?? param.defaultValue}
                    onChange={(e) => handleValueChange(param.id, Number(e.target.value))}
                    className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer"
                  />

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{param.unit.startsWith('$') ? `$${param.min}` : `${param.min}${param.unit}`}</span>
                    <span>{param.unit.startsWith('$') ? `$${param.max}` : `${param.max}${param.unit}`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValueCalculator;
