import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/lib/models/admin';

export async function POST(request) {
  try {
    await connectDB();

    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Token ve yeni şifre gerekli' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      );
    }

    // Find admin with valid reset token
    const admin = await AdminUser.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() }, // Token must not be expired
      isActive: true
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz veya süresi dolmuş token' },
        { status: 400 }
      );
    }

    // Update password and clear reset token
    admin.password = newPassword; // Will be hashed by pre-save hook
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpiry = undefined;
    admin.lastLogin = new Date(); // Update last login

    await admin.save();

    return NextResponse.json({
      success: true,
      message: 'Şifreniz başarıyla sıfırlandı. Artık yeni şifrenizle giriş yapabilirsiniz.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Şifre sıfırlama işlemi başarısız' },
      { status: 500 }
    );
  }
}