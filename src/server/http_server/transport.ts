import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";


// Map to store transports by session ID
const transports: {
    [mcp_server_id: string]: {
        [sessionId: string]: StreamableHTTPServerTransport
    }
} = {};

export function getTransport(mcp_server_id: string, sessionId: string): StreamableHTTPServerTransport | undefined {
    if (!transports[mcp_server_id])
        transports[mcp_server_id] = {};

    return transports[mcp_server_id]?.[sessionId];
}

export function createTransport(mcp_server_id: string): StreamableHTTPServerTransport {
    // Initialize the transports object for this server if it doesn't exist
    if (!transports[mcp_server_id]) {
        transports[mcp_server_id] = {};
    }

    let transport: StreamableHTTPServerTransport;

    transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId) => {
            console.log(`Initialized new session: ${sessionId} for server: ${mcp_server_id}`);
            transports[mcp_server_id][sessionId] = transport;
        },
    });

    transport.onclose = () => {
        if (transport.sessionId) {
            delete transports[mcp_server_id][transport.sessionId];
        }
    };
    

    return transport;
}