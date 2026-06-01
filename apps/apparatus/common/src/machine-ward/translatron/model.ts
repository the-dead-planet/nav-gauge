export type Language = 'en' | 'es' | 'de' | 'nl' | 'pl' | 'fr' | 'it' | 'jp' | 'ru';

export type TranslationTable = {
    [key in Language]?: { [key in string]: string };
};

export type TranslationRegistry = Map<string, TranslationTable>;
