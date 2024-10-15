<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    let currentKey = '';

    const dispatch = createEventDispatcher();
</script>

<div
    tabindex={-1}
    role="button"
    on:keydown={(e) => {
        if (e.code == 'Backspace') {
            if (currentKey != '') {
                dispatch('clear');
                currentKey = '';
                return;
            }
        }
        if (e.key.match(/^[a-z0-9]{1}$/)) {
            dispatch('update', e.key);
            currentKey = e.key;
            return;
        }
    }}
    class="flex h-12 w-10 select-none items-center justify-center rounded-lg bg-white text-base shadow focus:outline-none focus:ring focus:ring-purple-500">
    {currentKey}
</div>
