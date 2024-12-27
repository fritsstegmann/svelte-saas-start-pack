<script lang="ts">
import TextInput from "$components/ui/TextInput.svelte";
export let form;
</script>

<form method="post">
    <div class="mt-4 text-xl dark:text-gray-300">Forgot password</div>
    <div class="mt-1 text-base text-gray-700 dark:text-gray-300">
        If we have your email on record, you'll receive an email with the next
        step
    </div>
    <div class="mt-6">
        <TextInput
            id="email"
            name="email"
            label="Email"
            placeHolder="john@example.com"
            value={form?.fields?.email}
            errorBag={form?.errors}
        />
    </div>
    <div class="mt-8">
        <button
            class="bg-primary-500 hover:bg-primary-400 focus:ring-primary-300 w-full rounded-lg py-2 text-white shadow transition-all duration-200 focus:outline-none focus:ring"
        >
            Reset password
        </button>
    </div>
</form>
