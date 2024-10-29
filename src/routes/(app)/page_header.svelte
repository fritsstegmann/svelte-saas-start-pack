<script lang="ts">
    import { sideBarOpen } from './sidebar.svelte';

    let { toggle } = sideBarOpen();
</script>

<header class="flex items-center justify-between border-b border-b-gray-200">
    <div class="flex items-center space-x-4 p-4">
        <button
            on:click={() => {
                toggle();
            }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5 fill-current text-gray-400">
                <path
                    stroke-width="1"
                    d="M7 3H2v14h5V3zm2 0v14h9V3H9zM0 3c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm3 1h3v2H3V4zm0 3h3v2H3V7zm0 3h3v2H3v-2z" />
            </svg>
        </button>
        <!-- <input -->
        <!--     type="search" -->
        <!--     placeholder="Search" -->
        <!--     class="ml-4 w-64 rounded-full border border-gray-300 bg-gray-100 px-3 py-1 focus:border-accent-400 focus:bg-white focus:outline-none focus:ring focus:ring-accent-300" /> -->
    </div>
    <!-- <div class="flex items-center text-sm text-gray-600"> -->
    <!--     <svg -->
    <!--         xmlns="http://www.w3.org/2000/svg" -->
    <!--         fill="none" -->
    <!--         viewBox="0 0 24 24" -->
    <!--         stroke-width="1.5" -->
    <!--         stroke="currentColor" -->
    <!--         class="mr-4 size-6 text-gray-500"> -->
    <!--         <path -->
    <!--             stroke-linecap="round" -->
    <!--             stroke-linejoin="round" -->
    <!--             d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /> -->
    <!--     </svg> -->
    <!-- </div> -->
</header>
