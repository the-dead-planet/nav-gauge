const DEG_TO_RAD = Math.PI / 180;

export const ARROW_SWEEP = 140;
export const ARROW_GAP = 20;

export const describeArcPath = (
    cx: number,
    cy: number,
    r: number,
    startDeg: number,
    endDeg: number,
): string => {
    const startRad = (startDeg - 90) * DEG_TO_RAD;
    const endRad = (endDeg - 90) * DEG_TO_RAD;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const sweep = ((endDeg - startDeg) % 360 + 360) % 360;
    const largeArc = sweep > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
};

export const arrowHead = (
    cx: number,
    cy: number,
    r: number,
    deg: number,
    dir: 'start' | 'end',
): string => {
    const rad = (deg - 90) * DEG_TO_RAD;
    const tipX = cx + r * Math.cos(rad);
    const tipY = cy + r * Math.sin(rad);
    const headLen = 5;
    const headAngle = 0.5;
    const tangentSign = dir === 'end' ? 1 : -1;
    const tangent = rad + tangentSign * (Math.PI / 2);
    const p1x = tipX - headLen * Math.cos(tangent - headAngle);
    const p1y = tipY - headLen * Math.sin(tangent - headAngle);
    const p2x = tipX - headLen * Math.cos(tangent + headAngle);
    const p2y = tipY - headLen * Math.sin(tangent + headAngle);
    return `M ${p1x} ${p1y} L ${tipX} ${tipY} L ${p2x} ${p2y}`;
};
