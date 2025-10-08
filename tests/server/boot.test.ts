import { jest } from '@jest/globals';

// Mock dependencies before importing the module under test
const mockLoadConfig = jest.fn() as jest.MockedFunction<(override_kb_path?: string) => { kbPath: string; mode: string }>;
const mockBootHttp = jest.fn() as jest.MockedFunction<(serversConfig: any[]) => Promise<void>>;
const mockBootStdio = jest.fn() as jest.MockedFunction<(serversConfig: any[]) => Promise<void>>;

const mockConfigManager = {
  loadServersConfig: jest.fn(),
  getMode: jest.fn()
};

const mockGetConfigManager = jest.fn(() => mockConfigManager);

// Mock all external dependencies
jest.mock('../../src/config/args-parser.js', () => mockLoadConfig);
jest.mock('../../src/server/http_server/server.js', () => mockBootHttp);
jest.mock('../../src/server/stdio_server/server.js', () => mockBootStdio);
jest.mock('../../src/config/config-manager.js', () => ({
  getConfigManager: mockGetConfigManager
}));

// Import after mocks are set up
import boot from '../../src/server/boot.js';
import { ServerConfig } from '../../src/server/types.js';

describe('Boot Module', () => {
  const mockServersConfig: ServerConfig[] = [
    {
      name: 'Test Server',
      path: '/api/test',
      features: ['test-feature.json']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset all mock implementations to their default state
    mockLoadConfig.mockReturnValue({ kbPath: '/test/kb', mode: 'stdio' });
    mockGetConfigManager.mockReturnValue(mockConfigManager);
    mockConfigManager.loadServersConfig.mockReturnValue(mockServersConfig);
    mockConfigManager.getMode.mockReturnValue('stdio');
    mockBootHttp.mockResolvedValue(undefined);
    mockBootStdio.mockResolvedValue(undefined);
  });

  describe('boot function', () => {
    it('should load configuration and boot stdio server by default', async () => {
      // Arrange
      mockConfigManager.getMode.mockReturnValue('stdio');

      // Act
      await boot();

      // Assert
      expect(mockLoadConfig).toHaveBeenCalledWith(undefined);
      expect(mockGetConfigManager).toHaveBeenCalled();
      expect(mockConfigManager.loadServersConfig).toHaveBeenCalled();
      expect(mockConfigManager.getMode).toHaveBeenCalled();
      expect(mockBootStdio).toHaveBeenCalledWith(mockServersConfig);
      expect(mockBootHttp).not.toHaveBeenCalled();
    });

    it('should boot HTTP server when mode is http', async () => {
      // Arrange
      mockConfigManager.getMode.mockReturnValue('http');

      // Act
      await boot();

      // Assert
      expect(mockLoadConfig).toHaveBeenCalledWith(undefined);
      expect(mockGetConfigManager).toHaveBeenCalled();
      expect(mockConfigManager.loadServersConfig).toHaveBeenCalled();
      expect(mockConfigManager.getMode).toHaveBeenCalled();
      expect(mockBootHttp).toHaveBeenCalledWith(mockServersConfig);
      expect(mockBootStdio).not.toHaveBeenCalled();
    });

    it('should boot stdio server when mode is stdio', async () => {
      // Arrange
      mockConfigManager.getMode.mockReturnValue('stdio');

      // Act
      await boot();

      // Assert
      expect(mockLoadConfig).toHaveBeenCalledWith(undefined);
      expect(mockGetConfigManager).toHaveBeenCalled();
      expect(mockConfigManager.loadServersConfig).toHaveBeenCalled();
      expect(mockConfigManager.getMode).toHaveBeenCalled();
      expect(mockBootStdio).toHaveBeenCalledWith(mockServersConfig);
      expect(mockBootHttp).not.toHaveBeenCalled();
    });

    it('should use override knowledge base path when provided', async () => {
      // Arrange
      const overridePath = '/custom/kb/path';
      mockConfigManager.getMode.mockReturnValue('stdio');

      // Act
      await boot(overridePath);

      // Assert
      expect(mockLoadConfig).toHaveBeenCalledWith(overridePath);
      expect(mockGetConfigManager).toHaveBeenCalled();
      expect(mockConfigManager.loadServersConfig).toHaveBeenCalled();
      expect(mockBootStdio).toHaveBeenCalledWith(mockServersConfig);
    });

    it('should throw error for invalid mode', async () => {
      // Arrange
      const invalidMode = 'invalid-mode';
      mockConfigManager.getMode.mockReturnValue(invalidMode);

      // Act & Assert
      await expect(boot()).rejects.toThrow(`Invalid mode parameter ${invalidMode}`);
      expect(mockLoadConfig).toHaveBeenCalledWith(undefined);
      expect(mockGetConfigManager).toHaveBeenCalled();
      expect(mockConfigManager.loadServersConfig).toHaveBeenCalled();
      expect(mockConfigManager.getMode).toHaveBeenCalled();
      expect(mockBootHttp).not.toHaveBeenCalled();
      expect(mockBootStdio).not.toHaveBeenCalled();
    });

    it('should pass servers configuration to HTTP server boot function', async () => {
      // Arrange
      const customServersConfig: ServerConfig[] = [
        {
          name: 'HTTP Server 1',
          path: '/api/server1',
          features: ['feature1.json']
        },
        {
          name: 'HTTP Server 2',
          path: '/api/server2',
          features: ['feature2.json', 'feature3.json']
        }
      ];
      mockConfigManager.getMode.mockReturnValue('http');
      mockConfigManager.loadServersConfig.mockReturnValue(customServersConfig);

      // Act
      await boot();

      // Assert
      expect(mockBootHttp).toHaveBeenCalledWith(customServersConfig);
      expect(mockBootStdio).not.toHaveBeenCalled();
    });

    it('should pass servers configuration to stdio server boot function', async () => {
      // Arrange
      const customServersConfig: ServerConfig[] = [
        {
          name: 'Stdio Server',
          path: '/stdio/server',
          features: ['stdio-feature.json']
        }
      ];
      mockConfigManager.getMode.mockReturnValue('stdio');
      mockConfigManager.loadServersConfig.mockReturnValue(customServersConfig);

      // Act
      await boot();

      // Assert
      expect(mockBootStdio).toHaveBeenCalledWith(customServersConfig);
      expect(mockBootHttp).not.toHaveBeenCalled();
    });

    it('should handle empty servers configuration', async () => {
      // Arrange
      const emptyServersConfig: ServerConfig[] = [];
      mockConfigManager.getMode.mockReturnValue('http');
      mockConfigManager.loadServersConfig.mockReturnValue(emptyServersConfig);

      // Act
      await boot();

      // Assert
      expect(mockBootHttp).toHaveBeenCalledWith(emptyServersConfig);
      expect(mockBootStdio).not.toHaveBeenCalled();
    });

    it('should propagate loadConfig errors', async () => {
      // Arrange
      const configError = new Error('Configuration loading failed');
      mockLoadConfig.mockImplementation(() => {
        throw configError;
      });

      // Act & Assert
      await expect(boot()).rejects.toThrow('Configuration loading failed');
      expect(mockLoadConfig).toHaveBeenCalledWith(undefined);
      expect(mockGetConfigManager).not.toHaveBeenCalled();
      expect(mockBootHttp).not.toHaveBeenCalled();
      expect(mockBootStdio).not.toHaveBeenCalled();
    });

    it('should propagate getConfigManager errors', async () => {
      // Arrange
      const configManagerError = new Error('Config manager not initialized');
      mockGetConfigManager.mockImplementation(() => {
        throw configManagerError;
      });

      // Act & Assert
      await expect(boot()).rejects.toThrow('Config manager not initialized');
      expect(mockLoadConfig).toHaveBeenCalledWith(undefined);
      expect(mockGetConfigManager).toHaveBeenCalled();
      expect(mockBootHttp).not.toHaveBeenCalled();
      expect(mockBootStdio).not.toHaveBeenCalled();
    });

    it('should propagate loadServersConfig errors', async () => {
      // Arrange
      const serversConfigError = new Error('Failed to load servers configuration');
      mockConfigManager.loadServersConfig.mockImplementation(() => {
        throw serversConfigError;
      });

      // Act & Assert
      await expect(boot()).rejects.toThrow('Failed to load servers configuration');
      expect(mockLoadConfig).toHaveBeenCalledWith(undefined);
      expect(mockGetConfigManager).toHaveBeenCalled();
      expect(mockConfigManager.loadServersConfig).toHaveBeenCalled();
      expect(mockBootHttp).not.toHaveBeenCalled();
      expect(mockBootStdio).not.toHaveBeenCalled();
    });

    it('should propagate HTTP server boot errors', async () => {
      // Arrange
      const httpBootError = new Error('HTTP server failed to start');
      mockConfigManager.getMode.mockReturnValue('http');
      mockBootHttp.mockRejectedValue(httpBootError);

      // Act & Assert
      await expect(boot()).rejects.toThrow('HTTP server failed to start');
      expect(mockBootHttp).toHaveBeenCalledWith(mockServersConfig);
      expect(mockBootStdio).not.toHaveBeenCalled();
    });

    it('should propagate stdio server boot errors', async () => {
      // Arrange
      const stdioBootError = new Error('Stdio server failed to start');
      mockConfigManager.getMode.mockReturnValue('stdio');
      mockBootStdio.mockRejectedValue(stdioBootError);

      // Act & Assert
      await expect(boot()).rejects.toThrow('Stdio server failed to start');
      expect(mockBootStdio).toHaveBeenCalledWith(mockServersConfig);
      expect(mockBootHttp).not.toHaveBeenCalled();
    });
  });

  describe('Mode validation edge cases', () => {
    it('should handle null mode', async () => {
      // Arrange
      mockConfigManager.getMode.mockReturnValue(null);

      // Act & Assert
      await expect(boot()).rejects.toThrow('Invalid mode parameter null');
    });

    it('should handle undefined mode', async () => {
      // Arrange
      mockConfigManager.getMode.mockReturnValue(undefined);

      // Act & Assert
      await expect(boot()).rejects.toThrow('Invalid mode parameter undefined');
    });

    it('should handle empty string mode', async () => {
      // Arrange
      mockConfigManager.getMode.mockReturnValue('');

      // Act & Assert
      await expect(boot()).rejects.toThrow('Invalid mode parameter ');
    });

    it('should handle whitespace-only mode', async () => {
      // Arrange
      mockConfigManager.getMode.mockReturnValue('   ');

      // Act & Assert
      await expect(boot()).rejects.toThrow('Invalid mode parameter    ');
    });

    it('should be case-sensitive for mode validation', async () => {
      // Arrange
      mockConfigManager.getMode.mockReturnValue('HTTP');

      // Act & Assert
      await expect(boot()).rejects.toThrow('Invalid mode parameter HTTP');
    });

    it('should be case-sensitive for stdio mode validation', async () => {
      // Arrange
      mockConfigManager.getMode.mockReturnValue('STDIO');

      // Act & Assert
      await expect(boot()).rejects.toThrow('Invalid mode parameter STDIO');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete boot flow for HTTP mode', async () => {
      // Arrange
      const kbPath = '/integration/kb';
      const httpServersConfig: ServerConfig[] = [
        {
          name: 'Integration HTTP Server',
          path: '/api/integration',
          features: ['integration-http.json']
        }
      ];
      
      mockLoadConfig.mockReturnValue({ kbPath, mode: 'http' });
      mockConfigManager.getMode.mockReturnValue('http');
      mockConfigManager.loadServersConfig.mockReturnValue(httpServersConfig);

      // Act
      await boot(kbPath);

      // Assert
      expect(mockLoadConfig).toHaveBeenCalledWith(kbPath);
      expect(mockGetConfigManager).toHaveBeenCalled();
      expect(mockConfigManager.loadServersConfig).toHaveBeenCalled();
      expect(mockConfigManager.getMode).toHaveBeenCalled();
      expect(mockBootHttp).toHaveBeenCalledWith(httpServersConfig);
      expect(mockBootStdio).not.toHaveBeenCalled();
    });

    it('should handle complete boot flow for stdio mode', async () => {
      // Arrange
      const kbPath = '/integration/stdio-kb';
      const stdioServersConfig: ServerConfig[] = [
        {
          name: 'Integration Stdio Server',
          path: '/stdio/integration',
          features: ['integration-stdio.json']
        }
      ];
      
      mockLoadConfig.mockReturnValue({ kbPath, mode: 'stdio' });
      mockConfigManager.getMode.mockReturnValue('stdio');
      mockConfigManager.loadServersConfig.mockReturnValue(stdioServersConfig);

      // Act
      await boot(kbPath);

      // Assert
      expect(mockLoadConfig).toHaveBeenCalledWith(kbPath);
      expect(mockGetConfigManager).toHaveBeenCalled();
      expect(mockConfigManager.loadServersConfig).toHaveBeenCalled();
      expect(mockConfigManager.getMode).toHaveBeenCalled();
      expect(mockBootStdio).toHaveBeenCalledWith(stdioServersConfig);
      expect(mockBootHttp).not.toHaveBeenCalled();
    });

    it('should handle multiple servers configuration for HTTP mode', async () => {
      // Arrange
      const multipleServersConfig: ServerConfig[] = [
        {
          name: 'API Server 1',
          path: '/api/server1',
          features: ['api1-feature1.json', 'api1-feature2.json']
        },
        {
          name: 'API Server 2',
          path: '/api/server2',
          features: ['api2-feature1.json']
        },
        {
          name: 'Admin Server',
          path: '/admin',
          features: ['admin-feature.json']
        }
      ];

      mockConfigManager.getMode.mockReturnValue('http');
      mockConfigManager.loadServersConfig.mockReturnValue(multipleServersConfig);

      // Act
      await boot();

      // Assert
      expect(mockBootHttp).toHaveBeenCalledWith(multipleServersConfig);
      expect(mockBootStdio).not.toHaveBeenCalled();
    });
  });

  describe('Call order verification', () => {
    it('should call functions in correct order for successful boot', async () => {
      // Arrange
      const callOrder: string[] = [];
      
      mockLoadConfig.mockImplementation(() => {
        callOrder.push('loadConfig');
        return { kbPath: '/test', mode: 'stdio' };
      });
      
      mockGetConfigManager.mockImplementation(() => {
        callOrder.push('getConfigManager');
        return mockConfigManager;
      });
      
      mockConfigManager.loadServersConfig.mockImplementation(() => {
        callOrder.push('loadServersConfig');
        return mockServersConfig;
      });
      
      mockConfigManager.getMode.mockImplementation(() => {
        callOrder.push('getMode');
        return 'stdio';
      });
      
      mockBootStdio.mockImplementation(async () => {
        callOrder.push('bootStdio');
      });

      // Act
      await boot();

      // Assert
      expect(callOrder).toEqual([
        'loadConfig',
        'getConfigManager',
        'loadServersConfig',
        'getMode', // First call for http check
        'getMode', // Second call for stdio check
        'bootStdio'
      ]);
    });

    it('should stop execution at first error and not proceed to server boot', async () => {
      // Arrange
      const callOrder: string[] = [];
      
      mockLoadConfig.mockImplementation(() => {
        callOrder.push('loadConfig');
        return { kbPath: '/test', mode: 'stdio' };
      });
      
      mockGetConfigManager.mockImplementation(() => {
        callOrder.push('getConfigManager');
        return mockConfigManager;
      });
      
      mockConfigManager.loadServersConfig.mockImplementation(() => {
        callOrder.push('loadServersConfig');
        throw new Error('Config error');
      });
      
      mockBootStdio.mockImplementation(async () => {
        callOrder.push('bootStdio');
      });

      // Act & Assert
      await expect(boot()).rejects.toThrow('Config error');
      expect(callOrder).toEqual([
        'loadConfig',
        'getConfigManager',
        'loadServersConfig'
      ]);
      expect(callOrder).not.toContain('bootStdio');
    });
  });
});