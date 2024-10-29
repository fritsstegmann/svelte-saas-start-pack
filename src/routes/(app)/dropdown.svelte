<script lang="ts">
    import { browser } from '$app/environment';
    import UserAvatar from '$components/UserAvatar.svelte';

    export let data;

    let menu: HTMLDivElement;
    let open = false;

    function closeOnKeydown(e: KeyboardEvent) {
        if (e.code === 'Escape') {
            e.stopPropagation();
            e.preventDefault();
            close();
        }
    }

    function closeFromMenu(e: MouseEvent) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        close();
    }

    function closeOnMouseDown() {
        close();
    }

    function close() {
        open = false;
    }

    $: if (open === true) {
        if (browser) {
            window.addEventListener('mouseup', closeOnMouseDown);
            window.addEventListener('keydown', closeOnKeydown);
            if (menu) {
                menu.addEventListener('mouseup', closeFromMenu);
            }
        }
    }
    $: if (open === false) {
        if (browser) {
            if (menu) {
                menu.removeEventListener('mouseup', closeFromMenu);
            }
            window.removeEventListener('mouseup', closeOnMouseDown);
            window.removeEventListener('keydown', closeOnKeydown);
        }
    }
</script>

<div class="relative">
    <button
        class="flex cursor-pointer items-center space-x-1 rounded-lg border border-gray-300 p-2 hover:bg-white"
        on:click={() => {
            open = !open;
        }}>
        <div class="flex space-x-2">
            <UserAvatar profile={data.profile} />
            <span>{data.profile.name}</span>
        </div>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-4">
            <path
                fill-rule="evenodd"
                d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                clip-rule="evenodd" />
        </svg>
    </button>

    <div
        bind:this={menu}
        class="absolute -right-2 top-11 min-w-48 rounded bg-white py-2 shadow-lg"
        class:hidden={!open}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1">
        <a
            href="/profile"
            class="block px-4 py-2 text-gray-800 hover:bg-primary-600 hover:text-gray-100">
            Profile settings
        </a>
    </div>
</div>
