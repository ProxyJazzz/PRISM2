import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import { chatWithProposal } from '../api/evaluation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotPanelProps {
  proposalId: string;
}

export default function ChatbotPanel({ proposalId }: ChatbotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'I can help you understand this proposal evaluation. Ask me about methodology, novelty score, or request a summary.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const data = await chatWithProposal(proposalId, text);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response || data.message || 'No response received.' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, an error occurred. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-prism-accent/10 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-prism-accent/10 border border-prism-accent/20">
          <MessageSquare className="w-5 h-5 text-prism-accent" />
        </div>
        <div>
          <p className="text-sm font-bold text-prism-text">AI Assistant</p>
          <p className="text-xs text-prism-text-muted">Ask about this proposal</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="p-1.5 rounded-lg bg-prism-accent/10 border border-prism-accent/20 h-fit">
                  <Bot className="w-4 h-4 text-prism-accent" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-prism-accent/20 text-prism-text rounded-br-md'
                    : 'bg-prism-bg-alt text-prism-text-muted rounded-bl-md border border-prism-accent/10'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="p-1.5 rounded-lg bg-prism-glow/10 border border-prism-glow/20 h-fit">
                  <User className="w-4 h-4 text-prism-glow" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex gap-3">
            <div className="p-1.5 rounded-lg bg-prism-accent/10 border border-prism-accent/20 h-fit">
              <Bot className="w-4 h-4 text-prism-accent" />
            </div>
            <div className="bg-prism-bg-alt rounded-2xl rounded-bl-md px-4 py-3 border border-prism-accent/10">
              <Loader2 className="w-4 h-4 text-prism-accent animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-prism-accent/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about this proposal..."
            className="flex-1 bg-prism-bg/50 border border-prism-accent/20 rounded-xl px-4 py-2.5 text-sm text-prism-text placeholder:text-prism-text-muted/40 focus:outline-none focus:border-prism-accent/50 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-prism-accent hover:bg-prism-glow text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
