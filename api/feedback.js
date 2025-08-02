// File: /api/feedback.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const recipientEmail = process.env.FEEDBACK_RECIPIENT_EMAIL;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    const { rating, feedback } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'A valid rating is required.' });
    
    const subject = `Portfolio Feedback: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`;
    const htmlBody = `
      <h2>New Portfolio Feedback!</h2>
      <p><strong>Rating:</strong> ${rating} out of 5 stars</p>
      <p><strong>Comments:</strong></p>
      <p>${feedback || 'No written feedback was provided.'}</p>
    `;

    await resend.emails.send({
      from: 'Portfolio Feedback <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: subject,
      html: htmlBody,
    });
    return res.status(200).json({ message: 'Feedback sent!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to send feedback.' });
  }
}