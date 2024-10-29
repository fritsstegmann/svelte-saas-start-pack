import type { z, ZodType } from 'zod';
import FormValidationError from '$lib/server/errors/FormValidateError';
import validateFromRequest from '$lib/server/errors/validateFromRequest';
import { fail } from '@sveltejs/kit';

export default async function validate<T extends ZodType>(
    schema: T,
    request: Request
): Promise<
    | { isOk: true; fields: z.infer<T>; files: Record<string, File> }
    | {
          isOk: false;
          error: import('@sveltejs/kit').ActionFailure<{
              fields: z.infer<T>;
              errors: Record<keyof z.infer<T>, string[] | null>;
          }>;
      }
> {
    try {
        const { formData: fields, files } = await validateFromRequest(
            schema,
            request
        );

        return { isOk: true, fields, files };
    } catch (exception) {
        if (exception instanceof FormValidationError) {
            return {
                isOk: false,
                error: fail(422, {
                    fields: exception.fields as z.infer<T>,
                    errors: exception.errors as Record<
                        keyof z.infer<T>,
                        string[] | null
                    >,
                }),
            };
        }
        throw exception;
    }
}
