import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PromptDefinition } from "./types.js";

export function usePrompts(server: McpServer, prompts: PromptDefinition[]) {
    prompts.forEach(tool => {
        usePrompt(server, tool);
    });
}

function usePrompt(server: McpServer, prompt: PromptDefinition) {
    var messages: any = [];
    if (prompt.messages) {
        messages = prompt.messages;
    }
    server.registerPrompt(
        prompt.id,
        {
            title: prompt.title,
            description: prompt.description,
        },
        async ({ }) => ({
            messages: messages
        })
    );
}