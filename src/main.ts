import { mount } from 'svelte';
import './index.css';
import AppRoot from './AppRoot.svelte';

const app = mount(AppRoot, {
    target: document.getElementById('app')!,
});

export default app;
