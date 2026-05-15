import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Activity from '@/models/Activity';
import * as dataStore from '@/lib/dataStore';

export async function GET() {
  try {
    await dbConnect();
    const activities = await Activity.find({}).sort({ timestamp: -1 });
    return NextResponse.json(activities);
  } catch (error) {
    console.warn('MongoDB failed, using mock data');
    return NextResponse.json(dataStore.activities);
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const activity = await Activity.create(body);
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.warn('MongoDB failed, using mock data');
    const body = await request.json();
    const activity = dataStore.addActivity(body);
    return NextResponse.json(activity, { status: 201 });
  }
}
