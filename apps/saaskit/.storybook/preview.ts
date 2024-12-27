import "../src/app.scss";
import type { Preview } from "@storybook/svelte";
import { themes } from "@storybook/theming";
import { neutral } from "tailwindcss/colors";

const preview: Preview = {
    parameters: {
        darkMode: {
            dark: { ...themes.dark, appPreviewBg: neutral["800"] },
            light: { ...themes.normal, appPreviewBg: neutral["100"] },
            current: "light",
            stylePreview: true,
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
