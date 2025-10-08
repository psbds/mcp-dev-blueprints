# Running the MCP Dev Blueprints

This document provides comprehensive instructions for running the MCP Dev Blueprints Application


## Running From Source

### Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: Version 18.19.0 or higher (as specified in package.json)
- **npm**: Comes with Node.js installation
- **Git**: For cloning the repository

You can verify your Node.js version by running:
```bash
node --version
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/psbds/mcp-dev-blueprints
cd mcp-dev-blueprints
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Running the Project

The project provides several ways to run depending on your needs:

#### 3.1 Development Mode (Recommended for Development)

Development mode includes additional development tools and uses the extended knowledge base:

```bash
npm run dev
```

This command:
- Builds the project with development configuration (`tsconfig.dev.json`)
- Starts the server with development features enabled
- Uses the `dev/knowledge_base` directory as the knowledge base path
- Includes custom development tools from `dev/custom/tools.ts`

The server will start on port **3000** by default (or the port specified in `HTTP_PORT` environment variable).

#### 3.2. Production Mode

##### 1. Build the Application
```bash
npm run build
```

##### 2. Start the Application
```bash
npm start  -- --kb-path <path-to-knowledge-base>
```

**Note**: Production mode requires you to specify the knowledge base path manually:

For example:
```bash
node dist/index.js --kb-path ./dev/knowledge_base
```
The server will be available at `http://localhost:3000` (or your configured port)

---

## Configuration Options

### Command Line Arguments

The server accepts the following command line arguments:

- `--kb-path` or `-k`: **(Required)** Path to the knowledge base directory
  - Example: `--kb-path ./dev/knowledge_base`
  - The path must exist and be a valid directory

### Environment Variables

- `HTTP_PORT`: Port number for the HTTP server (default: 3000)
  - Example: `HTTP_PORT=8080 npm run dev`

