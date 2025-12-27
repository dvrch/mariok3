<script lang="ts">
  import { T } from "@threlte/core";
  import * as THREE from "three";
  import { Color, DoubleSide, AdditiveBlending } from "three";

  let {
    falloff = 3,
    glowInternalRadius = 1.0,
    glowColor = "#b97939",
    glowSharpness = 1.0,
  } = $props();

  const vertexShader = `
      varying vec3 vPosition;
      varying vec3 vNormal;

      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewMatrix * modelPosition;
        vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
        vPosition = modelPosition.xyz;
        vNormal = modelNormal.xyz;

      }`;

  const fragmentShader = `
      uniform vec3 glowColor;
      uniform float falloffAmount;
      uniform float glowSharpness;
      uniform float glowInternalRadius;

      varying vec3 vPosition;
      varying vec3 vNormal;

      void main()
      {
        // Normal
        vec3 normal = normalize(vNormal);
        if(!gl_FrontFacing){ normal *= - 1.0; }
        vec3 viewDirection = normalize(cameraPosition - vPosition);
        float fresnel = dot(viewDirection, normal);
        fresnel = pow(fresnel, glowInternalRadius);
        float falloff = smoothstep(0., falloffAmount, fresnel);
        float fakeGlow = fresnel;
        fakeGlow += fresnel * glowSharpness;
        fakeGlow *= falloff;
        gl_FragColor = vec4(clamp(glowColor * fresnel, 0., 1.0), clamp(fakeGlow, 0., 1.0));

        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      glowColor: { value: new Color(glowColor) },
      falloffAmount: { value: falloff },
      glowSharpness: { value: glowSharpness },
      glowInternalRadius: { value: glowInternalRadius },
    },
    side: DoubleSide,
    transparent: true,
    blending: AdditiveBlending,
    depthTest: false,
  });

  $effect(() => {
    material.uniforms.glowColor.value.set(glowColor);
    material.uniforms.falloffAmount.value = falloff;
    material.uniforms.glowSharpness.value = glowSharpness;
    material.uniforms.glowInternalRadius.value = glowInternalRadius;
  });
</script>

<T is={material} />
