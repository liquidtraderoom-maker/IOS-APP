'use client';

import { useState } from 'react';
import Link from 'next/link';
import { agents, AgentMode } from '@/lib/agents';
import { formatCurrency } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  status: 'queued' | 'running' | 'needs_review' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  createdAt: Date;
}

interface Transaction {
  id: string;
  amount: number;
  status: 'settled' | 'pending' | 'refunded';
  customer: string;
  channel: string;
  attributedTo: string;
  date: Date;
}

export default function DashboardPage() {
  const [agentModes, setAgentModes] = useState<Record<string, AgentMode>>(
    Object.fromEntries(agents.map(a => [a.id, a.defaultMode]))
  );
  const [taskFilter, setTaskFilter] = useState<string>('all');

  // Mock data
  const tasks: Task[] = [
    { id: '1', title: 'Follow up with warm lead: Acme Corp', status: 'queued', priority: 'high', assignee: 'alen', createdAt: new Date() },
    { id: '2', title: 'Send case study to qualified prospects', status: 'running', priority: 'medium', assignee: 'mya', createdAt: new Date() },
    { id: '3', title: 'Review checkout funnel conversion', status: 'needs_review', priority: 'high', assignee: 'keith', createdAt: new Date() },
    { id: '4', title: 'Process support ticket #847', status: 'completed', priority: 'low', assignee: 'elena', createdAt: new Date() },
    { id: '5', title: 'Update pricing tier analysis', status: 'queued', priority: 'medium', assignee: 'marcus', createdAt: new Date() },
  ];

  const transactions: Transaction[] = [
    { id: 't1', amount: 997, status: 'settled', customer: 'john@acme.com', channel: 'cold_email', attributedTo: 'alen', date: new Date() },
    { id: 't2', amount: 1495, status: 'settled', customer: 'sarah@techco.io', channel: 'linkedin', attributedTo: 'alen', date: new Date() },
    { id: 't3', amount: 997, status: 'pending', customer: 'mike@startup.com', channel: 'cold_email', attributedTo: 'alen', date: new Date() },
    { id: 't4', amount: 997, status: 'pending', customer: 'lisa@agency.co', channel: 'referral', attributedTo: 'elena', date: new Date() },
    { id: 't5', amount: 497, status: 'refunded', customer: 'old@customer.com', channel: 'cold_email', attributedTo: 'elena', date: new Date() },
  ];

  const toggleMode = (agentId: string) => {
    const modes: AgentMode[] = ['autonomous', 'supervised', 'paused'];
    const currentIndex = modes.indexOf(agentModes[agentId]);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setAgentModes(prev => ({ ...prev, [agentId]: nextMode }));
  };

  const filteredTasks = taskFilter === 'all'
    ? tasks
    : tasks.filter(t => t.status === taskFilter);

  const totalSettled = transactions.filter(t => t.status === 'settled').reduce((sum, t) => sum + t.amount, 0);
  const totalPending = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
  const totalRefunded = transactions.filter(t => t.status === 'refunded').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-apex-dark p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <Link href="/office" className="text-gray-400 hover:text-white text-sm mb-2 block">
            ← Back to Office
          </Link>
          <h1 className="text-3xl font-bold">📊 Team & Deals Dashboard</h1>
          <p className="text-gray-500">Task queue, transactions, and team controls</p>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-apex-card rounded-lg border border-apex-border p-4">
          <p className="text-sm text-gray-500">Settled Revenue</p>
          <p className="text-2xl font-bold text-green-500">{formatCurrency(totalSettled)}</p>
        </div>
        <div className="bg-apex-card rounded-lg border border-apex-border p-4">
          <p className="text-sm text-gray-500">Pending Checkout</p>
          <p className="text-2xl font-bold text-yellow-500">{formatCurrency(totalPending)}</p>
        </div>
        <div className="bg-apex-card rounded-lg border border-apex-border p-4">
          <p className="text-sm text-gray-500">Refunded</p>
          <p className="text-2xl font-bold text-red-500">{formatCurrency(totalRefunded)}</p>
        </div>
        <div className="bg-apex-card rounded-lg border border-apex-border p-4">
          <p className="text-sm text-gray-500">Active Tasks</p>
          <p className="text-2xl font-bold">{tasks.filter(t => t.status !== 'completed').length}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Agent Controls */}
        <div className="space-y-6">
          <div className="bg-apex-card rounded-xl border border-apex-border p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Autonomy Toggles</h2>
            <div className="space-y-3">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-apex-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{agent.avatar}</span>
                    <span className="font-medium">{agent.name}</span>
                  </div>
                  <button
                    onClick={() => toggleMode(agent.id)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      agentModes[agent.id] === 'autonomous' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                      agentModes[agent.id] === 'supervised' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' :
                      'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                    }`}
                  >
                    {agentModes[agent.id]}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column - Task Queue */}
        <div className="bg-apex-card rounded-xl border border-apex-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Task Queue</h2>
            <select
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value)}
              className="bg-apex-border border-none rounded px-3 py-1 text-sm text-white focus:outline-none"
            >
              <option value="all">All</option>
              <option value="queued">Queued</option>
              <option value="running">Running</option>
              <option value="needs_review">Needs Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const agent = agents.find(a => a.id === task.assignee);
              return (
                <div key={task.id} className="p-3 bg-apex-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium">{task.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span>{agent?.avatar}</span>
                      <span className="text-gray-500">{agent?.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded ${
                      task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      task.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                      task.status === 'needs_review' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Transactions */}
        <div className="bg-apex-card rounded-xl border border-apex-border p-6">
          <h2 className="text-lg font-semibold mb-4">Transaction Ledger</h2>
          <div className="space-y-3">
            {transactions.map((tx) => {
              const agent = agents.find(a => a.id === tx.attributedTo);
              return (
                <div key={tx.id} className="p-3 bg-apex-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-lg font-semibold ${
                      tx.status === 'settled' ? 'text-green-500' :
                      tx.status === 'pending' ? 'text-yellow-500' :
                      'text-red-500 line-through'
                    }`}>
                      {formatCurrency(tx.amount)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      tx.status === 'settled' ? 'bg-green-500/20 text-green-400' :
                      tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{tx.customer}</span>
                    <div className="flex items-center gap-2">
                      <span>{agent?.avatar}</span>
                      <span>{tx.channel.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
