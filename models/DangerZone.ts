import mongoose, { Schema, Document } from 'mongoose';

interface DangerZoneDoc extends Document {
  lat: number;
  lng: number;
  radius: number; // in meters (or whatever unit you're using)
}

const DangerZoneSchema = new Schema<DangerZoneDoc>({
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  radius: {
    type: Number,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
    }
  },
  timestamps: true // Optional: track createdAt and updatedAt
});

const DangerZone = mongoose.model<DangerZoneDoc>('DangerZone', DangerZoneSchema);

export { DangerZone };
