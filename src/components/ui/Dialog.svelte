<script>
    import CardHeader from '$components/ui/CardHeader.svelte';
    import { browser } from '$app/environment';
    import { fade } from 'svelte/transition';
    import Portal from 'svelte-portal';
    import { onDestroy } from 'svelte';

    /** @type {boolean} */
    export let show = false;
    /** @type {boolean} */
    export let sticky = false;
    /** @type {boolean} */
    export let card = false;
    /** @type {string | undefined} */
    export let title;
    /** @type {boolean | undefined} */
    export let teleport = false;
    /** @type {string | undefined} */
    let clazz = undefined;
    export { clazz as class };

    /** @type {HTMLDialogElement} */
    let dialog;

    /** @param {KeyboardEvent} event */
    function closeDialog(event) {
        if (event.key === 'Escape') {
            show = false;
        }
    }

    onDestroy(() => {
        if (browser) {
            window.document.body.style.removeProperty('overflow');
        }
    });

    $: if (browser) {
        if (show) {
            window.document.body.style.setProperty('overflow', 'hidden');
        } else {
            window.document.body.style.removeProperty('overflow');
        }
    }
</script>

{#if show && browser}
    {#if teleport}
        <Portal target={document.body}>
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
                on:keydown={closeDialog}
                class="fixed inset-0 z-10 bg-gray-900/50"
                on:click={() => (show = false)}
                on:keydown|stopPropagation={closeDialog}>
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
            <dialog
                transition:fade={{ duration: 200 }}
                class={`fixed inset-x-0 top-28 z-30 overflow-hidden rounded-md bg-white/75 shadow-xl ring ring-white/10 drop-shadow-xl backdrop-blur-xl ease-in-out dark:bg-gray-600/40 dark:ring-0 dark:ring-black/10 ${
                    clazz || ''
                }`}
                class:block={show}
                class:hidden={!show}
                on:keydown|stopPropagation={closeDialog}
                bind:this={dialog}
                on:click|stopPropagation|self={() => !sticky && dialog?.close()}
                on:close={() => {
                    show = false;
                }}>
                {#if title}
                    <CardHeader {title} />
                {/if}
                {#if $$slots.default}
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class:p-4={card} on:click|stopPropagation>
                        <slot />
                    </div>
                {/if}
                {#if $$slots.footer && card === true}
                    <div class="px-4 py-4">
                        <slot name="footer" />
                    </div>
                {/if}
            </dialog>
        </Portal>
    {:else}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            on:keydown={closeDialog}
            class="fixed inset-0 z-10 bg-gray-900/50"
            on:click={() => (show = false)}
            on:keydown|stopPropagation={closeDialog}>
        </div>

        <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
        <dialog
            transition:fade={{ duration: 200 }}
            class={`fixed inset-x-0 top-28 z-30 overflow-hidden rounded-md bg-gray-100/75 shadow-xl ring ring-white/10 drop-shadow-xl backdrop-blur-xl ease-in-out dark:bg-gray-600/40 dark:ring-0 dark:ring-black/10 ${
                clazz || ''
            }`}
            class:block={show}
            class:hidden={!show}
            on:keydown|stopPropagation={closeDialog}
            bind:this={dialog}
            on:click|stopPropagation|self={() => !sticky && dialog?.close()}
            on:close={() => {
                show = false;
            }}>
            {#if title}
                <CardHeader {title} />
            {/if}
            {#if $$slots.default}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class:p-4={card} on:click|stopPropagation>
                    <slot />
                </div>
            {/if}
            {#if $$slots.footer && card === true}
                <div class="px-4 py-4">
                    <slot name="footer" />
                </div>
            {/if}
        </dialog>
    {/if}
{/if}
