import { jest } from '@jest/globals';

// Create mock transport type that matches the expected Transport interface
interface MockTransport {
  start(): Promise<void>;
  send(message: any): Promise<void>;
  close(): Promise<void>;
}

// Mock dependencies before importing the module under test
const mockConnect = jest.fn() as jest.MockedFunction<(transport: any) => Promise<void>>;

const mockMcpServer = {
  connect: mockConnect,
  name: 'test-server',
  version: '1.0.0'
};

const mockConfigManager = {
  loadFeature: jest.fn()
};

const mockUseTools = jest.fn();
const mockUseResources = jest.fn();
const mockUsePrompts = jest.fn();
const mockApplyCustomTools = jest.fn();
const mockApplyCustomResources = jest.fn();
const mockApplyCustomPrompts = jest.fn();

// Mock all external dependencies
jest.mock('@modelcontextprotocol/sdk/server/mcp.js', () => ({
  McpServer: jest.fn().mockImplementation((config: any) => ({
    ...mockMcpServer,
    name: config.name,
    version: config.version,
    connect: mockConnect
  }))
}));

jest.mock('../../src/config/config-manager.js', () => ({
  getConfigManager: jest.fn(() => mockConfigManager)
}));

jest.mock('../../src/features/tool.js', () => ({
  useTools: mockUseTools
}));

jest.mock('../../src/features/resource.js', () => ({
  useResources: mockUseResources
}));

jest.mock('../../src/features/prompt.js', () => ({
  usePrompts: mockUsePrompts
}));

jest.mock('../../src/features/custom.js', () => ({
  applyCustomTools: mockApplyCustomTools,
  applyCustomResources: mockApplyCustomResources,
  applyCustomPrompts: mockApplyCustomPrompts
}));

// Import after mocks are set up
import { initializeMcpServer, configure } from '../../src/server/server.js';
import { ServerConfig } from '../../src/server/types.js';
import { ServerFeature } from '../../src/features/types.js';

// Mock console methods to avoid noise in tests
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleTable = jest.spyOn(console, 'table').mockImplementation(() => {});

