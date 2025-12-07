// Sound effects temporarily disabled due to expo-av deprecation
// TODO: Migrate to expo-audio when stable

class SoundManager {
    private isEnabled: boolean = true;
    private isInitialized: boolean = false;

    async initialize() {
        this.isInitialized = true;
        console.log('Sound Manager initialized (Silent Mode)');
    }

    async playCorrect() {
        // No-op
    }

    async playWrong() {
        // No-op
    }

    async playClick() {
        // No-op
    }

    async playSuccess() {
        // No-op
    }

    setEnabled(enabled: boolean) {
        this.isEnabled = enabled;
    }

    getEnabled(): boolean {
        return this.isEnabled;
    }

    async cleanup() {
        this.isInitialized = false;
    }
}

export const soundManager = new SoundManager();
