import matter from 'gray-matter';
import { readFileWithCacheFromBase } from './file-utils.js';
import { ToolDefinition } from '../features/types.js';

/**
 * Represents parsed skill file data
 */
export interface SkillFile {
    name: string;
    description: string;
    content: string;
}

/**
 * Parse a skill file and extract frontmatter and content
 * @param kbPath - The knowledge base path
 * @param skillPath - Path to the skill file relative to the knowledge base
 * @returns Parsed skill file data
 */
export function parseSkillFile(kbPath: string, skillPath: string): SkillFile {
    const fileContent = readFileWithCacheFromBase(kbPath, skillPath);
    const parsed = matter(fileContent);

    // Validate required frontmatter fields
    if (!parsed.data.name || typeof parsed.data.name !== 'string') {
        throw new Error(`Skill file ${skillPath} is missing required 'name' field in frontmatter`);
    }

    if (!parsed.data.description || typeof parsed.data.description !== 'string') {
        throw new Error(`Skill file ${skillPath} is missing required 'description' field in frontmatter`);
    }

    return {
        name: parsed.data.name,
        description: parsed.data.description,
        content: parsed.content.trim()
    };
}

/**
 * Convert a parsed skill file to a ToolDefinition
 * @param skillFile - Parsed skill file data
 * @returns Tool definition
 */
export function skillFileToTool(skillFile: SkillFile): ToolDefinition {
    return {
        id: skillFile.name,
        title: skillFile.name,
        description: skillFile.description,
        content: [
            {
                type: 'text',
                text: skillFile.content
            }
        ]
    };
}
