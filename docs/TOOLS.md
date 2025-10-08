# MCP Dev Blueprints Documentation

## Creating Tools in JSON Format

This section explains how to create tools in JSON format for the MCP server. Tools are defined as JSON objects that provide specific functionality and instructions to users.

### Tool Structure Overview

A tool is defined as a JSON object with the following required properties:

```json
{
    "id": "string",
    "title": "string", 
    "description": "string",
    "content": [
        // Array of content objects
    ]
}
```

### Required Properties

| Property | Type | Purpose | Format/Requirements | Example | Additional Notes |
|----------|------|---------|-------------------|---------|------------------|
| `id` | string | Unique identifier for the tool | • Use lowercase with underscores (snake_case)<br>• Must be unique across all tools in the system | `"unit_test_instructions"`<br>`"code_generation_enforcer"` | This serves as the tool's internal reference |
| `title` | string | Human-readable name displayed to users | • Title case with descriptive text<br>• Be specific about what the tool does<br>• Include relevant file extensions or technologies<br>• Keep it concise but descriptive | `"Unit Test Creation Guidelines & Best Practices for TypeScript (.ts) and Javascript (.js) Projects"` | This is what users will see in the interface |
| `description` | string | Detailed explanation of when and how to use the tool | • Complete sentences explaining the tool's purpose and usage scenarios<br>• Should include:<br>&nbsp;&nbsp;- When to use this tool (trigger conditions)<br>&nbsp;&nbsp;- What the tool provides<br>&nbsp;&nbsp;- Specific use cases<br>&nbsp;&nbsp;- Benefits of using the tool | See example below | Critical for helping users understand when to use the tool |
| `content` | array | Defines the actual content or instructions provided by the tool | • Array of content objects<br>• Supports three types: `file`, `text`, and `resource_link`<br>• Can mix multiple types in a single tool | `[{"type": "file", "path": "tests/unit_test_instructions.prompt"}]` | Contains the actual tool functionality |

### Content Types

#### File Content Type
References external files containing the tool's instructions or content.

**Properties**:
- `type`: Must be `"file"`
- `path`: Relative path to the instruction file, relative to the path specified in the `--kb-path` argument

**Example**:
```json
"content": [
    {
        "type": "file",
        "path": "tests/unit_test_instructions.prompt"
    }
]
```

**Note**: The `path` is resolved relative to the knowledge base path provided via the `--kb-path` command line argument, not the project root.

#### Text Content Type
Provides inline text content directly within the tool definition.

```json
{
    "type": "text",
    "text": "Your instruction text here"
}
```

**Properties**:
- `type`: Must be `"text"`
- `text`: The actual text content/instructions for the tool

**Example**:
```json
"content": [
    {
        "type": "text",
        "text": "When creating unit tests, always follow the AAA pattern: Arrange, Act, Assert. Use descriptive test names and organize tests in a logical structure."
    }
]
```

**Use Cases**:
- Short instructions that don't warrant a separate file
- Quick guidelines or reminders
- Simple rules or conventions

#### Resource Link Content Type

Tools can return ResourceLink objects to reference resources without embedding their full content. This can be helpful for performance when dealing with large files or many resources - clients can then selectively read only the resources they need using the provided URIs.

**Properties**:
- `type`: Must be `"resource_link"`
- `uri`: The URI/URL of the external resource
- `name`: Human-readable name for the resource
- `mimeType`: (Optional) MIME type of the resource (e.g., `"text/html"`, `"application/pdf"`)
- `description`: (Optional) Brief description of what the resource contains

**Example**:
```json
"content": [
    {
        "type": "resource_link",
        "uri": "https://jestjs.io/docs/getting-started",
        "name": "Jest Getting Started Guide",
        "mimeType": "text/html",
        "description": "Official Jest documentation for setting up and writing tests"
    }
]
```

#### Mixed Content Types
You can combine multiple content types within a single tool:

```json
"content": [
    {
        "type": "text",
        "text": "Follow these guidelines when creating unit tests:"
    },
    {
        "type": "file",
        "path": "tests/unit_test_guidelines.prompt"
    },
    {
        "type": "resource_link",
        "uri": "https://testing-library.com/docs/",
        "name": "Testing Library Documentation",
        "description": "Best practices for testing user interfaces"
    }
]
```