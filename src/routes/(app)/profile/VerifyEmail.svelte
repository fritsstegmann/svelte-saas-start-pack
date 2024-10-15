<script>
    import Dialog from '$components/ui/Dialog.svelte';
    import PrimaryButton from '$components/ui/PrimaryButton.svelte';
    import SecureCodeInput from './SecureCodeInput.svelte';

    /**
     * @type {boolean}
     */
    export let show = false;

    /**
     * @type {string}
     */
    let value = '';

    $: console.info('value', value);
</script>

<Dialog
    card={true}
    description="Enter the validation code sent to the email address"
    bind:show
    class="w-96 bg-white p-2"
    title="Verify email"
    teleport={true}
    sticky={true}>
    <form method="post" action="?/verifyEmail" class="space-y-8">
        <SecureCodeInput name="code" size={6} bind:value />
        <div class="flex items-center justify-end space-x-2">
            <button
                type="button"
                on:click={() => {
                    show = false;
                }}
                class="block px-5 py-1 text-center">
                Cancel
            </button>
            <PrimaryButton type="submit">Verify</PrimaryButton>
        </div>
    </form>
</Dialog>
