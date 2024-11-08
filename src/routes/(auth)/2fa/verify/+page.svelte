<script lang="ts">
    import SecureCodeInput from '../../../(app)/profile/components/SecureCodeInput.svelte';

    export let form;
</script>

<div class="text-xl dark:text-gray-300">2FA Authenticator code</div>

<form method="post">
    <div class="mt-2 text-base text-gray-700 dark:text-gray-300">
        Enter the confirmation code to enable 2FA
    </div>
    <div class="mt-6">
        <SecureCodeInput
            name="code"
            size={6}
            errorBag={form?.errors}
        />
    </div>
    <div class="mt-8">
        <button
            class="w-full rounded-lg bg-primary-500 py-2 text-white shadow transition-all duration-200 hover:bg-primary-400 focus:outline-none focus:ring focus:ring-primary-300"
        >
            Confirm code
        </button>
    </div>
</form>
