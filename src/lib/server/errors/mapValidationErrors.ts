import type { ErrorBag } from '$lib/server/errors/ErrorBag';
import type { ZodIssue } from 'zod';

const mapValidationErrors = (errors: ZodIssue[] | undefined): ErrorBag =>
	(errors || []).reduce<Record<string, string[]>>((acc, err) => {
		acc[err.path[0]] = [err.message];

		return acc;
	}, {});

export default mapValidationErrors;
