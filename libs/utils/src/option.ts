import { Result } from "./result.js";

export class Option<T> {
  private _v: T | null;

  private constructor(v: T | null) {
    this._v = v;
  }

  static Some<T>(v: T) {
    return new Option(v);
  }

  static None() {
    return new Option(null);
  }

  isSome(): boolean {
    return this._v !== null;
  }

  unwrap<T>(): T {
    if (this.isSome()) {
      return this._v as T;
    }
    throw Error("Missing value");
  }

  async match<K, L>(
    okBranch: (v: T) => Promise<K>,
    errBranch: () => Promise<L>,
  ): Promise<Result<K, L>> {
    if (this.isSome()) {
      try {
        // biome-ignore lint/style/noNonNullAssertion: we already check the value with isSome
        return Result.Ok(await okBranch(this._v!)) as Result<K, L>;
      } catch (e) {
        return Result.Err(e) as Result<K, L>;
      }
    } else {
      return Result.Err(await errBranch()) as Result<K, L>;
    }
  }
}
