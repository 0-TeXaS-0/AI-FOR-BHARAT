'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AIAssistantContextType {
  isAIOpen: boolean;
  setIsAIOpen: (open: boolean) => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <AIAssistantContext.Provider value={{ isAIOpen, setIsAIOpen }}>
      {children}
    </AIAssistantContext.Provider>
  );
}

export function useAIAssistant() {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
}
