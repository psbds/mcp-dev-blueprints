# Building For Production

**Comprehensive guide for deploying MCP Dev Blueprints to production environments.**

Choose from multiple deployment strategies to distribute your custom MCP servers to users, from simple npm packages to enterprise-grade containerized solutions.

## 📋 Deployment Options Overview

| Method |
|--------|
| **NPM Package** |
| **Web Server** |

---

## Prerequisites

The guides below assume that you already have created your MCP Dev Blueprint configuration in the `knowledge_base` folder. Such as:

`knowledge_base/servers.json`:

```json
[
    {
        "name": "my-custom-server",
        "path": "my-custom-server",
        "features": [
            "features/my-features.json"
        ]
    }
]
```
`knowledge_base/features/my-features.json`:

```json
{
    "tools": [
        {
            "id": "deployment_checklist",
            "title": "Deployment Checklist Tool",
            "description": "Provides comprehensive deployment verification checklist",
            "content": [
                {
                    "type": "text",
                    "text": "## Pre-Deployment Checklist\n\n✅ Code review completed\n✅ Unit tests passing\n✅ Integration tests validated\n✅ Security scan completed\n✅ Performance baseline established\n✅ Rollback plan prepared"
                }
            ]
        },
        {
            "id": "environment_validator",
            "title": "Environment Validation",
            "description": "Validates deployment environment configuration",
            "content": [
                {
                    "type": "text",
                    "text": "## Environment Validation\n\n1. **Database Connectivity**: Verify connection strings\n2. **API Endpoints**: Validate all external service URLs\n3. **Environment Variables**: Confirm all required vars are set\n4. **SSL Certificates**: Check expiration dates\n5. **Resource Limits**: Verify memory and CPU allocations"
                }
            ]
        }
    ],
    "prompts": [
        {
            "id": "deployment_plan",
            "title": "Generate Deployment Plan",
            "description": "Creates a customized deployment plan based on project requirements",
            "content": [
                {
                    "type": "text",
                    "text": "Create a detailed deployment plan that includes:\n\n1. **Timeline**: Deployment windows and milestones\n2. **Dependencies**: Required services and configurations\n3. **Validation Steps**: Post-deployment verification\n4. **Rollback Procedures**: Emergency recovery steps\n5. **Monitoring**: Key metrics to track during deployment"
                }
            ]
        }
    ],
    "resources": [
        {
            "id": "deployment_best_practices",
            "title": "Deployment Best Practices",
            "description": "Industry-standard deployment methodologies",
            "content": [
                {
                    "type": "text",
                    "text": "# Deployment Best Practices\n\n## Blue-Green Deployment\n- Maintain two identical production environments\n- Switch traffic between environments for zero-downtime deployments\n\n## Canary Releases\n- Deploy to a subset of users first\n- Monitor metrics before full rollout\n\n## Feature Flags\n- Control feature availability without code deployment\n- Enable gradual feature rollouts"
                }
            ]
        }
    ],
    "custom_tools": [],
    "custom_resources": [],
    "custom_prompts": []
}
```


## 🚀 Method 1: NPM Package Distribution

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: For package management and distribution
- **TypeScript**: For development (automatically configured)

### Step 1: Initialize Your Custom MCP Server Project

Create a new Node.js project that will serve as your custom MCP server:

```bash
# Create and navigate to your project directory
mkdir my-custom-mcp-server
cd my-custom-mcp-server

# Initialize the Node.js project
npm init -y

# Install MCP Dev Blueprints as a dependency
npm install mcp-dev-blueprints

# Install development dependencies
npm install --save-dev typescript @types/node copyfiles
```

### Step 2: Configure TypeScript

Create a `tsconfig.json` file in your project root:

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
        "rootDir": "./",
        "strict": true,
        "declaration": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
    },
    "include": [
        "index.ts"
    ],
    "exclude": ["node_modules", "dist"]
}
```

### Step 3: Set Up Project Structure

Create the following directory structure:

```
my-custom-mcp-server/
├── package.json
├── tsconfig.json
├── README.md
│── index.ts                    # Main entry point
│── knowledge_base/             # MCP configuration
│   ├── servers.json            # Server definitions
│   └── features/               # Feature configurations
│       └── my-features.json    # Your custom features
```

### Step 4: Create the Main Entry Point

Create `index.ts` to bootstrap your MCP server:

```typescript
#!/usr/bin/env node
import boot from "mcp-dev-blueprints/dist/src/server/boot.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Resolve paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define knowledge base path relative to compiled output
const knowledgeBasePath = join(__dirname, "knowledge_base");

