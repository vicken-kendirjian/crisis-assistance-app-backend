import mongoose, {Schema, Document, Model} from 'mongoose';

interface UserDoc extends Document{
    _id: string | mongoose.Types.ObjectId;
    name: string;
    lastname: string;
    phone: string;
    salt: string;
    password: string;
    bloodType: string;
    refreshToken: string;
    accessToken: string;
    isAdmin: boolean;
    connections: { senderId: string | mongoose.Types.ObjectId, status: 'pending' | 'accepted' | 'rejected' , senderPhone: string, senderName: string, senderLastname: string}[];
    location: {
        lat: number | null; // Latitude (nullable)
        lng: number | null; // Longitude (nullable)
    };
    locationSharing: boolean;
    connectedUsers: (string | mongoose.Types.ObjectId)[];
}



const UserSchema = new Schema({
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    phone: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    salt: {type: String, required: true},
    bloodType: {type: String, required: true},
    refreshToken: { type: String, default: null },
    accessToken: { type: String, default: null },
    isAdmin: {type : Boolean, default: false },
    connections: [
        {
          senderId: { type: Schema.Types.ObjectId, ref: 'User' },
          status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
          senderPhone: { type: String, required: true},
          senderName: { type: String, required: true},
          senderLastname: { type: String, required: true }
        }
      ],
    connectedUsers: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User', // Reference to other users in the `User` collection
        },
    ],
    location: {
        lat: { type: Number, required: false }, // Latitude (optional for now)
        lng: { type: Number, required: false }  // Longitude (optional for now)
    },
    locationSharing: { type: Boolean, default: false }
},{
    toJSON:{
        transform(doc, ret){
            delete ret.__v;
        }
    },
    timestamps: true
})

const User = mongoose.model<UserDoc>('user', UserSchema)

export {User};