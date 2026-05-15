import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import * as dataStore from '@/lib/dataStore';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const task = await Task.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.warn('MongoDB failed, using mock data');
    const body = await request.json().catch(() => ({}));
    const task = dataStore.updateTask(params.id, body);
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json(task);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const task = await Task.findByIdAndDelete(params.id);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.warn('MongoDB failed, using mock data');
    dataStore.deleteTask(params.id);
    return NextResponse.json({ message: 'Task deleted successfully' });
  }
}
