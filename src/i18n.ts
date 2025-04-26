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
