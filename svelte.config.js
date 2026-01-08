import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// 🎯 Détection automatique de l'environnement
const isGitHubPages = process.env.DEPLOY_TARGET === 'GH_PAGES';
const isVercel = process.env.VERCEL === '1';

// 📦 Configuration du basePath selon la plateforme
const basePath = isGitHubPages ? '/mariok3' : '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        paths: {
            base: basePath
        },
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: 'index.html',
            strict: false
        })
    }
};

export default config;
