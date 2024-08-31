<script>
    import Dialog from '$components/ui/Dialog.svelte';
    import PrimaryButton from '$components/ui/PrimaryButton.svelte';
    import SecondaryButton from '$components/ui/SecondaryButton.svelte';

    /**
     * @type {boolean}
     */
    let show = $state(false);

    /**
     * @type {FileList | undefined}
     */
    let files = $state();
</script>

<div class="mt-12 flex flex-col items-center justify-center">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1"
        stroke="currentColor"
        class="size-40 text-gray-400">
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
    <SecondaryButton
        on:click={() => {
            show = true;
        }}>
        Upload avatar
    </SecondaryButton>
</div>

<Dialog card={true} bind:show class="w-72 bg-white p-4" title="Upload avatar" teleport={true} sticky={true}>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore event_directive_deprecated -->
    <div
        on:dragover={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}
        on:drop={(e) => {
            e.preventDefault();
            e.stopPropagation();

            files = e.dataTransfer?.files;
        }}
        class:border-primary-400={files}
        class:text-primary-800={files}
        class:bg-purple-50={files}
        class:border-gray-400={!files}
        class:text-gray-800={!files}
        class:bg-gray-300={!files}
        class="mt-4 flex h-32 w-full items-center justify-center rounded-md border-2 p-4">
        {#if files}
            {files[0].name}
        {:else}
            Drop image here
        {/if}
    </div>
    <form method="post" action="?/uploadAvatar" enctype="multipart/form-data">
        <input type="file" name="avatar" class="mt-6" bind:files />
        <PrimaryButton
            on:click={() => {
                show = false;
            }}
            class="mt-6 w-full">
            Upload
        </PrimaryButton>
    </form>
    <!-- svelte-ignore event_directive_deprecated -->
    <button
        on:click={() => {
            show = false;
        }}
        class="mt-3 w-full text-center">
        Cancel
    </button>
</Dialog>
