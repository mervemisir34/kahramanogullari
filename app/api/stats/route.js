import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Project from '@/lib/models/project';

// GET - İstatistikleri getir
export async function GET() {
  try {
    await connectDB();
    
    // Toplam proje sayısı
    const totalProjects = await Project.countDocuments();
    
    // Tamamlanan proje sayısı
    const completedProjects = await Project.countDocuments({ status: 'COMPLETED' });
    
    // Devam eden proje sayısı
    const ongoingProjects = await Project.countDocuments({ status: 'ONGOING' });
    
    return NextResponse.json({
      success: true,
      data: {
        totalProjects,
        completedProjects,
        ongoingProjects
      }
    });
  } catch (error) {
    console.error('İstatistik getirme hatası:', error);
    return NextResponse.json(
      { success: false, error: 'İstatistikler getirilemedi' },
      { status: 500 }
    );
  }
}
