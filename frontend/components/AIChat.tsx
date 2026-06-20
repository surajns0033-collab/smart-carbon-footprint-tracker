import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export const AIChat: React.FC = () => {
  const { profile, stats } = useAppContext();
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!profile) return;

    // Initialize the chat session with deep context about the user and the app
    const systemInstruction = `You are the Smart Carbon Tracker AI Assistant.
    
    User Context:
    - Name: ${profile.userName || 'User'}
    - Location: ${profile.city}, ${profile.state}, ${profile.country}
    - Preferred Language: ${profile.language}
    - Current Goal: ${profile.goal}
    
    User's Current Stats:
    - Carbon Score: ${stats.carbonScore} kg (Lower is better)
    - Green XP: ${stats.greenXP} (Level ${stats.level})
    - Health Score: ${stats.healthyLivingScore}/100
    - CO2 Saved: ${stats.co2SavedKg} kg
    - Money Saved: $${stats.moneySaved}
    
    App Context & Features:
    - The app tracks carbon footprints, healthy living, and government climate targets.
    - "Green XP" is earned by completing eco-friendly tasks and logging activities.
    - "Gov Targets" shows live data on national Net Zero goals and renewable energy.
    - "What If Simulator" lets users see the impact of lifestyle changes.
    - "Carbon Source Library" explains the impact of 1000+ activities.
    
    Your Job:
    1. Answer questions about sustainability, carbon footprints, and climate change.
    2. Explain the user's specific data and app features if they ask.
    3. Provide localized advice based on their country/city (${profile.city}, ${profile.country}).
    4. CRITICAL: ALWAYS respond in the user's preferred language: ${profile.language}.
    5. Be encouraging, concise, and friendly.`;

    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    // Set initial greeting
    setMessages([
      { role: 'model', text: `Hello ${profile.userName || ''}! I am your AI Sustainability Assistant. I can help you understand your stats, explain app features, or give eco-friendly tips specific to ${profile.country}. I will communicate with you in ${profile.language}. How can I help you today?` }
    ]);
  }, [profile, stats]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatRef.current) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg });

      if (response.text) {
        setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <Bot size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">AI Eco Assistant</h1>
          <p className="text-gray-500">Ask questions and get smart sustainability advice tailored to you.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-eco-100 text-eco-600' : 'bg-blue-100 text-blue-600'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-eco-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Bot size={20} />
              </div>
              <div className="p-4 rounded-2xl bg-gray-100 text-gray-800 rounded-tl-none flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Ask me anything in ${profile?.language || 'English'}...`}
              className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-4 rounded-xl transition-colors flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
