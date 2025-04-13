import mongoose, { Document, Schema } from 'mongoose';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatLogDoc extends Document {
  _id: string | mongoose.Types.ObjectId;
  sessionId: string; // Unique identifier for the conversation
  messages: ChatMessage[]; // Array of messages exchanged
  timestamp: Date; // Creation timestamp;
  userId: string | mongoose.Types.ObjectId;
}

const chatMessageSchema = new Schema<ChatMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { _id: false } // Don’t generate _id for subdocuments
);

const chatLogSchema = new Schema<ChatLogDoc>(
  {
    sessionId: {
      type: String,
      required: true,
    },
    messages: {
      type: [chatMessageSchema],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true
    },
  },
  {
    collection: 'chatlogs',
    versionKey: false,
  }
);

export const ChatLog = mongoose.model<ChatLogDoc>('ChatLog', chatLogSchema);
