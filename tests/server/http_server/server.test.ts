import { jest } from '@jest/globals';
import start from '../../../src/server/http_server/server.js';
import { configure } from '../../../src/server/server.js';
import createRouter from '../../../src/server/http_server/router.js';
import express from 'express';

// Mock dependencies
jest.mock('express');
jest.mock('../../../src/server/server.js');
jest.mock('../../../src/server/http_server/router.js');

describe('server/http_server/server', () => {
  let mockApp: any;
  let mockExpressJson: any;
  let consoleSpy: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Express App
    mockApp = {
      use: jest.fn(),
      listen: jest.fn((port, cb: any) => cb && cb())
    };
    (express as unknown as jest.Mock).mockReturnValue(mockApp);

    // Mock express.json middleware
    mockExpressJson = jest.fn();
    (express.json as unknown as jest.Mock).mockReturnValue(mockExpressJson);

    // Mock configure
    (configure as jest.Mock).mockReturnValue({});

    // Mock createRouter
    (createRouter as jest.Mock).mockReturnValue({});

    // Spy on console.log
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    delete process.env.HTTP_PORT;
  });

  describe('start', () => {
    it('should start http server with default port 3000', () => {
      // Arrange
      const config: any[] = [];

      // Act
      start(config);

      // Assert
      expect(express).toHaveBeenCalled();
      expect(mockApp.use).toHaveBeenCalledWith(mockExpressJson);
      expect(mockApp.listen).toHaveBeenCalledWith(3000, expect.any(Function));
      expect(consoleSpy).toHaveBeenCalledWith('MCP Server listening on port 3000');
    });

    it('should start http server with configured port from env', () => {
      // Arrange
      process.env.HTTP_PORT = '8080';
      const config: any[] = [];

      // Act
      start(config);

      // Assert
      expect(mockApp.listen).toHaveBeenCalledWith('8080', expect.any(Function));
      expect(consoleSpy).toHaveBeenCalledWith('MCP Server listening on port 8080');
    });

    it('should configure servers and routers for each config item', () => {
      // Arrange
      const config = [
        { name: 'server1', path: '/api/v1' },
        { name: 'server2', path: '/api/v2' }
      ];
      const mockServer1 = { id: 's1' };
      const mockServer2 = { id: 's2' };
      const mockRouter1 = { id: 'r1' };
      const mockRouter2 = { id: 'r2' };

      (configure as jest.Mock)
        .mockReturnValueOnce(mockServer1)
        .mockReturnValueOnce(mockServer2);

      (createRouter as jest.Mock)
        .mockReturnValueOnce(mockRouter1)
        .mockReturnValueOnce(mockRouter2);

      // Act
      start(config as any);

      // Assert
      // Verify configure calls
      expect(configure).toHaveBeenCalledTimes(2);
      expect(configure).toHaveBeenCalledWith(config[0]);
      expect(configure).toHaveBeenCalledWith(config[1]);

      // Verify createRouter calls
      expect(createRouter).toHaveBeenCalledTimes(2);
      expect(createRouter).toHaveBeenCalledWith('server1', '/api/v1', mockServer1);
      expect(createRouter).toHaveBeenCalledWith('server2', '/api/v2', mockServer2);

      // Verify app.use calls for routers
      expect(mockApp.use).toHaveBeenCalledWith(mockRouter1);
      expect(mockApp.use).toHaveBeenCalledWith(mockRouter2);
    });
  });
});
