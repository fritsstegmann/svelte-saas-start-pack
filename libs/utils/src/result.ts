export class Result<T, E> {
    private _v: T | undefined;
    private _e: E | undefined;

    private constructor(v: T | undefined, e: E | undefined) {
        this._v = v;
        this._e = e;
    }

    static Ok<T>(v: T) {
        return new Result(v, undefined);
    }

    static Err<E>(e: E) {
        return new Result(undefined, e);
    }

    isOk(): boolean {
        if (this._v === undefined && this._e !== undefined) {
            return false;
        }
        if (this._v !== undefined && this._e === undefined) {
            return true;
        }
        throw Error('Invalid state');
    }

    static async fromPromise<T>(promise: Promise<T>) {
        try {
            return Result.Ok(await promise);
        } catch (e) {
            return Result.Err(e as Error);
        }
    }

    static async tryPromise<T>(fn: () => Promise<T>) {
        return Result.fromPromise(fn());
    }

    static try<T>(fn: () => T) {
        try {
            return Result.Ok(fn());
        } catch (e) {
            return Result.Err(e);
        }
    }

    async match<K, L>(
        okBranch: (v: T) => Promise<K>,
        errBranch: (e: E) => Promise<L>
    ) {
        if (this.isOk()) {
            try {
                return Result.Ok(await okBranch(this._v!)) as Result<K, L>;
            } catch (e) {
                return Result.Err(e) as Result<K, L>;
            }
        } else {
            return Result.Err(await errBranch(this._e!)) as Result<K, L>;
        }
    }

    unwrapOr(fallback: T) {
        if (this.isOk()) {
            return this._v;
        } else {
            return fallback;
        }
    }

    unwrap() {
        if (this.isOk()) {
            return this._v;
        } else {
            throw this._e;
        }
    }
}
