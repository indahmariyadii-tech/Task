import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';
import * as dataStore from '@/lib/dataStore';

export async function GET() {
  try {
    await dbConnect();
    const notes = await Note.find({}).sort({ createdAt: -1 });
    return NextResponse.json(notes);
  } catch (error) {
    console.warn('MongoDB failed, using mock data');
    return NextResponse.json(dataStore.notes);
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const note = await Note.create(body);
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.warn('MongoDB failed, using mock data');
    const body = await request.json();
    const note = dataStore.addNote(body);
    return NextResponse.json(note, { status: 201 });
  }
}
