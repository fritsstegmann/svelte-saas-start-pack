<script lang="ts">
    import PageHeader from './page_header.svelte';
    import Sidebar from './sidebar.svelte';

    export let data;
</script>

<div class="flex">
    <Sidebar profile={data.profile} />
    <div class="h-screen flex-grow overflow-y-scroll">
        <PageHeader />
        <div class="container mx-auto my-16">
            <div class="px-4 lg:mx-0">
                <slot />
            </div>
        </div>
    </div>
</div>
