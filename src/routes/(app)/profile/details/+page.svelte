<script lang="ts">
    import SecondaryButton from '$components/ui/SecondaryButton.svelte';
    import TextInput from '$components/ui/TextInput.svelte';
    import { quartInOut } from 'svelte/easing';
    import ProfileAvatarUpload from '../components/ProfileAvatarUpload.svelte';
    import { fade } from 'svelte/transition';
    import { applyAction, enhance } from '$app/forms';

    export let data;
    export let form;

    function notifications(
        node: HTMLElement,
        { duration }: { duration: number }
    ) {
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

<div>
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

    <div class="text-2xl font-medium text-primary-600">Details</div>

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
        }}>
        <legend class="text-2xl text-gray-400">Profile settings</legend>
        <div class="mt-2 space-y-2">
            <TextInput
                name="name"
                label="Name"
                class="bg-white"
                defaultValue={data.profile?.name} />
        </div>

        <div class="mt-4">
            <SecondaryButton type="submit">Update profile</SecondaryButton>
        </div>
    </form>
</div>
