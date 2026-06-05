import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite'
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

export default defineConfig(
    { 
        plugins: [
            enhancedImages(),
            tailwindcss(),
            sveltekit(),
            Icons({
                compiler: 'svelte',
            })
        ] 
    }
);