describe('Server Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnect.mockResolvedValue(undefined);
    // Reset mock implementations to ensure clean state between tests
    mockConfigManager.loadFeature.mockReset();
  });

  describe('initializeMcpServer', () => {
    const mockTransport: MockTransport = {
      start: jest.fn(() => Promise.resolve()),
      send: jest.fn(() => Promise.resolve()),
      close: jest.fn(() => Promise.resolve())
    };
    const mockBeforeConnect = jest.fn();

    it('should initialize MCP server with correct configuration', async () => {
      // Arrange
      const serverName = 'test-server';

      // Act
      await initializeMcpServer(serverName, mockTransport, mockBeforeConnect);

      // Assert
      expect(mockBeforeConnect).toHaveBeenCalledWith(expect.objectContaining({
        name: serverName,
        version: '1.0.0'
      }));
      expect(mockConnect).toHaveBeenCalledWith(mockTransport);
    });

    it('should call beforeConnect hook before connecting to transport', async () => {
      // Arrange
      const serverName = 'hook-test-server';
      const callOrder: string[] = [];
      
      const beforeConnectSpy = jest.fn(() => {
        callOrder.push('beforeConnect');
      });

      mockConnect.mockImplementation(() => {
        callOrder.push('connect');
        return Promise.resolve();
      });

      // Act
      await initializeMcpServer(serverName, mockTransport, beforeConnectSpy);

      // Assert
      expect(callOrder).toEqual(['beforeConnect', 'connect']);
    });

    it('should handle transport connection errors', async () => {
      // Arrange
      const serverName = 'error-server';
      const connectionError = new Error('Connection failed');
      mockConnect.mockRejectedValue(connectionError);

      // Act & Assert
      await expect(initializeMcpServer(serverName, mockTransport, mockBeforeConnect))
        .rejects.toThrow('Connection failed');
    });
  });

  describe('configure', () => {
    const mockServerConfig: ServerConfig = {
      name: 'test-server',
      path: '/api/test',
      features: ['feature1.json', 'feature2.json']
    };

    const mockFeature1: ServerFeature = {
      tools: [
        {
          id: 'tool1',
          title: 'Test Tool 1',
          description: 'First test tool',
          content: [{ type: 'text', text: 'Tool 1 content' }]
        }
      ],
      resources: [
        {
          id: 'resource1',
          uri: 'test://resource1',
          title: 'Test Resource 1',
          description: 'First test resource',
          mimeType: 'text/plain',
          content: [{ type: 'text', text: 'Resource 1 content' }]
        }
      ],
      prompts: [
        {
          id: 'prompt1',
          title: 'Test Prompt 1',
          description: 'First test prompt',
          messages: [{ role: 'user', content: { type: 'text', text: 'Prompt 1 message' } }]
        }
      ],
      custom_tools: ['custom-tool-1'],
      custom_resources: ['custom-resource-1'],
      custom_prompts: ['custom-prompt-1']
    };

    const mockFeature2: ServerFeature = {
      tools: [
        {
          id: 'tool2',
          title: 'Test Tool 2',
          description: 'Second test tool',
          content: [{ type: 'text', text: 'Tool 2 content' }]
        }
      ],
      resources: [],
      prompts: [],
      custom_tools: ['custom-tool-2'],
      custom_resources: [],
      custom_prompts: []
    };

    beforeEach(() => {
      mockConfigManager.loadFeature
        .mockReturnValueOnce(mockFeature1)
        .mockReturnValueOnce(mockFeature2);
    });

    it('should configure server with all features and log configuration info', () => {
      // Act
      const configureFunction = configure(mockServerConfig);

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `Setting up server: ${mockServerConfig.name} at path: /${mockServerConfig.path}`
      );
      expect(mockConfigManager.loadFeature).toHaveBeenCalledTimes(2);
      expect(mockConfigManager.loadFeature).toHaveBeenCalledWith('feature1.json');
      expect(mockConfigManager.loadFeature).toHaveBeenCalledWith('feature2.json');
      expect(mockConsoleTable).toHaveBeenCalledWith([
        {
          Feature: 'feature1.json',
          Tools: 'tool1',
          CustomTools: 'custom-tool-1',
          Resources: 'resource1',
          CustomResources: 'custom-resource-1',
          Prompts: 'prompt1',
          CustomPrompts: 'custom-prompt-1'
        },
        {
          Feature: 'feature2.json',
          Tools: 'tool2',
          CustomTools: 'custom-tool-2',
          Resources: 'None',
          CustomResources: 'None',
          Prompts: 'None',
          CustomPrompts: 'None'
        }
      ]);
      expect(typeof configureFunction).toBe('function');
    });

    it('should apply all features to MCP server when configuration function is called', () => {
      // Arrange
      const mockMcpServerInstance = {};
      const configureFunction = configure(mockServerConfig);

      // Act
      configureFunction(mockMcpServerInstance as any);

      // Assert
      expect(mockUseTools).toHaveBeenCalledWith(mockMcpServerInstance, [
        mockFeature1.tools[0],
        mockFeature2.tools[0]
      ]);
      expect(mockUseResources).toHaveBeenCalledWith(mockMcpServerInstance, [
        mockFeature1.resources[0]
      ]);
      expect(mockUsePrompts).toHaveBeenCalledWith(mockMcpServerInstance, [
        mockFeature1.prompts[0]
      ]);
      expect(mockApplyCustomTools).toHaveBeenCalledWith(
        ['custom-tool-1', 'custom-tool-2'],
        mockMcpServerInstance
      );
      expect(mockApplyCustomResources).toHaveBeenCalledWith(
        ['custom-resource-1'],
        mockMcpServerInstance
      );
      expect(mockApplyCustomPrompts).toHaveBeenCalledWith(
        ['custom-prompt-1'],
        mockMcpServerInstance
      );
    });

    it('should handle empty feature arrays gracefully', () => {
      // Arrange
      const emptyFeature: ServerFeature = {
        tools: [],
        resources: [],
        prompts: [],
        custom_tools: [],
        custom_resources: [],
        custom_prompts: []
      };
      
      const emptyConfig: ServerConfig = {
        name: 'empty-server',
        path: '/api/empty',
        features: ['empty-feature.json']
      };

      // Reset the mock and set it up for this specific test
      mockConfigManager.loadFeature.mockReset();
      mockConfigManager.loadFeature.mockReturnValue(emptyFeature);
      const mockMcpServerInstance = {};

      // Act
      const configureFunction = configure(emptyConfig);
      configureFunction(mockMcpServerInstance as any);

      // Assert
      expect(mockUseTools).toHaveBeenCalledWith(mockMcpServerInstance, []);
      expect(mockUseResources).toHaveBeenCalledWith(mockMcpServerInstance, []);
      expect(mockUsePrompts).toHaveBeenCalledWith(mockMcpServerInstance, []);
      expect(mockApplyCustomTools).toHaveBeenCalledWith([], mockMcpServerInstance);
      expect(mockApplyCustomResources).toHaveBeenCalledWith([], mockMcpServerInstance);
      expect(mockApplyCustomPrompts).toHaveBeenCalledWith([], mockMcpServerInstance);
    });

    it('should handle configuration with no features', () => {
      // Arrange
      const noFeaturesConfig: ServerConfig = {
        name: 'no-features-server',
        path: '/api/nofeatures',
        features: []
      };

      const mockMcpServerInstance = {};

      // Act
      const configureFunction = configure(noFeaturesConfig);
      configureFunction(mockMcpServerInstance as any);

      // Assert
      expect(mockConfigManager.loadFeature).not.toHaveBeenCalled();
      expect(mockUseTools).toHaveBeenCalledWith(mockMcpServerInstance, []);
      expect(mockUseResources).toHaveBeenCalledWith(mockMcpServerInstance, []);
      expect(mockUsePrompts).toHaveBeenCalledWith(mockMcpServerInstance, []);
      expect(mockApplyCustomTools).toHaveBeenCalledWith([], mockMcpServerInstance);
      expect(mockApplyCustomResources).toHaveBeenCalledWith([], mockMcpServerInstance);
      expect(mockApplyCustomPrompts).toHaveBeenCalledWith([], mockMcpServerInstance);
    });

    it('should handle multiple tools, resources, and prompts in feature info display', () => {
      // Arrange
      const multiItemFeature: ServerFeature = {
        tools: [
          {
            id: 'tool1',
            title: 'Tool 1',
            description: 'First tool',
            content: [{ type: 'text', text: 'Tool 1 content' }]
          },
          {
            id: 'tool2',
            title: 'Tool 2',
            description: 'Second tool',
            content: [{ type: 'text', text: 'Tool 2 content' }]
          }
        ],
        resources: [
          {
            id: 'resource1',
            uri: 'test://resource1',
            title: 'Resource 1',
            description: 'First resource',
            mimeType: 'text/plain',
            content: [{ type: 'text', text: 'Resource 1 content' }]
          },
          {
            id: 'resource2',
            uri: 'test://resource2',
            title: 'Resource 2',
            description: 'Second resource',
            mimeType: 'application/json',
            content: [{ type: 'text', text: 'Resource 2 content' }]
          }
        ],
        prompts: [
          {
            id: 'prompt1',
            title: 'Prompt 1',
            description: 'First prompt',
            messages: [{ role: 'user', content: { type: 'text', text: 'Prompt 1 message' } }]
          },
          {
            id: 'prompt2',
            title: 'Prompt 2',
            description: 'Second prompt',
            messages: [{ role: 'user', content: { type: 'text', text: 'Prompt 2 message' } }]
          }
        ],
        custom_tools: ['custom-tool-1', 'custom-tool-2'],
        custom_resources: ['custom-resource-1', 'custom-resource-2'],
        custom_prompts: ['custom-prompt-1', 'custom-prompt-2']
      };

      const multiItemConfig: ServerConfig = {
        name: 'multi-item-server',
        path: '/api/multi',
        features: ['multi-item-feature.json']
      };

      // Reset the mock and set it up for this specific test
      mockConfigManager.loadFeature.mockReset();
      mockConfigManager.loadFeature.mockReturnValue(multiItemFeature);

      // Act
      configure(multiItemConfig);

      // Assert
      expect(mockConsoleTable).toHaveBeenCalledWith([
        {
          Feature: 'multi-item-feature.json',
          Tools: 'tool1, tool2',
          CustomTools: 'custom-tool-1, custom-tool-2',
          Resources: 'resource1, resource2',
          CustomResources: 'custom-resource-1, custom-resource-2',
          Prompts: 'prompt1, prompt2',
          CustomPrompts: 'custom-prompt-1, custom-prompt-2'
        }
      ]);
    });

    it('should propagate feature loading errors', () => {
      // Arrange
      const errorConfig: ServerConfig = {
        name: 'error-server',
        path: '/api/error',
        features: ['invalid-feature.json']
      };

      const loadError = new Error('Feature file not found');
      // Reset the mock and set it up to throw an error
      mockConfigManager.loadFeature.mockReset();
      mockConfigManager.loadFeature.mockImplementation(() => {
        throw loadError;
      });

      // Act & Assert
      expect(() => configure(errorConfig)).toThrow('Feature file not found');
    });

    it('should handle path with leading slash in server configuration', () => {
      // Arrange
      const configWithLeadingSlash: ServerConfig = {
        name: 'slash-server',
        path: 'api/slash', // No leading slash
        features: []
      };

      // Act
      configure(configWithLeadingSlash);

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Setting up server: slash-server at path: /api/slash'
      );
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete server setup flow', async () => {
      // Arrange
      const serverName = 'integration-server';
      const mockTransport: MockTransport = {
        start: jest.fn(() => Promise.resolve()),
        send: jest.fn(() => Promise.resolve()),
        close: jest.fn(() => Promise.resolve())
      };
      const serverConfig: ServerConfig = {
        name: serverName,
        path: '/api/integration',
        features: ['integration-feature.json']
      };

      const integrationFeature: ServerFeature = {
        tools: [{
          id: 'integration-tool',
          title: 'Integration Tool',
          description: 'Tool for integration test',
          content: [{ type: 'text', text: 'Integration content' }]
        }],
        resources: [],
        prompts: [],
        custom_tools: [],
        custom_resources: [],
        custom_prompts: []
      };

      // Reset the mock and set it up for this specific test
      mockConfigManager.loadFeature.mockReset();
      mockConfigManager.loadFeature.mockReturnValue(integrationFeature);

      // Act
      const configureFunction = configure(serverConfig);
      await initializeMcpServer(serverName, mockTransport, configureFunction);

      // Assert
      expect(mockConfigManager.loadFeature).toHaveBeenCalledWith('integration-feature.json');
      expect(mockConnect).toHaveBeenCalledWith(mockTransport);
      expect(mockUseTools).toHaveBeenCalledWith(
        expect.objectContaining({ name: serverName }),
        [integrationFeature.tools[0]]
      );
    });

    it('should handle server initialization with complex configuration', async () => {
      // Arrange
      const serverName = 'complex-server';
      const mockTransport: MockTransport = {
        start: jest.fn(() => Promise.resolve()),
        send: jest.fn(() => Promise.resolve()),
        close: jest.fn(() => Promise.resolve())
      };
      const complexConfig: ServerConfig = {
        name: serverName,
        path: '/api/complex',
        features: ['feature-a.json', 'feature-b.json', 'feature-c.json']
      };

      const features: ServerFeature[] = [
        {
          tools: [{ id: 'tool-a', title: 'Tool A', description: 'Tool A desc', content: [] }],
          resources: [],
          prompts: [],
          custom_tools: ['custom-a'],
          custom_resources: [],
          custom_prompts: []
        },
        {
          tools: [],
          resources: [{ id: 'resource-b', uri: 'test://b', title: 'Resource B', description: 'Resource B desc', mimeType: 'text/plain', content: [] }],
          prompts: [],
          custom_tools: [],
          custom_resources: ['custom-b'],
          custom_prompts: []
        },
        {
          tools: [],
          resources: [],
          prompts: [{ id: 'prompt-c', title: 'Prompt C', description: 'Prompt C desc', messages: [] }],
          custom_tools: [],
          custom_resources: [],
          custom_prompts: ['custom-c']
        }
      ];

      // Reset the mock and set it up for this specific test
      mockConfigManager.loadFeature.mockReset();
      mockConfigManager.loadFeature
        .mockReturnValueOnce(features[0])
        .mockReturnValueOnce(features[1])
        .mockReturnValueOnce(features[2]);

      // Act
      const configureFunction = configure(complexConfig);
      await initializeMcpServer(serverName, mockTransport, configureFunction);

      // Assert
      expect(mockConfigManager.loadFeature).toHaveBeenCalledTimes(3);
      expect(mockApplyCustomTools).toHaveBeenCalledWith(['custom-a'], expect.any(Object));
      expect(mockApplyCustomResources).toHaveBeenCalledWith(['custom-b'], expect.any(Object));
      expect(mockApplyCustomPrompts).toHaveBeenCalledWith(['custom-c'], expect.any(Object));
    });
  });

  describe('Error Handling Scenarios', () => {
    it('should handle feature loading error during configuration', () => {
      // Arrange
      const errorConfig: ServerConfig = {
        name: 'error-server',
        path: '/api/error',
        features: ['valid-feature.json', 'invalid-feature.json']
      };

      const validFeature: ServerFeature = {
        tools: [],
        resources: [],
        prompts: [],
        custom_tools: [],
        custom_resources: [],
        custom_prompts: []
      };

      // Reset the mock and set it up for this specific test
      mockConfigManager.loadFeature.mockReset();
      mockConfigManager.loadFeature
        .mockReturnValueOnce(validFeature)
        .mockImplementationOnce(() => {
          throw new Error('Invalid feature file');
        });

      // Act & Assert
      expect(() => configure(errorConfig)).toThrow('Invalid feature file');
      expect(mockConfigManager.loadFeature).toHaveBeenCalledWith('valid-feature.json');
      expect(mockConfigManager.loadFeature).toHaveBeenCalledWith('invalid-feature.json');
    });

    it('should handle transport connection failure gracefully', async () => {
      // Arrange
      const serverName = 'failing-server';
      const mockTransport: MockTransport = {
        start: jest.fn(() => Promise.resolve()),
        send: jest.fn(() => Promise.resolve()),
        close: jest.fn(() => Promise.resolve())
      };
      const connectionError = new Error('Transport unavailable');
      
      mockConnect.mockRejectedValue(connectionError);

      // Act & Assert
      await expect(initializeMcpServer(serverName, mockTransport, jest.fn()))
        .rejects.toThrow('Transport unavailable');
    });
  });
});