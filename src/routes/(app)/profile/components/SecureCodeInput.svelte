<script>
    import SecureCodeInputElement from './SecureCodeInputElement.svelte';

    /**
     * @type {string | undefined}
     */
    export let name = undefined;

    /**
     * @type {number}
     */
    export let size;

    /**
     * @type {string | undefined}
     */
    export let value = undefined;

    /**
     * @type {HTMLDivElement}
     */
    let ref;

    /**
     * @type {string[]}
     */
    const codes = Array(size);

    /** @type {import('../../../../components/ui/ErrorBag').ErrorBag | undefined} */
    export let errorBag = undefined;

    /**
     * @param {{detail: string}} param0
     */
    const keyDown = ({ detail }) => {
        /**
         * @type {HTMLDivElement | null}
         */
        const focusItem = ref.querySelector('div:focus');
        if (focusItem) {
            const index = Array.prototype.indexOf.call(ref.children, focusItem);

            codes[index] = detail;

            const nextIndex = index + 2;
            /**
             * @type {HTMLDivElement | null}
             */
            const nextItem = ref.querySelector(
                'div:nth-child(' + nextIndex + ')'
            );

            if (nextItem === null) {
                focusItem.blur();
                value = codes.join('');
            } else {
                nextItem.focus();
            }
        }
    };
</script>

<div
    bind:this={ref}
    class="flex items-center justify-around space-x-2"
>
    <input
        type="hidden"
        {name}
        {value}
    />
    {#each { length: size } as _}
        <SecureCodeInputElement
            on:update={keyDown}
            on:clear={() => {}}
        />
    {/each}
</div>
<ul class="ms-2 pt-2 font-semibold">
    {#if name && errorBag && errorBag[name]}
        <li class="text-ms mt-1 text-red-500">{errorBag[name]}</li>
    {/if}
</ul>
