# SpellGrave

This is the full source code for the SpellGrave card game website.

## Features

- ✅ Firebase login (email + Google)
- ✅ Account creation with name + nickname
- ✅ Animated pack opening system
- ✅ Card collection viewer
- ✅ XP / Leveling system
- ✅ Beautiful fantasy-themed background
- ✅ Chat system, trading, and social features in progress

## Local Setup

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

## Code Quality & Formatting

This project uses ESLint and Prettier for code quality and consistent formatting.

### Available Scripts

- `npm run lint` - Check for linting errors and warnings
- `npm run lint:fix` - Automatically fix linting issues
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are properly formatted

### VS Code Integration

The project includes VS Code settings that will:

- Format code on save using Prettier
- Auto-fix ESLint issues on save
- Provide real-time linting feedback

### Configuration Files

- `.eslintrc.json` - ESLint configuration for React TypeScript
- `.prettierrc` - Prettier formatting rules
- `.prettierignore` - Files to exclude from formatting
- `eslint.config.js` - Modern ESLint configuration
