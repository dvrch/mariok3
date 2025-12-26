<script lang="ts">
  import App from './App.svelte';
  import HUD from './HUD.svelte';
  import Landing from './Landing.svelte';
</script>

<App />
<HUD />
<Landing />

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #000;
  }
  :global(#app) {
    width: 100%;
    height: 100%;
  }
</style>
