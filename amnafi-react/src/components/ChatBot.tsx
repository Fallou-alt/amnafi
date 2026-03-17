'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour ! Je suis Jamila, votre assistante virtuelle AMNAFI. Comment puis-je vous aider aujourd\'hui ?',
      role: 'assistant',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const conversation = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('http://localhost:8000/api/public/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversation: conversation
        }),
      });

      const result = await response.json();

      if (result.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: result.data.message,
          role: 'assistant',
          timestamp: result.data.timestamp
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Erreur de réponse');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Désolé, je rencontre un problème technique. Pouvez-vous réessayer ?',
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white p-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Fenêtre de chat */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl border-2 border-orange-200 transition-all duration-300 flex flex-col ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 text-white p-5 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg block">Jamila</span>
              <span className="text-xs text-orange-100">Assistant AMNAFI</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-br from-orange-50/30 to-red-50/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap shadow-md ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                {message.content}
                
                {/* Bouton d'action si le message contient un lien vers /prestataire */}
                {message.role === 'assistant' && message.content.includes('/prestataire') && (
                  <a
                    href="/prestataire"
                    className="mt-3 block w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-center py-2 px-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    🚀 S'inscrire maintenant
                  </a>
                )}
              </div>
              
              {message.role === 'user' && (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-5 border-t-2 border-orange-100 bg-white rounded-b-2xl">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-400 text-sm transition-all"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={isTyping || !inputMessage.trim()}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-400 text-white p-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}