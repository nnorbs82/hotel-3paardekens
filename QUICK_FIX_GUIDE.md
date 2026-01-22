# Quick Firebase Troubleshooting Guide

## 🚨 Problem: Data Not Syncing Across Browsers?

If info blocks and rooms are only visible in the browser where you created them, use this quick troubleshooting guide.

## Step 1: Run Diagnostics (2 minutes)

1. Open `firebase-diagnostics.html` in your web browser
2. Click **"Run Diagnostics"**
3. Review the test results

The diagnostics tool will automatically check:
- ✓ Firebase SDK loading
- ✓ Firebase initialization
- ✓ Database connection
- ✓ Read permissions
- ✓ Authentication status
- ✓ Write permissions
- ✓ Data synchronization

## Step 2: Follow Fix Instructions

The diagnostics page will show you exactly what's wrong and provide links to fix it.

Common issues and their fixes:

### ❌ "Not authenticated with Firebase"
**Fix**: Enable Firebase Authentication
1. See [FIREBASE_AUTHENTICATION_SETUP.md](FIREBASE_AUTHENTICATION_SETUP.md)
2. Enable Email/Password authentication in Firebase Console
3. Log out and log in again to the admin panel

### ❌ "Write permission denied"
**Fix**: Same as above - you need Firebase Authentication enabled

### ❌ "Database connection failed"
**Fix**: Check Firebase configuration
1. See [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
2. Verify Realtime Database is enabled in Firebase Console
3. Check `firebase-config.js` has correct `databaseURL`

### ❌ "Read permission denied"
**Fix**: Update security rules
1. See [FIREBASE_RULES_UPDATE.md](FIREBASE_RULES_UPDATE.md)
2. Ensure rules allow public read access

## Step 3: Verify the Fix

After following the fix instructions:
1. Run diagnostics again to confirm all tests pass
2. Create a test info block in the admin panel
3. Open the website in a different browser
4. Verify you can see the info block

## Quick Links

- 🔧 [Run Diagnostics](firebase-diagnostics.html)
- 📖 [Authentication Setup Guide](FIREBASE_AUTHENTICATION_SETUP.md)
- 📖 [Firebase Setup Guide](FIREBASE_SETUP.md)
- 📖 [Security Rules Update](FIREBASE_RULES_UPDATE.md)

## Expected Results

### ✅ All Tests Passing
If all diagnostics tests pass:
- Your Firebase is configured correctly
- Data is syncing across all browsers
- Authentication is working

### ❌ Some Tests Failing
Follow the "How to Fix" links shown in the diagnostic results.

Most common issue: **Firebase Authentication not enabled** (Tests 5 & 6 fail)

## Need More Help?

1. Open browser console (F12) while running diagnostics
2. Look for detailed error messages
3. Check the specific documentation file linked in the failed test
4. Follow the step-by-step instructions

## Summary

```
firebase-diagnostics.html  → Identify the problem
FIREBASE_AUTHENTICATION_SETUP.md → Fix authentication issues
FIREBASE_SETUP.md → Fix configuration issues
FIREBASE_RULES_UPDATE.md → Fix permission issues
```

Most users just need to enable Firebase Authentication and log in again.
