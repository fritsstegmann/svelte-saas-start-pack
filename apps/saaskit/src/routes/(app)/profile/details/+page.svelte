<script lang="ts">
import { applyAction, enhance } from "$app/forms";
import height from "$components/transition/height";
import SecondaryButton from "$components/ui/SecondaryButton.svelte";
import TextInput from "$components/ui/TextInput.svelte";
import { fade } from "svelte/transition";
import ProfileAvatarUpload from "../components/ProfileAvatarUpload.svelte";

export let data;
export let form;
</script>

<div>
    {#if form?.message}
        <div
            transition:height={{
                duration: 300,
            }}
            class="mb-6 flex h-14 items-center justify-between rounded-lg border border-green-500 bg-green-100 px-5 text-green-700 shadow"
        >
            <div
                transition:fade={{
                    duration: 50,
                }}
            >
                {form.message.message}
            </div>
            <button
                transition:fade={{
                    duration: 50,
                }}
                on:click={() => {
                    form.message = undefined;
                }}
            >
                close
            </button>
        </div>
    {/if}

    <div>
        <div class="text-primary-600 text-2xl font-medium">
            User Profile Details
        </div>
        <div class="mt-1 text-sm text-gray-800">
            Update user profile information
        </div>
    </div>

    <div class="mt-12">
        <ProfileAvatarUpload profile={data.profile} />
    </div>

    <form
        class="mt-12"
        method="post"
        action="?/updateProfile"
        use:enhance={() => {
            return async ({ result }) => {
                await applyAction(result);
            };
        }}
    >
        <legend class="text-2xl text-gray-400">Profile settings</legend>
        <div class="mt-2 space-y-2">
            <TextInput
                name="name"
                label="Name"
                class="bg-white"
                defaultValue={data.profile?.name}
            />
        </div>

        <div class="mt-4">
            <SecondaryButton type="submit">Update profile</SecondaryButton>
        </div>
    </form>
</div>
