# MCP Dev Blueprints Configuration Guide

This guide explains how to configure MCP Dev Blueprints to create your own knowledge base servers with custom tools, prompts, and resources.

## Overview

MCP Dev Blueprints uses a hierarchical configuration system consisting of:

1. **Server Configuration** (`servers.json`) - Defines available MCP servers and their feature collections
2. **Feature Files** (`*.json`) - Define individual tools, prompts, and resources
3. **Content Files** (optional) - Contain the actual instructions and documentation
4. **Custom Tools** (optional) - TypeScript implementations for advanced functionality

## Server Configuration

### Creating servers.json

The `servers.json` file defines the available MCP servers and their associated features. Create this file in your knowledge base directory:

```json
[
    {
        "name": "mcp-dev-blueprints",
        "path": "mcp-dev-blueprints",
        "features": [
            "azure/azure_features.json",
            "tests/test_features.json",
            "mcp_blueprints_docs/mcp_blueprints_docs.json"
        ]
    }
]
```
*Note*: Feature files path should follow the path relative to the `servers.json` file

### Server Configuration Properties

| Property | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `name` | string | Yes | Unique identifier for the server | `"mcp-dev-blueprints"` |
| `path` | string | Yes | Server path identifier (used for routing) | `"mcp-dev-blueprints"` |
| `features` | array | Yes | List of feature file paths relative to the knowledge base directory | `["mcp_blueprints_docs/mcp_blueprints_docs.json"]` |

## Feature Files

Feature files define the tools, prompts, and resources available in each server.

For more information on Feature Files take a look at [Features.md](/docs/FEATURES.md)

### Example

```json
{
    "tools": [
        {
            "id": "unit_test_instructions",
            "title": "Unit Test Creation Guidelines & Best Practices for TypeScript (.ts) and Javascript (.js) Projects",
            "description": "Always use this tool before creating unit tests in TypeScript (.ts) and Javascript (.js) projects. It provides essential guidelines and best practices, covering naming conventions, testing frameworks, directory structure, the AAA pattern, and project-specific conventions. Use this tool when you need to: Create unit tests, Write unit tests, Add tests for a file/module, Generate test cases for TypeScript (.ts) and Javascript (.js) code, Write test functions or test suites, Follow best practices for unit testing in TypeScript (.ts) and Javascript (.js). This tool will help ensure consistent test quality and project structure across all unit tests.",
            "content": [
                {
                    "type": "file",
                    "path": "tests/unit_test_instructions.prompt"
                }
            ]
        }
    ],
    "resources": [],
    "prompts": [
        {
            "id": "create_unit_tests",
            "title": "Create Unit Tests",
            "description": "Generates unit tests following best practices and guidelines. Always use the unit_test_instructions tool before generating code.",
            "messages": [
                {
                    "role": "user",
                    "content": {
                        "type": "text",
                        "text": "You must create unit tests for a TypeScript (.ts) or Javascript (.js) project. MANDATORY STEPS:\n\n1. FIRST: Call the 'unit_test_instructions' tool to understand the unit test creation guidelines and best practices"
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

## Tools Configuration

Tools provide instructions and guidelines to users. They can reference external files or contain inline content.

For more information on Feature Files take a look at [Features.md](/docs/FEATURES.md)

### Example
```json
{
    "id": "unit_test_instructions",
    "title": "Unit Test Creation Guidelines & Best Practices for TypeScript (.ts) and Javascript (.js) Projects",
    "description": "Always use this tool before creating unit tests in TypeScript (.ts) and Javascript (.js) projects. It provides essential guidelines and best practices, covering naming conventions, testing frameworks, directory structure, the AAA pattern, and project-specific conventions. Use this tool when you need to: Create unit tests, Write unit tests, Add tests for a file/module, Generate test cases for TypeScript (.ts) and Javascript (.js) code, Write test functions or test suites, Follow best practices for unit testing in TypeScript (.ts) and Javascript (.js). This tool will help ensure consistent test quality and project structure across all unit tests.",
    "content": [
        {
            "type": "file",
            "path": "tests/unit_test_instructions.prompt"
        }
    ]
}
```


## Resources Configuration

Resources provide static documentation and reference materials.

For more information on Feature Files take a look at [Resources.md](/docs/RESOURCES.md)

### Example
```json
{
    "id": "resource_identifier",
    "title": "Resource Title",
    "description": "Resource description",
    "uri": "file://path/to/resource.md",
    "mimeType": "text/markdown"
}
```

## Prompts Configuration

Prompts define interactive templates for common development tasks.

For more information on Feature Files take a look at [Prompts.md](/docs/PROMPTS.md)

### Example
```json
{
    "id": "create_unit_tests",
    "title": "Create Unit Tests",
    "description": "Generates unit tests following best practices and guidelines. Always use the unit_test_instructions tool before generating code.",
    "messages": [
        {
            "role": "user",
            "content": {
                "type": "text",
                "text": "You must create unit tests for a TypeScript (.ts) or Javascript (.js) project. MANDATORY STEPS:\n\n1. FIRST: Call the 'unit_test_instructions' tool to understand the unit test creation guidelines and best practices"
            }
        }
    ]
}
```

## Custom Tools, Resources and Prompts

You can bring your own TypeScript implementations that provide advanced functionality beyond static content. For more information take a look at [Customizing.md](/docs/CUSTOMIZING.md)

## Running Your Configuration

Once your configuration is complete, run the MCP server with:

```bash
npm run dev -- --kb-path ./dev/knowledge_base
```

The server will:
1. Load `servers.json` to discover available servers
2. Parse each feature file to register tools, prompts, and resources
3. Load custom tools from the TypeScript implementations
4. Start the MCP server with all configured functionality

## Best Practices

### File Organization
- Group related features in subdirectories
- Use descriptive file and directory names
- Keep instruction files close to their definitions
- Use consistent naming conventions

### Content Writing
- Write clear, actionable instructions
- Include examples and code snippets
- Specify when and how to use each tool
- Keep content up-to-date with project standards

### Tool Design
- Make tool purposes specific and focused
- Include comprehensive descriptions
- Use descriptive IDs that indicate functionality
- Test tools thoroughly before deployment

### Maintenance
- Regularly review and update content files
- Version control your knowledge base
- Document changes and updates
- Test configuration changes before deployment
