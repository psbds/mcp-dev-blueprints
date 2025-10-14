# Running Guide

**Deploy your MCP servers with confidence using multiple deployment strategies.**

This guide covers everything from local development to production deployment, helping you choose the right approach for your use case.

## 🎯 Quick Start Options

| Method | Best For | Command | Time to Start |
|--------|----------|---------|---------------|
| **NPX (Instant)** | Testing, quick demos | `npx mcp-dev-blueprints --kb-path .` | 30 seconds |
| **Development Mode** | Active development | `npm run dev` | 1 minute |
| **Production Build** | Enterprise deployment | `npm run build && npm start` | 2 minutes |
| **Docker** | Containerized deployment | `docker run mcp-dev-blueprints` | 1 minute |

---

## 🚀 Method 1: NPX (Instant Deployment)

Perfect for quick testing and demonstrations.

### Prerequisites
- **Node.js** 20+ ([Download here](https://nodejs.org/))
- **npm** (included with Node.js)

### Quick Start
```bash
# Create knowledge base
mkdir my-knowledge-base && cd my-knowledge-base

# Create minimal configuration (copy from examples above)
# ... create servers.json and feature files ...

# Start instantly 
npx mcp-dev-blueprints --kb-path . --mode http

# Server starts at http://localhost:3000 🎉
```


---

## 🔧 Method 2: Development Mode

Recommended for active development and customization.

### Setup
```bash
# Clone the repository
git clone https://github.com/psbds/mcp-dev-blueprints.git
cd mcp-dev-blueprints

# Install dependencies  
npm install

# Start development server
npm run dev
```

### What Development Mode Provides
- ✅ **Extended Knowledge Base** - Includes example configurations
- ✅ **Custom Tools** - TypeScript extensions loaded from `dev/custom/`
- ✅ **Debug Logging** - Verbose output for troubleshooting
- ✅ **Source Maps** - Better error tracking and debugging

### Development Commands

```bash
# Standard development startup
npm run dev

# HTTP mode (default)
npm run dev:http  

# STDIO mode (for direct MCP client integration)
npm run dev:stdio

# Watch mode (rebuilds on changes)
npm run watch:dev

# Run with custom knowledge base
npm run dev -- --kb-path /path/to/custom/kb
```

---

## 🏭 Method 3: Production Deployment

For production deployment, check the documentation on [Building For Production](/docs/BUILD_FOR_PRODUCTION.md)

---

## 📋 Command Line Reference

### Required Arguments

| Argument | Short | Description | Example |
|----------|-------|-------------|---------|
| `--kb-path` | `-k` | Path to knowledge base directory | `--kb-path ./knowledge-base` |
| `--mode` | `-m` | `http` | Server mode (`http` or `stdio`) | `--mode stdio` |

### Example Commands

```bash
# Minimal startup
npx mcp-dev-blueprints --kb-path . --mode stdio

# Custom port and verbose logging  
npx mcp-dev-blueprints --kb-path ./kb --mode http
```

---

## ⚙️ Advanced Configuration

### Environment Variables Reference

| Variable | Purpose | Default | Example |
|----------|---------|---------|---------|
| `HTTP_PORT` | Server port | `3000` | `HTTP_PORT=8080` |

## 🛠️ Troubleshooting

### Common Issues

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **Port Already in Use** | `EADDRINUSE: address already in use` | Change port with `--port` or `HTTP_PORT` |
| **Knowledge Base Not Found** | `KB directory not found` | Verify `--kb-path` points to existing directory |
| **Permission Denied** | `EACCES: permission denied` | Check file permissions: `chmod -R 644 knowledge-base/` |
| **JSON Syntax Error** | `Unexpected token` in logs | Validate JSON: `cat servers.json \| jq .` |
| **Tool Not Loading** | Tool missing from client | Check feature file is listed in `servers.json` |

