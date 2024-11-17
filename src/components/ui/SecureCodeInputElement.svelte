<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let value = '';

    let ref: HTMLDivElement | undefined = undefined;

    const dispatch = createEventDispatcher();
</script>

<div
    tabindex="-1"
    role="button"
    onfocus={() => {
        if (ref) {
            ref.focus();
        }
    }}
    class="flex h-12 w-10 select-none items-center justify-center rounded-lg bg-white text-base shadow focus-within:outline-none focus-within:ring focus-within:ring-purple-500 dark:bg-gray-600 dark:text-gray-200"
>
    <input
        bind:this={ref}
        type="text"
        onpaste={async (e) => {
            const v = e.clipboardData?.getData('text/plain');
            dispatch('paste', v);
        }}
        onkeydown={async (e) => {
            if (e.code == 'Backspace') {
                e.stopPropagation();
                e.preventDefault();
                if (value != '') {
                    dispatch('clear');
                    value = '';
                    return;
                }
            }
            if (e.ctrlKey == false && e.key.match(/^[a-z0-9]{1}$/)) {
                e.stopPropagation();
                e.preventDefault();
                dispatch('update', e.key);
                value = e.key;
                return;
            }
        }}
        class="color-transparent width-0 hidden-0 sr-only bg-transparent"
    />
    {value}
</div>
