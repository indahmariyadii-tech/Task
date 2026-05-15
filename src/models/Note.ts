import mongoose, { Schema, model, models } from 'mongoose';

export interface INote {
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
}

const NoteSchema = new Schema<INote>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default models.Note || model<INote>('Note', NoteSchema);
