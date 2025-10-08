import { getConfigManager } from "../config/config-manager.js";
import { ServerFeature } from "./types.js";

export function get_feature(definitionFilePath: string): ServerFeature {
    const configManager = getConfigManager();
    return configManager.loadFeature(definitionFilePath);

}
