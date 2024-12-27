import { sha1 } from "@noble/hashes/sha1";
import { sha512 } from "@noble/hashes/sha512";

export function checkUrlSignature(rawUrl: string, salt: string) {
    const [url, signature] = rawUrl.split("&signature=");

    const gSignature = generateSignature(url, salt);

    return gSignature === signature;
}

export function createUrlWithSignature(url: string, salt: string): string {
    const signature = generateSignature(url, salt);

    return `${url}&signature=${signature.toString()}`;
}

function generateSignature(code: string, salt: string): string {
    const signature = sha1(sha512(code + salt) + code);

    return signature.toString();
}
