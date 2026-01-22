declare module '*.json' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.jpeg' {
    const content: string;
    export default content;
}

export type Timer = ReturnType<typeof setTimeout>;

declare global {
    type Timer = ReturnType<typeof setTimeout>;

    function setTimeout(fn: () => void, ms?: number): Timer;
    function clearTimeout(timer: Timer): void;

    function setInterval(fn: () => void, ms?: number): Timer;
    function clearInterval(timer: Timer): void;
}

declare global {
    class AbortController {
        signal: AbortSignal;
        abort(): void;
    }

    class AbortSignal {
        readonly aborted: boolean;
        addEventListener(
            type: "abort",
            listener: (this: AbortSignal, ev: Event) => any,
            options?: boolean | AddEventListenerOptions
        ): void;
        removeEventListener(
            type: "abort",
            listener: (this: AbortSignal, ev: Event) => any,
            options?: boolean | EventListenerOptions
        ): void;
        onabort: ((this: AbortSignal, ev: Event) => any) | null;
    }
}

declare global {
    const console: {
        log: (...args: any[]) => void;
        warn: (...args: any[]) => void;
        error: (...args: any[]) => void;
        info: (...args: any[]) => void;
        debug: (...args: any[]) => void;
        trace: (...args: any[]) => void;
        group: (...args: any[]) => void;
        groupCollapsed: (...args: any[]) => void;
        groupEnd: () => void;
        table: (data: any, columns?: string[]) => void;
        time: (label?: string) => void;
        timeEnd: (label?: string) => void;
        clear: () => void;
    };
}
