export function defineJob<T>(name: string, handler: (a: T) => Promise<void>) {
    return {
        name,
        handler,
    };
}

export type Job<T> = ReturnType<typeof defineJob<T>>;
