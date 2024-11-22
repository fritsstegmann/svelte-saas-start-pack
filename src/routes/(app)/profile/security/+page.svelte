<script lang="ts">
    import SecondaryButton from '$components/ui/SecondaryButton.svelte';
    import TextInput from '$components/ui/TextInput.svelte';
    import VerifyEmail from '../components/VerifyEmail.svelte';
    import { fade } from 'svelte/transition';
    import { applyAction, enhance } from '$app/forms';
    import ChangeEmail from '../components/ChangeEmail.svelte';
    import height from '$components/transition/height';
    import type { ActionData } from './$types.js';

    export let data;
    export let form: ActionData;

    let showVerifyDialog = false;
    let showChangeEmailDialog = false;
</script>

<div class="w-full">
    {#if form?.message}
        <div
            on:introend
            on:introstart
            transition:height={{
                duration: 300,
            }}
            class="mb-6 flex h-14 items-center justify-between rounded-lg border border-green-500 bg-green-100 px-5 py-3 text-green-700 shadow"
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
                    if (form) {
                        form.message = undefined;
                    }
                }}
            >
                close
            </button>
        </div>
        }
    {/if}

    <div>
        <div class="text-2xl font-medium text-primary-600">
            Security Details
        </div>
        <div class="mt-1 text-sm text-gray-800">Security and login details</div>
    </div>

    <form
        class="mt-12"
        method="post"
        use:enhance={() => {
            return async ({ result, action }) => {
                if (result.type === 'success') {
                    await applyAction(result);

                    if (action.search === '?/getEmailChangeCode') {
                        showChangeEmailDialog = true;
                    }
                    if (action.search === '?/getVerifyEmailCode') {
                        showVerifyDialog = true;
                    }
                } else {
                    if (result.type === 'failure') {
                        form = result.data as ActionData;
                    }
                }
            };
        }}
    >
        <legend class="text-2xl text-gray-400">Email settings</legend>
        <div class="mt-2 space-y-2">
            <TextInput
                name="email"
                label="Email"
                class="bg-white"
                defaultValue={data.profile?.email}
                errorBag={form?.errors}
            />
            {#if data.profile?.emailVerified}
                <div
                    class="flex justify-start space-x-1 py-1 font-semibold text-green-600"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>

                    <span>You have verified your email</span>
                </div>
            {/if}
        </div>
        <div class="mt-4 space-x-1">
            <SecondaryButton
                type="submit"
                formaction="?/getEmailChangeCode"
                on:click={() => {}}
            >
                Update email
            </SecondaryButton>
            <SecondaryButton
                type="submit"
                disabled={data.profile?.emailVerified}
                formaction="?/getVerifyEmailCode"
            >
                Verify email
            </SecondaryButton>
        </div>
    </form>

    <form
        method="post"
        class="mt-12"
        action="?/updatePassword"
        use:enhance={() => {}}
    >
        <legend class="text-2xl text-gray-400">Update password</legend>
        <div class="mt-2 space-y-2">
            <TextInput
                name="oldPassword"
                type="password"
                label="Old password"
                class="bg-white"
                errorBag={form?.errors}
            />
            <TextInput
                name="newPassword"
                type="password"
                label="Password"
                class="bg-white"
                errorBag={form?.errors}
            />
            <TextInput
                name="confirmPassword"
                type="password"
                label="Confirm password"
                class="bg-white"
                errorBag={form?.errors}
            />
        </div>

        <div class="mt-4">
            <SecondaryButton type="submit">Update password</SecondaryButton>
        </div>
    </form>

    {#if !data.user?.twoFaEnabled}
        <form
            method="get"
            class="mt-12"
            action="/2fa/setup"
        >
            <legend class="text-2xl text-gray-400">
                Setup Code authenticator
            </legend>
            <div class="mt-2 space-y-2"></div>

            <div class="mt-4">
                <SecondaryButton type="submit">
                    Setup authenticator
                </SecondaryButton>
            </div>
        </form>
    {/if}
</div>

<VerifyEmail bind:show={showVerifyDialog} />
<ChangeEmail bind:show={showChangeEmailDialog} />
