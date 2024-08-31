<script>
    import Dialog from '$components/ui/Dialog.svelte';
    import PrimaryButton from '$components/ui/PrimaryButton.svelte';
    import SecondaryButton from '$components/ui/SecondaryButton.svelte';

    export let show = false;
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

<Dialog card={true} bind:show class="bg-white p-4" title="Upload avatar" teleport={true} sticky={true}>
    <div
        class="mt-4 flex h-32 w-full items-center justify-center rounded-md border-2 border-gray-400 bg-gray-300 p-4 text-gray-800">
        Drop image here
    </div>
    <input type="file" name="avatar" class="w-50 my-6 w-52" />
    <PrimaryButton class="w-full">Upload</PrimaryButton>
</Dialog>
