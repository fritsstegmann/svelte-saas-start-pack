<script>
    import { Button } from 'bits-ui';
    /** @type {string} */
    let clazz = '';
    export { clazz as class };
</script>

<Button.Root
    on:click
    class={`rounded-lg bg-primary-500 px-3 py-2 font-semibold text-white shadow transition-all duration-200 hover:bg-primary-400 focus:outline-none focus:ring focus:ring-primary-300 ${clazz}`}>
    <slot />
</Button.Root>
