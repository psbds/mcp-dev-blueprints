# Feature Files Reference

**Organize and structure your AI tools with powerful feature file configurations.**

Feature files are JSON configuration files that define collections of tools, resources, and prompts. They act as the organizational layer between your server registry (`servers.json`) and the actual content that AI clients consume.

## 🎯 What Are Feature Files?

Feature files group related functionality into logical units:

- **Domain Organization**: Group by technology, team, or project area
- **Functionality Collections**: Related tools, resources, and prompts together  
- **Modular Architecture**: Mix and match features across different servers
- **Scalable Structure**: From simple setups to complex enterprise knowledge bases

### Feature File Ecosystem

```
📁 knowledge_base/
├── 📄 servers.json                    # Server registry
├── 📁 frontend/                       # Domain grouping
│   ├── 📄 react-tools.json          # Feature file
│   ├── 📄 css-standards.json        # Another feature file
│   └── 📁 content/                   # Referenced content
│       ├── 📄 component-guide.md
│       └── 📄 testing-patterns.md
├── 📁 backend/
│   ├── 📄 api-guidelines.json
│   └── 📄 database-patterns.json
└── 📁 devops/
    └── 📄 deployment-tools.json
```

---

## 📋 Feature File Schema

### Complete Structure

Every feature file follows this JSON schema:

```json
{
    "tools": [
        // Interactive guidance and instructions
    ],
    "resources": [  
        // Static documentation and references
    ],
    "prompts": [
        // Conversation templates and wizards
    ],
    "custom_tools": [
        // References to TypeScript implementations
    ],
    "custom_resources": [
        // Custom TypeScript resource providers  
    ],
    "custom_prompts": [
        // Custom TypeScript prompt generators
    ]
}
```

### Section Purposes

| Section | Purpose | Content Type | Best For |
|---------|---------|--------------|----------|
| `tools` | Actionable guidance | Instructions, checklists | Code standards, troubleshooting |
| `resources` | Static references | Documentation, specifications | API docs, architecture diagrams |
| `prompts` | Conversation templates | Pre-built interactions | Workflows, wizards |
| `custom_*` | Advanced functionality | TypeScript extensions | Dynamic content, integrations |

---

## 🛠️ Tools Section

**Purpose**: Provide step-by-step guidance and actionable instructions.

### Tool Object Schema

```json
{
    "id": "unique_identifier",
    "title": "Human-Readable Tool Name",
    "description": "When to use this tool and what it provides...",
    "content": [
        {
            "type": "text|file|resource_link",
            // Content-specific properties
        }
    ]
}
```

### Real-World Tools Example

```json
{
    "tools": [
        {
            "id": "react_component_checklist",
            "title": "React Component Development Checklist",
            "description": "Essential checklist for creating maintainable React components. Use before starting new components, during development, or in code reviews to ensure consistency and best practices.",
            "content": [
                {
                    "type": "text",
                    "text": "## Component Creation Checklist\n\n✅ **Setup**\n- [ ] Create component file with PascalCase name\n- [ ] Define TypeScript interface for props\n- [ ] Set up corresponding test file\n\n✅ **Implementation**  \n- [ ] Use functional components with hooks\n- [ ] Implement proper prop validation\n- [ ] Add JSDoc comments for public interface\n\n✅ **Testing**\n- [ ] Unit tests for key functionality\n- [ ] Accessibility tests with @testing-library/jest-dom\n- [ ] Visual regression tests if applicable"
                },
                {
                    "type": "file",
                    "path": "react/component-template.tsx"
                }
            ]
        },
        {
            "id": "api_error_handling",
            "title": "API Error Handling Patterns",
            "description": "Standardized patterns for handling API errors consistently across the application. Use when implementing API calls, error boundaries, or user-facing error messages.",
            "content": [
                {
                    "type": "file",
                    "path": "api/error-handling-guide.md"
                },
                {
                    "type": "resource_link",
                    "uri": "https://company-wiki.internal/api-standards#errors",
                    "name": "Company API Error Standards"
                }
            ]
        }
    ]
}
```

### Tools Best Practices

- **Specific Purpose**: Each tool should solve one clear problem
- **Actionable Content**: Provide concrete steps, not general advice
- **Clear Triggers**: Description should specify exactly when to use the tool  
- **Complete Coverage**: Include all necessary information in one place

