<script lang="ts">
import { enhance } from "$app/forms";
import TextInput from "$components/ui/TextInput.svelte";
export let form;
</script>

<form
    method="post"
    use:enhance
>
    <div class="mt-4 text-xl dark:text-gray-300">Confirm password</div>
    <div class="mt-1 text-base text-gray-700 dark:text-gray-300">
        To use this feature we need to confirm your password
    </div>
    <div class="mt-6">
        <TextInput
            id="password"
            name="password"
            label="Password"
            type="password"
            placeHolder=""
            errorBag={form?.errors}
        />
    </div>
    <div class="mt-8">
        <button
            class="bg-primary-500 hover:bg-primary-400 focus:ring-primary-300 w-full rounded-lg py-2 text-white shadow transition-all duration-200 focus:outline-none focus:ring"
        >
            Confirm password
        </button>
    </div>
</form>
