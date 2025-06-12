
import React from 'react';
import Header from './Header';
import { useAppContext } from '@/context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state } = useAppContext();
  
  return (
    <div className={`min-h-screen ${state.darkMode ? 'dark' : ''} transition-colors duration-200`}>
      <div className={`min-h-screen ${state.darkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-b from-background to-background/80 text-foreground'}`}>
        <div className="relative z-10">
          <Header />
          <main className="container mx-auto px-4 py-8 animate-fade-in">
            {children}
          </main>
          <footer className="py-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} AI Value Analysis. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;
