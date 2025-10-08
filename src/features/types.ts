import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export type ServerFeature = {
    tools: ToolDefinition[];
    resources: ResourceDefinition[];
    prompts: PromptDefinition[];
    custom_tools: string[];
    custom_resources: string[];
    custom_prompts: string[];
};

export type ToolDefinition = {
    id: string;
    title: string;
    description: string;
    content: Array<{ type: "text"; text: string } | { type: "resource_link"; uri: string; name: string; mimeType?: string; description?: string } | { type: "file"; path: string }>;
};

export type PromptDefinition = {
    id: string;
    title: string;
    description: string;
    messages?: Array<{ role: "user" | "assistant" | "system"; content: { type: "text"; text: string } }>;
};

export type ResourceDefinition = {
    id: string;
    uri: string;
    title: string;
    description: string;
    mimeType: string;
    content: Array<{ type: "text"; text: string } | { type: "file"; path: string } | { type: "uri"; uri: string }>;
};


// Map type with string keys and functions that receive string and return Promise
export type FeatureHandler = Map<string, (server: McpServer) => void>;

export type CustomFeatures = {
    tools: FeatureHandler;
    prompts: FeatureHandler;
    resources: FeatureHandler;
};