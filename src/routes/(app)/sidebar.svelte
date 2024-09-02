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
    import { quintOut } from 'svelte/easing';
    import { writable } from 'svelte/store';

    import { slide } from 'svelte/transition';

    let { open } = sideBarOpen();
</script>

{#if $open}
    <aside
        transition:slide={{
            duration: 300,
            easing: quintOut,
            axis: 'x',
        }}
        class="flex min-h-screen w-80 flex-col justify-between overflow-hidden border-r border-gray-950 bg-gray-700 bg-gradient-to-b from-gray-800/65 to-gray-950 p-8 text-gray-100 transition duration-200">
        <div class="space-y-4">
            <div class="p-8 text-center text-2xl text-gray-200">SaasKit</div>
            <ul class="space-y-2">
                <li>
                    <a
                        href="/"
                        class="flex cursor-pointer items-center space-x-2 rounded p-4 text-primary-300 hover:bg-gray-600">
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
                <li class="flex cursor-pointer items-center space-x-2 rounded p-4 text-gray-300 hover:bg-gray-600">
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
                            d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
                    </svg>
                    <span>Additional page</span>
                </li>
            </ul>
            <!-- <div class="flex pt-4 justify-center items-center"> -->
            <!-- 	<div class="bg-gray-700/50 rounded-lg px-4 m-1 flex-grow"> -->
            <!-- 		<div class="text-gray-200 pt-3 pb-2 text-center">Stats</div> -->
            <!-- 		<div class="text-center pb-3 text-2xl">42</div> -->
            <!-- 	</div> -->
            <!-- 	<div class="bg-gray-700/50 rounded-lg px-4 m-1 flex-grow"> -->
            <!-- 		<div class="text-gray-200 pt-3 pb-2 text-center">Stats</div> -->
            <!-- 		<div class="text-center pb-3 text-2xl">42</div> -->
            <!-- 	</div> -->
            <!-- 	<div class="bg-gray-700/50 rounded-lg px-4 m-1 flex-grow"> -->
            <!-- 		<div class="text-gray-200 pt-3 pb-2 text-center">Stats</div> -->
            <!-- 		<div class="text-center pb-3 text-2xl">42</div> -->
            <!-- 	</div> -->
            <!-- </div> -->
        </div>
        <form method="post" action="/signout">
            <button
                class="flex w-full cursor-pointer space-x-2 rounded p-4 text-gray-300 hover:bg-gray-700 hover:text-accent-300">
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
    </aside>
{/if}
