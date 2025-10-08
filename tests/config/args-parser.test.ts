import { jest } from '@jest/globals';
import { resolve } from 'path';
import * as fs from 'fs';
import * as configManager from '../../src/config/config-manager.js';

// Create mock instances
const mockYargsInstance = {
  option: jest.fn().mockReturnThis(),
  check: jest.fn().mockReturnThis(),
  help: jest.fn().mockReturnThis(),
  alias: jest.fn().mockReturnThis(),
  usage: jest.fn().mockReturnThis(),
  example: jest.fn().mockReturnThis(),
  parseSync: jest.fn(),
};

const mockYargs = jest.fn().mockReturnValue(mockYargsInstance);
const mockHideBin = jest.fn().mockReturnValue([]);

// Mock the dependencies
jest.mock('fs');
jest.mock('path');
jest.mock('yargs', () => mockYargs);
jest.mock('yargs/helpers', () => ({
  hideBin: mockHideBin,
}));
jest.mock('../../src/config/config-manager.js');

// Import the function under test after mocks are set up
import loadConfig from '../../src/config/args-parser.js';

const mockFs = fs as jest.Mocked<typeof fs>;
const mockConfigManager = configManager as jest.Mocked<typeof configManager>;
const mockResolve = resolve as jest.MockedFunction<typeof resolve>;

