
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const ThemeToggle: React.FC = () => {
  const { state, toggleDarkMode } = useAppContext();

  const handleToggle = () => {
    toggleDarkMode();
    toast({
      title: state.darkMode ? "Light mode activated" : "Dark mode activated",
      description: state.darkMode 
        ? "Switched to light theme for better visibility in bright environments." 
        : "Switched to dark theme for reduced eye strain in low-light environments.",
      duration: 2000,
    });
  };

  return (
    <Button 
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="rounded-full hover:bg-primary/10"
      aria-label={state.darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {state.darkMode ? (
        <Sun className="h-5 w-5 text-yellow-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 transition-transform hover:-rotate-12" />
      )}
      <span className="sr-only">
        {state.darkMode ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </Button>
  );
};

export default ThemeToggle;
