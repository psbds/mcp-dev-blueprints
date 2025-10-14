# Commit Convention & Semantic Release

**Maintain a clean, automated release process with standardized commit messages.**

This project uses [Conventional Commits](https://www.conventionalcommits.org/) specification to enable automated semantic versioning, changelog generation, and NPM publishing through semantic-release.

## 📋 Commit Message Format

### Basic Structure

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Component Breakdown

| Component | Purpose | Required | Example |
|-----------|---------|----------|---------|
| **type** | Categorizes the change | ✅ | `feat`, `fix`, `docs` |
| **scope** | Area of codebase affected | ❌ | `auth`, `api`, `cli` |
| **description** | Brief summary of changes | ✅ | `add user authentication` |
| **body** | Detailed explanation | ❌ | Additional context and reasoning |
| **footer** | Breaking changes, issue refs | ❌ | `BREAKING CHANGE:`, `Closes #123` |

---

## 🏷️ Commit Types

### Release-Triggering Types

| Type | Description | Version Impact | Example |
|------|-------------|----------------|---------|
| `feat` | New feature or capability | **Minor** (1.2.0 → 1.3.0) | `feat(tools): add custom tool loader` |
| `fix` | Bug fix or error resolution | **Patch** (1.2.0 → 1.2.1) | `fix(server): resolve memory leak in HTTP server` |
| `perf` | Performance improvement | **Patch** (1.2.0 → 1.2.1) | `perf(parser): optimize JSON parsing speed` |

### Non-Release Types

| Type | Description | Version Impact | Example |
|------|-------------|----------------|---------|
| `docs` | Documentation changes | **None** | `docs: update API configuration guide` |
| `style` | Code formatting, whitespace | **None** | `style: fix ESLint formatting issues` |
| `refactor` | Code restructuring (no functionality change) | **None** | `refactor: simplify tool loading logic` |
| `test` | Adding or updating tests | **None** | `test: add unit tests for config parser` |
| `chore` | Build process, tooling, dependencies | **None** | `chore(deps): update TypeScript to v5.3` |
| `ci` | CI/CD pipeline changes | **None** | `ci: add automated security scanning` |
| `build` | Build system changes | **None** | `build: optimize production bundle size` |

---

## 💥 Breaking Changes

### Method 1: Exclamation Mark

Add `!` after the type to indicate breaking changes:

```bash
feat!: redesign configuration file format
fix!: remove deprecated API endpoints
```

### Method 2: Footer Declaration  

Include `BREAKING CHANGE:` in the commit footer:

```bash
feat(config): add new server configuration options

BREAKING CHANGE: The server configuration format has changed. 
Update your servers.json files to use the new schema format.
See migration guide: docs/MIGRATION.md
```

### Breaking Change Guidelines

- **Always explain** what changed and why
- **Provide migration path** in the commit body or footer  
- **Reference documentation** for complex migrations
- **Consider deprecation** warnings before breaking changes

---

## 🎯 Scope Guidelines

### Recommended Scopes

| Scope | Description | Example |
|-------|-------------|---------|
| `server` | HTTP/STDIO server functionality | `fix(server): handle malformed JSON requests` |
| `config` | Configuration parsing and management | `feat(config): add environment variable support` |
| `tools` | Tool loading and execution | `feat(tools): support async tool functions` |
| `cli` | Command-line interface | `fix(cli): improve error message clarity` |
| `docs` | Documentation updates | `docs(config): add advanced configuration examples` |
| `tests` | Test-related changes | `test(server): add integration tests` |
| `deps` | Dependency updates | `chore(deps): update express to v4.18.3` |

### Multi-Scope Changes

For changes affecting multiple areas:

```bash
# Option 1: Use most significant scope
feat(server): add custom tool support with configuration parsing

# Option 2: Omit scope for broad changes
feat: add comprehensive custom tool system
```

---

## ✍️ Writing Effective Descriptions

### Description Best Practices

#### ✅ Good Examples
```bash
feat(tools): add support for TypeScript custom tools
fix(server): prevent crash when knowledge base path is invalid  
docs: add comprehensive configuration examples
perf(parser): reduce JSON parsing time by 40%
test(config): add edge case validation tests
```

#### ❌ Examples to Avoid
```bash
# Too vague
fix: bug fix
feat: new feature
update: changes

# Wrong tense
feat: added user authentication  # Should be: add user authentication
fixed: memory leak              # Should be: fix memory leak

# Too long for description line
feat(config): add comprehensive support for advanced configuration options with validation and error handling
```

### Description Guidelines

- **Use imperative mood**: "add" not "added" or "adds"
- **Keep under 50 characters** for the description line
- **Be specific** about what changed
- **Don't include issue numbers** in description (use footer)
- **Start with lowercase** unless it's a proper noun

---

---

## 🔄 Release Process

### Automated Workflow

```mermaid
graph LR
    A[Commit to main] --> B[semantic-release]
    B --> C[Analyze commits]
    C --> D[Determine version]
    D --> E[Generate changelog]
    E --> F[Create GitHub release]
    F --> G[Publish to NPM]
```

### Version Bumping Rules

| Commit Types | Version Change | Example |
|-------------|----------------|---------|
| `fix`, `perf` | Patch: 1.2.3 → 1.2.4 | Bug fixes and performance |
| `feat` | Minor: 1.2.3 → 1.3.0 | New features |
| `feat!`, `BREAKING CHANGE` | Major: 1.2.3 → 2.0.0 | Breaking changes |
| `docs`, `style`, `refactor`, `test`, `chore` | No release | Documentation and maintenance |

### Release Checklist

Before merging to main:

- ✅ **Commit message** follows conventional format
- ✅ **Tests pass** in CI/CD pipeline
- ✅ **Breaking changes** are properly documented  
- ✅ **Version impact** is appropriate for the changes
- ✅ **Documentation** is updated if needed

---

## 📊 Examples by Category

### Feature Development

```bash
# New functionality
feat(tools): add support for nested tool content
feat(server): implement WebSocket transport option
feat(config): add environment variable interpolation

# With breaking changes
feat!: require Node.js 18+ for ES modules support

BREAKING CHANGE: Node.js 16 is no longer supported.
Update to Node.js 20 or higher before upgrading.
```

### Bug Fixes

```bash
# Standard bug fixes
fix(server): prevent memory leak in long-running processes
fix(config): handle missing servers.json gracefully  
fix(tools): resolve race condition in async tool loading

# Critical fixes
fix!: correct security vulnerability in file path handling

BREAKING CHANGE: File paths are now strictly validated.
Remove any "../" paths from your configuration files.
```

### Documentation & Maintenance

```bash
# Documentation
docs: add comprehensive API reference
docs(config): update configuration examples  
docs(tools): add custom tool development guide

# Dependencies and tooling
chore(deps): update semantic-release to v22.0.12
chore: configure automated dependency updates
build: optimize Docker image size by 40%

# Testing
test(server): add integration tests for HTTP transport
test: increase test coverage to 95%
perf(tests): reduce test suite runtime by 30%
```

### Refactoring & Code Quality

```bash
# Code improvements
refactor(server): simplify request routing logic
refactor: extract common utilities to shared module
style: apply Prettier formatting across codebase

# Performance improvements  
perf(parser): cache parsed configuration files
perf(tools): lazy load tool implementations
perf: reduce startup time by 50%
```

---

## 🚨 Common Mistakes & Solutions

### Mistake 1: Wrong Commit Type
```bash
❌ docs(feat): add new configuration option
✅ feat(config): add new configuration option
```

### Mistake 2: Missing Breaking Change Indicator
```bash
❌ feat(api): change response format
✅ feat!: change API response format

BREAKING CHANGE: Response format changed from array to object.
```

### Mistake 3: Non-Descriptive Messages
```bash  
❌ fix: bug
✅ fix(parser): handle empty configuration files

❌ chore: updates
✅ chore(deps): update development dependencies
```

### Mistake 4: Wrong Tense
```bash
❌ feat: added user authentication
✅ feat: add user authentication

❌ fixed: memory leak issue  
✅ fix: resolve memory leak in HTTP server
```

---

**Pro Tips**:
- 🎯 **Keep commits focused** - One logical change per commit
- 📝 **Write for future maintainers** - Clear, descriptive messages
- 🔍 **Review before committing** - Double-check type and description
- 🤖 **Use tools** - Commitizen, pre-commit hooks, and linting
- 📚 **Learn from history** - Study existing commits for patterns