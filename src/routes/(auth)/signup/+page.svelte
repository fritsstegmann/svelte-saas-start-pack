<script>
	import TextInput from '$components/ui/TextInput.svelte';
	export let form;
</script>

<form method="post">
	<div class="mt-4 text-center text-3xl dark:text-gray-200">Sign up</div>
	<div class="mt-1 text-center dark:text-gray-200">Welcome, we'd love to have you</div>
	<div class="mt-8">
		<TextInput
			name="name"
			label="Name"
			placeHolder={'John Doe'}
			value={form?.fields.name}
			errorBag={form?.errors}
		/>
	</div>
	<div class="mt-3">
		<TextInput
			name="email"
			label="Email"
			placeHolder={'john@example.com'}
			value={form?.fields.email}
			errorBag={form?.errors}
		/>
	</div>
	<div class="mt-6">
		<TextInput
			name="username"
			label="User name"
			placeHolder={'johndoe'}
			value={form?.fields.username}
			errorBag={form?.errors}
		/>
	</div>
	<div class="mt-6">
		<TextInput
			name="password"
			label="Password"
			type="password"
			value={form?.fields.password}
			errorBag={form?.errors}
		/>
	</div>
	<div class="mt-3">
		<TextInput
			name="confirmPassword"
			label="Confirm password"
			type="password"
			value={form?.fields.confirmPassword}
			errorBag={form?.errors}
		/>
	</div>
	<div class="mt-6">
		<button
			class="w-full rounded-lg border border-primary-500 bg-primary-500 py-2 text-white shadow transition-all duration-200 hover:bg-primary-400 focus:outline-none focus:ring focus:ring-primary-300"
		>
			Sign up
		</button>
	</div>
	<div class="mt-4 space-x-2">
		<span class="dark:text-gray-300">Already have an account?</span>
		<a class="font-bold text-primary-500 hover:text-primary-400" href="/signin">Sign in</a>
	</div>
</form>
