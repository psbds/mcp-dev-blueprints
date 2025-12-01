import { jest } from '@jest/globals';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { useResources } from '../../src/features/resource.js';
import { ResourceDefinition } from '../../src/features/types.js';
import { getConfigManager } from '../../src/config/config-manager.js';

// Mock config manager
jest.mock('../../src/config/config-manager.js');

describe('features/resource', () => {
  let mockServer: any;
  let mockConfigManager: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockServer = {
      registerResource: jest.fn()
    };

    mockConfigManager = {
      loadTextFile: jest.fn()
    };

    (getConfigManager as jest.Mock).mockReturnValue(mockConfigManager);
  });

  describe('useResources', () => {
    it('should register multiple resources', () => {
      // Arrange
      const resources: ResourceDefinition[] = [
        {
          id: 'res1',
          uri: 'file:///res1',
          title: 'Resource 1',
          description: 'Desc 1',
          mimeType: 'text/plain',
          content: []
        },
        {
          id: 'res2',
          uri: 'file:///res2',
          title: 'Resource 2',
          description: 'Desc 2',
          mimeType: 'application/json',
          content: []
        }
      ];

      // Act
      useResources(mockServer as unknown as McpServer, resources);

      // Assert
      expect(mockServer.registerResource).toHaveBeenCalledTimes(2);
      expect(mockServer.registerResource).toHaveBeenCalledWith(
        'res1',
        'file:///res1',
        { title: 'Resource 1', description: 'Desc 1', mimeType: 'text/plain' },
        expect.any(Function)
      );
      expect(mockServer.registerResource).toHaveBeenCalledWith(
        'res2',
        'file:///res2',
        { title: 'Resource 2', description: 'Desc 2', mimeType: 'application/json' },
        expect.any(Function)
      );
    });

    it('should handle text content correctly', async () => {
      // Arrange
      const resource: ResourceDefinition = {
        id: 'text-res',
        uri: 'file:///text',
        title: 'Text Resource',
        description: 'Text Desc',
        mimeType: 'text/plain',
        content: [{ type: 'text', text: 'Hello World' }]
      };

      // Act
      useResources(mockServer as unknown as McpServer, [resource]);
      
      // Get the registered handler
      const handler = mockServer.registerResource.mock.calls[0][3];
      const result = await handler({ href: 'file:///text' });

      // Assert
      expect(result).toEqual({
        contents: [{
          uri: 'file:///text',
          text: 'Hello World'
        }]
      });
    });

    it('should handle file content correctly', async () => {
      // Arrange
      const resource: ResourceDefinition = {
        id: 'file-res',
        uri: 'file:///file',
        title: 'File Resource',
        description: 'File Desc',
        mimeType: 'text/plain',
        content: [{ type: 'file', path: '/path/to/file.txt' }]
      };
      
      mockConfigManager.loadTextFile.mockReturnValue('File Content');

      // Act
      useResources(mockServer as unknown as McpServer, [resource]);
      
      // Get the registered handler
      const handler = mockServer.registerResource.mock.calls[0][3];
      const result = await handler({ href: 'file:///file' });

      // Assert
      expect(mockConfigManager.loadTextFile).toHaveBeenCalledWith('/path/to/file.txt');
      expect(result).toEqual({
        contents: [{
          uri: 'file:///file',
          text: 'File Content'
        }]
      });
    });

    it('should handle uri content correctly', async () => {
      // Arrange
      const resource: ResourceDefinition = {
        id: 'uri-res',
        uri: 'file:///uri',
        title: 'URI Resource',
        description: 'URI Desc',
        mimeType: 'text/plain',
        content: [{ type: 'uri', uri: 'https://example.com' }]
      };

      // Act
      useResources(mockServer as unknown as McpServer, [resource]);
      
      // Get the registered handler
      const handler = mockServer.registerResource.mock.calls[0][3];
      const result = await handler({ href: 'file:///uri' });

      // Assert
      expect(result).toEqual({
        contents: [{
          uri: 'https://example.com',
          text: 'Resource available at: https://example.com'
        }]
      });
    });

    it('should handle mixed content types', async () => {
      // Arrange
      const resource: ResourceDefinition = {
        id: 'mixed-res',
        uri: 'file:///mixed',
        title: 'Mixed Resource',
        description: 'Mixed Desc',
        mimeType: 'text/plain',
        content: [
          { type: 'text', text: 'Text Part' },
          { type: 'file', path: '/path/to/file.txt' },
          { type: 'uri', uri: 'https://example.com' }
        ]
      };
      
      mockConfigManager.loadTextFile.mockReturnValue('File Part');

      // Act
      useResources(mockServer as unknown as McpServer, [resource]);
      
      // Get the registered handler
      const handler = mockServer.registerResource.mock.calls[0][3];
      const result = await handler({ href: 'file:///mixed' });

      // Assert
      expect(result).toEqual({
        contents: [
          { uri: 'file:///mixed', text: 'Text Part' },
          { uri: 'file:///mixed', text: 'File Part' },
          { uri: 'https://example.com', text: 'Resource available at: https://example.com' }
        ]
      });
    });
  });
});
