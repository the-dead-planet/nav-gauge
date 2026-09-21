import { TranslationId } from "../model";
import { useTranslate } from "./useTranslate";

export const useMultipleTranslations = (translationId: TranslationId[]): string[] => {
    const translate = useTranslate();

    return translationId.map(translate);
};
