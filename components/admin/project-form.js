'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function ProjectForm({ onSubmit, initialData = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    status: initialData?.status || 'ONGOING',
    apartmentInfo: initialData?.apartmentInfo || '',
    duplexInfo: initialData?.duplexInfo || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(initialData?.images || []);
  const [errors, setErrors] = useState({});

  // Debug logs
  console.log('ProjectForm rendered with:');
  console.log('- initialData:', initialData);
  console.log('- initialData.images:', initialData?.images);
  console.log('- imagePreviews state:', imagePreviews);
  console.log('- imagePreviews length:', imagePreviews.length);

  // initialData değişirse imagePreviews'i güncelle
  useEffect(() => {
    if (initialData?.images && initialData.images.length > 0) {
      console.log('useEffect: Updating imagePreviews with:', initialData.images);
      setImagePreviews(initialData.images);
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const totalImages = imagePreviews.length + files.length;
    
    if (totalImages > 20) {
      setErrors(prev => ({
        ...prev,
        images: 'En fazla 20 resim yükleyebilirsiniz'
      }));
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: 'Sadece JPG, PNG ve WebP formatında resimler yüklenebilir'
      }));
      return;
    }

    // Check file sizes (5MB limit per file)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: 'Her resim en fazla 5MB olabilir'
      }));
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    setErrors(prev => ({ ...prev, images: null }));
  };

  const removeImage = (index) => {
    // If it's a new image (from selectedImages)
    if (index >= (initialData?.images?.length || 0)) {
      const newImageIndex = index - (initialData?.images?.length || 0);
      setSelectedImages(prev => prev.filter((_, i) => i !== newImageIndex));
    }
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Proje başlığı zorunludur';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Proje açıklaması zorunludur';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Proje lokasyonu zorunludur';
    }

    if (!formData.status) {
      newErrors.status = 'Proje durumu seçiniz';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Başlangıç tarihi zorunludur';
    }

    if (formData.status === 'COMPLETED' && !formData.endDate) {
      newErrors.endDate = 'Tamamlanan projeler için bitiş tarihi zorunludur';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'Bitiş tarihi başlangıç tarihinden önce olamaz';
    }

    if (imagePreviews.length === 0) {
      newErrors.images = 'En az bir resim yükleyiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = new FormData();
    
    // Add form fields
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    // Add new images
    selectedImages.forEach((file, index) => {
      submitData.append('images', file);
    });

    // If updating, add existing images info
    if (initialData) {
      submitData.append('id', initialData.id);
      // Sadece HTTP URL olan resimleri (mevcut resimler) gönder
      const existingImages = imagePreviews.filter(img => 
        typeof img === 'string' && img.startsWith('http')
      );
      
      // Validate and safely stringify existing images
      try {
        const jsonString = JSON.stringify(existingImages);
        // Check if JSON string is too large (FormData limit ~2MB per field)
        if (jsonString.length > 1000000) { // 1MB limit for safety
          console.warn('keepExistingImages JSON too large, sending images individually');
          // Send each image URL as separate field if JSON is too large
          existingImages.forEach((url, index) => {
            submitData.append(`keepExistingImage_${index}`, url);
          });
          submitData.append('keepExistingImagesCount', existingImages.length.toString());
        } else {
          submitData.append('keepExistingImages', jsonString);
        }
      } catch (error) {
        console.error('Error stringifying existing images:', error);
        // Fallback: send images individually
        existingImages.forEach((url, index) => {
          submitData.append(`keepExistingImage_${index}`, url);
        });
        submitData.append('keepExistingImagesCount', existingImages.length.toString());
      }
    }

    onSubmit(submitData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Proje Düzenle' : 'Yeni Proje Ekle'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Proje Başlığı */}
          <div className="space-y-2">
            <Label htmlFor="title">Proje Başlığı *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Proje başlığını giriniz"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Proje Açıklaması */}
          <div className="space-y-2">
            <Label htmlFor="description">Proje Açıklaması *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Proje hakkında detaylı bilgi giriniz"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Lokasyon */}
          <div className="space-y-2">
            <Label htmlFor="location">Lokasyon *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Proje lokasyonunu giriniz"
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
          </div>

          {/* Durum */}
          <div className="space-y-2">
            <Label>Proje Durumu *</Label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className={`flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.status ? 'border-red-500' : 'border-input bg-background'
              }`}
            >
              <option value="">Proje durumunu seçiniz</option>
              <option value="ONGOING">Devam Ediyor</option>
              <option value="COMPLETED">Tamamlandı</option>
            </select>
            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
          </div>

          {/* Daire Bilgisi */}
          <div className="space-y-2">
            <Label htmlFor="apartmentInfo">Daire Bilgisi</Label>
            <Input
              id="apartmentInfo"
              value={formData.apartmentInfo}
              onChange={(e) => handleInputChange('apartmentInfo', e.target.value)}
              placeholder="Örn: 3+1, 120m², 2. kat"
              className={errors.apartmentInfo ? 'border-red-500' : ''}
            />
            {errors.apartmentInfo && <p className="text-sm text-red-500">{errors.apartmentInfo}</p>}
          </div>

          {/* Dubleks Bilgisi */}
          <div className="space-y-2">
            <Label htmlFor="duplexInfo">Dubleks Bilgisi</Label>
            <Input
              id="duplexInfo"
              value={formData.duplexInfo}
              onChange={(e) => handleInputChange('duplexInfo', e.target.value)}
              placeholder="Örn: 4+1, 180m², çatı katı"
              className={errors.duplexInfo ? 'border-red-500' : ''}
            />
            {errors.duplexInfo && <p className="text-sm text-red-500">{errors.duplexInfo}</p>}
          </div>

          {/* Başlangıç Tarihi */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Başlangıç Tarihi *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={errors.startDate ? 'border-red-500' : ''}
            />
            {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
          </div>

          {/* Bitiş Tarihi - Sadece tamamlanan projeler için */}
          {formData.status === 'COMPLETED' && (
            <div className="space-y-2">
              <Label htmlFor="endDate">Bitiş Tarihi *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
            </div>
          )}

          {/* Resim Yükleme */}
          <div className="space-y-2">
            <Label>Proje Resimleri * (En fazla 20 adet, her biri max 5MB)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="images"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="images"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Resim yüklemek için tıklayın veya sürükleyin
                </span>
                <span className="text-xs text-gray-400">
                  JPG, PNG, WebP - Max 5MB
                </span>
              </label>
            </div>
            {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}

            {/* Resim Önizlemeleri */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => {
                  console.log(`Rendering image ${index}:`, preview);
                  return (
                    <div key={`img-${index}-${Date.now()}`} className="relative group">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={100}
                        height={96}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          border: '2px solid white',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                          zIndex: '999',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          fontFamily: 'Arial, sans-serif'
                        }}
                        onClick={() => {
                          console.log('Delete clicked for index:', index);
                          removeImage(index);
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#dc2626';
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#ef4444';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        ×
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-xs text-gray-500">
              {imagePreviews.length}/20 resim yüklendi
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Kaydediliyor...' : (initialData ? 'Güncelle' : 'Kaydet')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}