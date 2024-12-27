import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter(),
        alias: {
            $components: "src/components",
            $i18n: "src/paraglide",
            $lib: "src/lib",
            $server: "src/lib/server",
        },
    },
    compilerOptions: {
        // disable all warnings coming from node_modules and all accessibility warnings
        warningFilter: (warning) =>
            !warning.filename?.includes("node_modules") &&
            !warning.code.startsWith("a11y"),
    },
};

export default config;
