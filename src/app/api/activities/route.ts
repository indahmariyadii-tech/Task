import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Activity from '@/models/Activity';
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
    const activities = await Activity.find({ userId: (session.user as any).id }).sort({ timestamp: -1 });
    return NextResponse.json(activities);
  } catch (error) {
    console.warn('MongoDB failed, using mock data');
    return NextResponse.json(dataStore.activities);
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
    const activity = await Activity.create({ ...body, userId: (session.user as any).id });
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.warn('MongoDB failed, using mock data');
    const body = await request.json();
    const activity = dataStore.addActivity(body);
    return NextResponse.json(activity, { status: 201 });
  }
}
