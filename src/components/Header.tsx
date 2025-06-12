
import React from 'react';
import { BarChart3, FileDown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-6 backdrop-blur-sm bg-background/70 border-b border-border/40 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">AI Value Analysis</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a 
                href="#" 
                className="text-foreground/80 hover:text-primary transition-colors duration-200"
              >
                Methodology
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-foreground/80 hover:text-primary transition-colors duration-200"
              >
                About
              </a>
            </li>
            <li>
              <button 
                className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
              >
                <FileDown className="h-4 w-4" />
                <span>Get Report</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
