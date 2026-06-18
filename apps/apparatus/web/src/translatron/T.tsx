import { ComponentProps } from "react";
import { useMachineWard } from "@the-dead-planet/nav-gauge-apparatus-common/src/machine-ward/useMachineWard";
import { useSubjectState } from "@tinker-chest";
import { ErrorBoundary } from "@ui";
import { TranslatronError } from "./TranslatronError";
import { TranslationId } from "@apparatus";
import { Span } from "@web-ui";

/**
 * Wrapper span component for texts which translates to the preferred language.
 */
export function T<T extends string = string>(props: TranslationId<T>) {
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
    ...props
}: TranslationId<T> & ComponentProps<typeof Span>) {
    const { individuator, translatron } = useMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [registry] = useSubjectState(translatron.registry$);

    return (
        <Span {...props}>
            {translatron.translate(settings.language, registry, { n, t, p })}
        </Span>
    );
};
