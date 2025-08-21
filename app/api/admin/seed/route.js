import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/lib/models/admin';

// Create initial admin user - Only works if no admin exists
export async function POST(request) {
  try {
    await connectDB();

    // Check if any admin exists
    const existingAdmin = await AdminUser.findOne();
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin kullanıcı zaten mevcut' },
        { status: 409 }
      );
    }

    // Create default admin
    const defaultAdmin = new AdminUser({
      username: 'yucelgumus',
      password: '6161yucel',
      email: '1.yucelgumus@gmail.com',
      isActive: true
    });

    await defaultAdmin.save();

    return NextResponse.json({
      success: true,
      message: 'Varsayılan admin kullanıcı oluşturuldu',
      data: {
        username: 'yucelgumus',
        email: '1.yucelgumus@gmail.com',
        message: 'Kullanıcı adı: yucelgumus, Şifre: 6161yucel'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Seed admin error:', error);
    return NextResponse.json(
      { success: false, error: 'Varsayılan admin oluşturulamadı' },
      { status: 500 }
    );
  }
}