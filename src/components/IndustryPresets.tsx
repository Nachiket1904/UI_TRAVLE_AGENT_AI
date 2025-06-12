
import React, { useState } from 'react';
import { Database, Settings, Users, Check, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Preset {
  name: string;
  icon: React.ReactNode;
  costs: Record<string, number>;
  values: Record<string, number>;
}

// interface IndustryPresetsProps {
//   onApplyPreset: (preset: { costs: Record<string, number>, values: Record<string, number> }) => void;
// }

// Update the props interface
interface IndustryPresetsProps {
  selectedPreset: string | null;
  onApplyPreset: (preset: { 
    costs: Record<string, number>, 
    values: Record<string, number> 
  }, presetName: string) => void;
}

const presets: Preset[] = [
  {
    name: "Healthcare",
    icon: <Users className="h-5 w-5" />,
    costs: {
      implementation: 75000,
      api: 3000,
      infrastructure: 2000,
      maintenance: 20000
    },
    values: {
      "productivity": 25,
      "cost-reduction": 15,
      "revenue-growth": 8,
      "customer-satisfaction": 30,
      "employees-impacted": 120,
      "hourly-cost": 65
    }
  },
  {
    name: "Finance",
    icon: <Database className="h-5 w-5" />,
    costs: {
      implementation: 120000,
      api: 5000,
      infrastructure: 3500,
      maintenance: 35000
    },
    values: {
      "productivity": 30,
      "cost-reduction": 20,
      "revenue-growth": 12,
      "customer-satisfaction": 20,
      "employees-impacted": 80,
      "hourly-cost": 95
    }
  },
  {
    name: "Manufacturing",
    icon: <Settings className="h-5 w-5" />,
    costs: {
      implementation: 85000,
      api: 2500,
      infrastructure: 4000,
      maintenance: 25000
    },
    values: {
      "productivity": 18,
      "cost-reduction": 25,
      "revenue-growth": 10,
      "customer-satisfaction": 15,
      "employees-impacted": 200,
      "hourly-cost": 45
    }
  }
];

// const IndustryPresets: React.FC<IndustryPresetsProps> = ({ onApplyPreset }) => {
//   const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  
//   const handleSelectPreset = (preset: Preset) => {
//     setSelectedPreset(preset.name);
//     onApplyPreset({ costs: preset.costs, values: preset.values });
    
//     toast({
//       title: "Preset Applied",
//       description: `${preset.name} industry preset has been applied.`,
//     });
//   };
  
// proper code
// const IndustryPresets: React.FC<IndustryPresetsProps> = ({ onApplyPreset }) => {
// const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  
//   const handleSelectPreset = (preset: Preset) => {
//     // Reset selection if clicking the same preset again
//     setSelectedPreset(prev => prev === preset.name ? null : preset.name);
//     onApplyPreset({ costs: preset.costs, values: preset.values });
    
//     toast({
//       title: "Preset Applied",
//       description: `${preset.name} industry preset has been applied.`,
//     });
//   };

 // Remove internal state and use props
const IndustryPresets: React.FC<IndustryPresetsProps> = ({ 
  selectedPreset,
  onApplyPreset 
}) => {
  const handleSelectPreset = (preset: Preset) => {
    const newPreset = selectedPreset === preset.name ? null : preset.name;
    onApplyPreset(
      { costs: preset.costs, values: preset.values }, 
      newPreset || ''
    );
    
    toast({
      title: newPreset ? "Preset Applied" : "Preset Cleared",
      description: newPreset 
        ? `${preset.name} industry preset has been applied.`
        : "Returned to custom values",
    });
  };


  return (
    <div className="my-8 animate-fade-in">
      <h3 className="text-lg font-medium mb-4">Industry Presets</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handleSelectPreset(preset)}
            className={`flex items-center p-4 rounded-lg border transition-all ${
              selectedPreset === preset.name 
                ? 'bg-primary/10 border-primary' 
                : 'bg-white/50 hover:bg-white/80 border-border hover:border-primary/50 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            <div className="mr-3 p-2 rounded-md bg-primary/10 text-primary">
              {preset.icon}
            </div>
            <div className="text-left">
              <div className="font-medium">{preset.name}</div>
              <div className="text-xs text-muted-foreground">Industry preset</div>
            </div>
            {selectedPreset === preset.name && (
              <Check className="ml-auto h-5 w-5 text-primary" />
            )}
            {selectedPreset !== preset.name && (
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-50" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IndustryPresets;
