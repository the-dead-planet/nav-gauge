export const clamp = (value: number, range: [number, number]) => {
    const [min, max] = range;

    return Math.max(min, Math.min(max, value));
};

export const clampZeroOne = (value: number): number => clamp(value, [0, 1]);

export const getNext = (ids: number[]) => {
    let i = 0;
    while (ids.includes(i)) {
        i++;
    }
    return i;
};
