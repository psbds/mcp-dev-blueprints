import { jest } from '@jest/globals';

// Mock dependencies before importing the module under test
const mockConnect = jest.fn() as jest.MockedFunction<(transport: any) => Promise<void>>;

const mockConfigManager = {
  loadFeature: jest.fn(),
  getKnowledgeBasePath: jest.fn()
};

const mockUseTools = jest.fn();
const mockUseResources = jest.fn();
const mockUsePrompts = jest.fn();
const mockApplyCustomTools = jest.fn();
const mockApplyCustomResources = jest.fn();
const mockApplyCustomPrompts = jest.fn();
const mockResolveGlobPatterns = jest.fn();
const mockParseSkillFile = jest.fn();
const mockSkillFileToTool = jest.fn();

// Mock all external dependencies
jest.mock('@modelcontextprotocol/sdk/server/mcp.js', () => ({
  McpServer: jest.fn().mockImplementation((config: any) => ({
    connect: mockConnect,
    name: config.name,
    version: config.version
  }))
}));

jest.mock('../../src/config/config-manager.js', () => ({
  getConfigManager: jest.fn(() => mockConfigManager)
}));

jest.mock('../../src/features/tool.js', () => ({
  useTools: mockUseTools
}));

jest.mock('../../src/features/resource.js', () => ({
  useResources: mockUseResources
}));

jest.mock('../../src/features/prompt.js', () => ({
  usePrompts: mockUsePrompts
}));

jest.mock('../../src/features/custom.js', () => ({
  applyCustomTools: mockApplyCustomTools,
  applyCustomResources: mockApplyCustomResources,
  applyCustomPrompts: mockApplyCustomPrompts
}));

jest.mock('../../src/utils/glob-resolver.js', () => ({
  resolveGlobPatterns: mockResolveGlobPatterns
}));

jest.mock('../../src/utils/skill-parser.js', () => ({
  parseSkillFile: mockParseSkillFile,
  skillFileToTool: mockSkillFileToTool
}));

// Import after mocks are set up
import { configure } from '../../src/server/server.js';
import { ServerConfig } from '../../src/server/types.js';
import { ServerFeature } from '../../src/features/types.js';

