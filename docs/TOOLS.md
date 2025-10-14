# Tools Reference Guide

**Create intelligent AI tools that guide developers through complex tasks with precision and consistency.**

Tools are the heart of MCP Dev Blueprints - they provide actionable guidance, enforce standards, and streamline development workflows. This guide shows you how to create tools that truly enhance developer productivity.

## 🧰 What Are MCP Tools?

Tools are AI-accessible instructions that provide:
- **Actionable Guidance** - Step-by-step instructions for specific tasks
- **Standards Enforcement** - Consistent application of coding standards
- **Knowledge Transfer** - Institutionalized best practices and patterns
- **Context-Aware Help** - Instructions that adapt to the developer's current situation

### Tool vs. Resource vs. Prompt

| Type | Purpose | When to Use | Example |
|------|---------|-------------|---------|
| **Tool** | Provide instructions & guidance | Code reviews, standards, troubleshooting | "TypeScript Best Practices" |
| **Resource** | Reference static information | Documentation, specifications | "API Documentation" |
| **Prompt** | Template conversations | Structured workflows, wizards | "Code Review Checklist Generator" |

---

## 📋 Tool Structure & Schema

### Basic Tool Schema

Every tool follows this JSON structure:

```json
{
    "id": "unique_tool_identifier",
    "title": "Human-Readable Tool Name",
    "description": "Detailed description of when and how to use this tool...", 
    "content": [
        // Array of content objects
    ]
}
```

### Property Reference

| Property | Type | Required | Purpose | Guidelines |
|----------|------|----------|---------|------------|
| `id` | string | ✅ | Unique identifier | Use `snake_case`, descriptive, no spaces |
| `title` | string | ✅ | Display name | Clear, specific, include tech stack if relevant |
| `description` | string | ✅ | Usage guidance | When to use, what it provides, benefits |
| `content` | array | ✅ | Tool instructions | Mix of files, text, and links |

### Example: Complete Tool Definition

```json
{
    "id": "typescript_code_review_guide",
    "title": "TypeScript Code Review Guidelines & Checklist",
    "description": "Comprehensive guide for conducting thorough TypeScript code reviews. Use this tool when reviewing pull requests, onboarding new developers, or establishing code quality standards. Covers type safety, performance patterns, testing requirements, and security considerations specific to TypeScript projects.",
    "content": [
        {
            "type": "text",
            "text": "## Quick Review Checklist\n\n✅ **Type Safety**\n- No `any` types without justification\n- Proper interface definitions\n- Generic constraints where appropriate\n\n✅ **Code Quality** \n- Descriptive variable names\n- Functions under 20 lines\n- Proper error handling"
        },
        {
            "type": "file",
            "path": "code-review/typescript-detailed-guide.md"
        },
        {
            "type": "resource_link",
            "uri": "https://typescript-eslint.io/rules/",
            "name": "TypeScript ESLint Rules Reference",
            "mimeType": "text/html",
            "description": "Complete reference for TypeScript-specific linting rules"
        }
    ]
}
```

---

## 📝 Content Types Deep Dive

### 1️⃣ File Content (`type: "file"`)

**Best For**: Comprehensive documentation, detailed guides, reusable content

```json
{
    "type": "file",
    "path": "guides/react-component-patterns.md"
}
```

**Path Resolution**: Always relative to your knowledge base directory (`--kb-path`)

**Example File Structure**:
```
knowledge_base/
├── servers.json
├── frontend/
│   ├── react-standards.json    # References files below
│   └── guides/
│       ├── component-patterns.md
│       ├── state-management.md
│       └── testing-strategies.md
└── backend/
    └── api-guidelines.json
```

**Best Practices**:
- Use Markdown for formatting
- Include code examples with syntax highlighting
- Structure with clear headings and sections
- Keep files focused on single topics

### 2️⃣ Inline Text Content (`type: "text"`)

**Best For**: Quick rules, checklists, short guidelines that don't warrant separate files

```json
{
    "type": "text",
    "text": "## Git Commit Message Format\n\n```\ntype(scope): subject\n\nbody\n\nfooter\n```\n\n**Types**: feat, fix, docs, style, refactor, test, chore\n**Scope**: Component or file being modified\n**Subject**: Present tense, lowercase, no period"
}
```

