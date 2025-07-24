// File: /api/chat.js
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});
const ASSISTANT_ID = 'asst_4LuT1UN1dpAiWcaAk11emoZs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    const { action, threadId, message } = req.body;
    if (action === 'create_thread') {
      const thread = await openai.beta.threads.create();
      return res.status(200).json({ threadId: thread.id });
    }
    if (action === 'send_message') {
      await openai.beta.threads.messages.create(threadId, { role: 'user', content: message });
      const run = await openai.beta.threads.runs.create(threadId, { assistant_id: ASSISTANT_ID });
      let currentRun = await openai.beta.threads.runs.retrieve(threadId, run.id);
      while (currentRun.status !== 'completed' && currentRun.status !== 'failed') {
        await new Promise(resolve => setTimeout(resolve, 500));
        currentRun = await openai.beta.threads.runs.retrieve(threadId, run.id);
      }
      if (currentRun.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(threadId);
        const reply = messages.data[0].content[0].text.value.replace(/【.*?】/g, '').trim();
        return res.status(200).json({ reply });
      }
    }
    return res.status(400).json({ error: 'Invalid action.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
}