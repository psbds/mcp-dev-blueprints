# Configuration Guide

**Master the art of building intelligent AI tools through configuration.**

This comprehensive guide walks you through creating sophisticated MCP servers using MCP Dev Blueprints' powerful configuration system.

## 🏗️ Architecture Overview

With MCP Dev Blueprints you can use a layered configuration approach that scales from simple setups to complex enterprise knowledge bases:

```
📁 knowledge_base/
├── 📄 servers.json              # Server registry & routing
├── 📁 team-standards/           # Organized by domain
│   ├── 📄 coding-rules.json    # Feature definitions
│   ├── 📄 testing-guide.json   # More features
│   └── 📁 content/              # Content files
│       ├── 📄 style-guide.md   
│       └── 📄 best-practices.md
├── 📁 architecture/
│   ├── 📄 patterns.json
│   └── 📁 diagrams/
└── 📁 custom/                   # Advanced extensions
    └── 📄 tools.ts              # TypeScript implementations
```

## 📋 Configuration Layers

| Layer | File Type | Purpose | Complexity |
|-------|-----------|---------|------------|
| **Server Registry** | `servers.json` | Define available servers and routing | ⭐ Simple |
| **Feature Definitions** | `*.json` | Configure tools, prompts, resources | ⭐⭐ Medium |
| **Content Files** | `.md`, `.txt` | Store actual documentation | ⭐ Simple |
| **Custom Tools** | `.ts` | Advanced programmatic functionality | ⭐⭐⭐ Advanced |

---

## 1️⃣ Server Configuration (`servers.json`)

The foundation of your MCP setup - defines which servers are available and how they're organized.

### Basic Example

```json
[
    {
        "name": "company-standards",
        "path": "company-standards", 
        "features": [
            "coding/typescript-rules.json",
            "testing/unit-test-guide.json",
            "deployment/ci-cd-standards.json"
        ]
    },
    {
        "name": "architecture-patterns",
        "path": "architecture",
        "features": [
            "patterns/microservices.json",
            "patterns/event-driven.json"
        ]
    }
]
```

### Configuration Properties

| Property | Type | Required | Description | Example | Notes |
|----------|------|----------|-------------|---------|--------|
| `name` | string | ✅ | Unique server identifier | `"company-standards"` | Used internally and in client configurations |
| `path` | string | ✅ | URL path segment for HTTP routing | `"company-standards"` | Appears in `http://localhost:3000/{path}` |
| `features` | array | ✅ | List of feature files to load | `["coding/rules.json"]` | Paths relative to knowledge base directory |

### Real-World Server Examples

#### Enterprise Knowledge Base
```json
[
    {
        "name": "engineering-standards",
        "path": "engineering", 
        "features": [
            "frontend/react-guidelines.json",
            "backend/api-standards.json",
            "database/schema-conventions.json",
            "security/authentication-patterns.json"
        ]
    },
    {
        "name": "platform-tools",
        "path": "platform",
        "features": [
            "kubernetes/deployment-templates.json",
            "monitoring/observability-setup.json",
            "ci-cd/pipeline-standards.json"
        ]
    }
]
```

### 💡 Best Practices for Server Organization

- **Domain-Based Separation**: Group related knowledge into distinct servers
- **Descriptive Names**: Use clear, self-explanatory server names
- **Logical Paths**: Keep URL paths simple and memorable
- **Feature Grouping**: Organize features by technology or domain area

---

## 2️⃣ Feature Files (`*.json`)

Feature files are the heart of your MCP server - they define the actual tools, prompts, and resources that AI clients can access.

### Feature File Structure

Every feature file follows this schema:

```json
{
    "tools": [],           // Interactive guidance and instructions
    "resources": [],       // Static documentation and references  
    "prompts": [],         // Pre-built conversation templates
    "custom_tools": [],    // References to TypeScript implementations
    "custom_resources": [],// Custom TypeScript resource providers
    "custom_prompts": []   // Custom TypeScript prompt generators
}
```

### Real-World Feature File Example

