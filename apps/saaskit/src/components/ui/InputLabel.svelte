<script>
    import { Label } from 'bits-ui';

    /** @type {string | undefined} id */
    export let id = undefined;
</script>

<Label.Root
    for={id}
    class="mb-1 text-gray-600/90 dark:text-gray-300"
>
    <slot />
</Label.Root>
