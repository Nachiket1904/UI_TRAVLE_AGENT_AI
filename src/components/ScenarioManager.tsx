
import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

const ScenarioManager: React.FC = () => {
  const { state, addScenario, removeScenario, setCurrentScenario, currentScenario } = useAppContext();
  const [newScenarioName, setNewScenarioName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddScenario = () => {
    if (!newScenarioName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your scenario.",
        variant: "destructive"
      });
      return;
    }

    addScenario(newScenarioName.trim());
    setNewScenarioName('');
    setIsAdding(false);
    toast({
      title: "Scenario created",
      description: `"${newScenarioName.trim()}" scenario has been created.`,
    });
  };

  const handleRemoveScenario = (index: number) => {
    const scenarioName = state.scenarios[index].name;
    removeScenario(index);
    toast({
      title: "Scenario removed",
      description: `"${scenarioName}" scenario has been removed.`,
    });
  };

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Scenarios</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Scenario</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={newScenarioName}
            onChange={(e) => setNewScenarioName(e.target.value)}
            placeholder="Scenario name"
            className="flex-1 px-3 py-2 text-sm border rounded-md bg-white/50 dark:bg-gray-800"
            autoFocus
          />
          <button
            onClick={handleAddScenario}
            className="bg-primary text-white p-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="bg-gray-200 dark:bg-gray-700 p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCurrentScenario(-1)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            currentScenario === -1
              ? 'bg-primary text-white'
              : 'bg-white/50 hover:bg-white/80 dark:bg-gray-800 dark:hover:bg-gray-700'
          }`}
        >
          Base Case
        </button>

        {state.scenarios.map((scenario, index) => (
          <div key={index} className="flex items-center gap-1">
            <button
              onClick={() => setCurrentScenario(index)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                currentScenario === index
                  ? 'bg-primary text-white'
                  : 'bg-white/50 hover:bg-white/80 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
            >
              {scenario.name}
            </button>
            <button
              onClick={() => handleRemoveScenario(index)}
              className="p-1 text-gray-400 hover:text-red-500 rounded"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScenarioManager;
