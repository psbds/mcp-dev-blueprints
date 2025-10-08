import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { handlePost, handleDefault } from "./handlers.js";

export default function createRouter(mcp_server_id: string, path: string, beforeConnecting: (mcpServer: McpServer) => void) {
    const router = express.Router();

    router.post(`/${path}`, handlePost(mcp_server_id, beforeConnecting));
    router.get(`/${path}`, handleDefault(mcp_server_id));
    router.delete(`/${path}`, handleDefault(mcp_server_id));

    return router;
}