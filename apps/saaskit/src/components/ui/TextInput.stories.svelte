<script
    lang="ts"
    context="module"
>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Widget from './TextInput.svelte';

    const { Story } = defineMeta({
        title: 'Text input',
        component: Widget,
    });
</script>

{#snippet prefix()}
    prefix
{/snippet}

{#snippet suffix()}
    suffix
{/snippet}

<Story
    name="Default"
    args={{
        name: 'test',
    }}
/>

<Story
    name="With label"
    args={{
        name: 'test',
        label: 'Test',
    }}
/>

<Story
    name="With a prefix and suffix"
    args={{
        prefix,
        suffix,
    }}
></Story>

<Story
    name="With an error"
    args={{
        name: 'test',
        errorBag: {
            test: ['This is an error'],
        },
    }}
></Story>
