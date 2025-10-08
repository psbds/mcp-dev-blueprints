import { jest } from '@jest/globals';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Mock Node.js fs module
jest.mock('node:fs', () => ({
  readFileSync: jest.fn(),
  statSync: jest.fn(),
}));

// Mock Node.js path module
jest.mock('node:path', () => ({
  join: jest.fn(),
}));

// Get mocked functions with proper typing
const mockReadFileSync = readFileSync as jest.MockedFunction<typeof readFileSync>;
const mockStatSync = statSync as jest.MockedFunction<typeof statSync>;
const mockJoin = join as jest.MockedFunction<typeof join>;

// Import the module after mocks are set up
import {
  readFileWithCache,
  readFileWithCacheFromBase,
  readJsonWithCache,
  readJsonWithCacheFromBase,
  clearFileCache,
  invalidateFileCache,
  getFileCacheStats,
  createFileCache,
} from '../../src/utils/file-utils.js';

describe('file-utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearFileCache(); // Clear cache between tests
    
    // Setup default mock implementations
    mockJoin.mockImplementation((...args) => args.join('/'));
  });

  describe('readFileWithCache', () => {
    const testFilePath = '/test/file.txt';
    const testContent = 'test file content';
    const mockStats = {
      mtimeMs: 1234567890,
      size: 100,
    };

    beforeEach(() => {
      mockStatSync.mockReturnValue(mockStats as any);
      mockReadFileSync.mockReturnValue(testContent);
    });

    it('should read file from disk on first access', () => {
      // Act
      const result = readFileWithCache(testFilePath);

      // Assert
      expect(mockStatSync).toHaveBeenCalledWith(testFilePath);
      expect(mockReadFileSync).toHaveBeenCalledWith(testFilePath, 'utf-8');
      expect(result).toBe(testContent);
    });

    it('should return cached content on subsequent access with same file stats', () => {
      // Arrange - First call to populate cache
      readFileWithCache(testFilePath);
      jest.clearAllMocks();
      mockStatSync.mockReturnValue(mockStats as any);

      // Act
      const result = readFileWithCache(testFilePath);

      // Assert
      expect(mockStatSync).toHaveBeenCalledWith(testFilePath);
      expect(mockReadFileSync).not.toHaveBeenCalled();
      expect(result).toBe(testContent);
    });

    it('should re-read file when modification time changes', () => {
      // Arrange - First call to populate cache
      readFileWithCache(testFilePath);
      jest.clearAllMocks();
      
      const newContent = 'updated content';
      const updatedStats = { ...mockStats, mtimeMs: mockStats.mtimeMs + 1000 };
      mockStatSync.mockReturnValue(updatedStats as any);
      mockReadFileSync.mockReturnValue(newContent);

      // Act
      const result = readFileWithCache(testFilePath);

      // Assert
      expect(mockStatSync).toHaveBeenCalledWith(testFilePath);
      expect(mockReadFileSync).toHaveBeenCalledWith(testFilePath, 'utf-8');
      expect(result).toBe(newContent);
    });

    it('should re-read file when file size changes', () => {
      // Arrange - First call to populate cache
      readFileWithCache(testFilePath);
      jest.clearAllMocks();
      
      const newContent = 'updated content with different size';
      const updatedStats = { ...mockStats, size: mockStats.size + 50 };
      mockStatSync.mockReturnValue(updatedStats as any);
      mockReadFileSync.mockReturnValue(newContent);

      // Act
      const result = readFileWithCache(testFilePath);

      // Assert
      expect(mockStatSync).toHaveBeenCalledWith(testFilePath);
      expect(mockReadFileSync).toHaveBeenCalledWith(testFilePath, 'utf-8');
      expect(result).toBe(newContent);
    });

    it('should handle case-insensitive path normalization', () => {
      // Arrange
      const upperCasePath = '/TEST/FILE.TXT';
      const lowerCasePath = '/test/file.txt';
      
      mockStatSync.mockReturnValue(mockStats as any);
      mockReadFileSync.mockReturnValue(testContent);

      // Act - Read with uppercase path first
      readFileWithCache(upperCasePath);
      jest.clearAllMocks();
      mockStatSync.mockReturnValue(mockStats as any);
      
      // Try to read with lowercase path
      const result = readFileWithCache(lowerCasePath);

      // Assert - Should use cached content (paths are normalized)
      expect(mockReadFileSync).not.toHaveBeenCalled();
      expect(result).toBe(testContent);
    });

    it('should normalize backslashes to forward slashes in paths', () => {
      // Arrange
      const windowsPath = 'C:\\test\\file.txt';
      const unixPath = 'C:/test/file.txt';
      
      mockStatSync.mockReturnValue(mockStats as any);
      mockReadFileSync.mockReturnValue(testContent);

      // Act - Read with Windows-style path first
      readFileWithCache(windowsPath);
      jest.clearAllMocks();
      mockStatSync.mockReturnValue(mockStats as any);
      
      // Try to read with Unix-style path
      const result = readFileWithCache(unixPath);

      // Assert - Should use cached content (paths are normalized)
      expect(mockReadFileSync).not.toHaveBeenCalled();
      expect(result).toBe(testContent);
    });

    it('should throw error when file reading fails', () => {
      // Arrange
      const error = new Error('File not found');
      mockStatSync.mockImplementation(() => { throw error; });

      // Act & Assert
      expect(() => readFileWithCache(testFilePath)).toThrow(
        `Failed to read file ${testFilePath}: Error: File not found`
      );
    });

    it('should throw error when stat operation fails', () => {
      // Arrange
      const error = new Error('Permission denied');
      mockStatSync.mockImplementation(() => { throw error; });

      // Act & Assert
      expect(() => readFileWithCache(testFilePath)).toThrow(
        `Failed to read file ${testFilePath}: Error: Permission denied`
      );
    });
  });

  describe('readFileWithCacheFromBase', () => {
    const basePath = '/base';
    const relativePath = 'sub/file.txt';
    const expectedFullPath = '/base/sub/file.txt';
    const testContent = 'file content';

    beforeEach(() => {
      mockJoin.mockReturnValue(expectedFullPath);
      mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 100 } as any);
      mockReadFileSync.mockReturnValue(testContent);
    });

    it('should join base path and relative path correctly', () => {
      // Act
      const result = readFileWithCacheFromBase(basePath, relativePath);

      // Assert
      expect(mockJoin).toHaveBeenCalledWith(basePath, relativePath);
      expect(mockStatSync).toHaveBeenCalledWith(expectedFullPath);
      expect(result).toBe(testContent);
    });

    it('should handle empty relative path', () => {
      // Arrange
      const emptyRelativePath = '';
      mockJoin.mockReturnValue(basePath);

      // Act
      const result = readFileWithCacheFromBase(basePath, emptyRelativePath);

      // Assert
      expect(mockJoin).toHaveBeenCalledWith(basePath, emptyRelativePath);
      expect(mockStatSync).toHaveBeenCalledWith(basePath);
    });

    it('should handle nested relative paths', () => {
      // Arrange
      const nestedPath = 'deep/nested/path/file.txt';
      const fullNestedPath = '/base/deep/nested/path/file.txt';
      mockJoin.mockReturnValue(fullNestedPath);

      // Act
      readFileWithCacheFromBase(basePath, nestedPath);

      // Assert
      expect(mockJoin).toHaveBeenCalledWith(basePath, nestedPath);
      expect(mockStatSync).toHaveBeenCalledWith(fullNestedPath);
    });
  });

  describe('readJsonWithCache', () => {
    const testFilePath = '/test/config.json';
    const testObject = { key: 'value', number: 42, nested: { prop: true } };
    const testJsonString = JSON.stringify(testObject);

    beforeEach(() => {
      mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 100 } as any);
      mockReadFileSync.mockReturnValue(testJsonString);
    });

    it('should parse JSON content correctly', () => {
      // Act
      const result = readJsonWithCache(testFilePath);

      // Assert
      expect(result).toEqual(testObject);
      expect(mockReadFileSync).toHaveBeenCalledWith(testFilePath, 'utf-8');
    });

    it('should work with generic type parameter', () => {
      // Arrange
      interface TestInterface {
        id: number;
        name: string;
      }
      const typedObject: TestInterface = { id: 1, name: 'test' };
      const typedJsonString = JSON.stringify(typedObject);
      mockReadFileSync.mockReturnValue(typedJsonString);

      // Act
      const result = readJsonWithCache<TestInterface>(testFilePath);

      // Assert
      expect(result).toEqual(typedObject);
      expect(result.id).toBe(1);
      expect(result.name).toBe('test');
    });

    it('should handle empty JSON object', () => {
      // Arrange
      mockReadFileSync.mockReturnValue('{}');

      // Act
      const result = readJsonWithCache(testFilePath);

      // Assert
      expect(result).toEqual({});
    });

    it('should handle JSON array', () => {
      // Arrange
      const testArray = [1, 2, 3, { key: 'value' }];
      mockReadFileSync.mockReturnValue(JSON.stringify(testArray));

      // Act
      const result = readJsonWithCache(testFilePath);

      // Assert
      expect(result).toEqual(testArray);
    });

    it('should throw error for invalid JSON', () => {
      // Arrange
      const invalidJson = '{ invalid json content';
      mockReadFileSync.mockReturnValue(invalidJson);

      // Act & Assert
      expect(() => readJsonWithCache(testFilePath)).toThrow(
        `Failed to parse JSON from ${testFilePath}:`
      );
    });

    it('should cache parsed JSON content', () => {
      // Arrange - First call to populate cache
      readJsonWithCache(testFilePath);
      jest.clearAllMocks();
      mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 100 } as any);

      // Act
      const result = readJsonWithCache(testFilePath);

      // Assert
      expect(mockReadFileSync).not.toHaveBeenCalled();
      expect(result).toEqual(testObject);
    });
  });

  describe('readJsonWithCacheFromBase', () => {
    const basePath = '/config';
    const relativePath = 'settings.json';
    const expectedFullPath = '/config/settings.json';
    const testObject = { setting1: 'value1', setting2: 42 };

    beforeEach(() => {
      mockJoin.mockReturnValue(expectedFullPath);
      mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 100 } as any);
      mockReadFileSync.mockReturnValue(JSON.stringify(testObject));
    });

    it('should combine base and relative paths for JSON reading', () => {
      // Act
      const result = readJsonWithCacheFromBase(basePath, relativePath);

      // Assert
      expect(mockJoin).toHaveBeenCalledWith(basePath, relativePath);
      expect(mockStatSync).toHaveBeenCalledWith(expectedFullPath);
      expect(result).toEqual(testObject);
    });

    it('should work with generic type parameter', () => {
      // Arrange
      interface ConfigType {
        apiKey: string;
        timeout: number;
      }
      const config: ConfigType = { apiKey: 'secret', timeout: 5000 };
      mockReadFileSync.mockReturnValue(JSON.stringify(config));

      // Act
      const result = readJsonWithCacheFromBase<ConfigType>(basePath, relativePath);

      // Assert
      expect(result).toEqual(config);
      expect(result.apiKey).toBe('secret');
      expect(result.timeout).toBe(5000);
    });
  });

  describe('cache management functions', () => {
    const testFilePath = '/test/file.txt';
    const testContent = 'cached content';

    beforeEach(() => {
      mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 100 } as any);
      mockReadFileSync.mockReturnValue(testContent);
    });

    describe('clearFileCache', () => {
      it('should clear all cached files', () => {
        // Arrange - Populate cache with multiple files
        readFileWithCache('/file1.txt');
        readFileWithCache('/file2.txt');
        let stats = getFileCacheStats();
        expect(stats.size).toBe(2);

        // Act
        clearFileCache();

        // Assert
        stats = getFileCacheStats();
        expect(stats.size).toBe(0);
        expect(stats.entries).toEqual([]);
      });

      it('should force re-read of files after cache clear', () => {
        // Arrange - Read file to cache it
        readFileWithCache(testFilePath);
        clearFileCache();
        jest.clearAllMocks();
        mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 100 } as any);
        mockReadFileSync.mockReturnValue('new content');

        // Act
        const result = readFileWithCache(testFilePath);

        // Assert
        expect(mockReadFileSync).toHaveBeenCalledWith(testFilePath, 'utf-8');
        expect(result).toBe('new content');
      });
    });

    describe('invalidateFileCache', () => {
      it('should remove specific file from cache', () => {
        // Arrange - Cache multiple files
        readFileWithCache('/file1.txt');
        readFileWithCache('/file2.txt');
        
        // Act
        invalidateFileCache('/file1.txt');

        // Assert
        const stats = getFileCacheStats();
        expect(stats.size).toBe(1);
        expect(stats.entries).toEqual(['/file2.txt']);
      });

      it('should handle case-insensitive path invalidation', () => {
        // Arrange - Cache with lowercase path
        readFileWithCache('/test/file.txt');
        
        // Act - Invalidate with uppercase path
        invalidateFileCache('/TEST/FILE.TXT');

        // Assert
        const stats = getFileCacheStats();
        expect(stats.size).toBe(0);
      });

      it('should normalize backslashes when invalidating', () => {
        // Arrange - Cache with Unix-style path
        readFileWithCache('C:/test/file.txt');
        
        // Act - Invalidate with Windows-style path
        invalidateFileCache('C:\\test\\file.txt');

        // Assert
        const stats = getFileCacheStats();
        expect(stats.size).toBe(0);
      });

      it('should force re-read of invalidated file', () => {
        // Arrange - Read file to cache it
        readFileWithCache(testFilePath);
        invalidateFileCache(testFilePath);
        jest.clearAllMocks();
        mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 100 } as any);
        mockReadFileSync.mockReturnValue('fresh content');

        // Act
        const result = readFileWithCache(testFilePath);

        // Assert
        expect(mockReadFileSync).toHaveBeenCalledWith(testFilePath, 'utf-8');
        expect(result).toBe('fresh content');
      });

      it('should handle invalidation of non-existent file gracefully', () => {
        // Arrange - Cache one file
        readFileWithCache('/existing.txt');

        // Act - Try to invalidate non-existent file
        invalidateFileCache('/non-existent.txt');

        // Assert
        const stats = getFileCacheStats();
        expect(stats.size).toBe(1);
        expect(stats.entries).toEqual(['/existing.txt']);
      });
    });

    describe('getFileCacheStats', () => {
      it('should return correct stats for empty cache', () => {
        // Act
        const stats = getFileCacheStats();

        // Assert
        expect(stats).toEqual({
          size: 0,
          maxSize: 100,
          entries: []
        });
      });

      it('should return correct stats with cached files', () => {
        // Arrange
        readFileWithCache('/file1.txt');
        readFileWithCache('/file2.txt');
        readFileWithCache('/file3.txt');

        // Act
        const stats = getFileCacheStats();

        // Assert
        expect(stats.size).toBe(3);
        expect(stats.maxSize).toBe(100);
        expect(stats.entries).toHaveLength(3);
        expect(stats.entries).toContain('/file1.txt');
        expect(stats.entries).toContain('/file2.txt');
        expect(stats.entries).toContain('/file3.txt');
      });

      it('should show normalized paths in entries', () => {
        // Arrange - Use paths with different cases and separators
        readFileWithCache('C:\\Test\\FILE.txt');
        readFileWithCache('/ANOTHER/file.TXT');

        // Act
        const stats = getFileCacheStats();

        // Assert
        expect(stats.entries).toEqual(['c:/test/file.txt', '/another/file.txt']);
      });
    });
  });

  describe('createFileCache', () => {
    it('should create new FileCache instance with default max size', () => {
      // Act
      const cache = createFileCache();

      // Assert
      expect(cache).toBeDefined();
      // Test that it works by calling a method
      const stats = cache.getStats();
      expect(stats.maxSize).toBe(100);
      expect(stats.size).toBe(0);
    });

    it('should create new FileCache instance with custom max size', () => {
      // Act
      const cache = createFileCache(50);

      // Assert
      expect(cache).toBeDefined();
      const stats = cache.getStats();
      expect(stats.maxSize).toBe(50);
      expect(stats.size).toBe(0);
    });

    it('should create independent cache instances', () => {
      // Arrange
      mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 100 } as any);
      mockReadFileSync.mockReturnValue('content');

      // Act
      const cache1 = createFileCache(10);
      const cache2 = createFileCache(20);

      // Add content to first cache
      cache1.get('/test1.txt');
      
      // Assert
      const stats1 = cache1.getStats();
      const stats2 = cache2.getStats();
      
      expect(stats1.size).toBe(1);
      expect(stats1.maxSize).toBe(10);
      expect(stats2.size).toBe(0);
      expect(stats2.maxSize).toBe(20);
    });
  });

  describe('FileCache LRU behavior', () => {
    it('should evict oldest entry when cache is full', () => {
      // Arrange - Create cache with small max size
      const cache = createFileCache(2);
      mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 100 } as any);
      mockReadFileSync.mockReturnValue('content');

      // Act - Add files to fill cache and exceed limit
      cache.get('/file1.txt');
      cache.get('/file2.txt');
      cache.get('/file3.txt'); // This should evict /file1.txt

      // Assert
      const stats = cache.getStats();
      expect(stats.size).toBe(2);
      expect(stats.entries).not.toContain('/file1.txt');
      expect(stats.entries).toContain('/file2.txt');
      expect(stats.entries).toContain('/file3.txt');
    });

    it('should maintain cache size at or below max size', () => {
      // Arrange
      const maxSize = 3;
      const cache = createFileCache(maxSize);
      mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 100 } as any);
      mockReadFileSync.mockReturnValue('content');

      // Act - Add more files than max size
      for (let i = 1; i <= 10; i++) {
        cache.get(`/file${i}.txt`);
      }

      // Assert
      const stats = cache.getStats();
      expect(stats.size).toBeLessThanOrEqual(maxSize);
      expect(stats.size).toBe(maxSize);
    });
  });

  describe('error handling edge cases', () => {
    it('should handle readFileSync throwing non-Error objects', () => {
      // Arrange
      mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 100 } as any);
      mockReadFileSync.mockImplementation(() => {
        throw 'string error';
      });

      // Act & Assert
      expect(() => readFileWithCache('/test.txt')).toThrow(
        'Failed to read file /test.txt: string error'
      );
    });

    it('should handle JSON.parse throwing SyntaxError', () => {
      // Arrange
      mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 100 } as any);
      mockReadFileSync.mockReturnValue('{ invalid json }');

      // Act & Assert
      expect(() => readJsonWithCache('/test.json')).toThrow(
        /Failed to parse JSON from \/test\.json:/
      );
    });

    it('should handle extremely large file stats', () => {
      // Arrange
      const largeStats = {
        mtimeMs: Number.MAX_SAFE_INTEGER,
        size: Number.MAX_SAFE_INTEGER,
      };
      mockStatSync.mockReturnValue(largeStats as any);
      mockReadFileSync.mockReturnValue('content');

      // Act & Assert - Should not throw
      expect(() => readFileWithCache('/large-file.txt')).not.toThrow();
    });

    it('should handle files with zero size', () => {
      // Arrange
      mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 0 } as any);
      mockReadFileSync.mockReturnValue('');

      // Act
      const result = readFileWithCache('/empty-file.txt');

      // Assert
      expect(result).toBe('');
    });
  });

  describe('path normalization edge cases', () => {
    it('should handle mixed separators in single path', () => {
      // Arrange
      const mixedPath = 'C:\\some/path\\with/mixed\\separators.txt';
      mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 100 } as any);
      mockReadFileSync.mockReturnValue('content');

      // Act - Should not throw
      const result = readFileWithCache(mixedPath);

      // Assert
      expect(result).toBe('content');
    });

    it('should handle paths with trailing slashes', () => {
      // Arrange
      const pathWithSlash = '/test/path/';
      mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 100 } as any);
      mockReadFileSync.mockReturnValue('content');

      // Act
      readFileWithCache(pathWithSlash);
      const stats = getFileCacheStats();

      // Assert
      expect(stats.entries).toContain('/test/path/');
    });

    it('should handle relative paths', () => {
      // Arrange
      const relativePath = '../parent/file.txt';
      mockStatSync.mockReturnValue({ mtimeMs: 1234567890, size: 100 } as any);
      mockReadFileSync.mockReturnValue('content');

      // Act
      const result = readFileWithCache(relativePath);

      // Assert
      expect(result).toBe('content');
      expect(mockStatSync).toHaveBeenCalledWith(relativePath);
    });
  });
});