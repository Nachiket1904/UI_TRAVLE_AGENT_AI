
import React from 'react';
import { FileDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UseCase } from './UseCaseSelector';

interface PDFReportProps {
  selectedUseCase: UseCase | null;
  costs: Record<string, number>;
  values: Record<string, number>;
  fiveYearROI: number;
  isGenerating?: boolean;
}

const PDFReport: React.FC<PDFReportProps> = ({
  selectedUseCase,
  costs,
  values,
  fiveYearROI,
  isGenerating = false
}) => {
  const [downloadClicked, setDownloadClicked] = React.useState(false);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    company: '',
    role: '',
  });

  const handleDownload = () => {
    setIsFormOpen(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDownloadClicked(true);

    try {
      // Save the lead
      await fetch("https://ai-roi-analysis-m-labs.onrender.com/leads/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Download the PDF
      const response = await fetch("https://ai-roi-analysis-m-labs.onrender.com/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          selectedUseCase,
          costs,
          values,
          fiveYearROI,
          charts: {}
        }),
      });
      if (!response.ok) throw new Error("Failed to send email");

      // Wait for confirmation response (not needed, but nice to have)
      await response.json();

      // Delay close and reset after success
      setTimeout(() => {
        setDownloadClicked(false);
        setIsFormOpen(false);
        setFormData({ name: '', email: '', company: '', role: '' });
      }, 3500); // wait 3.5 seconds

    } catch (err) {
      console.error("Error sending report:", err);
      setDownloadClicked(false);
    }
  };


  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setDownloadClicked(true);
    
  //   // In a real application, you would:
  //   // 1. Send the lead information to your backend
  //   // 2. Generate a PDF with the analysis results
  //   // 3. Send the PDF to the user's email or trigger a download

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="w-full space-y-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            Final Step
          </span>
          <h2 className="text-2xl font-semibold">Get Your Detailed Report</h2>
          <p className="text-muted-foreground">
            Download a comprehensive analysis of your AI implementation value.
          </p>
        </div>
        
        <button
          onClick={handleDownload}
          disabled={!selectedUseCase || isGenerating || downloadClicked}
          className={cn(
            "px-4 py-2.5 rounded-md font-medium text-white transition-all duration-300",
            (!selectedUseCase || isGenerating || downloadClicked)
              ? "bg-muted-foreground cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg"
          )}
        >
          <span className="flex items-center gap-2">
            {downloadClicked ? (
              <>
                <Check className="h-5 w-5" />
                <span>Thank You!</span>
              </>
            ) : (
              <>
                <FileDown className="h-5 w-5" />
                <span>Download Full Report</span>
              </>
            )}
          </span>
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-1">Get Your AI Value Analysis</h3>
              <p className="text-muted-foreground mb-6">
                Fill in your details to receive your detailed report
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/50 border border-border rounded-md"
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/50 border border-border rounded-md"
                    placeholder="your.email@company.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/50 border border-border rounded-md"
                    placeholder="Your company name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Job Title
                  </label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/50 border border-border rounded-md"
                    placeholder="Your job title"
                  />
                </div>
                
                <div className="pt-2 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={downloadClicked}
                    className={cn(
                      "flex-1 px-4 py-2 bg-primary text-white rounded-md transition-colors",
                      downloadClicked ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"
                    )}
                  >
                    {downloadClicked ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="h-4 w-4" />
                        <span>Sent to Email</span>
                      </span>
                    ) : (
                      "Get Report"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-white/60 backdrop-blur-md border border-border rounded-lg shadow-sm">
          <h3 className="font-medium mb-3">What's included in your report:</h3>
          <ul className="space-y-2">
            {[
              'Detailed cost breakdown over 5 years',
              'Value creation analysis by category',
              'Year-by-year ROI calculations',
              'Payback period analysis',
              'Comparison with industry benchmarks',
              'Implementation recommendations',
              'Risk mitigation strategies'
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-5 bg-white/60 backdrop-blur-md border border-border rounded-lg shadow-sm">
          <h3 className="font-medium mb-3">Report preview:</h3>
          <div className="bg-white/50 border border-border rounded-md p-4 mb-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium">AI Value Analysis</p>
                <p className="text-sm text-muted-foreground">
                  {selectedUseCase ? selectedUseCase.name : 'Select a use case'}
                </p>
              </div>
              <div className="bg-primary/10 rounded-full px-3 py-1">
                <p className="text-xs font-medium text-primary">5-Year ROI: {fiveYearROI.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded w-5/6"></div>
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            The complete report will be delivered to your email after submission. Our team may reach out to discuss how we can help implement your AI solution for maximum value.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFReport;
