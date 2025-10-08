import boot from "../src/server/boot.js";

import addTools from "./custom/tools.js";

// Import custom tools to register them
addTools();

boot();