import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js"
import { createTransport, getTransport } from "./transport.js"
import { initializeMcpServer } from "../server.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function handlePost(mcp_server_id: string, beforeConnect: (mcpServer: McpServer) => void): (req: express.Request, res: express.Response) => Promise<void> {
    return async (req: express.Request, res: express.Response): Promise<void> => {
        // Check for existing session ID
        const sessionId = req.headers['mcp-session-id'] as string | undefined;
        let transport: StreamableHTTPServerTransport;

        // If session ID exists and transport is found, use it
        if (sessionId && getTransport(mcp_server_id, sessionId)) {
            transport = getTransport(mcp_server_id, sessionId)!;
            await transport.handleRequest(req, res, req.body);
            return;
        }

        // If no session ID, check if it's an initialization request to create a new session
        if (!sessionId && isInitializeRequest(req.body)) {
            transport = createTransport(mcp_server_id);
            await initializeMcpServer(mcp_server_id, transport, beforeConnect);
            await transport.handleRequest(req, res, req.body);
            return;
        }

        // If session ID is provided but invalid, or if it's not an initialization request, return error
        res.status(400).json({
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: 'Bad Request: No valid session ID provided',
            },
            id: null,
        });
    };
}

export function handleDefault(mcp_server_id: string): (req: express.Request, res: express.Response) => Promise<void> {
    return async (req: express.Request, res: express.Response) => {
        const sessionId = req.headers['mcp-session-id'] as string | undefined;
        if (!sessionId || !getTransport(mcp_server_id, sessionId)) {
            console.error(`Invalid or missing session ID: ${sessionId} for server: ${mcp_server_id}`);
            res.status(400).send('Invalid or missing session ID');
            return;
        }

        const transport = getTransport(mcp_server_id, sessionId)!;

        await transport.handleRequest(req, res);
    };
}