<script lang="ts">
import SecureCodeInputElement from "./SecureCodeInputElement.svelte";

export let name: string | undefined = undefined;
export let size: number;
export let value: string | undefined = undefined;

export let values: Array<string> = Array(size);

let ref: HTMLDivElement;

const codes: string[] = Array(size);

export let errorBag: import("./ErrorBag").ErrorBag | undefined = undefined;

function findFocusedItem(): HTMLDivElement | null {
    const focusItem: HTMLDivElement | null = ref.querySelector(
        "div:has(input:focus)",
    );

    return focusItem;
}

const keyDown = ({ detail }: { detail: string }) => {
    const focusItem = findFocusedItem();
    if (focusItem) {
        const index = Array.prototype.indexOf.call(ref.children, focusItem);

        codes[index] = detail;

        const nextIndex = index + 2;
        const nextItem: HTMLDivElement | null = ref.querySelector(
            `div:nth-child(${nextIndex})`,
        );

        if (nextItem === null) {
            focusItem.blur();
            value = codes.join("");
        } else {
            nextItem.focus();
        }
    }
};

let width = size * 5;
</script>

<div
    bind:this={ref}
    style={`max-width: ${width}rem;`}
    class="flex items-center justify-around space-x-2"
>
    <input
        type="hidden"
        {name}
        {value}
    />
    {#each { length: size } as _, i}
        <SecureCodeInputElement
            on:update={keyDown}
            bind:value={values[i]}
            on:paste={(e) => {
                if (i == 0 && e.detail.length == size) {
                    values.forEach((_: string, i: number) => {
                        values[i] = e.detail[i];
                    });

                    values = [...values];
                    value = values.join('');

                    findFocusedItem()?.blur();
                }
            }}
            on:clear={() => {
                const focusItem: HTMLDivElement | null = findFocusedItem();
                if (focusItem) {
                    const index = Array.prototype.indexOf.call(
                        ref.children,
                        focusItem
                    );

                    const nextIndex = index - 1;
                    const nextItem: HTMLDivElement | null = ref.querySelector(
                        'div:nth-child(' + nextIndex + ')'
                    );

                    if (nextItem === null) {
                        focusItem.blur();
                        value = codes.join('');
                    } else {
                        nextItem.focus();
                    }
                }
            }}
        />
    {/each}
</div>
<ul class="pt-2 font-semibold">
    {#if name && errorBag && errorBag[name]}
        <li class="text-ms mt-1 text-red-500">{errorBag[name]}</li>
    {/if}
</ul>
