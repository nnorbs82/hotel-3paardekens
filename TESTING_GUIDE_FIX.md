# Testing Guide - File Upload and Info Block Creation Fix

## Prerequisites
Before testing, ensure you have:
- [ ] Firebase project created
- [ ] Firebase Realtime Database enabled
- [ ] Firebase Storage enabled (optional but recommended)
- [ ] `firebase-config.js` updated with your credentials
- [ ] All files deployed to your web server
- [ ] Firebase Security Rules configured

## Test Plan

### Test 1: Info Block Creation ✅

**Objective**: Verify info blocks can be created with proper feedback

**Steps**:
1. Open `https://yourdomain.com/hoteladmin.html`
2. Login with admin credentials
3. Click "Info" tab in navigation
4. Click "➕ Add Info Block" button
5. Fill in Title field with test content
6. Fill in Content field with test content
7. Click "💾 Save Info Block" button

**Expected Results**:
- ✅ Save button shows loading spinner while saving
- ✅ Green toast notification appears: "Info Block Created"
- ✅ Toast says "Your new info block has been created successfully"
- ✅ Modal closes automatically
- ✅ New info block appears in the list
- ✅ Browser console shows: "✓ Firebase initialized successfully"

**If It Fails**:
- ❌ Red toast "Save Failed" → Check browser console for errors
- ❌ No Firebase connection → Verify `firebase-config.js` has correct credentials
- ❌ No toast appears → Check for JavaScript errors in console

### Test 2: Info Block Editing ✏️

**Objective**: Verify info blocks can be edited with feedback

**Steps**:
1. In the info blocks list, click "✏️ Edit" on any block
2. Modify the title or content
3. Click "💾 Save Info Block"

**Expected Results**:
- ✅ Save button shows loading spinner
- ✅ Green toast: "Info Block Updated"
- ✅ Toast says "Your changes have been saved successfully"
- ✅ Modal closes
- ✅ Changes reflected in the list

### Test 3: Info Block Validation 🔍

**Objective**: Verify validation works properly

**Steps**:
1. Click "➕ Add Info Block"
2. Leave title or content empty
3. Click "💾 Save Info Block"

**Expected Results**:
- ✅ Red toast appears: "Validation Error"
- ✅ Toast says "Please fill in both the title and content"
- ✅ Modal stays open
- ✅ No block created

### Test 4: Multi-Device Sync 🌐

**Objective**: Verify info blocks sync across devices

**Steps**:
1. Create an info block on Device A (computer)
2. Open website on Device B (phone/tablet)
3. Navigate to the info page

**Expected Results**:
- ✅ Info block visible on both devices
- ✅ Changes on Device A appear on Device B
- ✅ Real-time synchronization works

### Test 5: Photo Upload (with Firebase Storage) 📷

**Objective**: Verify photos upload to Firebase Storage

**Prerequisites**: Firebase Storage must be enabled and configured

**Steps**:
1. In admin panel, click "Rooms" tab
2. Click "✏️ Edit" on any room or "➕ Add Room"
3. Scroll to "Room Photos" section
4. Drag and drop an image file OR click the upload area
5. Select a JPG/PNG/WebP image

**Expected Results**:
- ✅ Blue toast: "Uploading Photos"
- ✅ Toast says "Uploading 1 photo(s)..."
- ✅ After upload, green toast: "Photos Uploaded"
- ✅ Toast says "Successfully uploaded 1 photo(s)"
- ✅ Photo appears in preview with thumbnail
- ✅ Check Firebase Console > Storage > `rooms/` folder for uploaded file

### Test 6: Photo Upload Validation 🚫

**Objective**: Verify file validation works

**Steps**:
1. Try uploading a non-image file (PDF, TXT, etc.)
2. Try uploading a file with wrong extension (rename .exe to .jpg)

**Expected Results**:
- ✅ Yellow toast: "Invalid Files"
- ✅ Toast says "Please select only image files (JPG, PNG, WebP)"
- ✅ No file uploaded
- ✅ Browser console may show: "Skipping file with invalid extension"

### Test 7: Photo Upload Fallback 🔄

**Objective**: Verify fallback works when Storage unavailable

**Prerequisites**: Firebase Storage NOT enabled or misconfigured

**Steps**:
1. Try uploading a photo (same as Test 5)

**Expected Results**:
- ✅ Yellow toast: "Using Local Storage"
- ✅ Toast says "Photos will be stored locally..."
- ✅ Photo still appears in preview (as base64)
- ✅ Photo works but won't sync across devices

### Test 8: Toast Notifications 📢

**Objective**: Verify toast system works properly

