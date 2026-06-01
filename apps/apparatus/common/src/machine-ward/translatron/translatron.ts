import { BehaviorSubject } from "rxjs";
import { Language, TranslationRegistry, TranslationTable } from "./model";

export class Translatron {
    public static defaultLanguage: Language = 'en';
    private placeholderText = 'Translatron oopsie';

    /**
     * Mapping of namespaces to translation tables, for example `Map<'my-namespace', { en: { "title": "Have a good day" }}>`
     */
    public registry$ = new BehaviorSubject<TranslationRegistry>(new Map());

    public constructor() { }

    public register = (namespace: string, translations: TranslationTable): void => {
        const registry = new Map(this.registry$.value);
        registry.set(namespace, translations);
        this.registry$.next(registry);
    };

    public deregister = (namespace: string): void => {
        const registry = new Map(this.registry$.value);
        registry.delete(namespace);
        this.registry$.next(registry);
    };

    public listLanguages = (registry: TranslationRegistry): Set<Language> => {
        const languages = [...registry.values()].map((table) => Object.keys(table)).flat() as Language[];

        return new Set<Language>(languages);
    };
    
    /**
     * Translates to the desired language with fallback to the default language (en).
     * @param params For template strings, for example `{ distance: '1,234 km' }` if the template string is `Traveled {{distance}} distance.`
     */
    public translate = (
        lang: Language,
        registry: TranslationRegistry,
        namespace: string,
        key: string,
        params?: { [key in string]: string | number; },
    ): string => {
        const table = registry.get(namespace);

        if (!table) {
            console.warn(`Could not find translation namespace: "${namespace}"`);
            return this.placeholderText;
        }

        const translation = table[lang]?.[key] ?? table[Translatron.defaultLanguage]?.[key];

        if (translation !== undefined) {
            return params ? this.interpolate(translation, params) : translation;
        }

        return key;
    };

    /**
     * For template strings
     * @param template for example `Traveled {{distance}} km distance`
     * @param params for example { distance: 42 }
     * @returns Translated value with variable values injected to the template string
     */
    private interpolate = (
        template: string,
        params: { [key in string]: string | number; },
    ): string => {
        return template.replace(/\{\{(\w+)\}\}/g, (_, name) => {
            const value = params[name];

            return value !== undefined ? String(value) : `{{${name}}}`;
        });
    };
}
