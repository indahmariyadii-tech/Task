import mongoose, { Schema, model, models } from 'mongoose';

export interface ITask {
  _id?: string;
  title: string;
  category: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 1 | 2 | 3 | 4 | 5;
  dueDate?: Date;
  duration?: number; // in minutes
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  priority: { type: Number, enum: [1, 2, 3, 4, 5], default: 3 },
  dueDate: { type: Date },
  duration: { type: Number, default: 0 },
  completedAt: { type: Date },
}, { 
  timestamps: true 
});

export default models.Task || model<ITask>('Task', TaskSchema);
