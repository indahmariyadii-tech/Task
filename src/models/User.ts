import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String },
}, { 
  timestamps: true 
});

export default models.User || model<IUser>('User', UserSchema);
