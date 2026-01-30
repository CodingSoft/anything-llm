# AGENTS.md - Anything LLM Development Guide

## Project Overview

Monorepo with three components:
- **server**: Node.js/Express backend (CommonJS) - Puerto 3001
- **collector**: Document processing service (CommonJS) - Puerto 8888
- **frontend**: React/Vite SPA (ESM) - Puerto 3000

Minimum Node.js version: 18+

## Build/Lint/Test Commands

### Root Level Commands
```bash
yarn setup              # Install all deps, copy envs, setup Prisma
yarn test              # Run all tests via Jest
yarn lint              # Run linting in all 3 workspaces
yarn dev:server        # Start server dev (port 3001)
yarn dev:collector     # Start collector dev (port 8888)
yarn dev:frontend      # Start frontend dev (port 3000)
yarn dev:all           # Run all 3 dev servers concurrently
yarn prisma:generate   # Generate Prisma client
yarn prisma:migrate    # Run migrations
yarn prisma:seed       # Seed database
```

### Server Commands
```bash
cd server && yarn dev    # Development with nodemon
cd server && yarn start  # Production
cd server && yarn lint   # Prettier check/write
```

### Frontend Commands
```bash
cd frontend && yarn dev           # Vite dev server
cd frontend && yarn build         # Production build
cd frontend && yarn lint:check    # ESLint check (no fix)
cd frontend && yarn lint          # ESLint with auto-fix
```

### Collector Commands
```bash
cd collector && yarn dev    # Development with nodemon
cd collector && yarn start  # Production
cd collector && yarn lint   # Prettier check/write
```

### Running Single Tests
```bash
# Specific test file
cd server && yarn jest __tests__/utils/helpers/convertTo.test.js

# Pattern match
cd server && yarn jest --testNamePattern="should throw error"

# Collector tests
cd collector && yarn jest

# Watch mode
yarn jest --watch
```

## Code Style Guidelines

### General Principles

1. **Language**: JavaScript (ESM in frontend, CommonJS in server/collector)
2. **Type Checking**: JSDoc comments; Flow annotations exist but not enforced
3. **Formatting**: Prettier is source of truth
4. **Linting**: ESLint with Prettier integration

### File Naming & Structure

| Pattern | Convention | Example |
|---------|-----------|---------|
| Server/Collector files | lowercase.js | `workspaceChats.js` |
| Frontend components | PascalCase.jsx | `Sidebar/index.jsx` |
| Directories | lowercase | `utils/`, `models/` |
| Private methods | prefix with `_` | `_update`, `_getContextWindow` |

### Naming Conventions

| Pattern | Convention | Example |
|---------|-----------|---------|
| Variables/Functions | camelCase | `workspaceUsers` |
| Constants | SCREAMING_SNAKE_CASE | `ROLES.admin` |
| Classes/Models | PascalCase | `Workspace`, `User` |
| React Components | PascalCase | `Sidebar` |

### Imports

**Server/Collector (CommonJS):**
```javascript
const prisma = require("../utils/prisma");
const { Workspace } = require("./workspace");
```

**Frontend (ESM):**
```javascript
import React from "react";
import Sidebar from "@/components/Sidebar";
import { userFromStorage } from "@/utils/request";
```
- Use `@/` alias for frontend imports
- Group external imports first, then internal
- Sort alphabetically within groups

### React Components

```jsx
export default function ComponentName() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // effect logic
  }, []);

  if (loading) return <LoadingSpinner />;

  return <div className="...">{/* content */}</div>;
}
```

- Use functional components with hooks
- Default exports for pages, named exports for reusable components
- Use `className` not `class`, `htmlFor` not `for`

### Error Handling

**Server-side:**
```javascript
try {
  const result = await prisma.operation();
  return { result, error: null };
} catch (error) {
  console.error(error.message);
  return { result: null, error: error.message };
}
```

- Use try/catch with error logging
- Return `{ data, error }` patterns for async operations
- Use `console.error` for errors, `console.log` for debugging
- Never expose stack traces to clients

**Frontend:**
- Use `react-error-boundary` for error boundaries
- Use toast notifications for user feedback
- Handle API errors gracefully

### Database (Prisma)

- Models in `server/prisma/schema.prisma`
- Access via `prisma` client in `server/utils/prisma.js`
- Model files wrap Prisma operations (e.g., `server/models/workspace.js`)
- Use async/await with error handling

### Validation

- Use Joi for request validation on server
- Validate at model layer using validation functions:
```javascript
validations: {
  name: (value) => {
    if (!value || typeof value !== "string") return "My Workspace";
    return String(value).slice(0, 255);
  },
}
```

### Comments & Documentation

- Use JSDoc for function documentation
- Keep comments minimal; code should be self-explanatory
- Use `// TODO: ` for technical debt markers

### ESLint Rules

**Frontend:**
- `react/react-in-jsx-scope`: off
- `react-hooks/exhaustive-deps`: off
- `no-unused-vars`, `no-undef`: off

**Server:**
- `no-unused-vars`: warn
- `no-undef`: warn
- `prettier/prettier`: warn

### Testing

- Tests in `__tests__/` directories alongside source files
- Use Jest with `describe()`, `test()`, `expect()`
- Mock external dependencies:
```javascript
jest.mock("../../../models/workspaceChats");
const { WorkspaceChats } = require("../../../models/workspaceChats");
```
- Use `beforeEach` to reset mocks

### Git Commit Messages

- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Keep subject to 50 chars or less
- Example: `fix: resolve workspace user permission check`

### Known Issues & Technical Debt

- `react/prop-types` is disabled (FIXME in eslint.config.js)
- Flow type annotations exist but not fully enforced
