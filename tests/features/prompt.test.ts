import { jest } from '@jest/globals';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { usePrompts } from '../../src/features/prompt.js';
import { PromptDefinition } from '../../src/features/types.js';

describe('features/prompt', () => {
  let mockServer: any;

  beforeEach(() => {
    mockServer = {
      registerPrompt: jest.fn()
    };
  });

  describe('usePrompts', () => {
    it('should register multiple prompts', () => {
      // Arrange
      const prompts: PromptDefinition[] = [
        {
          id: 'prompt1',
          title: 'Prompt 1',
          description: 'Description 1',
          messages: []
        },
        {
          id: 'prompt2',
          title: 'Prompt 2',
          description: 'Description 2'
        }
      ];

      // Act
      usePrompts(mockServer as unknown as McpServer, prompts);

      // Assert
      expect(mockServer.registerPrompt).toHaveBeenCalledTimes(2);
      
      // Verify first prompt registration
      expect(mockServer.registerPrompt).toHaveBeenNthCalledWith(
        1,
        'prompt1',
        { title: 'Prompt 1', description: 'Description 1' },
        expect.any(Function)
      );

      // Verify second prompt registration
      expect(mockServer.registerPrompt).toHaveBeenNthCalledWith(
        2,
        'prompt2',
        { title: 'Prompt 2', description: 'Description 2' },
        expect.any(Function)
      );
    });

    it('should handle prompt execution handler correctly with messages', async () => {
      // Arrange
      const messages = [{ role: 'user', content: { type: 'text', text: 'Hello' } }];
      const prompt: PromptDefinition = {
        id: 'test-prompt',
        title: 'Test Prompt',
        description: 'Test Description',
        messages: messages as any
      };

      // Act
      usePrompts(mockServer as unknown as McpServer, [prompt]);

      // Assert
      const registerCall = mockServer.registerPrompt.mock.calls[0];
      const handler = registerCall[2];
      const result = await handler({});

      expect(result).toEqual({ messages });
    });

    it('should handle prompt execution handler correctly without messages', async () => {
      // Arrange
      const prompt: PromptDefinition = {
        id: 'test-prompt',
        title: 'Test Prompt',
        description: 'Test Description'
      };

      // Act
      usePrompts(mockServer as unknown as McpServer, [prompt]);

      // Assert
      const registerCall = mockServer.registerPrompt.mock.calls[0];
      const handler = registerCall[2];
      const result = await handler({});

      expect(result).toEqual({ messages: [] });
    });
  });
});
