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
    connections: { senderId: string | mongoose.Types.ObjectId, status: 'pending' | 'accepted' | 'rejected' , senderPhone: string}[];
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
    connections: [
        {
          senderId: { type: Schema.Types.ObjectId, ref: 'User' },
          status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
          senderPhone: { type: String, required: true}
        }
      ]
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