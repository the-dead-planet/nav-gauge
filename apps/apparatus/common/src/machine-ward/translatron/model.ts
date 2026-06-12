export type Language = 'en' | 'es' | 'de' | 'nl' | 'pl' | 'fr' | 'it' | 'jp' | 'ru';

export type TranslationTable = {
    [key in Language]?: { [key in string]: string };
};

export type TranslationRegistry = Map<string, TranslationTable>;

export interface TranslationId<T extends string = string> {
    /**
     * Namespace
     */
    n: string;
    /**
     * Translation key
     */
    t: T;
    /**
     * (Optional) Translation params. 
     * 
     * @example `{ distance: '1,234 km' }` if the template string is `Traveled {{distance}} distance.`
     */
    p?: { [key in string]: string | number; }
}
