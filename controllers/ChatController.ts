// controllers/chatController.ts
import { Request, Response } from 'express';
import { ChatLog } from '../models/ChatLog';
import axios from 'axios';
import { OPENROUTER_API_KEY } from '../config';

export const generateReply = async (req: Request, res: Response) => {
  const token = req.nat
  const { messages } = req.body; // Array of messages (with roles: user/system/assistant)

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required', token });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost',
          'X-Title': 'Lebanon Crisis App',
        },
      }
    );

    const assistantReply = response.data?.choices?.[0]?.message;

    if (!assistantReply) {
      return res.status(500).json({ error: 'AI did not return a valid response', token });
    }

    return res.status(200).json({ reply: assistantReply, token });
  } catch (error) {
    console.error('AI Error:', error);
    return res.status(500).json({ error: 'Failed to generate AI response', token });
  }
};


export const saveChatLog = async (req: Request, res: Response) => {
  const token = req.nat
  const { userId, sessionId, messages } = req.body;

  if (!userId || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'userId and messages are required', token });
  }

  try {
    const chat = new ChatLog({
      userId,
      sessionId,
      messages,
      timestamp: new Date(),
    });

    await chat.save();

    return res.status(201).json({ message: 'Chat saved successfully', token });
  } catch (error) {
    console.error('Save chat error:', error);
    return res.status(500).json({ error: 'Failed to save chat log', token });
  }
};

