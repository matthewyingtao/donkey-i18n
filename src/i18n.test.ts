import { renderHook } from "@testing-library/react";
import "jsdom-global/register";
import { afterEach, describe, expect, it } from "vitest";
import {
    createTranslationFunction,
    getBrowserLocale,
    getTranslationFromDict,
    useTranslator,
} from "./i18n.js";

const en = {
    settings: {
        title: "Welcome to Settings",
        description: "This is the settings page.",
    },
    login: "Login",
};

type LangDict = typeof en;

const fr: LangDict = {
    settings: {
        title: "Bienvenue dans les paramètres",
        description: "Ceci est la page des paramètres.",
    },
    login: "Connexion",
};

const dict = { en, fr };

describe("getTranslationFromDict", () => {
    it("should retrieve a top-level key", () => {
        const result = getTranslationFromDict(en, "login");
        expect(result).toBe("Login");
    });

    it("should retrieve a nested key", () => {
        const result = getTranslationFromDict(en, "settings.title");
        expect(result).toBe("Welcome to Settings");
    });

    it("should throw an error for invalid path", () => {
        expect(() =>
            // @ts-expect-error, testing an incorrect path
            getTranslationFromDict(en, "settings.nonexistent"),
        ).toThrowError(
            'Key "nonexistent" not found while resolving path "settings.nonexistent".',
        );
    });
});

describe("createTranslationFunction", () => {
    const { t } = createTranslationFunction({ dictionary: dict, locale: "en" });

    it("should translate correctly for English", () => {
        expect(t("settings.title")).toBe("Welcome to Settings");
        expect(t("login")).toBe("Login");
    });

    it("should translate correctly for French", () => {
        const { t: tFr } = createTranslationFunction({
            dictionary: dict,
            locale: "fr",
        });
        expect(tFr("settings.description")).toBe(
            "Ceci est la page des paramètres.",
        );
        expect(tFr("login")).toBe("Connexion");
    });
});

describe("getBrowserLocale", () => {
    const originalLanguages = navigator.languages;

    afterEach(() => {
        Object.defineProperty(navigator, "languages", {
            value: originalLanguages,
            configurable: true,
        });
    });

    it("should return fallbackLocale if no match", () => {
        Object.defineProperty(navigator, "languages", {
            value: ["de", "es"],
            configurable: true,
        });

        const result = getBrowserLocale({
            dictionary: dict,
            fallbackLocale: "en",
        });
        expect(result).toBe("en");
    });

    it("should detect correct locale if available", () => {
        Object.defineProperty(navigator, "languages", {
            value: ["fr"],
            configurable: true,
        });

        const result = getBrowserLocale({
            dictionary: dict,
            fallbackLocale: "en",
        });
        expect(result).toBe("fr");
    });
});

describe("useTranslator", () => {
    it("should return correct translator function for locale", () => {
        const { result } = renderHook(() =>
            useTranslator({ dictionary: dict, locale: "en" }),
        );

        expect(result.current.t("settings.description")).toBe(
            "This is the settings page.",
        );
    });

    it("should update translation when locale changes", () => {
        let locale = "en";

        const { result, rerender } = renderHook(
            ({ locale }) => useTranslator({ dictionary: dict, locale }),
            { initialProps: { locale } },
        );

        expect(result.current.t("login")).toBe("Login");

        locale = "fr";
        rerender({ locale });

        expect(result.current.t("login")).toBe("Connexion");
    });
});
