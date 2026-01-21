# Troubleshooting Password Reset Email Issues

This guide will help you resolve issues with the password reset email functionality.

## 🚀 Quick Start: Use the Verification Checklist

**Before troubleshooting**, complete the **[EMAILJS_VERIFICATION_CHECKLIST.md](EMAILJS_VERIFICATION_CHECKLIST.md)** to systematically verify your EmailJS configuration. The checklist covers:
- Public Key activation
- Service setup and enablement  
- Template configuration and variables
- Account usage limits
- Step-by-step testing

If the checklist doesn't resolve your issue, continue with the detailed troubleshooting below.

---

## Error: "There was an error sending the password reset email"

This error occurs when the EmailJS service fails to send the email. Here are the most common causes and solutions:

### 1. Verify EmailJS Configuration

**Current Configuration:**
- Public Key: `OuUDb11x_6V6Gvh7l`
- Service ID: `service_iu8cxtm`
- Template ID: `template_2oxmlh8`
- Admin Email: `rev.management@groupdaedalus.be`

**Steps to verify:**

1. Log in to your EmailJS account at https://www.emailjs.com/
2. Go to **Email Services** and verify:
   - Service `service_iu8cxtm` exists
   - Service is **enabled** (toggle should be ON)
   - Service is properly connected to your email provider
3. Go to **Email Templates** and verify:
   - Template `template_2oxmlh8` exists
   - Template has the correct template variables configured (see below)
4. Go to **Account** → **API Keys** and verify:
   - Public Key `OuUDb11x_6V6Gvh7l` is active

### 2. Check Template Variables

Your EmailJS template **MUST** include these variables:

- `{{to_email}}` - Recipient email address
- `{{to_name}}` - Recipient name
- `{{admin_email}}` - Admin email address
- `{{admin_password}}` - Admin password
- `{{reset_link}}` - Link to admin login page
- `{{message}}` - Password reset message

**Example Template:**

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

### 3. Browser-Specific Issues (Safari)

Safari has stricter security policies that may affect EmailJS:

**Solution 1: Check Safari Settings**
1. Open Safari → Preferences → Privacy
2. Uncheck "Prevent cross-site tracking" (temporarily for testing)
3. Reload the page and try again

**Solution 2: Test in Another Browser**
- Try Chrome, Firefox, or Edge to see if the issue is Safari-specific
- If it works in other browsers, the issue is likely Safari's security settings

**Solution 3: Check Console for Detailed Errors**
1. Open Safari Developer Tools (Cmd+Option+I)
2. Go to the Console tab
3. Click "Forgot your password?" and look for detailed error messages
4. Look for any CORS errors or blocked requests

### 4. Common EmailJS Issues

**Issue: Account Limit Reached**
- EmailJS free tier has a limit of 200 emails/month
- Check your EmailJS dashboard for usage statistics
- Upgrade to a paid plan if needed

**Issue: Email Service Not Connected**
- Some email services require additional verification
- Check your email provider's settings
- Make sure you've verified your domain/email

**Issue: Template Not Found**
- Double-check the Template ID matches exactly
- Template IDs are case-sensitive
- Ensure there are no extra spaces in the ID

**Issue: Invalid Public Key**
- Verify the public key in `hoteladmin.html` line 17
- Public keys are case-sensitive
- Generate a new public key if needed from EmailJS dashboard

### 5. Testing the Fix

After making changes to your EmailJS configuration:

1. **Clear Browser Cache:**
   - Safari: History → Clear History → All History
   - Or use Private Browsing mode (Cmd+Shift+N)

2. **Test the Password Reset:**
   - Open `hoteladmin.html`
   - Enter email: `rev.management@groupdaedalus.be`
   - Click "Forgot your password?"
   - Check browser console for any errors
   - Check your email inbox (and spam folder)

3. **Check Browser Console:**
   - Look for these success messages:
     ```
     Sending password reset email with params: {...}
     Password reset email sent successfully
     ```
   - If you see errors, they will help identify the specific issue

### 6. Update Configuration

If your EmailJS Service ID, Template ID, or Public Key are different from the ones shown above:

**Update Public Key (hoteladmin.html, line 17):**
```javascript
emailjs.init({
  publicKey: 'YOUR_PUBLIC_KEY_HERE'
});
```

**Update Service ID and Template ID (admin-auth.js, lines 15-16):**
```javascript
const EMAILJS_SERVICE_ID = 'your_service_id_here';
const EMAILJS_TEMPLATE_ID = 'your_template_id_here';
```

### 7. Alternative Solutions

If EmailJS continues to have issues, consider these alternatives:

**Option 1: Use a Different Email Service**
- SendGrid
- Mailgun
- AWS SES
- Postmark

**Option 2: Server-Side Email**
- Implement a backend API endpoint
- Use server-side email libraries (nodemailer, etc.)
- More secure and reliable than client-side email

**Option 3: Disable Password Reset (Temporary)**
- Remove or hide the "Forgot your password?" link
- Provide credentials through another channel
- Only recommended for demo/development

### 8. Still Having Issues?

If you've tried all the above steps and still can't send emails:

1. **Check EmailJS Status Page:**
   - Visit https://status.emailjs.com/
   - Check if there are any service outages

2. **Contact EmailJS Support:**
   - Email: contact@emailjs.com
   - Provide your Service ID and Template ID
   - Describe the error you're seeing

3. **Review Browser Console:**
   - Copy the full error message from the console
   - Share it with your development team
   - Look for specific error codes or messages

### 9. Security Note

**Important:** This implementation sends the actual password via email, which is only acceptable for demo/development environments.

**For production, you should:**
- Implement server-side password reset with secure tokens
- Use password hashing (bcrypt, argon2, etc.)
- Implement token expiration (15-60 minutes)
- Never send passwords via email
- Use HTTPS for all communications

---

## Quick Reference: Error Messages

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| "Email service is not currently available" | EmailJS CDN blocked or not loaded | Check internet connection, disable ad blockers, check browser console |
| "Email address not found in our system" | Wrong email entered | Use `rev.management@groupdaedalus.be` |
| "There was an error sending the password reset email" | EmailJS configuration issue | Check Service ID, Template ID, and template variables |
| "An unexpected error occurred" | JavaScript error | Check browser console for details |

---

For more information, see **EMAIL_SETUP.md** in the project root.
