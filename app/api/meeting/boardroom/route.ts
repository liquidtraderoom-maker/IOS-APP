import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { agents, getAgent } from '@/lib/agents';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { agenda, participants } = await request.json();

    if (!agenda) {
      return NextResponse.json(
        { error: 'Missing agenda' },
        { status: 400 }
      );
    }

    // Default to all agents if no participants specified
    const participantIds = participants || agents.map(a => a.id);
    const participatingAgents = participantIds
      .map((id: string) => getAgent(id))
      .filter(Boolean);

    const responses: Array<{
      agentId: string;
      agentName: string;
      response: string;
      suggestedTask?: any;
    }> = [];

    // Get response from each participating agent
    for (const agent of participatingAgents) {
      if (!agent) continue;

      const systemPrompt = `${agent.systemPrompt}

You are in a boardroom meeting with other team members. The agenda is provided below.
Provide your perspective based on your role as ${agent.role}.
Keep your response focused and actionable (2-3 paragraphs max).

If you have a task suggestion, include it as:
<suggested_task>{"title": "task description", "priority": "high|medium|low", "assignee": "agent_id"}</suggested_task>`;

      try {
        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 512,
          system: systemPrompt,
          messages: [
            { role: 'user', content: `Meeting Agenda: ${agenda}` }
          ],
        });

        const textContent = response.content.find(c => c.type === 'text');
        let responseText = textContent?.text || '';

        // Parse suggested task
        let suggestedTask = null;
        const taskMatch = responseText.match(/<suggested_task>(.*?)<\/suggested_task>/s);
        if (taskMatch) {
          try {
            suggestedTask = JSON.parse(taskMatch[1]);
            responseText = responseText.replace(/<suggested_task>.*?<\/suggested_task>/s, '').trim();
          } catch (e) {}
        }

        responses.push({
          agentId: agent.id,
          agentName: agent.name,
          response: responseText,
          suggestedTask,
        });
      } catch (error) {
        responses.push({
          agentId: agent.id,
          agentName: agent.name,
          response: `[${agent.name} is currently unavailable]`,
        });
      }
    }

    // Collect all suggested tasks
    const tasks = responses
      .filter(r => r.suggestedTask)
      .map(r => ({
        ...r.suggestedTask,
        suggestedBy: r.agentId,
      }));

    return NextResponse.json({
      agenda,
      responses,
      tasks,
      participantCount: participatingAgents.length,
    });
  } catch (error: any) {
    console.error('Boardroom API error:', error);
    return NextResponse.json(
      { error: 'Failed to run boardroom meeting' },
      { status: 500 }
    );
  }
}
