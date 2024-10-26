import type { ErrorBag } from '$lib/server/errors/ErrorBag';

export default function mapToErrorBag(errors: Record<string, { message: string; code: string }>): ErrorBag {
    return Object.entries(errors).reduce((acc: Record<string, string[]>, [key, value]) => {
        acc[key] = [value.message];
        return acc;
    }, {});
}
