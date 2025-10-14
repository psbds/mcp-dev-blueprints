# Creating Custom Tools Guide

**Build powerful dynamic tools that extend MCP Dev Blueprints with real-time data and complex logic.**

While JSON configuration handles most documentation and guidance needs, custom tools let you create dynamic, interactive functionality that can fetch live data, integrate with external systems, and perform complex operations.

## 🚀 When to Create Custom Tools

### Use JSON Configuration For:
- ✅ Static documentation and guidelines
- ✅ Step-by-step instructions and checklists  
- ✅ Reference materials and external links
- ✅ Simple conversation templates

### Create Custom Tools For:
- 🔧 **Dynamic Content Generation** - Real-time data from APIs or databases
- 🔧 **External System Integration** - Jira, GitHub, monitoring systems
- 🔧 **Complex Logic** - Calculations, validations, transformations
- 🔧 **Interactive Workflows** - Multi-step processes with branching logic
- 🔧 **Live Data** - Current deployment status, test results, metrics

---

## 🏗️ Project Setup

### Step 1: Create Your Custom Node.js Project

Start by creating a new Node.js project for your custom tools:

```bash
# Create a new directory for your custom MCP server
mkdir my-custom-mcp-server
cd my-custom-mcp-server

# Initialize Node.js project
npm init -y

# Install MCP Dev Blueprints as a dependency
npm install mcp-dev-blueprints

# Install additional dependencies for TypeScript development
npm install --save-dev typescript @types/node
npm install zod  # For input validation
```

### Step 2: Set Up TypeScript Configuration

Create a `tsconfig.json` file:

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "node",
        "allowSyntheticDefaultImports": true,
        "esModuleInterop": true,
        "allowJs": true,
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "declaration": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

### Step 3: Project Structure

Create the following directory structure:

```
my-custom-mcp-server/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts              # Main entry point
│   ├── custom/
│   │   └── tools.ts          # Custom tool implementations
│   └── knowledge_base/       # Your MCP knowledge base
│       ├── servers.json
│       └── features/
│           └── my-tools.json
```

---

## 🛠️ Creating Custom Tools

### Step 1: Create the Custom Tools File

Create `src/custom/tools.ts` with your tool implementations:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCustomTool } from "mcp-dev-blueprints/dist/src/features/index.js";
import { z } from "zod";

export default function addTools() {
    // Register your custom tool here
    registerCustomTool("timestamp_generator", registerTimestampTool);
}

// Very simple timestamp generator tool (no dependencies, no auth)
async function registerTimestampTool(server: McpServer) {
    server.registerTool(
        "timestamp_generator",
        {
            title: "Timestamp Generator",
            description: "Generate various timestamp formats for development and documentation.",
            inputSchema: {
                format: z.enum(["iso", "unix", "readable", "filename"]).optional().describe("Timestamp format to generate"),
                timezone: z.string().optional().describe("Timezone (e.g., 'UTC', 'America/New_York')")
            }
        },
        async (args) => {
            const { format = "iso", timezone = "UTC" } = args;
            
            try {
                const now = new Date();
                const timestamps = generateTimestamps(now, timezone);
                
                return {
                    content: [{
                        type: "text",
                        text: formatTimestampReport(timestamps, format)
                    }]
                };
            } catch (error) {
                return {
                    content: [{
                        type: "text",
                        text: `## ⚠️ Timestamp Generation Failed\n\nError: ${error.message}`
                    }]
                };
            }
        }
    );
}

// Simple helper functions with no external dependencies
function generateTimestamps(date: Date, timezone: string) {
    // Create different timestamp formats
    return {
        iso: date.toISOString(),
        unix: Math.floor(date.getTime() / 1000),
        readable: date.toLocaleString('en-US', { 
            timeZone: timezone,
            weekday: 'long',
            year: 'numeric',
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }),
        filename: date.toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0],
        utc: date.toUTCString(),
        epoch: date.getTime(),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
    };
}

