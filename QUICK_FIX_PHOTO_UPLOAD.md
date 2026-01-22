# QUICK FIX: Photo Upload Permission Error

## Problem
Getting this error when uploading photos?
```
Firebase Storage: User does not have permission to access 'rooms/xxxxx.png'
(storage/unauthorized)
```

## Solution (3 Minutes)

### 1. Open Firebase Console
Go to: https://console.firebase.google.com/

### 2. Navigate to Storage Rules
- Select project: **hotel-3paardekens**
- Click **Storage** in the left sidebar
- Click **Rules** tab

### 3. Update Rules
Delete everything and paste these rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /rooms/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**What this does:**
- `allow read: if true` - Anyone can view photos (needed for website visitors)
- `allow write: if request.auth != null` - Only logged-in admins can upload
- `{allPaths=**}` - Applies to all files in the rooms/ folder

### 4. Publish
Click the **Publish** button (top right)

### 5. Test
- Log in to admin panel
- Try uploading a photo
- Should work now! ✓

## Still Not Working?

**Make sure you're logged in:**
1. Log out of admin panel
2. Log back in with your credentials
3. Try uploading again

**Check Firebase Authentication:**
1. Firebase Console → **Authentication**
2. Click **Sign-in method**
3. Enable **Email/Password** if not already enabled

## Need More Help?
See **FIX_STORAGE_PERMISSIONS.md** for detailed troubleshooting.
