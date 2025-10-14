# Resources Reference Guide

**Organize and share your organization's documentation, specifications, and reference materials through MCP Resources.**

Resources in MCP Dev Blueprints provide static reference materials that developers can access on-demand. Unlike tools (which provide guidance) or prompts (which start conversations), resources are pure information - documentation, specifications, diagrams, and external references that support development work.

## 🎯 What Are MCP Resources?

Resources are static information providers that:
- **Centralize Documentation** - Single access point for all reference materials
- **Link External Systems** - Connect to wikis, specs, and external tools
- **Organize Knowledge** - Structure information for easy discovery
- **Maintain Currency** - Keep references up-to-date and accessible
- **Support Workflows** - Provide context for tools and prompts

### Resource vs. Tool vs. Prompt

| Type | Purpose | Content Nature | Example |
|------|---------|----------------|---------|
| **Resource** | Reference lookup | Static information | "API Specification", "Architecture Diagram" |
| **Tool** | Actionable guidance | Instructions & processes | "Code Review Checklist", "Deployment Guide" |
| **Prompt** | Workflow initiation | Interactive templates | "New Project Wizard", "Incident Response" |

---

## 📋 Resource Structure & Schema

### Basic Resource Schema

```json
{
    "id": "unique_resource_identifier",
    "title": "Human-Readable Resource Name",
    "description": "What this resource contains and when to reference it",
    "uri": "file://path/to/file or https://external-url",
    "mimeType": "text/markdown|application/json|text/html|etc"
}
```

### Property Reference

| Property | Type | Required | Purpose | Example |
|----------|------|----------|---------|---------|
| `id` | string | ✅ | Unique identifier | `"api_specification_v2"` |
| `title` | string | ✅ | Display name | `"User Management API v2.0"` |
| `description` | string | ✅ | Content summary & usage context | `"Complete OpenAPI spec for user CRUD operations"` |
| `uri` | string | ✅ | Location of the resource | `"file://specs/user-api.yaml"` |
| `mimeType` | string | ❌ | Content type hint | `"application/yaml"` |

### Complete Resource Example

```json
{
    "id": "complete_api_specification",
    "title": "Complete API Specification - User Management v2.1",
    "description": "Comprehensive OpenAPI 3.0 specification for the User Management service including authentication, CRUD operations, admin functions, and rate limiting. Updated with latest security requirements and includes example requests/responses for all endpoints.",
    "uri": "file://specifications/user-management-api-v2.1.yaml",
    "mimeType": "application/yaml"
}
```

---

## 🗂️ Resource Types & Patterns

### Pattern 1: API Documentation Resources

Perfect for organizing API specifications and related documentation.

```json
{
    "resources": [
        {
            "id": "user_api_specification",
            "title": "User Management API v2.1 - OpenAPI Specification",
            "description": "Complete API specification for user management including authentication, CRUD operations, permissions, and admin functions. Includes request/response examples and error handling.",
            "uri": "file://apis/user-management-v2.1.yaml",
            "mimeType": "application/yaml"
        },
        {
            "id": "user_api_examples", 
            "title": "User API Usage Examples & Tutorials",
            "description": "Practical examples of API usage including authentication flows, common operations, and integration patterns with code samples in multiple languages.",
            "uri": "file://examples/user-api-examples.md",
            "mimeType": "text/markdown"
        },
        {
            "id": "user_api_postman_collection",
            "title": "User API Postman Collection",
            "description": "Ready-to-use Postman collection for testing and exploring the User Management API with pre-configured authentication and example payloads.",
            "uri": "file://collections/user-api.postman_collection.json", 
            "mimeType": "application/json"
        },
        {
            "id": "user_api_interactive_docs",
            "title": "Interactive API Documentation",
            "description": "Swagger UI interface for exploring and testing the User Management API directly in the browser.",
            "uri": "https://api-docs.company.com/user-management",
            "mimeType": "text/html"
        }
    ]
}
```

### Pattern 2: Architecture & Design Resources

Documentation for system design, architecture decisions, and technical specifications.

