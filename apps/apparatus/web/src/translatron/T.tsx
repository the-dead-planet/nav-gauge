import { useMachineWard } from "@the-dead-planet/nav-gauge-apparatus-common/src/machine-ward/useMachineWard";
import { useSubjectState } from "@tinker-chest";
import { ErrorBoundary } from "@ui";
import { TranslatronError } from "./TranslatronError";

export interface TranslatronWrapperProps<T = string> {
    /**
     * Namespace of the translation
     */
    n: string;
    /**
     * Key of the translation
     */
    t: T;
    /**
     * Parameters of the translation, if translation is a template string.
     * 
     * For example `p = { distance: "1,234 km" }` for a translation `The cat walked {{distance}} away from the station.`
     */
    p?: { [key in string]: string | number; };
}

/**
 * Wrapper component for texts which translates
 * @returns 
 */
export function T<T extends string = string>(props: TranslatronWrapperProps<T>) {
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
function InternalT<T extends string = string>(props: TranslatronWrapperProps<T>) {
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
