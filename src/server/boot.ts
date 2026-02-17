import loadConfig from "../config/args-parser.js";
import boot_http from "./http_server/server.js"
import boot_stdio from "./stdio_server/server.js"
import { getConfigManager } from "../config/config-manager.js";

export default async function boot(override_kb_path?: string) {
    loadConfig(override_kb_path);
    
    const configManager = getConfigManager();
    const serversConfig = configManager.loadServersConfig();
    const scope = configManager.getScope();

    // Filter servers based on scope if provided
    const filteredServers = scope 
        ? serversConfig.filter(server => scope.includes(server.name))
        : serversConfig;

    if (scope && filteredServers.length === 0) {
        throw new Error(`No servers matched the provided scope: ${scope.join(", ")}`);
    }

    if (configManager.getMode() === "http") {
        await boot_http(filteredServers);
        return;
    }

    if (configManager.getMode() === "stdio") {
        await boot_stdio(filteredServers);
        return;
    }

    throw new Error(`Invalid mode parameter ${configManager.getMode()}`)
}