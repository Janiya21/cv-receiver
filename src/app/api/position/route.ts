import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Position from '@/model/Position';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const positions = await Position.find({});
    return NextResponse.json(positions, { status: 200 });
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json({ error: 'Error fetching positions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, description } = await req.json();

    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
    }

    const newPosition = new Position({
      name,
      description,
      status: 'active', // Assuming new positions start as 'active'
    });

    await newPosition.save();
    return NextResponse.json(newPosition, { status: 201 });
  } catch (error) {
    console.error('Error creating position:', error);
    return NextResponse.json({ error: 'Error creating position' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const updatedPosition = await Position.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedPosition) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPosition, { status: 200 });
  } catch (error) {
    console.error('Error updating position:', error);
    return NextResponse.json({ error: 'Error updating position' }, { status: 500 });
  }
}
