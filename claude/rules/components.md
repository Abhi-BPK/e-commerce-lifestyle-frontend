# Component Rules

## Structure
- One component per file, named identically to the file (PascalCase)
- Use default export for components
- Use named exports for helper functions within the same file if needed

## Props
- Always destructure props in the function signature
- Provide default values for optional props
- Document props with JSDoc comments for complex components
- Never mutate props — treat them as read-only

## Fragments
- Use `<>...</>` shorthand fragments to avoid unnecessary wrapper divs
- Only use `<React.Fragment key={...}>` when a key is needed (e.g., in lists)

## Events & Event Handlers
- Name event handlers with `handle` prefix: `handleClick`, `handleSubmit`, `handleChange`
- Pass handlers as props with `on` prefix: `onClick`, `onSubmit`, `onChange`
- Never define event handler functions inline in JSX for complex logic — extract them above the return
- Simple one-liners (e.g., `onClick={() => setOpen(true)}`) are acceptable inline

## Two-Way Binding
- Use controlled inputs: always pair `value` with `onChange`
- Never use uncontrolled inputs unless using `useRef` intentionally for performance

## Lifting State Up
- If two sibling components need the same state, lift it to their closest common parent
- Pass state down as props, pass updater functions down as callback props
- Document with a comment when state is intentionally lifted

## Sharing State Between Components
- For 2-3 components: lift state up to parent
- For deeply nested or many components: use Context API
- For truly global/cross-feature state: use Redux Toolkit

## Styling
- Use CSS Modules for component-scoped styles: `ComponentName.module.css`
- Import as: `import styles from './ComponentName.module.css'`
- Use global styles in `src/styles/` for resets, themes, and utility classes
- No inline style objects unless dynamically computed (e.g., animation values)

## Portals
- Use React Portals for modals, drawers, toasts, tooltips that must escape DOM hierarchy
- Keep portal components in `src/portals/`
- Always clean up portals on unmount

## Refs
- Use `useRef` for: DOM access, storing mutable values that don't trigger re-render
- Do NOT use refs to read/write state that should cause re-renders — use `useState` instead
- Name refs clearly: `inputRef`, `modalRef`, `timerRef`
