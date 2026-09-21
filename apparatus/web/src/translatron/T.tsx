import { CSSProperties } from "react";
import { ErrorBoundary } from "@ui";
import { TranslatronError } from "./TranslatronError";
import { TranslationId, useTranslation } from "@apparatus";

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
    const translation = useTranslation({ n, t, p });

    return (
        <span className={className} style={style}>
            {translation}
        </span>
    );
};
