import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';
import * as dataStore from '@/lib/dataStore';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const note = await Note.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.warn('MongoDB failed, using mock data');
    const body = await request.json().catch(() => ({}));
    const note = dataStore.updateNote(params.id, body);
    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    return NextResponse.json(note);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const note = await Note.findByIdAndDelete(params.id);

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.warn('MongoDB failed, using mock data');
    dataStore.deleteNote(params.id);
    return NextResponse.json({ message: 'Note deleted successfully' });
  }
}
