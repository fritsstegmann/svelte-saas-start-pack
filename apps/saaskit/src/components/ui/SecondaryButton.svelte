<script>
import { Button } from "bits-ui";

/** @type {string} */
let clazz = "";
export { clazz as class };

/** @type {'submit' | 'button' } */
export let type = "button";

/** @type {string | undefined } */
export let formaction = undefined;

/** @type {boolean | undefined } */
export let disabled = undefined;
</script>

<Button.Root
    on:click
    {type}
    {disabled}
    {formaction}
    class={`border-primary-500 text-primary-500 hover:border-primary-400 focus:ring-primary-300 rounded-lg border-2 px-4 py-1 font-semibold shadow transition-all duration-200 focus:outline-none focus:ring disabled:cursor-no-drop disabled:opacity-40 ${clazz}`}
>
    <slot />
</Button.Root>
