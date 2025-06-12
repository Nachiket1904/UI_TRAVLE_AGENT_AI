
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UseCase } from '@/components/UseCaseSelector';

interface AppState {
  darkMode: boolean;
  costs: Record<string, number>;
  values: Record<string, number>;
  selectedUseCase: UseCase | null;
  scenarios: Array<{
    name: string;
    costs: Record<string, number>;
    values: Record<string, number>;
    selectedUseCase: UseCase | null;
  }>;
}

interface AppContextType {
  state: AppState;
  toggleDarkMode: () => void;
  saveState: () => void;
  loadState: () => void;
  resetState: () => void;
  addScenario: (name: string) => void;
  removeScenario: (index: number) => void;
  setCurrentScenario: (index: number) => void;
  currentScenario: number;
  updateCosts: (costs: Record<string, number>) => void;
  updateValues: (values: Record<string, number>) => void;
  updateSelectedUseCase: (useCase: UseCase | null) => void;
}

const initialState: AppState = {
  darkMode: false,
  costs: {},
  values: {},
  selectedUseCase: null,
  scenarios: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [currentScenario, setCurrentScenarioState] = useState<number>(-1); // -1 means using main state

  // Load state from local storage on mount
  useEffect(() => {
    loadState();
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  const toggleDarkMode = () => {
    setState((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const saveState = () => {
    try {
      localStorage.setItem('aiValueAnalysis', JSON.stringify(state));
      console.log('State saved to local storage');
    } catch (error) {
      console.error('Failed to save state to local storage:', error);
    }
  };

  const loadState = () => {
    try {
      const savedState = localStorage.getItem('aiValueAnalysis');
      if (savedState) {
        setState(JSON.parse(savedState));
        console.log('State loaded from local storage');
      }
    } catch (error) {
      console.error('Failed to load state from local storage:', error);
    }
  };

  const resetState = () => {
    setState(initialState);
    setCurrentScenarioState(-1);
    localStorage.removeItem('aiValueAnalysis');
  };

  const addScenario = (name: string) => {
    const newScenario = {
      name,
      costs: { ...state.costs },
      values: { ...state.values },
      selectedUseCase: state.selectedUseCase,
    };

    setState((prev) => ({
      ...prev,
      scenarios: [...prev.scenarios, newScenario],
    }));
  };

  const removeScenario = (index: number) => {
    setState((prev) => ({
      ...prev,
      scenarios: prev.scenarios.filter((_, i) => i !== index),
    }));

    if (currentScenario === index) {
      setCurrentScenarioState(-1);
    } else if (currentScenario > index) {
      setCurrentScenarioState(currentScenario - 1);
    }
  };

  const setCurrentScenario = (index: number) => {
    setCurrentScenarioState(index);
  };

  const updateCosts = (costs: Record<string, number>) => {
    if (currentScenario === -1) {
      setState((prev) => ({ ...prev, costs }));
    } else {
      setState((prev) => {
        const updatedScenarios = [...prev.scenarios];
        updatedScenarios[currentScenario] = {
          ...updatedScenarios[currentScenario],
          costs,
        };
        return { ...prev, scenarios: updatedScenarios };
      });
    }
  };

  const updateValues = (values: Record<string, number>) => {
    if (currentScenario === -1) {
      setState((prev) => ({ ...prev, values }));
    } else {
      setState((prev) => {
        const updatedScenarios = [...prev.scenarios];
        updatedScenarios[currentScenario] = {
          ...updatedScenarios[currentScenario],
          values,
        };
        return { ...prev, scenarios: updatedScenarios };
      });
    }
  };

  const updateSelectedUseCase = (selectedUseCase: UseCase | null) => {
    if (currentScenario === -1) {
      setState((prev) => ({ ...prev, selectedUseCase }));
    } else {
      setState((prev) => {
        const updatedScenarios = [...prev.scenarios];
        updatedScenarios[currentScenario] = {
          ...updatedScenarios[currentScenario],
          selectedUseCase,
        };
        return { ...prev, scenarios: updatedScenarios };
      });
    }
  };

  const value = {
    state,
    toggleDarkMode,
    saveState,
    loadState,
    resetState,
    addScenario,
    removeScenario,
    setCurrentScenario,
    currentScenario,
    updateCosts,
    updateValues,
    updateSelectedUseCase,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
