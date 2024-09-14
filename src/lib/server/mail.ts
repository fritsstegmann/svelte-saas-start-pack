import { MAIL_HOST, MAIL_PASSWORD, MAIL_USERNAME } from '$env/static/private';
import nodemailer from 'nodemailer';

export const sendMail = async (from: string, to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        service: MAIL_HOST,
        host: 'smtp.gmail.com',
        auth: {
            user: MAIL_USERNAME,
            pass: MAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: html,
    };

    await transporter.sendMail(mailOptions);
};
