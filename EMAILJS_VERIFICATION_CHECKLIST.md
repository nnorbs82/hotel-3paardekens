# EmailJS Configuration Verification Checklist

This checklist will help you verify that your EmailJS account is properly configured to work with the Hotel 3 Paardekens password reset functionality.

## ✅ Code Configuration (Already Complete)

All values in the codebase have been verified and are consistent:

- ✅ **Public Key**: `MEiKFhBHfwDzT-xz1` (in `hoteladmin.html`, line 18)
- ✅ **Service ID**: `service_iu8cxtm` (in `admin-auth.js`, line 15)
- ✅ **Template ID**: `template_2oxmlh8` (in `admin-auth.js`, line 16)
- ✅ **Admin Email**: `rev.management@groupdaedalus.be` (in `admin-auth.js`, line 9)

**Note:** For an improved email template with modern styling and better user experience, see [EMAIL_TEMPLATE.md](EMAIL_TEMPLATE.md).

## 🔍 EmailJS Dashboard Verification

Now verify these settings in your EmailJS dashboard at https://www.emailjs.com/

### Step 1: Verify Public Key (API Key)

1. Log in to EmailJS at https://www.emailjs.com/
2. Go to **Account** → **General** (or **API Keys**)
3. Verify that `MEiKFhBHfwDzT-xz1` appears in your list of public keys
4. Ensure the key is **active** (not revoked)

**✓ Public Key Status:** [ ] Verified and Active

### Step 2: Verify Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Find the service with ID: `service_iu8cxtm`
3. Verify:
   - [ ] Service exists
   - [ ] Service is **enabled** (toggle is ON, not OFF)
   - [ ] Service is properly connected to your email provider
   - [ ] Email provider credentials are correct
   - [ ] No error warnings shown on the service

**✓ Service Status:** [ ] Verified and Enabled

### Step 3: Verify Email Template

1. In EmailJS dashboard, go to **Email Templates**
2. Find the template with ID: `template_2oxmlh8`
3. Verify:
   - [ ] Template exists
   - [ ] Template is **active/enabled**
   - [ ] Template includes ALL required variables (see below)

**✓ Template Status:** [ ] Verified and Active

### Step 4: Verify Template Variables

Your template **MUST** include these variable names. We recommend using the modern template from [EMAIL_TEMPLATE.md](EMAIL_TEMPLATE.md).

Primary Variables (Standardized):
- [ ] `{{email}}` - Recipient email address (standardized)
- [ ] `{{link}}` - Password reset/login link (standardized)

Additional Variables (Optional, for backward compatibility):
- [ ] `{{to_email}}` - Recipient email address (legacy)
- [ ] `{{to_name}}` - Recipient name
- [ ] `{{admin_email}}` - Admin email address  
- [ ] `{{admin_password}}` - Admin password
- [ ] `{{reset_link}}` - Link to admin login page (legacy)
- [ ] `{{message}}` - Password reset message

**Important:** At minimum, your template should use `{{email}}` and `{{link}}` for the standardized approach. The code sends all variables for backward compatibility.

**How to check:**
1. Click on your template `template_2oxmlh8`
2. Look at the template body content
3. Ensure the required variables above are present
4. Variable names must match exactly (case-sensitive)
5. For a complete modern template, see [EMAIL_TEMPLATE.md](EMAIL_TEMPLATE.md)

**✓ All Variables Present:** [ ] Verified

### Step 5: Check Account Limits

1. In EmailJS dashboard, check your usage statistics
2. Verify:
   - [ ] You have not exceeded your monthly email limit
   - [ ] Free tier: 200 emails/month
   - [ ] Paid tier: Check your plan limits

**✓ Within Limits:** [ ] Verified

### Step 6: Test Template (Optional but Recommended)

1. In EmailJS dashboard, go to your template `template_2oxmlh8`
2. Click **Test It** button
3. Fill in test values for the variables (use standardized names):
   - `email`: Your test email address
   - `link`: "https://yoursite.com/hoteladmin.html"
   - `to_email`: Your test email address (legacy)
   - `to_name`: "Test Admin"
   - `admin_email`: "rev.management@groupdaedalus.be"
   - `admin_password`: "TestPassword123"
   - `reset_link`: "https://yoursite.com/hoteladmin.html" (legacy)
   - `message`: "This is a test password reset email"
4. Send the test email
5. Check your inbox (and spam folder)
6. Verify the email:
   - [ ] Was received successfully
   - [ ] All variables were replaced correctly
   - [ ] Email formatting looks correct (especially if using the modern template)
   - [ ] Button is styled and clickable (if using modern template)
   - [ ] Links are clickable
   - [ ] Layout is responsive on mobile

