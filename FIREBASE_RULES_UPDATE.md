# Firebase Security Rules Update

## Important: Update Your Firebase Realtime Database Rules

The rooms data has been migrated to Firebase Realtime Database to enable synchronization across all browsers and devices. You need to update your Firebase security rules to allow access to the rooms data.

## Updated Security Rules

Go to [Firebase Console](https://console.firebase.google.com/) → **Realtime Database** → **Rules** tab and replace the rules with:

```json
{
  "rules": {
    "infoBlocks": {
      ".read": true,
      ".write": "auth != null"
    },
    "faqBlocks": {
      ".read": true,
      ".write": "auth != null"
    },
    "rooms": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

**What this does:**
- Anyone can **read** info blocks, FAQ blocks, and rooms (needed for public website visitors)
- Only **authenticated users** can write/update/delete (admin only)

**After updating:**
1. Click **Publish** to save the changes
2. The rules take effect immediately
3. Test by logging into the admin panel and creating/editing a room
4. Verify the room appears on the public rooms page across different browsers

## Security Notes

- The Firebase Authentication is already configured in `admin-auth.js`
- When you log in to the admin panel, you are authenticated with Firebase
- This authentication is required for any write operations (create, update, delete)
- Public users can only read the data, not modify it
- All write operations are protected by Firebase security rules

## Troubleshooting

If you see errors like "Permission denied" in the console:
1. Verify you've published the updated rules in Firebase Console
2. Ensure you're logged in to the admin panel before making changes
3. Check that Firebase Authentication is working (you should see "✓ Firebase authentication successful" in the console)
