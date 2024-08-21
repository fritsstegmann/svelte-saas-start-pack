<script>
	import '../app.scss';
</script>

<div class="select-none">
	<slot />
</div>

<style lang="postcss">
	:global(body) {
		@apply bg-gray-100;
	}
</style>
