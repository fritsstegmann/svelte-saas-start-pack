<script
    lang="ts"
    module
>
export function sideBarOpen() {
    let open = $state(false);

    return {
        open() {
            return open;
        },
        toggle() {
            open = !open;
        },
    };
}

export let { open, toggle } = sideBarOpen();

let links = [
    {
        title: "Dashboard",
        href: "/",
        icon: () => {
            return `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />`;
        },
    },
];
</script>

<script lang="ts">
    import { quadInOut, quintInOut } from 'svelte/easing';

    import { fade, scale, slide } from 'svelte/transition';
    import UserAvatar from '$components/UserAvatar.svelte';

    const {
        profile,
        showOpenCode = true,
    }: {
        showOpenCode: boolean;
        profile: { name: string; avatar: string | null };
    } = $props();

    let openProfileMenu = $state(false);
</script>

<aside
    class:w-full={open()}
    class:grow-1={open()}
    class:sm:grow-0={open()}
    class:sm:static={open()}
    class:sm:w-72={open()}
    class:w-14={!open() && showOpenCode}
    class:w-0={!open() && !showOpenCode}
    class="transition-slowest ease transition-width dark:border-primary-950 min-h-screen overflow-hidden border-r border-gray-100 bg-gradient-to-b from-gray-700 to-gray-800 p-0 text-gray-100 duration-300"
>
    <div class="flex min-h-screen flex-col justify-between">
        <div class="space-y-4 p-4">
            {#if showOpenCode}
                <div class="flex justify-end">
                    <button
                        aria-label="sidebar toggle"
                        onclick={() => {
                            toggle();
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="size-5 fill-current text-gray-200"
                        >
                            <path
                                stroke-width="1"
                                d="M7 3H2v14h5V3zm2 0v14h9V3H9zM0 3c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm3 1h3v2H3V4zm0 3h3v2H3V7zm0 3h3v2H3v-2z"
                            />
                        </svg>
                    </button>
                </div>
            {/if}
            {#if open()}
                <div
                    transition:scale={{
                        start: 0,
                        easing: quadInOut,
                        opacity: 0,
                    }}
                    class="p-4 text-center text-2xl text-gray-200"
                >
                    SaasKit
                </div>
            {/if}
            <ul class="space-y-2">
                {#each links as link}
                    <li class="flex items-center justify-center">
                        <a
                            href={link.href}
                            class:px-2={open()}
                            class:px-1={!open()}
                            class="flex w-full transform cursor-pointer items-center space-x-2 rounded py-3 text-gray-100 transition duration-300 hover:bg-gray-800 hover:backdrop-filter"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-6"
                            >
                                {@html link.icon}
                            </svg>
                            {#if open()}
                                <span
                                    class="overflow-hidden"
                                    transition:fade
                                >
                                    {link.title}
                                </span>
                            {/if}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
        {#if open()}
            <div
                transition:fade
                class="rounded-none bg-gray-600 text-gray-300 sm:m-2 sm:rounded-lg"
            >
                <div
                    class="flex items-center justify-between space-x-2 px-2 py-2"
                >
                    <div class="flex items-center space-x-2">
                        <UserAvatar {profile} />
                        <div class="font-bold leading-none text-gray-200">
                            {profile.name}
                        </div>
                    </div>
                    <button
                        aria-label="sidebar toggle"
                        onclick={() => {
                            openProfileMenu = !openProfileMenu;
                        }}
                    >
                        <svg
                            class:rotate-90={openProfileMenu}
                            class="size-6 transition duration-300"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </button>
                </div>
                {#if openProfileMenu}
                    <div
                        transition:slide={{
                            duration: 300,
                            easing: quintInOut,
                            axis: 'y',
                        }}
                    >
                        <a
                            href="/profile"
                            class="flex items-center space-x-2 overflow-hidden px-2 py-2 font-semibold transition duration-300 hover:bg-black/10"
                        >
                            <div
                                class="flex size-8 items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="size-6 text-gray-400"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                                    />
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                </svg>
                            </div>
                            <span>Profile settings</span>
                        </a>
                        <form
                            method="post"
                            action="/signout"
                        >
                            <button
                                class="flex w-full cursor-pointer items-center space-x-2 rounded-b-lg px-2 py-2 font-semibold transition duration-300 hover:bg-black/10"
                            >
                                <div
                                    class="flex size-8 items-center justify-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        class="size-6 fill-current text-gray-400"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <span>Sign out</span>
                            </button>
                        </form>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</aside>
