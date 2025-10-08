import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Cache entry containing file content and metadata
 */
interface CacheEntry {
    content: string;
    lastModified: number;
    size: number;
}

/**
 * In-memory file cache with automatic invalidation based on file modification time
 */
class FileCache {
    private cache = new Map<string, CacheEntry>();
    private maxSize: number;

    constructor(maxSize: number = 100) {
        this.maxSize = maxSize;
    }

    /**
     * Get file content from cache or read from disk
     * @param filePath - Absolute path to the file
     * @returns File content as string
     */
    get(filePath: string): string {
        const normalizedPath = this.normalizePath(filePath);
        
        try {
            const stats = statSync(filePath);
            const cached = this.cache.get(normalizedPath);

            // Check if cache is valid (file hasn't been modified)
            if (cached && cached.lastModified === stats.mtimeMs && cached.size === stats.size) {
                return cached.content;
            }

            // Read file and update cache
            const content = readFileSync(filePath, 'utf-8');
            this.set(normalizedPath, content, stats.mtimeMs, stats.size);
            
            return content;
        } catch (error) {
            throw new Error(`Failed to read file ${filePath}: ${error}`);
        }
    }

    /**
     * Set file content in cache
     * @param filePath - Normalized file path
     * @param content - File content
     * @param lastModified - Last modification time
     * @param size - File size
     */
    private set(filePath: string, content: string, lastModified: number, size: number): void {
        // If cache is full, remove oldest entry (LRU-like behavior)
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }

        this.cache.set(filePath, {
            content,
            lastModified,
            size
        });
    }

    /**
     * Normalize file path for consistent caching
     * @param filePath - File path to normalize
     * @returns Normalized path
     */
    private normalizePath(filePath: string): string {
        return filePath.replace(/\\/g, '/').toLowerCase();
    }

    /**
     * Clear entire cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Remove specific file from cache
     * @param filePath - File path to remove
     */
    invalidate(filePath: string): void {
        const normalizedPath = this.normalizePath(filePath);
        this.cache.delete(normalizedPath);
    }

    /**
     * Get cache statistics
     * @returns Cache stats object
     */
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            entries: Array.from(this.cache.keys())
        };
    }
}

// Global file cache instance
const fileCache = new FileCache();

/**
 * Read file content with automatic caching
 * @param filePath - Absolute path to the file
 * @returns File content as string
 */
export function readFileWithCache(filePath: string): string {
    return fileCache.get(filePath);
}

/**
 * Read file content with caching, using a base directory
 * @param basePath - Base directory path
 * @param relativePath - Relative path from base directory
 * @returns File content as string
 */
export function readFileWithCacheFromBase(basePath: string, relativePath: string): string {
    const fullPath = join(basePath, relativePath);
    return fileCache.get(fullPath);
}

/**
 * Read and parse JSON file with caching
 * @param filePath - Absolute path to the JSON file
 * @returns Parsed JSON object
 */
export function readJsonWithCache<T = any>(filePath: string): T {
    const content = fileCache.get(filePath);
    try {
        return JSON.parse(content);
    } catch (error) {
        throw new Error(`Failed to parse JSON from ${filePath}: ${error}`);
    }
}

/**
 * Read and parse JSON file with caching, using a base directory
 * @param basePath - Base directory path
 * @param relativePath - Relative path from base directory
 * @returns Parsed JSON object
 */
export function readJsonWithCacheFromBase<T = any>(basePath: string, relativePath: string): T {
    const fullPath = join(basePath, relativePath);
    return readJsonWithCache<T>(fullPath);
}

/**
 * Clear the file cache
 */
export function clearFileCache(): void {
    fileCache.clear();
}

/**
 * Invalidate a specific file in the cache
 * @param filePath - File path to invalidate
 */
export function invalidateFileCache(filePath: string): void {
    fileCache.invalidate(filePath);
}

/**
 * Get cache statistics
 * @returns Cache statistics
 */
export function getFileCacheStats() {
    return fileCache.getStats();
}

/**
 * Create a new file cache instance with custom settings
 * @param maxSize - Maximum number of files to cache
 * @returns New FileCache instance
 */
export function createFileCache(maxSize: number = 100): FileCache {
    return new FileCache(maxSize);
}
