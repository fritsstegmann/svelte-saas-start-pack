import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|tsx|ts|svelte)'],
    addons: [
        '@storybook/addon-svelte-csf',
        '@storybook/addon-essentials',
        '@chromatic-com/storybook',
        '@storybook/addon-interactions',
        'storybook-dark-mode',
    ],
    framework: {
        name: '@storybook/sveltekit',
        options: {},
    },
};
export default config;