```json
{
    "tools": [
        {
            "id": "typescript_coding_standards",
            "title": "TypeScript Coding Standards & Best Practices",
            "description": "Essential guidelines for TypeScript development including naming conventions, type definitions, error handling, and code organization. Use this tool when starting new TypeScript projects, code reviews, or establishing team standards.",
            "content": [
                {
                    "type": "file",
                    "path": "standards/typescript-guide.md"
                },
                {
                    "type": "text", 
                    "text": "## Quick Rules\n\n- Use `interface` for object shapes, `type` for unions\n- Prefer `const assertions` over type annotations\n- Always handle errors explicitly\n- Use meaningful variable names (no single letters except loops)"
                }
            ]
        },
        {
            "id": "api_design_patterns",
            "title": "RESTful API Design Patterns",
            "description": "Comprehensive guide to designing consistent, maintainable REST APIs following our company standards.",
            "content": [
                {
                    "type": "resource_link",
                    "uri": "https://company-wiki.internal/api-guidelines",
                    "name": "Company API Guidelines",
                    "mimeType": "text/html",
                    "description": "Internal API design standards and examples"
                }
            ]
        }
    ],
    "resources": [
        {
            "id": "project_templates",
            "title": "Project Template Library", 
            "description": "Ready-to-use project templates for common application types",
            "uri": "file://templates/",
            "mimeType": "application/json"
        }
    ],
    "prompts": [
        {
            "id": "code_review_checklist",
            "title": "Code Review Checklist Generator",
            "description": "Generates a customized code review checklist based on the technology stack and project type.",
            "messages": [
                {
                    "role": "user",
                    "content": {
                        "type": "text",
                        "text": "Create a comprehensive code review checklist for this project. Include:\n\n1. Technology-specific best practices\n2. Security considerations\n3. Performance optimizations\n4. Code quality standards\n\nFirst, call the relevant coding standards tools to understand our guidelines."
                    }
                }
            ]
        }
    ],
    "custom_tools": [],
    "custom_resources": [],
    "custom_prompts": []
}
```

### 🛠️ Feature Types Explained

#### Tools
**Purpose**: Provide actionable guidance and instructions  
**When to use**: Code generation, standards enforcement, step-by-step guides  
**Example**: Coding standards, deployment checklists, troubleshooting guides

#### Resources  
**Purpose**: Reference static documentation and materials  
**When to use**: API docs, architecture diagrams, external links  
**Example**: Company wikis, external documentation, file repositories

#### Prompts
**Purpose**: Template conversations for common tasks  
**When to use**: Standardized workflows, guided interactions  
**Example**: Code review flows, project setup wizards, debugging sessions

---

## 3️⃣ Content Types & Advanced Configuration for Tools

### Content Type Reference

| Content Type | Use Case | Example | Best For |
|--------------|----------|---------|----------|
| `file` | External documentation | `{"type": "file", "path": "guides/setup.md"}` | Long-form content, reusable docs |
| `text` | Inline instructions | `{"type": "text", "text": "Follow these steps..."}` | Quick rules, short guidelines |  
| `resource_link` | External references | `{"type": "resource_link", "uri": "https://..."}` | APIs, external docs, tools |

### File Content Configuration

Reference external markdown or text files for comprehensive documentation:

```json
{
    "type": "file",
    "path": "standards/typescript-best-practices.md"
}
```

**Path Resolution**: Relative to your knowledge base directory (`--kb-path`)

### Text Content Configuration  

Embed instructions directly in the feature file:

```json
{
    "type": "text", 
    "text": "## Code Review Checklist\n\n✅ All functions have JSDoc comments\n✅ Unit tests cover edge cases\n✅ No hardcoded secrets or URLs"
}
```

**Best For**: Quick reference, checklists, short rules

### Resource Link Configuration

Link to external resources without embedding content:

```json
{
    "type": "resource_link",
    "uri": "https://company.atlassian.net/wiki/spaces/ENG/pages/123/API+Standards",
    "name": "Company API Standards",
    "mimeType": "text/html",
    "description": "Complete API design guidelines with examples and validation rules"
}
```

**Properties**:
- `uri` (required): Full URL or file path
- `name` (optional): Human-readable name  
- `mimeType` (optional): Content type hint
- `description` (optional): Brief explanation

---

## 4️⃣ Advanced Features

### Multi-Content Tools

Combine multiple content types for comprehensive guidance:

```json
{
    "id": "comprehensive_testing_guide",
    "title": "Complete Testing Strategy Guide",
    "content": [
        {
            "type": "text",
            "text": "## Testing Overview\n\nOur testing strategy follows the testing pyramid approach."
        },
        {
            "type": "file", 
            "path": "testing/unit-test-patterns.md"
        },
        {
            "type": "resource_link",
            "uri": "https://testing-library.com/docs/",
            "name": "Testing Library Documentation"
        }
    ]
}
```

### Custom TypeScript Extensions

Reference custom implementations for advanced functionality:

```json
{
    "custom_tools": [
        "code_generator",
        "project_analyzer",
        "dependency_checker"
    ]
}
```

**Implementation**: Create corresponding functions in your `custom/tools.ts` file.

---

## 🚀 Deployment & Testing

### Local Testing

```bash
# Start development server
npm run dev

# Or Test specific knowledge base
npx mcp-dev-blueprints --kb-path ./my-knowledge-base --mode http
```

### Production Deployment

For produciton deployment check the [Build For Production Documentation](./BUILD_FOR_PRODUCTION.md)

### Configuration Validation

The server automatically validates your configuration on startup:

- ✅ **JSON Schema Validation**: Ensures proper structure
- ✅ **File Path Verification**: Checks all referenced files exist
- ✅ **ID Uniqueness**: Prevents duplicate tool/resource IDs
- ✅ **Content Loading**: Validates all content is accessible

---

## 📚 Configuration Examples

### Starter Template

```json
{
    "tools": [
        {
            "id": "welcome_guide", 
            "title": "Getting Started Guide",
            "description": "Essential information for new team members",
            "content": [{"type": "file", "path": "onboarding/welcome.md"}]
        }
    ],
    "resources": [
        {
            "id": "team_contacts",
            "title": "Team Directory", 
            "description": "Contact information and team structure",
            "uri": "file://contacts/team-directory.json",
            "mimeType": "application/json"
        }
    ],
    "prompts": [],
    "custom_tools": [],
    "custom_resources": [],
    "custom_prompts": []
}
```

### Enterprise Example

See our [example knowledge base](../dev/knowledge_base/) for a complete enterprise setup with:
- Multiple servers for different domains
- Comprehensive tool libraries
- Custom TypeScript extensions
- Structured content organization

---

## 🎯 Best Practices

### 📁 Organization Strategy

```
knowledge_base/
├── servers.json
├── frontend/           # Domain-based grouping
│   ├── react-standards.json
│   └── content/
├── backend/ 
│   ├── api-guidelines.json
│   └── content/
└── shared/
    ├── git-workflows.json
    └── content/
```

### ✍️ Content Guidelines

- **Be Specific**: "Use `useState` for local state" vs. "Use React hooks"
- **Include Examples**: Show code snippets and real implementations  
- **Keep Current**: Regular reviews and updates
- **Test Thoroughly**: Validate all tools work as expected

### 🔧 Tool Design Principles

1. **Single Purpose**: Each tool should solve one specific problem
2. **Clear Triggers**: Description should specify exactly when to use the tool
3. **Actionable Content**: Provide concrete steps, not general advice
4. **Consistent Naming**: Use descriptive IDs that indicate functionality

### 🔄 Maintenance Workflow  

1. **Version Control**: Track all configuration changes
2. **Staging Environment**: Test changes before production
3. **Documentation**: Keep internal docs updated
4. **Monitoring**: Watch for errors and usage patterns
5. **Feedback Loop**: Collect user feedback for improvements

---

## 🆘 Troubleshooting

### Common Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| `File not found` | Incorrect path in content | Check path relative to `--kb-path` |
| `Duplicate tool ID` | Same ID used multiple times | Ensure unique IDs across all features |
| `Server won't start` | JSON syntax error | Validate JSON with online tool |
| `Tool not appearing` | Missing feature file reference | Check `servers.json` features array |

### Debug Commands

```bash
# Validate JSON syntax
cat servers.json | jq .

# Check file permissions
ls -la knowledge_base/

# Verbose server startup
npx mcp-dev-blueprints --kb-path . --mode http --verbose
```

---

**Next Steps**: 
- 📖 [Learn about Tools](TOOLS.md)
- 🎨 [Explore Customization](CUSTOMIZING.md)  
- 🚀 [Deployment Guide](RUNNING.md)
