<script>
	import '../app.css';
</script>

<div class="select-none">
	<slot />
</div>

<style lang="postcss">
	:global(html, body) {
		@apply text-gray-100 bg-gray-100 dark:bg-gray-800;
	}
</style>
