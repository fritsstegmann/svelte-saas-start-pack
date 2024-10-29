import { db } from '../db';
import { sendMail } from '../mail';
import { emailValidationTable } from '../schema';
import { generateHashFromCode, generateShortCode } from './utils';
import { add } from 'date-fns';

export async function sendEmailVerificationCode(email: string, userId: string) {
    const code = generateShortCode();
    const expiresAt = add(new Date(), {
        minutes: 1,
    });

    const hashedCode = generateHashFromCode(code);

    await db.insert(emailValidationTable).values({
        id: hashedCode,
        userId: userId,
        email,
        expiresAt,
    });

    await sendMail(
        'saaskit@example.com',
        email,
        'Forgot password email',
        `Verifcation code for email: ${code}`
    );
}
