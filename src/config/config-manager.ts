import { join } from "path";
import { ServerConfig } from "../server/types.js";
import { ServerFeature } from "../features/types.js";
import { readJsonWithCacheFromBase, readFileWithCacheFromBase } from "../utils/file-utils.js";

/**
 * Configuration manager for loading and parsing JSON configuration files
 */
export class ConfigManager {
    private kbPath: string;
    private mode: string;

    constructor(kbPath: string, mode: string) {
        this.kbPath = kbPath;
        this.mode = mode;
    }

    /**
     * Load servers configuration from servers.json
     * @returns Array of server configurations
     */
    loadServersConfig(): ServerConfig[] {
        try {
            const serversConfig: ServerConfig[] = readJsonWithCacheFromBase<ServerConfig[]>(this.kbPath, 'servers.json');
            return serversConfig;
        } catch (error) {
            console.error(`Error loading servers configuration from ${join(this.kbPath, 'servers.json')}:`, error);
            process.exit(1);
        }
    }

    /**
     * Load a feature definition from a JSON file
     * @param featurePath - Relative path to the feature definition file
     * @returns Parsed feature definition
     */
    loadFeature(featurePath: string): ServerFeature {
        try {
            const feature: ServerFeature = readJsonWithCacheFromBase<ServerFeature>(this.kbPath, featurePath);
            return feature;
        } catch (error) {
            console.error(`Error loading feature from ${join(this.kbPath, featurePath)}:`, error);
            throw error;
        }
    }

    /**
     * Get the knowledge base path
     * @returns The absolute path to the knowledge base directory
     */
    getKnowledgeBasePath(): string {
        return this.kbPath;
    }

    /**
     * Get the server mode
     * @returns The server mode (http or stdio)
     */
    getMode(): string {
        return this.mode;
    }

    /**
     * Get the full path to a feature definition file
     * @param featurePath - Relative path to the feature definition file
     * @returns Absolute path to the feature definition file
     */
    getFeaturePath(featurePath: string): string {
        return join(this.kbPath, featurePath);
    }

    /**
     * Load and parse any JSON file from the knowledge base
     * @param relativePath - Path relative to the knowledge base
     * @returns Parsed JSON object
     */
    loadJson<T>(relativePath: string): T {
        try {
            const parsedData: T = readJsonWithCacheFromBase<T>(this.kbPath, relativePath);
            return parsedData;
        } catch (error) {
            console.error(`Error loading JSON from ${join(this.kbPath, relativePath)}:`, error);
            throw error;
        }
    }

    /**
     * Load a text file from the knowledge base
     * @param relativePath - Path relative to the knowledge base
     * @returns File content as string
     */
    loadTextFile(relativePath: string): string {
        try {
            return readFileWithCacheFromBase(this.kbPath, relativePath);
        } catch (error) {
            console.error(`Error loading text file from ${join(this.kbPath, relativePath)}:`, error);
            throw error;
        }
    }
}

// Global config manager instance
let _configManager: ConfigManager | null = null;

/**
 * Initialize the global configuration manager
 * @param kbPath - The absolute path to the knowledge base directory
 * @param mode - The server mode (http or stdio)
 */
export function initializeConfigManager(kbPath: string, mode: string): void {
    _configManager = new ConfigManager(kbPath, mode);
}

/**
 * Get the global configuration manager instance
 * @returns The configuration manager instance
 * @throws Error if the configuration manager has not been initialized
 */
export function getConfigManager(): ConfigManager {
    if (_configManager === null) {
        throw new Error('Configuration manager not initialized. Call initializeConfigManager() first.');
    }
    return _configManager;
}