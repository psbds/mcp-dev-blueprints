import { ServerConfig } from "../types.js";
import { configure, initializeMcpServer } from "../server.js";
import { createTransport } from "./transport.js";

export default async function start(config: ServerConfig[]) {
    const transport = createTransport();

    const mergedConfig: ServerConfig = {
        name: config.map(c => c.name).join(","),
        path: "/stdio",
        features: config.flatMap(c => c.features)
    };
    const configureCb = configure(mergedConfig);
    await initializeMcpServer(mergedConfig.name, transport, configureCb);
}