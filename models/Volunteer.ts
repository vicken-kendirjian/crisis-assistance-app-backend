import mongoose, { Schema, Document, Model } from 'mongoose';


interface VolunteerDoc extends Document {
  _id: string | mongoose.Types.ObjectId;
  userId: string | mongoose.Types.ObjectId; // Foreign key to the User model
  service: 'Medical' | 'Psychological' | 'Maintenance' | 'Logistics';
  title: string; // Title of their service (e.g., "plumber" for maintenance)
  status: 'pending' | 'accepted' | 'rejected'; // Status of the volunteer application
  description: string; // Description of their skills or expertise
  contactDetails: string; // Contact information like phone or email
  createdAt: Date;
  updatedAt: Date;
}

// Volunteer Schema
const VolunteerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  service: {
    type: String,
    enum: ['Medical' , 'Psychological' , 'Maintenance', 'Logistics'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true
  },
  contactDetails: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.__v; // Optionally hide the version key
    }
  },
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the Volunteer model
const Volunteer = mongoose.model<VolunteerDoc>('Volunteer', VolunteerSchema);

export { Volunteer };
