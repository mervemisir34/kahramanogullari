import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/lib/models/admin';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(request) {
  try {
    await connectDB();

    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı adı gerekli' },
        { status: 400 }
      );
    }

    // Find admin user
    const admin = await AdminUser.findOne({ 
      username: username.toLowerCase().trim(),
      isActive: true 
    });

    if (!admin || !admin.email) {
      // Don't reveal if user exists or not (security)
      return NextResponse.json({
        success: true,
        message: 'Eğer bu kullanıcı adı mevcut ve e-posta adresi tanımlıysa, şifre sıfırlama linki gönderildi.'
      });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to database
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpiry = resetTokenExpiry;
    await admin.save();

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/reset-password?token=${resetToken}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: admin.email,
      subject: '🔒 Kahramanoğulları İnşaat - Admin Şifre Sıfırlama',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0; font-size: 24px;">🔒 Şifre Sıfırlama Talebi</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Kahramanoğulları İnşaat Admin Paneli</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Merhaba ${admin.username}!</h3>
              <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px 0;">
                Admin paneli şifrenizi sıfırlamak için bir talepte bulundunuz. 
                Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                🔒 Şifremi Sıfırla
              </a>
            </div>

            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border: 1px solid #fecaca; margin: 20px 0;">
              <p style="margin: 0; color: #b91c1c; font-size: 14px;">
                <strong>⚠️ Önemli Güvenlik Notları:</strong>
              </p>
              <ul style="color: #b91c1c; font-size: 14px; margin: 10px 0 0 0; padding-left: 20px;">
                <li>Bu link <strong>1 saat</strong> süreyle geçerlidir</li>
                <li>Eğer bu talebi siz yapmadıysanız, bu emaili görmezden gelin</li>
                <li>Şifrenizi güvenli bir yerde saklayın</li>
              </ul>
            </div>

            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                <strong>Link çalışmıyor mu?</strong><br>
                Aşağıdaki linki kopyalayıp tarayıcınıza yapıştırabilirsiniz:<br>
                <span style="word-break: break-all; color: #3b82f6;">${resetUrl}</span>
              </p>
            </div>

            <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Bu e-posta Kahramanoğulları İnşaat admin sistemi tarafından otomatik olarak gönderilmiştir.<br>
                Gönderim Zamanı: ${new Date().toLocaleString('tr-TR', {
                  timeZone: 'Europe/Istanbul',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Şifre sıfırlama linki e-posta adresinize gönderildi.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Şifre sıfırlama işlemi başarısız' },
      { status: 500 }
    );
  }
}