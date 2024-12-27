import { sha256 } from "@oslojs/crypto/sha2";
import { decodeBase64, encodeBase64 } from "@oslojs/encoding";

async function generateKey(keyData: string) {
    const keyBytes = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(keyData),
    );
    return crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, [
        "encrypt",
        "decrypt",
    ]);
}

export async function encryptData(keyData: string, data: string) {
    const iv = generateIv();
    const key = await generateKey(keyData);

    const encodedData = new TextEncoder().encode(data);

    const encodedContent = new Uint8Array(
        await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv,
                additionalData: new TextEncoder().encode(
                    encodeBase64(sha256(sha256(iv))),
                ),
            },
            key,
            encodedData,
        ),
    );

    const finalData = [...iv, ...encodedContent];
    return encodeBase64(Uint8Array.from(finalData));
}

export async function decryptData(keyData: string, encryptedData: string) {
    const key = await generateKey(keyData);
    const b64Decode = decodeBase64(encryptedData);

    const [iv, data] = [b64Decode.slice(0, 16), b64Decode.slice(16)];

    const content = new Uint8Array(
        await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv,
                additionalData: new TextEncoder().encode(
                    encodeBase64(sha256(sha256(iv))),
                ),
            },
            key,
            data,
        ),
    );

    return new TextDecoder().decode(content);
}

function generateIv() {
    const data = new Uint8Array(16);
    crypto.getRandomValues(data);
    return data;
}
