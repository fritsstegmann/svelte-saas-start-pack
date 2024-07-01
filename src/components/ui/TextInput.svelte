<script>
	import InputLabel from './InputLabel.svelte';

	/** @type {string | undefined} */
	export let id = undefined;
	/** @type {string | undefined} */
	export let name = undefined;
	/** @type {string | undefined} */
	export let label = undefined;
	/** @type {string | undefined} */
	export let value = undefined;
	/** @type {string | undefined} */
	export let placeHolder = undefined;
	/** @type {'text' | 'password' | 'file' } */
	export let type = 'text';
	/** @type {import('./ErrorBag').ErrorBag | undefined} */
	export let errorBag = undefined;
	/** @type {string | undefined} */
	export let defaultValue = undefined;

	/** @type {string | undefined} */
	let clazz = undefined;

	export { clazz as class };

	/**
	 * @param {HTMLInputElement} node
	 */
	function typeAction(node) {
		node.type = type;
	}

	if (value == undefined) {
		value = defaultValue;
	}
</script>

<div>
	{#if label}
		<InputLabel {id}>{label}</InputLabel>
	{/if}
	<div
		class={`mt-1 flex h-10 items-center rounded-md border-2 border-gray-300 bg-gray-100 px-2 py-1 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 ${clazz}`}
	>
		{#if $$slots.prefix}
			<div class="mr-2 empty:hidden">
				<slot name="prefix" />
			</div>
		{/if}
		<input
			{name}
			{id}
			autocomplete="off"
			on:input={() => {
				if (errorBag && name && errorBag[name]) {
					errorBag[name] = null;
				}
			}}
			data-lpignore
			placeholder={placeHolder}
			use:typeAction
			class="w-full flex-grow bg-inherit focus:outline-none"
			bind:value
		/>
		<slot name="suffix" class="empty:hidden" />
	</div>
	<slot name="hint" />
	{#if name && errorBag && errorBag[name]}
		<div class="text-ms mt-1 text-red-500">{errorBag[name]}</div>
	{/if}
</div>
