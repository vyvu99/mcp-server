import { Prompt, Tool } from '@/mcp';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol';
import {
  CallToolResult,
  GetPromptResult,
  Notification,
} from '@modelcontextprotocol/sdk/types';
import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class GoogleDriveTool {
  private readonly logger = new Logger(GoogleDriveTool.name);

  constructor() {}

  @Tool({
    name: 'add',
    description: 'Add two numbers together',
    parameters: z.object({
      a: z.number(),
      b: z.number(),
    }),
    outputSchema: z.string(),
  })
  addTool(
    params: { a: number; b: number; optionalMessage?: string },
    extra: RequestHandlerExtra<Request, Notification>,
  ): CallToolResult {
    const clientId =
      extra.authInfo?.clientId ?? extra.sessionId ?? 'Unknown Client';
    this.logger.debug(
      `Tool 'add' called by client ${clientId} with params: ${JSON.stringify(params)}`,
    );

    return {
      structuredContent: { content: String(params.a + params.b) },
      content: [{ type: 'text', text: String(params.a + params.b) }],
    };
  }

  @Prompt({
    name: 'add',
    description: 'Add two numbers together',
  })
  addPrompt(params: { a: number; b: number }): GetPromptResult {
    return {
      messages: [
        {
          content: {
            type: 'text',
            text: `Please review ${params.a} + ${params.b}`,
          },
          role: 'user',
        },
      ],
    };
  }
}
