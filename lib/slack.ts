interface SlackMessage {
  channel: string;
  text: string;
  blocks?: any[];
}

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

// Channel IDs (configure in .env.local)
export const CHANNELS = {
  boardroom: process.env.SLACK_CHANNEL_BOARDROOM || '#boardroom',
  leadsAlen: process.env.SLACK_CHANNEL_LEADS || '#leads-alen',
  buildsKeith: process.env.SLACK_CHANNEL_BUILDS || '#builds-keith',
  contentMya: process.env.SLACK_CHANNEL_CONTENT || '#content-mya',
  supportElena: process.env.SLACK_CHANNEL_SUPPORT || '#support-elena',
  opsJin: process.env.SLACK_CHANNEL_OPS || '#ops-jin',
};

export async function sendSlackMessage(message: SlackMessage) {
  if (!SLACK_BOT_TOKEN) {
    console.log('[Slack] Bot token not configured, skipping:', message.text);
    return null;
  }

  try {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('[Slack] Error:', data.error);
    }
    return data;
  } catch (error) {
    console.error('[Slack] Failed to send message:', error);
    return null;
  }
}

// Agent-specific notification helpers
export const notify = {
  marcus: {
    briefing: (content: string) => sendSlackMessage({
      channel: CHANNELS.boardroom,
      text: `📊 *Marcus Executive Briefing*\n${content}`,
    }),
    alert: (content: string) => sendSlackMessage({
      channel: CHANNELS.boardroom,
      text: `⚠️ *Strategy Alert*\n${content}`,
    }),
  },

  alen: {
    warmLead: (email: string, company: string) => sendSlackMessage({
      channel: CHANNELS.leadsAlen,
      text: `🔥 *Warm Lead Detected*\n• Email: ${email}\n• Company: ${company}`,
    }),
    dealClosed: (amount: number, customer: string) => sendSlackMessage({
      channel: CHANNELS.leadsAlen,
      text: `🎉 *Deal Closed!*\n• Amount: $${amount}\n• Customer: ${customer}`,
    }),
  },

  keith: {
    webhookEvent: (event: string, status: 'success' | 'error') => sendSlackMessage({
      channel: CHANNELS.buildsKeith,
      text: `${status === 'success' ? '✅' : '❌'} *Webhook: ${event}*\nStatus: ${status}`,
    }),
    checkoutComplete: (email: string, amount: number) => sendSlackMessage({
      channel: CHANNELS.buildsKeith,
      text: `💳 *Checkout Complete*\n• Customer: ${email}\n• Amount: $${amount / 100}`,
    }),
  },

  mya: {
    contentReady: (type: string, title: string) => sendSlackMessage({
      channel: CHANNELS.contentMya,
      text: `✨ *${type} Ready for Review*\n${title}`,
    }),
  },

  elena: {
    ticketResolved: (ticketId: string, summary: string) => sendSlackMessage({
      channel: CHANNELS.supportElena,
      text: `✅ *Ticket #${ticketId} Resolved*\n${summary}`,
    }),
    refundProcessed: (amount: number, reason: string) => sendSlackMessage({
      channel: CHANNELS.supportElena,
      text: `💸 *Refund Processed*\n• Amount: $${amount}\n• Reason: ${reason}`,
    }),
    escalation: (issue: string) => sendSlackMessage({
      channel: CHANNELS.supportElena,
      text: `🚨 *Escalation Required*\n${issue}`,
    }),
  },

  jin: {
    slaWarning: (service: string, metric: string) => sendSlackMessage({
      channel: CHANNELS.opsJin,
      text: `⚠️ *SLA Warning*\n• Service: ${service}\n• Metric: ${metric}`,
    }),
    systemHealth: (status: 'healthy' | 'degraded' | 'down') => sendSlackMessage({
      channel: CHANNELS.opsJin,
      text: `${status === 'healthy' ? '🟢' : status === 'degraded' ? '🟡' : '🔴'} *System Status: ${status.toUpperCase()}*`,
    }),
  },
};
