<script>
    import PrimaryButton from '$components/ui/PrimaryButton.svelte';
    import SecondaryButton from '$components/ui/SecondaryButton.svelte';
    import TextInput from '$components/ui/TextInput.svelte';
    import { fade } from 'svelte/transition';
    import ProfileAvatarUpload from './ProfileAvatarUpload.svelte';
    import { quintInOut } from 'svelte/easing';

    export let data;
    export let form;
</script>

<div class="mx-auto max-w-3xl">
    <ProfileAvatarUpload profile={data.profile} />

    {#if form?.message}
        {#if form?.message.type == 'success'}
            <div
                transition:fade={{
                    easing: quintInOut,
                    duration: 200,
                    delay: 0.3,
                }}
                class="flex items-center justify-between rounded-lg border border-green-500 bg-green-100 px-5 py-3 text-green-700 shadow">
                <div>
                    {form.message.message}
                </div>
                <button
                    on:click={() => {
                        form.message = undefined;
                    }}>
                    close
                </button>
            </div>
        {/if}
    {/if}

    <form method="post" class="mt-12" action="?/updateProfile">
        <legend class="text-2xl text-gray-400">Profile settings</legend>
        <div class="mt-2 space-y-2">
            <TextInput name="name" label="Name" class="bg-white" defaultValue={data.profile?.name} />
            <TextInput name="email" label="Email" class="bg-white" defaultValue={data.profile?.email} />
        </div>

        <div class="mt-4">
            <PrimaryButton type="submit">Update profile</PrimaryButton>
            <SecondaryButton type="button">Verify email</SecondaryButton>
        </div>
    </form>

    <form method="post" class="mt-12" action="?/updatePassword">
        <legend class="text-2xl text-gray-400">Update password</legend>
        <div class="mt-2 space-y-2">
            <TextInput
                errorBag={form?.errors}
                name="oldPassword"
                type="password"
                label="Old password"
                class="bg-white"
                defaultValue={form?.fields?.oldPassword} />
            <TextInput
                errorBag={form?.errors}
                name="newPassword"
                type="password"
                label="Password"
                class="bg-white"
                defaultValue={form?.fields?.newPassword} />
            <TextInput
                name="confirmPassword"
                type="password"
                label="Confirm password"
                class="bg-white"
                errorBag={form?.errors}
                defaultValue={form?.fields?.confirmPassword} />
        </div>

        <div class="mt-4">
            <SecondaryButton>Update password</SecondaryButton>
        </div>
    </form>
</div>
