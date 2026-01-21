# Email Template Guide for Password Reset

This guide provides instructions for configuring a modern, visually appealing email template in EmailJS for password reset functionality.

## 📋 Overview

The password reset email template should be configured in your EmailJS dashboard. The code automatically sends standardized variables that EmailJS replaces when sending the email.

## 🔄 How Variable Replacement Works

When the password reset is triggered, the application sends data to EmailJS through `templateParams`. EmailJS then:

1. Takes your email template (configured in EmailJS dashboard)
2. Finds all variables using the `{{variable_name}}` syntax
3. Replaces each `{{variable_name}}` with the actual value from `templateParams`
4. Sends the final email to the recipient

**Example:**
- Template contains: `Hello {{to_name}}, your email is {{email}}`
- Code sends: `{ to_name: 'Admin', email: 'admin@example.com' }`
- Email sent: `Hello Admin, your email is admin@example.com`

## 📧 Available Template Variables

The following variables are available for use in your EmailJS template:

### Primary Variables (Standardized)
- **`{{email}}`** - Recipient's email address
- **`{{link}}`** - Password reset/login link (fully qualified URL)

### Additional Variables (Backward Compatible)
- **`{{to_name}}`** - Recipient's name (set to "Admin")
- **`{{admin_email}}`** - Admin email for reference
- **`{{admin_password}}`** - Admin password (demo only - NOT for production)
- **`{{reset_link}}`** - Same as `{{link}}` (for backward compatibility)
- **`{{to_email}}`** - Same as `{{email}}` (for backward compatibility)
- **`{{message}}`** - Pre-configured message text

## 🎨 Modern Email Template

Use this HTML template in your EmailJS dashboard for a professional, responsive email:

### Subject Line
```
Password Reset - Hotel 3 Paardekens Admin Panel
```

### Email Body (HTML)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7;">
  
  <!-- Main Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 20px 0;">
    <tr>
      <td align="center">
        
        <!-- Email Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
          
          <!-- Header Section with Branding -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                🏨 Hotel 3 Paardekens
              </h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                Admin Panel Access
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: 600;">
                Hello {{to_name}},
              </h2>
              
              <!-- Message -->
              <p style="margin: 0 0 20px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                {{message}}
              </p>
              
              <!-- Call-to-Action Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="{{link}}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                      Access Admin Panel
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Credentials Section -->
              <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px;">
                <p style="margin: 0 0 15px 0; color: #333333; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Your Login Credentials
                </p>
                <table width="100%" cellpadding="5" cellspacing="0">
                  <tr>
                    <td style="color: #666666; font-size: 14px; padding: 5px 0;">
                      <strong>Email:</strong>
                    </td>
                    <td style="color: #333333; font-size: 14px; padding: 5px 0;">
                      {{email}}
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px; padding: 5px 0;">
                      <strong>Password:</strong>
                    </td>
                    <td style="color: #333333; font-size: 14px; padding: 5px 0; font-family: 'Courier New', monospace;">
                      {{admin_password}}
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Alternative Link -->
              <p style="margin: 25px 0 0 0; color: #888888; font-size: 14px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 10px 0 0 0; padding: 12px; background-color: #f8f9fa; border-radius: 4px; word-break: break-all;">
                <a href="{{link}}" style="color: #667eea; text-decoration: none; font-size: 13px;">{{link}}</a>
              </p>
              
            </td>
          </tr>
          
          <!-- Security Notice -->
          <tr>
            <td style="padding: 30px; background-color: #fff9e6; border-top: 1px solid #ffe066;">
              <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                <strong>⚠️ Security Notice:</strong> If you did not request this password reset, please disregard this email or contact the administrator immediately.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px 0; color: #888888; font-size: 14px;">
                © Hotel 3 Paardekens
              </p>
              <p style="margin: 0; color: #aaaaaa; font-size: 12px;">
                This is an automated email. Please do not reply.
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
```

## 📱 Responsive Design Features

The template above includes:

1. **Mobile-Friendly Layout**
   - Uses table-based layout for maximum email client compatibility
   - Maximum width of 600px for desktop, scales down on mobile
   - Adequate padding for touch targets on mobile devices

2. **Visual Hierarchy**
   - Gradient header for brand recognition
   - Clear section separation with background colors
   - Button-based CTA instead of plain links
   - Highlighted credentials section

3. **Accessibility**
   - High contrast text colors
   - Clear font sizing (14px-28px range)
   - Alternative text link provided
   - Semantic color usage (warning yellow for security notice)

## 🔧 Configuring in EmailJS Dashboard

### Step 1: Log in to EmailJS
1. Go to https://www.emailjs.com/
2. Sign in to your account

### Step 2: Navigate to Email Templates
1. Click on **Email Templates** in the left sidebar
2. Find your template (ID: `template_2oxmlh8`) or create a new one

### Step 3: Set the Subject
Copy and paste:
```
Password Reset - Hotel 3 Paardekens Admin Panel
```

### Step 4: Set the Content
1. Switch to **HTML** editor mode (not plain text)
2. Copy the entire HTML template from the "Email Body (HTML)" section above
3. Paste it into the content area

### Step 5: Verify Variables
Make sure all these variables appear in your template (they should be in the HTML above):
- ✅ `{{to_name}}`
- ✅ `{{message}}`
- ✅ `{{link}}`
- ✅ `{{email}}`
- ✅ `{{admin_password}}`

### Step 6: Test the Template
1. Click the **"Test It"** button in EmailJS dashboard
2. Fill in sample values:
   - `to_name`: "Admin"
   - `message`: "You requested to reset your password for the Hotel 3 Paardekens Admin Panel."
   - `link`: "https://yoursite.com/hoteladmin.html"
   - `email`: "test@example.com"
   - `admin_password`: "TestPassword123"
3. Send test email to your address
4. Verify:
   - Email is received (check spam folder)
   - All variables are replaced correctly
   - Button is styled and clickable
   - Layout looks good on desktop and mobile

### Step 7: Save the Template
Click **Save** to apply your changes.

## 🎯 Customization Options

### Change Brand Colors
Replace the gradient colors in two places:
- Header section: `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`
- Button: `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`

Example alternative colors:
- **Blue to Teal:** `#667eea 0%, #00d4ff 100%`
- **Purple to Pink:** `#764ba2 0%, #f093fb 100%`
- **Orange to Red:** `#ff6b6b 0%, #ee5a6f 100%`

