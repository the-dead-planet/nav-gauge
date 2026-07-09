export const ANGLE_INPUT_RANGE: [number, number] = [0, 360];
export const TICK_COUNT = 60;
export const STEP_DEG = 360 / TICK_COUNT;
export const MAJOR_TICK_INTERVAL = 5;

export function snap(v: number, min: number, max: number, step: number): number {
    const stepped = Math.round((v - min) / step) * step + min;
    const clamped = Math.min(max, Math.max(min, stepped));

    return ((clamped % 360) + 360) % 360;
}

export function clockAngleToRadians(clockAngleDeg: number): number {
    return (clockAngleDeg - 90) * (Math.PI / 180);
}

export function svgAtan2ToClockAngle(dx: number, dy: number): number {
    const svgDeg = Math.atan2(dy, dx) * (180 / Math.PI);

    return ((svgDeg + 90) % 360 + 360) % 360;
}
