import type { AgentHandler, AgentHandlerOutput } from '@treeseed/agent/runtime-types';

type Inputs = {
  objective: string | null;
  triggerKind: string;
};

type Result = Inputs & {
  summary: string;
  messageType: string;
};

function objectiveText(context: Parameters<AgentHandler<Inputs, Result>['resolveInputs']>[0]) {
  return context.coreObjective?.content ?? context.coreObjective?.message ?? null;
}

function completed(summary: string, metadata: Record<string, unknown> = {}): AgentHandlerOutput {
  return { status: 'completed', summary, metadata };
}

function createSecureHandler(kind: string, messageType: string, verb: string): AgentHandler<Inputs, Result> {
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
        messageType,
        summary: `${verb} for objective: ${objective}`,
      };
    },
    async emitOutputs(context, result) {
      await context.sdk.createMessage({
        type: result.messageType,
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

export const plannerHandler = createSecureHandler('planner', 'question_priority_updated', 'Prepared research planning proposal');
export const researcherHandler = createSecureHandler('researcher', 'research_completed', 'Prepared source-gathering proposal');
export const knowledgeGeneratorHandler = createSecureHandler('knowledge_generator', 'knowledge_generated', 'Prepared knowledge-structure proposal');
export const knowledgeOptimizerHandler = createSecureHandler('knowledge_optimizer', 'knowledge_optimized', 'Prepared knowledge optimization proposal');
export const reporterHandler = createSecureHandler('reporter', 'report_created', 'Prepared research progress report');
