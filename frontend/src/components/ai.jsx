import { useState, useRef, useEffect } from 'react';

const BACKEND = 'http://localhost:5000';

const AiMechanic = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      content: 'Hello! I am your Auto AidX AI Mechanic. Describe the issue with your vehicle and I will help diagnose and fix it.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMsg = { id: Date.now(), role: 'user', content: inputValue };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      // Build the messages array for Groq (only role + content, not the local id)
      const groqMessages = updatedMessages.map(({ role, content }) => ({
        role: role === 'ai' ? 'assistant' : 'user',
        content,
      }));

      const res = await fetch(`${BACKEND}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: groqMessages }),
      });

      const data = await res.json();
      const aiReply = {
        id: Date.now() + 1,
        role: 'ai',
        content: data.reply || 'Sorry, I could not generate a response.',
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          content: '❌ Failed to reach AI service. Please make sure the backend is running.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#5a5b60] font-sans pb-16 animate-fade-in">
      
      {/* Hero Section */}
      <div className="bg-[#2d2e36] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-semibold mb-5 leading-tight tracking-wide">
            AI <span className="text-[#c8102e]">Mechanic</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Powered by advanced AI. Describe your vehicle's issue below, and our virtual mechanic will help you diagnose and resolve it.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="w-full bg-white border border-gray-200 shadow-2xl flex flex-col h-[65vh] overflow-hidden rounded-md">
          
          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                <div
                  className={`flex max-w-[85%] sm:max-w-[75%] gap-4 ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-[#c8102e] text-white'
                        : 'bg-[#f3f4f6] text-black border border-gray-200'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-[#c8102e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                         <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a2 2 0 00-1.6-.8H8.3a2 2 0 00-1.6.8L4 11l-5.16.86a1 1 0 00-.84.99V16h3" />
                         <circle cx="6.5" cy="16.5" r="2.5" />
                         <circle cx="16.5" cy="16.5" r="2.5" />
                         <path d="M15 8h.01" />
                      </svg>
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`p-5 text-[15px] shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-[#c8102e] text-white rounded-2xl rounded-tr-none'
                        : 'bg-[#f3f4f6] text-black border border-gray-100 rounded-2xl rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-4 max-w-[75%]">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-[#f3f4f6] border border-gray-200 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#c8102e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                         <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a2 2 0 00-1.6-.8H8.3a2 2 0 00-1.6.8L4 11l-5.16.86a1 1 0 00-.84.99V16h3" />
                         <circle cx="6.5" cy="16.5" r="2.5" />
                         <circle cx="16.5" cy="16.5" r="2.5" />
                         <path d="M15 8h.01" />
                      </svg>
                  </div>
                  <div className="bg-[#f3f4f6] border border-gray-100 p-5 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 sm:p-6 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
                placeholder="Describe your car's problem..."
                className="flex-1 bg-[#f3f4f6] text-black placeholder-gray-500 border border-transparent rounded-none px-5 py-4 focus:outline-none focus:border-gray-300 focus:bg-white hover:bg-white hover:shadow-sm focus:scale-[1.01] transition-all disabled:opacity-50 text-[15px]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-[#c8102e] hover:bg-[#a00c24] text-white rounded-none px-8 py-4 font-bold btn-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className="hidden sm:inline tracking-wide">Send</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiMechanic;