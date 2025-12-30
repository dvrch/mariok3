/**
 * Audio configuration and sound paths
 * Centralized management of all audio assets used in the game
 */

// Audio paths constants
export const AUDIO_PATHS = {
    // Engine sounds
    engine: "engine.wav",
    engineTwo: "engineTwo.wav",
    
    // Drifting sounds
    drifting: "drifting.mp3",
    driftingTwo: "driftingTwo.mp3",
    driftBlue: "driftBlue.wav",
    driftOrange: "driftOrange.wav",
    driftPurple: "driftPurple.wav",
    
    // Player actions
    jump: "jump.mp3",
    landing: "landing.wav",
    turbo: "turbo.wav",
} as const;

export type AudioKey = keyof typeof AUDIO_PATHS;

/**
 * Audio manager - handles all sound playback
 */
export class AudioManager {
    private static readonly SOUNDS_BASE_PATH = "/sounds";
    private activeAudio: Map<string, HTMLAudioElement> = new Map();

    /**
     * Play an audio file
     * @param key - Audio key from AUDIO_PATHS
     * @param options - Playback options
     */
    play(
        key: AudioKey,
        options?: {
            callback?: () => void;
            volume?: number;
            loop?: boolean;
        }
    ): void {
        try {
            const audioPath = AUDIO_PATHS[key];
            const fullPath = `${AudioManager.SOUNDS_BASE_PATH}/${audioPath}`;
            
            const audio = new Audio(fullPath);
            
            if (options?.volume) {
                audio.volume = Math.max(0, Math.min(1, options.volume));
            }
            
            if (options?.loop) {
                audio.loop = true;
            }
            
            if (options?.callback) {
                audio.addEventListener("ended", options.callback, { once: true });
            }
            
            audio.play().catch(e => {
                console.warn(`Failed to play audio '${key}':`, e);
            });
            
            // Store reference for potential cleanup
            const audioId = `${key}_${Date.now()}`;
            this.activeAudio.set(audioId, audio);
            
            // Auto-cleanup after playback
            audio.addEventListener("ended", () => {
                this.activeAudio.delete(audioId);
            }, { once: true });
        } catch (e) {
            console.error(`Audio initialization failed for '${key}':`, e);
        }
    }

    /**
     * Stop all currently playing audio
     */
    stopAll(): void {
        this.activeAudio.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.activeAudio.clear();
    }

    /**
     * Check if audio is available
     */
    isSupported(): boolean {
        return typeof Audio !== "undefined";
    }

    /**
     * Get full path for an audio key
     * Useful if you need to reference the path elsewhere
     */
    getPath(key: AudioKey): string {
        return `${AudioManager.SOUNDS_BASE_PATH}/${AUDIO_PATHS[key]}`;
    }
}

// Export singleton instance
export const audioManager = new AudioManager();

/**
 * Convenience function for backward compatibility
 * @deprecated Use audioManager.play() instead
 */
export const playAudio = (key: AudioKey, callback?: () => void) => {
    audioManager.play(key, { callback });
};
