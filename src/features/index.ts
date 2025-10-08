// Forward the get function from feature_manager
export { registerCustomTool, registerCustomPrompt, registerCustomResource } from "./custom.js";

// Forward all types from types.ts
export type {
    ServerFeature,
    ToolDefinition,
    ResourceDefinition,
    PromptDefinition
} from "./types.js";