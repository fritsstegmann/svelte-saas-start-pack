<script lang="ts">
import { onNavigate } from "$app/navigation";
import { cubicIn, cubicOut } from "svelte/easing";
import { fade } from "svelte/transition";
import { PageData, type PageParentData } from "./$types";

let { data }: { data: PageData | PageParentData } = $props();

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
<div class="mx-auto flex w-full flex-col sm:flex-row">
    <aside class="mr-8 min-w-64">
        <ul class="mb-10 space-y-4">
            <li>
                <a
                    data-sveltekit-replacestate
                    class="hover:bg-primary-200 hover:text-primary-700 block rounded-lg px-5 py-3 font-semibold text-gray-700 transition duration-300"
                    href="/profile/details"
                >
                    Details
                </a>
            </li>
            <li>
                <a
                    data-sveltekit-replacestate
                    class="hover:bg-primary-200 hover:text-primary-700 block rounded-lg px-5 py-3 font-semibold text-gray-700 transition duration-300"
                    href="/profile/settings"
                >
                    App Settings
                </a>
            </li>
            <li>
                <a
                    data-sveltekit-replacestate
                    class="hover:bg-primary-200 hover:text-primary-700 block rounded-lg px-5 py-3 font-semibold text-gray-700 transition duration-300"
                    href="/profile/security"
                >
                    Security
                </a>
            </li>
        </ul>
    </aside>
    <div class="mx-auto max-w-4xl flex-grow">
        {#key data.pathname}
            <div
                in:fade={{
                    easing: cubicOut,
                    duration: timing,
                    delay: timing + 100,
                }}
                out:fade={{ easing: cubicIn, duration: timing }}
            >
                {@render children?.()}
            </div>
        {/key}
    </div>
</div>
