# Firebase Setup Guide

## Problem Solved
Previously, info blocks were stored in browser `localStorage`, which meant data was only visible on the computer/browser where it was created. This fix replaces localStorage with **Firebase Realtime Database** so that all info blocks are stored in a shared cloud database accessible from any device.

## What You Need to Do

### Step 1: Create a Firebase Project (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `hotel-3paardekens` (or any name you prefer)
4. Click **Continue**
5. Disable Google Analytics (not needed for this project) or leave it enabled
6. Click **Create project**
7. Wait for project creation, then click **Continue**

### Step 2: Create a Web App

1. In your Firebase project dashboard, click the **Web icon** (</>) to add Firebase to your web app
2. Register app with nickname: `Hotel 3 Paardekens Website`
3. **Do NOT** check "Also set up Firebase Hosting" (not needed)
4. Click **Register app**
5. You'll see your Firebase configuration - **keep this window open**, you'll need these values

### Step 3: Enable Realtime Database

1. In the left sidebar, click **Build** → **Realtime Database**
2. Click **Create Database**
3. Select your database location (choose closest to your users):
   - `europe-west1` for Europe
   - `us-central1` for USA
4. **Security rules**: Start in **test mode** (we'll configure proper rules in Step 5)
5. Click **Enable**

### Step 4: Update Your Configuration File

1. Open the file `firebase-config.js` in your website root directory
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",              // From Step 2
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

**Where to find these values:**
- You saw them in Step 2 when you registered the web app
- Or click the gear icon ⚙️ next to "Project Overview" → **Project settings** → Scroll down to "Your apps" section

### Step 5: Configure Security Rules

⚠️ **IMPORTANT**: Test mode allows anyone to read/write for 30 days. You need to secure your database!

1. In Firebase Console, go to **Realtime Database** → **Rules** tab
2. Replace the rules with the following:

```json
{
  "rules": {
    "infoBlocks": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

**What this does:**
- Anyone can **read** info blocks (needed for public website visitors)
- Only **authenticated users** can write/update/delete (admin only)

3. Click **Publish**

### Step 6: Set Up Admin Authentication (Optional but Recommended)

To properly secure write access, you should set up Firebase Authentication:

1. Go to **Build** → **Authentication** → **Get started**
2. Enable **Email/Password** sign-in method
3. Add your admin email: `rev.management@groupdaedalus.be`
4. Set a password

**Note:** The current implementation uses a simple admin login check. For production, you should integrate Firebase Authentication properly.

### Step 7: Test the Setup

1. **Deploy your updated website** (upload all changed files to your web server)
2. **Open the admin panel** on your computer
3. **Create a test info block**
4. **Open the website on a different computer/browser**
5. **Verify you can see the info block** on the public info page

✅ If you can see the info block on different devices, setup is complete!

## Data Migration

The system will **automatically migrate** your existing 13 info blocks from localStorage to Firebase the first time it runs after configuration. Here's how it works:

1. When Firebase is configured and the page loads
2. If Firebase database is empty but localStorage has data
3. The system automatically copies all blocks to Firebase
4. You'll see a console message: "Migrating X info blocks from localStorage to Firebase..."

**No manual data migration needed!**

## Troubleshooting

### "Firebase SDK not loaded" error
- Make sure you uploaded `firebase-config.js` to your web server
- Check that the Firebase scripts are loading in `info.html` and `hoteladmin.html`

### Info blocks not showing on other computers
- Verify Firebase configuration is correct in `firebase-config.js`
- Check browser console for errors (press F12)
- Make sure you clicked "Publish" on the security rules

### "Permission denied" errors
- Check your security rules in Firebase Console
- Make sure rules allow public read access for `infoBlocks`

### Old data still showing from localStorage
- The system uses Firebase as primary storage when available
- localStorage is only used as a fallback if Firebase fails
- Clear browser cache if you see stale data

## Cost

Firebase Realtime Database has a **free tier** that includes:
- 1 GB stored data
- 10 GB/month downloaded data
- 100 simultaneous connections

This is more than sufficient for a hotel website. You won't be charged unless you exceed these limits.

## Support

For Firebase-specific help:
- [Firebase Documentation](https://firebase.google.com/docs/database)
- [Firebase Console](https://console.firebase.google.com/)

## Summary

**Before**: Info blocks stored in browser localStorage (device-specific)
**After**: Info blocks stored in Firebase Realtime Database (shared across all devices)

The fix ensures that when you create info blocks on one computer, they're immediately visible on all devices accessing the website.
