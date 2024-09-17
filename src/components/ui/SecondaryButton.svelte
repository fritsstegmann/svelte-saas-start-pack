<script>
    import { Button } from 'bits-ui';

    /** @type {string} */
    let clazz = '';
    export { clazz as class };

    /** @type {'submit' | 'button' } */
    export let type = 'button';
</script>

<Button.Root
    on:click
    {type}
    class={`rounded-lg border-2 border-primary-500 px-5 py-2 font-semibold text-primary-500 shadow transition-all duration-200 hover:border-primary-400 focus:outline-none focus:ring focus:ring-primary-300 ${clazz}`}>
    <slot />
</Button.Root>
