export default class FormValidationError extends Error {
    constructor(
        public readonly errors: Record<string, string[] | null>,
        public readonly fields: Record<string, unknown>,
    ) {
        super();
    }
}
