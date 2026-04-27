# Git Conventions

## Branch Naming
- `feature/short-description` — new features
- `fix/short-description` — bug fixes
- `refactor/short-description` — refactoring
- `chore/short-description` — config, deps, tooling

## Commit Message Format
```
type(scope): short description

Examples:
feat(auth): add login form with validation
fix(cart): correct item count on removal
refactor(hooks): extract useFetch from Dashboard
chore(deps): upgrade React to 19.1
```

## Rules
- Never commit directly to `main`
- PRs require at least one team member review before merging
- Keep PRs small and focused — one concern per PR
- Never commit `.env` files or secrets
- Run `npm run lint` before every commit
