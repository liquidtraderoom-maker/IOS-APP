'use client';

import Link from 'next/link';
import { useState } from 'react';
import { agents } from '@/lib/agents';

export default function OfficePage() {
  const [hoveredSuite, setHoveredSuite] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-apex-dark p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">ApexHQ Virtual Office</h1>
          <p className="text-gray-500">Floor 1 — Executive Wing</p>
        </div>
        <div className="flex gap-4">
          <Link href="/office/big-office" className="bg-apex-card hover:bg-apex-border px-4 py-2 rounded-lg border border-apex-border transition-colors">
            🏢 Big Office
          </Link>
          <Link href="/office/boardroom" className="bg-apex-card hover:bg-apex-border px-4 py-2 rounded-lg border border-apex-border transition-colors">
            🎯 Boardroom
          </Link>
          <Link href="/office/dashboard" className="bg-apex-card hover:bg-apex-border px-4 py-2 rounded-lg border border-apex-border transition-colors">
            📊 Dashboard
          </Link>
        </div>
      </header>

      {/* Revenue Progress */}
      <div className="bg-apex-card rounded-xl border border-apex-border p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-500 text-sm">Monthly Revenue Progress</p>
            <p className="text-3xl font-bold">$3,245 <span className="text-gray-500 text-lg font-normal">/ $10,000</span></p>
          </div>
          <div className="text-right">
            <p className="text-green-500 font-medium">32.5% of goal</p>
            <p className="text-gray-500 text-sm">$1,755 pending checkout</p>
          </div>
        </div>
        <div className="h-3 bg-apex-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-green-500 rounded-full transition-all duration-500"
            style={{ width: '32.5%' }}
          />
        </div>
      </div>

      {/* Office Grid */}
      <div className="grid grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Link
            key={agent.id}
            href={`/office/suite/${agent.id}`}
            className={`bg-apex-card rounded-xl border-2 p-6 transition-all duration-300 hover:scale-105 ${
              hoveredSuite === agent.id
                ? 'border-indigo-500 glow-indigo'
                : 'border-apex-border hover:border-gray-600'
            }`}
            onMouseEnter={() => setHoveredSuite(agent.id)}
            onMouseLeave={() => setHoveredSuite(null)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-3xl">{agent.avatar}</span>
                <span className="ml-2 text-xs bg-apex-border px-2 py-1 rounded">Suite {agent.suiteNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  agent.defaultMode === 'autonomous' ? 'status-autonomous' :
                  agent.defaultMode === 'supervised' ? 'status-supervised' : 'status-paused'
                }`} />
                <span className="text-xs text-gray-500 capitalize">{agent.defaultMode}</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-1">{agent.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{agent.role}</p>

            <div className="flex flex-wrap gap-2">
              {agent.tools.slice(0, 2).map((tool) => (
                <span key={tool} className="text-xs bg-apex-border px-2 py-1 rounded text-gray-400">
                  {tool}
                </span>
              ))}
              {agent.tools.length > 2 && (
                <span className="text-xs bg-apex-border px-2 py-1 rounded text-gray-500">
                  +{agent.tools.length - 2}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4">
        <Link href="/office/tech-stack" className="flex-1 bg-apex-card rounded-lg border border-apex-border p-4 hover:border-gray-600 transition-colors">
          <p className="font-medium mb-1">🔧 Tech Stack Hub</p>
          <p className="text-sm text-gray-500">8 platforms • 5 connected</p>
        </Link>
        <Link href="/office/boardroom" className="flex-1 bg-apex-card rounded-lg border border-apex-border p-4 hover:border-gray-600 transition-colors">
          <p className="font-medium mb-1">🎯 Team Meeting</p>
          <p className="text-sm text-gray-500">Start a boardroom session</p>
        </Link>
      </div>
    </div>
  );
}
