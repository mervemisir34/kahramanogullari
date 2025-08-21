import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/lib/models/admin';
import jwt from 'jsonwebtoken';

// Admin login API
export async function POST(request) {
  try {
    await connectDB();

    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı adı ve şifre gerekli' },
        { status: 400 }
      );
    }

    // Find admin user
    const admin = await AdminUser.findOne({ 
      username: username.toLowerCase().trim(),
      isActive: true 
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 }
      );
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Create JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id,
        username: admin.username 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Giriş başarılı',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        lastLogin: admin.lastLogin
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Giriş işlemi başarısız' },
      { status: 500 }
    );
  }
}