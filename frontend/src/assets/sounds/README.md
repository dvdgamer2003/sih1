# Sound Effects for Quiz App

This directory contains sound effects for the quiz application.

## Required Sound Files

You need to add the following MP3 files to this directory:

1. **correct.mp3** - Plays when user answers correctly
   - Suggested: Pleasant "ding" or "success" chime
   - Duration: 0.5-1 second
   - Tone: Positive, uplifting

2. **wrong.mp3** - Plays when user answers incorrectly
   - Suggested: Gentle "buzz" or "error" tone
   - Duration: 0.5-1 second
   - Tone: Neutral, not harsh

3. **click.mp3** - Plays on button clicks
   - Suggested: Soft "tap" or "click" sound
   - Duration: 0.2-0.3 seconds
   - Tone: Subtle, light

4. **success.mp3** - Plays when completing a quiz
   - Suggested: Celebratory "fanfare" or "victory" sound
   - Duration: 1-2 seconds
   - Tone: Exciting, rewarding

## Free Sound Resources

You can download free sound effects from:

1. **Freesound.org** - https://freesound.org/
   - Search for: "correct answer", "wrong answer", "button click", "success"
   - Filter by: Creative Commons 0 (Public Domain)

2. **Zapsplat.com** - https://www.zapsplat.com/
   - Free sound effects library
   - Categories: UI Sounds, Game Sounds

3. **Mixkit.co** - https://mixkit.co/free-sound-effects/
   - Free sound effects
   - No attribution required

4. **Pixabay** - https://pixabay.com/sound-effects/
   - Free sound effects
   - No attribution required

## Quick Setup with Example Sounds

### Option 1: Use Online Sound Effect Generators
- **Beepbox.co** - Create custom chiptune sounds
- **SFXR** - Generate retro game sound effects
- **Bfxr** - Advanced sound effect generator

### Option 2: Text-to-Speech for Temporary Testing
You can use simple beep sounds for testing:
- Correct: High-pitched beep (800Hz, 0.3s)
- Wrong: Low-pitched beep (200Hz, 0.3s)
- Click: Very short beep (600Hz, 0.1s)
- Success: Ascending tones (600Hz → 800Hz → 1000Hz)

## File Format Requirements

- **Format**: MP3 (recommended) or WAV
- **Sample Rate**: 44.1kHz or 48kHz
- **Bit Rate**: 128kbps or higher
- **Channels**: Mono or Stereo
- **Max File Size**: < 100KB per file (for better performance)

## Installation Instructions

1. Download or create your sound files
2. Convert them to MP3 format if needed
3. Rename them exactly as:
   - correct.mp3
   - wrong.mp3
   - click.mp3
   - success.mp3
4. Place them in this directory (`frontend/src/assets/sounds/`)
5. Restart the Expo development server

## Testing Sounds

After adding the files, test them in the app:
1. Go to any quiz screen
2. Answer questions to hear correct/wrong sounds
3. Complete a quiz to hear the success sound
4. Click buttons to hear click sounds

## Troubleshooting

If sounds don't play:
1. Check that files are named correctly
2. Verify files are in MP3 format
3. Check file permissions
4. Restart the Expo server
5. Clear the app cache
6. Check device volume settings

## Disabling Sounds

Users can disable sound effects in:
Settings → Preferences → Sound Effects (toggle off)
