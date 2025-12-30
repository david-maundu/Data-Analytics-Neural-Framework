
import React from 'react';
import AnalyticsNeuralFramework from './components/AnalyticsNeuralFramework.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AnalyticsNeuralFramework />
    </ThemeProvider>
  );
};

export default App;
