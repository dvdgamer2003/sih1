# PhET Branding Removal - Cache Clearing Instructions

## ✅ HTML Files Successfully Modified

All 21 simulation HTML files have been updated:
- "PhET" → "StreakWise" 
- PhET logos hidden
- Backup files created

## ⚠️ Cache Issue

The simulations are being served from browser/app cache. You need to clear the cache to see the changes.

## Solutions

### Option 1: Hard Refresh (Quickest)
**For Web:**
- Windows: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**For Expo:**
1. Stop the Expo server (`Ctrl + C` in the terminal)
2. Clear cache: `npx expo start --clear`
3. Reload the app

### Option 2: Clear Browser Cache
1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Option 3: Restart Expo with Cache Clear
Run this command:
```bash
cd frontend
npx expo start --clear --reset-cache
```

### Option 4: Add Cache-Busting Headers (Permanent Fix)

Add this to your server configuration or create a `.htaccess` file in `public/simulations/`:

```apache
# Disable caching for HTML files
<FilesMatch "\.(html)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires 0
</FilesMatch>
```

## Verification

After clearing cache, open any simulation and you should see:
- ✅ "StreakWise" instead of "PhET"
- ✅ No PhET logo
- ✅ StreakWise branding throughout

## Still Not Working?

If the issue persists:
1. Check browser console for errors
2. Verify the simulation URL is loading from your local server
3. Try opening in an incognito/private window
4. Check if a service worker is caching the files
