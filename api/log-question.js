// This file is /api/log-question.js
import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  // We only want to handle POST requests for security
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Only POST requests are allowed.' });
  }

  try {
    // Get the question from the request body
    const { question } = request.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return response.status(400).json({ message: 'A valid question is required.' });
    }

    // Create a unique key using a timestamp for easy sorting
    const timestamp = new Date().toISOString();
    const key = `question:${timestamp}-${Math.random().toString(36).substr(2, 9)}`;

    // Save the question to our Vercel KV database!
    await kv.set(key, {
        question: question.trim(),
        timestamp: timestamp
    });

    // Send a success response back to the browser
    return response.status(200).json({ message: 'Question logged successfully.' });

  } catch (error) {
    // If something goes wrong, log it on the server and send a generic error
    console.error("Error logging question:", error);
    return response.status(500).json({ message: 'An error occurred on the server.' });
  }
}