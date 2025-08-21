import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Address from '@/lib/models/address';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid address ID' },
        { status: 400 }
      );
    }

    const address = await Address.findById(params.id);
    
    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: address });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid address ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const updatedAddress = await Address.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        street: body.street,
        neighborhood: body.neighborhood,
        buildingInfo: body.buildingInfo,
        district: body.district,
        city: body.city,
        fullAddress: body.fullAddress,
        phone: body.phone,
        email: body.email,
        workingHours: body.workingHours,
        isActive: body.isActive
      },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedAddress });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid address ID' },
        { status: 400 }
      );
    }

    const deletedAddress = await Address.findByIdAndDelete(params.id);

    if (!deletedAddress) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Address deleted successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}