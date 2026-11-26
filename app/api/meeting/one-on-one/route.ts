import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { agents, getAgent } from '@/lib/agents';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { agentId, message, mode } = await request.json();

    if (!agentId || !message) {
      return NextResponse.json(
        { error: 'Missing agentId or message' },
        { status: 400 }
      );
    }

    const agent = getAgent(agentId);
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Build the system prompt with mode context
    const systemPrompt = `${agent.systemPrompt}

Current mode: ${mode || agent.defaultMode}
${mode === 'autonomous' ? 'You can take actions independently. Report what you do.' : ''}
${mode === 'supervised' ? 'Suggest actions but wait for approval before executing.' : ''}
${mode === 'paused' ? 'You are in observation mode. Provide analysis but do not suggest actions.' : ''}

IMPORTANT: If you have a task suggestion, include it in your response as JSON at the end:
<suggested_task>{"title": "task description", "priority": "high|medium|low"}</suggested_task>

If you have an email draft, include it as:
<suggested_email>{"to": "email", "subject": "subject", "body": "body"}</suggested_email>`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        { role: 'user', content: message }
      ],
    });

    // Extract the text content
    const textContent = response.content.find(c => c.type === 'text');
    let responseText = textContent?.text || '';

    // Parse suggested task if present
    let suggestedTask = null;
    const taskMatch = responseText.match(/<suggested_task>(.*?)<\/suggested_task>/s);
    if (taskMatch) {
      try {
        suggestedTask = JSON.parse(taskMatch[1]);
        responseText = responseText.replace(/<suggested_task>.*?<\/suggested_task>/s, '').trim();
      } catch (e) {
        // Ignore parse errors
      }
    }

    // Parse suggested email if present
    let suggestedEmail = null;
    const emailMatch = responseText.match(/<suggested_email>(.*?)<\/suggested_email>/s);
    if (emailMatch) {
      try {
        suggestedEmail = JSON.parse(emailMatch[1]);
        responseText = responseText.replace(/<suggested_email>.*?<\/suggested_email>/s, '').trim();
      } catch (e) {
        // Ignore parse errors
      }
    }

    return NextResponse.json({
      response: responseText,
      suggestedTask,
      suggestedEmail,
      agent: {
        id: agent.id,
        name: agent.name,
        role: agent.role,
      },
    });
  } catch (error: any) {
    console.error('Meeting API error:', error);

    // Handle rate limits gracefully
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limited. Please try again in a moment.', retryAfter: 30 },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
