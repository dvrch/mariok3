<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { PositionalAudio } from "@threlte/extras";
  import { RigidBody, Collider } from "@threlte/rapier";
  import * as THREE from "three";
  import { gameStore } from "../lib/state/gameStore.svelte";
  import { gamepadStore } from "./useGamepad.svelte";
  import Mario from "./models/characters/Mario_kart.svelte";
  import DriftParticlesLeft from "./Particles/drifts/DriftParticlesLeft.svelte";
  import DriftParticlesRight from "./Particles/drifts/DriftParticlesRight.svelte";
  import SmokeParticles from "./Particles/smoke/SmokeParticles.svelte";
  import PointParticle from "./Particles/drifts/PointParticle.svelte";
  import HitParticles from "./Particles/hits/HitParticles.svelte";
  import CoinParticles from "./Particles/coins/CoinParticles.svelte";
  import ItemParticles from "./Particles/items/ItemParticles.svelte";
  import FakeGlowMaterial from "./ShaderMaterials/FakeGlow/FakeGlowMaterial.svelte";

  let {
    player,
    userPlayer,
    position = [25, 30, -120] as [number, number, number],
  } = $props();

  const { camera } = useThrelte();

  // Refs
  let body = $state<any>(null);
  let kart = $state<THREE.Group>(null);
  let mario = $state<THREE.Group>(null);
  let cam = $state<THREE.PerspectiveCamera>(null);
  let rightWheel = $state<THREE.Mesh>(null);
  let leftWheel = $state<THREE.Mesh>(null);

  // Audio Refs
  let engineSound = $state<any>();
  let driftSound = $state<any>();
  let driftTwoSound = $state<any>();
  let driftOrangeSound = $state<any>();
  let driftPurpleSound = $state<any>();
  let driftBlueSound = $state<any>();
  let jumpSound = $state<any>();
  let landingSound = $state<any>();
  let turboSound = $state<any>();

  // State
  let isOnGround = $state(false);
  let currentSpeed = $state(0);
  let currentSteeringSpeed = $state(0);
  let turboColor = $state(0xffffff);
  let isBoosting = $state(false);
  let scale = $state(0);
  let steeringAngleWheels = $state(0);
  let shouldLaunch = $state(false);

  // Logic vars
  const initialSpeed = 0;
  const maxSpeed = 30;
  const boostSpeed = 50;
  const acceleration = 0.1;
  const decceleration = 0.2;
  const damping = -0.1;
  const MaxSteeringSpeed = 0.01;
  const camMaxOffset = 1;

  let steeringAngle = 0;
  let isOnFloor = false;
  let jumpForce = 0;
  let jumpIsHeld = false;
  let driftDirection = 0;
  let driftLeft = $state(false);
  let driftRight = $state(false);
  let driftForce = 0;
  let accumulatedDriftPower = 0;
  const blueTurboThreshold = 10;
  const orangeTurboThreshold = 30;
  const purpleTurboThreshold = 60;
  let boostDuration = 0;
  let effectiveBoost = 0;
  let targetXPosition = 0;
  let targetZPosition = 8;
  let slowDownDuration = 1500;

  $effect(() => {
    if (leftWheel && rightWheel && body && player.id === gameStore.id) {
      gameStore.leftWheel = leftWheel;
      gameStore.rightWheel = rightWheel;
    }
  });

  useTask((delta) => {
    if (player.id !== gameStore.id) return;
    if (!body || !mario || !kart) return;

    // Engine Sound Control
    if (engineSound) {
      if (!engineSound.isPlaying) {
        engineSound.play();
      }
      if (engineSound.isPlaying) {
        engineSound.setVolume(Math.min(currentSpeed / 300 + 0.5, 1));
        engineSound.setPlaybackRate(currentSpeed / 10 + 0.8);
      }
    }

    // Gamepad Inputs
    const gp = gamepadStore.state;
    const buttonA = gp.buttonA;
    const buttonB = gp.buttonB;
    const RB = gp.RB; // Jump/Drift
    const LB = gp.LB; // Item
    const select = gp.select;
    const start = gp.start;
    const joystickX = gp.joystick[0];

    // Handling
    const kartRotation = kart.rotation.y - driftDirection * driftForce;
    const forwardDirection = new THREE.Vector3(
      -Math.sin(kartRotation),
      0,
      -Math.cos(kartRotation),
    );

    if (start) {
      gameStore.gameStarted = false;
    }

    if (leftWheel) leftWheel.rotation.y = steeringAngleWheels / 25;

    // Steering logic adapted for Joystick (Analog)
    if (!driftLeft && !driftRight) {
      steeringAngle = currentSteeringSpeed * -joystickX;
      targetXPosition = -camMaxOffset * -joystickX;
    } else if (driftLeft && !driftRight) {
      steeringAngle = currentSteeringSpeed * -(joystickX - 1);
      targetXPosition = -camMaxOffset * -joystickX;
    } else if (driftRight && !driftLeft) {
      steeringAngle = currentSteeringSpeed * -(joystickX + 1);
      targetXPosition = -camMaxOffset * -joystickX;
    }

    // Accelerating
    const shouldSlow = gameStore.shouldSlowDown;

    if (buttonA && currentSpeed < maxSpeed) {
      currentSpeed = Math.min(
        currentSpeed + acceleration * delta * 144,
        maxSpeed,
      );
    } else if (buttonA && currentSpeed > maxSpeed && effectiveBoost > 0) {
      currentSpeed = Math.max(
        currentSpeed - decceleration * delta * 144,
        maxSpeed,
      );
    }

    if (buttonA) {
      if (currentSteeringSpeed < MaxSteeringSpeed) {
        currentSteeringSpeed = Math.min(
          currentSteeringSpeed + 0.0001 * delta * 144,
          MaxSteeringSpeed,
        );
      }
    }

    if (shouldSlow) {
      currentSpeed = Math.max(
        currentSpeed - decceleration * 2 * delta * 144,
        0,
      );
      currentSteeringSpeed = 0;
      slowDownDuration -= 1500 * delta;
      shouldLaunch = true;
      if (slowDownDuration <= 1) {
        gameStore.shouldSlowDown = false;
        slowDownDuration = 1500;
        shouldLaunch = false;
      }
    }

    // Reversing
    if (buttonB) {
      if (currentSteeringSpeed < MaxSteeringSpeed) {
        currentSteeringSpeed = Math.min(
          currentSteeringSpeed + 0.0001 * delta * 144,
          MaxSteeringSpeed,
        );
      }
    }

    if (buttonB && currentSpeed <= 0) {
      currentSpeed = Math.max(
        currentSpeed - acceleration * delta * 144,
        -maxSpeed,
      );
    }
    // Decelerating
    else if (!buttonA) {
      if (currentSteeringSpeed > 0) {
        currentSteeringSpeed = Math.max(
          currentSteeringSpeed - 0.00005 * delta * 144,
          0,
        );
      } else if (currentSteeringSpeed < 0) {
        currentSteeringSpeed = Math.min(
          currentSteeringSpeed + 0.00005 * delta * 144,
          0,
        );
      }
      currentSpeed = Math.max(currentSpeed - decceleration * delta * 144, 0);
    }

    // Move Kart
    kart.rotation.y += steeringAngle * delta * 144;

    // Apply damping to simulate slowdown when no keys are pressed
    const linvel = body.linvel();
    body.applyImpulse(
      {
        x: -linvel.x * (1 - damping) * delta * 144,
        y: 0,
        z: -linvel.z * (1 - damping) * delta * 144,
      },
      true,
    );

    const bodyPosition = body.translation();
    kart.position.set(bodyPosition.x, bodyPosition.y - 0.5, bodyPosition.z);

    // Jumping
    if (RB && isOnGround && !jumpIsHeld) {
      jumpForce += 10;
      isOnFloor = false;
      jumpIsHeld = true;
      if (jumpSound) {
        if (jumpSound.isPlaying) jumpSound.stop();
        jumpSound.play();
      }
      isOnGround = false;
    }

    if (isOnFloor && jumpForce > 0) {
      if (landingSound && !landingSound.isPlaying) landingSound.play();
    }
    if (!isOnGround && jumpForce > 0) {
      jumpForce -= 1 * delta * 144;
    }
    if (!RB) {
      jumpIsHeld = false;
      driftDirection = 0;
      driftForce = 0;
      driftLeft = false;
      driftRight = false;
    }

    // Drifting
    if (
      jumpIsHeld &&
      currentSteeringSpeed > 0 &&
      joystickX < -0.1 &&
      !driftRight
    ) {
      driftLeft = true;
    }
    if (
      jumpIsHeld &&
      currentSteeringSpeed > 0 &&
      joystickX > 0.1 &&
      !driftLeft
    ) {
      driftRight = true;
    }

    if (!jumpIsHeld && !driftLeft && !driftRight) {
      mario.rotation.y = THREE.MathUtils.lerp(
        mario.rotation.y,
        0,
        0.0001 * delta * 144,
      );
      turboColor = 0xffffff;
      accumulatedDriftPower = 0;
      if (driftSound) driftSound.stop();
      if (driftTwoSound) driftTwoSound.stop();
      if (driftOrangeSound) driftOrangeSound.stop();
      if (driftPurpleSound) driftPurpleSound.stop();
    }

    if (driftLeft) {
      driftDirection = 1;
      driftForce = 0.4;
      mario.rotation.y = THREE.MathUtils.lerp(
        mario.rotation.y,
        steeringAngle * 25 + 0.4,
        0.05 * delta * 144,
      );
      if (isOnFloor) {
        accumulatedDriftPower += 0.1 * (steeringAngle + 1) * delta * 144;
      }
    }
    if (driftRight) {
      driftDirection = -1;
      driftForce = 0.4;
      mario.rotation.y = THREE.MathUtils.lerp(
        mario.rotation.y,
        -(-steeringAngle * 25 + 0.4),
        0.05 * delta * 144,
      );
      if (isOnFloor) {
        accumulatedDriftPower += 0.1 * (-steeringAngle + 1) * delta * 144;
      }
    }

    if (!driftLeft && !driftRight) {
      mario.rotation.y = THREE.MathUtils.lerp(
        mario.rotation.y,
        steeringAngle * 30,
        0.05 * delta * 144,
      );
      scale = 0;
    }

    if (accumulatedDriftPower > blueTurboThreshold) {
      turboColor = 0x00ffff;
      boostDuration = 50;
      if (driftBlueSound && !driftBlueSound.isPlaying) driftBlueSound.play();
    }
    if (accumulatedDriftPower > orangeTurboThreshold) {
      turboColor = 0xffcf00;
      boostDuration = 100;
      if (driftBlueSound) driftBlueSound.stop();
      if (driftOrangeSound && !driftOrangeSound.isPlaying)
        driftOrangeSound.play();
    }
    if (accumulatedDriftPower > purpleTurboThreshold) {
      turboColor = 0xff00ff;
      boostDuration = 250;
      if (driftOrangeSound) driftOrangeSound.stop();
      if (driftPurpleSound && !driftPurpleSound.isPlaying)
        driftPurpleSound.play();
    }

    if (driftLeft || driftRight) {
      const oscillation = Math.sin((Date.now() / 1000) * 10) * 0.1;
      const vibration = oscillation + 0.9;
      if (turboColor === 0xffffff) {
        scale = vibration * 0.8;
      } else {
        scale = vibration;
      }
      if (isOnFloor && driftSound && !driftSound.isPlaying) {
        driftSound.play();
        if (driftTwoSound) driftTwoSound.play();
        if (landingSound) landingSound.play();
      }
    }

    // Release Drift
    if (boostDuration > 1 && !jumpIsHeld) {
      isBoosting = true;
      effectiveBoost = boostDuration;
      boostDuration = 0;
    } else if (effectiveBoost <= 1) {
      targetZPosition = 8;
      isBoosting = false;
    }

    if (isBoosting && effectiveBoost > 1) {
      currentSpeed = boostSpeed;
      effectiveBoost -= 1 * delta * 144;
      targetZPosition = 10;
      if (turboSound && !turboSound.isPlaying) turboSound.play();
      if (driftTwoSound) driftTwoSound.play();
      if (driftBlueSound) driftBlueSound.stop();
      if (driftOrangeSound) driftOrangeSound.stop();
      if (driftPurpleSound) driftPurpleSound.stop();
    } else if (effectiveBoost <= 1) {
      isBoosting = false;
      targetZPosition = 8;
      if (turboSound) turboSound.stop();
    }

    // Camera
    if (cam) {
      cam.updateMatrixWorld();
      cam.position.x = THREE.MathUtils.lerp(
        cam.position.x,
        targetXPosition,
        0.01 * delta * 144,
      );
      cam.position.z = THREE.MathUtils.lerp(
        cam.position.z,
        targetZPosition,
        0.01 * delta * 144,
      );
    }

    // Apply physics impulse
    body.applyImpulse(
      {
        x: forwardDirection.x * currentSpeed * delta * 144,
        y: jumpForce * delta * 144,
        z: forwardDirection.z * currentSpeed * delta * 144,
      },
      true,
    );

    steeringAngleWheels = steeringAngle * 25;

    // Reset
    if (select) {
      body.setTranslation(
        { x: position[0], y: position[1], z: position[2] },
        true,
      );

      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      currentSpeed = 0;
      currentSteeringSpeed = 0;
      isBoosting = false;
      effectiveBoost = 0;
      isOnGround = false;
      jumpForce = 0;
      driftDirection = 0;
      kart.rotation.y = Math.PI / 2;
    }

    // Items
    if (LB) {
      if (gameStore.item === "mushroom") {
        isBoosting = true;
        effectiveBoost = 300;
        gameStore.useItem();
      } else if (gameStore.item === "banana" || gameStore.item === "shell") {
        gameStore.useItem();
      }
    }

    player.setState("position", body.translation());
    player.setState("rotation", kartRotation + mario.rotation.y);
    player.setState("isBoosting", isBoosting);
    player.setState("shouldLaunch", shouldLaunch);
    player.setState("turboColor", turboColor);
    player.setState("scale", scale);
    player.setState("bananas", gameStore.bananas);

    // Safety net: Set fallen state if falling too deep (Y < -20)
    const pos = body.translation();
    if (pos.y < -20 && !gameStore.isFallen) {
      gameStore.isFallen = true;
    }
    if (leftWheel) {
      // @ts-ignore
      leftWheel.kartRotation = kartRotation;
      // @ts-ignore
      leftWheel.isSpinning =
        driftLeft || driftRight || (shouldSlow && currentSpeed > 5);
    }
    if (rightWheel) {
      // @ts-ignore
      rightWheel.kartRotation = kartRotation;
      // @ts-ignore
      rightWheel.isSpinning =
        driftLeft || driftRight || (shouldSlow && currentSpeed > 5);
    }
  });

  $effect(() => {
    // Force Svelte à tracker ces dépendances
    const currentBody = body;
    const currentResetSignal = gameStore.resetSignal;

    console.log("🔄 Reset $effect triggered:", {
      hasBody: !!currentBody,
      resetSignal: currentResetSignal,
      position,
      playerId: player.id,
      gameStoreId: gameStore.id,
    });

    if (currentBody && currentResetSignal > 0) {
      console.log("✅ Scheduling reset to position:", position);

      // Attendre le prochain frame pour être sûr que le RigidBody est complètement initialisé
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          console.log("✅ Applying reset NOW to position:", position);
          currentBody.setTranslation(
            { x: position[0], y: position[1], z: position[2] },
            true,
          );
          currentBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
          currentBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
          console.log("✅ Reset applied successfully!");
        });
      });
    } else {
      console.log("⏸️ Reset skipped:", {
        reason: !currentBody ? "body not ready" : "resetSignal is 0",
      });
    }
  });
