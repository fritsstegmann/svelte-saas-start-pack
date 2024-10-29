// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user: {
                id: string;
                userName: string;
                lastPasswordConfirmAt: Date;
            } | null;
            session: {
                id: string;
                userId: string;
                expiresAt: Date;
            } | null;
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
