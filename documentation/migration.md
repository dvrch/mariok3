# 🛤️ Plan de Migration : React ➡️ Svelte 5

Étapes pour une conversion propre et rapide vers l'écosystème Threlte.

## 🛠️ Phase 1 : Environnement
1.  **Mise à jour `package.json`**:
    - Supprimer `react`, `@react-three/*`.
    - Ajouter `svelte@next`, `@threlte/core`, `@threlte/extras`, `@threlte/rapier`.
2.  **Configuration Vite**: Switcher de `@vitejs/plugin-react` à `@sveltejs/vite-plugin-svelte`.
3.  **TSConfig**: Ajuster pour Svelte.

## 🧱 Phase 2 : Conversion des Composants
Chaque fichier `.jsx` / `.tsx` devient un `.svelte`.

### Correspondances directes :
- `<mesh>` ➡️ `<T.Mesh>`
- `<perspectiveCamera>` ➡️ `<T.PerspectiveCamera>`
- `useFrame` ➡️ `useTask` (Threlte)
- `<RigidBody>` ➡️ `<RigidBody>` (Threlte Rapier)

## 🧠 Phase 3 : Logique & État (Runes)
Conversion de `store.jsx` (Zustand) en `gameStore.svelte.ts`.

```typescript
// Exemple de Rune
export const gameState = $state({
    score: 0,
    isRacing: false
});
```

## 🧹 Phase 4 : Nettoyage
- Supprimer les imports React inutiles.
- Convertir les utilitaires `.ts` (React types ➡️ Base types).

---
✅ **Objectif**: Un code plus concis, plus performant et plus facile à maintenir grâce à la réactivité fine de Svelte 5.
