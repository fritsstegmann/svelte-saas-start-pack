import { sha256 } from '@oslojs/crypto/sha2';
import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';

type SecureCode = string;

export function generateShortCode(): SecureCode {
    const tokenBytes = new Uint8Array(4);
    crypto.getRandomValues(tokenBytes);
    const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
    return token;
}
export function generateSecureCode(): SecureCode {
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
    return token;
}

export function generateHashFromCode(token: SecureCode): string {
    return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export async function hashPassword(password: string): Promise<string> {
    const hPassword = await hash(password, {
        // recommended minimum parameters
        memoryCost: 39456,
        timeCost: 6,
        outputLen: 32,
        parallelism: 1,
    });

    return hPassword;
}
