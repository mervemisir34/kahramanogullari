import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

// AWS S3 konfigürasyonu
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer S3 storage konfigürasyonu
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    metadata: function (_, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (_, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = file.originalname.split('.').pop();
      cb(null, `projects/${uniqueSuffix}.${fileExtension}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (_, file, cb) {
    // Sadece resim dosyalarına izin ver
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir.'), false);
    }
  }
});

// Tek resim yükleme
export const uploadSingle = upload.single('image');

// Çoklu resim yükleme (max 10)
export const uploadMultiple = upload.array('images', 10);

// S3'ten dosya silme fonksiyonu
export const deleteFromS3 = async (fileKey) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileKey
  };

  try {
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('S3 dosya silme hatası:', error);
    return false;
  }
};

// S3 URL'den key çıkarma fonksiyonu
export const extractKeyFromUrl = (url) => {
  const urlParts = url.split('/');
  return urlParts.slice(3).join('/'); // domain'den sonraki kısmı al
};