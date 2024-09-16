import type { z, ZodType } from 'zod';
import FormValidationError from '$lib/server/errors/FormValidateError';
import validateFromRequest from '$lib/server/errors/validateFromRequest';
import { fail } from '@sveltejs/kit';

export default async function validate<T extends ZodType>(
    schema: T,
    request: Request
): Promise<
    | { success: true; fields: z.infer<T>; files: Record<string, File> }
    | {
          success: false;
          error: import('@sveltejs/kit').ActionFailure<{
              fields: Record<string, unknown>;
              errors: Record<string, string[] | null>;
          }>;
      }
> {
    try {
        const { formData: fields, files } = await validateFromRequest(schema, request);

        return { success: true, fields, files };
    } catch (exception) {
        if (exception instanceof FormValidationError) {
            return {
                success: false,
                error: fail(422, {
                    fields: exception.fields,
                    errors: exception.errors,
                }),
            };
        }
        throw exception;
    }
}