**Formatting Tips**:
- Use Markdown formatting for structure
- Include examples and code snippets
- Keep concise but actionable
- Use emojis sparingly for visual organization

### 3️⃣ Resource Links (`type: "resource_link"`)

**Best For**: External documentation, APIs, tools, specifications

```json
{
    "type": "resource_link",
    "uri": "https://react.dev/reference/react/hooks", 
    "name": "React Hooks API Reference",
    "mimeType": "text/html",
    "description": "Complete reference for all React hooks with examples and best practices"
}
```

**Properties Explained**:
- `uri` (required): Full URL or file:// path
- `name` (optional): Human-readable link text
- `mimeType` (optional): Content type hint for clients
- `description` (optional): What developers will find at this link

### 4️⃣ Mixed Content Strategy

Combine multiple content types for comprehensive tools:

```json
{
    "id": "api_design_complete_guide",
    "title": "Complete API Design & Implementation Guide",
    "content": [
        {
            "type": "text",
            "text": "## API Design Principles\n\n1. **RESTful conventions** - Use standard HTTP methods\n2. **Consistent naming** - Follow our naming patterns\n3. **Proper status codes** - Return meaningful HTTP statuses"
        },
        {
            "type": "file", 
            "path": "api/design-patterns.md"
        },
        {
            "type": "file",
            "path": "api/implementation-checklist.md" 
        },
        {
            "type": "resource_link",
            "uri": "https://company-wiki.internal/api-standards",
            "name": "Company API Standards",
            "description": "Internal standards and approval processes"
        },
        {
            "type": "resource_link",
            "uri": "https://swagger.io/specification/",
            "name": "OpenAPI Specification",
            "description": "Official OpenAPI 3.0 specification"
        }
    ]
}
```

---

## 🎯 Tool Design Patterns

### Pattern 1: Standards Enforcement Tool

Perfect for ensuring consistency across codebases.

```json
{
    "id": "react_component_standards",
    "title": "React Component Development Standards",
    "description": "Essential standards for creating maintainable React components. Use before starting new components, during code reviews, or when refactoring existing components. Ensures consistency across the entire codebase.",
    "content": [
        {
            "type": "text",
            "text": "## Component Standards Checklist\n\n✅ **Naming**: PascalCase for components, camelCase for props\n✅ **Structure**: Props interface above component\n✅ **Props**: Use TypeScript interfaces, not inline types\n✅ **Exports**: Default export for main component\n✅ **Testing**: Unit test file with .test.tsx extension"
        },
        {
            "type": "file",
            "path": "react/component-template.md"
        }
    ]
}
```

### Pattern 2: Troubleshooting Guide Tool

Helps developers debug common issues systematically.

```json
{
    "id": "database_connection_troubleshooting",
    "title": "Database Connection Issues - Diagnostic Guide",
    "description": "Step-by-step troubleshooting for database connectivity problems. Use when experiencing connection timeouts, authentication failures, or performance issues with database operations.",
    "content": [
        {
            "type": "text",
            "text": "## Quick Diagnostic Steps\n\n1. **Check connection string** - Verify host, port, credentials\n2. **Test network connectivity** - `telnet db-host 5432`\n3. **Verify permissions** - Check user grants and database access\n4. **Monitor connection pool** - Look for pool exhaustion\n5. **Check logs** - Application and database error logs"
        },
        {
            "type": "file",
            "path": "database/troubleshooting-detailed.md"
        }
    ]
}
```

### Pattern 3: Step-by-Step Process Tool

Guides developers through complex multi-step procedures.

```json
{
    "id": "production_deployment_checklist",
    "title": "Production Deployment Process & Checklist",
    "description": "Complete deployment process for production releases. Use before every production deployment to ensure consistency, safety, and proper rollback procedures.",
    "content": [
        {
            "type": "text",
            "text": "## Pre-Deployment Checklist\n\n🔒 **Security**\n- [ ] No secrets in code\n- [ ] Environment variables updated\n- [ ] SSL certificates valid\n\n🧪 **Testing**\n- [ ] All tests passing\n- [ ] Load testing completed\n- [ ] Security scan passed\n\n📊 **Monitoring**\n- [ ] Alerts configured\n- [ ] Dashboards updated\n- [ ] Rollback plan documented"
        },
        {
            "type": "file",
            "path": "deployment/production-process.md"
        }
    ]
}
```

