// File: /api/contact.js
import { Resend } from 'resend';

// Initialize Resend with the API key from your Vercel environment variables
const resend = new Resend(process.env.RESEND_API_KEY);
const recipientEmail = process.env.FEEDBACK_RECIPIENT_EMAIL;

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    // Use Resend to send the email
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // This 'from' is required by Resend's free tier
      to: [recipientEmail], // IMPORTANT: This is your email address
      subject: `New Message from ${name} via Portfolio`,
      reply_to: email, // Set the sender's email as the reply-to address
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Send a success response back to the frontend
    return res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to send message.' });
  }
};