export const CLOCK_INPUT_RANGE: [number, number] = [0, 360];
export const TICK_COUNT = 60;
export const STEP_DEG = 360 / TICK_COUNT;
export const MAJOR_TICK_INTERVAL = 5;

export function snap(v: number, min: number, max: number, step: number): number {
    const stepped = Math.round((v - min) / step) * step + min;
    const clamped = Math.min(max, Math.max(min, stepped));

    return ((clamped % 360) + 360) % 360;
}

function circularDistance(a: number, b: number): number {
    const diff = Math.abs(a - b);
    return Math.min(diff, 360 - diff);
}

export function snapSlice(v: number, min: number, max: number, step: number): number {
    if (max - min >= 360) {
        const stepped = Math.round((v - min) / step) * step + min;
        return ((stepped % 360) + 360) % 360;
    }
    v = ((v % 360) + 360) % 360;
    if (v >= min && v <= max) {
        const stepped = Math.round((v - min) / step) * step + min;
        return Math.min(max, Math.max(min, stepped));
    }
    return circularDistance(v, min) <= circularDistance(v, max) ? min : max;
}

export function clockAngleToRadians(clockAngleDeg: number): number {
    return (clockAngleDeg - 90) * (Math.PI / 180);
}

export function svgAtan2ToClockAngle(dx: number, dy: number): number {
    const svgDeg = Math.atan2(dy, dx) * (180 / Math.PI);

    return ((svgDeg + 90) % 360 + 360) % 360;
}

function isClockAngleInRange(deg: number, start: number, end: number): boolean {
    if (start <= end) {
        return deg >= start && deg <= end;
    }
    return deg >= start || deg <= end;
}

export interface ArcViewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function arcViewBox(
    cx: number, cy: number, r: number,
    clockStart: number, clockEnd: number,
    includeCenter: boolean = true,
    padding: number = 2,
): ArcViewBox {
    const points: [number, number][] = [];
    if (includeCenter) points.push([cx, cy]);

    const startRad = clockAngleToRadians(clockStart);
    const endRad = clockAngleToRadians(clockEnd);
    points.push([cx + r * Math.cos(startRad), cy + r * Math.sin(startRad)]);
    points.push([cx + r * Math.cos(endRad), cy + r * Math.sin(endRad)]);

    for (const deg of [0, 90, 180, 270]) {
        if (isClockAngleInRange(deg, clockStart, clockEnd)) {
            const rad = clockAngleToRadians(deg);
            points.push([cx + r * Math.cos(rad), cy + r * Math.sin(rad)]);
        }
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const [x, y] of points) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    }

    return {
        x: minX - padding,
        y: minY - padding,
        width: maxX - minX + padding * 2,
        height: maxY - minY + padding * 2,
    };
}

export interface PointerCoords {
    x: number;
    y: number;
}

export function pointerCoords(value: number, outerRadius: number): PointerCoords {
    const rad = clockAngleToRadians(value);
    const len = outerRadius - 3;
    return {
        x: Math.cos(rad) * len,
        y: Math.sin(rad) * len,
    };
}

export function describeArc(
    cx: number, cy: number, r: number,
    clockStart: number, clockEnd: number,
): string {
    const startRad = clockAngleToRadians(clockStart);
    const endRad = clockAngleToRadians(clockEnd);
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const diff = ((clockEnd - clockStart) % 360 + 360) % 360;
    const largeArc = diff > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}
