/**
 * Represents a server configuration with its associated features
 */
export interface ServerConfig {
    /** The display name of the server */
    name: string;
    /** The URL path for the server endpoint */
    path: string;
    /** Array of feature definition file paths relative to the knowledge base */
    features: string[];
}

/** Array of server configurations */
export type ServerConfigs = ServerConfig[];
