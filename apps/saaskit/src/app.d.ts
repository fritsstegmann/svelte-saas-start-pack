// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user: {
                id: string;
                userName: string;
                lastPasswordConfirmAt: Date | null;
                twoFaEnabled: boolean | null;
            } | null;
            session: {
                id: string;
                userId: string;
                expiresAt: Date;
                twoFaVerified: boolean | null;
            } | null;
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
