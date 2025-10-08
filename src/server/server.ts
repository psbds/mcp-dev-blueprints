import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ServerConfig } from "./types";
import { PromptDefinition, ResourceDefinition, ToolDefinition } from "../features/types";
import { getConfigManager } from "../config/config-manager.js";
import { useTools } from "../features/tool.js";
import { useResources } from "../features/resource.js";
import { usePrompts } from "../features/prompt.js";
import { applyCustomPrompts, applyCustomResources, applyCustomTools } from "../features/custom.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport";

export async function initializeMcpServer(server_name: string, transport: Transport, beforeConnect: (mcpServer: McpServer) => void): Promise<void> {
    const server = new McpServer({
        name: server_name,
        version: "1.0.0"
    });

    beforeConnect(server);

    await server.connect(transport);
}

export function configure(serverConfig: ServerConfig): (server: McpServer) => void {
    console.log(`Setting up server: ${serverConfig.name} at path: /${serverConfig.path}`);

    const tools: ToolDefinition[] = [];
    const resources: ResourceDefinition[] = [];
    const prompts: PromptDefinition[] = [];

    const custom_tools: string[] = [];
    const custom_resources: string[] = [];
    const custom_prompts: string[] = [];

    const featuresInfo: any[] = [];

    const configManager = getConfigManager();

    serverConfig.features.forEach(featurePath => {
        // Load the feature using the config manager
        const feature = configManager.loadFeature(featurePath);

        const featureInfo = {
            Feature: featurePath,
            Tools: feature.tools.map(t => t.id).join(", ") || "None",
            CustomTools: feature.custom_tools.join(", ") || "None",
            Resources: feature.resources.map(r => r.id).join(", ") || "None",
            CustomResources: feature.custom_resources.join(", ") || "None",
            Prompts: feature.prompts.map(p => p.id).join(", ") || "None",
            CustomPrompts: feature.custom_prompts.join(", ") || "None"
        };

        featuresInfo.push(featureInfo);

        tools.push(...feature.tools);
        resources.push(...feature.resources);
        prompts.push(...feature.prompts);

        // Collect custom feature IDs
        custom_tools.push(...feature.custom_tools);
        custom_resources.push(...feature.custom_resources);
        custom_prompts.push(...feature.custom_prompts);
    });

    console.table(featuresInfo);

    return (mcpServer: McpServer) => {
        useTools(mcpServer, tools);
        useResources(mcpServer, resources);
        usePrompts(mcpServer, prompts);

        // Apply custom features
        applyCustomTools(custom_tools, mcpServer);
        applyCustomPrompts(custom_prompts, mcpServer);
        applyCustomResources(custom_resources, mcpServer);
    }
}