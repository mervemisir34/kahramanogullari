import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Address from '@/lib/models/address';

export async function GET() {
  try {
    await connectDB();
    const addresses = await Address.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: addresses });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}