// File: /api/contact.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const recipientEmail = process.env.FEEDBACK_RECIPIENT_EMAIL;

// A simple regex to validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Log the incoming body to see what you're receiving (great for debugging)
    console.log('Received request body:', req.body);

    const { name, email, message } = req.body;

    // --- ENHANCED VALIDATION ---
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    // Add this new validation check for the email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    // --- END OF VALIDATION ---

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: `New Message from ${name} via Portfolio`,
      reply_to: email, // This is now safe to use
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    // This will now log more specific errors from Resend if they occur
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send message.' });
  }
};