import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Company from '@/lib/models/company';
import Address from '@/lib/models/address';

export async function GET() {
  try {
    await connectDB();
    const [company, address] = await Promise.all([
      Company.findOne().lean(),
      Address.findOne().lean()
    ]);
    
    if (company && address) {
      company.addressId = address;
    }
    
    const response = NextResponse.json({ 
      success: true, 
      data: company,
      timestamp: Date.now()
    });
    
    // Cache for 5 minutes
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}