<script lang="ts">
    import PageHeader from './page_header.svelte';
    import Sidebar from './sidebar.svelte';

    export let data;
</script>

<div class="flex">
    <Sidebar />
    <div class="flex-grow">
        <PageHeader {data} />
        <div class="container mx-auto my-16">
            <div class="mx-4 lg:mx-0">
                <slot />
            </div>
        </div>
    </div>
</div>
