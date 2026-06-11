# Apple Wallet FAQs: Firebase Setup

The Apple Wallet FAQ feature uses the existing Firebase project and Realtime Database.
It stores its data separately from the normal FAQs at:

```text
appleFaqBlocks
```

You do not need to create this node manually. The first successful save from the
Apple FAQs admin tab creates it automatically.

## What You Need To Do

### 1. Publish the updated Realtime Database rules

1. Open [Firebase Console](https://console.firebase.google.com/).
2. Select the `hotel-3paardekens` project.
3. Open **Build > Realtime Database**.
4. Select the **Rules** tab.
5. Replace the rules with the contents of `database.rules.json` from this repository:

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
    "appleFaqBlocks": {
      ".read": true,
      ".write": "auth != null"
    },
    "rooms": {
      ".read": true,
      ".write": "auth != null"
    },
    "siteContent": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

6. Click **Publish**.

The Apple FAQ page needs public read access so hotel guests can view it. Writes
remain restricted to users signed in through Firebase Authentication.

### 2. Confirm Email/Password authentication

This should already be enabled because the existing Rooms, Info, and FAQs admin
features use it.

1. In Firebase Console, open **Build > Authentication**.
2. Open **Sign-in method**.
3. Confirm **Email/Password** is enabled.
4. Open **Users** and confirm your admin user exists.

Do not send Firebase passwords or private account credentials to anyone. Use the
same admin login that already works in `hoteladmin.html`.

### 3. Deploy the changed website files

Deploy these files with the rest of the website:

```text
apple-wallet-faqs.html
admin-apple-faq-manager.js
hoteladmin.html
database.rules.json
```

`database.rules.json` is the reference copy for the repository. Publishing the
rules in Firebase Console is still required unless your deployment process also
deploys Realtime Database rules.

## First Data Test

1. Open the deployed `hoteladmin.html`.
2. Sign in with the existing admin account.
3. Select **Apple FAQs**.
4. Click **Add Apple FAQ Block**.
5. Enter an English title and answer. Dutch and French are optional and can be
   added now or later.
6. Save the block.
7. In Firebase Console, open **Realtime Database > Data**.
8. Confirm a new top-level `appleFaqBlocks` node appears.
9. Open `apple-wallet-faqs.html` on the deployed website and confirm the new
   question appears.

## Expected Data Shape

The generated block ID and timestamps will vary. A saved entry looks like:

```json
{
  "appleFaqBlocks": {
    "apple-faq-EXAMPLE": {
      "en": {
        "title": "How do I add my hotel pass to Apple Wallet?",
        "body": "<p>Open the link and tap Add to Apple Wallet.</p>"
      },
      "order": 1,
      "createdAt": "2026-06-11T10:00:00.000Z",
      "updatedAt": "2026-06-11T10:00:00.000Z"
    }
  }
}
```

## If Saving Fails

Open the browser developer console while saving.

- `PERMISSION_DENIED`: publish the updated rule and sign out/in again.
- Firebase Auth error: enable Email/Password authentication and confirm the user.
- Data only appears in one browser: Firebase failed and the localStorage fallback
  was used. Check the two items above before adding production content.

No Firebase Storage configuration is required because FAQ content is stored in
Realtime Database, not Firebase Storage.
