<script lang="ts">
    import PrimaryButton from '$components/ui/PrimaryButton.svelte';
    import SecondaryButton from '$components/ui/SecondaryButton.svelte';
    import TextInput from '$components/ui/TextInput.svelte';
    import { quartInOut } from 'svelte/easing';
    import ProfileAvatarUpload from './ProfileAvatarUpload.svelte';
    import VerifyEmail from './VerifyEmail.svelte';
    import { fade } from 'svelte/transition';
    import { applyAction, enhance } from '$app/forms';

    export let data;
    export let form;

    let showVerifyDialog = false;

    function notifications(node: HTMLElement, { duration }: { duration: number }) {
        const height = parseInt(getComputedStyle(node).height);
        const paddingTop = parseInt(getComputedStyle(node).paddingTop);
        const paddingBottom = parseInt(getComputedStyle(node).paddingBottom);
        const opacity = +getComputedStyle(node).opacity;

        return {
            duration,
            css: (t: number) => {
                const eased = quartInOut(t);

                const scaledOpacity = opacity / 5;
                return `
                    overflow: hidden;
                    padding-top: ${eased * paddingTop};
                    padding-bottom: ${eased * paddingBottom};
                    height: ${eased * height};
                    opacity: ${scaledOpacity * t * 5};
                `;
            },
        };
    }
</script>

<div class="mx-auto max-w-3xl">
    {#if form?.message}
        <div
            on:introend
            on:introstart
            transition:notifications={{
                duration: 300,
            }}
            class="flex h-14 items-center justify-between rounded-lg border border-green-500 bg-green-100 px-5 py-3 text-green-700 shadow">
            <div
                transition:fade={{
                    duration: 50,
                }}>
                {form.message.message}
            </div>
            <button
                transition:fade={{
                    duration: 50,
                }}
                on:click={() => {
                    form.message = undefined;
                }}>
                close
            </button>
        </div>
    {/if}

    <ProfileAvatarUpload profile={data.profile} />

    <form
        method="post"
        class="mt-12"
        action="?/updateProfile"
        use:enhance={() => {
            return async ({ result }) => {
                await applyAction(result);
            };
        }}>
        <legend class="text-2xl text-gray-400">Profile settings</legend>
        <div class="mt-2 space-y-2">
            <TextInput name="name" label="Name" class="bg-white" defaultValue={data.profile?.name} />
            <TextInput name="email" label="Email" class="bg-white" defaultValue={data.profile?.email} />
        </div>

        <div class="mt-4">
            <PrimaryButton type="submit">Update profile</PrimaryButton>
            <SecondaryButton
                type="button"
                on:click={() => {
                    showVerifyDialog = true;
                }}>
                Verify email
            </SecondaryButton>
        </div>
    </form>

    <form method="post" class="mt-12" action="?/updatePassword" use:enhance={() => {}}>
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

<VerifyEmail bind:show={showVerifyDialog} />
