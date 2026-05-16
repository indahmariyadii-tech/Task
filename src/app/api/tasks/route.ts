import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import * as dataStore from '@/lib/dataStore';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    const tasks = await Task.find({ userId: (session.user as any).id }).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    console.warn('MongoDB failed, using mock data');
    return NextResponse.json(dataStore.tasks);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const task = await Task.create({ ...body, userId: (session.user as any).id });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.warn('MongoDB failed, using mock data');
    const body = await request.json();
    const task = dataStore.addTask(body);
    return NextResponse.json(task, { status: 201 });
  }
}
