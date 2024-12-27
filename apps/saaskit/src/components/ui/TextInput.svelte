<script lang="ts">
import type { Snippet } from "svelte";
import InputLabel from "./InputLabel.svelte";

let {
    id,
    name,
    label,
    value,
    placeHolder,
    type = "text",
    errorBag,
    defaultValue,
    class: clazz,
    prefix,
    suffix,
    hint,
}: Partial<{
    id: string | undefined;
    name: string | undefined;
    label: string | undefined;
    value: string | undefined;
    placeHolder: string | undefined;
    type: "text" | "password" | "file";
    errorBag: import("./ErrorBag").ErrorBag | undefined;
    defaultValue: string | undefined;
    class: string | undefined;
    prefix: Snippet;
    suffix: Snippet;
    hint: Snippet;
}> = $props();

if (value === undefined && typeof defaultValue === "string") {
    value = defaultValue;
}

let reference: HTMLInputElement | undefined;
</script>

<div>
    {#if label}
        <InputLabel {id}>
            {label}
        </InputLabel>
    {/if}
    <div
        onfocusin={() => {
            reference?.focus();
        }}
        class={`focus-within:border-primary-500 focus-within:ring-primary-300 dark:focus-within:border-primary-800 dark:focus-within:ring-primary-500 flex h-10 items-center rounded-md border-2 border-gray-300 bg-white transition duration-300 focus-within:ring-2 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-200 ${clazz}`}
    >
        <div
            tabindex={-1}
            role="button"
            onfocusin={() => {
                reference?.focus();
            }}
            class="mr-2 cursor-text px-3 py-1 empty:hidden"
        >
            {@render prefix?.()}
        </div>
        <input
            bind:this={reference}
            {id}
            {name}
            {type}
            autocomplete="off"
            oninput={() => {
                if (errorBag && name && errorBag[name]) {
                    errorBag[name] = null;
                }
            }}
            data-lpignore
            placeholder={placeHolder}
            class="w-full flex-grow bg-inherit px-2 py-1 focus:outline-none"
            bind:value
        />
        <div
            tabindex={-1}
            role="button"
            onfocusin={() => {
                reference?.focus();
            }}
            class="mr-2 flex cursor-text px-3 py-1 empty:hidden"
        >
            {@render suffix?.()}
        </div>
    </div>
    {@render hint?.()}
    {#if name && errorBag && errorBag[name]}
        <div class="text-ms mt-1 font-semibold text-red-500 dark:text-red-600">
            {errorBag[name]}
        </div>
    {/if}
</div>
