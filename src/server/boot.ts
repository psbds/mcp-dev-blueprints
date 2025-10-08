import loadConfig from "../config/args-parser.js";
import boot_http from "./http_server/server.js"
import boot_stdio from "./stdio_server/server.js"
import { getConfigManager } from "../config/config-manager.js";

export default async function boot(override_kb_path?: string) {
    loadConfig(override_kb_path);
    
    const configManager = getConfigManager();
    const serversConfig = configManager.loadServersConfig();

    if (configManager.getMode() === "http") {
        await boot_http(serversConfig);
        return;
    }

    if (configManager.getMode() === "stdio") {
        await boot_stdio(serversConfig);
        return;
    }

    throw new Error(`Invalid mode parameter ${configManager.getMode()}`)
}