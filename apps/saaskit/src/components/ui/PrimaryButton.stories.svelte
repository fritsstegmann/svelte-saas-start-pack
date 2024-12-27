<script
    lang="ts"
    context="module"
>
import { defineMeta } from "@storybook/addon-svelte-csf";
import Button from "./PrimaryButton.svelte";

const { Story } = defineMeta({
    title: "Primary button",
    component: Button,
});
</script>

{#snippet buttonText()}
    Submit
{/snippet}

<Story
    name="Default"
    args={{
        disabled: false,
        children: buttonText,
    }}
></Story>

<Story
    name="Disabled"
    args={{ disabled: true, children: buttonText }}
/>
