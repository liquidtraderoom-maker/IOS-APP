'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { agents, Agent, AgentMode } from '@/lib/agents';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestedTask?: {
    title: string;
    priority: 'high' | 'medium' | 'low';
  };
  suggestedEmail?: {
    to: string;
    subject: string;
    body: string;
  };
  timestamp: Date;
}

export default function SuitePage() {
  const params = useParams();
  const agentId = params.agent as string;
  const agent = agents.find(a => a.id === agentId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AgentMode>(agent?.defaultMode || 'supervised');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!agent) {
    return (
      <div className="min-h-screen bg-apex-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Agent not found</p>
          <Link href="/office" className="text-indigo-400 hover:underline">
            Return to Office
          </Link>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/meeting/one-on-one', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          message: input,
          mode,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.error || 'No response',
        suggestedTask: data.suggestedTask,
        suggestedEmail: data.suggestedEmail,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Connection error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-apex-dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-apex-card border-r border-apex-border p-4">
        <Link href="/office" className="text-gray-400 hover:text-white text-sm mb-6 block">
          ← Back to Office
        </Link>

        <div className="mb-6">
          <span className="text-4xl">{agent.avatar}</span>
          <h2 className="text-xl font-bold mt-2">{agent.name}</h2>
          <p className="text-sm text-gray-400">{agent.role}</p>
          <p className="text-xs text-gray-500 mt-1">Suite {agent.suiteNumber}</p>
        </div>

        {/* Mode Toggle */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Mode</p>
          <div className="space-y-2">
            {(['autonomous', 'supervised', 'paused'] as AgentMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  mode === m
                    ? 'bg-indigo-600 text-white'
                    : 'bg-apex-border text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  m === 'autonomous' ? 'bg-green-500' :
                  m === 'supervised' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Tools</p>
          <div className="space-y-1">
            {agent.tools.map((tool) => (
              <div key={tool} className="text-xs text-gray-400 bg-apex-border px-2 py-1 rounded">
                {tool}
              </div>
            ))}
          </div>
        </div>

        {/* Other Suites */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Switch Suite</p>
          <div className="space-y-1">
            {agents.filter(a => a.id !== agentId).map((a) => (
              <Link
                key={a.id}
                href={`/office/suite/${a.id}`}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-apex-border transition-colors"
              >
                <span>{a.avatar}</span>
                <span>{a.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-apex-card border-b border-apex-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{agent.avatar}</span>
            <div>
              <h1 className="font-semibold">{agent.name}'s Suite</h1>
              <p className="text-sm text-gray-500">{agent.suite} • Suite {agent.suiteNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              mode === 'autonomous' ? 'status-autonomous' :
              mode === 'supervised' ? 'status-supervised' : 'status-paused'
            }`} />
            <span className="text-sm text-gray-400 capitalize">{mode}</span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <span className="text-4xl block mb-4">{agent.avatar}</span>
              <p>Start a conversation with {agent.name}</p>
              <p className="text-sm mt-2">Ask about {agent.role.toLowerCase()} topics</p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-2xl rounded-lg px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-apex-card border border-apex-border'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Suggested Task */}
                {msg.suggestedTask && (
                  <div className="mt-3 p-3 bg-apex-border rounded border border-yellow-500/30">
                    <p className="text-xs text-yellow-500 mb-1">📋 Suggested Task</p>
                    <p className="text-sm font-medium">{msg.suggestedTask.title}</p>
                    <button className="mt-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded hover:bg-yellow-500/30">
                      Add to Queue
                    </button>
                  </div>
                )}

                {/* Suggested Email */}
                {msg.suggestedEmail && (
                  <div className="mt-3 p-3 bg-apex-border rounded border border-blue-500/30">
                    <p className="text-xs text-blue-500 mb-1">✉️ Suggested Email</p>
                    <p className="text-sm"><strong>To:</strong> {msg.suggestedEmail.to}</p>
                    <p className="text-sm"><strong>Subject:</strong> {msg.suggestedEmail.subject}</p>
                    <button className="mt-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/30">
                      Review & Send
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-apex-card border border-apex-border rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="animate-pulse">{agent.avatar}</span>
                  <span className="text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-apex-border p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Message ${agent.name}...`}
              className="flex-1 bg-apex-card border border-apex-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
