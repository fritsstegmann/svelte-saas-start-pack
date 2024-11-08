<script>
    import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
    import Button from './PrimaryButton.svelte';
</script>

<Meta
    title="Button"
    component={Button}
/>

<Template let:args>
    <Button {...args}>My test button</Button>
</Template>

<Story
    name="Primary"
    args={{
        disabled: false,
    }}
/>
<Story
    name="Disabled"
    args={{
        disabled: true,
    }}
/>
