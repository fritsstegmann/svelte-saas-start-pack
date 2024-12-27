<script>
import PrimaryButton from "$components/ui/PrimaryButton.svelte";
import TextInput from "$components/ui/TextInput.svelte";
export let form;
</script>

<form method="post">
    <div class="mt-4 text-xl dark:text-gray-300">Sign up</div>
    <div class="mt-1 text-base text-gray-700 dark:text-gray-300">
        Welcome, we'd love to have you
    </div>
    <div class="mt-3">
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
    <div class="mt-8">
        <PrimaryButton
            type="submit"
            class="w-full"
        >
            Sign up
        </PrimaryButton>
    </div>
    <div class="mt-4 space-x-2">
        <span class="dark:text-gray-300">Already have an account?</span>
        <a
            class="text-primary-500 hover:text-primary-400 font-bold"
            href="/signin"
        >
            Sign in
        </a>
    </div>
</form>
