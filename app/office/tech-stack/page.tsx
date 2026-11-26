'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Platform {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'ready_to_connect' | 'planned';
  description: string;
  purpose: string;
}

export default function TechStackPage() {
  const [platforms] = useState<Platform[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      icon: '💳',
      status: 'ready_to_connect',
      description: 'Payment processing & subscriptions',
      purpose: 'Payment Links, recurring billing, Radar fraud protection',
    },
    {
      id: 'hubspot',
      name: 'HubSpot CRM',
      icon: '📊',
      status: 'ready_to_connect',
      description: 'Customer relationship management',
      purpose: 'Lead tracking, deal pipeline, contact database',
    },
    {
      id: 'apollo',
      name: 'Apollo.io',
      icon: '🎯',
      status: 'planned',
      description: 'B2B prospecting & enrichment',
      purpose: 'ICP contacts, company data, email verification',
    },
    {
      id: 'instantly',
      name: 'Instantly.ai',
      icon: '📧',
      status: 'planned',
      description: 'Cold email automation',
      purpose: 'Multi-step sequences, domain warming, inbox rotation',
    },
    {
      id: 'n8n',
      name: 'n8n',
      icon: '⚙️',
      status: 'ready_to_connect',
      description: 'Workflow automation engine',
      purpose: 'Webhooks, integrations, background jobs',
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: '💬',
      status: 'connected',
      description: 'Team communication hub',
      purpose: 'Bot channels, real-time alerts, event feeds',
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      icon: '👥',
      status: 'ready_to_connect',
      description: 'Executive notifications',
      purpose: 'P&L cards, approval workflows, exception alerts',
    },
    {
      id: 'intercom',
      name: 'Intercom',
      icon: '🎧',
      status: 'planned',
      description: 'Customer support platform',
      purpose: 'AI chat, ticket routing, knowledge base',
    },
  ]);

  const slackChannels = [
    { name: '#boardroom', agent: 'Marcus', purpose: '8 AM P&L & strategy pacing' },
    { name: '#leads-alen', agent: 'Alen', purpose: 'Warm outbound replies & HubSpot updates' },
    { name: '#builds-keith', agent: 'Keith', purpose: 'Webhook health, n8n runs, Stripe events' },
    { name: '#content-mya', agent: 'Mya', purpose: 'Drafted case studies & nurture sequences' },
    { name: '#support-elena', agent: 'Elena', purpose: 'Resolved tickets & self-serve upgrades' },
    { name: '#ops-jin', agent: 'Jin', purpose: 'SLA warnings & failed webhook retries' },
  ];

  const connectedCount = platforms.filter(p => p.status === 'connected').length;
  const readyCount = platforms.filter(p => p.status === 'ready_to_connect').length;
  const plannedCount = platforms.filter(p => p.status === 'planned').length;

  return (
    <div className="min-h-screen bg-apex-dark p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <Link href="/office" className="text-gray-400 hover:text-white text-sm mb-2 block">
            ← Back to Office
          </Link>
          <h1 className="text-3xl font-bold">🔧 Tech Stack Hub</h1>
          <p className="text-gray-500">8 platforms powering hands-free operations</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded">
            {connectedCount} connected
          </div>
          <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded">
            {readyCount} ready
          </div>
          <div className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded">
            {plannedCount} planned
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-6">
        {/* Platform Grid */}
        <div className="space-y-6">
          <div className="bg-apex-card rounded-xl border border-apex-border p-6">
            <h2 className="text-lg font-semibold mb-4">Platform Integrations</h2>
            <div className="grid grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    platform.status === 'connected'
                      ? 'bg-green-500/10 border-green-500/30'
                      : platform.status === 'ready_to_connect'
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-apex-border border-apex-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{platform.icon}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      platform.status === 'connected'
                        ? 'bg-green-500/20 text-green-400'
                        : platform.status === 'ready_to_connect'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {platform.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-medium">{platform.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{platform.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{platform.purpose}</p>

                  {platform.status !== 'planned' && (
                    <button className={`mt-3 w-full text-xs py-2 rounded transition-colors ${
                      platform.status === 'connected'
                        ? 'bg-gray-600 text-gray-400 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}>
                      {platform.status === 'connected' ? 'Connected ✓' : 'Connect'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Architecture Diagram */}
          <div className="bg-apex-card rounded-xl border border-apex-border p-6">
            <h2 className="text-lg font-semibold mb-4">System Architecture</h2>
            <div className="bg-apex-border rounded-lg p-4 font-mono text-xs">
              <pre className="text-gray-400 whitespace-pre-wrap">{`
┌─────────────────────────────────────────┐
│           ApexHQ Virtual Office          │
│  (Next.js + Claude AI + Supabase)        │
└───────────────────┬─────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼───────┐       ┌───────▼───────┐
│    Slack      │       │  MS Teams     │
│  (Real-time)  │       │ (Approvals)   │
└───────────────┘       └───────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼───────┐       ┌───────▼───────┐
│   n8n/Make    │◄─────►│    Stripe     │
│  (Workflows)  │       │  (Payments)   │
└───────┬───────┘       └───────────────┘
        │
┌───────▼───────────────────────────────┐
│  Apollo → Instantly → HubSpot CRM     │
│       (Lead Pipeline)                  │
└───────────────────────────────────────┘
              `}</pre>
            </div>
          </div>

          {/* Slack Channels */}
          <div className="bg-apex-card rounded-xl border border-apex-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Slack Channel Layout</h2>
              <button className="text-xs text-indigo-400 hover:text-indigo-300">
                Copy Setup
              </button>
            </div>
            <div className="space-y-2">
              {slackChannels.map((channel) => (
                <div key={channel.name} className="flex items-center justify-between p-3 bg-apex-border rounded-lg">
                  <div>
                    <code className="text-sm text-green-400">{channel.name}</code>
                    <p className="text-xs text-gray-500 mt-1">{channel.purpose}</p>
                  </div>
                  <span className="text-xs text-gray-400">{channel.agent}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Automation Flows */}
          <div className="bg-apex-card rounded-xl border border-apex-border p-6">
            <h2 className="text-lg font-semibold mb-4">Core Automation Flows</h2>
            <div className="space-y-3">
              <div className="p-3 bg-apex-border rounded-lg">
                <p className="text-sm font-medium">Lead → Outreach → CRM</p>
                <p className="text-xs text-gray-500">Apollo enrichment → Instantly sequence → HubSpot sync</p>
              </div>
              <div className="p-3 bg-apex-border rounded-lg">
                <p className="text-sm font-medium">Warm Reply → Qualification → Checkout</p>
                <p className="text-xs text-gray-500">AI qualification → Stripe Payment Link → Webhook</p>
              </div>
              <div className="p-3 bg-apex-border rounded-lg">
                <p className="text-sm font-medium">Checkout → Onboarding → Slack</p>
                <p className="text-xs text-gray-500">checkout.session.completed → Welcome email → Log</p>
              </div>
              <div className="p-3 bg-apex-border rounded-lg">
                <p className="text-sm font-medium">Support → AI → Resolution</p>
                <p className="text-xs text-gray-500">Ticket → Policy check → Auto-reply or escalate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
