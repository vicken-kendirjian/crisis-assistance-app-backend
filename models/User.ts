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
}



const UserSchema = new Schema({
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    phone: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    salt: {type: String, required: true},
    bloodType: {type: String, required: true},
    refreshToken: { type: String, default: null }
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