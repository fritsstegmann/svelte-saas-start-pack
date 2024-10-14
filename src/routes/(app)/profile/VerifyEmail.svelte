<script>
    import Dialog from '$components/ui/Dialog.svelte';
    import PrimaryButton from '$components/ui/PrimaryButton.svelte';
    import TextInput from '$components/ui/TextInput.svelte';

    /**
     * @type {boolean}
     */
    export let show = false;
</script>

<Dialog card={true} bind:show class="w-96 bg-white p-2" title="Verify email" teleport={true} sticky={true}>
    <form method="post" action="?/uploadAvatar" enctype="multipart/form-data" class="space-y-5">
        <TextInput />
        <div class="flex items-center justify-end space-x-3">
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
