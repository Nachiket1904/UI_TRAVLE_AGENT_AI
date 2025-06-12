
import React, { useState } from 'react';
import { FileDown, FileText, Download, Check } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { generateYearlyData } from '@/utils/calculationUtils';
import { toast } from '@/hooks/use-toast';

interface ExportOptionsProps {
  className?: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ className = '' }) => {
  const [exporting, setExporting] = useState(false);
  const { state } = useAppContext();
  const { costs, values } = state;

  const exportCSV = () => {
    if (Object.keys(costs).length === 0 || Object.keys(values).length === 0) {
      toast({
        title: "Missing data",
        description: "Please complete the cost and value sections first.",
        variant: "destructive"
      });
      return;
    }

    setExporting(true);

    try {
      const yearlyData = generateYearlyData(costs, values, 5);
      
      // Create CSV header
      const headers = ['Year', 'Cost', 'Value', 'Net Value', 'ROI', 'Productivity', 'Cost Reduction', 'Revenue Growth', 'Customer Satisfaction'];
      
      // Create CSV rows
      const csvRows = [
        headers.join(','),
        ...yearlyData.map(row => [
          row.year,
          row.cost.toFixed(2),
          row.value.toFixed(2),
          row.netValue.toFixed(2),
          `${row.roi.toFixed(1)}%`,
          row.Productivity.toFixed(2),
          row['Cost Reduction'].toFixed(2),
          row['Revenue Growth'].toFixed(2),
          row['Customer Satisfaction'].toFixed(2)
        ].join(','))
      ];
      
      // Create a CSV string
      const csvString = csvRows.join('\n');
      
      // Create a Blob with the CSV data
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'ai_value_analysis.csv');
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: "CSV file has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "An error occurred while exporting data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  const exportExcel = () => {
    if (Object.keys(costs).length === 0 || Object.keys(values).length === 0) {
      toast({
        title: "Missing data",
        description: "Please complete the cost and value sections first.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Feature coming soon",
      description: "Excel export will be available in a future update.",
      variant: "default"
    });
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={exportCSV}
        disabled={exporting}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-white/80 hover:bg-white border shadow-sm transition-colors dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
      >
        {exporting ? <Check className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
        <span>CSV</span>
      </button>
      <button
        onClick={exportExcel}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-white/80 hover:bg-white border shadow-sm transition-colors dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
      >
        <Download className="h-4 w-4" />
        <span>Excel</span>
      </button>
    </div>
  );
};

export default ExportOptions;
