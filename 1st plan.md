1st plan 

🏁 Walkthrough : Migration Mario Kart Svelte 5 (Runes)
La conversion est terminée ! Le jeu est passé de React à Svelte 5 en utilisant l'écosystème Threlte.

✨ Changements Majeurs
🧠 Gestion de l'État (Runes)
Le store Zustand a été remplacé par des Runes Svelte 5 ($state, $derived).

Fichier : 
gameStore.svelte.ts
🧱 Composants 3D (Threlte)
Tous les composants R3F ont été convertis en Threlte.

Root: 
App.svelte
Scène: 
Experience.svelte
Modèles: 
Paris-bis.svelte
, 
Mario_kart.svelte
🎮 Interface & Logique
HUD: 
HUD.svelte
 (Refactorisé avec $derived)
Landing: 
Landing.svelte
 (Transitions GSAP conservées)
📁 Documentation
Une nouvelle documentation a été créée pour aider à la prise en main :

Structure du Projet
Logique du Jeu
Plan de Migration
🛠️ Prochaines étapes pour l'utilisateur
Exécuter pnpm install ou npm install pour installer les nouvelles dépendances Svelte/Threlte.
Lancer le serveur de dev avec npm run dev.
Vérifier les systèmes de particules (stubs créés dans src/components/Particles/).
🚀 Antigravity : Migration effectuée avec succès et précision !

