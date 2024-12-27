<script
    lang="ts"
    context="module"
>
import { defineMeta } from "@storybook/addon-svelte-csf";
import Widget from "./SecureCodeInput.svelte";

const { Story } = defineMeta({
    title: "Secure code input",
    component: Widget,
});
</script>

<Story
    name="Default"
    args={{
        size: 6,
    }}
></Story>
