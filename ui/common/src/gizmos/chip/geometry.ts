import type { SizeVariant } from "../../design-system/model";

const bevelSizes: Record<SizeVariant, number> = {
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
};

export const getChipBevelPath = (
    size: SizeVariant,
    width: number,
    height: number,
    inset = 0,
): string => {
    const cut = Math.min(
        bevelSizes[size],
        width / 2 - inset,
        height / 2 - inset,
    );
    const left = inset;
    const top = inset;
    const right = width - inset;
    const bottom = height - inset;

    return `M ${left + cut} ${top} H ${right - cut} L ${right} ${top + cut} V ${bottom - cut} L ${right - cut} ${bottom} H ${left + cut} L ${left} ${bottom - cut} V ${top + cut} Z`;
};
