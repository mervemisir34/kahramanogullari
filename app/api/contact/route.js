import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, phone, projectType, message } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Tüm zorunlu alanları doldurun' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Geçerli bir email adresi girin' },
        { status: 400 }
      );
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@kahramanogullari.com',
      to: '1.yucelgumus@gmail.com',
      subject: `🏗️ Yeni İletişim Formu Mesajı - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0; font-size: 24px;">🏗️ Yeni İletişim Formu Mesajı</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Kahramanoğulları İnşaat Web Sitesi</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 18px;">👤 Müşteri Bilgileri</h3>
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                <p style="margin: 5px 0;"><strong>Ad Soyad:</strong> ${name}</p>
                <p style="margin: 5px 0;"><strong>📧 E-posta:</strong> <a href="mailto:${email}" style="color: #059669;">${email}</a></p>
                <p style="margin: 5px 0;"><strong>📞 Telefon:</strong> <a href="tel:${phone}" style="color: #059669;">${phone}</a></p>
                ${projectType ? `<p style="margin: 5px 0;"><strong>🏢 Proje Türü:</strong> ${getProjectTypeText(projectType)}</p>` : ''}
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 18px;">💬 Mesaj</h3>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; border: 1px solid #d1d5db;">
                <p style="margin: 0; white-space: pre-wrap; color: #374151; line-height: 1.6;">${message}</p>
              </div>
            </div>

            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border: 1px solid #a7f3d0;">
              <p style="margin: 0; color: #065f46; font-size: 14px;">
                <strong>⏰ Gönderim Tarihi:</strong> ${new Date().toLocaleString('tr-TR', {
                  timeZone: 'Europe/Istanbul',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div style="margin-top: 20px; text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Bu mesaj Kahramanoğulları İnşaat web sitesi iletişim formundan gönderilmiştir.
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi!'
    });

  } catch (error) {
    console.error('Email gönderme hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}

function getProjectTypeText(type) {
  const types = {
    'konut': 'Konut Projesi 🏠',
    'ofis': 'Ofis Binası 🏢',
    'ticari': 'Ticari Bina 🏪',
    'sanayi': 'Sanayi Tesisi 🏭',
    'diger': 'Diğer 📝'
  };
  return types[type] || type;
}