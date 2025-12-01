import { jest } from '@jest/globals';
import type { 
  ServerFeature, 
  ToolDefinition, 
  PromptDefinition, 
  ResourceDefinition,
  CustomFeatures
} from '../../src/features/types.js';

describe('features/types', () => {
  it('should be a valid module', async () => {
    // Act
    const module = await import('../../src/features/types.js');

    // Assert
    expect(module).toBeDefined();
  });

  it('should support ServerFeature type structure', () => {
    // Arrange & Act
    // This is primarily a compile-time check to ensure the type definition matches expected structure
    const feature: ServerFeature = {
      tools: [],
      resources: [],
      prompts: [],
      custom_tools: [],
      custom_resources: [],
      custom_prompts: []
    };

    // Assert
    expect(feature).toBeDefined();
    expect(Array.isArray(feature.tools)).toBe(true);
  });

  it('should support ToolDefinition type structure', () => {
    // Arrange & Act
    const tool: ToolDefinition = {
      id: 'test-tool',
      title: 'Test Tool',
      description: 'Description',
      content: [
        { type: 'text', text: 'content' },
        { type: 'resource_link', uri: 'http://example.com', name: 'link' },
        { type: 'file', path: '/path' }
      ]
    };

    // Assert
    expect(tool.id).toBe('test-tool');
    expect(tool.content).toHaveLength(3);
  });

  it('should support PromptDefinition type structure', () => {
    // Arrange & Act
    const prompt: PromptDefinition = {
      id: 'test-prompt',
      title: 'Test Prompt',
      description: 'Description',
      messages: [
        { role: 'user', content: { type: 'text', text: 'hello' } }
      ]
    };

    // Assert
    expect(prompt.id).toBe('test-prompt');
    expect(prompt.messages).toBeDefined();
  });

  it('should support ResourceDefinition type structure', () => {
    // Arrange & Act
    const resource: ResourceDefinition = {
      id: 'test-resource',
      uri: 'file:///test',
      title: 'Test Resource',
      description: 'Description',
      mimeType: 'text/plain',
      content: [
        { type: 'text', text: 'content' },
        { type: 'file', path: '/path' },
        { type: 'uri', uri: 'http://example.com' }
      ]
    };

    // Assert
    expect(resource.id).toBe('test-resource');
    expect(resource.content).toHaveLength(3);
  });
  
  it('should support CustomFeatures type structure', () => {
      // Arrange & Act
      const customFeatures: CustomFeatures = {
          tools: new Map(),
          prompts: new Map(),
          resources: new Map()
      };
      
      // Assert
      expect(customFeatures.tools).toBeInstanceOf(Map);
      expect(customFeatures.prompts).toBeInstanceOf(Map);
      expect(customFeatures.resources).toBeInstanceOf(Map);
  });
});
