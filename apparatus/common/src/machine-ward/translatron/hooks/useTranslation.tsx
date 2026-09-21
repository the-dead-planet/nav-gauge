import { TranslationId } from "../model";
import { useTranslate } from "./useTranslate";

export const useTranslation = (translationId: TranslationId): string => {
    const translate = useTranslate();

    return translate(translationId);
};
