<script lang="ts">
    import { fade } from 'svelte/transition';
    import PageHeader from './page_header.svelte';
    import { cubicIn, cubicOut } from 'svelte/easing';
    import Sidebar from '$components/ui/Sidebar.svelte';

    export let data;

    $: p = data.pathname.startsWith('/profile') ? 'profile' : data.pathname;

    const timing = 100;
</script>

<div class="flex">
    <Sidebar profile={data.profile} />
    <div class="h-screen flex-grow overflow-y-scroll">
        <PageHeader />

        <div class="container mx-auto my-16 px-8">
            {#key p}
                <div
                    in:fade={{
                        easing: cubicOut,
                        duration: timing,
                        delay: timing + 100,
                    }}
                    out:fade={{ easing: cubicIn, duration: timing }}
                >
                    <slot />
                </div>
            {/key}
        </div>
    </div>
</div>
