<script lang="ts">
    import { fade } from 'svelte/transition';
    import PageHeader from './page_header.svelte';
    import Sidebar from './sidebar.svelte';

    export let data;
</script>

<div class="flex">
    <Sidebar profile={data.profile} />
    <div class="h-screen flex-grow overflow-y-scroll">
        <PageHeader />
        <div class="container mx-auto my-16">
            {#key data.pathname}
                <div
                    class="px-4 lg:mx-0"
                    transition:fade={{
                        duration: 100,
                    }}>
                    <slot />
                </div>
            {/key}
        </div>
    </div>
</div>
