# ApexHQ Virtual Office

A full-stack web app for solo founders to reach $5,000-$10,000/month using 6 AI agents.

## 🏢 Features

- Interactive Office Floorplan
- 6 Private Agent Suites (1-on-1 chat)
- Executive Boardroom (multi-agent meetings)
- Big Office (revenue dashboard)
- Team & Deals Dashboard
- Tech Stack Hub

## 👥 AI Team

| Agent | Role | Suite |
|-------|------|-------|
| Marcus | Strategy | 101 |
| Alen | Outbound Sales | 102 |
| Keith | Automation | 103 |
| Mya | Content | 104 |
| Jin | Operations | 105 |
| Elena | Support | 106 |

## 🚀 Getting Started

```bash
npm install
cp .env.local.example .env.local
# Add your API keys
npm run dev
```

Open http://localhost:3000

## 📁 Structure

```
/app
  /office - Virtual office pages
  /api - Backend endpoints
/lib
  /agents.ts - Agent personas
```

## License

MIT
