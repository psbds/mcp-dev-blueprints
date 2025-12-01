import { jest } from '@jest/globals';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { useTools } from '../../src/features/tool.js';
import { ToolDefinition } from '../../src/features/types.js';
import { getConfigManager } from '../../src/config/config-manager.js';

// Mock config manager
jest.mock('../../src/config/config-manager.js');

describe('features/tool', () => {
  let mockServer: any;
  let mockConfigManager: any;
  let consoleSpy: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockServer = {
      registerTool: jest.fn()
    };

    mockConfigManager = {
      loadTextFile: jest.fn()
    };

    (getConfigManager as jest.Mock).mockReturnValue(mockConfigManager);
    
    // Spy on console.info to avoid cluttering test output
    consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('useTools', () => {
    it('should register multiple tools', () => {
      // Arrange
      const tools: ToolDefinition[] = [
        {
          id: 'tool1',
          title: 'Tool 1',
          description: 'Desc 1',
          content: []
        },
        {
          id: 'tool2',
          title: 'Tool 2',
          description: 'Desc 2',
          content: []
        }
      ];

      // Act
      useTools(mockServer as unknown as McpServer, tools);

      // Assert
      expect(mockServer.registerTool).toHaveBeenCalledTimes(2);
      expect(mockServer.registerTool).toHaveBeenCalledWith(
        'tool1',
        { title: 'Tool 1', description: 'Desc 1' },
        expect.any(Function)
      );
      expect(mockServer.registerTool).toHaveBeenCalledWith(
        'tool2',
        { title: 'Tool 2', description: 'Desc 2' },
        expect.any(Function)
      );
    });

    it('should handle text content correctly', async () => {
      // Arrange
      const tool: ToolDefinition = {
        id: 'text-tool',
        title: 'Text Tool',
        description: 'Text Desc',
        content: [{ type: 'text', text: 'Hello World' }]
      };

      // Act
      useTools(mockServer as unknown as McpServer, [tool]);
      
      // Get the registered handler
      const handler = mockServer.registerTool.mock.calls[0][2];
      const result = await handler({});

      // Assert
      expect(result).toEqual({
        content: [{ type: 'text', text: 'Hello World' }]
      });
    });

    it('should handle resource_link content correctly', async () => {
      // Arrange
      const tool: ToolDefinition = {
        id: 'link-tool',
        title: 'Link Tool',
        description: 'Link Desc',
        content: [{ 
          type: 'resource_link', 
          uri: 'https://example.com',
          name: 'Example',
          mimeType: 'text/html',
          description: 'An example link'
        }]
      };

      // Act
      useTools(mockServer as unknown as McpServer, [tool]);
      
      // Get the registered handler
      const handler = mockServer.registerTool.mock.calls[0][2];
      const result = await handler({});

      // Assert
      expect(result).toEqual({
        content: [{ 
          type: 'resource_link', 
          uri: 'https://example.com',
          name: 'Example',
          mimeType: 'text/html',
          description: 'An example link'
        }]
      });
    });

    it('should handle file content correctly', async () => {
      // Arrange
      const tool: ToolDefinition = {
        id: 'file-tool',
        title: 'File Tool',
        description: 'File Desc',
        content: [{ type: 'file', path: '/path/to/file.txt' }]
      };
      
      mockConfigManager.loadTextFile.mockReturnValue('File Content');

      // Act
      useTools(mockServer as unknown as McpServer, [tool]);
      
      // Get the registered handler
      const handler = mockServer.registerTool.mock.calls[0][2];
      const result = await handler({});

      // Assert
      expect(mockConfigManager.loadTextFile).toHaveBeenCalledWith('/path/to/file.txt');
      expect(result).toEqual({
        content: [{ type: 'text', text: 'File Content' }]
      });
    });

    it('should handle mixed content types', async () => {
      // Arrange
      const tool: ToolDefinition = {
        id: 'mixed-tool',
        title: 'Mixed Tool',
        description: 'Mixed Desc',
        content: [
          { type: 'text', text: 'Text Part' },
          { type: 'file', path: '/path/to/file.txt' },
          { 
            type: 'resource_link', 
            uri: 'https://example.com',
            name: 'Example'
          }
        ]
      };
      
      mockConfigManager.loadTextFile.mockReturnValue('File Part');

      // Act
      useTools(mockServer as unknown as McpServer, [tool]);
      
      // Get the registered handler
      const handler = mockServer.registerTool.mock.calls[0][2];
      const result = await handler({});

      // Assert
      expect(result).toEqual({
        content: [
          { type: 'text', text: 'Text Part' },
          { type: 'text', text: 'File Part' },
          { 
            type: 'resource_link', 
            uri: 'https://example.com',
            name: 'Example',
            mimeType: undefined,
            description: undefined
          }
        ]
      });
    });
  });
});