### Pattern 4: Technology Integration Tool

Helps with specific technology implementations.

```json
{
    "id": "kubernetes_service_setup",
    "title": "Kubernetes Service Configuration Guide", 
    "description": "Complete guide for setting up new services in our Kubernetes cluster. Use when deploying new microservices, updating existing deployments, or troubleshooting service discovery issues.",
    "content": [
        {
            "type": "file",
            "path": "kubernetes/service-template.yaml"
        },
        {
            "type": "file", 
            "path": "kubernetes/deployment-guide.md"
        },
        {
            "type": "resource_link",
            "uri": "https://kubernetes.io/docs/concepts/services-networking/service/",
            "name": "Kubernetes Services Documentation"
        }
    ]
}
```

---

## ✍️ Writing Effective Tool Content

### Content Writing Guidelines

#### 1. **Structure for Scannability**
```markdown
## Overview
Brief description of what this covers.

## Quick Reference
- Key points developers need immediately
- Most common use cases
- Critical "gotchas" to avoid

## Detailed Guidelines
### Section 1: Specific Topic
Detailed explanation with examples.

### Section 2: Another Topic  
More comprehensive coverage.

## Examples
Real-world code examples.

## Troubleshooting
Common issues and solutions.
```

#### 2. **Include Practical Examples**

❌ **Avoid vague guidance**:
```markdown
Use proper error handling in your functions.
```

✅ **Provide specific examples**:
```markdown
## Error Handling Patterns

### API Calls
```typescript
async function fetchUserData(id: string): Promise<User | null> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (error.status === 404) {
      return null; // User not found is expected
    }
    // Log unexpected errors
    logger.error('Failed to fetch user', { id, error: error.message });
    throw new Error('Unable to fetch user data');
  }
}
```

### Database Operations  
```typescript
try {
  await db.transaction(async (tx) => {
    await tx.users.update(id, userData);
    await tx.audit.create(auditLog);
  });
} catch (error) {
  // Handle transaction rollback
  throw new DatabaseError('User update failed', { originalError: error });
}
```
```

#### 3. **Use Action-Oriented Language**

❌ **Passive descriptions**:
```markdown
Code should be written in a way that follows our standards.
```

✅ **Clear directives**:
```markdown
## Action Items
1. **Run the linter** before committing: `npm run lint`
2. **Write unit tests** for all public functions
3. **Update documentation** when changing APIs
4. **Request review** from at least one senior developer
```

### Content Organization Strategies

#### By Technology Stack
```
tools/
├── frontend/
│   ├── react-patterns.json
│   ├── css-standards.json
│   └── testing-frontend.json
├── backend/
│   ├── api-design.json
│   ├── database-patterns.json
│   └── security-guidelines.json
└── devops/
    ├── deployment-processes.json
    └── monitoring-setup.json
```

#### By Development Phase
```
tools/
├── planning/
│   ├── architecture-decisions.json
│   └── technical-requirements.json
├── development/
│   ├── coding-standards.json
│   └── testing-guidelines.json
├── deployment/
│   ├── release-process.json
│   └── rollback-procedures.json
└── maintenance/
    ├── monitoring-setup.json
    └── troubleshooting-guides.json
```

---

## 🔧 Advanced Tool Techniques

### Conditional Content

Use descriptive text to guide when specific sections apply:

```json
{
    "type": "text",
    "text": "## Environment-Specific Configuration\n\n### Development Environment\nUse this configuration for local development:\n```json\n{\"debug\": true, \"logLevel\": \"verbose\"}\n```\n\n### Production Environment\nFor production deployments, use:\n```json\n{\"debug\": false, \"logLevel\": \"error\"}\n```"
}
```

### Tool Chaining

Reference other tools to create workflows:

```json
{
    "type": "text",
    "text": "## Before You Start\n\n1. **First**, use the 'coding_standards' tool to review our guidelines\n2. **Then**, use the 'git_workflow' tool to understand our branching strategy\n3. **Finally**, follow the steps below for component creation"
}
```

### Context-Aware Instructions

Provide guidance based on different scenarios:

```json
{
    "type": "text",
    "text": "## Choose Your Path\n\n### 🆕 Creating a new component?\n- Start with our component template\n- Follow naming conventions\n- Set up proper TypeScript types\n\n### 🔄 Refactoring existing code?\n- Check for breaking changes\n- Update related tests\n- Document API changes\n\n### 🐛 Fixing a bug?\n- Write a failing test first\n- Implement minimal fix\n- Verify fix resolves issue"
}
```

---

## 📊 Tool Performance & Optimization

### Content Loading Strategies

| Strategy | Best For | Implementation |
|----------|----------|----------------|
| **Inline Text** | Quick reference, checklists | Embed directly in JSON |
| **Small Files** | Focused guides (< 10KB) | Single file per topic |
| **Large Documentation** | Comprehensive guides | Split into sections |
| **External Resources** | Living documentation | Use resource links |

### File Size Recommendations

- **Inline Text**: < 2KB (immediate loading)
- **Small Files**: < 50KB (fast loading) 
- **Large Files**: < 500KB (consider splitting)
- **Resource Links**: Any size (lazy loading)

### Caching Strategies

Tools are cached automatically, but you can optimize:

```bash
# Enable longer cache for stable content
export KB_CACHE_TTL=3600  # 1 hour

# Disable cache for development
export KB_CACHE_TTL=0
```

## 🎨 Tool Examples Library

### Complete Example: Code Review Tool

```json
{
    "id": "comprehensive_code_review_guide",
    "title": "Comprehensive Code Review Guide & Checklist",
    "description": "Complete framework for conducting thorough, constructive code reviews. Use this tool for all pull request reviews to ensure consistent quality standards, knowledge sharing, and team alignment. Covers technical aspects, communication guidelines, and follow-up processes.",
    "content": [
        {
            "type": "text",
            "text": "# Code Review Quick Checklist\n\n## 🔍 Technical Review\n\n### Code Quality\n- [ ] **Readability**: Code is self-documenting with clear variable names\n- [ ] **Simplicity**: Solutions are as simple as possible but not simpler\n- [ ] **DRY Principle**: No unnecessary code duplication\n- [ ] **SOLID Principles**: Follows object-oriented design principles\n\n### Functionality  \n- [ ] **Requirements**: Code solves the stated problem completely\n- [ ] **Edge Cases**: Handles boundary conditions and error scenarios\n- [ ] **Performance**: No obvious performance bottlenecks\n- [ ] **Security**: No security vulnerabilities or data exposure\n\n### Testing\n- [ ] **Unit Tests**: All public functions have unit tests\n- [ ] **Test Coverage**: New code maintains coverage thresholds\n- [ ] **Test Quality**: Tests are clear, focused, and reliable\n- [ ] **Integration**: Changes don't break existing functionality\n\n## 💬 Review Communication\n\n### Positive Feedback Framework\n- **Ask questions** rather than making demands\n- **Explain the why** behind suggestions  \n- **Offer alternatives** when requesting changes\n- **Praise good patterns** to reinforce positive behaviors\n\n### Example Comments\n\n✅ **Good**: \"Consider extracting this logic into a separate function for reusability. What do you think about creating a `calculateTotalPrice()` helper?\"\n\n❌ **Avoid**: \"This is wrong. Fix it.\"\n\n✅ **Good**: \"Great use of the builder pattern here! This makes the API much more readable.\"\n\n❌ **Avoid**: \"Looks fine.\""
        },
        {
            "type": "file",
            "path": "code-review/detailed-checklist.md"
        },
        {
            "type": "file",
            "path": "code-review/common-patterns.md"
        },
        {
            "type": "resource_link",
            "uri": "https://github.com/google/eng-practices/blob/master/review/reviewer/",
            "name": "Google Code Review Guidelines",
            "mimeType": "text/html",
            "description": "Industry-standard code review practices from Google Engineering"
        }
    ]
}
```