```json
{
    "resources": [
        {
            "id": "system_architecture_overview",
            "title": "System Architecture Overview Diagram",
            "description": "High-level architecture diagram showing service relationships, data flows, and deployment topology for the entire platform.",
            "uri": "file://architecture/system-overview.svg",
            "mimeType": "image/svg+xml"
        },
        {
            "id": "microservices_catalog",
            "title": "Microservices Catalog & Dependencies",
            "description": "Complete catalog of all microservices including ownership, dependencies, SLAs, and communication patterns.",
            "uri": "https://company.atlassian.net/wiki/spaces/ARCH/pages/123456/Services",
            "mimeType": "text/html"
        },
        {
            "id": "database_schema_documentation",
            "title": "Database Schema Documentation",
            "description": "Entity relationship diagrams and schema documentation for all application databases with migration history and planned changes.",
            "uri": "file://database/schema-docs/",
            "mimeType": "text/html"
        },
        {
            "id": "architecture_decision_records",
            "title": "Architecture Decision Records (ADRs)",
            "description": "Historical record of architectural decisions including context, options considered, and rationale for choices made.",
            "uri": "file://adr/",
            "mimeType": "text/markdown"
        }
    ]
}
```

### Pattern 3: Process & Standards Resources

Documentation for team processes, coding standards, and operational procedures.

```json
{
    "resources": [
        {
            "id": "coding_standards_documentation",
            "title": "Comprehensive Coding Standards Guide", 
            "description": "Complete coding standards covering TypeScript, React, Node.js, and Python with examples, anti-patterns, and ESLint configurations.",
            "uri": "file://standards/coding-standards.md",
            "mimeType": "text/markdown"
        },
        {
            "id": "git_workflow_documentation",
            "title": "Git Workflow & Branching Strategy",
            "description": "Git workflow documentation including branching strategy, commit conventions, pull request process, and release procedures.",
            "uri": "file://processes/git-workflow.md", 
            "mimeType": "text/markdown"
        },
        {
            "id": "testing_strategy_guide",
            "title": "Testing Strategy & Best Practices",
            "description": "Comprehensive testing guide covering unit testing, integration testing, e2e testing, and performance testing with frameworks and examples.",
            "uri": "file://testing/testing-strategy.md",
            "mimeType": "text/markdown"
        },
        {
            "id": "deployment_runbooks",
            "title": "Deployment Runbooks & Procedures", 
            "description": "Step-by-step deployment procedures for different environments including rollback procedures and troubleshooting guides.",
            "uri": "file://operations/deployment-runbooks/",
            "mimeType": "text/html"
        }
    ]
}
```

### Pattern 4: External Integration Resources

Links to external tools, dashboards, and third-party documentation.

```json
{
    "resources": [
        {
            "id": "monitoring_dashboards",
            "title": "Production Monitoring Dashboards",
            "description": "Grafana dashboards for monitoring application performance, infrastructure health, and business metrics.",
            "uri": "https://grafana.company.com/dashboards",
            "mimeType": "text/html"
        },
        {
            "id": "error_tracking_console", 
            "title": "Error Tracking & Alerting Console",
            "description": "Sentry dashboard for tracking application errors, performance issues, and alert management.",
            "uri": "https://sentry.company.com/organizations/company/",
            "mimeType": "text/html"
        },
        {
            "id": "ci_cd_pipeline_status",
            "title": "CI/CD Pipeline Status & Build History",
            "description": "Jenkins/GitHub Actions dashboard showing build status, deployment history, and pipeline health.",
            "uri": "https://ci.company.com/pipelines",
            "mimeType": "text/html"
        },
        {
            "id": "third_party_api_docs",
            "title": "Third-Party API Documentation",
            "description": "Collection of external API documentation for services we integrate with including authentication and rate limiting details.",
            "uri": "https://company.atlassian.net/wiki/spaces/INT/pages/789012/External-APIs",
            "mimeType": "text/html"
        }
    ]
}
```

---

## 🔗 URI Types & Best Practices

