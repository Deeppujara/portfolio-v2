// File: /api/contact.js
import { Resend } from 'resend';

// This reads the RESEND_API_KEY from your Vercel settings. It is correct.
const resend = new Resend(process.env.RESEND_API_KEY);

// This now uses the new, clearer variable name you created in Step 1.
const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async (req, res) => {
  // We only want to handle POST requests for this function
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // --- Stronger Server-Side Validation ---
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields.' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    
    // This is a critical check. If the variable is missing on Vercel, it will stop here.
    if (!recipientEmail) {
        console.error('CRITICAL ERROR: CONTACT_RECIPIENT_EMAIL is not configured in Vercel Environment Variables.');
        // Don't expose server details to the user.
        return res.status(500).json({ error: 'A server configuration error occurred.' });
    }

    // --- Send Email via Resend ---
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: `New Message from ${name} via Portfolio`,
      reply_to: email,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p> 
      `,
    });

    // If Resend itself returns an error, handle it
    if (error) {
      console.error('Resend API Error:', error);
      return res.status(500).json({ error: 'Failed to send message.' });
    }

    // If successful, send a success response back to the website
    return res.status(200).json({ message: 'Message sent successfully!' });

  } catch (error) {
    // This catches any other unexpected errors in the function
    console.error('Generic Server Error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};