**Note:** For best results, use the modern HTML template from [EMAIL_TEMPLATE.md](EMAIL_TEMPLATE.md).

**✓ Test Email Status:** [ ] Sent and Verified

## 🧪 Browser Testing

After verifying all EmailJS dashboard settings:

### Test in Browser

1. Open `hoteladmin.html` in your browser
2. Open browser Developer Tools:
   - **Chrome/Edge**: Press F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)
   - **Safari**: Enable Developer Menu first (Preferences → Advanced → Show Develop menu), then press Cmd+Option+I
   - **Firefox**: Press F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)
3. Go to the **Console** tab
4. Enter email: `rev.management@groupdaedalus.be`
5. Click **"Forgot your password?"**
6. Watch the console for messages

### Expected Console Messages (Success)

If everything is configured correctly, you should see:
```
Sending password reset email with params: {...}
Password reset email sent successfully
```

### Expected Console Messages (Failure)

If there's an issue, you should see:
```
EmailJS send failed. Please check:
1. Service ID: service_iu8cxtm
2. Template ID: template_2oxmlh8
3. Public Key: OuUDb11x_6V6Gvh7l
4. Check your EmailJS dashboard...
```

Plus detailed error information that will help identify the problem.

### Browser-Specific Issues

**Safari Users:**
- Safari has stricter security policies
- If it doesn't work in Safari, test in Chrome/Firefox first
- See section 3 of `TROUBLESHOOTING_PASSWORD_RESET.md` for Safari-specific solutions

**✓ Test Result:** [ ] Passed

## 📋 Common Issues and Solutions

### Issue: "The service does not exist"
**Solution:** Service ID `service_iu8cxtm` is incorrect. Double-check the Service ID in your EmailJS dashboard and update `admin-auth.js` line 15 if needed.

### Issue: "The template does not exist"  
**Solution:** Template ID `template_2oxmlh8` is incorrect. Double-check the Template ID in your EmailJS dashboard and update `admin-auth.js` line 16 if needed.

### Issue: "The public key is invalid"
**Solution:** Public Key `MEiKFhBHfwDzT-xz1` is incorrect or revoked. Check your API keys in EmailJS dashboard and update `hoteladmin.html` line 18 if needed.

### Issue: "Template variables are missing"
**Solution:** Your EmailJS template is missing one or more required variables. At minimum, use `{{email}}` and `{{link}}`. For the best experience, use the modern template from [EMAIL_TEMPLATE.md](EMAIL_TEMPLATE.md) which includes all variables with professional styling.

### Issue: "Monthly limit exceeded"
**Solution:** You've sent 200+ emails this month (free tier limit). Either wait until next month or upgrade to a paid plan.

### Issue: Email not received
**Solution:** 
- Check spam/junk folder
- Verify email service provider allows sending from EmailJS
- Some corporate email servers block external email services

## ✅ Final Verification Checklist

Before considering the configuration complete:

- [ ] All code values match documentation
- [ ] EmailJS Public Key is active
- [ ] EmailJS Service exists and is enabled  
- [ ] EmailJS Template exists and has all 6 required variables
- [ ] Test email sent successfully from EmailJS dashboard
- [ ] Password reset tested in browser
- [ ] Email received in inbox
- [ ] All variables in received email are populated correctly
- [ ] Links in email are clickable and correct

## 🎯 If Everything is Verified

If all the above items are checked and verified:

1. ✅ Your EmailJS configuration is correct
2. ✅ Your code configuration is correct
3. ✅ The password reset functionality should work

**The system is ready to use!**

## 🆘 Still Having Issues?

If you've verified everything above and it still doesn't work:

1. **Check EmailJS Service Status:** https://status.emailjs.com/
2. **Review TROUBLESHOOTING_PASSWORD_RESET.md** for detailed troubleshooting steps
3. **Contact EmailJS Support:** contact@emailjs.com with your Service ID and Template ID
4. **Check browser console** for specific error messages and codes

## 📞 Additional Resources

- **EmailJS Documentation:** https://www.emailjs.com/docs/
- **EmailJS Support:** https://www.emailjs.com/support/
- **Project Email Setup Guide:** See `EMAIL_SETUP.md`
- **Project Troubleshooting Guide:** See `TROUBLESHOOTING_PASSWORD_RESET.md`

---

**Last Updated:** January 21, 2026  
**Configuration Version:** v1.0
