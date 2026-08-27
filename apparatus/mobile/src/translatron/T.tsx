import { useMobileMachineWard } from "@the-dead-planet/nav-gauge-apparatus-mobile";
import { useSubjectState } from "@tinker-chest";
import { ErrorBoundary } from "@ui";
import { TranslatronError } from "./TranslatronError";
import { TranslationId } from "@apparatus";

export function T<T extends string = string>(props: TranslationId<T>) {
    return (
        <ErrorBoundary fallbackComponent={TranslatronError}>
            <InternalT {...props} />
        </ErrorBoundary>
    );
};

function InternalT<T extends string = string>({ n, t, p }: TranslationId<T>) {
    const { individuator, translatron } = useMobileMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [registry] = useSubjectState(translatron.registry$);

    return translatron.translate(settings.language, registry, { n, t, p });
};
