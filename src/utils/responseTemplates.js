// Response templates for each category
// These are starting points that agents can customize

export const RESPONSE_TEMPLATES = {
  'Billing Issue': {
    templates: [
      {
        name: 'Refund Request',
        subject: 'Re: Your Refund Request',
        body: `Hi {{customer_name}},

Thank you for reaching out about your refund request.

I've reviewed your account and I can confirm that your refund of {{amount}} has been processed. You should see the credit back on your original payment method within 5-10 business days.

If you don't see the refund after 10 business days, please reply to this email and I'll investigate further.

Is there anything else I can help you with today?

Best regards,
{{agent_name}}
{{company_name}} Support`
      },
      {
        name: 'Billing Clarification',
        subject: 'Re: Your Billing Question',
        body: `Hi {{customer_name}},

Thank you for contacting us about your recent charge.

I can see the charge of {{amount}} on {{date}} was for {{product/service}}. This is part of your {{subscription_type}} plan which renews {{billing_cycle}}.

If you'd like to make changes to your subscription or have questions about future charges, I'm happy to help!

Best regards,
{{agent_name}}
{{company_name}} Support`
      },
      {
        name: 'Payment Failed',
        subject: 'Re: Payment Issue',
        body: `Hi {{customer_name}},

I see you're having trouble with a payment. Let me help!

Common reasons payments fail:
• Expired card or incorrect card details
• Insufficient funds
• Bank security blocks

To update your payment method:
1. Log in to your account
2. Go to Settings → Billing
3. Click "Update Payment Method"

If you continue to have issues, let me know and I can help troubleshoot further.

Best regards,
{{agent_name}}
{{company_name}} Support`
      }
    ]
  },
  'Technical Problem': {
    templates: [
      {
        name: 'Bug Report Acknowledgment',
        subject: 'Re: Bug Report',
        body: `Hi {{customer_name}},

Thank you for reporting this issue. I've logged this with our engineering team as ticket #{{ticket_id}}.

To help us investigate faster, could you please provide:
• Your browser and version
• Steps to reproduce the issue
• Any error messages you saw
• Screenshots if available

We'll keep you updated on the progress. Our typical resolution time for issues like this is {{timeframe}}.

Best regards,
{{agent_name}}
{{company_name}} Support`
      },
      {
        name: 'Troubleshooting Steps',
        subject: 'Re: Technical Issue',
        body: `Hi {{customer_name}},

I'm sorry you're experiencing this issue. Let's try some troubleshooting steps:

1. Clear your browser cache and cookies
2. Try a different browser (Chrome, Firefox, Safari)
3. Disable browser extensions temporarily
4. Try incognito/private browsing mode

If the issue persists after trying these steps, please reply with:
• What you were trying to do
• What happened instead
• Any error messages

We'll get this sorted out for you!

Best regards,
{{agent_name}}
{{company_name}} Support`
      },
      {
        name: 'Issue Resolved',
        subject: 'Re: Technical Issue - Resolved',
        body: `Hi {{customer_name}},

Great news! The technical issue you reported has been resolved.

The problem was {{root_cause}}, and our team has {{fix_description}}.

Please try again and let me know if everything is working correctly. If you encounter any other issues, don't hesitate to reach out.

Thank you for your patience!

Best regards,
{{agent_name}}
{{company_name}} Support`
      }
    ]
  },
  'Outage': {
    templates: [
      {
        name: 'Outage Acknowledgment',
        subject: 'Re: Service Disruption',
        body: `Hi {{customer_name}},

We're aware of the current service disruption and our team is actively working to resolve it.

Current status: {{status}}
Estimated resolution: {{eta}}

You can monitor our real-time status at: {{status_page_url}}

We sincerely apologize for any inconvenience this has caused. We'll send an update as soon as service is restored.

Best regards,
{{agent_name}}
{{company_name}} Support`
      },
      {
        name: 'Outage Resolved',
        subject: 'Re: Service Restored',
        body: `Hi {{customer_name}},

I'm happy to report that the service disruption has been resolved. All systems are now operating normally.

What happened: {{incident_summary}}
Duration: {{downtime_duration}}
Resolution: {{resolution_summary}}

We understand this disruption impacted your work and we sincerely apologize. We're taking steps to prevent similar issues in the future.

If you have any concerns about data or need assistance catching up, please let me know.

Best regards,
{{agent_name}}
{{company_name}} Support`
      }
    ]
  },
  'Account Access': {
    templates: [
      {
        name: 'Password Reset',
        subject: 'Re: Account Access Help',
        body: `Hi {{customer_name}},

I can help you regain access to your account!

To reset your password:
1. Go to {{login_url}}
2. Click "Forgot Password"
3. Enter your email: {{customer_email}}
4. Check your inbox for a reset link (valid for 24 hours)

If you don't receive the email within 5 minutes:
• Check your spam/junk folder
• Try adding {{support_email}} to your contacts
• Reply here and I can manually send a reset link

Best regards,
{{agent_name}}
{{company_name}} Support`
      },
      {
        name: '2FA Recovery',
        subject: 'Re: Two-Factor Authentication Help',
        body: `Hi {{customer_name}},

I understand you're having trouble with two-factor authentication.

For security purposes, I'll need to verify your identity before we can reset 2FA. Please provide:
1. The email address on your account
2. Last 4 digits of the payment method on file
3. Approximate date you created the account

Once verified, I can disable 2FA so you can set it up again with your new device.

Best regards,
{{agent_name}}
{{company_name}} Support`
      },
      {
        name: 'Account Unlocked',
        subject: 'Re: Account Unlocked',
        body: `Hi {{customer_name}},

Good news! I've unlocked your account.

Your account was temporarily locked due to {{lock_reason}}. As a security measure, I recommend:
• Changing your password
• Reviewing recent account activity
• Enabling two-factor authentication if not already active

You should now be able to log in at {{login_url}}.

Best regards,
{{agent_name}}
{{company_name}} Support`
      }
    ]
  },
  'Feature Request': {
    templates: [
      {
        name: 'Feature Logged',
        subject: 'Re: Feature Suggestion',
        body: `Hi {{customer_name}},

Thank you for sharing your idea about {{feature_summary}}! I love hearing suggestions from customers like you.

I've added this to our feature request board with reference #{{request_id}}. Our product team reviews all suggestions and prioritizes based on customer impact.

While I can't promise a timeline, I can tell you that features like yours often influence our roadmap. I'll make a note to update you if this gets scheduled for development.

Is there anything else I can help you with today?

Best regards,
{{agent_name}}
{{company_name}} Support`
      },
      {
        name: 'Workaround Available',
        subject: 'Re: Feature Request - Workaround',
        body: `Hi {{customer_name}},

Great question! While we don't have that exact feature yet, here's a workaround that might help:

{{workaround_steps}}

I've also logged this as a feature request (#{{request_id}}) for our product team to consider.

Does this workaround help with what you're trying to accomplish?

Best regards,
{{agent_name}}
{{company_name}} Support`
      }
    ]
  },
  'General Inquiry': {
    templates: [
      {
        name: 'General Response',
        subject: 'Re: Your Question',
        body: `Hi {{customer_name}},

Thank you for reaching out!

{{answer}}

For more information, you might find these resources helpful:
• {{resource_1}}
• {{resource_2}}

Is there anything else I can help you with?

Best regards,
{{agent_name}}
{{company_name}} Support`
      },
      {
        name: 'Pricing Inquiry',
        subject: 'Re: Pricing Question',
        body: `Hi {{customer_name}},

Thanks for your interest in our pricing!

Here's a quick overview:
{{pricing_summary}}

You can see full pricing details at: {{pricing_url}}

If you'd like to discuss which plan is right for your needs, I'm happy to schedule a call or answer questions here.

Best regards,
{{agent_name}}
{{company_name}} Support`
      }
    ]
  },
  'Feedback/Praise': {
    templates: [
      {
        name: 'Thank You',
        subject: 'Re: Thank You for the Kind Words!',
        body: `Hi {{customer_name}},

Wow, thank you so much for taking the time to share this feedback! Messages like yours make our day. 🎉

I've shared your kind words with the team and it really means a lot to all of us.

If there's ever anything we can do to make your experience even better, please don't hesitate to reach out.

Thank you for being a valued customer!

Best regards,
{{agent_name}}
{{company_name}} Support`
      },
      {
        name: 'Feedback Acknowledged',
        subject: 'Re: Your Feedback',
        body: `Hi {{customer_name}},

Thank you for sharing your thoughts with us! We really appreciate customers who take the time to help us improve.

I've passed your feedback along to the appropriate team. Every piece of feedback helps us make better decisions.

If you have any other thoughts or suggestions in the future, we'd love to hear them.

Best regards,
{{agent_name}}
{{company_name}} Support`
      }
    ]
  },
  'Unknown': {
    templates: [
      {
        name: 'Clarification Needed',
        subject: 'Re: Your Message',
        body: `Hi {{customer_name}},

Thank you for reaching out! I want to make sure I understand your request correctly.

Could you please provide a bit more detail about:
• What you're trying to accomplish
• Any error messages or issues you're seeing
• Your account email or ID

This will help me get you to the right team and provide the best assistance.

Looking forward to your reply!

Best regards,
{{agent_name}}
{{company_name}} Support`
      }
    ]
  }
}

// Get templates for a specific category
export function getTemplatesForCategory(category) {
  return RESPONSE_TEMPLATES[category]?.templates || RESPONSE_TEMPLATES['Unknown'].templates
}

// Get all available categories
export function getTemplateCategories() {
  return Object.keys(RESPONSE_TEMPLATES)
}

// Fill in template placeholders
export function fillTemplate(template, values = {}) {
  // Handle both string templates and template objects
  const templateBody = typeof template === 'string' ? template : template.body
  let filled = templateBody
  
  Object.entries(values).forEach(([key, value]) => {
    // Support both {{key}} and {key} formats
    const regexDouble = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
    const regexSingle = new RegExp(`\\{${key}\\}`, 'g')
    filled = filled.replace(regexDouble, value)
    filled = filled.replace(regexSingle, value)
  })
  
  if (typeof template === 'string') {
    return filled
  }
  
  return {
    ...template,
    body: filled
  }
}
