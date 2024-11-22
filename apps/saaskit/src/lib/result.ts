export class Result<T, E> {
    private _v: T | undefined;
    private _e: E | undefined;

    isOk(): boolean {
        if (this._v === undefined && this._e !== undefined) {
            return false;
        }
        if (this._v !== undefined && this._e === undefined) {
            return true;
        }
        throw Error('Invalid state');
    }

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

    async fromPromise(promise: Promise<T>) {
        try {
            return Result.Ok(await promise);
        } catch (e) {
            return Result.Err(e as Error);
        }
    }

    unwrap() {
        if (this.isOk()) {
            return this._v;
        } else {
            throw this._e;
        }
    }

    match<K, L>(okBranch: (v: T) => K, errBranch: (e: E) => L) {
        if (this.isOk()) {
            return Result.Ok(okBranch(this._v!));
        } else {
            return Result.Err(errBranch(this._e!));
        }
    }

    unwrapOr(fallback: T) {
        if (this.isOk()) {
            return this._v;
        } else {
            return fallback;
        }
    }
}
