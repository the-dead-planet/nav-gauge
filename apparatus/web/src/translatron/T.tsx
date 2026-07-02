import { CSSProperties } from "react";
import { useMachineWard } from "@the-dead-planet/nav-gauge-apparatus-common/src/machine-ward/useMachineWard";
import { useSubjectState } from "@tinker-chest";
import { ErrorBoundary } from "@ui";
import { TranslatronError } from "./TranslatronError";
import { TranslationId } from "@apparatus";

/**
 * Wrapper span component for texts which translates to the preferred language.
 */
export function T<T extends string = string>(props: TranslationId<T> & { className?: string; style?: CSSProperties }) {
    return (
        <ErrorBoundary fallbackComponent={TranslatronError}>
            <InternalT {...props} />
        </ErrorBoundary>
    );
};

function InternalT<T extends string = string>({
    n,
    t,
    p,
    className,
    style,
}: TranslationId<T> & { className?: string; style?: CSSProperties }) {
    const { individuator, translatron } = useMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [registry] = useSubjectState(translatron.registry$);

    return (
        <span className={className} style={style}>
            {translatron.translate(settings.language, registry, { n, t, p })}
        </span>
    );
};
