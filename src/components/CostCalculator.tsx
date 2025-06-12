
import React from 'react';
import { Sliders, DollarSign, Server, Clock } from 'lucide-react';

interface CostParameter {
  id: string;
  name: string;
  description: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}
interface ValueCalculatorProps {
  onValueChange: (values: Record<string, number>) => void;
  values: Record<string, number>;
  setValues: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

interface CostCalculatorProps {
  onCostChange: (costs: Record<string, number>) => void;
  initialCosts?: Record<string, number>;
}

const CostCalculator: React.FC<CostCalculatorProps> = ({ onCostChange, initialCosts = {} }) => {
  // Define cost parameters based on common AI implementation costs
  const costParameters: CostParameter[] = [
    {
      id: 'implementation',
      name: 'Implementation Cost',
      description: 'One-time cost to implement the AI solution',
      defaultValue: 50000,
      min: 10000,
      max: 1000000,
      step: 10000,
      unit: '$'
    },
    {
      id: 'api',
      name: 'API / Model Usage',
      description: 'Monthly cost for AI API calls or model usage',
      defaultValue: 2000,
      min: 500,
      max: 20000,
      step: 500,
      unit: '$/month'
    },
    {
      id: 'infrastructure',
      name: 'Cloud Infrastructure',
      description: 'Monthly cost for servers, storage, and computing resources',
      defaultValue: 1500,
      min: 500,
      max: 10000,
      step: 100,
      unit: '$/month'
    },
    {
      id: 'maintenance',
      name: 'Maintenance & Support',
      description: 'Annual cost for maintenance, updates, and support',
      defaultValue: 15000,
      min: 5000,
      max: 100000,
      step: 1000,
      unit: '$/year'
    }
  ];

  // Initialize state with proper default handling
  const [costs, setCosts] = React.useState<Record<string, number>>(() => {
    const initialCostsWithDefaults = { ...initialCosts };
    costParameters.forEach(param => {
      if (initialCosts[param.id] === undefined) {
        initialCostsWithDefaults[param.id] = param.defaultValue;
      }
    });
    return initialCostsWithDefaults;
  });

  // Update effect to handle initialCosts changes
  // React.useEffect(() => {
  //   const newCosts = { ...costs };
  //   let hasChanges = false;

  //   costParameters.forEach(param => {
  //     if (initialCosts[param.id] !== undefined && 
  //         initialCosts[param.id] !== newCosts[param.id]) {
  //       newCosts[param.id] = initialCosts[param.id];
  //       hasChanges = true;
  //     }
  //   });

  //   if (hasChanges) {
  //     setCosts(newCosts);
  //   }
  // }, [initialCosts]); // Only trigger when initialCosts changes
  // Replace the useEffect with this optimized version
React.useEffect(() => {
  const newCosts = { ...costs };
  let needsUpdate = false;

  // Only update parameters that exist in both current state and incoming props
  Object.keys(initialCosts).forEach(key => {
    if (costParameters.some(p => p.id === key) && initialCosts[key] !== newCosts[key]) {
      newCosts[key] = initialCosts[key];
      needsUpdate = true;
    }
  });

  if (needsUpdate) {
    setCosts(newCosts);
  }
}, [initialCosts]);


  React.useEffect(() => {
    onCostChange(costs);
  }, [costs, onCostChange]);

  const handleCostChange = (paramId: string, value: number) => {
    setCosts(prev => ({
      ...prev,
      [paramId]: value
    }));
  };

  return (
    <div className="w-full space-y-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
      <div className="space-y-2">
        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
          Step 2
        </span>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Cost Parameters</h2>
          <Sliders className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          Adjust the cost parameters for your AI implementation based on your specific requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {costParameters.map((param) => (
          <div 
            key={param.id}
            className="p-5 bg-white/50 backdrop-blur-md border border-border rounded-lg shadow-sm transition-all duration-200 hover:bg-white/70 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-md bg-primary/10 text-primary mt-1">
                {param.id === 'implementation' && <DollarSign className="h-5 w-5" />}
                {param.id === 'api' && <Server className="h-5 w-5" />}
                {param.id === 'infrastructure' && <Server className="h-5 w-5" />}
                {param.id === 'maintenance' && <Clock className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{param.name}</h3>
                <p className="text-sm text-muted-foreground">{param.description}</p>
                
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Value:</span>
                    <span className="font-medium">
                      {param.unit.startsWith('$') ? `${param.unit.charAt(0)}${costs[param.id].toLocaleString()}${param.unit.slice(1)}` : `${costs[param.id].toLocaleString()} ${param.unit}`}
                    </span>
                  </div>
                  
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={costs[param.id]}
                    onChange={(e) => handleCostChange(param.id, Number(e.target.value))}
                    className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer"
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{param.unit.startsWith('$') ? `${param.unit.charAt(0)}${param.min.toLocaleString()}` : param.min}</span>
                    <span>{param.unit.startsWith('$') ? `${param.unit.charAt(0)}${param.max.toLocaleString()}` : param.max}</span>
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

export default CostCalculator;
