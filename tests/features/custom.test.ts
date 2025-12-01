import { jest } from '@jest/globals';

// Import functions to test
import {
  registerCustomTool,
  registerCustomPrompt,
  registerCustomResource,
  applyCustomTools,
  applyCustomPrompts,
  applyCustomResources,
  clear
} from '../../src/features/custom.js';

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('features/custom', () => {
  // Mock handlers and server
  let mockHandler1: jest.Mock;
  let mockHandler2: jest.Mock;
  let mockHandler3: jest.Mock;
  let mockServer: any;

  beforeEach(() => {
    jest.clearAllMocks();
    clear();
    mockHandler1 = jest.fn();
    mockHandler2 = jest.fn();
    mockHandler3 = jest.fn();
    mockServer = { setRequestHandler: jest.fn() };
  });

  describe('registerCustomTool', () => {
    it('should register a custom tool with given id and handler', () => {
      // Act
      registerCustomTool('tool1', mockHandler1);
      applyCustomTools(['tool1'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledWith(mockServer);
      expect(mockHandler1).toHaveBeenCalledTimes(1);
    });

    it('should register multiple custom tools with different ids', () => {
      // Act
      registerCustomTool('tool1', mockHandler1);
      registerCustomTool('tool2', mockHandler2);
      applyCustomTools(['tool1', 'tool2'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledWith(mockServer);
      expect(mockHandler2).toHaveBeenCalledWith(mockServer);
      expect(mockHandler1).toHaveBeenCalledTimes(1);
      expect(mockHandler2).toHaveBeenCalledTimes(1);
    });

    it('should overwrite existing tool when registering with same id', () => {
      // Arrange
      registerCustomTool('tool1', mockHandler1);

      // Act
      registerCustomTool('tool1', mockHandler2);
      applyCustomTools(['tool1'], mockServer);

      // Assert
      expect(mockHandler1).not.toHaveBeenCalled();
      expect(mockHandler2).toHaveBeenCalledWith(mockServer);
    });
  });

  describe('registerCustomPrompt', () => {
    it('should register a custom prompt with given id and handler', () => {
      // Act
      registerCustomPrompt('prompt1', mockHandler1);
      applyCustomPrompts(['prompt1'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledWith(mockServer);
      expect(mockHandler1).toHaveBeenCalledTimes(1);
    });

    it('should register multiple custom prompts with different ids', () => {
      // Act
      registerCustomPrompt('prompt1', mockHandler1);
      registerCustomPrompt('prompt2', mockHandler2);
      applyCustomPrompts(['prompt1', 'prompt2'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledWith(mockServer);
      expect(mockHandler2).toHaveBeenCalledWith(mockServer);
      expect(mockHandler1).toHaveBeenCalledTimes(1);
      expect(mockHandler2).toHaveBeenCalledTimes(1);
    });

    it('should overwrite existing prompt when registering with same id', () => {
      // Arrange
      registerCustomPrompt('prompt1', mockHandler1);

      // Act
      registerCustomPrompt('prompt1', mockHandler2);
      applyCustomPrompts(['prompt1'], mockServer);

      // Assert
      expect(mockHandler1).not.toHaveBeenCalled();
      expect(mockHandler2).toHaveBeenCalledWith(mockServer);
    });
  });

  describe('registerCustomResource', () => {
    it('should register a custom resource with given id and handler', () => {
      // Act
      registerCustomResource('resource1', mockHandler1);
      applyCustomResources(['resource1'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledWith(mockServer);
      expect(mockHandler1).toHaveBeenCalledTimes(1);
    });

    it('should register multiple custom resources with different ids', () => {
      // Act
      registerCustomResource('resource1', mockHandler1);
      registerCustomResource('resource2', mockHandler2);
      applyCustomResources(['resource1', 'resource2'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledWith(mockServer);
      expect(mockHandler2).toHaveBeenCalledWith(mockServer);
      expect(mockHandler1).toHaveBeenCalledTimes(1);
      expect(mockHandler2).toHaveBeenCalledTimes(1);
    });

    it('should overwrite existing resource when registering with same id', () => {
      // Arrange
      registerCustomResource('resource1', mockHandler1);

      // Act
      registerCustomResource('resource1', mockHandler2);
      applyCustomResources(['resource1'], mockServer);

      // Assert
      expect(mockHandler1).not.toHaveBeenCalled();
      expect(mockHandler2).toHaveBeenCalledWith(mockServer);
    });
  });

  describe('applyCustomTools', () => {
    it('should apply registered tool when id exists', () => {
      // Arrange
      registerCustomTool('tool1', mockHandler1);

      // Act
      applyCustomTools(['tool1'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledWith(mockServer);
    });

    it('should apply multiple registered tools in order', () => {
      // Arrange
      registerCustomTool('tool1', mockHandler1);
      registerCustomTool('tool2', mockHandler2);
      registerCustomTool('tool3', mockHandler3);

      // Act
      applyCustomTools(['tool1', 'tool2', 'tool3'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledWith(mockServer);
      expect(mockHandler2).toHaveBeenCalledWith(mockServer);
      expect(mockHandler3).toHaveBeenCalledWith(mockServer);
    });

    it('should log error when tool id is not registered', () => {
      // Act
      applyCustomTools(['nonexistent'], mockServer);

      // Assert
      expect(mockConsoleError).toHaveBeenCalledWith('No custom tool found for id: nonexistent');
    });

    it('should apply registered tools and log errors for unregistered ones', () => {
      // Arrange
      registerCustomTool('tool1', mockHandler1);

      // Act
      applyCustomTools(['tool1', 'nonexistent', 'tool2'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledWith(mockServer);
      expect(mockConsoleError).toHaveBeenCalledWith('No custom tool found for id: nonexistent');
      expect(mockConsoleError).toHaveBeenCalledWith('No custom tool found for id: tool2');
      expect(mockConsoleError).toHaveBeenCalledTimes(2);
    });

    it('should handle empty tool ids array', () => {
      // Act
      applyCustomTools([], mockServer);

      // Assert
      expect(mockHandler1).not.toHaveBeenCalled();
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should handle same tool id appearing multiple times', () => {
      // Arrange
      registerCustomTool('tool1', mockHandler1);

      // Act
      applyCustomTools(['tool1', 'tool1', 'tool1'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledTimes(3);
    });
  });

  describe('applyCustomPrompts', () => {
    it('should apply registered prompt when id exists', () => {
      // Arrange
      registerCustomPrompt('prompt1', mockHandler1);

      // Act
      applyCustomPrompts(['prompt1'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledWith(mockServer);
    });

    it('should apply multiple registered prompts in order', () => {
      // Arrange
      registerCustomPrompt('prompt1', mockHandler1);
      registerCustomPrompt('prompt2', mockHandler2);
      registerCustomPrompt('prompt3', mockHandler3);

      // Act
      applyCustomPrompts(['prompt1', 'prompt2', 'prompt3'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledWith(mockServer);
      expect(mockHandler2).toHaveBeenCalledWith(mockServer);
      expect(mockHandler3).toHaveBeenCalledWith(mockServer);
    });

    it('should log error when prompt id is not registered', () => {
      // Act
      applyCustomPrompts(['nonexistent'], mockServer);

      // Assert
      expect(mockConsoleError).toHaveBeenCalledWith('No custom prompt found for id: nonexistent');
    });

    it('should apply registered prompts and log errors for unregistered ones', () => {
      // Arrange
      registerCustomPrompt('prompt1', mockHandler1);

      // Act
      applyCustomPrompts(['prompt1', 'nonexistent', 'prompt2'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledWith(mockServer);
      expect(mockConsoleError).toHaveBeenCalledWith('No custom prompt found for id: nonexistent');
      expect(mockConsoleError).toHaveBeenCalledWith('No custom prompt found for id: prompt2');
      expect(mockConsoleError).toHaveBeenCalledTimes(2);
    });

    it('should handle empty prompt ids array', () => {
      // Act
      applyCustomPrompts([], mockServer);

      // Assert
      expect(mockHandler1).not.toHaveBeenCalled();
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should handle same prompt id appearing multiple times', () => {
      // Arrange
      registerCustomPrompt('prompt1', mockHandler1);

      // Act
      applyCustomPrompts(['prompt1', 'prompt1', 'prompt1'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledTimes(3);
    });
  });

  describe('applyCustomResources', () => {
    it('should apply registered resource when id exists', () => {
      // Arrange
      registerCustomResource('resource1', mockHandler1);

      // Act
      applyCustomResources(['resource1'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledWith(mockServer);
    });

    it('should apply multiple registered resources in order', () => {
      // Arrange
      registerCustomResource('resource1', mockHandler1);
      registerCustomResource('resource2', mockHandler2);
      registerCustomResource('resource3', mockHandler3);

      // Act
      applyCustomResources(['resource1', 'resource2', 'resource3'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledWith(mockServer);
      expect(mockHandler2).toHaveBeenCalledWith(mockServer);
      expect(mockHandler3).toHaveBeenCalledWith(mockServer);
    });

    it('should log error when resource id is not registered', () => {
      // Act
      applyCustomResources(['nonexistent'], mockServer);

      // Assert
      expect(mockConsoleError).toHaveBeenCalledWith('No custom resource found for id: nonexistent');
    });

    it('should apply registered resources and log errors for unregistered ones', () => {
      // Arrange
      registerCustomResource('resource1', mockHandler1);

      // Act
      applyCustomResources(['resource1', 'nonexistent', 'resource2'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledWith(mockServer);
      expect(mockConsoleError).toHaveBeenCalledWith('No custom resource found for id: nonexistent');
      expect(mockConsoleError).toHaveBeenCalledWith('No custom resource found for id: resource2');
      expect(mockConsoleError).toHaveBeenCalledTimes(2);
    });

    it('should handle empty resource ids array', () => {
      // Act
      applyCustomResources([], mockServer);

      // Assert
      expect(mockHandler1).not.toHaveBeenCalled();
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should handle same resource id appearing multiple times', () => {
      // Arrange
      registerCustomResource('resource1', mockHandler1);

      // Act
      applyCustomResources(['resource1', 'resource1', 'resource1'], mockServer);

      // Assert
      expect(mockHandler1).toHaveBeenCalledTimes(3);
    });
  });
});
