type LeafPaths<T> = T extends object
    ? {
        [K in keyof T]: `${Exclude<K, symbol>}${LeafPaths<T[K]> extends never
        ? ""
        : `.${LeafPaths<T[K]>}`}`;
    }[keyof T]
    : never;

export function getTranslationFromDict<T extends object, K extends LeafPaths<T>>(
    dictionary: T,
    path: K,
): K extends keyof T ? T[K] : string {
    const keys = path.split(".");
    let current: any = dictionary;

    for (const key of keys) {
        if (current[key] === undefined) {
            return undefined as any;
        }
        current = current[key];
    }

    return current as any;
}

export function useTranslator<Dict extends Record<string, any>>({
    dictionary,
    locale
}: {
    dictionary: Dict;
    locale: keyof Dict;
}) {
    const translate = (key: LeafPaths<typeof dictionary[typeof locale]>) =>
        getTranslationFromDict(dictionary[locale], key);

    return { t: translate };
};

export function getDefaultLocale<Dict extends Record<string, any>>({ defaultLocale = "en", dictionary }: { defaultLocale?: keyof Dict; dictionary: Dict }) {
    if (typeof navigator !== "undefined") {
        let languages = navigator.languages;
        if (!navigator.languages) languages = [navigator.language];

        for (let language of languages) {
            if (Object.keys(dictionary).includes(language)) {
                defaultLocale = language as "en" | "jp";
                break;
            }
        }
    }
    return defaultLocale;
}
