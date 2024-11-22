<script>
    /** @type {string} title */
    export let title;
    /** @type {string | undefined} */
    export let description;
</script>

<div class="px-4 pt-4 text-gray-600 dark:text-gray-400">
    <div class="text-xl font-semibold">{title}</div>
    {#if description}
        <div class="text-base font-medium text-gray-500">{description}</div>
    {/if}
</div>