function formatTimestampReport(timestamps: any, requestedFormat: string): string {
    let report = `## 🕐 Timestamp Generator

### Current Time Information
`;

    // Show the specifically requested format first
    switch (requestedFormat) {
        case 'iso':
            report += `**ISO Format**: \`${timestamps.iso}\`\n\n`;
            break;
        case 'unix':
            report += `**Unix Timestamp**: \`${timestamps.unix}\`\n\n`;
            break;
        case 'readable':
            report += `**Readable Format**: ${timestamps.readable}\n\n`;
            break;
        case 'filename':
            report += `**Filename Safe**: \`${timestamps.filename}\`\n\n`;
            break;
    }

    // Show all available formats
    report += `### All Available Formats

| Format | Value |
|--------|-------|
| ISO 8601 | \`${timestamps.iso}\` |
| Unix Timestamp | \`${timestamps.unix}\` |
| Readable | ${timestamps.readable} |
| Filename Safe | \`${timestamps.filename}\` |
| UTC String | ${timestamps.utc} |
| Epoch (ms) | \`${timestamps.epoch}\` |

### Individual Components
- **Year**: ${timestamps.year}
- **Month**: ${timestamps.month}
- **Day**: ${timestamps.day}
- **Hour**: ${timestamps.hour}
- **Minute**: ${timestamps.minute}
- **Second**: ${timestamps.second}

### Usage Examples
\`\`\`javascript
// Copy these values into your code:
const timestamp = "${timestamps.iso}";
const unixTime = ${timestamps.unix};
const filename = "${timestamps.filename}";
\`\`\`
`;

    return report;
}
```

### Step 2: Create the Main Entry Point

Create `src/index.ts` to bootstrap your MCP server:

```typescript
#!/usr/bin/env node
import boot from "mcp-dev-blueprints/dist/src/server/boot.js";
import addTools from "./custom/tools.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Define the knowledge base path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const knowledge_base_path = join(__dirname, "knowledge_base");

// Register your custom tools
addTools();

// Boot the MCP server
boot(knowledge_base_path);
```

### Step 3: Define Your Feature Configuration

Create `src/knowledge_base/features/my-tools.json`:

```json
{
    "tools": [
        {
            "id": "static_deployment_guide",
            "title": "Static Deployment Guidelines",
            "description": "Standard deployment procedures and best practices",
            "content": [
                {
                    "type": "text",
                    "text": "## Deployment Best Practices\n\n1. Always run tests before deployment\n2. Use staging environment for validation\n3. Monitor logs during deployment\n4. Have rollback plan ready"
                }
            ]
        }
    ],
    "resources": [],
    "prompts": [],
    "custom_tools": [
        "timestamp_generator"
    ],
    "custom_resources": [],
    "custom_prompts": []
}
```

### Step 4: Register Your Feature in servers.json

Create `src/knowledge_base/servers.json`:

```json
[
    {
        "name": "my-custom-tools",
        "path": "my-custom-tools",
        "features": [
            "features/my-tools.json"
        ]
    }
]
```

### Step 5: Add Build and Start Scripts

Update your `package.json`:

```json
{
    "name": "my-custom-mcp-server",
    "version": "1.0.0",
    "type": "module",
    "bin": {
        "my-custom-mcp-server": "./dist/index.js"
    },
    "scripts": {
        "build": "tsc && cp -r knowledge_base dist/",
        "start": "node dist/index.js",
        "dev": "npm run build && node dist/index.js"
    },
    "dependencies": {
        "mcp-dev-blueprints": "^1.0.0",
        "zod": "^3.22.4"
    },
    "devDependencies": {
        "@types/node": "^20.0.0",
        "typescript": "^5.0.0"
    }
}
```

---

## � Running Your Custom MCP Server

### Development Mode

```bash
# Build and run your custom server
npm run dev -- --mode=http

# Your server will be available at:
# http://localhost:3000/my-custom-tools
```