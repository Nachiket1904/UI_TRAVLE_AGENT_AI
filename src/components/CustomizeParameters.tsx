
import React, { useState } from 'react';
import { Plus, Settings, Check, X, Save, Trash2 } from 'lucide-react';

interface CustomParameter {
  id: string;
  name: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  category: 'cost' | 'value';
}

interface CustomizeParametersProps {
  onAddParameter: (param: CustomParameter) => void;
}

const CustomizeParameters: React.FC<CustomizeParametersProps> = ({ onAddParameter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newParameter, setNewParameter] = useState<CustomParameter>({
    id: '',
    name: '',
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
    unit: '',
    category: 'cost'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setNewParameter(prev => ({
      ...prev,
      [name]: name === 'defaultValue' || name === 'min' || name === 'max' || name === 'step' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate ID from name if not provided
    const parameterId = newParameter.id || newParameter.name.toLowerCase().replace(/\s+/g, '-');
    
    onAddParameter({
      ...newParameter,
      id: parameterId
    });
    
    // Reset form
    setNewParameter({
      id: '',
      name: '',
      defaultValue: 0,
      min: 0,
      max: 100,
      step: 1,
      unit: '',
      category: 'cost'
    });
    
    setIsOpen(false);
  };

  return (
    <div className="my-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Parameter</span>
        </button>
      ) : (
        <div className="bg-white/80 dark:bg-gray-800 p-4 rounded-lg border animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Add Custom Parameter
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Parameter Name</label>
                <input
                  type="text"
                  name="name"
                  value={newParameter.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., Training Costs"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={newParameter.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                  required
                >
                  <option value="cost">Cost</option>
                  <option value="value">Value</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Default Value</label>
                <input
                  type="number"
                  name="defaultValue"
                  value={newParameter.defaultValue}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Unit</label>
                <input
                  type="text"
                  name="unit"
                  value={newParameter.unit}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., $, %, hours"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Min Value</label>
                <input
                  type="number"
                  name="min"
                  value={newParameter.min}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Max Value</label>
                <input
                  type="number"
                  name="max"
                  value={newParameter.max}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Step</label>
                <input
                  type="number"
                  name="step"
                  value={newParameter.step}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Add Parameter
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomizeParameters;
