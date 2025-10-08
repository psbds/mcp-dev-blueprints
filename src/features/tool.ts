import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolDefinition } from "./types.js";

import { getConfigManager } from "../config/config-manager.js"

export function useTools(server: McpServer, tools: ToolDefinition[]) {
    tools.forEach(tool => useTool(server, tool));
}

function useTool(server: McpServer, tool: ToolDefinition) {
    console.info(`Registering tool: ${tool.id} - ${tool.title}`);
    const configManager = getConfigManager();
    const content: any = [];

    for (const item of tool.content) {
        if (item.type === "text") {
            content.push({ type: "text", text: item.text });
        } else if (item.type === "resource_link") {
            content.push({ type: "resource_link", uri: item.uri, name: item.name, mimeType: item.mimeType, description: item.description });
        } else if (item.type === "file") {
            const fileContent = configManager.loadTextFile(item.path);
            content.push({ type: "text", text: fileContent });
        }
    }
    
    server.registerTool(
        tool.id,
        {
            title: tool.title,
            description: tool.description,
        },
        async ({ }) => ({
            content: content
        })
    );
}


