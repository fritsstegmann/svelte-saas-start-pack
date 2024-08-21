<script lang="ts">
	import { browser } from '$app/environment';

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
		class="rounded-lg block border-gray-300 cursor-pointer hover:bg-white border p-2 flex items-center space-x-1"
		on:click={() => {
			open = !open;
		}}
	>
		<span>
			{data.user.userName}
		</span>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
			<path
				fill-rule="evenodd"
				d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>

	<div
		bind:this={menu}
		class="absolute top-11 -right-2 rounded bg-white shadow-lg py-2 min-w-48"
		class:hidden={!open}
		role="menu"
		aria-orientation="vertical"
		aria-labelledby="menu-button"
		tabindex="-1"
	>
		<a
			href="/profile"
			class="py-2 hover:bg-primary-600 px-4 hover:text-gray-100 block text-gray-800"
			>Profile settings</a
		>
		<a href="#" class="py-2 hover:bg-primary-600 px-4 hover:text-gray-100 block text-gray-800"
			>Support</a
		>
	</div>
</div>
