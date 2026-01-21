# Testing Guide for Updated EmailJS Configuration

This guide provides step-by-step instructions for testing the password reset functionality after updating the EmailJS public key to `MEiKFhBHfwDzT-xz1`.

## 📋 What Was Changed

### 1. New EmailJS Public Key
- **Old Key**: `OuUDb11x_6V6Gvh7l`
- **New Key**: `MEiKFhBHfwDzT-xz1`
- **Location**: `hoteladmin.html` line 18

### 2. Standardized Template Variables
The code now sends both modern standardized variables and legacy variables for compatibility:

**Standardized (Primary)**:
- `{{email}}` - Recipient's email address
- `{{link}}` - Password reset/login link

**Legacy (Backward Compatible)**:
- `{{to_email}}`, `{{to_name}}`, `{{admin_email}}`, `{{admin_password}}`, `{{reset_link}}`, `{{message}}`

### 3. New Modern Email Template
A new professional email template is available in `EMAIL_TEMPLATE.md` featuring:
- Gradient header with branding
- Styled button (not plain link)
- Responsive design
- Clear visual hierarchy

## 🧪 Testing Procedure

### Prerequisites
Before testing, ensure:
1. You have access to the EmailJS dashboard at https://www.emailjs.com/
2. The new public key `MEiKFhBHfwDzT-xz1` is active in your EmailJS account
3. Your EmailJS service and template are properly configured
4. You can receive emails at `rev.management@groupdaedalus.be`

### Step 1: Verify EmailJS Dashboard Configuration

1. **Log in to EmailJS**: https://www.emailjs.com/
2. **Verify Public Key**:
   - Go to Account → API Keys
   - Confirm `MEiKFhBHfwDzT-xz1` is listed and active
3. **Verify Service**:
   - Go to Email Services
   - Find service `service_iu8cxtm`
   - Ensure it's enabled and connected
4. **Verify Template**:
   - Go to Email Templates
   - Find template `template_2oxmlh8`
   - Ensure it's active and contains the required variables

### Step 2: Update Email Template (Optional but Recommended)

For the best user experience, update your EmailJS template with the modern design:

1. Open `EMAIL_TEMPLATE.md` in this repository
2. Copy the HTML template from the "Email Body (HTML)" section
3. Go to EmailJS dashboard → Email Templates → `template_2oxmlh8`
4. Switch to HTML editor mode
5. Paste the new template
6. Click Save

**Note**: The new template uses the standardized variables `{{email}}` and `{{link}}`, but also includes all legacy variables for compatibility.

### Step 3: Test from EmailJS Dashboard

This is the safest way to test without affecting production:

1. In EmailJS dashboard, go to your template `template_2oxmlh8`
2. Click the **"Test It"** button
3. Fill in test values:
   ```
   email: your-test-email@example.com
   link: https://yoursite.com/hoteladmin.html
   to_email: your-test-email@example.com
   to_name: Test Admin
   admin_email: rev.management@groupdaedalus.be
   admin_password: Hotel3Paardekens2024!
   reset_link: https://yoursite.com/hoteladmin.html
   message: This is a test password reset email
   ```
4. Click **Send Test Email**
5. Check your test email inbox (and spam folder)
6. Verify:
   - ✅ Email received
   - ✅ All variables replaced correctly
   - ✅ Styled button appears and is clickable
   - ✅ Layout looks good on desktop
   - ✅ Layout looks good on mobile (forward to your phone)
   - ✅ Link works when clicked

**Expected Result**: You should receive a professional-looking email with a gradient header, styled button, and all variables properly replaced.

### Step 4: Test from the Application

Once EmailJS dashboard testing passes, test from the actual application:

1. **Open the Admin Page**:
   - Navigate to `hoteladmin.html` in your web browser
   - Do NOT log in yet

2. **Open Browser Developer Tools**:
   - **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Mac: `Cmd+Option+I`)
   - **Firefox**: Press `F12` or `Ctrl+Shift+I` (Mac: `Cmd+Option+I`)
   - **Safari**: Enable Developer Menu first (Safari → Preferences → Advanced → Show Develop menu), then press `Cmd+Option+I`

