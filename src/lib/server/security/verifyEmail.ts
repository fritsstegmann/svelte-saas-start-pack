import { db } from '../db';
import { sendMail } from '../mail';
import { emailValidationTable } from '../schema';
import { generateHashFromCode, generateShortCode } from './utils';
import { add } from 'date-fns';

export async function sendEmailVerificationCode(email: string, userId: number) {
    const code = generateShortCode();
    const expiresAt = add(new Date(), {
        minutes: 1,
    });

    const hashedCode = generateHashFromCode(code);

    await db.insert(emailValidationTable).values({
        userId,
        code: hashedCode,
        email,
        expiresAt,
    });

    await sendMail('saaskit@example.com', email, 'Forgot password email', `Verifcation code for email: ${code}`);
}
