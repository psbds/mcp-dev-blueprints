import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import createRouter from '../../../src/server/http_server/router.js';
import * as handlers from '../../../src/server/http_server/handlers.js';

// Mock the handlers module
jest.mock('../../../src/server/http_server/handlers.js');

const mockHandlers = handlers as jest.Mocked<typeof handlers>;

describe('createRouter', () => {
  let mockRouter: express.Router;
  let mockHandlePost: jest.MockedFunction<any>;
  let mockHandleDefault: jest.MockedFunction<any>;
  let mockBeforeConnecting: jest.MockedFunction<(mcpServer: McpServer) => void>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock functions that can be called
    mockHandlePost = jest.fn();
    mockHandleDefault = jest.fn();
    mockBeforeConnecting = jest.fn();

    // Setup handlers mock to return our mock functions
    mockHandlers.handlePost.mockReturnValue(mockHandlePost);
    mockHandlers.handleDefault.mockReturnValue(mockHandleDefault);

    // Create a real router for testing
    mockRouter = express.Router();
    
    // Spy on router methods
    jest.spyOn(mockRouter, 'post');
    jest.spyOn(mockRouter, 'get');
    jest.spyOn(mockRouter, 'delete');

    // Mock express.Router to return our mocked router
    jest.spyOn(express, 'Router').mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when creating router with valid parameters', () => {
    const mcpServerId = 'test-server';
    const path = 'api/mcp';

    it('should create router with correct routes', () => {
      // Act
      const result = createRouter(mcpServerId, path, mockBeforeConnecting);

      // Assert
      expect(express.Router).toHaveBeenCalled();
      expect(result).toBe(mockRouter);
      expect(mockRouter.post).toHaveBeenCalledWith(`/${path}`, mockHandlePost);
      expect(mockRouter.get).toHaveBeenCalledWith(`/${path}`, mockHandleDefault);
      expect(mockRouter.delete).toHaveBeenCalledWith(`/${path}`, mockHandleDefault);
    });

    it('should call handlePost with correct parameters', () => {
      // Act
      createRouter(mcpServerId, path, mockBeforeConnecting);

      // Assert
      expect(mockHandlers.handlePost).toHaveBeenCalledWith(mcpServerId, mockBeforeConnecting);
    });

    it('should call handleDefault with correct parameters for GET and DELETE routes', () => {
      // Act
      createRouter(mcpServerId, path, mockBeforeConnecting);

      // Assert
      expect(mockHandlers.handleDefault).toHaveBeenCalledWith(mcpServerId);
      expect(mockHandlers.handleDefault).toHaveBeenCalledTimes(2); // Called for both GET and DELETE
    });
  });

  describe('when creating router with different path formats', () => {
    const mcpServerId = 'test-server';

    it('should handle path without leading slash', () => {
      // Arrange
      const path = 'api/mcp';

      // Act
      createRouter(mcpServerId, path, mockBeforeConnecting);

      // Assert
      expect(mockRouter.post).toHaveBeenCalledWith('/api/mcp', mockHandlePost);
      expect(mockRouter.get).toHaveBeenCalledWith('/api/mcp', mockHandleDefault);
      expect(mockRouter.delete).toHaveBeenCalledWith('/api/mcp', mockHandleDefault);
    });

    it('should handle empty path', () => {
      // Arrange
      const path = '';

      // Act
      createRouter(mcpServerId, path, mockBeforeConnecting);

      // Assert
      expect(mockRouter.post).toHaveBeenCalledWith('/', mockHandlePost);
      expect(mockRouter.get).toHaveBeenCalledWith('/', mockHandleDefault);
      expect(mockRouter.delete).toHaveBeenCalledWith('/', mockHandleDefault);
    });

    it('should handle path with special characters', () => {
      // Arrange
      const path = 'api/v1/mcp-server';

      // Act
      createRouter(mcpServerId, path, mockBeforeConnecting);

      // Assert
      expect(mockRouter.post).toHaveBeenCalledWith('/api/v1/mcp-server', mockHandlePost);
      expect(mockRouter.get).toHaveBeenCalledWith('/api/v1/mcp-server', mockHandleDefault);
      expect(mockRouter.delete).toHaveBeenCalledWith('/api/v1/mcp-server', mockHandleDefault);
    });
  });

  describe('when creating router with different server IDs', () => {
    const path = 'api/mcp';

    it('should handle alphanumeric server ID', () => {
      // Arrange
      const mcpServerId = 'server123';

      // Act
      createRouter(mcpServerId, path, mockBeforeConnecting);

      // Assert
      expect(mockHandlers.handlePost).toHaveBeenCalledWith(mcpServerId, mockBeforeConnecting);
      expect(mockHandlers.handleDefault).toHaveBeenCalledWith(mcpServerId);
    });

    it('should handle server ID with special characters', () => {
      // Arrange
      const mcpServerId = 'test-server_v1.0';

      // Act
      createRouter(mcpServerId, path, mockBeforeConnecting);

      // Assert
      expect(mockHandlers.handlePost).toHaveBeenCalledWith(mcpServerId, mockBeforeConnecting);
      expect(mockHandlers.handleDefault).toHaveBeenCalledWith(mcpServerId);
    });

    it('should handle empty server ID', () => {
      // Arrange
      const mcpServerId = '';

      // Act
      createRouter(mcpServerId, path, mockBeforeConnecting);

      // Assert
      expect(mockHandlers.handlePost).toHaveBeenCalledWith(mcpServerId, mockBeforeConnecting);
      expect(mockHandlers.handleDefault).toHaveBeenCalledWith(mcpServerId);
    });
  });
});