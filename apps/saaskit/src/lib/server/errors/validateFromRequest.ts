import FormValidationError from "$lib/server/errors/FormValidateError";
import mapValidationErrors from "$lib/server/errors/mapValidationErrors";
import { z } from "zod";

function filesFromFormData(formData: FormData): Record<string, File> {
    const results: Record<string, File> = {};

    formData.forEach((value, key) => {
        if (value instanceof File) {
            results[key] = value;
        }
    });

    return results;
}

function objectFromFormData(formData: FormData): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    formData.forEach((value, key) => {
        if (!(value instanceof File)) {
            if (key.endsWith("[]")) {
                const arrayKey = key.replace("[]", "");
                if (!result[arrayKey]) {
                    result[arrayKey] = [];
                }
                if (value === "") {
                    (result[arrayKey] as unknown[]).push(null);
                } else {
                    (result[arrayKey] as unknown[]).push(value);
                }
            } else {
                if (value === "") {
                    result[key] = null;
                } else {
                    result[key] = value;
                }
            }
        } else {
            result[key] = value;
        }
    });

    return result;
}

async function validateForm<T>(
    schema: z.ZodType<T>,
    body: Record<string, unknown> | FormData,
): Promise<T> {
    try {
        if (body instanceof FormData) {
            const requestData = objectFromFormData(body);
            const result = await schema.parseAsync(requestData);

            return result;
        }

        return await schema.parseAsync(body);
    } catch (e) {
        if (e instanceof z.ZodError) {
            if (body instanceof FormData) {
                throw new FormValidationError(
                    mapValidationErrors(e.errors),
                    objectFromFormData(body),
                );
            }
            throw new FormValidationError(mapValidationErrors(e.errors), body);
        }

        throw new FormValidationError(mapValidationErrors([]), {});
    }
}

export default async function validateFromRequest<T, K extends string>(
    schema: z.ZodType<T>,
    request: Request,
): Promise<{
    formData: T;
    files: Record<K, File>;
}> {
    let formData: FormData;
    let files: Record<K, File> = {} as Record<K, File>;
    if (request.headers.get("Content-Type") === "application/json") {
        formData = await request.json();
    } else {
        formData = await request.formData();
        files = filesFromFormData(formData);
    }

    const validatedData = await validateForm<z.infer<typeof schema>>(
        schema,
        formData,
    );

    return { formData: validatedData, files };
}
