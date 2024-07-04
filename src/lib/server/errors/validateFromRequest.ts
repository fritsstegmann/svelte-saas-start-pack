import { z } from 'zod';
import FormValidationError from '$lib/server/errors/FormValidateError';
import mapValidationErrors from '$lib/server/errors/mapValidationErrors';

function objectFromFormData(formData: FormData): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	formData.forEach((value, key) => {
		if (!(value instanceof File)) {
			if (key.endsWith('[]')) {
				const arrayKey = key.replace('[]', '');
				if (!result[arrayKey]) {
					result[arrayKey] = [];
				}
				if (value === '') {
					(result[arrayKey] as unknown[]).push(null);
				} else {
					(result[arrayKey] as unknown[]).push(value);
				}
			} else {
				if (value === '') {
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
	body: Record<string, unknown> | FormData
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
				throw new FormValidationError(mapValidationErrors(e.errors), objectFromFormData(body));
			} else {
				throw new FormValidationError(mapValidationErrors(e.errors), body);
			}
		}

		throw new FormValidationError(mapValidationErrors([]), {});
	}
}

export default async function validateFromRequest<T>(
	schema: z.ZodType<T>,
	request: Request
): Promise<T> {
	let formData;
	if (request.headers.get('Content-Type') === 'application/json') {
		formData = await request.json();
	} else {
		formData = await request.formData();
	}

	return await validateForm<z.infer<typeof schema>>(schema, formData);
}
