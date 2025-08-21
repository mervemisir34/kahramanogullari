import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/lib/models/admin';
import jwt from 'jsonwebtoken';

// Verify JWT token
function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1]; // Bearer token

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET - List admin users
export async function GET(request) {
  try {
    // Verify authentication
    verifyToken(request);
    
    await connectDB();

    const admins = await AdminUser.find({}, { password: 0 })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: admins
    });

  } catch (error) {
    console.error('Get admins error:', error);
    return NextResponse.json(
      { success: false, error: error.message === 'No token provided' || error.message === 'Invalid token' ? 'Yetkisiz erişim' : 'Admin kullanıcıları getirilemedi' },
      { status: error.message === 'No token provided' || error.message === 'Invalid token' ? 401 : 500 }
    );
  }
}

// POST - Create new admin user
export async function POST(request) {
  try {
    // Verify authentication
    verifyToken(request);
    
    await connectDB();

    const { username, password, email } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı adı ve şifre gerekli' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingAdmin = await AdminUser.findOne({ 
      username: username.toLowerCase().trim() 
    });

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Bu kullanıcı adı zaten kullanılıyor' },
        { status: 409 }
      );
    }

    // Create new admin
    const newAdmin = new AdminUser({
      username: username.toLowerCase().trim(),
      password,
      email: email || null
    });

    await newAdmin.save();

    // Return admin without password
    const adminResponse = {
      id: newAdmin._id,
      username: newAdmin.username,
      email: newAdmin.email,
      isActive: newAdmin.isActive,
      createdAt: newAdmin.createdAt
    };

    return NextResponse.json({
      success: true,
      message: 'Admin kullanıcı başarıyla oluşturuldu',
      data: adminResponse
    }, { status: 201 });

  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { success: false, error: error.message === 'No token provided' || error.message === 'Invalid token' ? 'Yetkisiz erişim' : 'Admin kullanıcı oluşturulamadı' },
      { status: error.message === 'No token provided' || error.message === 'Invalid token' ? 401 : 500 }
    );
  }
}

// PUT - Update admin user
export async function PUT(request) {
  try {
    // Verify authentication
    verifyToken(request);
    
    await connectDB();

    const { id, username, password, email, isActive } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Admin ID gerekli' },
        { status: 400 }
      );
    }

    // Find admin
    const admin = await AdminUser.findById(id);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Update fields
    if (username) admin.username = username.toLowerCase().trim();
    if (password) admin.password = password; // Will be hashed by pre-save hook
    if (email !== undefined) admin.email = email || null;
    if (isActive !== undefined) admin.isActive = isActive;

    await admin.save();

    // Return admin without password
    const adminResponse = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      isActive: admin.isActive,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };

    return NextResponse.json({
      success: true,
      message: 'Admin kullanıcı başarıyla güncellendi',
      data: adminResponse
    });

  } catch (error) {
    console.error('Update admin error:', error);
    return NextResponse.json(
      { success: false, error: error.message === 'No token provided' || error.message === 'Invalid token' ? 'Yetkisiz erişim' : 'Admin kullanıcı güncellenemedi' },
      { status: error.message === 'No token provided' || error.message === 'Invalid token' ? 401 : 500 }
    );
  }
}

// DELETE - Delete admin user  
export async function DELETE(request) {
  try {
    // Verify authentication
    verifyToken(request);
    
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Admin ID gerekli' },
        { status: 400 }
      );
    }

    // Check if trying to delete last admin
    const adminCount = await AdminUser.countDocuments({ isActive: true });
    if (adminCount <= 1) {
      return NextResponse.json(
        { success: false, error: 'Son admin kullanıcı silinemez' },
        { status: 400 }
      );
    }

    // Delete admin
    const deletedAdmin = await AdminUser.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin kullanıcı başarıyla silindi'
    });

  } catch (error) {
    console.error('Delete admin error:', error);
    return NextResponse.json(
      { success: false, error: error.message === 'No token provided' || error.message === 'Invalid token' ? 'Yetkisiz erişim' : 'Admin kullanıcı silinemedi' },
      { status: error.message === 'No token provided' || error.message === 'Invalid token' ? 401 : 500 }
    );
  }
}