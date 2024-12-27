<script lang="ts">
import SecureCodeInput from "$components/ui/SecureCodeInput.svelte";

export let form;
export let data;
</script>

<div class="text-xl dark:text-gray-300">2FA Authenticator code</div>

<div class="mt-4">
    {@html data.qrCode}
</div>

<form
    method="post"
    action="?/verify"
>
    <div class="mt-2 text-base text-gray-700 dark:text-gray-300">
        Enter the confirmation code to enable 2FA
    </div>
    <div class="mt-6">
        <input
            type="hidden"
            name="key"
            value={data.encodedKey}
        />
        <SecureCodeInput
            name="code"
            size={6}
            errorBag={form?.errors}
        />
    </div>
    <div class="mt-8">
        <button
            class="bg-primary-500 hover:bg-primary-400 focus:ring-primary-300 w-full rounded-lg py-2 text-white shadow transition-all duration-200 focus:outline-none focus:ring"
        >
            Confirm code
        </button>
    </div>
</form>
