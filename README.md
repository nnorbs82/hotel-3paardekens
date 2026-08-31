# Hotel 3 Paardekens Website

This branch contains the current production version of the Hotel 3 Paardekens website.

## Production branch

- `main` is the current live website until the redesigned site is formally approved and merged.
- The newer website is being developed and reviewed on the `redesign` branch.

## Legacy admin system

The current production version includes the older Firebase-based administration workflow. Operational credentials are intentionally not stored in this repository.

If access to the legacy admin system is required, use the authorised Firebase Authentication account or reset access through the relevant service. Never commit passwords, private API keys or other secrets to GitHub.

## Security

Any credentials that were previously committed to this public repository must be treated as compromised and rotated at the relevant service. Removing a value from the current README does not remove it from Git history.

## Redesign

The `redesign` branch uses Pages CMS, GitHub and Cloudflare Pages for the new content-management and deployment workflow. It does not rely on the legacy Firebase admin panel for public website content.
