# Email Configuration for Password Reset

This application uses EmailJS to send password reset emails. Follow these steps to configure email sending:

## Setup Instructions

### 1. Create an EmailJS Account
- Go to [https://www.emailjs.com/](https://www.emailjs.com/)
- Sign up for a free account

### 2. Configure Email Service
- In your EmailJS dashboard, go to "Email Services"
- Click "Add New Service"
- Choose your email provider (Gmail, Outlook, etc.)
- Follow the prompts to connect your email account
- Note the **Service ID** (e.g., `service_hotel3p`)

### 3. Create Email Template
- In your EmailJS dashboard, go to "Email Templates"
- Click "Create New Template"
- Use the template ID: `template_password_reset`
- Configure the template with the following variables:
  - `{{to_email}}` - Recipient email address
  - `{{reset_link}}` - Password reset link
  - `{{admin_email}}` - Admin email for reference

Example template:
```
Subject: Password Reset Request - Hotel 3 Paardekens

Hello,

You have requested to reset your password for Hotel 3 Paardekens Admin Panel.

Click the link below to reset your password:
{{reset_link}}

If you did not request this password reset, please ignore this email.

Admin Email: {{admin_email}}

Best regards,
Hotel 3 Paardekens Team
```

### 4. Update Configuration
- Go to "Account" -> "General" in EmailJS dashboard
- Copy your **Public Key**
- Open `hoteladmin.html`
- Find the line: `emailjs.init('YOUR_PUBLIC_KEY');`
- Replace `'YOUR_PUBLIC_KEY'` with your actual public key

### 5. Update Service and Template IDs (if different)
If you used different IDs than the defaults:
- Open `admin-auth.js`
- Update the service ID in line with `emailjs.send()`
- Update the template ID in the same function

## Testing
1. Open `hoteladmin.html` in a browser
2. Enter the admin email: `rev.management@groupdaedalus.be`
3. Click "Forgot your password?"
4. Check the inbox of the configured email service for the reset email

## Current Limitations

This implementation provides the foundation for password reset emails but has the following limitations:

1. **Reset Link**: The email contains a reset link, but the application doesn't yet have a password reset page or token validation system. For a complete implementation, you would need to:
   - Create a password reset page that accepts reset tokens
   - Implement token generation and storage (requires backend)
   - Add token expiration and validation
   - Allow users to set a new password

2. **Client-Side Only**: This is a client-side only implementation using EmailJS. For production use, consider implementing server-side password reset with proper security measures.

3. **Configuration Management**: The EmailJS public key is currently in the HTML file. For production, use environment variables or a secure configuration management system.

## Security Notes
- Never commit your actual EmailJS public key to version control
- Consider using environment variables or a configuration file
- In production, implement proper server-side password reset with tokens and expiration
- The current implementation is suitable for demo/development purposes only
- The security vulnerability (displaying password in alert) has been removed

## Troubleshooting
- Check browser console for any EmailJS errors
- Verify that your EmailJS service is active and properly configured
- Ensure your email service provider allows sending from EmailJS
- Check spam folder if emails are not received
