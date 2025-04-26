# Donkey i18n 🐴🌐

A tiny and thoroughly type-safe internationalization helper for TypeScript and includes a React-specific hook. It's designed to be a quick way to add i18n support to your prototypes or small projects, and is meant to be easily replaced if you outgrow it.

---

## Features

- **Type-safe keys**: Get auto-complete and catch typos in your code
- **Nested paths**: Support for deep objects like `settings.title`
- **Runtime safety**: Throws an error if you request a missing key
- **React hook**: `useTranslator` gives you a memoized `t()` function to translate

## Installation

`npm install donkey-i18n`

## Usage

### 1. Define your dictionaries

```ts
// define your base language's dictionary
const en = {
    settings: {
        title: "Welcome to Settings",
        description: "This is the settings page.",
    },
    login: "Login",
};

// typing not needed but highly recommended so that both languages have the same structure
type LangDict = typeof en;

const fr: LangDict = {
    settings: {
        title: "Bienvenue dans les paramètres",
        description: "Ceci est la page des paramètres.",
    },
    login: "Connexion",
};

const dict = { en, fr };
```

### 2. Detect browser locale

```ts
import { getBrowserLocale } from "donkey-i18n";

const locale = getBrowserLocale({
    dictionary: dict,
    fallbackLocale: "en",
});

// If `navigator.languages` includes "fr", you get "fr", otherwise "en".
```

### 3. Create a translator

```ts
import { createTranslationFunction } from "donkey-i18n";

const { t } = createTranslationFunction({
    dictionary: dict,
    locale: "en",
});

// Or with React
import { useTranslator } from "donkey-i18n";

function MyComponent() {
    const { t } = useTranslator({ dictionary: dict, "en" });
}

console.log(t("login")); // → "Login"
console.log(t("settings.title")); // → "Welcome to Settings"
```

## API Reference

### `getBrowserLocale({ dictionary, fallbackLocale })`

Auto-detects the best locale based on the browser.

**Parameters**:

- `dictionary` (_object_) — your whole locale dictionary
- `fallbackLocale` (_string_) — used if no match in `navigator.languages`

**Returns**:

- the best matching locale key, or the fallback

### `createTranslationFunction({ dictionary, locale })`

Creates a translation function for a specific locale.

**Parameters**:

- `dictionary` (_object_) — your full locale dictionary
- `locale` (_string_) — the key of the current language (e.g., `"en"`, `"fr"`)

**Returns**:

- `{ t }` — where `t(path)` gives you the translated string

**Example**:

`const { t } = createTranslationFunction({ dictionary, locale: "en" });`

### `useTranslator({ dictionary, locale })`

React hook version of `createTranslationFunction`, memoized for performance.

**Parameters**:

- `dictionary` (_object_) — your full locale dictionary
- `locale` (_string_) — the key of the current language

**Returns**:

- `{ t }` — where `t(path)` gives you the translated string

**Example**:
`const { t } = useTranslator({ dictionary, locale: "en" });`

### `getTranslationFromDict(dict, path)`

Mostly for internal use, but may be useful. Lower-level helper for manually fetching translations by path.

**Parameters**:

- `dict` (_object_) — translations for a specific locale (e.g., `dict.en`)
- `path` (_string_) — like `"login"` or `"settings.description"`

**Returns**:

- the translated string

**Notes**:

- Throws an error if the path doesn't exist.

## Contributing

Pull requests, issues, and ⭐️ are all welcome!

## License

MIT © Matthew Tao
