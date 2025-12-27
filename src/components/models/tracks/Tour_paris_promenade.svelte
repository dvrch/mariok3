<script lang="ts">
  import { T } from "@threlte/core";
  import { useGltf, useDraco } from "@threlte/extras";
  import { RigidBody } from "@threlte/rapier";
  import * as THREE from "three";

  import { dracoLoader } from "../../../lib/loaders/draco";

  let { position = [0, -3.6, 0], scale = 50 } = $props();

  const gltf = useGltf("/models/tracks/tour_paris_promenade-transformed.glb", {
    dracoLoader,
    transform: (data) => {
      const materials = data.materials;
      if (materials.M_Cmn_ShadowCollision) {
        materials.M_Cmn_ShadowCollision.opacity = 0;
        materials.M_Cmn_ShadowCollision.transparent = true;
      }
      return data;
    },
  });
</script>

{#if $gltf}
  <T.Group {scale} {position} dispose={null}>
    <T.Mesh
      castShadow
      receiveShadow
      geometry={$gltf.nodes.N_Road_Ground_M_Cmn_MainColor_Detail_0.geometry}
      material={$gltf.materials.M_Cmn_MainColor_Detail}
      scale={0.01}
    />
    <T.Mesh
      castShadow
      receiveShadow
      geometry={$gltf.nodes.N_Road_Ground_M_Mobp1_Road_A_0.geometry}
      material={$gltf.materials.M_Mobp1_Road_A}
      scale={0.01}
    />
    <T.Mesh
      castShadow
      receiveShadow
      geometry={$gltf.nodes.N_Road_Ground_M_Mobp1_Road_B_0.geometry}
      material={$gltf.materials.M_Mobp1_Road_B}
      scale={0.01}
    />
    <T.Mesh
      castShadow
      receiveShadow
      geometry={$gltf.nodes.N_Road_Ground_M_Mobp1_Water_0.geometry}
      material={$gltf.materials.M_Mobp1_Water}
      scale={0.01}
    />

    <RigidBody type="fixed" colliders="trimesh" name="terrain">
      <T.Mesh
        castShadow
        receiveShadow
        geometry={$gltf.nodes.ShadowCollision_M_Cmn_ShadowCollision_0.geometry}
        material={$gltf.materials.M_Cmn_ShadowCollision}
        scale={0.01}
      />
    </RigidBody>

    <T.Mesh
      castShadow
      receiveShadow
      geometry={$gltf.nodes.F_BlindBuilding_M_Mobp1_Textures01_0.geometry}
      material={$gltf.materials.M_Mobp1_Textures01}
      scale={0.01}
    />
    <T.Mesh
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Gmob_Paris_VR_M_Mobp1_VR_0.geometry}
      material={$gltf.materials.M_Mobp1_VR}
      scale={0.01}
    />
    <T.Mesh
      castShadow
      receiveShadow
      geometry={$gltf.nodes.N_Building_002_M_Mobp1_kanban_0.geometry}
      material={$gltf.materials.M_Mobp1_kanban}
      scale={0.01}
    />
    <T.Mesh
      castShadow
      receiveShadow
      geometry={$gltf.nodes.N_Building_002_M_Mobp1_gaisenmon_tex_0.geometry}
      material={$gltf.materials.M_Mobp1_gaisenmon_tex}
      scale={0.01}
    />

    <T.Mesh
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Rainbow_model_M_Mobp1_Rainbow_0.geometry}
      material={$gltf.materials.M_Mobp1_Rainbow}
      position={[-0.16, 0.001, 0]}
      rotation={[0, -Math.PI / 2, 0]}
      scale={0.01}
    />
    <T.Mesh
      castShadow
      receiveShadow
      geometry={$gltf.nodes.N_Audience_NoMove_01_M_Cmn_AudienceModel_0.geometry}
      material={$gltf.materials.M_Cmn_AudienceModel}
      scale={0.01}
    />
  </T.Group>
{/if}