// Mock console methods to avoid noise in tests
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleTable = jest.spyOn(console, 'table').mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('server/server - Skills Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfigManager.getKnowledgeBasePath.mockReturnValue('/test/kb');
  });

  describe('configure with skills', () => {
    const mockFeature: ServerFeature = {
      tools: [],
      resources: [],
      prompts: [],
      custom_tools: [],
      custom_resources: [],
      custom_prompts: []
    };

    beforeEach(() => {
      mockConfigManager.loadFeature.mockReturnValue(mockFeature);
    });

    it('should process skill files when skills property is provided', () => {
      // Arrange
      const serverConfig: ServerConfig = {
        name: 'test-server',
        path: '/api/test',
        features: ['feature1.json'],
        skills: ['skills/skill1.md', 'skills/skill2.md']
      };

      const skillFile1 = { name: 'skill1', description: 'Skill 1', content: 'Content 1' };
      const skillFile2 = { name: 'skill2', description: 'Skill 2', content: 'Content 2' };
      const tool1 = { id: 'skill1', title: 'skill1', description: 'Skill 1', content: [{ type: 'text', text: 'Content 1' }] };
      const tool2 = { id: 'skill2', title: 'skill2', description: 'Skill 2', content: [{ type: 'text', text: 'Content 2' }] };

      mockResolveGlobPatterns.mockReturnValue(['skills/skill1.md', 'skills/skill2.md']);
      mockParseSkillFile
        .mockReturnValueOnce(skillFile1)
        .mockReturnValueOnce(skillFile2);
      mockSkillFileToTool
        .mockReturnValueOnce(tool1)
        .mockReturnValueOnce(tool2);

      const mockMcpServerInstance = {};

      // Act
      const configureFunction = configure(serverConfig);
      configureFunction(mockMcpServerInstance as any);

      // Assert
      expect(mockResolveGlobPatterns).toHaveBeenCalledWith('/test/kb', ['skills/skill1.md', 'skills/skill2.md']);
      expect(mockParseSkillFile).toHaveBeenCalledTimes(2);
      expect(mockParseSkillFile).toHaveBeenCalledWith('/test/kb', 'skills/skill1.md');
      expect(mockParseSkillFile).toHaveBeenCalledWith('/test/kb', 'skills/skill2.md');
      expect(mockSkillFileToTool).toHaveBeenCalledTimes(2);
      expect(mockUseTools).toHaveBeenCalledWith(mockMcpServerInstance, [tool1, tool2]);
    });

    it('should handle glob patterns in skills property', () => {
      // Arrange
      const serverConfig: ServerConfig = {
        name: 'test-server',
        path: '/api/test',
        features: ['feature1.json'],
        skills: ['skills/*.md', 'docs/**/*.md']
      };

      const resolvedPaths = ['skills/skill1.md', 'skills/skill2.md', 'docs/nested/skill3.md'];
      const skillFile1 = { name: 'skill1', description: 'Skill 1', content: 'Content 1' };
      const skillFile2 = { name: 'skill2', description: 'Skill 2', content: 'Content 2' };
      const skillFile3 = { name: 'skill3', description: 'Skill 3', content: 'Content 3' };
      const tool1 = { id: 'skill1', title: 'skill1', description: 'Skill 1', content: [{ type: 'text', text: 'Content 1' }] };
      const tool2 = { id: 'skill2', title: 'skill2', description: 'Skill 2', content: [{ type: 'text', text: 'Content 2' }] };
      const tool3 = { id: 'skill3', title: 'skill3', description: 'Skill 3', content: [{ type: 'text', text: 'Content 3' }] };

      mockResolveGlobPatterns.mockReturnValue(resolvedPaths);
      mockParseSkillFile
        .mockReturnValueOnce(skillFile1)
        .mockReturnValueOnce(skillFile2)
        .mockReturnValueOnce(skillFile3);
      mockSkillFileToTool
        .mockReturnValueOnce(tool1)
        .mockReturnValueOnce(tool2)
        .mockReturnValueOnce(tool3);

      const mockMcpServerInstance = {};

      // Act
      const configureFunction = configure(serverConfig);
      configureFunction(mockMcpServerInstance as any);

      // Assert
      expect(mockResolveGlobPatterns).toHaveBeenCalledWith('/test/kb', ['skills/*.md', 'docs/**/*.md']);
      expect(mockParseSkillFile).toHaveBeenCalledTimes(3);
      expect(mockUseTools).toHaveBeenCalledWith(mockMcpServerInstance, [tool1, tool2, tool3]);
    });

    it('should work without skills property (backward compatibility)', () => {
      // Arrange
      const serverConfig: ServerConfig = {
        name: 'test-server',
        path: '/api/test',
        features: ['feature1.json']
        // No skills property
      };

      const mockMcpServerInstance = {};

      // Act
      const configureFunction = configure(serverConfig);
      configureFunction(mockMcpServerInstance as any);

      // Assert
      expect(mockResolveGlobPatterns).not.toHaveBeenCalled();
      expect(mockParseSkillFile).not.toHaveBeenCalled();
      expect(mockSkillFileToTool).not.toHaveBeenCalled();
    });

    it('should work with empty skills array', () => {
      // Arrange
      const serverConfig: ServerConfig = {
        name: 'test-server',
        path: '/api/test',
        features: ['feature1.json'],
        skills: []
      };

      const mockMcpServerInstance = {};

      // Act
      const configureFunction = configure(serverConfig);
      configureFunction(mockMcpServerInstance as any);

      // Assert
      expect(mockResolveGlobPatterns).not.toHaveBeenCalled();
      expect(mockParseSkillFile).not.toHaveBeenCalled();
      expect(mockSkillFileToTool).not.toHaveBeenCalled();
    });

    it('should display skills in feature info table', () => {
      // Arrange
      const serverConfig: ServerConfig = {
        name: 'test-server',
        path: '/api/test',
        features: ['feature1.json'],
        skills: ['skills/skill1.md', 'skills/skill2.md']
      };

      const skillFile1 = { name: 'skill1', description: 'Skill 1', content: 'Content 1' };
      const skillFile2 = { name: 'skill2', description: 'Skill 2', content: 'Content 2' };
      const tool1 = { id: 'skill1', title: 'skill1', description: 'Skill 1', content: [{ type: 'text', text: 'Content 1' }] };
      const tool2 = { id: 'skill2', title: 'skill2', description: 'Skill 2', content: [{ type: 'text', text: 'Content 2' }] };

      mockResolveGlobPatterns.mockReturnValue(['skills/skill1.md', 'skills/skill2.md']);
      mockParseSkillFile
        .mockReturnValueOnce(skillFile1)
        .mockReturnValueOnce(skillFile2);
      mockSkillFileToTool
        .mockReturnValueOnce(tool1)
        .mockReturnValueOnce(tool2);

      // Act
      configure(serverConfig);

      // Assert
      expect(mockConsoleTable).toHaveBeenCalledWith(expect.arrayContaining([
        {
          Feature: 'Skills',
          Tools: 'skill1, skill2',
          CustomTools: 'None',
          Resources: 'None',
          CustomResources: 'None',
          Prompts: 'None',
          CustomPrompts: 'None'
        }
      ]));
    });

    it('should combine tools from features and skills', () => {
      // Arrange
      const featureWithTools: ServerFeature = {
        tools: [{
          id: 'feature-tool',
          title: 'Feature Tool',
          description: 'Tool from feature',
          content: [{ type: 'text', text: 'Feature content' }]
        }],
        resources: [],
        prompts: [],
        custom_tools: [],
        custom_resources: [],
        custom_prompts: []
      };

      mockConfigManager.loadFeature.mockReturnValue(featureWithTools);

      const serverConfig: ServerConfig = {
        name: 'test-server',
        path: '/api/test',
        features: ['feature1.json'],
        skills: ['skills/skill1.md']
      };

      const skillFile1 = { name: 'skill1', description: 'Skill 1', content: 'Content 1' };
      const tool1 = { id: 'skill1', title: 'skill1', description: 'Skill 1', content: [{ type: 'text', text: 'Content 1' }] };

      mockResolveGlobPatterns.mockReturnValue(['skills/skill1.md']);
      mockParseSkillFile.mockReturnValueOnce(skillFile1);
      mockSkillFileToTool.mockReturnValueOnce(tool1);

      const mockMcpServerInstance = {};

      // Act
      const configureFunction = configure(serverConfig);
      configureFunction(mockMcpServerInstance as any);

      // Assert
      expect(mockUseTools).toHaveBeenCalledWith(mockMcpServerInstance, [
        featureWithTools.tools[0],
        tool1
      ]);
    });

    it('should propagate skill file parsing errors', () => {
      // Arrange
      const serverConfig: ServerConfig = {
        name: 'test-server',
        path: '/api/test',
        features: ['feature1.json'],
        skills: ['skills/invalid.md']
      };

      mockResolveGlobPatterns.mockReturnValue(['skills/invalid.md']);
      mockParseSkillFile.mockImplementation(() => {
        throw new Error('Invalid skill file format');
      });

      // Act & Assert
      expect(() => configure(serverConfig)).toThrow('Invalid skill file format');
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error loading skill file skills/invalid.md:',
        expect.any(Error)
      );
    });
  });
});
