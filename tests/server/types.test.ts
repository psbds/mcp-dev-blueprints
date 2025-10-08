import { ServerConfig, ServerConfigs } from '../../src/server/types.js';

describe('Server Types', () => {
  describe('ServerConfig interface', () => {
    it('should allow creation of valid ServerConfig objects', () => {
      // Arrange & Act
      const serverConfig: ServerConfig = {
        name: 'Test Server',
        path: '/api/test',
        features: ['feature1.json', 'feature2.json']
      };

      // Assert
      expect(serverConfig.name).toBe('Test Server');
      expect(serverConfig.path).toBe('/api/test');
      expect(serverConfig.features).toEqual(['feature1.json', 'feature2.json']);
      expect(Array.isArray(serverConfig.features)).toBe(true);
    });

    it('should handle empty features array', () => {
      // Arrange & Act
      const serverConfig: ServerConfig = {
        name: 'Empty Server',
        path: '/api/empty',
        features: []
      };

      // Assert
      expect(serverConfig.features).toEqual([]);
      expect(serverConfig.features.length).toBe(0);
    });

    it('should handle multiple features', () => {
      // Arrange & Act
      const serverConfig: ServerConfig = {
        name: 'Multi Feature Server',
        path: '/api/multi',
        features: [
          'auth/authentication.json',
          'users/user-management.json',
          'data/data-processing.json',
          'reporting/analytics.json'
        ]
      };

      // Assert
      expect(serverConfig.features.length).toBe(4);
      expect(serverConfig.features).toContain('auth/authentication.json');
      expect(serverConfig.features).toContain('users/user-management.json');
      expect(serverConfig.features).toContain('data/data-processing.json');
      expect(serverConfig.features).toContain('reporting/analytics.json');
    });

    it('should be serializable to JSON', () => {
      // Arrange
      const serverConfig: ServerConfig = {
        name: 'JSON Server',
        path: '/api/json',
        features: ['json-feature.json', 'another-feature.json']
      };

      // Act
      const serialized = JSON.stringify(serverConfig);
      const deserialized = JSON.parse(serialized);

      // Assert
      expect(deserialized).toEqual(serverConfig);
      expect(deserialized.name).toBe('JSON Server');
      expect(deserialized.path).toBe('/api/json');
      expect(deserialized.features).toEqual(['json-feature.json', 'another-feature.json']);
    });

    it('should support property access and modification', () => {
      // Arrange
      const serverConfig: ServerConfig = {
        name: 'Mutable Server',
        path: '/api/mutable',
        features: ['initial-feature.json']
      };

      // Act
      serverConfig.name = 'Updated Server';
      serverConfig.path = '/api/updated';
      serverConfig.features.push('new-feature.json');

      // Assert
      expect(serverConfig.name).toBe('Updated Server');
      expect(serverConfig.path).toBe('/api/updated');
      expect(serverConfig.features).toEqual(['initial-feature.json', 'new-feature.json']);
    });

  });

  describe('ServerConfigs type alias', () => {
    it('should allow creation of empty server configs array', () => {
      // Arrange & Act
      const serverConfigs: ServerConfigs = [];

      // Assert
      expect(Array.isArray(serverConfigs)).toBe(true);
      expect(serverConfigs.length).toBe(0);
    });

    it('should allow creation of multiple server configs array', () => {
      // Arrange & Act
      const serverConfigs: ServerConfigs = [
        {
          name: 'Server 1',
          path: '/api/server1',
          features: ['server1-feature.json']
        },
        {
          name: 'Server 2',
          path: '/api/server2',
          features: ['server2-feature1.json', 'server2-feature2.json']
        },
        {
          name: 'Server 3',
          path: '/api/server3',
          features: []
        }
      ];

      // Assert
      expect(serverConfigs.length).toBe(3);
      expect(serverConfigs[0].name).toBe('Server 1');
      expect(serverConfigs[1].name).toBe('Server 2');
      expect(serverConfigs[2].name).toBe('Server 3');
      expect(serverConfigs[1].features.length).toBe(2);
      expect(serverConfigs[2].features.length).toBe(0);
    });

    it('should be serializable to JSON', () => {
      // Arrange
      const serverConfigs: ServerConfigs = [
        {
          name: 'JSON Server 1',
          path: '/api/json1',
          features: ['json1-feature.json']
        },
        {
          name: 'JSON Server 2',
          path: '/api/json2',
          features: ['json2-feature1.json', 'json2-feature2.json']
        }
      ];

      // Act
      const serialized = JSON.stringify(serverConfigs);
      const deserialized = JSON.parse(serialized);

      // Assert
      expect(Array.isArray(deserialized)).toBe(true);
      expect(deserialized.length).toBe(2);
      expect(deserialized[0]).toEqual(serverConfigs[0]);
      expect(deserialized[1]).toEqual(serverConfigs[1]);
    });
  });
});