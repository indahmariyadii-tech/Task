import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import * as dataStore from '@/lib/dataStore';

export async function GET() {
  try {
    await dbConnect();
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    console.warn('MongoDB failed, using mock data');
    return NextResponse.json(dataStore.tasks);
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const task = await Task.create(body);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.warn('MongoDB failed, using mock data');
    const body = await request.json();
    const task = dataStore.addTask(body);
    return NextResponse.json(task, { status: 201 });
  }
}