describe('args-parser', () => {
  let mockProcessArgv: string[];

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Store original process.argv
    mockProcessArgv = process.argv;

    // Reset mock implementations
    mockYargsInstance.option.mockReturnThis();
    mockYargsInstance.check.mockReturnThis();
    mockYargsInstance.help.mockReturnThis();
    mockYargsInstance.alias.mockReturnThis();
    mockYargsInstance.usage.mockReturnThis();
    mockYargsInstance.example.mockReturnThis();
    mockYargsInstance.parseSync.mockReturnValue({});

    // Setup yargs mock to return the chainable instance
    mockYargs.mockReturnValue(mockYargsInstance);

    // Setup default mock implementations
    mockResolve.mockImplementation((path: string) => `/resolved/${path}`);
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue({ isDirectory: () => true } as any);
    mockConfigManager.initializeConfigManager.mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original process.argv
    process.argv = mockProcessArgv;
  });

  describe('loadConfig', () => {
    describe('when called without override_kb_path', () => {
      it('should parse arguments, validate paths, and initialize config manager', () => {
        // Arrange
        const expectedArgs = {
          'kb-path': '/test/knowledge_base',
          mode: 'stdio',
        };
        mockYargsInstance.parseSync.mockReturnValue(expectedArgs);
        mockResolve.mockReturnValue('/resolved/test/knowledge_base');

        // Act
        const result = loadConfig();

        // Assert
        expect(mockHideBin).toHaveBeenCalledWith(process.argv);
        expect(mockYargs).toHaveBeenCalled();
        expect(mockYargsInstance.option).toHaveBeenCalledWith('kb-path', {
          type: 'string',
          demandOption: true,
          default: undefined,
          describe: 'Path to knowledge base directory',
          alias: 'k'
        });
        expect(mockYargsInstance.option).toHaveBeenCalledWith('mode', {
          type: 'string',
          demandOption: true,
          describe: 'Server mode (http or stdio)',
          alias: 'm',
          choices: ['http', 'stdio']
        });
        expect(mockConfigManager.initializeConfigManager).toHaveBeenCalledWith(
          '/resolved/test/knowledge_base',
          'stdio'
        );
        expect(result).toEqual({
          kbPath: '/resolved/test/knowledge_base',
          mode: 'stdio'
        });
      });
    });

    describe('when called with override_kb_path', () => {
      it('should use override path and not require kb-path argument', () => {
        // Arrange
        const overridePath = '/override/knowledge_base';
        const expectedArgs = {
          'kb-path': overridePath,
          mode: 'http',
        };
        mockYargsInstance.parseSync.mockReturnValue(expectedArgs);
        mockResolve.mockReturnValue('/resolved/override/knowledge_base');

        // Act
        const result = loadConfig(overridePath);

        // Assert
        expect(mockYargsInstance.option).toHaveBeenCalledWith('kb-path', {
          type: 'string',
          demandOption: false,
          default: overridePath,
          describe: 'Path to knowledge base directory',
          alias: 'k'
        });
        expect(mockConfigManager.initializeConfigManager).toHaveBeenCalledWith(
          '/resolved/override/knowledge_base',
          'http'
        );
        expect(result).toEqual({
          kbPath: '/resolved/override/knowledge_base',
          mode: 'http'
        });
      });
    });

    describe('when using http mode', () => {
      it('should handle http mode correctly', () => {
        // Arrange
        const expectedArgs = {
          'kb-path': '/test/kb',
          mode: 'http',
        };
        mockYargsInstance.parseSync.mockReturnValue(expectedArgs);
        mockResolve.mockReturnValue('/resolved/test/kb');

        // Act
        const result = loadConfig();

        // Assert
        expect(result.mode).toBe('http');
        expect(mockConfigManager.initializeConfigManager).toHaveBeenCalledWith(
          '/resolved/test/kb',
          'http'
        );
      });
    });

    describe('when using stdio mode', () => {
      it('should handle stdio mode correctly', () => {
        // Arrange
        const expectedArgs = {
          'kb-path': '/test/kb',
          mode: 'stdio',
        };
        mockYargsInstance.parseSync.mockReturnValue(expectedArgs);
        mockResolve.mockReturnValue('/resolved/test/kb');

        // Act
        const result = loadConfig();

        // Assert
        expect(result.mode).toBe('stdio');
        expect(mockConfigManager.initializeConfigManager).toHaveBeenCalledWith(
          '/resolved/test/kb',
          'stdio'
        );
      });
    });
  });

  describe('yargs validation', () => {
    let checkFunction: (argv: any) => boolean;

    beforeEach(() => {
      // Capture the check function that gets passed to yargs
      mockYargsInstance.check.mockImplementation((fn: any) => {
        checkFunction = fn;
        return mockYargsInstance;
      });
      
      // Initialize to capture the check function
      loadConfig('/test/path');
    });

    describe('path validation', () => {
      it('should pass validation for valid directory path', () => {
        // Arrange
        const argv = { 'kb-path': '/valid/path' };
        mockResolve.mockReturnValue('/resolved/valid/path');
        mockFs.existsSync.mockReturnValue(true);
        mockFs.statSync.mockReturnValue({ isDirectory: () => true } as any);

        // Act
        const result = checkFunction(argv);

        // Assert
        expect(result).toBe(true);
        expect(mockResolve).toHaveBeenCalledWith('/valid/path');
        expect(mockFs.existsSync).toHaveBeenCalledWith('/resolved/valid/path');
        expect(mockFs.statSync).toHaveBeenCalledWith('/resolved/valid/path');
      });

      it('should throw error when kb-path is empty string', () => {
        // Arrange
        const argv = { 'kb-path': '' };

        // Act & Assert
        expect(() => checkFunction(argv)).toThrow('kb-path argument is required and cannot be empty');
      });

      it('should throw error when kb-path is only whitespace', () => {
        // Arrange
        const argv = { 'kb-path': '   ' };

        // Act & Assert
        expect(() => checkFunction(argv)).toThrow('kb-path argument is required and cannot be empty');
      });

      it('should throw error when kb-path is null', () => {
        // Arrange
        const argv = { 'kb-path': null };

        // Act & Assert
        expect(() => checkFunction(argv)).toThrow('kb-path argument is required and cannot be empty');
      });

      it('should throw error when kb-path is undefined', () => {
        // Arrange
        const argv = { 'kb-path': undefined };

        // Act & Assert
        expect(() => checkFunction(argv)).toThrow('kb-path argument is required and cannot be empty');
      });

      it('should throw error when path does not exist', () => {
        // Arrange
        const argv = { 'kb-path': '/nonexistent/path' };
        mockResolve.mockReturnValue('/resolved/nonexistent/path');
        mockFs.existsSync.mockReturnValue(false);

        // Act & Assert
        expect(() => checkFunction(argv)).toThrow('Knowledge base path does not exist: /resolved/nonexistent/path');
        expect(mockFs.statSync).not.toHaveBeenCalled();
      });

      it('should throw error when path is not a directory', () => {
        // Arrange
        const argv = { 'kb-path': '/file/path' };
        mockResolve.mockReturnValue('/resolved/file/path');
        mockFs.existsSync.mockReturnValue(true);
        mockFs.statSync.mockReturnValue({ isDirectory: () => false } as any);

        // Act & Assert
        expect(() => checkFunction(argv)).toThrow('Knowledge base path is not a directory: /resolved/file/path');
      });

      it('should handle relative paths by resolving them', () => {
        // Arrange
        const argv = { 'kb-path': './relative/path' };
        mockResolve.mockReturnValue('/resolved/relative/path');
        mockFs.existsSync.mockReturnValue(true);
        mockFs.statSync.mockReturnValue({ isDirectory: () => true } as any);

        // Act
        const result = checkFunction(argv);

        // Assert
        expect(result).toBe(true);
        expect(mockResolve).toHaveBeenCalledWith('./relative/path');
        expect(mockFs.existsSync).toHaveBeenCalledWith('/resolved/relative/path');
      });
    });
  });

  describe('yargs configuration', () => {
    it('should configure help options correctly', () => {
      // Act
      loadConfig();

      // Assert
      expect(mockYargsInstance.help).toHaveBeenCalledWith('h');
      expect(mockYargsInstance.alias).toHaveBeenCalledWith('help', 'h');
    });

    it('should configure usage message correctly', () => {
      // Act
      loadConfig();

      // Assert
      expect(mockYargsInstance.usage).toHaveBeenCalledWith(
        'Usage: $0 --kb-path <path-to-knowledge-base> --mode <http|stdio>'
      );
    });

    it('should configure example correctly', () => {
      // Act
      loadConfig();

      // Assert
      expect(mockYargsInstance.example).toHaveBeenCalledWith(
        '$0 --kb-path ./knowledge_base --mode stdio',
        'Use ./knowledge_base as the knowledge base directory with stdio mode'
      );
    });

    it('should configure mode option with correct choices', () => {
      // Act
      loadConfig();

      // Assert
      expect(mockYargsInstance.option).toHaveBeenCalledWith('mode', {
        type: 'string',
        demandOption: true,
        describe: 'Server mode (http or stdio)',
        alias: 'm',
        choices: ['http', 'stdio']
      });
    });
  });

  describe('error handling', () => {
    it('should propagate yargs parsing errors', () => {
      // Arrange
      const yargsError = new Error('Invalid arguments');
      mockYargsInstance.parseSync.mockImplementation(() => {
        throw yargsError;
      });

      // Act & Assert
      expect(() => loadConfig()).toThrow('Invalid arguments');
    });

    it('should propagate file system errors during validation', () => {
      // Arrange
      mockYargsInstance.check.mockImplementation((fn: any) => {
        // Simulate the validation function being called with valid argv
        const argv = { 'kb-path': '/test/path' };
        mockResolve.mockReturnValue('/resolved/test/path');
        mockFs.existsSync.mockImplementation(() => {
          throw new Error('File system error');
        });
        
        // Execute the validation function immediately to test error handling
        expect(() => fn(argv)).toThrow('File system error');
        
        return mockYargsInstance;
      });

      // Act
      loadConfig();

      // The error is tested within the mock implementation above
    });

    it('should propagate config manager initialization errors', () => {
      // Arrange
      const expectedArgs = {
        'kb-path': '/test/path',
        mode: 'stdio',
      };
      mockYargsInstance.parseSync.mockReturnValue(expectedArgs);
      mockResolve.mockReturnValue('/resolved/test/path');
      mockConfigManager.initializeConfigManager.mockImplementation(() => {
        throw new Error('Config manager error');
      });

      // Act & Assert
      expect(() => loadConfig()).toThrow('Config manager error');
    });
  });

  describe('integration scenarios', () => {
    it('should handle complex valid scenario with override path', () => {
      // Arrange
      const overridePath = '../custom/kb';
      const expectedArgs = {
        'kb-path': overridePath,
        mode: 'http',
      };
      mockYargsInstance.parseSync.mockReturnValue(expectedArgs);
      mockResolve.mockReturnValue('/resolved/custom/kb');
      
      // Mock validation to pass
      mockYargsInstance.check.mockImplementation((fn: any) => {
        const argv = { 'kb-path': overridePath };
        mockFs.existsSync.mockReturnValue(true);
        mockFs.statSync.mockReturnValue({ isDirectory: () => true } as any);
        expect(fn(argv)).toBe(true);
        return mockYargsInstance;
      });

      // Act
      const result = loadConfig(overridePath);

      // Assert
      expect(result).toEqual({
        kbPath: '/resolved/custom/kb',
        mode: 'http'
      });
      expect(mockConfigManager.initializeConfigManager).toHaveBeenCalledWith(
        '/resolved/custom/kb',
        'http'
      );
    });

    it('should handle scenario where yargs parsing succeeds but path validation fails', () => {
      // Arrange
      const expectedArgs = {
        'kb-path': '/invalid/path',
        mode: 'stdio',
      };
      mockYargsInstance.parseSync.mockReturnValue(expectedArgs);
      
      // Mock the check function to throw during validation
      mockYargsInstance.check.mockImplementation((fn: any) => {
        const argv = { 'kb-path': '/invalid/path' };
        mockResolve.mockReturnValue('/resolved/invalid/path');
        mockFs.existsSync.mockReturnValue(false);
        
        // This should throw when yargs internally calls the validation
        expect(() => fn(argv)).toThrow('Knowledge base path does not exist: /resolved/invalid/path');
        
        return mockYargsInstance;
      });

      // Act - The validation error is tested within the mock implementation
      loadConfig();
    });
  });
});