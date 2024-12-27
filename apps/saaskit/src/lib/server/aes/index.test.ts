import { describe, expect, test } from "vitest";
import { decryptData, encryptData } from ".";

describe("aes", () => {
    test("encrypt and decrypt data", async () => {
        const key = "my key data";

        const result = await decryptData(
            key,
            await encryptData(key, "my raw data"),
        );

        expect(result).toEqual("my raw data");
    });
});
