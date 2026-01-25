import { jest } from '@jest/globals';
import { parseSkillFile, skillFileToTool, SkillFile } from '../../src/utils/skill-parser.js';
import * as fileUtils from '../../src/utils/file-utils.js';

// Mock file-utils
jest.mock('../../src/utils/file-utils.js');

describe('utils/skill-parser', () => {
  const mockKbPath = '/test/kb';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseSkillFile', () => {
    it('should parse a valid skill file', () => {
      // Arrange
      const skillContent = `---
name: test-skill
description: A test skill
---

This is the content of the skill.`;
      
      (fileUtils.readFileWithCacheFromBase as jest.Mock).mockReturnValue(skillContent);

      // Act
      const result = parseSkillFile(mockKbPath, 'test-skill.md');

      // Assert
      expect(fileUtils.readFileWithCacheFromBase).toHaveBeenCalledWith(mockKbPath, 'test-skill.md');
      expect(result).toEqual({
        name: 'test-skill',
        description: 'A test skill',
        content: 'This is the content of the skill.'
      });
    });

    it('should throw error when name is missing', () => {
      // Arrange
      const skillContent = `---
description: A test skill
---

Content`;
      
      (fileUtils.readFileWithCacheFromBase as jest.Mock).mockReturnValue(skillContent);

      // Act & Assert
      expect(() => parseSkillFile(mockKbPath, 'test-skill.md'))
        .toThrow("Skill file test-skill.md is missing required 'name' field in frontmatter");
    });

    it('should throw error when description is missing', () => {
      // Arrange
      const skillContent = `---
name: test-skill
---

Content`;
      
      (fileUtils.readFileWithCacheFromBase as jest.Mock).mockReturnValue(skillContent);

      // Act & Assert
      expect(() => parseSkillFile(mockKbPath, 'test-skill.md'))
        .toThrow("Skill file test-skill.md is missing required 'description' field in frontmatter");
    });

    it('should handle skill files with complex content', () => {
      // Arrange
      const skillContent = `---
name: github-actions-debugging
description: Guide for debugging GitHub Actions
---

To debug failing GitHub Actions workflows:

1. Use the \`list_workflow_runs\` tool
2. Check the logs
3. Fix the issue`;
      
      (fileUtils.readFileWithCacheFromBase as jest.Mock).mockReturnValue(skillContent);

      // Act
      const result = parseSkillFile(mockKbPath, 'github-actions-debugging.md');

      // Assert
      expect(result.name).toBe('github-actions-debugging');
      expect(result.description).toBe('Guide for debugging GitHub Actions');
      expect(result.content).toContain('list_workflow_runs');
    });

    it('should trim whitespace from content', () => {
      // Arrange
      const skillContent = `---
name: test-skill
description: A test skill
---

  
This is the content.
  
  `;
      
      (fileUtils.readFileWithCacheFromBase as jest.Mock).mockReturnValue(skillContent);

      // Act
      const result = parseSkillFile(mockKbPath, 'test-skill.md');

      // Assert
      expect(result.content).toBe('This is the content.');
    });
  });

  describe('skillFileToTool', () => {
    it('should convert a skill file to a tool definition', () => {
      // Arrange
      const skillFile: SkillFile = {
        name: 'test-skill',
        description: 'A test skill',
        content: 'This is the content of the skill.'
      };

      // Act
      const result = skillFileToTool(skillFile);

      // Assert
      expect(result).toEqual({
        id: 'test-skill',
        title: 'test-skill',
        description: 'A test skill',
        content: [
          {
            type: 'text',
            text: 'This is the content of the skill.'
          }
        ]
      });
    });

    it('should handle multi-line content', () => {
      // Arrange
      const skillFile: SkillFile = {
        name: 'multi-line-skill',
        description: 'A skill with multiple lines',
        content: 'Line 1\nLine 2\nLine 3'
      };

      // Act
      const result = skillFileToTool(skillFile);

      // Assert
      expect(result.content[0]).toEqual({ type: 'text', text: 'Line 1\nLine 2\nLine 3' });
    });
  });
});
