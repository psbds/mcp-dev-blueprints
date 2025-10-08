import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceDefinition } from "./types.js";
import { readFileWithCache } from "../utils/file-utils.js";
import { getConfigManager } from "../config/config-manager.js"

export function useResources(server: McpServer, resources: ResourceDefinition[]) {
    resources.forEach(resource => useResource(server, resource));
}

function useResource(server: McpServer, resource: ResourceDefinition) {
    const configManager = getConfigManager();
    server.registerResource(
        resource.id,
        resource.uri,
        {
            title: resource.title,
            description: resource.description,
            mimeType: resource.mimeType
        },
        async (uri) => {
            const contents: any[] = [];
            
            for (const item of resource.content) {
                if (item.type === "text") {
                    contents.push({
                        uri: uri.href,
                        text: item.text
                    });
                } else if (item.type === "file") {
                    const fileContent = configManager.loadTextFile(item.path);
                    contents.push({
                        uri: uri.href,
                        text: fileContent
                    });
                } else if (item.type === "uri") {
                    contents.push({
                        uri: item.uri,
                        text: `Resource available at: ${item.uri}`
                    });
                }
            }
            
            return {
                contents: contents
            };
        }
    );
}