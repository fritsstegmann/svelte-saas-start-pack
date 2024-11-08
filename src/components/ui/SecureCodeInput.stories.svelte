<script>
    import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
    import SecureCodeInput from './SecureCodeInput.svelte';
</script>

<Meta
    title="Secure code input"
    component={SecureCodeInput}
/>

<Template let:args>
    <div class="flex justify-center">
        <div class="w-80">
            <SecureCodeInput
                size={6}
                {...args}
            >
                My test button
            </SecureCodeInput>
        </div>
    </div>
</Template>

<Story
    name="Primary"
    args={{
        disabled: false,
    }}
/>
<Story
    name="With error"
    args={{
        name: 'test',
        errorBag: {
            test: ['This is an error'],
        },
    }}
/>
