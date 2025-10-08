import express from "express";
import { ServerConfig } from "../types.js";
import { configure } from "../server.js";
import createRouter from "./router.js";

export default function start(config: ServerConfig[]) {
    const app = express();

    app.use(express.json());

    config.forEach(serverConfig => {
        const createServer = configure(serverConfig);
        const router = createRouter(serverConfig.name, serverConfig.path, createServer);
        app.use(router);
    });

    const port = process.env.HTTP_PORT || 3000;

    app.listen(port, () => {
        console.log(`MCP Server listening on port ${port}`);
    });
}