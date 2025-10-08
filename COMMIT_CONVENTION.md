# Semantic Release and Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated semantic versioning.

## Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature (triggers minor version bump)
- **fix**: A bug fix (triggers patch version bump)  
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Breaking Changes

Add `!` after type or include `BREAKING CHANGE:` in footer to trigger major version bump:

```
feat!: remove deprecated API endpoint
```

or

```
feat: add new authentication method

BREAKING CHANGE: The old authentication method is no longer supported
```

## Examples

- `feat(auth): add JWT token validation`
- `fix(api): resolve null pointer exception in user service`
- `docs: update README with new installation steps`
- `chore(deps): update semantic-release to v22`

## Workflow

1. **Dev Branch**: Push to `dev` branch
   - Automatically creates/updates PR to `main` with expected version
   
2. **Main Branch**: Merge PR to `main` branch
   - Automatically triggers release process
   - Publishes to GitHub Packages
   - Creates GitHub release with changelog