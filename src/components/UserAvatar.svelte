<script>
    /**
     * @type {{avatar: string} | undefined}
     */
    export let profile;
</script>

{#if profile?.avatar}
    <img
        alt="profile avatar"
        class="size-7 overflow-hidden rounded-xl border-2 border-white ring-1 ring-black"
        src={profile.avatar} />
{:else}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1"
        stroke="currentColor"
        class="size-7 rounded-xl text-gray-400">
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
{/if}
