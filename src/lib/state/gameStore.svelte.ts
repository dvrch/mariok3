
export const playAudio = (path: string, callback?: () => void) => {
    const audio = new Audio(`./sounds/${path}.mp3`);
    if (callback) {
        audio.addEventListener("ended", callback);
    }
    audio.play();
};

export const items = ["banana", "shell"];

class GameStore {
    gameStarted = $state(false);
    controls = $state("");
    particles1 = $state<any[]>([]);
    particles2 = $state<any[]>([]);
    leftWheel = $state<any>(null);
    rightWheel = $state<any>(null);
    bodyRotation = $state<any>(null);
    pastPositions = $state<any[]>([]);
    shouldSlowdown = $state(false);
    bananas = $state<any[]>([]);
    itemsList = ["mushroom", "shell", "banana"];
    item = $state("");
    shells = $state<any[]>([]);
    skids = $state<any[]>([]);
    coins = $state(0);
    players = $state<any[]>([]);
    body = $state<any>(null);
    id = $state("");
    joystickX = $state(0);
    driftButton = $state(false);
    itemButton = $state(false);
    menuButton = $state(false);
    isDrifting = $state(false);

    addPastPosition(position: any) {
        this.pastPositions = [position, ...this.pastPositions.slice(0, 499)];
    }

    addParticle1(particle: any) {
        this.particles1.push(particle);
    }

    removeParticle1(particle: any) {
        this.particles1 = this.particles1.filter((p) => p.id !== particle.id);
    }

    addParticle2(particle: any) {
        this.particles2.push(particle);
    }

    removeParticle2(particle: any) {
        this.particles2 = this.particles2.filter((p) => p.id !== particle.id);
    }

    addBanana(banana: any) {
        this.bananas.push(banana);
    }

    removeBanana(banana: any) {
        this.bananas = this.bananas.filter((b) => b.id !== banana.id);
    }

    removeBananaById(id: string) {
        this.bananas = this.bananas.filter((b) => b.id !== id);
    }

    setItem() {
        this.item = this.itemsList[Math.floor(Math.random() * this.itemsList.length)];
    }

    useItem() {
        this.item = "";
    }

    addShell(shell: any) {
        this.shells.push(shell);
    }

    removeShell(shell: any) {
        this.shells = this.shells.filter((s) => s.id !== shell.id);
    }

    addSkid(skid: any) {
        this.skids.push(skid);
    }

    addCoins() {
        this.coins += 1;
    }

    looseCoins() {
        this.coins -= 1;
    }

    addPlayer(player: any) {
        this.players.push(player);
    }

    removePlayer(player: any) {
        this.players = this.players.filter((p) => p.id !== player.id);
    }
}

export const gameStore = new GameStore();
