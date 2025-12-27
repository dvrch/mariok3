import { setContext, getContext, onDestroy, onMount } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const KEY = Symbol('KEYBOARD_CONTROLS');

export function useKeyboardControls() {
    return getContext<Writable<Record<string, boolean>>>(KEY);
}

export function createKeyboardControls(map: { name: string, keys: string[] }[]) {
    const state = writable<Record<string, boolean>>({});

    // Initialize state
    const initialState: Record<string, boolean> = {};
    map.forEach(action => {
        initialState[action.name] = false;
    });
    state.set(initialState);

    // Key mapping
    const keyMap = new Map<string, string>();
    map.forEach(action => {
        action.keys.forEach(key => {
            keyMap.set(key, action.name);
            keyMap.set(key.toLowerCase(), action.name);
        });
    });

    const onKeyDown = (e: KeyboardEvent) => {
        const action = keyMap.get(e.code) || keyMap.get(e.key);
        if (action) {
            state.update(s => ({ ...s, [action]: true }));
        }
    };

    const onKeyUp = (e: KeyboardEvent) => {
        const action = keyMap.get(e.code) || keyMap.get(e.key);
        if (action) {
            state.update(s => ({ ...s, [action]: false }));
        }
    };

    if (typeof window !== 'undefined') {
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
    }

    onDestroy(() => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        }
    });

    setContext(KEY, state);
    return state;
}
