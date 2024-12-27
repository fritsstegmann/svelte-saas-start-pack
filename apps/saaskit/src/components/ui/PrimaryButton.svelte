<script lang="ts">
import { Button } from "bits-ui";
import type { Snippet } from "svelte";

let {
    children,
    type = "button",
    formaction = undefined,
    disabled = false,
    class: clazz = "",
    onclick = undefined,
    ...rest
}: Partial<{
    onclick: <T>(
        e: MouseEvent & {
            currentTarget: EventTarget & T;
        },
    ) => void;
    disabled: boolean;
    formaction: string;
    children: Snippet;
    class: string;
    type: "submit" | "button";
}> = $props();
</script>

<Button.Root
    {...rest}
    {type}
    {onclick}
    {disabled}
    {formaction}
    class={`border-primary-500 bg-primary-500 hover:border-primary-400 hover:bg-primary-400 focus:ring-primary-300 dark:border-primary-300 dark:bg-primary-300 dark:text-primary-800 rounded-lg border-2 px-4 py-1 font-bold text-white shadow transition-all duration-200 focus:outline-none focus:ring disabled:cursor-no-drop disabled:opacity-50 ${clazz}`}
>
    {@render children?.()}
</Button.Root>