---

## 📚 Resources Section

**Purpose**: Reference static documentation, specifications, and external materials.

### Resource Object Schema

```json
{
    "id": "unique_identifier", 
    "title": "Resource Display Name",
    "description": "What this resource contains and when to reference it",
    "uri": "file://path/to/resource or https://external-url",
    "mimeType": "text/markdown|application/json|text/html|etc"
}
```

### Resources Examples

```json
{
    "resources": [
        {
            "id": "api_specification", 
            "title": "User Management API Specification",
            "description": "Complete OpenAPI specification for user management endpoints including authentication, CRUD operations, and admin functions",
            "uri": "file://specs/user-api.yaml",
            "mimeType": "application/yaml"
        },
        {
            "id": "architecture_diagrams",
            "title": "System Architecture Diagrams", 
            "description": "Visual representations of our microservices architecture, data flow, and deployment topology",
            "uri": "https://company.atlassian.net/wiki/spaces/ARCH/pages/123456/Diagrams",
            "mimeType": "text/html"
        },
        {
            "id": "style_guide",
            "title": "UI Component Style Guide",
            "description": "Figma-based component library with usage guidelines, color palettes, and typography standards", 
            "uri": "https://figma.com/file/ABC123/Component-Library",
            "mimeType": "application/json"
        }
    ]
}
```

### Resource URI Types

| URI Type | Example | Use Case |
|----------|---------|----------|
| **File Path** | `file://docs/api-spec.yaml` | Internal documentation |
| **HTTP URL** | `https://api-docs.company.com` | External documentation |
| **Company Wiki** | `https://company.atlassian.net/wiki/...` | Internal knowledge base |
| **Design Tools** | `https://figma.com/file/...` | Design specifications |

---

## 💬 Prompts Section

**Purpose**: Define template conversations and guided workflows.

### Prompt Object Schema

```json
{
    "id": "unique_identifier",
    "title": "Prompt Display Name", 
    "description": "What this prompt helps accomplish",
    "messages": [
        {
            "role": "user|assistant|system",
            "content": {
                "type": "text",
                "text": "Prompt content..."
            }
        }
    ]
}
```

### Prompts Examples

```json
{
    "prompts": [
        {
            "id": "code_review_session",
            "title": "Guided Code Review Session",
            "description": "Step-by-step code review process with quality checkpoints and communication guidelines",
            "messages": [
                {
                    "role": "user",
                    "content": {
                        "type": "text", 
                        "text": "I need to conduct a thorough code review. Please guide me through our standard process:\n\n1. First, use the 'code_review_checklist' tool to understand our review criteria\n2. Then help me analyze the code changes systematically\n3. Finally, assist me in writing constructive feedback\n\nThe pull request I'm reviewing involves: [DESCRIBE THE CHANGES HERE]"
                    }
                }
            ]
        },
        {
            "id": "new_project_setup",
            "title": "New Project Setup Wizard",
            "description": "Guided workflow for setting up new projects with all necessary tooling, standards, and configurations",
            "messages": [
                {
                    "role": "user",
                    "content": {
                        "type": "text",
                        "text": "I'm starting a new project and need to set it up according to our company standards. Please help me through the setup process:\n\n**Project Details:**\n- Project type: [Frontend/Backend/Full-stack]\n- Technology stack: [React/Node.js/etc.]\n- Target deployment: [Cloud/On-premise]\n\nPlease guide me through:\n1. Project structure setup\n2. Development environment configuration  \n3. CI/CD pipeline setup\n4. Testing framework installation\n5. Code quality tools configuration\n\nFirst, use our relevant setup tools to understand the current standards."
                    }
                }
            ]
        }
    ]
}
```

### Prompt Design Patterns

#### Workflow Orchestration
```json
{
    "role": "user",
    "content": {
        "type": "text",
        "text": "Execute this multi-step workflow:\n\n1. FIRST: Use 'standards_tool' to understand requirements\n2. THEN: Analyze the current situation\n3. FINALLY: Provide recommendations based on our standards\n\nContext: [USER PROVIDES CONTEXT]"
    }
}
```

