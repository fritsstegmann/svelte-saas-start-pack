import { redirect } from '@sveltejs/kit';
import { passwordConfirmValid } from '../security/confirmPassword';

export function validateUserSession({
    locals,
    url,
}: {
    locals: App.Locals;
    url: URL;
}) {
    if (!locals.session) redirect(302, '/signin');
    if (!locals.user) redirect(302, '/signin');

    const { user, session } = locals;

    if (
        user.twoFaEnabled &&
        !session.twoFaVerified &&
        url.pathname !== '/2fa/verify'
    ) {
        redirect(302, '/2fa/verify');
    }

    return {
        user: locals.user,
        session: locals.session,
    };
}

export function validateConfirmedPassword(
    { locals }: { locals: App.Locals },
    redirectUrl: string
) {
    if (!locals.session) redirect(302, '/signin');
    if (!locals.user) redirect(302, '/signin');

    if (!passwordConfirmValid(locals.user.lastPasswordConfirmAt)) {
        redirect(302, `/confirm-password?redirect=/${redirectUrl}`);
    }
}
