
import React, { useState } from 'react';
import { Moon, Sun, Settings, Save, RefreshCw } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import ThemeToggle from './ThemeToggle';
import ExportOptions from './ExportOptions';
import { toast } from '@/hooks/use-toast';

const HeaderControls = () => {
  const { saveState, resetState } = useAppContext();
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = () => {
    setIsSaving(true);
    saveState();
    
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Progress saved",
        description: "Your analysis data has been saved locally.",
      });
    }, 500);
  };
  
  const handleReset = () => {
    if (window.confirm("This will reset all your data. Are you sure?")) {
      resetState();
      toast({
        title: "Data reset",
        description: "All analysis data has been reset to default values.",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <ExportOptions />
      
      <button
        onClick={handleSave}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-white/80 hover:bg-white border shadow-sm transition-colors dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            <span>Save</span>
          </>
        )}
      </button>
      
      <button
        onClick={handleReset}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-white/80 hover:bg-white border shadow-sm transition-colors dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Reset</span>
      </button>
      
      <div className="w-px h-6 bg-border mx-1"></div>
      
      <ThemeToggle />
    </div>
  );
};

export default HeaderControls;