### File URI Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Single File** | Specific document | `file://docs/api-guide.md` |
| **Directory** | Document collection | `file://specs/` |
| **Nested Path** | Organized structure | `file://team-docs/frontend/components.md` |

### HTTP/HTTPS URI Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Internal Wiki** | Company documentation | `https://company.atlassian.net/wiki/...` |
| **External Docs** | Third-party documentation | `https://react.dev/reference` |
| **Dashboards** | Monitoring & analytics | `https://grafana.company.com/d/...` |
| **Tools** | Development tools | `https://storybook.company.com` |

### MIME Type Reference

| MIME Type | File Extension | Use Case |
|-----------|----------------|----------|
| `text/markdown` | `.md` | Documentation, guides |
| `text/html` | `.html` | Web pages, dashboards |
| `application/json` | `.json` | Configuration, data |
| `application/yaml` | `.yaml`, `.yml` | API specs, config |
| `image/svg+xml` | `.svg` | Diagrams, icons |
| `application/pdf` | `.pdf` | Formal documentation |

---

## 📁 Resource Organization Strategies

### By Domain & Technology

```json
{
    "resources": [
        // Frontend Resources
        {
            "id": "react_component_library",
            "title": "React Component Library - Storybook",
            "uri": "https://storybook.company.com"
        },
        {
            "id": "design_system_figma",
            "title": "Design System - Figma Components",
            "uri": "https://figma.com/file/ABC123/Design-System"
        },
        
        // Backend Resources  
        {
            "id": "database_schema_docs",
            "title": "Database Schema Documentation",
            "uri": "file://backend/database/schema-docs.html"
        },
        {
            "id": "microservices_api_catalog",
            "title": "Microservices API Catalog", 
            "uri": "https://api-catalog.company.com"
        },
        
        // DevOps Resources
        {
            "id": "kubernetes_cluster_docs",
            "title": "Kubernetes Cluster Configuration",
            "uri": "file://devops/kubernetes/cluster-setup.md"
        },
        {
            "id": "terraform_infrastructure_docs",
            "title": "Infrastructure as Code Documentation",
            "uri": "file://infrastructure/terraform/README.md"
        }
    ]
}
```

### By Development Phase

```json
{
    "resources": [
        // Planning Phase
        {
            "id": "requirements_template",
            "title": "Technical Requirements Template",
            "uri": "file://templates/requirements-template.md"
        },
        {
            "id": "architecture_decision_template",
            "title": "Architecture Decision Record Template",
            "uri": "file://templates/adr-template.md"
        },
        
        // Development Phase
        {
            "id": "code_review_guidelines",
            "title": "Code Review Guidelines & Checklist",
            "uri": "file://processes/code-review-guide.md"
        },
        {
            "id": "testing_best_practices",
            "title": "Testing Best Practices Guide",
            "uri": "file://testing/best-practices.md"
        },
        
        // Deployment Phase
        {
            "id": "deployment_checklist",
            "title": "Production Deployment Checklist",
            "uri": "file://operations/deployment-checklist.md"
        },
        {
            "id": "monitoring_setup_guide",
            "title": "Application Monitoring Setup Guide", 
            "uri": "file://monitoring/setup-guide.md"
        }
    ]
}
```

### By Audience & Role

```json
{
    "resources": [
        // New Developer Resources
        {
            "id": "onboarding_checklist",
            "title": "New Developer Onboarding Checklist",
            "uri": "file://onboarding/developer-checklist.md"
        },
        {
            "id": "development_environment_setup",
            "title": "Development Environment Setup Guide",
            "uri": "file://setup/dev-environment.md"
        },
        
        // Senior Developer Resources
        {
            "id": "architecture_guidelines",
            "title": "System Architecture Guidelines",
            "uri": "file://architecture/guidelines.md"
        },
        {
            "id": "performance_optimization_guide",
            "title": "Performance Optimization Strategies",
            "uri": "file://performance/optimization-guide.md"
        },
        
        // Team Lead Resources
        {
            "id": "project_planning_templates",
            "title": "Project Planning Templates & Tools",
            "uri": "file://management/project-templates/"
        },
        {
            "id": "team_performance_metrics",
            "title": "Team Performance Metrics Dashboard",
            "uri": "https://analytics.company.com/teams"
        }
    ]
}
```

