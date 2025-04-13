// controllers/chatController.ts
import { Request, Response } from 'express';
import { ChatLog } from '../models/ChatLog';
import axios from 'axios';
import { OPENROUTER_API_KEY } from '../config';
import { v4 as uuidv4 } from 'uuid';


export const generateReply = async (req: Request, res: Response) => {
  const token = req.nat
  const { messages } = req.body; // Array of messages (with roles: user/system/assistant)
  const userId = req.headers['user-id'] as string;
  let sessionId = req.query.sessionId as string;
  console.log("FROM PARAMS "+sessionId)
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required', token });
  }

  try {

    if(!sessionId || sessionId==null){//new chat
      //generate session Id
      sessionId = uuidv4();
      console.log(sessionId);
    }
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
      return res.status(500).json({ error: 'AI did not return a valid response', token, sessionId });
    }
    const fullMessages = [...messages, assistantReply];
    await saveChat(userId, sessionId, fullMessages);


    return res.status(200).json({ reply: assistantReply, token, sessionId });
  } catch (error) {
    console.error('AI Error:', error);
    return res.status(500).json({ error: 'Failed to generate AI response', token, sessionId });
  }
};


// export const saveChatLog = async (req: Request, res: Response) => {
//   const token = req.nat
//   const { userId, sessionId, messages } = req.body;

//   if (!userId || !messages || !Array.isArray(messages)) {
//     return res.status(400).json({ error: 'userId and messages are required', token });
//   }

//   try {
//     const chat = new ChatLog({
//       userId,
//       sessionId,
//       messages,
//       timestamp: new Date(),
//     });

//     await chat.save();

//     return res.status(201).json({ message: 'Chat saved successfully', token });
//   } catch (error) {
//     console.error('Save chat error:', error);
//     return res.status(500).json({ error: 'Failed to save chat log', token });
//   }
// };


const saveChat = async (userId: string, sessionId: string, messages: any[]) => {
  if (!userId || !messages || !Array.isArray(messages)) {
    // Throw an error if required parameters are missing or invalid
    throw new Error('userId and messages are required and messages must be an array');
  }

  try {
    // Here, check if a chat already exists based on sessionId
    const existingChat = await ChatLog.findOne({ sessionId });

    if (!existingChat) {
      // If no chat exists, it's a new session, so create and save a new chat document
      const chat = new ChatLog({
        sessionId,
        messages,
        timestamp: new Date(),
        userId
      });

      await chat.save();
    } else {
      // Else, chat already exists — append the new messages to the existing array
      existingChat.messages.push(...messages);
      await existingChat.save();
    }

    return;
  } catch (error) {
    console.error('Save chat error:', error);
    return;
  }
};

