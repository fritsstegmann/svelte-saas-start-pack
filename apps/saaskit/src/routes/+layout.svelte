<script lang="ts">
import "../app.scss";

const { children } = $props();
</script>

<div class="select-none">
    {@render children?.()}
</div>

<style lang="postcss">
    :global(body) {
        @apply bg-gray-100;
    }
</style>
