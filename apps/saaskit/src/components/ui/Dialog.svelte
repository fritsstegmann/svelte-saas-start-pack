<script>
import { browser } from "$app/environment";
import CardHeader from "$components/ui/CardHeader.svelte";
import { onDestroy } from "svelte";
import Portal from "svelte-portal";
import { quintInOut } from "svelte/easing";
import { fade } from "svelte/transition";

/** @type {boolean} */
export let show = false;
/** @type {boolean} */
export let sticky = false;
/** @type {boolean} */
export let card = false;

/** @type {string | undefined} */
export let title;

/** @type {string | undefined} */
export let description = undefined;

/** @type {string | undefined} */
let clazz = undefined;
export { clazz as class };

/** @param {KeyboardEvent} event */
function closeDialog(event) {
    if (event.key === "Escape") {
        show = false;
    }
}

onDestroy(() => {
    if (browser) {
        window.document.body.style.removeProperty("overflow");
    }
});

$: if (browser) {
    if (show) {
        window.document.body.style.setProperty("overflow", "hidden");
    } else {
        window.document.body.style.removeProperty("overflow");
    }
}

const transitionDetails = {
    duration: 200,
    easing: quintInOut,
};
</script>

{#if show && browser}
    <Portal target={document.body}>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            on:keydown={closeDialog}
            class="fixed inset-0 z-10 bg-gray-900/50"
            on:click={() => (show = false)}
            in:fade={{
                duration: 50,
            }}
            on:keydown|stopPropagation={closeDialog}
        >
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
                class={`fixed inset-x-0 top-28 z-30 mx-auto overflow-hidden rounded-xl bg-white/50 shadow-xl ring ring-white/10 drop-shadow-xl backdrop-blur-xl backdrop-contrast-200 transition duration-300 ease-in-out dark:bg-gray-600/40 dark:ring-0 dark:ring-black/10 ${
                    clazz || ''
                }`}
                in:fade={transitionDetails}
                on:introstart
                on:introend
                on:keydown|stopPropagation={closeDialog}
                on:click|stopPropagation|self={() => {
                    if (!sticky) show = false;
                }}
                on:close={() => {
                    show = false;
                }}
            >
                {#if title}
                    <CardHeader
                        {title}
                        {description}
                    />
                {/if}
                {#if $$slots.default}
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                        class:p-4={card}
                        on:click|stopPropagation
                    >
                        <slot />
                    </div>
                {/if}
                {#if $$slots.footer && card === true}
                    <div class="px-4 py-4">
                        <slot name="footer" />
                    </div>
                {/if}
            </div>
        </div>
    </Portal>
{/if}
