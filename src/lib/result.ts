export type Result<T, E> =
    | {
          v: T;
      }
    | {
          e: E;
      };

export function Ok<T>(t: T): Result<T, never> {
    return {
        v: t,
    };
}

export function Err<E>(e: E): Result<never, E> {
    return {
        e: e,
    };
}

export function isOk<T, E>(result: Result<T, E>) {
    if (Object.hasOwn(result, 'v')) {
        return true;
    } else {
        return false;
    }
}

export async function match<T, E, TA, EA>(
    result: Result<T, E>,
    okBranch: (t: T) => Promise<Result<TA, EA>>,
    errBranch: (e: E) => Promise<Result<TA, EA>>
): Promise<Result<TA, EA>> {
    if (isOk(result)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return okBranch(result.v);
    } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return errBranch(result.e);
    }
}

export async function unwrap<T, E>(result: Promise<Result<T, E>>): Promise<T> {
    const r = await result;
    if (isOk(r)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return Promise.resolve(r.v);
    } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        throw new Error(r.e);
    }
}
