# Email Configuration for Password Reset

This application uses EmailJS to send password reset emails. The setup has been completed with the following configuration.

## Current Configuration

- **EmailJS Public Key**: `MEiKFhBHfwDzT-xz1` (configured in hoteladmin.html)
- **Service ID**: `service_iu8cxtm`
- **Template ID**: `template_2oxmlh8`
- **Admin Email**: `rev.management@groupdaedalus.be`

## Email Template

For a modern, visually appealing email template with styled buttons and responsive design, see **[EMAIL_TEMPLATE.md](EMAIL_TEMPLATE.md)**. This guide includes:
- Complete HTML email template with gradient header and styled button
- Instructions for configuring in EmailJS dashboard
- Documentation on variable replacement mechanism
- Mobile-responsive design best practices

## How Password Reset Works

1. User enters their email address in the login form
2. User clicks "Forgot your password?" link
3. System validates the email matches the admin email
4. EmailJS sends an email with login credentials using a modern, styled template
5. User receives email and can log in with the provided password

**Note:** For the improved email template with modern styling, visual hierarchy, and a styled button (instead of a plain link), see **[EMAIL_TEMPLATE.md](EMAIL_TEMPLATE.md)**.

## EmailJS Template Configuration

The EmailJS template should be configured with the following variables:

### Primary Template Variables (Standardized):
- `{{email}}` - Recipient email address (standardized variable name)
- `{{link}}` - Password reset/login link (standardized variable name)

### Additional Template Variables (Backward Compatible):
- `{{to_email}}` - Recipient email address (legacy)
- `{{to_name}}` - Recipient name (set to "Admin")
- `{{admin_email}}` - Admin email address for reference
- `{{admin_password}}` - The admin password (for demo purposes)
- `{{reset_link}}` - Link back to the admin login page (legacy)
- `{{message}}` - Password reset message

### How Variable Replacement Works:
When the code sends an email, it provides a `templateParams` object with key-value pairs. EmailJS automatically finds all `{{variable_name}}` placeholders in your template and replaces them with the corresponding values from `templateParams`.

**Example:**
- Code sends: `{ email: 'admin@example.com', link: 'https://example.com/login' }`
- Template contains: `Your email is {{email}}. Click: {{link}}`
- Email received: `Your email is admin@example.com. Click: https://example.com/login`

For complete details on how variable replacement works and to see a modern, visually appealing email template, see **[EMAIL_TEMPLATE.md](EMAIL_TEMPLATE.md)**.

### Recommended Template Content:

**For the best user experience**, use the modern HTML template provided in [EMAIL_TEMPLATE.md](EMAIL_TEMPLATE.md), which includes:
- Gradient header with clear branding
- Styled button for the password reset link (not a plain text link)
- Responsive design that looks great on mobile and desktop
- Visual hierarchy with clear sections
- Professional styling with inline CSS for email client compatibility

**Legacy Plain Text Template** (if you prefer a simple version):

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

## Verification

After setting up EmailJS, use the **EMAILJS_VERIFICATION_CHECKLIST.md** to verify your configuration is correct. This checklist will guide you through verifying:
- Public Key is active
- Service exists and is enabled
- Template exists with all required variables
- Account limits are not exceeded

## Troubleshooting

If you encounter errors with the password reset functionality:
1. **First**: Complete the **EMAILJS_VERIFICATION_CHECKLIST.md** to ensure your EmailJS account is properly configured
2. **If issues persist**: See **TROUBLESHOOTING_PASSWORD_RESET.md** for comprehensive troubleshooting

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