### Add Your Logo
Replace the emoji in the header:
```html
<!-- Replace -->
<h1 style="...">🏨 Hotel 3 Paardekens</h1>

<!-- With -->
<img src="YOUR_LOGO_URL" alt="Hotel 3 Paardekens" style="height: 50px; margin-bottom: 10px;">
<h1 style="...">Hotel 3 Paardekens</h1>
```

### Adjust Spacing
Modify padding values:
- `padding: 40px 30px;` - More space
- `padding: 20px 15px;` - Less space

## 🔍 Testing Checklist

After configuring your template:

- [ ] All variables are present in the template
- [ ] Subject line is set correctly
- [ ] HTML mode is enabled (not plain text)
- [ ] Test email sent from EmailJS dashboard
- [ ] Test email received successfully
- [ ] All variables replaced correctly
- [ ] Button is styled and clickable
- [ ] Layout looks good on desktop browser
- [ ] Layout looks good on mobile device
- [ ] Alternative text link works
- [ ] Colors match your brand
- [ ] Template saved in EmailJS dashboard

## 🆘 Troubleshooting

### Variables Not Replaced
**Issue:** Email shows `{{email}}` instead of actual email address.

**Solution:**
1. Verify variable names match exactly (case-sensitive)
2. Make sure variables use double curly braces: `{{variable}}`
3. Check that the code is sending the correct parameter names

### Button Not Styled
**Issue:** Button appears as plain text link.

**Solution:**
1. Ensure you're using HTML mode (not plain text) in EmailJS
2. Check that inline styles are preserved
3. Some email clients strip styles - the link will still work

### Layout Broken on Mobile
**Issue:** Email looks bad on mobile devices.

**Solution:**
1. Use the table-based layout provided above
2. Avoid CSS media queries (not supported in many email clients)
3. Use percentage widths and max-width for containers
4. Test in actual mobile email clients (not just browser)

### Email Not Received
**Issue:** Test email never arrives.

**Solution:**
1. Check spam/junk folder
2. Verify EmailJS service is active
3. Check EmailJS usage limits
4. Try a different recipient email address
5. Review EmailJS dashboard for error logs

## 📚 Additional Resources

- **EmailJS Documentation:** https://www.emailjs.com/docs/
- **Email HTML Best Practices:** https://www.emailjs.com/docs/best-practices/html-email/
- **Variable Reference:** See `admin-auth.js` lines 116-177 for complete variable documentation

## 🔒 Security Note

**Important:** This template includes the actual password in the email, which is acceptable ONLY for this demo environment with hardcoded credentials. 

**For production applications:**
- Never send passwords via email
- Use secure, time-limited reset tokens
- Implement server-side password hashing
- Use HTTPS for all links
- Set token expiration (15-60 minutes)

---

**Last Updated:** January 21, 2026  
**Template Version:** v2.0 - Modern Responsive Design
