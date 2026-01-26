import { jest } from '@jest/globals';

// Mock dependencies
jest.mock('../../../src/server/server.js');
jest.mock('../../../src/server/stdio_server/transport.js');

import start from '../../../src/server/stdio_server/server.js';
import { configure, initializeMcpServer } from '../../../src/server/server.js';
import { createTransport } from '../../../src/server/stdio_server/transport.js';

describe('server/stdio_server/server', () => {
  let mockTransport: any;
  let mockConfigureCb: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTransport = { id: 'mock-transport' };
    mockConfigureCb = jest.fn();

    (createTransport as jest.Mock).mockReturnValue(mockTransport);
    (configure as jest.Mock).mockReturnValue(mockConfigureCb);
    // @ts-expect-error - mocking async function
    (initializeMcpServer as jest.Mock).mockResolvedValue(undefined);
  });

  describe('start', () => {
    it('should create transport and initialize server with single config', async () => {
      // Arrange
      const config = [
        {
          name: 'server1',
          path: '/path1',
          features: [{ id: 'feature1' }],
          skills: ['skill1']
        }
      ];

      // Act
      await start(config as any);

      // Assert
      expect(createTransport).toHaveBeenCalledTimes(1);
      expect(configure).toHaveBeenCalledTimes(1);
      expect(configure).toHaveBeenCalledWith({
        name: 'server1',
        path: '/stdio',
        features: [{ id: 'feature1' }],
        skills: ['skill1']
      });
      expect(initializeMcpServer).toHaveBeenCalledWith('server1', mockTransport, mockConfigureCb);
    });

    it('should merge multiple configs correctly', async () => {
      // Arrange
      const config = [
        {
          name: 'server1',
          path: '/path1',
          features: [{ id: 'feature1' }],
          skills: ['skill1']
        },
        {
          name: 'server2',
          path: '/path2',
          features: [{ id: 'feature2' }, { id: 'feature3' }],
          skills: ['skill2', 'skill3']
        }
      ];

      // Act
      await start(config as any);

      // Assert
      expect(configure).toHaveBeenCalledWith({
        name: 'server1,server2',
        path: '/stdio',
        features: [{ id: 'feature1' }, { id: 'feature2' }, { id: 'feature3' }],
        skills: ['skill1', 'skill2', 'skill3']
      });
      expect(initializeMcpServer).toHaveBeenCalledWith('server1,server2', mockTransport, mockConfigureCb);
    });

    it('should handle empty features correctly', async () => {
      // Arrange
      const config = [
        {
          name: 'server1',
          path: '/path1',
          features: []
        }
      ];

      // Act
      await start(config as any);

      // Assert
      expect(configure).toHaveBeenCalledWith({
        name: 'server1',
        path: '/stdio',
        features: [],
        skills: []
      });
    });

    it('should handle missing skills property correctly', async () => {
      // Arrange
      const config = [
        {
          name: 'server1',
          path: '/path1',
          features: [{ id: 'feature1' }]
        },
        {
          name: 'server2',
          path: '/path2',
          features: [{ id: 'feature2' }],
          skills: ['skill1']
        }
      ];

      // Act
      await start(config as any);

      // Assert
      expect(configure).toHaveBeenCalledWith({
        name: 'server1,server2',
        path: '/stdio',
        features: [{ id: 'feature1' }, { id: 'feature2' }],
        skills: ['skill1']
      });
    });

    it('should always use /stdio as path regardless of input', async () => {
      // Arrange
      const config = [
        {
          name: 'server1',
          path: '/custom-path',
          features: []
        }
      ];

      // Act
      await start(config as any);

      // Assert
      const configureCall: any = (configure as jest.Mock).mock.calls[0][0];
      expect(configureCall.path).toBe('/stdio');
    });
  });
});
