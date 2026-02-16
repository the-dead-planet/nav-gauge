export const clamp = (value: number, range: [number, number]) => {
    const [min, max] = range;

    return Math.max(min, Math.min(max, value));
};

export const getNext = (ids: number[]) => {
    let i = 0;
    while (ids.includes(i)) {
        i++;
    }
    return i;
};
