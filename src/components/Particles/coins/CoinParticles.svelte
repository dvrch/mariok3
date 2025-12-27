<script lang="ts">
  import CircleCoinParticle from './CircleCoinParticle.svelte'
  import StarCoinParticle from './StarCoinParticle.svelte'

  let { coins } = $props();
</script>

<CircleCoinParticle position={[0,0.8, 0.2]} {coins}/>
<StarCoinParticle position={[0,0.8, 0.2]} {coins} timeModifier={50}/>
<StarCoinParticle position={[0,0.8, 0.2]} {coins} timeModifier={60}/>
<StarCoinParticle position={[0,0.8, 0.2]} {coins} timeModifier={40}/>
<StarCoinParticle position={[0,0.8, 0.2]} {coins} timeModifier={90}/>
