# EmailJS Template Configuration Guide

## 🚨 CRITICAL: Template "To Email" Field Configuration

**The most common reason for password reset emails failing is an incorrectly configured "To Email" field in the EmailJS template.**

### Problem
When you create or update an EmailJS template, you must specify where to send the email. This is done in the **"To Email"** field in the template settings.

### Solution
In your EmailJS dashboard, for template `template_2oxmlh8`:

1. **Go to**: https://dashboard.emailjs.com/admin/templates/template_2oxmlh8
2. **Find the "To Email" field** (it's in the template settings at the top)
3. **Set it to**: `{{to_email}}`

**OR**

If you prefer to use the standardized variable name:
3. **Set it to**: `{{email}}`

### Why This Matters

- ❌ **WRONG**: Setting "To Email" to a hardcoded email like `rev.management@groupdaedalus.be`
  - This will always send to that email, ignoring the user input
  
- ✅ **CORRECT**: Setting "To Email" to `{{to_email}}` or `{{email}}`
  - This tells EmailJS to use the email address from the template parameters
  - The code sends both `to_email` and `email` for compatibility

### Screenshot of Correct Configuration

```
┌─────────────────────────────────────────────┐
│ Template Settings                            │
├─────────────────────────────────────────────┤
│ Template ID: template_2oxmlh8               │
│ Template Name: Password Reset               │
│ Subject: Password Reset - Hotel 3...        │
│                                              │
│ To Email: {{to_email}}  ← CRITICAL!         │
│           or {{email}}                       │
│                                              │
│ From Name: Hotel 3 Paardekens              │
│ Reply To: (optional)                        │
└─────────────────────────────────────────────┘
```

## Step-by-Step Template Configuration

### Step 1: Log into EmailJS
1. Go to https://dashboard.emailjs.com/
2. Sign in to your account

### Step 2: Navigate to Templates
1. Click **"Email Templates"** in the left sidebar
2. Find template `template_2oxmlh8` in the list
3. Click on it to edit

### Step 3: Configure Template Settings (TOP SECTION)

**Critical Fields:**

1. **To Email**: `{{to_email}}` or `{{email}}`
   - This MUST be a template variable, not a hardcoded email
   
2. **Subject**: `Password Reset - Hotel 3 Paardekens Admin Panel`
   - Can be any text you want

3. **From Name**: `Hotel 3 Paardekens`
   - The name that appears as the sender

### Step 4: Configure Template Content (BOTTOM SECTION)

Your template content should include these variables:

- `{{to_name}}` - Recipient name (will be "Admin")
- `{{message}}` - Pre-configured message
- `{{link}}` - Reset link URL
- `{{email}}` - User's email address
- `{{admin_password}}` - The password (demo only)

**Example Template Content:**

```html
Hello {{to_name}},

{{message}}

Click the button below to access the admin panel:
<a href="{{link}}">Access Admin Panel</a>

Your login credentials:
Email: {{email}}
Password: {{admin_password}}

If you did not request this, please contact the administrator.

Best regards,
Hotel 3 Paardekens Team
```

For a more styled version, see **[EMAIL_TEMPLATE.md](EMAIL_TEMPLATE.md)**.

### Step 5: Save and Test

1. Click **"Save"** to save your template
2. Click **"Test It"** to send a test email
3. Fill in test values:
   - `to_email`: Your email address
   - `email`: Same email address
   - `to_name`: "Admin"
   - `message`: "Test message"
   - `link`: "https://example.com"
   - `admin_password`: "TestPassword"
4. Send the test
5. Check your inbox (and spam folder)

### Step 6: Verify

After saving, the password reset should work in the application. Test by:

1. Opening `hoteladmin.html`
2. Entering `rev.management@groupdaedalus.be`
3. Clicking "Forgot your password?"
4. Checking the email inbox for `rev.management@groupdaedalus.be`

## Common Issues and Solutions

### Issue: Email not received

**Possible Causes:**

1. **"To Email" field is not set to `{{to_email}}` or `{{email}}`**
   - **Solution**: Update the template settings as described above

2. **Template variables are misspelled**
   - **Solution**: Make sure variable names match exactly (case-sensitive)

3. **Service is not enabled**
   - **Solution**: Go to "Email Services" and ensure service `service_iu8cxtm` is enabled

4. **Account limit reached**
   - **Solution**: Check your EmailJS dashboard for usage statistics

### Issue: Error "Template configuration error"

**Cause**: Template ID doesn't exist or variables are wrong

**Solution**:
1. Verify template ID `template_2oxmlh8` exists
2. Check that "To Email" field uses `{{to_email}}` or `{{email}}`
3. Ensure all required variables are present in template

### Issue: Error "Service configuration error"

**Cause**: Service ID doesn't exist or is disabled

**Solution**:
1. Go to "Email Services" in EmailJS dashboard
2. Find service `service_iu8cxtm`
3. Click the toggle to **enable** it
4. Verify your email provider credentials are correct

## Variables Reference

The code sends these template parameters:

| Variable | Description | Example |
|----------|-------------|---------|
| `email` | Recipient email (standardized) | `rev.management@groupdaedalus.be` |
| `to_email` | Recipient email (legacy) | `rev.management@groupdaedalus.be` |
| `link` | Reset link (standardized) | `https://yoursite.com/hoteladmin.html` |
| `reset_link` | Reset link (legacy) | `https://yoursite.com/hoteladmin.html` |
| `to_name` | Recipient name | `Admin` |
| `message` | Pre-configured message | `You requested to reset...` |
| `admin_email` | Admin email reference | `rev.management@groupdaedalus.be` |
| `admin_password` | Admin password (demo only) | `Hotel3Paardekens2024!` |

**Note**: Both `email` and `to_email` are sent for backward compatibility. You can use either in your template.

## Checklist

Use this checklist to verify your EmailJS template is configured correctly:

- [ ] Logged into EmailJS dashboard
- [ ] Found template `template_2oxmlh8`
- [ ] Set "To Email" field to `{{to_email}}` or `{{email}}`
- [ ] Template content includes all required variables
- [ ] Saved the template
- [ ] Sent a test email from EmailJS dashboard
- [ ] Received the test email
- [ ] Tested password reset in the application
- [ ] Received password reset email
- [ ] Can log in with credentials from email

## Need More Help?

- **EmailJS Documentation**: https://www.emailjs.com/docs/
- **Email Template Guide**: See [EMAIL_TEMPLATE.md](EMAIL_TEMPLATE.md) for a styled template
- **General Setup**: See [EMAIL_SETUP.md](EMAIL_SETUP.md)
- **Troubleshooting**: See [TROUBLESHOOTING_PASSWORD_RESET.md](TROUBLESHOOTING_PASSWORD_RESET.md)

---

**Last Updated**: January 21, 2026  
**Version**: 1.0
