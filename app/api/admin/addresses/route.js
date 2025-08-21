import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Address from '@/lib/models/address';

export async function GET() {
  try {
    await connectDB();
    const addresses = await Address.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: addresses });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const address = new Address({
      title: body.title || 'Firma Adresi',
      street: body.street,
      neighborhood: body.neighborhood,
      buildingInfo: body.buildingInfo,
      district: body.district,
      city: body.city,
      fullAddress: body.fullAddress,
      phone: body.phone,
      email: body.email,
      workingHours: body.workingHours,
      isActive: body.isActive !== undefined ? body.isActive : true
    });

    const savedAddress = await address.save();
    return NextResponse.json({ success: true, data: savedAddress }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}