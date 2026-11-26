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
    { id: 'stripe', name: 'Stripe', icon: '💳', status: 'ready_to_connect', description: 'Payment processing', purpose: 'Payment Links, billing, Radar' },
    { id: 'hubspot', name: 'HubSpot CRM', icon: '📊', status: 'ready_to_connect', description: 'CRM', purpose: 'Lead tracking, deal pipeline' },
    { id: 'apollo', name: 'Apollo.io', icon: '🎯', status: 'planned', description: 'B2B prospecting', purpose: 'ICP contacts, enrichment' },
    { id: 'instantly', name: 'Instantly.ai', icon: '📧', status: 'planned', description: 'Cold email', purpose: 'Sequences, domain warming' },
    { id: 'n8n', name: 'n8n', icon: '⚙️', status: 'ready_to_connect', description: 'Automation', purpose: 'Webhooks, workflows' },
    { id: 'slack', name: 'Slack', icon: '💬', status: 'connected', description: 'Communication', purpose: 'Bot channels, alerts' },
    { id: 'teams', name: 'MS Teams', icon: '👥', status: 'ready_to_connect', description: 'Notifications', purpose: 'P&L cards, approvals' },
    { id: 'intercom', name: 'Intercom', icon: '🎧', status: 'planned', description: 'Support', purpose: 'AI chat, tickets' },
  ]);

  const slackChannels = [
    { name: '#boardroom', agent: 'Marcus', purpose: '8 AM P&L & strategy' },
    { name: '#leads-alen', agent: 'Alen', purpose: 'Outbound replies' },
    { name: '#builds-keith', agent: 'Keith', purpose: 'Webhook health' },
    { name: '#content-mya', agent: 'Mya', purpose: 'Content drafts' },
    { name: '#support-elena', agent: 'Elena', purpose: 'Resolved tickets' },
    { name: '#ops-jin', agent: 'Jin', purpose: 'SLA warnings' },
  ];

  return (
    <div className="min-h-screen bg-apex-dark p-6">
      <header className="mb-8">
        <Link href="/office" className="text-gray-400 hover:text-white text-sm mb-2 block">← Back</Link>
        <h1 className="text-3xl font-bold">🔧 Tech Stack Hub</h1>
        <p className="text-gray-500">8 platforms powering hands-free operations</p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-apex-card rounded-xl border border-apex-border p-6">
          <h2 className="text-lg font-semibold mb-4">Platform Integrations</h2>
          <div className="grid grid-cols-2 gap-4">
            {platforms.map((p) => (
              <div key={p.id} className={`p-4 rounded-lg border ${p.status === 'connected' ? 'bg-green-500/10 border-green-500/30' : p.status === 'ready_to_connect' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-apex-border border-apex-border'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{p.icon}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${p.status === 'connected' ? 'bg-green-500/20 text-green-400' : p.status === 'ready_to_connect' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>{p.status.replace('_', ' ')}</span>
                </div>
                <h3 className="font-medium">{p.name}</h3>
                <p className="text-xs text-gray-500">{p.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-apex-card rounded-xl border border-apex-border p-6">
            <h2 className="text-lg font-semibold mb-4">Slack Channels</h2>
            <div className="space-y-2">
              {slackChannels.map((ch) => (
                <div key={ch.name} className="flex items-center justify-between p-3 bg-apex-border rounded-lg">
                  <div>
                    <code className="text-sm text-green-400">{ch.name}</code>
                    <p className="text-xs text-gray-500">{ch.purpose}</p>
                  </div>
                  <span className="text-xs text-gray-400">{ch.agent}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-apex-card rounded-xl border border-apex-border p-6">
            <h2 className="text-lg font-semibold mb-4">Automation Flows</h2>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-apex-border rounded-lg">Lead → Outreach → CRM</div>
              <div className="p-3 bg-apex-border rounded-lg">Reply → Qualification → Checkout</div>
              <div className="p-3 bg-apex-border rounded-lg">Checkout → Onboarding → Slack</div>
              <div className="p-3 bg-apex-border rounded-lg">Support → AI → Resolution</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
