import mongoose, { Schema, model, models } from 'mongoose';

export interface IActivity {
  userId: mongoose.Types.ObjectId;
  type: 'task_complete' | 'timer_session';
  duration?: number; // minutes
  taskId?: mongoose.Types.ObjectId;
  timestamp: Date;
}

const ActivitySchema = new Schema<IActivity>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['task_complete', 'timer_session'], required: true },
  duration: { type: Number },
  taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
  timestamp: { type: Date, default: Date.now },
});

export default models.Activity || model<IActivity>('Activity', ActivitySchema);
