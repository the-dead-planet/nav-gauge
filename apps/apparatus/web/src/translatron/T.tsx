import { FC } from "react";
import { useMachineWard } from "@the-dead-planet/nav-gauge-apparatus-common/src/machine-ward/useMachineWard";
import { useSubjectState } from "@tinker-chest";
import { ErrorBoundary } from "@ui";
import { TranslatronError } from "./TranslatronError";

export interface TranslatronWrapperProps {
    /**
     * Namespace of the translation
     */
    n: string;
    /**
     * Key of the translation
     */
    t: string;
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
export const T: FC<TranslatronWrapperProps> = (props) => {
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
const InternalT: FC<TranslatronWrapperProps> = ({
    n,
    t,
    p,
}) => {
    const { individuator, translatron } = useMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [registry] = useSubjectState(translatron.registry$);

    return (
        <span>
            {translatron.translate(settings.language, registry, n, t, p)}
        </span>
    );
};
