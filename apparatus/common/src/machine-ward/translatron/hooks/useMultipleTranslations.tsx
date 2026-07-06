import { useSubjectState } from "@tinker-chest";
import { useMachineWard } from "../../useMachineWard";
import { TranslationId } from "../model";

export const useMultipleTranslations = (translationId: TranslationId[]): string[] => {
    const { individuator, translatron } = useMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [registry] = useSubjectState(translatron.registry$);

    return translationId.map((t) => translatron.translate(settings.language, registry, t));
};
