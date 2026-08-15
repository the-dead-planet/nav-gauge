/**
 * Extracts given property named as given `prop` from the error cause field.
 */
export const getCauseProp = (prop: string, error?: Error): string | undefined => {
    if (!error?.cause || typeof error.cause !== 'object' || !(prop in error.cause)) {
        return;
    }
    const cause = error.cause as { [key in string]: unknown };
    if (typeof cause[prop] === 'string') {
        return cause[prop];
    }
}
