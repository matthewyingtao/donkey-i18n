// { "settings" : { title: "", description: "" }, "login": "" }
// "settings.title", "settings.description", "login"
type TranslationStrings<T, Prefix extends string = ""> = {
    [K in keyof T]: T[K] extends string
        ? `${Prefix}${K & string}`
        : T[K] extends Record<string, string>
          ?
                | `${Prefix}${K & string}`
                | TranslationStrings<T[K], `${Prefix}${K & string}.`>
          : never;
}[keyof T];

export function getTranslationFromDict<
    T extends Record<string, any>,
    K extends TranslationStrings<T>,
>(dict: T, path: K): string {
    const keys = (path as string).split(".");
    let current: any = dict;

    for (const key of keys) {
        if (current[key] === undefined)
            throw new Error(
                `Key "${key}" not found while resolving path "${path}".`,
            );
        current = current[key];
    }

    return current as any;
}

export function useTranslator<
    T extends Record<string, any>,
    K extends keyof any,
>({ dictionary, locale }: { dictionary: Record<K, T>; locale: K }) {
    function t<Path extends TranslationStrings<T>>(path: Path): string {
        const dict = dictionary[locale];
        return getTranslationFromDict(dict, path);
    }

    return { t };
}

export function getBrowserLocale<
    T extends Record<string, any>,
    K extends keyof T & string,
>({ dictionary, fallbackLocale }: { dictionary: T; fallbackLocale: K }): K {
    let finalLocale: K = fallbackLocale;

    if (typeof navigator !== "undefined") {
        let languages = navigator.languages;
        if (!languages) languages = [navigator.language];

        for (let language of languages) {
            if (language in dictionary) {
                finalLocale = language as K;
                break;
            }
        }
    }

    return finalLocale;
}