#### Template with Variables
```json
{
    "role": "user", 
    "content": {
        "type": "text",
        "text": "Help me create a {{COMPONENT_TYPE}} component for {{PROJECT_NAME}}.\n\n**Requirements:**\n- Technology: {{TECH_STACK}}\n- Use cases: {{USE_CASES}}\n- Performance needs: {{PERFORMANCE_REQUIREMENTS}}\n\nFirst, reference our component standards, then guide me through the implementation."
    }
}
```

---

## 🔧 Custom Extensions

For advanced functionality beyond static content, reference TypeScript implementations.

### Custom Tools

```json
{
    "custom_tools": [
        "dependency_analyzer",      // Analyzes package.json dependencies
        "code_complexity_checker",  // Calculates cyclomatic complexity  
        "security_scanner"          // Scans for security vulnerabilities
    ]
}
```

### Custom Resources

```json
{
    "custom_resources": [
        "live_api_docs",           // Dynamically generated API documentation
        "deployment_status",       // Real-time deployment information
        "test_coverage_reports"    // Live test coverage data
    ]
}
```

### Custom Prompts

```json
{
    "custom_prompts": [
        "smart_code_reviewer",     // Context-aware code review prompts
        "project_template_generator", // Dynamic project setup based on requirements
        "troubleshooting_assistant"   // Intelligent diagnostic workflows
    ]
}
```

**Implementation**: Create corresponding functions in your `custom/tools.ts`, `custom/resources.ts`, or `custom/prompts.ts` files.

---

## 🏗️ Organization Strategies

### By Technology Domain

```json
// frontend-react.json
{
    "tools": [
        {"id": "react_patterns", "title": "React Design Patterns"},
        {"id": "component_testing", "title": "Component Testing Guide"}
    ],
    "resources": [
        {"id": "react_docs", "title": "React Documentation"}
    ],
    "prompts": [
        {"id": "component_creator", "title": "Component Creation Wizard"}
    ]
}

// backend-node.json  
{
    "tools": [
        {"id": "api_patterns", "title": "Node.js API Patterns"},
        {"id": "database_design", "title": "Database Design Guide"}
    ]
}
```

### By Development Phase

```json
// planning-phase.json
{
    "tools": [
        {"id": "requirements_analysis", "title": "Requirements Analysis"},
        {"id": "architecture_decisions", "title": "Architecture Decision Records"}
    ],
    "prompts": [
        {"id": "project_planner", "title": "Project Planning Wizard"}
    ]
}

// development-phase.json
{
    "tools": [
        {"id": "coding_standards", "title": "Coding Standards"},
        {"id": "testing_guidelines", "title": "Testing Guidelines"}
    ]
}
```

### By Team or Product

```json
// mobile-team.json
{
    "tools": [
        {"id": "ios_guidelines", "title": "iOS Development Guidelines"},
        {"id": "android_patterns", "title": "Android Design Patterns"}
    ]
}

// platform-team.json
{
    "tools": [
        {"id": "kubernetes_setup", "title": "Kubernetes Configuration"},
        {"id": "monitoring_setup", "title": "Monitoring & Alerting"}
    ]
}
```

---

## 📊 Feature File Best Practices

### File Organization

#### Size Guidelines
- **Small Features**: 1-10 tools per file (quick loading)
- **Medium Features**: 10-25 tools per file (balanced)  
- **Large Features**: 25+ tools (consider splitting)

#### Naming Conventions
```
feature-files/
├── frontend-react-components.json      # Technology + specific area
├── backend-api-design.json            # Clear domain boundaries  
├── devops-kubernetes-deployment.json   # Specific technology focus
└── security-authentication-patterns.json # Cross-cutting concerns
```

### Content Strategy

#### Progressive Disclosure
```json
{
    "tools": [
        {
            "id": "quick_reference",
            "title": "Quick Reference - React Hooks",
            "content": [{"type": "text", "text": "// Immediate reference"}]
        },
        {
            "id": "comprehensive_guide", 
            "title": "Complete React Hooks Guide",
            "content": [{"type": "file", "path": "react/hooks-complete.md"}]
        }
    ]
}
```

