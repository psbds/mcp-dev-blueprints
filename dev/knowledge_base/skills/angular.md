---
name: angularjs-best-practices
description: Best practices for developing AngularJS applications
---

# AngularJS Best Practices

## Project Structure
- Follow a feature-based folder structure (one folder per feature/module).
- Keep controllers, services, directives, and templates close to their feature.
- Use a consistent naming convention: `feature.type.js` (e.g., `user.controller.js`).

## Controllers
- Keep controllers thin — delegate business logic to services.
- Avoid manipulating the DOM in controllers; use directives instead.
- Use `controllerAs` syntax over `$scope` for clearer bindings.

## Services & Factories
- Use services for shared state and reusable business logic.
- Return promises from services that perform async operations.
- Keep services stateless when possible.

## Directives
- Restrict directives to elements (`E`) or attributes (`A`).
- Use isolated scope (`scope: {}`) to avoid unintended parent scope leaks.
- Clean up watchers and event listeners in `$onDestroy` / `$destroy`.

## Performance
- Minimize the number of watchers; prefer one-time bindings (`::value`) for static data.
- Use `track by` in `ng-repeat` to avoid unnecessary DOM re-renders.
- Avoid deep `$watch`; use `$watchCollection` when monitoring arrays/objects.
- Debounce user input with `ng-model-options="{ debounce: 300 }"`.

## Error Handling
- Decorate `$exceptionHandler` for centralized error logging.
- Always handle `.catch()` on promises returned by `$http` and `$q`.

## Security
- Use `$sce.trustAsHtml` sparingly; prefer `ng-bind-html` with sanitized data.
- Never construct HTML strings with user input in controllers or services.

## Testing
- Write unit tests for every controller, service, and directive.
- Use `angular.mock.module` and `angular.mock.inject` for dependency injection in tests.
- Mock `$httpBackend` for service tests involving API calls.

## General
- Always declare dependencies using inline array annotation for safe minification.
- Enable strict DI mode (`ng-strict-di`) to catch missing annotations early.
- Wrap files in IIFEs to avoid polluting the global scope.