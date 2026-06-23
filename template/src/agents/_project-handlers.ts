import type { AgentHandler } from '@treeseed/agent/runtime-types';

type Inputs = {
  objective: string | null;
  triggerKind: string;
};

type Result = Inputs & {
  summary: string;
  messageType: string;
};

type AgentHandlerOutput = Awaited<ReturnType<AgentHandler<Inputs, Result>['emitOutputs']>>;

function objectiveText(context: Parameters<AgentHandler<Inputs, Result>['resolveInputs']>[0]) {
  return context.coreObjective?.content ?? context.coreObjective?.message ?? null;
}

function completed(summary: string, metadata: Record<string, unknown> = {}): AgentHandlerOutput {
  return { status: 'completed', summary, metadata };
}

function firstOutputMessage(context: Parameters<AgentHandler<Inputs, Result>['resolveInputs']>[0], fallback: string) {
	return context.agent.outputs.messageTypes[0] ?? fallback;
}

function createSecureHandler(kind: string, fallbackMessageType: string, verb: string): AgentHandler<Inputs, Result> {
  return {
    kind,
    async resolveInputs(context) {
      return {
        objective: objectiveText(context),
        triggerKind: context.trigger.kind,
      };
    },
    async execute(_context, inputs) {
      const objective = inputs.objective ?? 'No core objective was available to the project-owned research handler.';
      return {
        ...inputs,
        messageType: fallbackMessageType,
        summary: `${verb} for objective: ${objective}`,
      };
    },
    async emitOutputs(context, result) {
      const messageType = firstOutputMessage(context, result.messageType);
      await context.sdk.createMessage({
        type: messageType,
        payload: {
          objective: result.objective,
          triggerKind: result.triggerKind,
          handler: kind,
          runId: context.runId,
          approvalRequiredForMutation: true,
          contextSource: 'treedx-rendered-mdx',
        },
      });
      return {
        ...completed(result.summary, {
          projectOwnedHandler: true,
          approvalRequiredForMutation: true,
          contextSource: 'treedx-rendered-mdx',
        }),
        status: result.objective ? 'completed' : 'waiting',
      };
    },
  };
}

export const planHandler = createSecureHandler('plan', 'question_priority_updated', 'Prepared research planning proposal');
export const researchHandler = createSecureHandler('research', 'research_completed', 'Prepared source-gathering proposal');
export const reportHandler = createSecureHandler('report', 'report_created', 'Prepared research report');
