import mongoose, { Schema, Document, Model } from "mongoose"

export interface Iuser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role?: string;
  isActive?: boolean;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  passwordChangedAt?: Date;
  createdAt?: Date;
  lastLogout?: Date; // 

}
const userSchema: Schema<Iuser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  passwordChangedAt: Date
}, {
  timestamps: true
});

export const User: Model<Iuser> = mongoose.model<Iuser>('User', userSchema);
