'use client';

import { useState } from 'react';
import Link from 'next/link';
import { agents, Agent } from '@/lib/agents';

interface AgentResponse {
  agentId: string;
  agentName: string;
  response: string;
  suggestedTask?: {
    title: string;
    priority: string;
    assignee?: string;
  };
}

interface MeetingResult {
  agenda: string;
  responses: AgentResponse[];
  tasks: any[];
  participantCount: number;
}

export default function BoardroomPage() {
  const [agenda, setAgenda] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>(agents.map(a => a.id));
  const [isLoading, setIsLoading] = useState(false);
  const [meetingResult, setMeetingResult] = useState<MeetingResult | null>(null);
  const [speakingAgent, setSpeakingAgent] = useState<string | null>(null);

  const toggleAgent = (agentId: string) => {
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const startMeeting = async () => {
    if (!agenda.trim() || selectedAgents.length === 0) return;

    setIsLoading(true);
    setMeetingResult(null);

    try {
      const response = await fetch('/api/meeting/boardroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agenda,
          participants: selectedAgents,
        }),
      });

      const data = await response.json();
      setMeetingResult(data);
    } catch (error) {
      console.error('Meeting error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = (agentId: string, text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onstart = () => setSpeakingAgent(agentId);
      utterance.onend = () => setSpeakingAgent(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingAgent(null);
    }
  };

  return (
    <div className="min-h-screen bg-apex-dark p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <Link href="/office" className="text-gray-400 hover:text-white text-sm mb-2 block">
            ← Back to Office
          </Link>
          <h1 className="text-3xl font-bold">🎯 Executive Boardroom</h1>
          <p className="text-gray-500">Multi-Agent Strategy Session</p>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Panel - Meeting Setup */}
        <div className="col-span-1 space-y-6">
          {/* Participant Selection */}
          <div className="bg-apex-card rounded-xl border border-apex-border p-6">
            <h2 className="text-lg font-semibold mb-4">Meeting Participants</h2>
            <div className="space-y-2">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    selectedAgents.includes(agent.id)
                      ? 'bg-indigo-600/20 border border-indigo-500'
                      : 'bg-apex-border hover:bg-gray-700 border border-transparent'
                  }`}
                >
                  <span className="text-2xl">{agent.avatar}</span>
                  <div className="text-left flex-1">
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-xs text-gray-500">{agent.role}</p>
                  </div>
                  {selectedAgents.includes(agent.id) && (
                    <span className="text-indigo-400">✓</span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {selectedAgents.length} of {agents.length} selected
            </p>
          </div>

          {/* Agenda Input */}
          <div className="bg-apex-card rounded-xl border border-apex-border p-6">
            <h2 className="text-lg font-semibold mb-4">Meeting Agenda</h2>
            <textarea
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="Enter the meeting agenda or discussion topic..."
              className="w-full h-32 bg-apex-border border-none rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
            <button
              onClick={startMeeting}
              disabled={isLoading || !agenda.trim() || selectedAgents.length === 0}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
            >
              {isLoading ? 'Meeting in Progress...' : '🎙️ Start Meeting'}
            </button>
          </div>

          {/* Voice Controls */}
          {speakingAgent && (
            <div className="bg-apex-card rounded-xl border border-green-500/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm">
                    {agents.find(a => a.id === speakingAgent)?.name} is speaking...
                  </span>
                </div>
                <button
                  onClick={stopSpeaking}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Stop
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Meeting Results */}
        <div className="col-span-2">
          {!meetingResult && !isLoading && (
            <div className="bg-apex-card rounded-xl border border-apex-border p-12 text-center">
              <span className="text-6xl block mb-4">🎯</span>
              <h3 className="text-xl font-semibold mb-2">Ready for Meeting</h3>
              <p className="text-gray-500">
                Select participants, enter an agenda, and start the meeting
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-apex-card rounded-xl border border-apex-border p-12 text-center">
              <div className="flex justify-center gap-4 mb-4">
                {selectedAgents.map(id => {
                  const agent = agents.find(a => a.id === id);
                  return (
                    <span key={id} className="text-4xl animate-bounce" style={{ animationDelay: `${selectedAgents.indexOf(id) * 0.1}s` }}>
                      {agent?.avatar}
                    </span>
                  );
                })}
              </div>
              <p className="text-gray-400">Team is discussing...</p>
            </div>
          )}

          {meetingResult && (
            <div className="space-y-4">
              {/* Meeting Header */}
              <div className="bg-apex-card rounded-xl border border-apex-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Agenda</p>
                    <p className="font-medium">{meetingResult.agenda}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{meetingResult.participantCount} participants</p>
                    <p className="text-sm text-gray-500">{meetingResult.tasks.length} action items</p>
                  </div>
                </div>
              </div>

              {/* Agent Responses */}
              {meetingResult.responses.map((response, index) => {
                const agent = agents.find(a => a.id === response.agentId);
                return (
                  <div
                    key={response.agentId}
                    className={`bg-apex-card rounded-xl border p-6 transition-all ${
                      speakingAgent === response.agentId
                        ? 'border-green-500 glow-green'
                        : 'border-apex-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{agent?.avatar}</span>
                        <div>
                          <p className="font-semibold">{response.agentName}</p>
                          <p className="text-sm text-gray-500">{agent?.role}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => speakResponse(response.agentId, response.response)}
                        className="text-indigo-400 hover:text-indigo-300 text-sm"
                      >
                        🔊 Speak
                      </button>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{response.response}</p>

                    {response.suggestedTask && (
                      <div className="mt-4 p-3 bg-apex-border rounded-lg border border-yellow-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-yellow-500 mb-1">📋 Suggested Task</p>
                            <p className="text-sm font-medium">{response.suggestedTask.title}</p>
                          </div>
                          <button className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded hover:bg-yellow-500/30">
                            Add to Queue
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Action Items Summary */}
              {meetingResult.tasks.length > 0 && (
                <div className="bg-apex-card rounded-xl border border-indigo-500/30 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">📋 Action Items ({meetingResult.tasks.length})</h3>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg">
                      Dispatch All to Team Queue
                    </button>
                  </div>
                  <div className="space-y-2">
                    {meetingResult.tasks.map((task, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-apex-border rounded-lg">
                        <span className="text-sm">{task.title}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
