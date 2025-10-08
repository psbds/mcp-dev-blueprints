import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { handlePost, handleDefault } from '../../../src/server/http_server/handlers.js';
import * as transportManager from '../../../src/server/http_server/transport.js';
import * as mcpServerFactory from '../../../src/server/server.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';

// Mock the dependencies
jest.mock('../../../src/server/http_server/transport.js');
jest.mock('../../../src/server/server.js');
jest.mock('@modelcontextprotocol/sdk/types.js');
jest.mock('@modelcontextprotocol/sdk/server/streamableHttp.js');

const mockTransportManager = transportManager as jest.Mocked<typeof transportManager>;
const mockMcpServerFactory = mcpServerFactory as jest.Mocked<typeof mcpServerFactory>;
const mockIsInitializeRequest = isInitializeRequest as jest.MockedFunction<typeof isInitializeRequest>;

describe('handlers', () => {
  let mockRequest: Partial<express.Request>;
  let mockResponse: Partial<express.Response>;
  let mockTransport: jest.Mocked<StreamableHTTPServerTransport>;
  let mockBeforeConnect: jest.MockedFunction<(mcpServer: McpServer) => void>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock request
    mockRequest = {
      headers: {},
      body: {},
    };

    // Setup mock response
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    // Setup mock transport
    mockTransport = {
      handleRequest: jest.fn().mockResolvedValue(undefined),
    } as any;

    // Setup mock beforeConnect function
    mockBeforeConnect = jest.fn();

    // Setup default mock implementations
    mockTransportManager.getTransport.mockReturnValue(undefined);
    mockTransportManager.createTransport.mockReturnValue(mockTransport);
    mockMcpServerFactory.initializeMcpServer.mockResolvedValue(undefined);
    mockIsInitializeRequest.mockReturnValue(false);
  });

  describe('handlePost', () => {
    const mcpServerId = 'test-server';

    describe('when session ID exists and transport is found', () => {
      beforeEach(() => {
        mockRequest.headers = { 'mcp-session-id': 'existing-session-id' };
        mockTransportManager.getTransport.mockReturnValue(mockTransport);
      });

      it('should use existing transport and handle request', async () => {
        // Act
        const handler = handlePost(mcpServerId, mockBeforeConnect);
        await handler(mockRequest as express.Request, mockResponse as express.Response);

        // Assert
        expect(mockTransportManager.getTransport).toHaveBeenCalledWith(mcpServerId, 'existing-session-id');
        expect(mockTransport.handleRequest).toHaveBeenCalledWith(
          mockRequest,
          mockResponse,
          mockRequest.body
        );
        expect(mockTransportManager.createTransport).not.toHaveBeenCalled();
        expect(mockMcpServerFactory.initializeMcpServer).not.toHaveBeenCalled();
      });
    });

    describe('when no session ID and initialization request', () => {
      beforeEach(() => {
        mockRequest.headers = {};
        mockIsInitializeRequest.mockReturnValue(true);
      });

      it('should create new transport, initialize server, and handle request', async () => {
        // Act
        const handler = handlePost(mcpServerId, mockBeforeConnect);
        await handler(mockRequest as express.Request, mockResponse as express.Response);

        // Assert
        expect(mockIsInitializeRequest).toHaveBeenCalledWith(mockRequest.body);
        expect(mockTransportManager.createTransport).toHaveBeenCalledWith(mcpServerId);
        expect(mockMcpServerFactory.initializeMcpServer).toHaveBeenCalledWith(
          mcpServerId,
          mockTransport,
          mockBeforeConnect
        );
        expect(mockTransport.handleRequest).toHaveBeenCalledWith(
          mockRequest,
          mockResponse,
          mockRequest.body
        );
      });
    });

    describe('when session ID is provided but invalid', () => {
      beforeEach(() => {
        mockRequest.headers = { 'mcp-session-id': 'invalid-session-id' };
        mockTransportManager.getTransport.mockReturnValue(undefined);
      });

      it('should return 400 error', async () => {
        // Act
        const handler = handlePost(mcpServerId, mockBeforeConnect);
        await handler(mockRequest as express.Request, mockResponse as express.Response);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Bad Request: No valid session ID provided',
          },
          id: null,
        });
        expect(mockTransport.handleRequest).not.toHaveBeenCalled();
      });
    });

    describe('when no session ID and not initialization request', () => {
      beforeEach(() => {
        mockRequest.headers = {};
        mockIsInitializeRequest.mockReturnValue(false);
      });

      it('should return 400 error', async () => {
        // Act
        const handler = handlePost(mcpServerId, mockBeforeConnect);
        await handler(mockRequest as express.Request, mockResponse as express.Response);

        // Assert
        expect(mockIsInitializeRequest).toHaveBeenCalledWith(mockRequest.body);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Bad Request: No valid session ID provided',
          },
          id: null,
        });
        expect(mockTransportManager.createTransport).not.toHaveBeenCalled();
      });
    });

    describe('when transport.handleRequest throws an error', () => {
      beforeEach(() => {
        mockRequest.headers = { 'mcp-session-id': 'existing-session-id' };
        mockTransportManager.getTransport.mockReturnValue(mockTransport);
        mockTransport.handleRequest.mockRejectedValue(new Error('Transport error'));
      });

      it('should propagate the error', async () => {
        // Act & Assert
        const handler = handlePost(mcpServerId, mockBeforeConnect);
        await expect(
          handler(mockRequest as express.Request, mockResponse as express.Response)
        ).rejects.toThrow('Transport error');
      });
    });

    describe('when initializeMcpServer throws an error', () => {
      beforeEach(() => {
        mockRequest.headers = {};
        mockIsInitializeRequest.mockReturnValue(true);
        mockMcpServerFactory.initializeMcpServer.mockRejectedValue(new Error('Init error'));
      });

      it('should propagate the error', async () => {
        // Act & Assert
        const handler = handlePost(mcpServerId, mockBeforeConnect);
        await expect(
          handler(mockRequest as express.Request, mockResponse as express.Response)
        ).rejects.toThrow('Init error');
      });
    });
  });

  describe('handleDefault', () => {
    const mcpServerId = 'test-server';
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    describe('when session ID exists and transport is found', () => {
      beforeEach(() => {
        mockRequest.headers = { 'mcp-session-id': 'valid-session-id' };
        mockTransportManager.getTransport.mockReturnValue(mockTransport);
      });

      it('should use existing transport and handle request', async () => {
        // Act
        const handler = handleDefault(mcpServerId);
        await handler(mockRequest as express.Request, mockResponse as express.Response);

        // Assert
        expect(mockTransportManager.getTransport).toHaveBeenCalledWith(mcpServerId, 'valid-session-id');
        expect(mockTransport.handleRequest).toHaveBeenCalledWith(mockRequest, mockResponse);
        expect(consoleSpy).not.toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.send).not.toHaveBeenCalled();
      });
    });

    describe('when no session ID is provided', () => {
      beforeEach(() => {
        mockRequest.headers = {};
      });

      it('should log error and return 400 status', async () => {
        // Act
        const handler = handleDefault(mcpServerId);
        await handler(mockRequest as express.Request, mockResponse as express.Response);

        // Assert
        expect(consoleSpy).toHaveBeenCalledWith(
          `Invalid or missing session ID: undefined for server: ${mcpServerId}`
        );
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith('Invalid or missing session ID');
        expect(mockTransport.handleRequest).not.toHaveBeenCalled();
      });
    });

    describe('when session ID is provided but transport is not found', () => {
      beforeEach(() => {
        mockRequest.headers = { 'mcp-session-id': 'invalid-session-id' };
        mockTransportManager.getTransport.mockReturnValue(undefined);
      });

      it('should log error and return 400 status', async () => {
        // Act
        const handler = handleDefault(mcpServerId);
        await handler(mockRequest as express.Request, mockResponse as express.Response);

        // Assert
        expect(mockTransportManager.getTransport).toHaveBeenCalledWith(mcpServerId, 'invalid-session-id');
        expect(consoleSpy).toHaveBeenCalledWith(
          `Invalid or missing session ID: invalid-session-id for server: ${mcpServerId}`
        );
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith('Invalid or missing session ID');
        expect(mockTransport.handleRequest).not.toHaveBeenCalled();
      });
    });

    describe('when transport.handleRequest throws an error', () => {
      beforeEach(() => {
        mockRequest.headers = { 'mcp-session-id': 'valid-session-id' };
        mockTransportManager.getTransport.mockReturnValue(mockTransport);
        mockTransport.handleRequest.mockRejectedValue(new Error('Transport error'));
      });

      it('should propagate the error', async () => {
        // Act & Assert
        const handler = handleDefault(mcpServerId);
        await expect(
          handler(mockRequest as express.Request, mockResponse as express.Response)
        ).rejects.toThrow('Transport error');
      });
    });

    describe('when session ID is empty string', () => {
      beforeEach(() => {
        mockRequest.headers = { 'mcp-session-id': '' };
        mockTransportManager.getTransport.mockReturnValue(undefined);
      });

      it('should log error with empty session ID and return 400 status', async () => {
        // Act
        const handler = handleDefault(mcpServerId);
        await handler(mockRequest as express.Request, mockResponse as express.Response);

        // Assert
        expect(consoleSpy).toHaveBeenCalledWith(
          `Invalid or missing session ID:  for server: ${mcpServerId}`
        );
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith('Invalid or missing session ID');
      });
    });

    describe('when session ID header contains array value', () => {
      beforeEach(() => {
        mockRequest.headers = { 'mcp-session-id': ['session1', 'session2'] as any };
        mockTransportManager.getTransport.mockReturnValue(undefined);
      });

      it('should handle array header and attempt transport lookup', async () => {
        // Act
        const handler = handleDefault(mcpServerId);
        await handler(mockRequest as express.Request, mockResponse as express.Response);

        // Assert
        expect(mockTransportManager.getTransport).toHaveBeenCalledWith(mcpServerId, ['session1', 'session2']);
        expect(consoleSpy).toHaveBeenCalledWith(
          `Invalid or missing session ID: session1,session2 for server: ${mcpServerId}`
        );
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith('Invalid or missing session ID');
      });
    });
  });
});