---

## 🔄 Dynamic Resource Management

### Version Control Integration

```json
{
    "resources": [
        {
            "id": "api_specification_current",
            "title": "API Specification (Current Version)",
            "description": "Always points to the latest approved API specification",
            "uri": "file://specs/current/api-spec.yaml",
            "mimeType": "application/yaml"
        },
        {
            "id": "api_specification_v1",
            "title": "API Specification v1.0 (Legacy)",
            "description": "Legacy API specification for backward compatibility reference",
            "uri": "file://specs/v1.0/api-spec.yaml", 
            "mimeType": "application/yaml"
        },
        {
            "id": "api_changelog",
            "title": "API Changelog & Migration Guide",
            "description": "Version history and migration guidance between API versions",
            "uri": "file://specs/CHANGELOG.md",
            "mimeType": "text/markdown"
        }
    ]
}
```

### Environment-Specific Resources

```json
{
    "resources": [
        {
            "id": "development_environment_config",
            "title": "Development Environment Configuration",
            "description": "Configuration values and setup for local development environment",
            "uri": "file://config/development.json",
            "mimeType": "application/json"
        },
        {
            "id": "staging_environment_status", 
            "title": "Staging Environment Status Dashboard",
            "description": "Real-time status and health monitoring for staging environment",
            "uri": "https://status.staging.company.com",
            "mimeType": "text/html"
        },
        {
            "id": "production_runbooks",
            "title": "Production Operations Runbooks",
            "description": "Emergency procedures and operational guides for production environment",
            "uri": "file://operations/production/runbooks/",
            "mimeType": "text/html"
        }
    ]
}
```

---

## 🎯 Advanced Resource Patterns

### Resource Collections

Organize related resources into logical collections:

```json
{
    "resources": [
        {
            "id": "frontend_development_kit",
            "title": "Frontend Development Kit - Complete Resources",
            "description": "Comprehensive collection of frontend development resources including component library, style guide, testing framework, and deployment procedures.",
            "uri": "file://frontend/development-kit/",
            "mimeType": "text/html"
        },
        {
            "id": "api_development_suite",
            "title": "API Development Suite - All Resources", 
            "description": "Complete API development resources including specifications, testing tools, documentation templates, and deployment guides.",
            "uri": "file://api/development-suite/",
            "mimeType": "text/html"
        }
    ]
}
```

### Interactive Resource Hubs

Link to interactive tools and environments:

```json
{
    "resources": [
        {
            "id": "interactive_api_explorer",
            "title": "Interactive API Explorer & Testing Environment",
            "description": "Live API testing environment with authentication, request building, and response inspection capabilities.",
            "uri": "https://api-explorer.company.com",
            "mimeType": "text/html"
        },
        {
            "id": "component_playground",
            "title": "Component Playground - Interactive Development",
            "description": "Interactive environment for developing and testing React components with live preview and prop manipulation.",
            "uri": "https://playground.company.com/components",
            "mimeType": "text/html"
        }
    ]
}
```

### Generated Resources

Reference resources that are automatically generated:

```json
{
    "resources": [
        {
            "id": "auto_generated_api_docs",
            "title": "Auto-Generated API Documentation (Latest Build)",
            "description": "Automatically generated API documentation from code comments and annotations, updated with every deployment.",
            "uri": "https://docs.company.com/api/auto-generated",
            "mimeType": "text/html"
        },
        {
            "id": "test_coverage_report",
            "title": "Current Test Coverage Report",
            "description": "Live test coverage report generated from latest CI/CD pipeline execution with detailed coverage metrics.",
            "uri": "https://ci.company.com/coverage/latest",
            "mimeType": "text/html"
        }
    ]
}
```

---

## 🔧 Resource Integration Best Practices

### Linking Resources with Tools

Resources work best when integrated with tools and prompts:

