import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Project from '@/lib/models/project';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// AWS S3 konfigürasyonu (v3)
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// S3'e dosya yükleme fonksiyonu (v3)
async function uploadToS3(file, fileName) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `projects/${fileName}`,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);
    
    // S3 URL'i oluştur
    const s3Url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/projects/${fileName}`;
    return s3Url;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('S3 yükleme hatası: ' + error.message);
  }
}

// S3'ten dosya silme fonksiyonu (v3)
async function deleteFromS3(fileUrl) {
  try {
    const urlParts = new URL(fileUrl);
    const key = urlParts.pathname.substring(1); // '/' karakterini kaldır
    
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('S3 delete error:', error);
    return false;
  }
}

// GET - Projeleri listele (pagination ile)
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const status = searchParams.get('status'); // 'COMPLETED', 'ONGOING' veya null
    const homepage = searchParams.get('homepage'); // homepage için limited data
    
    const skip = (page - 1) * limit;
    
    // Filter objesi oluştur
    const filter = {};
    if (status) {
      filter.status = status;
    }
    
    // Eğer homepage request'i ise, sadece gerekli alanları al ve tek resim
    let projection = {};
    let aggregationPipeline = null;
    
    if (homepage === 'true') {
      // Homepage için aggregate pipeline kullan - hem COMPLETED hem ONGOING'den 6'şar tane
      aggregationPipeline = [
        {
          $facet: {
            completed: [
              { $match: { status: 'COMPLETED' } },
              { $sort: { createdAt: -1 } },
              { $limit: 6 },
              { 
                $project: {
                  title: 1,
                  slug: 1,
                  location: 1,
                  status: 1,
                  createdAt: 1,
                  images: { $slice: ['$images', 1] }
                }
              }
            ],
            ongoing: [
              { $match: { status: 'ONGOING' } },
              { $sort: { createdAt: -1 } },
              { $limit: 6 },
              { 
                $project: {
                  title: 1,
                  slug: 1,
                  location: 1,
                  status: 1,
                  createdAt: 1,
                  images: { $slice: ['$images', 1] }
                }
              }
            ]
          }
        }
      ];
    }
    
    const actualLimit = homepage === 'true' ? 5 : limit;
    
    let projects;
    if (aggregationPipeline) {
      const result = await Project.aggregate(aggregationPipeline);
      
      if (homepage === 'true') {
        // Homepage için facet sonucunu düzenle
        projects = {
          completed: result[0].completed || [],
          ongoing: result[0].ongoing || []
        };
      } else {
        projects = result;
      }
    } else {
      projects = await Project.find(filter, projection)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(actualLimit)
        .lean();
    }

    // Homepage için farklı response yapısı
    if (homepage === 'true') {
      return NextResponse.json({
        success: true,
        data: projects
      });
    }

    // Toplam sayıyı al (pagination için)
    const total = await Project.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    console.log(`GET projects - Page: ${page}, Limit: ${actualLimit}, Total: ${total}, Homepage: ${homepage}`);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasMore,
        itemsPerPage: actualLimit
      }
    });
  } catch (error) {
    console.error('Projeler getirme hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Projeler getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni proje ekle
export async function POST(request) {
  try {
    console.log('POST /api/projects başlatıldı');
    
    await connectDB();
    console.log('MongoDB bağlantısı başarılı');

    const formData = await request.formData();
    
    // Form verilerini al
    const title = formData.get('title');
    const description = formData.get('description');
    const location = formData.get('location');
    const status = formData.get('status');
    const apartmentInfo = formData.get('apartmentInfo');
    const duplexInfo = formData.get('duplexInfo');
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    
    console.log('New fields:', { apartmentInfo, duplexInfo, startDate, endDate });
    
    // Validate required fields
    if (!startDate || startDate.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Başlangıç tarihi zorunludur' },
        { status: 400 }
      );
    }
    
    if (status === 'COMPLETED' && (!endDate || endDate.trim() === '')) {
      return NextResponse.json(
        { success: false, error: 'Tamamlanan projeler için bitiş tarihi zorunludur' },
        { status: 400 }
      );
    }
    
    // Slug oluştur
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, '')
      .replace(/\s+/g, '-')
      .trim();

    // Resimleri al
    const images = formData.getAll('images');
    
    if (images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'En az bir resim yüklemelisiniz' },
        { status: 400 }
      );
    }

    if (images.length > 20) {
      return NextResponse.json(
        { success: false, error: 'En fazla 20 resim yükleyebilirsiniz' },
        { status: 400 }
      );
    }

    // Resimleri S3'e yükle
    const imageUrls = [];
    
    for (const image of images) {
      if (image.size > 0) { // Boş dosya kontrolü
        // Dosya tipini kontrol et
        if (!image.type.startsWith('image/')) {
          return NextResponse.json(
            { success: false, error: 'Sadece resim dosyaları yüklenebilir' },
            { status: 400 }
          );
        }

        // Dosya boyutunu kontrol et (5MB)
        if (image.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { success: false, error: 'Resim boyutu 5MB\'dan büyük olamaz' },
            { status: 400 }
          );
        }

        try {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const fileExtension = image.name.split('.').pop();
          const fileName = `${uniqueSuffix}.${fileExtension}`;
          
          const imageUrl = await uploadToS3(image, fileName);
          imageUrls.push(imageUrl);
          console.log('Resim S3\'e yüklendi:', imageUrl);
        } catch (uploadError) {
          console.error('Dosya yükleme hatası:', uploadError);
          return NextResponse.json(
            { success: false, error: 'Resim yükleme hatası: ' + uploadError.message },
            { status: 500 }
          );
        }
      }
    }

    // Veritabanına kaydet
    const newProject = new Project({
      title,
      slug,
      description,
      location,
      status,
      images: imageUrls,
      apartmentInfo,
      duplexInfo,
      startDate: new Date(startDate),
      endDate: endDate && endDate.trim() !== '' ? new Date(endDate) : null
    });

    const savedProject = await newProject.save();

    return NextResponse.json({
      success: true,
      data: savedProject,
      message: 'Proje başarıyla eklendi'
    }, { status: 201 });

  } catch (error) {
    console.error('Proje ekleme hatası:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Bu başlıkta bir proje zaten mevcut' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Proje eklenemedi' },
      { status: 500 }
    );
  }
}

// PUT - Proje güncelle
export async function PUT(request) {
  try {
    console.log('PUT /api/projects başlatıldı');
    await connectDB();

    const formData = await request.formData();
    const projectId = formData.get('id');
    
    console.log('Project ID:', projectId);
    
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Proje ID gerekli' },
        { status: 400 }
      );
    }

    const existingProject = await Project.findById(projectId);
    console.log('Existing project found:', !!existingProject);
    
    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    // Form verilerini al
    const title = formData.get('title');
    const description = formData.get('description');
    const location = formData.get('location');
    const status = formData.get('status');
    const apartmentInfo = formData.get('apartmentInfo');
    const duplexInfo = formData.get('duplexInfo');
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    
    console.log('PUT Form data:', { title, description, location, status, apartmentInfo, duplexInfo, startDate, endDate });
    console.log('PUT projectId:', projectId);
    
    // Validate required fields
    if (!startDate || startDate.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Başlangıç tarihi zorunludur' },
        { status: 400 }
      );
    }
    
    if (status === 'COMPLETED' && (!endDate || endDate.trim() === '')) {
      return NextResponse.json(
        { success: false, error: 'Tamamlanan projeler için bitiş tarihi zorunludur' },
        { status: 400 }
      );
    }
    
    // Slug oluştur
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, '')
      .replace(/\s+/g, '-')
      .trim();

    // Yeni resimler varsa yükle
    const newImages = formData.getAll('images');
    const keepExistingImagesData = formData.get('keepExistingImages');
    
    let imageUrls = [];
    
    // Parse existing images to keep
    if (keepExistingImagesData) {
      try {
        // Handle both string and already parsed data
        if (typeof keepExistingImagesData === 'string') {
          // Validate JSON string before parsing
          if (keepExistingImagesData.trim().startsWith('[') && keepExistingImagesData.trim().endsWith(']')) {
            imageUrls = JSON.parse(keepExistingImagesData);
          } else {
            console.warn('Invalid JSON format for keepExistingImages:', keepExistingImagesData.substring(0, 100));
            imageUrls = [];
          }
        } else {
          imageUrls = Array.isArray(keepExistingImagesData) ? keepExistingImagesData : [];
        }
        
        // Ensure imageUrls is an array and contains only valid URLs
        if (!Array.isArray(imageUrls)) {
          imageUrls = [];
        } else {
          imageUrls = imageUrls.filter(url => 
            typeof url === 'string' && 
            (url.startsWith('http://') || url.startsWith('https://'))
          );
        }
      } catch (e) {
        console.error('Error parsing keepExistingImages:', e.message);
        console.error('Data received:', keepExistingImagesData?.substring(0, 200));
        imageUrls = [];
      }
    } else {
      // Check for individual image fields (fallback method)
      const keepExistingImagesCount = formData.get('keepExistingImagesCount');
      if (keepExistingImagesCount) {
        const count = parseInt(keepExistingImagesCount);
        for (let i = 0; i < count; i++) {
          const imageUrl = formData.get(`keepExistingImage_${i}`);
          if (imageUrl && typeof imageUrl === 'string' && 
              (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
            imageUrls.push(imageUrl);
          }
        }
      }
    }

    if (newImages.length > 0) {
      for (const image of newImages) {
        if (image.size > 0) {
          // Dosya tipini kontrol et
          if (!image.type.startsWith('image/')) {
            return NextResponse.json(
              { success: false, error: 'Sadece resim dosyaları yüklenebilir' },
              { status: 400 }
            );
          }

          // Dosya boyutunu kontrol et (5MB)
          if (image.size > 5 * 1024 * 1024) {
            return NextResponse.json(
              { success: false, error: 'Resim boyutu 5MB\'dan büyük olamaz' },
              { status: 400 }
            );
          }

          try {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileExtension = image.name.split('.').pop();
            const fileName = `${uniqueSuffix}.${fileExtension}`;
            
            const imageUrl = await uploadToS3(image, fileName);
            imageUrls.push(imageUrl);
          } catch (uploadError) {
            console.error('Dosya yükleme hatası:', uploadError);
            return NextResponse.json(
              { success: false, error: 'Resim yükleme hatası: ' + uploadError.message },
              { status: 500 }
            );
          }
        }
      }
    }

    // Toplam resim sayısı kontrolü
    if (imageUrls.length > 20) {
      return NextResponse.json(
        { success: false, error: 'En fazla 20 resim olabilir' },
        { status: 400 }
      );
    }

    // Eski resimleri sil (silinecek olanlar)
    const imagesToDelete = existingProject.images.filter(img => !imageUrls.includes(img));
    console.log('Images to delete:', imagesToDelete);
    
    for (const imageUrl of imagesToDelete) {
      await deleteFromS3(imageUrl);
    }

    // Projeyi güncelle
    console.log('About to update with:', {
      title,
      slug,
      description,
      location,
      status,
      images: imageUrls,
      apartmentInfo,
      duplexInfo,
      startDate: new Date(startDate),
      endDate: endDate && endDate.trim() !== '' ? new Date(endDate) : null
    });

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        title,
        slug,
        description,
        location,
        status,
        images: imageUrls,
        apartmentInfo,
        duplexInfo,
        startDate: new Date(startDate),
        endDate: endDate && endDate.trim() !== '' ? new Date(endDate) : null
      },
      { new: true, runValidators: true }
    );

    console.log('Updated project result:', updatedProject);

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: 'Proje başarıyla güncellendi'
    });

  } catch (error) {
    console.error('Proje güncelleme hatası:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Bu başlıkta bir proje zaten mevcut' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Proje güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Proje sil
export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Proje ID gerekli' },
        { status: 400 }
      );
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    // S3'ten resimleri sil
    if (project.images && project.images.length > 0) {
      for (const imageUrl of project.images) {
        await deleteFromS3(imageUrl);
      }
    }

    // Projeyi sil
    await Project.findByIdAndDelete(projectId);

    return NextResponse.json({
      success: true,
      message: 'Proje başarıyla silindi'
    });

  } catch (error) {
    console.error('Proje silme hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Proje silinemedi' },
      { status: 500 }
    );
  }
}