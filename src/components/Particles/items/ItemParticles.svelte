<script lang="ts">
  import CircleItemParticle from './CircleItemParticle.svelte'
  import StarItemParticle from './StarItemParticle.svelte'
  import SmallCircleParticle from './SmallCircleParticle.svelte'

  let { item } = $props();
</script>

<CircleItemParticle position={[0,0.8, 0.2]} {item} color={0x75ff9a}/>
<StarItemParticle position={[0,0.8, 0.2]} {item} timeModifier={50} color={0x75ff9a}/>
<StarItemParticle position={[0,0.8, 0.2]} {item} timeModifier={60} color={0xe872fc}/>
<StarItemParticle position={[0,0.8, 0.2]} {item} timeModifier={40} color={0x72e5fc}/>
<StarItemParticle position={[0,0.8, 0.2]} {item} timeModifier={90} color={0xf0db7f}/>
<SmallCircleParticle position={[0,0.8, 0.2]} {item} timeModifier={50} color={0x75ff9a}/>
<SmallCircleParticle position={[0,0.8, 0.2]} {item} timeModifier={60} color={0xe872fc}/>
<SmallCircleParticle position={[0,0.8, 0.2]} {item} timeModifier={40} color={0x72e5fc}/>
<SmallCircleParticle position={[0,0.8, 0.2]} {item} timeModifier={90} color={0xf0db7f}/>
