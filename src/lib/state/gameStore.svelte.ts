import { audioManager } from "./audioConfig";

// Types
export interface Particle {
    id: string;
    [key: string]: any;
}

export interface Banana {
    id: string;
    [key: string]: any;
}

export interface Shell {
    id: string;
    [key: string]: any;
}

export interface Skid {
    [key: string]: any;
}

export interface Player {
    id: string;
    [key: string]: any;
}

// Item constants
export const ITEM_TYPES = ["mushroom", "shell", "banana"] as const;
export type ItemType = typeof ITEM_TYPES[number] | "";

// Export audioManager for use in components
export { audioManager } from "./audioConfig";

// Re-export for backward compatibility
export const playAudio = (key: string, callback?: () => void) => {
    audioManager.play(key as any, { callback });
};

class GameStore {
    // Game state
    gameStarted = $state(false);
    introAnimationPlaying = $state(true);
    controls = $state("");
    
    // Physics & movement
    leftWheel = $state<any>(null);
    rightWheel = $state<any>(null);
    bodyRotation = $state<any>(null);
    body = $state<any>(null);
    pastPositions = $state<any[]>([]);
    shouldSlowDown = $state(false);
    
    // Particles
    particles1 = $state<Particle[]>([]);
    particles2 = $state<Particle[]>([]);
    
    // Items & collectibles
    item = $state<ItemType>("");
    bananas = $state<Banana[]>([]);
    shells = $state<Shell[]>([]);
    coins = $state(0);
    
    // Visual effects
    skids = $state<Skid[]>([]);
    
    // Players & networking
    players = $state<Player[]>([]);
    id = $state("");
    
    // Input
    joystickX = $state(0);
    driftButton = $state(false);
    itemButton = $state(false);
    menuButton = $state(false);
    
    // Game mechanics
    isDrifting = $state(false);
    isFallen = $state(false);
    resetSignal = $state(0);

    // Position tracking
    addPastPosition(position: any): void {
        if (position) {
            this.pastPositions = [position, ...this.pastPositions.slice(0, 499)];
        }
    }

    // Particles management
    addParticle1(particle: Particle): void {
        if (particle?.id) {
            this.particles1.push(particle);
        }
    }

    removeParticle1(particle: Particle): void {
        this.particles1 = this.particles1.filter((p) => p.id !== particle.id);
    }

    addParticle2(particle: Particle): void {
        if (particle?.id) {
            this.particles2.push(particle);
        }
    }

    removeParticle2(particle: Particle): void {
        this.particles2 = this.particles2.filter((p) => p.id !== particle.id);
    }

    // Bananas management
    addBanana(banana: Banana): void {
        if (banana?.id) {
            this.bananas.push(banana);
        }
    }

    removeBanana(banana: Banana): void {
        this.bananas = this.bananas.filter((b) => b.id !== banana.id);
    }

    removeBananaById(id: string): void {
        this.bananas = this.bananas.filter((b) => b.id !== id);
    }

    // Items management
    setItem(): void {
        this.item = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
        audioManager.play("turbo");
    }

    useItem(): void {
        this.item = "";
    }

    // Shells management
    addShell(shell: Shell): void {
        if (shell?.id) {
            this.shells.push(shell);
        }
    }

    removeShell(shell: Shell): void {
        this.shells = this.shells.filter((s) => s.id !== shell.id);
    }

    // Skids management
    addSkid(skid: Skid): void {
        if (skid) {
            this.skids.push(skid);
        }
    }

    // Coins management
    addCoins(): void {
        this.coins += 1;
        audioManager.play("jump");
    }

    looseCoins(): void {
        if (this.coins > 0) {
            this.coins -= 1;
        }
    }

    // Players management
    addPlayer(player: Player): void {
        if (player?.id) {
            this.players.push(player);
        }
    }

    removePlayer(player: Player): void {
        this.players = this.players.filter((p) => p.id !== player.id);
    }

    // Game reset
    triggerReset(): void {
        this.isFallen = false;
        this.resetSignal += 1;
    }
}

export const gameStore = new GameStore();
