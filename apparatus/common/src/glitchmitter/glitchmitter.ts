export const glitchmitter = {
    transmit: (error: Error | unknown, errorStack?: unknown | string | null) => {
        console.error(error, errorStack);
        // TODO: send telemetry
    },
}
