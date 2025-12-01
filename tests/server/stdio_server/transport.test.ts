import { jest } from '@jest/globals';
import { createTransport } from '../../../src/server/stdio_server/transport.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Mock dependencies
jest.mock('@modelcontextprotocol/sdk/server/stdio.js');

describe('server/stdio_server/transport', () => {
  let mockTransportInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock transport instance
    mockTransportInstance = {
      id: 'mock-stdio-transport'
    };
    
    (StdioServerTransport as unknown as jest.Mock).mockImplementation(() => mockTransportInstance);
  });

  describe('createTransport', () => {
    it('should create a new StdioServerTransport', () => {
      // Act
      const transport = createTransport();

      // Assert
      expect(StdioServerTransport).toHaveBeenCalledTimes(1);
      expect(transport).toBe(mockTransportInstance);
    });

    it('should create transport without any configuration', () => {
      // Act
      createTransport();

      // Assert
      const constructorCalls = (StdioServerTransport as unknown as jest.Mock).mock.calls;
      expect(constructorCalls[0]).toEqual([]);
    });

    it('should return the same type of transport on multiple calls', () => {
      // Act
      const transport1 = createTransport();
      const transport2 = createTransport();

      // Assert
      expect(StdioServerTransport).toHaveBeenCalledTimes(2);
      expect(typeof transport1).toBe(typeof transport2);
    });
  });
});
