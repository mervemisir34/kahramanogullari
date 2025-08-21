import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Company from '@/lib/models/company';

export async function GET() {
  try {
    await connectDB();
    const company = await Company.findOne().sort({ createdAt: -1 }).populate('addressId');
    return NextResponse.json({ success: true, data: company });
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
    
    const company = new Company({
      companyName: body.companyName || 'Kahramanoğulları İnşaat',
      phone: body.phone,
      mobile1: body.mobile1,
      mobile2: body.mobile2,
      email: body.email,
      workingHours: body.workingHours,
      about: body.about,
      foundedYear: body.foundedYear,
      totalProjects: body.totalProjects,
      teamMembers: body.teamMembers || [],
      addressId: body.addressId
    });

    const savedCompany = await company.save();
    return NextResponse.json({ success: true, data: savedCompany }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    let company = await Company.findOne().sort({ createdAt: -1 });
    
    if (!company) {
      // Create new company if none exists
      company = new Company({
        companyName: body.companyName || 'Kahramanoğulları İnşaat',
        phone: body.phone,
        mobile1: body.mobile1,
        mobile2: body.mobile2,
        email: body.email,
        workingHours: body.workingHours,
        about: body.about,
        foundedYear: body.foundedYear,
        totalProjects: body.totalProjects,
        teamMembers: body.teamMembers || [],
        addressId: body.addressId
      });
      
      const savedCompany = await company.save();
      return NextResponse.json({ success: true, data: savedCompany });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      company._id,
      {
        companyName: body.companyName,
        phone: body.phone,
        mobile1: body.mobile1,
        mobile2: body.mobile2,
        email: body.email,
        workingHours: body.workingHours,
        about: body.about,
        foundedYear: body.foundedYear,
        totalProjects: body.totalProjects,
        teamMembers: body.teamMembers || [],
        addressId: body.addressId
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: updatedCompany });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}