</script>

{#if player.id === gameStore.id}
  <T.Group>
    <RigidBody
      bind:rigidBody={body}
      colliders={false}
      {position}
      centerOfMass={[0, -1, 0]}
      mass={3}
      ccd
      name="player"
      type={player.id === gameStore.id ? "dynamic" : "kinematicPosition"}
    >
      <Collider
        shape="ball"
        args={[0.5]}
        mass={3}
        oncollisionenter={() => {
          isOnFloor = true;
          isOnGround = true;
        }}
        oncollisionexit={() => {
          isOnFloor = false;
          isOnGround = false;
        }}
      />
    </RigidBody>

    <T.Group bind:ref={kart} rotation={[0, Math.PI / 2, 0]}>
      <T.Group bind:ref={mario}>
        <Mario
          {currentSpeed}
          {steeringAngleWheels}
          {isBoosting}
          {shouldLaunch}
          scale={1}
        />
        <CoinParticles coins={gameStore.coins} />
        <ItemParticles item={gameStore.item} />

        <T.Mesh position={[0.6, 0.05, 0.5]} {scale}>
          <T.SphereGeometry args={[0.05, 16, 16]} />
          <T.MeshStandardMaterial
            emissive={turboColor}
            toneMapped={false}
            emissiveIntensity={100}
            transparent
            opacity={0.4}
          />
        </T.Mesh>

        <T.Mesh position={[0.6, 0.05, 0.5]} scale={scale * 10}>
          <T.SphereGeometry args={[0.05, 16, 16]} />
          <FakeGlowMaterial
            falloff={3}
            glowInternalRadius={1}
            glowColor={turboColor}
            glowSharpness={1}
          />
        </T.Mesh>

        <T.Mesh position={[-0.6, 0.05, 0.5]} {scale}>
          <T.SphereGeometry args={[0.05, 16, 16]} />
          <T.MeshStandardMaterial
            emissive={turboColor}
            toneMapped={false}
            emissiveIntensity={100}
            transparent
            opacity={0.4}
          />
        </T.Mesh>

        <T.Mesh position={[-0.46, 0.05, 0.3]} bind:ref={leftWheel}></T.Mesh>
        <T.Mesh position={[0.46, 0.05, 0.3]} bind:ref={rightWheel}></T.Mesh>

        <T.Mesh position={[-0.6, 0.05, 0.5]} scale={scale * 10}>
          <T.SphereGeometry args={[0.05, 16, 16]} />
          <FakeGlowMaterial
            falloff={3}
            glowInternalRadius={1}
            glowColor={turboColor}
            glowSharpness={1}
          />
        </T.Mesh>

        <DriftParticlesLeft {turboColor} {scale} />
        <DriftParticlesRight {turboColor} {scale} />
        <SmokeParticles {driftRight} {driftLeft} />

        <PointParticle
          position={[-0.6, 0.05, 0.5]}
          png="./particles/circle.png"
          {turboColor}
        />
        <PointParticle
          position={[0.6, 0.05, 0.5]}
          png="./particles/circle.png"
          {turboColor}
        />
        <PointParticle
          position={[-0.6, 0.05, 0.5]}
          png="./particles/star.png"
          {turboColor}
        />
        <PointParticle
          position={[0.6, 0.05, 0.5]}
          png="./particles/star.png"
          {turboColor}
        />

        <HitParticles {shouldLaunch} />
      </T.Group>

      <T.PerspectiveCamera
        makeDefault
        position={[0, 2, 8]}
        fov={50}
        bind:ref={cam}
        far={5000}
      />

      <PositionalAudio
        bind:ref={engineSound}
        src="/sounds/engine.wav"
        loop
        distance={1000}
      />
      <PositionalAudio
        bind:ref={driftSound}
        src="/sounds/drifting.mp3"
        loop
        distance={1000}
      />
      <PositionalAudio
        bind:ref={driftTwoSound}
        src="/sounds/driftingTwo.mp3"
        loop
        distance={1000}
      />
      <PositionalAudio
        bind:ref={driftOrangeSound}
        src="/sounds/driftOrange.wav"
        loop={false}
        distance={1000}
      />
      <PositionalAudio
        bind:ref={driftBlueSound}
        src="/sounds/driftBlue.wav"
        loop={false}
        distance={1000}
      />
      <PositionalAudio
        bind:ref={driftPurpleSound}
        src="/sounds/driftPurple.wav"
        loop={false}
        distance={1000}
      />
      <PositionalAudio
        bind:ref={jumpSound}
        src="/sounds/jump.mp3"
        loop={false}
        distance={1000}
      />
      <PositionalAudio
        bind:ref={landingSound}
        src="/sounds/landing.wav"
        loop={false}
        distance={1000}
      />
      <PositionalAudio
        bind:ref={turboSound}
        src="/sounds/turbo.wav"
        loop={false}
        distance={1000}
      />
    </T.Group>
  </T.Group>
{/if}
