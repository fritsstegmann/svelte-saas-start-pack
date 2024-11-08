<script lang="ts">
    import { fade } from 'svelte/transition';
    import { cubicIn, cubicOut } from 'svelte/easing';
    import { onNavigate } from '$app/navigation';

    export let data;

    $: p = data.pathname;

    const timing = 100;

    onNavigate((navigation) => {
        if (!document.startViewTransition) return;

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            });
        });
    });
</script>

<div class="text-gray-900">
    <div class="text-xl">Profile settings</div>
    <div class="text-sm text-gray-800">
        Update your user &amp; account settings
    </div>
</div>
<hr class="my-6" />
<div class="mx-auto flex w-full">
    <aside class="mr-8 min-w-64">
        <ul class="space-y-4">
            <li>
                <a
                    data-sveltekit-replacestate
                    class="block rounded-lg px-5 py-3 font-semibold text-gray-700 transition duration-300 hover:bg-primary-200 hover:text-primary-700"
                    href="/profile/details">
                    Details
                </a>
            </li>
            <li>
                <a
                    data-sveltekit-replacestate
                    class="block rounded-lg px-5 py-3 font-semibold text-gray-700 transition duration-300 hover:bg-primary-200 hover:text-primary-700"
                    href="/profile/security">
                    Security
                </a>
            </li>
        </ul>
    </aside>
    <div class="mx-auto max-w-4xl flex-grow">
        {#key p}
            <div
                in:fade={{
                    easing: cubicOut,
                    duration: timing,
                    delay: timing + 100,
                }}
                out:fade={{ easing: cubicIn, duration: timing }}>
                <slot />
            </div>
        {/key}
    </div>
</div>