3. **Go to Console Tab**:
   - Click on the "Console" tab in Developer Tools
   - This will show log messages from the password reset process

4. **Enter Email and Request Reset**:
   - In the email field, enter: `rev.management@groupdaedalus.be`
   - Click the **"Forgot your password?"** link

5. **Watch the Console**:
   - You should see messages like:
     ```
     Sending password reset email with params: {serviceId: "service_iu8cxtm", templateId: "template_2oxmlh8", to_email: "rev.management@groupdaedalus.be"}
     Password reset email sent successfully
     ```
   - If there's an error, you'll see detailed error messages

6. **Check for Success Message**:
   - You should see an alert/notification saying:
     ```
     A password reset email has been sent to rev.management@groupdaedalus.be.
     Please check your inbox and follow the instructions to retrieve your password.
     ```

7. **Check Your Email**:
   - Check the inbox for `rev.management@groupdaedalus.be`
   - Also check spam/junk folder
   - You should receive the password reset email within 1-2 minutes

8. **Verify Email Content**:
   - ✅ Subject line is correct
   - ✅ Email uses the new template (if you updated it)
   - ✅ All variables are replaced (no `{{email}}` or `{{link}}` visible)
   - ✅ Button is styled and clickable
   - ✅ Link in button works
   - ✅ Alternative text link works
   - ✅ Credentials are displayed correctly

9. **Test the Reset Link**:
   - Click the button or link in the email
   - You should be taken to `hoteladmin.html`
   - Try logging in with the credentials shown in the email:
     - Email: `rev.management@groupdaedalus.be`
     - Password: `Hotel3Paardekens2024!`
   - ✅ Login should succeed

### Step 5: Test Error Scenarios

Test that error handling works correctly:

1. **Test Invalid Email**:
   - Enter a different email (e.g., `test@example.com`)
   - Click "Forgot your password?"
   - Expected: Error message "Email address not found in our system"

2. **Test Empty Email**:
   - Leave email field blank
   - Click "Forgot your password?"
   - Expected: Alert asking to enter email address

## 📊 Verification Checklist

Use this checklist to verify all aspects of the update:

### Code Changes
- [x] Public key updated to `MEiKFhBHfwDzT-xz1` in `hoteladmin.html`
- [x] Console log references updated
- [x] Standardized variables (`email`, `link`) added to template params
- [x] Legacy variables maintained for backward compatibility
- [x] Documentation updated (EMAIL_SETUP.md, EMAILJS_VERIFICATION_CHECKLIST.md)
- [x] New EMAIL_TEMPLATE.md created

### EmailJS Configuration
- [ ] Public key `MEiKFhBHfwDzT-xz1` exists and is active in EmailJS dashboard
- [ ] Service `service_iu8cxtm` is enabled
- [ ] Template `template_2oxmlh8` is active
- [ ] Template contains required variables (at minimum `{{email}}` and `{{link}}`)
- [ ] Template updated with modern design (optional but recommended)

### Functionality Testing
- [ ] EmailJS dashboard test successful
- [ ] Test email received from EmailJS dashboard
- [ ] Application password reset triggered successfully
- [ ] Console shows "Password reset email sent successfully"
- [ ] Email received from application
- [ ] All variables replaced correctly in email
- [ ] Styled button appears (if using new template)
- [ ] Button/link in email works
- [ ] Can log in with credentials from email
- [ ] Error handling works for invalid email
- [ ] Error handling works for empty email

### Visual Verification
- [ ] Email looks professional on desktop
- [ ] Email looks professional on mobile
- [ ] Gradient header displays correctly
- [ ] Button is styled (not plain link)
- [ ] Credentials section is clearly visible
- [ ] Security notice is displayed
- [ ] Footer is present

## 🔍 Expected Console Output

When testing is successful, you should see this in the browser console:

```javascript
Sending password reset email with params: {
  serviceId: "service_iu8cxtm",
  templateId: "template_2oxmlh8",
  to_email: "rev.management@groupdaedalus.be"
}
Password reset email sent successfully {status: 200, text: "OK"}
```

## ⚠️ Common Issues and Solutions

