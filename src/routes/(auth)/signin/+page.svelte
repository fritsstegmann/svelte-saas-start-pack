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
			class="w-full rounded-lg bg-primary-500 py-2 text-white shadow transition-all duration-200 hover:bg-primary-400 focus:outline-none focus:ring focus:ring-primary-300"
		>
			Sign in
		</button>
	</div>
	<div class="mt-4 space-x-2 text-center">
		<span class="dark:text-gray-300">Don't have account?</span>
		<a class="font-bold text-primary-500 hover:text-primary-400" href="/signup">Sign up</a>
	</div>
</form>
