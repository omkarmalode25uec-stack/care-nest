import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  RotateCcw, 
  MapPin, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  Compass, 
  Building,
  HelpCircle,
  Minimize2,
  Info,
  CheckCircle2
} from 'lucide-react';
import { chatAssistant } from '../services/assistantService';
import { useTranslation } from '../context/LanguageContext';

export const KumbhAIAssistant = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Extract property ID if user is currently on /stays/:id
  const stayIdMatch = location.pathname.match(/^\/stays\/([a-zA-Z0-9_-]+)$/);
  const currentPropertyId = stayIdMatch ? stayIdMatch[1] : null;

  // Initial welcome message
  const initialMessages = [
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: "Namaste! 🙏 I am **KumbhVaani — Care Nest's multilingual pilgrim assistant**. I can help you find verified stays in Nashik & Trimbakeshwar, explain booking & trust audits, or guide you around the Godavari Snan Ghats.",
      properties: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const [messages, setMessages] = useState(initialMessages);

  // Quick Action Buttons
  const quickActions = [
    { label: "🔍 Find a Stay", query: "Show me verified stays in Nashik" },
    { label: "💰 Affordable Stays", query: "Show me affordable stays under ₹1500 in Nashik" },
    { label: "👨‍👩‍👧 Family Stays", query: "I need a family-friendly stay in Panchavati" },
    { label: "📋 How Booking Works", query: "How do I book a stay?" },
    { label: "🕉️ Explore Nashik", query: "What are important places to visit in Nashik?" },
  ];

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle sending a message
  const handleSendMessage = async (textToSend) => {
    const cleanText = (textToSend || inputValue).trim();
    if (!cleanText || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: cleanText,
      properties: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await chatAssistant({
        message: cleanText,
        currentPropertyId: currentPropertyId,
        history: messages.slice(-6).map((m) => ({ role: m.sender, content: m.text })),
      });

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: res.reply || "I couldn't find exact information. Please explore listings on the Find Stays page.",
        properties: res.properties || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('[Assistant Chat Error]', err);
      const errorMessage = {
        id: `assistant-err-${Date.now()}`,
        sender: 'assistant',
        text: "I'm sorry, I encountered a temporary connection issue. You can explore verified stays directly from the **Find Stays** page or ask another question.",
        properties: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
  };

  return (
    <>
      {/* 1. Floating Bottom-Right Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs sm:text-sm rounded-full shadow-2xl shadow-orange-950/30 hover:shadow-orange-950/40 transition-all transform hover:-translate-y-0.5 active:scale-95 border border-amber-300/40 cursor-pointer"
            aria-label="Open KumbhVaani — Care Nest AI Assistant"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-200 group-hover:rotate-12 transition-transform" />
            </div>
            <span>KumbhVaani</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </button>
        )}
      </div>

      {/* 2. Floating Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] md:w-[440px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-4 text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                <Bot className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white leading-tight">
                    KumbhVaani
                  </h3>
                  <span className="text-[10px] font-bold bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-full uppercase">
                    Care Nest
                  </span>
                </div>
                <p className="text-[11px] text-orange-100/90 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  <span>Online • Multilingual Pilgrim Assistant</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stay Context Banner (If viewing /stays/:id) */}
          {currentPropertyId && (
            <div className="px-3.5 py-2 bg-amber-50 border-b border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-1.5 shrink-0">
              <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                <strong>Stay Context Active:</strong> You can ask about Wi-Fi, AC, tariff, or rules for this property.
              </span>
            </div>
          )}

          {/* Messages Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-start gap-2 max-w-[88%]">
                  {msg.sender === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line space-y-1">
                      {msg.text.split('\n').map((line, i) => {
                        // Render simple bold markup
                        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        return (
                          <p
                            key={i}
                            dangerouslySetInnerHTML={{ __html: formatted }}
                            className="leading-relaxed"
                          />
                        );
                      })}
                    </div>

                    {/* Small Property Cards Preview */}
                    {msg.properties && msg.properties.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Verified Matches ({msg.properties.length}):
                        </span>
                        <div className="space-y-2">
                          {msg.properties.map((p) => {
                            const primaryImage =
                              p.images && p.images.length > 0
                                ? p.images[0]
                                : 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80';

                            return (
                              <div
                                key={p._id}
                                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange-400 transition flex items-center gap-2.5 text-left group"
                              >
                                <img
                                  src={primaryImage}
                                  alt={p.title}
                                  className="w-14 h-14 rounded-lg object-cover shrink-0 bg-slate-200"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <h5 className="font-bold text-slate-900 text-xs truncate group-hover:text-orange-600 transition">
                                      {p.title}
                                    </h5>
                                  </div>
                                  <p className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                    <span>{p.address || p.city}</span>
                                  </p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs font-black text-orange-600">
                                      ₹{p.pricePerNight?.toLocaleString('en-IN')}{' '}
                                      <span className="text-[9px] font-normal text-slate-400">/ night</span>
                                    </span>
                                    <Link
                                      to={`/stays/${p._id}`}
                                      onClick={() => setIsOpen(false)}
                                      className="inline-flex items-center gap-0.5 text-[10px] font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                                    >
                                      <span>View</span>
                                      <ArrowRight className="w-2.5 h-2.5" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[9px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Loading / Typing indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 rounded-tl-xs shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce"></span>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  ></span>
                  <span className="text-[11px] text-slate-400 ml-1 font-medium">
                    Assistant is searching verified database...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="p-2.5 bg-white border-t border-slate-100 shrink-0">
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickActions.map((qa, i) => (
                <button
                  key={i}
                  disabled={loading}
                  onClick={() => handleSendMessage(qa.query)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-slate-200/80 text-[11px] font-semibold text-slate-700 shrink-0 transition-colors cursor-pointer"
                >
                  {qa.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask: 'Family stay with AC' or 'How to book'..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder:text-slate-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputValue.trim()}
              className="p-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default KumbhAIAssistant;