// Boot the MCP server with custom knowledge base
boot(knowledgeBasePath);
```

### Step 5: Configure Package Build

Update your `package.json` with the necessary configuration:

```json
{
    "name": "my-custom-mcp-server",
    "version": "1.0.0",
    "description": "Custom MCP server with deployment tools",
    "type": "module",
    "main": "dist/index.js",
    "bin": {
        "my-custom-mcp-server": "./dist/index.js"
    },
    "files": [
        "dist",
        "README.md"
    ],
    "scripts": {
        "build": "tsc && copyfiles -u 1 'knowledge_base/**/*' dist/",
        "start": "node dist/index.js",
        "dev": "npm run build && node dist/index.js --mode stdio",
        "prepare": "npm run build"
    },
    "dependencies": {
        "mcp-dev-blueprints": "^1.0.0"
    },
    "devDependencies": {
        "@types/node": "^20.11.24",
        "copyfiles": "^2.4.1",
        "typescript": "^5.3.3"
    },
    "engines": {
        "node": ">=18.19.0"
    },
    "keywords": [
        "mcp",
        "model-context-protocol",
        "deployment",
        "devops"
    ],
    "author": "Your Name <your.email@example.com>",
    "license": "MIT",
    "repository": {
        "type": "git",
        "url": "git+https://github.com/your-username/my-custom-mcp-server.git"
    }
}
```

### Step 6: Publishing & Distribution

#### Option A: Public npm Registry
```bash
# Login to npm (if not already logged in)
npm login

# Publish your package
npm publish

# For scoped packages
npm publish --access public
```

#### Option B: Private npm Registry
```bash
# Configure private registry
npm config set registry https://your-private-registry.com

# Publish to private registry
npm publish
```

#### Option C: GitHub Package Registry
```bash
# Configure GitHub registry
npm config set @your-org:registry https://npm.pkg.github.com

# Publish to GitHub
npm publish
```

### Step 7: Consumer Usage

Once published, users can integrate your MCP server into their applications:

#### VS Code with MCP Extension
```json
{
    "mcp.servers": [
        {
            "name": "deployment-tools",
            "command": "npx",
            "args": ["my-custom-mcp-server", "--mode", "stdio"]
        }
    ]
}
```

## 🐳 Method 2: Web Server Deployment (With Docker)

The steps below guide how to create a Web Server with Docker, but you can use any tool of your choice that support running NodeJS Apps.

### Prerequisites
- **Docker**: Version 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: For orchestrated deployments (optional)

### Step 1: Create Dockerfile

Create a `Dockerfile` in your project root:

```dockerfile
FROM node:20-alpine AS production

WORKDIR app

COPY knowledge_base ./knowledge_base

# Default command
CMD ["npx", "mcp-dev-blueprints","--kb-path", "knowledge_base", "--mode", "http"]
```

### Step 2: Build and Test Docker Image

```bash
# Build the Docker image
docker build -t my-custom-mcp-server:latest .

# Test the container locally
docker run -p 3000:3000 my-custom-mcp-server:latest

# Test with custom knowledge base (volume mount)
docker run -p 3000:3000 -v $(pwd)/knowledge_base:/app/knowledge_base \
    my-custom-mcp-server:latest
```

You can also test with Docker Compose

Create `docker-compose.yml` file:

```yaml
services:
  mcp-server:
    build:
      context: .
    container_name: mcp-deployment-tools
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - HTTP_PORT=3000
```

### Step 3: Container Registry Deployment

#### Docker Hub
```bash
# Tag for Docker Hub
docker tag my-custom-mcp-server:latest your-username/my-custom-mcp-server:latest

# Push to Docker Hub
docker push your-username/my-custom-mcp-server:latest
```

#### GitHub Container Registry
```bash
# Tag for GitHub Container Registry
docker tag my-custom-mcp-server:latest ghcr.io/your-username/my-custom-mcp-server:latest

# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u your-username --password-stdin

# Push to GitHub Container Registry
docker push ghcr.io/your-username/my-custom-mcp-server:latest
```

### Step 4: Deploy Your Application

Once your Docker image is built and tested, deploy it to your preferred cloud platform or infrastructure. Your containerized MCP server can run on any platform that supports Docker containers, including:

**Cloud Platforms:**
- **Virtual Machines**: Deploy on AWS EC2, Azure VMs, Google Compute Engine, or DigitalOcean Droplets
- **Container Services**: Use AWS ECS, Azure Container Instances, Google Cloud Run, or DigitalOcean App Platform  
- **Kubernetes Clusters**: Deploy on managed Kubernetes services like EKS, AKS, GKE, or self-managed clusters
- **Platform-as-a-Service**: Utilize Heroku, Railway, Render, or similar platforms with Docker support

**On-Premises Options:**
- **Docker Swarm**: For orchestrated container deployments in your data center
- **Kubernetes**: Self-managed clusters on bare metal or virtualized infrastructure
- **Container Runtimes**: Direct deployment using Docker, Podman, or containerd

**Key Deployment Considerations:**
- **Networking**: Ensure port 3000 (or your configured port) is accessible to MCP clients
- **Scaling**: Configure horizontal scaling based on expected load and usage patterns
- **Security**: Implement proper firewall rules, SSL/TLS termination, and access controls
- **Monitoring**: Set up health checks, logging, and performance monitoring
- **Persistence**: Consider data persistence needs for any stateful components
- **Updates**: Plan for rolling updates and deployment automation

Choose the deployment method that best fits your infrastructure requirements, budget, compliance needs, and operational expertise.


### Step 5: Consumer Usage

Once published, users can integrate your MCP server into their applications:

#### VS Code with MCP Extension
```json
{
    "servers": {
        "my-mcp-dev-blueprint": {
            "type": "http",
            "url": "http://your_host:3000/my-custom-server"
        },
    },
    "inputs": []
}
```