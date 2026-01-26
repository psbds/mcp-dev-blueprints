import { jest } from '@jest/globals';
import { resolveGlobPatterns } from '../../src/utils/glob-resolver.js';
import * as glob from 'glob';

// Mock glob
jest.mock('glob');

describe('utils/glob-resolver', () => {
  const mockBasePath = '/test/kb';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('resolveGlobPatterns', () => {
    it('should return simple file paths as-is', () => {
      // Arrange
      const patterns = ['file1.md', 'file2.md'];

      // Act
      const result = resolveGlobPatterns(mockBasePath, patterns);

      // Assert
      expect(result).toEqual(['file1.md', 'file2.md']);
      expect(glob.globSync).not.toHaveBeenCalled();
    });

    it('should resolve glob patterns with *', () => {
      // Arrange
      const patterns = ['skills/*.md'];
      (glob.globSync as jest.Mock).mockReturnValue(['skills/file1.md', 'skills/file2.md']);

      // Act
      const result = resolveGlobPatterns(mockBasePath, patterns);

      // Assert
      expect(glob.globSync).toHaveBeenCalledWith('skills/*.md', {
        cwd: mockBasePath,
        nodir: true,
        absolute: false
      });
      expect(result).toEqual(['skills/file1.md', 'skills/file2.md']);
    });

    it('should resolve glob patterns with **', () => {
      // Arrange
      const patterns = ['skills/**/*.md'];
      (glob.globSync as jest.Mock).mockReturnValue([
        'skills/file1.md',
        'skills/docs/file2.md',
        'skills/docs/nested/file3.md'
      ]);

      // Act
      const result = resolveGlobPatterns(mockBasePath, patterns);

      // Assert
      expect(glob.globSync).toHaveBeenCalledWith('skills/**/*.md', {
        cwd: mockBasePath,
        nodir: true,
        absolute: false
      });
      expect(result).toEqual([
        'skills/file1.md',
        'skills/docs/file2.md',
        'skills/docs/nested/file3.md'
      ]);
    });

    it('should handle mixed patterns and simple paths', () => {
      // Arrange
      const patterns = ['simple.md', 'skills/*.md'];
      (glob.globSync as jest.Mock).mockReturnValue(['skills/file1.md', 'skills/file2.md']);

      // Act
      const result = resolveGlobPatterns(mockBasePath, patterns);

      // Assert
      expect(result).toEqual(['simple.md', 'skills/file1.md', 'skills/file2.md']);
    });

    it('should handle empty patterns array', () => {
      // Arrange
      const patterns: string[] = [];

      // Act
      const result = resolveGlobPatterns(mockBasePath, patterns);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle glob patterns with ?', () => {
      // Arrange
      const patterns = ['file?.md'];
      (glob.globSync as jest.Mock).mockReturnValue(['file1.md', 'file2.md']);

      // Act
      const result = resolveGlobPatterns(mockBasePath, patterns);

      // Assert
      expect(glob.globSync).toHaveBeenCalledWith('file?.md', {
        cwd: mockBasePath,
        nodir: true,
        absolute: false
      });
      expect(result).toEqual(['file1.md', 'file2.md']);
    });

    it('should handle glob patterns with brackets', () => {
      // Arrange
      const patterns = ['file[12].md'];
      (glob.globSync as jest.Mock).mockReturnValue(['file1.md', 'file2.md']);

      // Act
      const result = resolveGlobPatterns(mockBasePath, patterns);

      // Assert
      expect(glob.globSync).toHaveBeenCalledWith('file[12].md', {
        cwd: mockBasePath,
        nodir: true,
        absolute: false
      });
      expect(result).toEqual(['file1.md', 'file2.md']);
    });

    it('should handle glob patterns with braces', () => {
      // Arrange
      const patterns = ['file.{md,txt}'];
      (glob.globSync as jest.Mock).mockReturnValue(['file.md', 'file.txt']);

      // Act
      const result = resolveGlobPatterns(mockBasePath, patterns);

      // Assert
      expect(glob.globSync).toHaveBeenCalledWith('file.{md,txt}', {
        cwd: mockBasePath,
        nodir: true,
        absolute: false
      });
      expect(result).toEqual(['file.md', 'file.txt']);
    });
  });
});
