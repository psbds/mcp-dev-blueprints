import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { CustomFeatures } from "./types";

const customFeatures: CustomFeatures = {
    tools: new Map(),
    prompts: new Map(),
    resources: new Map()
};

export function registerCustomTool(id: string, handler: (server: any) => void) {
    customFeatures.tools.set(id, handler);
}

export function registerCustomPrompt(id: string, handler: (server: any) => void) {
    customFeatures.prompts.set(id, handler);
}

export function registerCustomResource(id: string, handler: (server: any) => void) {
    customFeatures.resources.set(id, handler);
}

export function applyCustomTools(tool_ids: string[], server: McpServer): void {
    tool_ids.forEach(id => {
        const handler = customFeatures.tools.get(id);
        if (handler) {
            handler(server);
        } else {
            console.error(`No custom tool found for id: ${id}`);
        }
    });
}

export function applyCustomPrompts(prompt_ids: string[], server: McpServer): void {
    prompt_ids.forEach(id => {
        const handler = customFeatures.prompts.get(id);
        if (handler) {
            handler(server);
        } else {
            console.error(`No custom prompt found for id: ${id}`);
        }
    });
}

export function applyCustomResources(resource_ids: string[], server: McpServer): void {
    resource_ids.forEach(id => {
        const handler = customFeatures.resources.get(id);
        if (handler) {
            handler(server);
        } else {
            console.error(`No custom resource found for id: ${id}`);
        }
    });
}