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
    <form method="post" action="?/uploadAvatar" enctype="multipart/form-data" class="space-y-6">
        <TextInput />
        <div class="flex items-center justify-between">
            <button
                type="button"
                on:click={() => {
                    show = false;
                }}
                class="block w-full px-3 py-2 text-center">
                Cancel
            </button>
            <PrimaryButton type="submit" class="w-full">Verify</PrimaryButton>
        </div>
    </form>
</Dialog>
