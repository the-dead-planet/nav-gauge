import { ErrorBoundary } from "@ui";
import { TranslatronError } from "./TranslatronError";
import { TranslationId, useTranslation } from "@apparatus";

export function T<T extends string = string>(props: TranslationId<T>) {
    return (
        <ErrorBoundary fallbackComponent={TranslatronError}>
            <InternalT {...props} />
        </ErrorBoundary>
    );
};

function InternalT<T extends string = string>({ n, t, p }: TranslationId<T>) {
    return useTranslation({ n, t, p });
};