```json
{
    "tools": [
        {
            "id": "api_development_guide",
            "title": "API Development Standards & Process",
            "description": "Complete guide for developing APIs following our standards. References our API specification templates and testing procedures.",
            "content": [
                {
                    "type": "text",
                    "text": "## API Development Process\n\n1. **Design Phase**: Use our API specification template (see 'api_spec_template' resource)\n2. **Implementation**: Follow coding standards (see 'api_coding_standards' resource)\n3. **Testing**: Use our testing framework (see 'api_testing_guide' resource)\n4. **Documentation**: Auto-generate docs (see 'api_doc_generator' resource)"
                }
            ]
        }
    ],
    "resources": [
        {
            "id": "api_spec_template",
            "title": "OpenAPI Specification Template",
            "uri": "file://templates/openapi-template.yaml"
        },
        {
            "id": "api_coding_standards", 
            "title": "API Coding Standards Guide",
            "uri": "file://standards/api-standards.md"
        }
    ]
}
```

## 📊 Resource Discovery & Search

### Tagging Strategy

While not part of the core schema, you can use descriptions for searchability:

```json
{
    "id": "react_testing_guide",
    "title": "React Component Testing Guide",
    "description": "Comprehensive guide for testing React components. Tags: #react #testing #frontend #jest #testing-library #unit-tests #integration-tests #component-testing",
    "uri": "file://frontend/react-testing-guide.md"
}
```

### Resource Indexing

Create index resources that link to other resources:

```json
{
    "resources": [
        {
            "id": "master_documentation_index",
            "title": "Master Documentation Index - All Resources",
            "description": "Comprehensive index of all available documentation, specifications, and reference materials organized by category and technology.",
            "uri": "file://indexes/master-index.html",
            "mimeType": "text/html"
        },
        {
            "id": "quick_reference_index",
            "title": "Quick Reference Index - Most Used Resources",
            "description": "Curated list of the most frequently accessed resources for daily development work.",
            "uri": "file://indexes/quick-reference.html", 
            "mimeType": "text/html"
        }
    ]
}
```

---

## 🎯 Complete Resource Example

### Enterprise-Grade Resource Collection

```json
{
    "resources": [
        {
            "id": "enterprise_api_gateway_specification",
            "title": "Enterprise API Gateway - Complete Specification v3.2",
            "description": "Comprehensive OpenAPI 3.0 specification for the enterprise API gateway including all microservice endpoints, authentication flows, rate limiting policies, and monitoring integration. Updated weekly with latest service definitions.",
            "uri": "file://specifications/enterprise-api-gateway-v3.2.yaml",
            "mimeType": "application/yaml"
        },
        {
            "id": "microservices_architecture_blueprint",
            "title": "Microservices Architecture Blueprint & Standards",
            "description": "Complete architectural blueprint for microservices including service design patterns, communication protocols, data management strategies, and deployment patterns. Includes decision trees and implementation templates.",
            "uri": "file://architecture/microservices-blueprint.md",
            "mimeType": "text/markdown"
        },
        {
            "id": "security_compliance_framework",
            "title": "Security & Compliance Framework Documentation",
            "description": "Comprehensive security framework covering SOC2, ISO27001, and GDPR compliance requirements with implementation guides, audit checklists, and automated validation procedures.",
            "uri": "https://security.company.com/compliance-framework",
            "mimeType": "text/html"
        },
        {
            "id": "production_monitoring_suite",
            "title": "Production Monitoring & Observability Suite",
            "description": "Complete monitoring setup including Grafana dashboards, Prometheus alerting rules, distributed tracing configuration, and incident response playbooks.",
            "uri": "https://monitoring.company.com/production-suite",
            "mimeType": "text/html"
        },
        {
            "id": "developer_productivity_metrics",
            "title": "Developer Productivity Metrics & Analytics",
            "description": "Real-time dashboard showing development velocity, code quality metrics, deployment frequency, and team performance indicators with historical trends and benchmarks.",
            "uri": "https://analytics.company.com/developer-productivity", 
            "mimeType": "text/html"
        }
    ]
}
```
