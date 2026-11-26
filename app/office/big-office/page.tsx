'use client';

import { useState } from 'react';
import Link from 'next/link';
import { agents } from '@/lib/agents';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface AgentPerformance {
  id: string;
  name: string;
  avatar: string;
  mode: string;
  tasksCompleted: number;
  revenueAttributed: number;
}

export default function BigOfficePage() {
  const [officeName, setOfficeName] = useState('ApexHQ');
  const [monthlyFloor, setMonthlyFloor] = useState(5000);
  const [monthlyGoal, setMonthlyGoal] = useState(10000);
  const [currentRevenue, setCurrentRevenue] = useState(3245);
  const [pendingRevenue, setPendingRevenue] = useState(1755);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isLoadingBriefing, setIsLoadingBriefing] = useState(false);

  // Mock agent performance data
  const agentPerformance: AgentPerformance[] = agents.map(a => ({
    id: a.id,
    name: a.name,
    avatar: a.avatar,
    mode: a.defaultMode,
    tasksCompleted: Math.floor(Math.random() * 50) + 10,
    revenueAttributed: a.id === 'alen' ? 2500 : a.id === 'elena' ? 745 : 0,
  }));

  const progressPercent = (currentRevenue / monthlyGoal) * 100;
  const totalPotential = currentRevenue + pendingRevenue;

  const generateBriefing = async () => {
    setIsLoadingBriefing(true);
    try {
      const response = await fetch('/api/office/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyFloor,
          monthlyGoal,
          currentRevenue,
          pendingRevenue,
        }),
      });
      const data = await response.json();
      setBriefing(data.briefing || data.error);
    } catch (error) {
      setBriefing('Failed to generate briefing. Please try again.');
    } finally {
      setIsLoadingBriefing(false);
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
          <h1 className="text-3xl font-bold">🏢 Big Office</h1>
          <p className="text-gray-500">Executive Corner Suite</p>
        </div>
        <button
          onClick={generateBriefing}
          disabled={isLoadingBriefing}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          {isLoadingBriefing ? 'Generating...' : '📊 Generate Executive Briefing'}
        </button>
      </header>

      {/* Office Configuration */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-apex-card rounded-lg border border-apex-border p-4">
          <label className="text-xs text-gray-500 uppercase tracking-wide">Office Name</label>
          <input
            type="text"
            value={officeName}
            onChange={(e) => setOfficeName(e.target.value)}
            className="w-full mt-2 bg-apex-border border-none rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="bg-apex-card rounded-lg border border-apex-border p-4">
          <label className="text-xs text-gray-500 uppercase tracking-wide">Primary Offer</label>
          <p className="mt-2 text-lg font-semibold">$997/mo Retainer</p>
        </div>
        <div className="bg-apex-card rounded-lg border border-apex-border p-4">
          <label className="text-xs text-gray-500 uppercase tracking-wide">Monthly Floor</label>
          <input
            type="number"
            value={monthlyFloor}
            onChange={(e) => setMonthlyFloor(Number(e.target.value))}
            className="w-full mt-2 bg-apex-border border-none rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="bg-apex-card rounded-lg border border-apex-border p-4">
          <label className="text-xs text-gray-500 uppercase tracking-wide">Monthly Goal</label>
          <input
            type="number"
            value={monthlyGoal}
            onChange={(e) => setMonthlyGoal(Number(e.target.value))}
            className="w-full mt-2 bg-apex-border border-none rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Revenue Progress */}
      <div className="bg-apex-card rounded-xl border border-apex-border p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Revenue Progress</h2>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500">Settled Revenue</p>
            <p className="text-3xl font-bold text-green-500">{formatCurrency(currentRevenue)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Checkout</p>
            <p className="text-3xl font-bold text-yellow-500">{formatCurrency(pendingRevenue)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Target</p>
            <p className="text-3xl font-bold">{formatCurrency(monthlyGoal)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-8 bg-apex-border rounded-full overflow-hidden">
          {/* Settled */}
          <div
            className="absolute h-full bg-green-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Pending */}
          <div
            className="absolute h-full bg-yellow-500/50 transition-all duration-500"
            style={{ left: `${progressPercent}%`, width: `${((pendingRevenue / monthlyGoal) * 100)}%` }}
          />
          {/* Floor marker */}
          <div
            className="absolute h-full w-0.5 bg-red-500"
            style={{ left: `${(monthlyFloor / monthlyGoal) * 100}%` }}
          />
          {/* Labels */}
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
            {formatPercent(progressPercent / 100)} of goal
          </div>
        </div>

        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>$0</span>
          <span className="text-red-400">Floor: {formatCurrency(monthlyFloor)}</span>
          <span>Goal: {formatCurrency(monthlyGoal)}</span>
        </div>
      </div>

      {/* AI Team Performance */}
      <div className="bg-apex-card rounded-xl border border-apex-border p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">AI Team Performance Attribution</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-apex-border">
                <th className="pb-3">Agent</th>
                <th className="pb-3">Mode</th>
                <th className="pb-3">Tasks Completed</th>
                <th className="pb-3">Revenue Attributed</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agentPerformance.map((perf) => (
                <tr key={perf.id} className="border-b border-apex-border">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{perf.avatar}</span>
                      <span className="font-medium">{perf.name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
                      perf.mode === 'autonomous' ? 'bg-green-500/20 text-green-400' :
                      perf.mode === 'supervised' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        perf.mode === 'autonomous' ? 'bg-green-500' :
                        perf.mode === 'supervised' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`} />
                      {perf.mode}
                    </span>
                  </td>
                  <td className="py-4">{perf.tasksCompleted}</td>
                  <td className="py-4">
                    <span className={perf.revenueAttributed > 0 ? 'text-green-500' : 'text-gray-500'}>
                      {formatCurrency(perf.revenueAttributed)}
                    </span>
                  </td>
                  <td className="py-4">
                    <Link
                      href={`/office/suite/${perf.id}`}
                      className="text-indigo-400 hover:text-indigo-300 text-sm"
                    >
                      Open Suite →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Executive Briefing */}
      {briefing && (
        <div className="bg-apex-card rounded-xl border border-indigo-500/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">📊 Marcus Executive Briefing</h2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300">
              Email Briefing
            </button>
          </div>
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans">{briefing}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
