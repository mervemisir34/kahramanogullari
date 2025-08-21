'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProjectStore } from '@/lib/stores/project-store';
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  X, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminEditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { getProjectById, updateProject } = useProjectStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    status: 'ONGOING',
    images: [],
    apartmentInfo: '',
    duplexInfo: '',
    startDate: '',
    endDate: ''
  });

  const [imagePreview, setImagePreview] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [project, setProject] = useState(null);

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects`);
      const result = await response.json();
      
      if (result.success) {
        const projectData = result.data.find(p => p._id === params.id);
        if (projectData) {
          setProject(projectData);
          setFormData({
            title: projectData.title,
            description: projectData.description,
            location: projectData.location,
            status: projectData.status,
            images: projectData.images || [],
            apartmentInfo: projectData.apartmentInfo || '',
            duplexInfo: projectData.duplexInfo || '',
            startDate: projectData.startDate ? new Date(projectData.startDate).toISOString().split('T')[0] : '',
            endDate: projectData.endDate ? new Date(projectData.endDate).toISOString().split('T')[0] : ''
          });
          setImagePreview(projectData.images || []);
        } else {
          router.push('/admin/projects');
        }
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      router.push('/admin/projects');
    }
  }, [params.id, router]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      fetchProject();
    }
  }, [router, fetchProject]);

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Yükleniyor...</p>
      </div>
    </div>;
  }

  if (!project && isAuthenticated) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Proje yükleniyor...</p>
        </div>
      </AdminLayout>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file count
    if (imagePreview.length + files.length > 20) {
      setMessage('En fazla 20 resim yükleyebilirsiniz.');
      return;
    }

    files.forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Sadece resim dosyaları yüklenebilir.');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Resim boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(prev => [...prev, imageUrl]);
        setNewImages(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const imageToRemove = imagePreview[index];
    
    // Eğer mevcut bir resimse (S3 URL), formData'dan kaldır
    if (typeof imageToRemove === 'string' && imageToRemove.startsWith('http')) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      // Yeni eklenen resimse, newImages'tan kaldır
      const originalImagesCount = formData.images.length;
      const newImageIndex = index - originalImagesCount;
      setNewImages(prev => prev.filter((_, i) => i !== newImageIndex));
    }
    
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.location || !formData.startDate) {
        throw new Error('Lütfen tüm zorunlu alanları doldurun.');
      }

      if (formData.status === 'COMPLETED' && !formData.endDate) {
        throw new Error('Tamamlanan projeler için bitiş tarihi zorunludur.');
      }

      if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
        throw new Error('Bitiş tarihi başlangıç tarihinden önce olamaz.');
      }

      if (imagePreview.length === 0) {
        throw new Error('En az bir görsel eklemelisiniz.');
      }

      // Prepare FormData for API
      const submitData = new FormData();
      submitData.append('id', params.id);
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('location', formData.location);
      submitData.append('status', formData.status);
      submitData.append('apartmentInfo', formData.apartmentInfo || '');
      submitData.append('duplexInfo', formData.duplexInfo || '');
      submitData.append('startDate', formData.startDate);
      if (formData.endDate) {
        submitData.append('endDate', formData.endDate);
      }

      // Add new images
      newImages.forEach((file) => {
        submitData.append('images', file);
      });

      // Keep existing images
      submitData.append('keepExistingImages', JSON.stringify(formData.images));

      const response = await fetch('/api/projects', {
        method: 'PUT',
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Proje başarıyla güncellendi!');
        
        // Update project store
        updateProject(params.id, result.data);
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/admin/projects');
        }, 1500);
      } else {
        throw new Error(result.error || 'Proje güncellenemedi');
      }

    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proje Düzenle</h1>
            <p className="text-gray-600">&quot;{project.title}&quot; projesini düzenleyin</p>
          </div>
          <Button variant="outline">
            <Link href="/admin/projects" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Link>
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Proje Detayları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proje Başlığı *
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Proje başlığını girin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konum *
                  </label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Örn: İstanbul, Beşiktaş"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proje Durumu *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="ONGOING">Devam Ediyor</option>
                    <option value="COMPLETED">Tamamlandı</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proje Açıklaması *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Proje hakkında detaylı açıklama yazın..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daire Bilgisi
                  </label>
                  <Input
                    name="apartmentInfo"
                    value={formData.apartmentInfo}
                    onChange={handleInputChange}
                    placeholder="Örn: 3+1, 120m², 2. kat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dubleks Bilgisi
                  </label>
                  <Input
                    name="duplexInfo"
                    value={formData.duplexInfo}
                    onChange={handleInputChange}
                    placeholder="Örn: 4+1, 180m², çatı katı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlangıç Tarihi *
                  </label>
                  <Input
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {formData.status === 'COMPLETED' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bitiş Tarihi *
                    </label>
                    <Input
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Proje Görselleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600 mb-2">
                        Yeni görseller eklemek için tıklayın
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF desteklenir
                      </p>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {imagePreview.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image}
                            alt={`Preview ${index + 1}`}
                            width={200}
                            height={128}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
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
                              fontWeight: 'bold'
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
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>


          {/* Message */}
          {message && (
            <Card>
              <CardContent className="p-4">
                <div className={`flex items-center ${
                  message.includes('başarıyla') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {message.includes('başarıyla') ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  <span>{message}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Güncelleniyor...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Değişiklikleri Kaydet
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}