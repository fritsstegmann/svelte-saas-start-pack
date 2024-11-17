<script lang="ts">
    import PrimaryButton from '$components/ui/PrimaryButton.svelte';
    import TextInput from '$components/ui/TextInput.svelte';
    export let form;
</script>

<form method="post">
    <div class="mt-4 text-xl dark:text-gray-300">Sign in</div>
    <div class="mt-1 text-base text-gray-700 dark:text-gray-300">
        Welcome back
    </div>
    <div class="mt-4">
        <TextInput
            id="username"
            name="username"
            label="User name"
            placeHolder="johndoe"
            value={form?.fields?.username}
            errorBag={form?.errors}
        />
    </div>
    <div class="mt-2">
        <TextInput
            id="password"
            name="password"
            label="Password"
            type="password"
            value={form?.fields?.password}
            errorBag={form?.errors}
        />
    </div>
    <div class="mt-4 flex justify-end font-medium text-primary-900">
        <a href="/forgot-password">Forgot password?</a>
    </div>
    <div class="mt-4">
        <PrimaryButton
            type="submit"
            class="w-full"
        >
            Sign in
        </PrimaryButton>
    </div>
    <div class="mt-4 space-x-2">
        <span class="dark:text-gray-300">Don't have account?</span>
        <a
            class="font-bold text-primary-500 hover:text-primary-400"
            href="/signup"
        >
            Sign up
        </a>
    </div>
</form>
