import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getAgent } from '@/lib/agents';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { monthlyFloor, monthlyGoal, currentRevenue, pendingRevenue } = await request.json();

    const marcus = getAgent('marcus');
    if (!marcus) {
      return NextResponse.json({ error: 'Marcus not found' }, { status: 404 });
    }

    const briefingPrompt = `Generate an executive briefing for the founder.

Current Metrics:
- Monthly Revenue Goal: $${monthlyGoal || 10000}
- Monthly Floor: $${monthlyFloor || 5000}
- Current Settled Revenue: $${currentRevenue || 0}
- Pending Checkout Revenue: $${pendingRevenue || 0}
- Days remaining in month: ${new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()}

Provide:
1. Revenue Status (on track / at risk / behind)
2. Pipeline Health Assessment
3. Top Priority for Today
4. Risk Flag (if any)
5. One Key Action Item

Format as a structured briefing suitable for a busy executive.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: marcus.systemPrompt,
      messages: [
        { role: 'user', content: briefingPrompt }
      ],
    });

    const textContent = response.content.find(c => c.type === 'text');

    return NextResponse.json({
      briefing: textContent?.text || '',
      generatedAt: new Date().toISOString(),
      agent: 'marcus',
    });
  } catch (error: any) {
    console.error('Briefing API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate briefing' },
      { status: 500 }
    );
  }
}
