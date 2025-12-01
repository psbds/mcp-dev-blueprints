import { jest } from '@jest/globals';
import { createTransport, getTransport } from '../../../src/server/http_server/transport.js';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

// Mock dependencies
jest.mock("@modelcontextprotocol/sdk/server/streamableHttp.js");
jest.mock("node:crypto", () => ({
    randomUUID: jest.fn().mockReturnValue('mock-uuid')
}));

describe('server/http_server/transport', () => {
    let mockTransportInstance: any;
    let consoleSpy: any;

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Setup mock transport instance
        mockTransportInstance = {
            sessionId: 'mock-session-id',
            onclose: undefined
        };
        
        (StreamableHTTPServerTransport as unknown as jest.Mock).mockImplementation(() => mockTransportInstance);

        // Spy on console.log
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    describe('createTransport', () => {
        it('should create a new StreamableHTTPServerTransport', () => {
            // Act
            const transport = createTransport('server1');

            // Assert
            expect(StreamableHTTPServerTransport).toHaveBeenCalledTimes(1);
            expect(transport).toBe(mockTransportInstance);
        });

        it('should configure sessionIdGenerator', () => {
            // Act
            createTransport('server1');

            // Assert
            const constructorCalls = (StreamableHTTPServerTransport as unknown as jest.Mock).mock.calls;
            const config = constructorCalls[0][0] as any;
            
            expect(config.sessionIdGenerator).toBeDefined();
            expect(config.sessionIdGenerator()).toBe('mock-uuid');
        });

        it('should handle session initialization correctly', () => {
            // Arrange
            const serverId = 'server-init-test';
            const sessionId = 'session-123';
            createTransport(serverId);
            
            const constructorCalls = (StreamableHTTPServerTransport as unknown as jest.Mock).mock.calls;
            const config = constructorCalls[0][0] as any;
            
            // Act
            // Simulate session initialization callback
            config.onsessioninitialized(sessionId);

            // Assert
            expect(consoleSpy).toHaveBeenCalledWith(`Initialized new session: ${sessionId} for server: ${serverId}`);
            
            // Verify transport is stored and retrievable
            const storedTransport = getTransport(serverId, sessionId);
            expect(storedTransport).toBe(mockTransportInstance);
        });

        it('should handle transport close correctly', () => {
            // Arrange
            const serverId = 'server-close-test';
            const sessionId = 'session-to-close';
            
            // Create and initialize transport
            createTransport(serverId);
            const constructorCalls = (StreamableHTTPServerTransport as unknown as jest.Mock).mock.calls;
            const config = constructorCalls[0][0] as any;
            config.onsessioninitialized(sessionId);
            
            // Verify it exists
            expect(getTransport(serverId, sessionId)).toBeDefined();
            
            // Set the sessionId on the mock instance as it would be in reality
            mockTransportInstance.sessionId = sessionId;

            // Act
            // Trigger onclose
            if (mockTransportInstance.onclose) {
                mockTransportInstance.onclose();
            }

            // Assert
            expect(getTransport(serverId, sessionId)).toBeUndefined();
        });
    });

    describe('getTransport', () => {
        it('should return undefined for non-existent server', () => {
            // Act & Assert
            expect(getTransport('non-existent-server', 'any-session')).toBeUndefined();
        });

        it('should return undefined for non-existent session', () => {
            // Arrange
            createTransport('server-exists'); // Ensure server map exists

            // Act & Assert
            expect(getTransport('server-exists', 'non-existent-session')).toBeUndefined();
        });

        it('should return correct transport for existing session', () => {
            // Arrange
            const serverId = 'server-get-test';
            const sessionId = 'session-get-test';
            
            createTransport(serverId);
            const constructorCalls = (StreamableHTTPServerTransport as unknown as jest.Mock).mock.calls;
            const config = constructorCalls[0][0] as any;
            config.onsessioninitialized(sessionId);

            // Act
            const result = getTransport(serverId, sessionId);

            // Assert
            expect(result).toBe(mockTransportInstance);
        });
    });
});