#### Content Reusability
```json
// Shared content referenced by multiple tools
{
    "tools": [
        {
            "id": "frontend_testing",
            "content": [{"type": "file", "path": "shared/testing-principles.md"}]
        },
        {
            "id": "backend_testing", 
            "content": [{"type": "file", "path": "shared/testing-principles.md"}]
        }
    ]
}
```

### Validation & Quality

#### Pre-deployment Checklist
- ✅ **JSON Syntax**: All files parse correctly
- ✅ **Required Fields**: All tools have id, title, description, content
- ✅ **Unique IDs**: No duplicate IDs within or across feature files
- ✅ **File References**: All referenced files exist and are readable
- ✅ **External URLs**: Links return valid responses
- ✅ **Content Quality**: Instructions are clear and actionable

#### Automated Validation Script
```bash
#!/bin/bash
# validate-features.sh

for feature_file in knowledge_base/**/*.json; do
    echo "Validating $feature_file..."
    
    # Check JSON syntax
    jq . "$feature_file" >/dev/null || exit 1
    
    # Check required fields
    jq '.tools[]? | select(.id == null or .title == null or .description == null)' "$feature_file" | \
    if read; then
        echo "❌ Missing required fields in $feature_file"
        exit 1
    fi
    
    echo "✅ $feature_file is valid"
done
```

---

## 🎯 Real-World Feature File Examples

### Complete Frontend Feature File

```json
{
    "tools": [
        {
            "id": "react_component_standards",
            "title": "React Component Development Standards",
            "description": "Comprehensive standards for creating maintainable, performant React components following our team conventions.",
            "content": [
                {
                    "type": "text",
                    "text": "## React Component Standards\n\n### Naming Conventions\n- **Components**: PascalCase (e.g., `UserProfile`, `NavigationMenu`)\n- **Files**: Match component name (e.g., `UserProfile.tsx`)\n- **Props interfaces**: `{ComponentName}Props` (e.g., `UserProfileProps`)\n\n### File Structure\n```\ncomponents/\n├── UserProfile/\n│   ├── UserProfile.tsx\n│   ├── UserProfile.test.tsx\n│   ├── UserProfile.stories.tsx\n│   └── index.ts\n```"
                },
                {
                    "type": "file",
                    "path": "frontend/react-component-template.tsx"
                }
            ]
        },
        {
            "id": "css_architecture", 
            "title": "CSS Architecture & Styling Guidelines",
            "description": "Guidelines for maintainable CSS architecture using CSS Modules and design tokens.",
            "content": [
                {
                    "type": "file",
                    "path": "frontend/css-architecture.md"
                }
            ]
        }
    ],
    "resources": [
        {
            "id": "component_library",
            "title": "Design System Component Library", 
            "description": "Storybook documentation for our design system components",
            "uri": "https://storybook.company.com",
            "mimeType": "text/html"
        },
        {
            "id": "typescript_config",
            "title": "TypeScript Configuration Reference",
            "description": "Standard TypeScript configuration for React projects", 
            "uri": "file://frontend/tsconfig.json",
            "mimeType": "application/json"
        }
    ],
    "prompts": [
        {
            "id": "component_creation_wizard",
            "title": "New Component Creation Wizard", 
            "description": "Step-by-step guide for creating new React components following all standards",
            "messages": [
                {
                    "role": "user",
                    "content": {
                        "type": "text",
                        "text": "I need to create a new React component. Please guide me through the process:\n\n1. First, use the 'react_component_standards' tool to review our guidelines\n2. Help me plan the component structure and props interface\n3. Guide me through implementation following our patterns\n4. Assist with writing comprehensive tests\n\n**Component Requirements:**\n- Purpose: [DESCRIBE WHAT THE COMPONENT SHOULD DO]\n- Props needed: [LIST EXPECTED PROPS] \n- Styling approach: [CSS MODULES/STYLED-COMPONENTS/ETC]\n- Accessibility requirements: [ANY SPECIFIC A11Y NEEDS]"
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

---

**Next Steps**:
- 🛠️ [Tools Deep Dive](TOOLS.md) - Master tool creation
- ⚙️ [Configuration Guide](CONFIGURATION.md) - Complete setup reference  
- 🎨 [Customization Guide](CUSTOMIZING.md) - TypeScript extensions