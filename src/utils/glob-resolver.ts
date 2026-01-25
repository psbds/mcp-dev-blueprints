import { globSync } from 'glob';
import { join } from 'path';

/**
 * Resolve file paths from an array that may contain glob patterns
 * @param basePath - The base path to resolve from
 * @param patterns - Array of file paths or glob patterns
 * @returns Array of resolved file paths
 */
export function resolveGlobPatterns(basePath: string, patterns: string[]): string[] {
    const resolvedPaths: string[] = [];

    for (const pattern of patterns) {
        // Check if the pattern contains glob characters
        const hasGlobChars = /[*?[\]{}]/.test(pattern);

        if (hasGlobChars) {
            // Use glob to resolve pattern
            const matches = globSync(pattern, {
                cwd: basePath,
                nodir: true,
                absolute: false
            });
            resolvedPaths.push(...matches);
        } else {
            // It's a simple file path
            resolvedPaths.push(pattern);
        }
    }

    return resolvedPaths;
}
