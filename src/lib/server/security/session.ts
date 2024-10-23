import { eq } from 'drizzle-orm';
import { sessionTable, usersTable } from '../schema';
import { generateHashFromCode, generateSecureCode } from './utils';
import { db } from '../db';

const daysValid = 2;

export function generateSessionToken(): string {
    return generateSecureCode();
}

export async function createSession(token: string, userId: string): Promise<Session> {
    const session = {
        id: token,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * daysValid), // 2 days
    };

    await db.insert(sessionTable).values({
        id: generateHashFromCode(session.id),
        userId: session.userId,
        expiresAt: session.expiresAt,
    });

    return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidateResult> {
    const sessionId = generateHashFromCode(token);
    const result = await db
        .select({ user: usersTable, session: sessionTable })
        .from(sessionTable)
        .innerJoin(usersTable, eq(sessionTable.userId, usersTable.id))
        .where(eq(sessionTable.id, sessionId));

    if (result.length < 1) {
        return null;
    }

    const { session, user } = result[0];

    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
        return null;
    }

    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 25 * (daysValid / 2)) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * daysValid);
        await db
            .update(sessionTable)
            .set({
                expiresAt: session.expiresAt,
            })
            .where(eq(sessionTable.id, session.id));
    }

    return { session, user };
}

export async function invalidateSession(token: string): Promise<void> {
    const sessionId = generateHashFromCode(token);
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export type SessionValidateResult = {
    session: Session;
    user: User;
} | null;

export type User = {
    id: string;
    userName: string;
};

export type Session = {
    id: string;
    userId: string;
    expiresAt: Date;
};
