import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import UseCaseSelector, { UseCase } from '@/components/UseCaseSelector';
import CostCalculator from '@/components/CostCalculator';
import ValueCalculator from '@/components/ValueCalculator';
import ROIChart from '@/components/ROIChart';
import PDFReport from '@/components/PDFReport';
import HeaderControls from '@/components/HeaderControls';
import ScenarioManager from '@/components/ScenarioManager';
import IndustryPresets from '@/components/IndustryPresets';
import CustomizeParameters from '@/components/CustomizeParameters';
import { calculateCumulativeROI } from '@/utils/calculationUtils';
import { useAppContext } from '@/context/AppContext';

const Index = () => {
  const {
    state,
    updateSelectedUseCase,
    updateCosts,
    updateValues,
    currentScenario
  } = useAppContext();

  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [valueState, setValueState] = useState<Record<string, number>>({});

  const currentData = currentScenario === -1 ? state : state.scenarios[currentScenario];

  const selectedUseCase = currentData?.selectedUseCase || null;
  const costs = currentData?.costs || {};
  const values = useMemo(() => currentData?.values || {}, [currentData?.values]);

  // Sync global values to local lifted state only once on initial load
  useEffect(() => {
    if (
      selectedUseCase &&
      Object.keys(values).length > 0 &&
      Object.keys(valueState).length === 0
    ) {
      setValueState(values);
    }
  }, [selectedUseCase, values]);

  const fiveYearROI = useMemo(() => {
    if (Object.keys(costs).length > 0 && Object.keys(values).length > 0) {
      return calculateCumulativeROI(costs, values, 5);
    }
    return 0;
  }, [costs, values]);

  const handleCostChange = (newCosts: Record<string, number>) => {
    updateCosts(newCosts);
  };

  const handleValueChange = (newValues: Record<string, number>) => {
    updateValues(newValues);
  };

  const handleSelectUseCase = (useCase: UseCase | null) => {
    updateSelectedUseCase(useCase);
  };

  const handleApplyPreset = (
    { costs, values }: { costs: Record<string, number>, values: Record<string, number> },
    presetName: string
  ) => {
    if (presetName) {
      updateCosts(costs);
      updateValues(values);
      setValueState(values); // Sync to lifted state
    }
    setSelectedPreset(presetName || null);
  };

  const handleAddCustomParameter = (param: any) => {
    alert(`Custom parameter "${param.name}" would be added to ${param.category} parameters.`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <section className="mb-16 text-center">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
            AI Value Analysis Tool
          </span>
          <h1 className="font-medium tracking-tight mb-4">
            Quantify the Business Impact of AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Define your AI use case, adjust the parameters, and receive a detailed analysis of costs, benefits, and ROI over time.
          </p>
          <div className="mt-6 flex justify-center">
            <HeaderControls />
          </div>
        </section>

        <ScenarioManager />

        <div className="space-y-16 pb-20">
          <UseCaseSelector
            selectedUseCase={selectedUseCase}
            onSelectUseCase={handleSelectUseCase}
          />

          {selectedUseCase && (
            <>
              <IndustryPresets
                selectedPreset={selectedPreset}
                onApplyPreset={(presetData, name) => handleApplyPreset(presetData, name)}
              />

              <CostCalculator
                key={selectedPreset}
                onCostChange={handleCostChange}
                initialCosts={costs}
              />

              <CustomizeParameters onAddParameter={handleAddCustomParameter} />

              <ValueCalculator
                values={valueState}
                setValues={setValueState}
                onValueChange={handleValueChange}
              />

              {Object.keys(costs).length > 0 && Object.keys(values).length > 0 && (
                <>
                  <ROIChart costs={costs} values={values} />
                  <PDFReport
                    selectedUseCase={selectedUseCase}
                    costs={costs}
                    values={values}
                    fiveYearROI={fiveYearROI}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
