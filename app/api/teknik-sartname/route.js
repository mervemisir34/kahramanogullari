import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TeknikSartname from '@/lib/models/teknik-sartname';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (slug) {
      const teknikSartname = await TeknikSartname.findOne({ slug, isActive: true });
      
      if (!teknikSartname) {
        return NextResponse.json(
          { error: 'Teknik şartname bulunamadı' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(teknikSartname);
    } else {
      const teknikSartnames = await TeknikSartname.find({ isActive: true })
        .sort({ order: 1, createdAt: 1 });
      
      return NextResponse.json(teknikSartnames);
    }
  } catch (error) {
    console.error('Teknik şartname getirme hatası:', error);
    return NextResponse.json(
      { error: 'Teknik şartname getirilemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const { title, content, updatedBy } = await request.json();
    
    if (!title) {
      return NextResponse.json(
        { error: 'Başlık zorunludur' },
        { status: 400 }
      );
    }
    
    const slug = title
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/[^a-z0-9\s]/gi, '')
      .replace(/\s+/g, '-')
      .trim();
    
    const existingTeknikSartname = await TeknikSartname.findOne({ slug });
    if (existingTeknikSartname) {
      return NextResponse.json(
        { error: 'Bu başlıkta bir teknik şartname zaten mevcut' },
        { status: 409 }
      );
    }
    
    const teknikSartname = await TeknikSartname.create({
      title,
      slug,
      content,
      updatedBy,
    });

    return NextResponse.json(teknikSartname);
  } catch (error) {
    console.error('Teknik şartname oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Teknik şartname oluşturulamadı' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    
    const { id, title, content, updatedBy, isActive, order } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID zorunludur' },
        { status: 400 }
      );
    }
    
    const teknikSartname = await TeknikSartname.findById(id);
    
    if (!teknikSartname) {
      return NextResponse.json(
        { error: 'Teknik şartname bulunamadı' },
        { status: 404 }
      );
    }
    
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ş/g, 's')
        .replace(/ü/g, 'u')
        .replace(/[^a-z0-9\s]/gi, '')
        .replace(/\s+/g, '-')
        .trim();
      
      const existingTeknikSartname = await TeknikSartname.findOne({ 
        slug, 
        _id: { $ne: id } 
      });
      
      if (existingTeknikSartname) {
        return NextResponse.json(
          { error: 'Bu başlıkta bir teknik şartname zaten mevcut' },
          { status: 409 }
        );
      }
      
      teknikSartname.title = title;
      teknikSartname.slug = slug;
    }
    
    if (content !== undefined) teknikSartname.content = content;
    if (updatedBy !== undefined) teknikSartname.updatedBy = updatedBy;
    if (isActive !== undefined) teknikSartname.isActive = isActive;
    if (order !== undefined) teknikSartname.order = order;
    
    teknikSartname.lastUpdated = new Date();
    await teknikSartname.save();

    return NextResponse.json(teknikSartname);
  } catch (error) {
    console.error('Teknik şartname güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Teknik şartname güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID zorunludur' },
        { status: 400 }
      );
    }
    
    const teknikSartname = await TeknikSartname.findById(id);
    
    if (!teknikSartname) {
      return NextResponse.json(
        { error: 'Teknik şartname bulunamadı' },
        { status: 404 }
      );
    }
    
    await TeknikSartname.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Teknik şartname silindi' });
  } catch (error) {
    console.error('Teknik şartname silme hatası:', error);
    return NextResponse.json(
      { error: 'Teknik şartname silinemedi' },
      { status: 500 }
    );
  }
}