# Email Configuration for Password Reset

This application uses EmailJS to send password reset emails. The setup has been completed with the following configuration.

## Current Configuration

- **EmailJS Public Key**: `OuUDb11x_6V6Gvh7l` (configured in hoteladmin.html)
- **Service ID**: `service_iu8cxtm`
- **Template ID**: `template_2oxmlh8`
- **Admin Email**: `rev.management@groupdaedalus.be`

## How Password Reset Works

1. User enters their email address in the login form
2. User clicks "Forgot your password?" link
3. System validates the email matches the admin email
4. EmailJS sends an email with login credentials
5. User receives email and can log in with the provided password

## EmailJS Template Configuration

The EmailJS template should be configured with the following variables:

### Template Variables:
- `{{to_email}}` - Recipient email address
- `{{to_name}}` - Recipient name (set to "Admin")
- `{{admin_email}}` - Admin email address for reference
- `{{admin_password}}` - The admin password (for demo purposes)
- `{{reset_link}}` - Link back to the admin login page
- `{{message}}` - Password reset message

### Recommended Template Content:

**Subject:** Password Reset - Hotel 3 Paardekens Admin

**Body:**
```
Hello {{to_name}},

{{message}}

Your login credentials are:
Email: {{admin_email}}
Password: {{admin_password}}

You can log in here: {{reset_link}}

If you did not request this password reset, please contact the administrator immediately.

Best regards,
Hotel 3 Paardekens Team
```

## Testing

1. Open `hoteladmin.html` in a browser
2. Enter the admin email: `rev.management@groupdaedalus.be`
3. Click "Forgot your password?"
4. Check the configured email inbox for the password reset email
5. Use the credentials provided in the email to log in

## Security Notes

**Important:** This implementation sends the actual password via email, which is only acceptable for this demo/development environment because:
1. It uses a hardcoded password
2. It's a single-user admin system
3. It's not handling sensitive production data

**For production use, you should:**
- Implement proper server-side password reset with secure tokens
- Use password hashing (bcrypt, argon2, etc.)
- Implement token expiration (typically 15-60 minutes)
- Never send passwords via email
- Use HTTPS for all communications
- Store passwords securely in a database with proper hashing

## Troubleshooting

If you encounter errors with the password reset functionality, please see **TROUBLESHOOTING_PASSWORD_RESET.md** for a comprehensive troubleshooting guide.

### Quick Troubleshooting

- **Email not received?** Check spam/junk folder
- **"Email service not configured" error?** Verify EmailJS SDK is loaded in the browser console
- **"Failed to send" error?** 
  - Check browser console for detailed error messages
  - Verify Service ID and Template ID match your EmailJS dashboard
  - Ensure your EmailJS service is active
  - Check that email service provider allows sending from EmailJS
  - **See TROUBLESHOOTING_PASSWORD_RESET.md for detailed steps**
- **"Email address not found" error?** Make sure you entered `rev.management@groupdaedalus.be` exactly

## Additional Configuration

If you need to change the Service ID or Template ID:
1. Open `admin-auth.js`
2. Update `EMAILJS_SERVICE_ID` constant (line 14)
3. Update `EMAILJS_TEMPLATE_ID` constant (line 15)
4. Save the file and refresh the page
