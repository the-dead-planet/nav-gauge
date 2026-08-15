import { useSubjectState } from "@tinker-chest";
import { useMachineWard } from "../../useMachineWard";
import { TranslationId } from "../model";

export const useTranslation = (translationId: TranslationId): string => {
    const { individuator, translatron } = useMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [registry] = useSubjectState(translatron.registry$);

    return translatron.translate(settings.language, registry, translationId);
};
