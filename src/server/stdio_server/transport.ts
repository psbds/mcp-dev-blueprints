import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

export function createTransport() {
    const transport = new StdioServerTransport();

    return transport;
}