import { TokenBucket } from "$lib/server/ratelimit";
import { passwordConfirmValid } from "$lib/server/security/confirmPassword";
import { encodeBase64 } from "@oslojs/encoding";
import { createTOTPKeyURI } from "@oslojs/otp";
import { error, redirect } from "@sveltejs/kit";
import { renderSVG } from "uqr";
import type { PageServerLoadEvent } from "../$types";

export async function load({ locals, getClientAddress }: PageServerLoadEvent) {
    if (!locals.user) redirect(302, "/signin");

    if (!passwordConfirmValid(locals.user.lastPasswordConfirmAt)) {
        redirect(302, "/confirm-password?redirect=/profile/security");
    }

    const bucket = new TokenBucket("verifyEmail", 1, 1);
    if (!(await bucket.consume(getClientAddress(), 1))) {
        error(429);
    }

    const totpKey = new Uint8Array(20);
    crypto.getRandomValues(totpKey);
    const encodedKey = encodeBase64(totpKey);

    const keyURI = createTOTPKeyURI(
        "SaasKit",
        locals.user.userName,
        totpKey,
        30,
        6,
    );

    const qrCode = renderSVG(keyURI);

    return {
        encodedKey,
        qrCode,
    };
}
