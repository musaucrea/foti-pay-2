import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Sparkles, User, Bot } from 'lucide-react';
import { getTravelAdvice } from '../services/geminiService';

export const AiTravelGuide: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    {role: 'bot', text: "Jambo! I'm your FoTI Guide. I can help you find verified merchants, explain local customs, or help you negotiate safely. What do you need?"}
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await getTravelAdvice(userMsg, "Nairobi, Kenya");

    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsLoading(false);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    // Optional: Auto send
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-safari-400 to-safari-600 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">FoTI Guide</h2>
            <div className="flex items-center gap-1 text-xs text-trust-700">
               <span className="w-2 h-2 bg-trust-500 rounded-full animate-pulse"></span>
               Online • AI-Powered
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-gray-200' : 'bg-safari-100'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-gray-600" /> : <Bot className="w-4 h-4 text-safari-600" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-gray-900 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                 {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex gap-2 items-center">
                <span className="w-2 h-2 bg-safari-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-safari-500 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-safari-600 rounded-full animate-bounce delay-150"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-20">
        {/* Quick Prompts */}
        {messages.length < 3 && (
          <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-2">
            {["Is tipping customary?", "Safe taxi apps?", "Best coffee nearby?"].map((p) => (
              <button 
                key={p} 
                onClick={() => handleQuickPrompt(p)}
                className="whitespace-nowrap px-3 py-1.5 bg-gray-100 hover:bg-safari-50 text-gray-600 hover:text-safari-700 text-xs rounded-full border border-gray-200 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Nairobi..."
            className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-safari-500/50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-safari-500 rounded-full flex items-center justify-center text-white hover:bg-safari-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-transform active:scale-95"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};