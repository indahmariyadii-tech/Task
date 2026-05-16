import mongoose, { Schema, model, models } from 'mongoose';

export interface INote {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
}

const NoteSchema = new Schema<INote>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default models.Note || model<INote>('Note', NoteSchema);
