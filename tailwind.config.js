/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Cormorant Garamond"', 'serif'],
                logo: ['Logoza', 'sans-serif'],
                heading: ['Inter', 'sans-serif'],
                body: ['"Source Sans Pro"', 'sans-serif'],
                brand: ['Outfit', 'sans-serif'],
            },
            colors: {
                brand: {
                    primary: '#D97B8D',
                    light: '#F2DCE0',
                },
                deep: {
                    basil: '#1C1C1C',
                },
                cream: {
                    vanilla: '#FDFCFB',
                },
            },
        },
    },
    plugins: [],
}
