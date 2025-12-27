Svelte 5 Migration Walkthrough
Successfully migrated the Mario Kart clone from React/Zustand to Svelte 5/Runes/Threlte.

Key Changes
1. State Management (Runes)
Replaced Zustand with Svelte 5 Runes in 
src/lib/state/gameStore.svelte.ts
.

Global State: gameStore class using $state fields.
Input Handling: 
useGamepad.svelte.ts
 manages gamepad inputs reactively.
2. Components
Converted all 
.jsx
 components to 
.svelte
.

Particles: SmokeParticle, DriftParticles, CoinParticles etc. are now native Svelte components leveraging useTask for animation loop.
Player Controllers:
PlayerControllerKeyboard: Implements keyboard logic using a custom 
useKeyboardControls
 hook.
PlayerControllerGamepad: Fully reactive gamepad support.
PlayerControllerTouch: Touch controls with auto-acceleration.
3. Threlte & Dependencies
Upgraded to @threlte/core@next, @threlte/extras@next, @threlte/rapier@next
Downgraded @sveltejs/vite-plugin-svelte to ^4.0.0 for stability with Svelte 5.0.0-next.
Replaced deprecated BallCollider strings/imports with specific <Collider shape="ball" /> components.
4. Custom Implementations
Keyboard Controls: Since 
useKeyboardControls
 was missing in the latest extras build, a custom implementation was added in 
src/components/useKeyboardControls.ts
 and 
KeyboardControls.svelte
.
Verification
Build: npm run build passes successfully.
Assets: All previous assets and logic structures have been preserved and adapted.
Reactivity: Svelte 5 warnings ($state ownership) were addressed where critical.
Next Steps
Run npm run dev to test gameplay mechanics (steering, drifting, items) in the browser.
Fine-tune particle effects if visual regression is observed.