**Test Each Type**:
- Success (green) - Create/update info block
- Error (red) - Try saving empty info block
- Warning (yellow) - Upload invalid file
- Info (blue) - Photo upload in progress

**Expected Results**:
- ✅ Toasts appear in top-right corner
- ✅ Smooth slide-in animation
- ✅ Auto-dismiss after 5 seconds
- ✅ Manual close button (✕) works
- ✅ Multiple toasts stack vertically
- ✅ Color-coded borders match type

### Test 9: Error Handling 🛡️

**Objective**: Verify errors are handled gracefully

**Scenarios to Test**:
1. Disconnect internet, try saving info block
2. Corrupt firebase-config.js credentials
3. Try uploading very large file (>100MB)

**Expected Results**:
- ✅ Red toast shows error message
- ✅ No JavaScript errors crash the page
- ✅ User can retry operation
- ✅ Browser console shows detailed error

### Test 10: Loading States ⏳

**Objective**: Verify loading indicators work

**Steps**:
1. Click "💾 Save Info Block" button
2. Observe button during save operation

**Expected Results**:
- ✅ Button shows spinning loader
- ✅ Button text becomes invisible (covered by spinner)
- ✅ Button is disabled during operation
- ✅ Button returns to normal after operation
- ✅ Smooth animation

## Browser Compatibility Testing

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers (iOS Safari, Android Chrome)

## Performance Testing

**Check for**:
- [ ] Fast page load (< 3 seconds)
- [ ] Smooth animations (60 FPS)
- [ ] Quick Firebase operations (< 2 seconds)
- [ ] No memory leaks (extended use)

## Accessibility Testing

**Verify**:
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Screen readers announce toasts
- [ ] Color contrast sufficient
- [ ] Focus indicators visible

## Console Checks

**Look for in Browser Console**:
- ✅ "✓ Firebase initialized successfully"
- ✅ "✓ Database URL: https://..."
- ✅ "✓ Storage Bucket: ..."
- ❌ No errors or warnings (except external resource blocks in dev)

## Firebase Console Checks

**Verify in Firebase Console**:

### Realtime Database
1. Navigate to Realtime Database
2. Check `infoBlocks/` node
3. Should see created blocks with IDs
4. Data structure: `{ id: { title, body, order, createdAt, updatedAt } }`

### Storage
1. Navigate to Storage
2. Check `rooms/` folder
3. Should see uploaded images
4. Filenames format: `{timestamp}-{random}.{ext}`

### Security Rules
1. Check Database Rules match:
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

2. Check Storage Rules match:
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

## Troubleshooting

### Issue: "Firebase SDK not loaded"
**Solution**: 
- Check firebase-config.js is deployed
- Check Firebase scripts load in HTML
- Verify no ad blockers blocking Firebase

### Issue: "Save Failed" on info blocks
**Solution**:
- Check Firebase Realtime Database is enabled
- Verify databaseURL in firebase-config.js
- Check Security Rules allow writes
- Check browser console for detailed error

### Issue: Photo upload fails silently
**Solution**:
- Check Firebase Storage is enabled
- Verify storageBucket in firebase-config.js
- Check Storage Security Rules
- Look for console warnings about invalid files

### Issue: No toasts appear
**Solution**:
- Check for JavaScript errors in console
- Verify admin-styles.css is loaded
- Check #toastContainer exists in HTML
- Look for CSS conflicts

### Issue: Info blocks don't sync across devices
**Solution**:
- Verify both devices use same Firebase project
- Check Firebase Realtime Database has data
- Refresh page (Ctrl+F5) on second device
- Check network connectivity

## Success Criteria

All tests should pass:
- ✅ Info blocks create/update/delete with feedback
- ✅ Photos upload to Firebase Storage
- ✅ Toast notifications work for all operations
- ✅ Error handling shows appropriate messages
- ✅ Multi-device sync works
- ✅ No JavaScript errors in console
- ✅ Security rules block unauthorized access

## Reporting Issues

If tests fail, collect this information:
1. Browser name and version
2. Operating system
3. Screenshot of error
4. Browser console errors (F12 → Console tab)
5. Firebase Console screenshot showing data
6. Steps to reproduce

Submit to: rev.management@groupdaedalus.be

## Next Steps After Testing

Once all tests pass:
1. [ ] Remove test info blocks
2. [ ] Upload actual content
3. [ ] Monitor Firebase usage
4. [ ] Set up backup procedures
5. [ ] Document admin credentials securely
6. [ ] Train additional admins if needed

---

**Testing Status**: ⬜ Not Started | 🔄 In Progress | ✅ Complete | ❌ Failed

Mark your progress as you complete each test!
