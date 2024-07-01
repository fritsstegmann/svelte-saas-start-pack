<script lang="ts">
	import TextInput from '$components/ui/TextInput.svelte';
	export let form;
</script>

<form method="post">
	<div class="mt-4 text-center text-lg dark:text-gray-300">Welcome back</div>
	<div class="mt-6">
		<TextInput
			name="username"
			label="User name"
			placeHolder="johndoe"
			value={form?.fields?.username}
			errorBag={form?.errors}
		/>
	</div>
	<div class="mt-6">
		<TextInput
			name="password"
			label="Password"
			type="password"
			value={form?.fields?.password}
			errorBag={form?.errors}
		/>
	</div>
	<div class="mt-6">
		<button
			class="w-full rounded-lg border border-accent-500 bg-accent-500 py-2 text-white shadow transition-all duration-200 hover:bg-accent-400 focus:outline-none focus:ring focus:ring-accent-300"
		>
			Sign in
		</button>
	</div>
	<div class="mt-4 space-x-2 text-center">
		<span class="dark:text-gray-300">Don't have account?</span>
		<a class="font-bold text-accent-500 hover:text-accent-400" href="/signup">Sign up</a>
	</div>
</form>