### Issue: "EmailJS not loaded"
**Cause**: EmailJS SDK failed to load from CDN.
**Solution**: 
- Check internet connection
- Verify `https://cdn.jsdelivr.net` is not blocked
- Try a different browser
- Check browser console for specific errors

### Issue: "The public key is invalid"
**Cause**: The new public key is not active in EmailJS.
**Solution**:
- Log in to EmailJS dashboard
- Verify `MEiKFhBHfwDzT-xz1` exists in API Keys
- Ensure it's not revoked
- If key doesn't exist, create it or use the correct key

### Issue: Email not received
**Cause**: Multiple possible causes.
**Solution**:
1. Check spam/junk folder
2. Verify EmailJS service is connected and active
3. Check EmailJS usage limits (free tier: 200 emails/month)
4. Test from EmailJS dashboard first
5. Review EmailJS dashboard for error logs

### Issue: Variables not replaced in email
**Cause**: Template variables don't match code parameter names.
**Solution**:
- Ensure template uses `{{email}}` and `{{link}}` (standardized)
- Or use legacy variable names: `{{to_email}}`, `{{reset_link}}`, etc.
- Check variable names are exact matches (case-sensitive)
- Use double curly braces: `{{variable}}` not `{variable}`

### Issue: Email looks plain (no styling)
**Cause**: Using old template or plain text mode.
**Solution**:
- Update template with HTML from `EMAIL_TEMPLATE.md`
- Ensure EmailJS template editor is in HTML mode (not plain text)
- Some email clients strip styles - this is normal, link will still work

## 📝 Test Results Template

Use this template to document your test results:

```
## Test Results - [Date]

### EmailJS Dashboard Configuration
- Public Key Active: [YES/NO]
- Service Enabled: [YES/NO]
- Template Active: [YES/NO]
- Template Updated: [YES/NO]

### EmailJS Dashboard Test
- Test Email Sent: [YES/NO]
- Test Email Received: [YES/NO]
- Variables Replaced: [YES/NO]
- Styling Correct: [YES/NO]

### Application Test
- Password Reset Triggered: [YES/NO]
- Console Output: [SUCCESS/ERROR]
- Email Received: [YES/NO]
- Time to Receive: [X minutes]
- Variables Replaced: [YES/NO]
- Button Styled: [YES/NO]
- Link Works: [YES/NO]
- Login Works: [YES/NO]

### Error Handling
- Invalid Email Test: [PASSED/FAILED]
- Empty Email Test: [PASSED/FAILED]

### Overall Result: [PASSED/FAILED]

### Notes:
[Any additional observations or issues]
```

## 🎯 Success Criteria

The update is successful when:

1. ✅ Password reset can be triggered from `hoteladmin.html`
2. ✅ Email is received within 2 minutes
3. ✅ All variables (`{{email}}`, `{{link}}`, etc.) are replaced with actual values
4. ✅ Email template looks professional (if updated)
5. ✅ Button/link in email works and redirects to admin page
6. ✅ Can log in using credentials from email
7. ✅ No errors in browser console
8. ✅ Error handling works for invalid inputs

## 📚 Related Documentation

- **[EMAIL_TEMPLATE.md](EMAIL_TEMPLATE.md)** - Modern email template and configuration guide
- **[EMAILJS_VERIFICATION_CHECKLIST.md](EMAILJS_VERIFICATION_CHECKLIST.md)** - Complete verification checklist
- **[EMAIL_SETUP.md](EMAIL_SETUP.md)** - General email setup guide
- **[TROUBLESHOOTING_PASSWORD_RESET.md](TROUBLESHOOTING_PASSWORD_RESET.md)** - Detailed troubleshooting

## 🆘 Getting Help

If you encounter issues during testing:

1. Review the **Common Issues and Solutions** section above
2. Check **[TROUBLESHOOTING_PASSWORD_RESET.md](TROUBLESHOOTING_PASSWORD_RESET.md)**
3. Review browser console for error messages
4. Check EmailJS dashboard for error logs
5. Contact EmailJS support: contact@emailjs.com

---

**Last Updated**: January 21, 2026  
**Test Guide Version**: v1.0
