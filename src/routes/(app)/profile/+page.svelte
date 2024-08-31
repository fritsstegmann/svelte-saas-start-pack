<script>
    import PrimaryButton from '$components/ui/PrimaryButton.svelte';
    import TextInput from '$components/ui/TextInput.svelte';
    import ProfileAvatarUpload from './ProfileAvatarUpload.svelte';

    export let data;
</script>

<div class="mx-auto max-w-3xl">
    <h2 class="text-2xl text-gray-600">Profile settings</h2>

    <ProfileAvatarUpload />

    <div class="mt-12 space-y-4">
        <TextInput name="name" label="Name" class="bg-white" defaultValue={data.profile?.name} />
        <TextInput name="email" label="Email" class="bg-white" defaultValue={data.profile?.email} />
    </div>

    <div class="mt-8">
        <PrimaryButton>Update profile</PrimaryButton>
    </div>
</div>
