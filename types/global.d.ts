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
        abort: () => void;
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
    const performance: {
        now(): number;
    };

    const console: {
        log: (...args: any[]) => void;
        warn: (...args: any[]) => void;
        error: (...args: any[]) => void;
        info: (...args: any[]) => void;
        debug: (...args: any[]) => void;
    };
}

type StoredValue = string | null;

declare global {
    interface StorageLike {
        getItem(key: string): StoredValue | Promise<StoredValue>;
        setItem(key: string, value: string): void | Promise<void>;
        removeItem(key: string): void | Promise<void>;
    }
}

declare global {
    interface RequireContext {
        keys(): string[];
        (id: string): unknown;
        resolve(id: string): string;
    }

    interface NodeRequire {
        context(
            directory: string,
            useSubdirectories?: boolean,
            regExp?: RegExp,
            mode?: "sync" | "eager" | "lazy" | "lazy-once",
        ): RequireContext;
    }
}

export {};
