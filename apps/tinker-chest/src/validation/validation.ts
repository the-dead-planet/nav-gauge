export const validateString = (value: unknown, name: string) => {
    if (value !== undefined && typeof value !== 'string') {
        throw new Error(`${name} should be of type string`);
    }
};

export const validateNumber = (value: unknown, name: string, range?: [number, number]) => {
    if (value !== undefined && typeof value !== 'number') {
        throw new Error(`${name} should be of type number`);
    }
    if (range && value !== undefined && (value < range[0] || value > range[1])) {
        throw new Error(`${name} should be within range [${range.join(', ')}]`);
    }
};

export const validateStringEnum = (value: unknown, name: string, allowedValues: string[]) => {
    if (value !== undefined && !allowedValues.includes(value as string)) {
        throw new Error(`${name} should be one of: ${allowedValues.join(', ')}`);
    }
};

export const validateBoolean = (value: unknown, name: string) => {
    if (value !== undefined && typeof value !== 'boolean') {
        throw new Error(`${name} should be of type boolean`);
    }
};
