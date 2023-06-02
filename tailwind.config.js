/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            colors: {
                main_bg: '#E7D774',
                dark: '#171717',
                main_text: '#252525',
                main_light_dark: '#454545',
                main_light_gray: '#808080',
                main_dark: '#3C3C3C',
                main_orange: '#FFB703',
                main_light: '#E7E7E7',
                main_dark_orange: '#EB8816',
                main_dark_blue: '#14213d',
                main_blue: '#0077b6',
                main_error: '#f04040'
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
                gilroy: ['Gilroy', 'sans-serif'],
                necto_mono: ['NectoMono', 'monospace']
            },
            backgroundImage: {
                
            },
        },
    },
    plugins: [],
}

