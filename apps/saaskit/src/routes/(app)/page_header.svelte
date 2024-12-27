<script>
import { toggle } from "$components/ui/Sidebar.svelte";
</script>

<header class="p-4">
    <div class="flex items-center space-x-4">
        <button
            aria-label="sidebar toggle"
            onclick={() => {
                toggle();
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="hover:text-primary-700 size-5 fill-current text-gray-500 transition duration-300"
            >
                <path
                    stroke-width="1"
                    d="M7 3H2v14h5V3zm2 0v14h9V3H9zM0 3c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm3 1h3v2H3V4zm0 3h3v2H3V7zm0 3h3v2H3v-2z"
                />
            </svg>
        </button>
        <!--
        <TextInput
            type="text"
            placeHolder="Search ..."
        />
        -->
    </div>
</header>
