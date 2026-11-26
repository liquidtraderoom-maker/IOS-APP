# ApexHQ Virtual Office

A full-stack web application designed to help solo founders reach $5,000-$10,000/month hands-free using 6 coordinated AI agents.

## 🏢 Virtual Office Features

- **Interactive Office Floorplan** - Navigate your AI team's workspace
- **6 Private Suites** - 1-on-1 chat with each AI agent
- **Executive Boardroom** - Multi-agent strategy meetings with voice
- **Big Office** - Revenue tracking and executive briefings
- **Team Dashboard** - Task queue and transaction ledger
- **Tech Stack Hub** - Integration status and architecture

## 👥 AI Team

| Agent | Role | Suite |
|-------|------|-------|
| **Marcus** | Chief Strategy Architect | 101 |
| **Alen** | Outbound Sales Lead | 102 |
| **Keith** | Automation & Build Engineer | 103 |
| **Mya** | Content & Demand Director | 104 |
| **Jin** | Operations & Telemetry Lead | 105 |
| **Elena** | Customer Support & Billing | 106 |

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Claude API (Anthropic)
- **Database**: Supabase (Postgres)
- **Payments**: Stripe
- **Auth**: Supabase Auth

## 🚀 Getting Started

1. **Clone and install**:
   ```bash
   git clone https://github.com/liquidtraderoom-maker/IOS-APP.git
   cd IOS-APP
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Required API Keys**:
   - `ANTHROPIC_API_KEY` - Get from [console.anthropic.com](https://console.anthropic.com)
   - `NEXT_PUBLIC_SUPABASE_URL` - Get from [supabase.com](https://supabase.com)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
   - `STRIPE_SECRET_KEY` - Get from [stripe.com](https://stripe.com)

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
/app
  /page.tsx                    # Landing page
  /office
    /page.tsx                  # Office floorplan
    /suite/[agent]/page.tsx    # 1-on-1 agent chat
    /boardroom/page.tsx        # Multi-agent meetings
    /big-office/page.tsx       # Executive dashboard
    /dashboard/page.tsx        # Tasks & transactions
    /tech-stack/page.tsx       # Integration status
  /api
    /meeting/one-on-one        # Agent chat endpoint
    /meeting/boardroom         # Multi-agent endpoint
    /office/briefing           # Executive briefing
/lib
  /agents.ts                   # 6 agent personas
  /utils.ts                    # Helper functions
```

## 💰 Revenue Model

Target: 5-10 clients at $997-$1,495/month = $5,000-$10,000/month

The AI agents handle:
- **Marcus**: Pricing strategy, P&L analysis
- **Alen**: B2B prospecting, qualification, checkout routing
- **Keith**: Webhook automation, fulfillment triggers
- **Mya**: Landing pages, email sequences, follow-ups
- **Jin**: SLA monitoring, cross-agent coordination
- **Elena**: Support tickets, subscription management

## 📄 License

MIT
