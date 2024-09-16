<script context="module">
    let open = writable(true);

    export function sideBarOpen() {
        return {
            get open() {
                return open;
            },
            toggle() {
                open.update((open) => !open);
            },
        };
    }
</script>

<script lang="ts">
    import { quintInOut, quintOut } from 'svelte/easing';
    import { writable } from 'svelte/store';

    import { slide } from 'svelte/transition';
    import UserAvatar from '$components/UserAvatar.svelte';

    export let profile;

    let { open } = sideBarOpen();

    let openProfileMenu = false;
</script>

{#if $open}
    <aside
        transition:slide={{
            duration: 300,
            easing: quintInOut,
            axis: 'x',
        }}
        class="flex min-h-screen w-80 flex-col justify-between overflow-hidden border-r border-gray-950 bg-gray-700 bg-gradient-to-b from-gray-800/65 to-gray-950 p-4 text-gray-100 transition duration-200">
        <div class="space-y-4">
            <div class="p-4 text-center text-2xl text-gray-200">SaasKit</div>
            <ul class="space-y-2">
                <li>
                    <a
                        href="/"
                        class="flex cursor-pointer items-center space-x-2 rounded px-2 py-3 text-primary-300 hover:bg-gray-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                        </svg>
                        <span>Dashboard</span>
                    </a>
                </li>
            </ul>
        </div>
        <div class="rounded-lg bg-gray-800 shadow">
            <div class="flex items-center justify-between space-x-2 px-2 py-3">
                <div class="flex items-center space-x-2">
                    <UserAvatar {profile} />
                    <span>Frits Stegmann</span>
                </div>
                <button
                    on:click={() => {
                        openProfileMenu = !openProfileMenu;
                    }}>
                    <svg
                        class:rotate-90={openProfileMenu}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
            {#if openProfileMenu}
                <div
                    transition:slide={{
                        duration: 300,
                        easing: quintOut,
                        axis: 'y',
                    }}>
                    <div>
                        <a
                            href="/profile"
                            class="flex items-center space-x-2 overflow-hidden bg-gray-800 px-2 py-3 hover:bg-gray-700 hover:text-primary-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-6">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <span>Profile settings</span>
                        </a>
                    </div>
                    <form method="post" action="/signout">
                        <button
                            class="flex w-full cursor-pointer space-x-2 rounded-b-lg px-2 py-3 text-gray-300 hover:bg-gray-700 hover:text-accent-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                class="size-6 fill-current">
                                <path
                                    fill-rule="evenodd"
                                    d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>Sign out</span>
                        </button>
                    </form>
                </div>
            {/if}
        </div>
    </aside>
{/if}
