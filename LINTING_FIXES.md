# Linting Fixes

This document summarizes the changes made to fix the ESLint errors in the project.

## `import/order`

The `import/order` rule was enforced to ensure a consistent order of imports across the project. The following files were modified:

- `src/components/ui/button.tsx`
- `src/components/ui/checkbox.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/progress.tsx`
- `src/components/ui/switch.tsx`

In each of these files, the `react` import was moved to be the first import.

## `arrow-body-style`

The `arrow-body-style` rule was enforced to ensure that arrow functions have a concise body. The following file was modified:

- `src/components/ui/input.tsx`

The arrow function was converted to a concise body.

## `react/jsx-no-undef`

The `react/jsx-no-undef` errors were caused by ESLint not being able to resolve the path aliases. This was fixed by adding the following to `eslint.config.mjs`:

```javascript
settings: {
  'import/resolver': {
    typescript: {
      project: 'tsconfig.json'
    }
  }
}
```

## `react-hooks/rules-of-hooks`

The `react-hooks/rules-of-hooks` error in `src/components/educational/Brain3D.tsx` was caused by calling the `useGLTF` hook inside a callback. This was fixed by extracting the `useGLTF` hook into a separate component.

## `@typescript-eslint/strict-boolean-expressions`

The `@typescript-eslint/strict-boolean-expressions` error in `src/components/educational/ExpandableCard.tsx` was fixed by using the nullish coalescing operator (`??`) instead of the logical OR operator (`||`).
