import { useMachineWard } from "@the-dead-planet/nav-gauge-apparatus-common/src/machine-ward/useMachineWard";
import { useSubjectState } from "@tinker-chest";
import { ErrorBoundary } from "@ui";
import { TranslatronError } from "./TranslatronError";
import { TranslationId } from "@apparatus";

/**
 * Wrapper component for texts which translates
 * @returns 
 */
export function T<T extends string = string>(props: TranslationId<T>) {
    return (
        <ErrorBoundary fallbackComponent={TranslatronError}>
            <InternalT {...props} />
        </ErrorBoundary>
    );
};

/**
 * Wrapper component for texts which translates
 * @returns 
 */
function InternalT<T extends string = string>(props: TranslationId<T>) {
    const { n, t, p } = props;
    const { individuator, translatron } = useMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [registry] = useSubjectState(translatron.registry$);

    return (
        <span>
            {translatron.translate(settings.language, registry, { n, t, p })}
        </span>
    );
};
