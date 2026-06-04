import { useMachineWard } from "@the-dead-planet/nav-gauge-apparatus-common/src/machine-ward/useMachineWard";
import { useSubjectState } from "@tinker-chest";
import { ErrorBoundary } from "@ui";
import { TranslatronError } from "./TranslatronError";

export interface TranslatronWrapperProps<T = string> {
    n: string;
    t: T;
    p?: { [key in string]: string | number; };
}

export function T<T extends string = string>(props: TranslatronWrapperProps<T>) {
    return (
        <ErrorBoundary fallbackComponent={TranslatronError}>
            <InternalT {...props} />
        </ErrorBoundary>
    );
};

function InternalT<T extends string = string>(props: TranslatronWrapperProps<T>) {
    const { n, t, p } = props;
    const { individuator, translatron } = useMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [registry] = useSubjectState(translatron.registry$);

    return translatron.translate(settings.language, registry, n, t, p);
};
