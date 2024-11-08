<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    let currentKey = '';

    const dispatch = createEventDispatcher();
</script>

<div
    tabindex={-1}
    role="button"
    on:keydown={(e) => {
        if (e.ctrlKey && e.code === 'KeyV') {
            // TODO: implement copy pasta
            // TODO: get value from clipboard
            // TODO: validate clipbaord content
            // TODO: send clipboard content to parent
            // TODO: parent to popuplate contents of inputs
        }

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
    class="flex h-12 w-10 select-none items-center justify-center rounded-lg bg-white text-base shadow focus:outline-none focus:ring focus:ring-purple-500 dark:bg-gray-600 dark:text-gray-200"
>
    {currentKey}
</div>
