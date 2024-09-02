import * as kit from '@sveltejs/kit';
import type { z, ZodType } from 'zod';
import FormValidationError from '$lib/server/errors/FormValidateError';
import validateFromRequest from '$lib/server/errors/validateFromRequest';

type ExtendedRequestEvent<
    T extends Partial<Record<string, string>>,
    R extends string | null,
    Z extends ZodType,
> = kit.RequestEvent<T, R> & {
    formData: z.infer<Z>;
    files: Record<string, File>;
};

export type ExtendedAction<
    Z extends ZodType,
    Params extends Partial<Record<string, string>> = Partial<Record<string, string>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OutputData extends Record<string, any> | void = Record<string, any> | void,
    RouteId extends string | null = string | null,
> = (event: ExtendedRequestEvent<Params, RouteId, Z>) => Promise<OutputData>;

const validation = <T extends ZodType>(schema: T, func: ExtendedAction<T>) => {
    return async (event: kit.RequestEvent) => {
        try {
            const { formData, files } = await validateFromRequest(schema, event.request);

            return await func({ ...event, formData, files });
        } catch (exception) {
            if (exception instanceof FormValidationError) {
                if (event.request.headers.get('Content-Type') === 'application/json') {
                    return kit.json(
                        {
                            fields: exception.fields,
                            errors: exception.errors,
                        },
                        {
                            status: 422,
                        }
                    );
                } else {
                    return kit.fail(422, {
                        fields: exception.fields,
                        errors: exception.errors,
                    });
                }
            }
            throw exception;
        }
    };
};

export default validation;
