import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        fontFamily: {
            inter: ['Inter'],
            sansTest: [
                'Red Hat Display',
                'Noto Sans Display',
                'Inter Tight',
                'Arial',
                'Open Sans',
            ],
            // sans: ['Open Sans'],
            serif: ['Georgia'],
        },
        extend: {
            colors: {
                primary: colors.violet,
                secondary: colors.purple,
                accent: colors.fuchsia,
                gray: colors.neutral,
            },
        },
    },
    plugins: [],
};
