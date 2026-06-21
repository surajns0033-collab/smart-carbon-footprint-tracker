import React from 'react';
import { AIChat } from '../components/AIChat';

const AIChatPage: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto h-[calc(100vh-100px)]">
      <AIChat />
    </div>
  );
};

export default AIChatPage;
