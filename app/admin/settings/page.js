'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      setFormData(prev => ({
        ...prev,
        username: userData.username || '',
        email: userData.email || ''
      }));
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Validate passwords if changing
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Yeni şifre en az 6 karakter olmalı' });
        setIsLoading(false);
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor' });
        setIsLoading(false);
        return;
      }

      if (!formData.currentPassword) {
        setMessage({ type: 'error', text: 'Şifre değiştirmek için mevcut şifrenizi girin' });
        setIsLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('adminToken');
      const updateData = {
        id: currentUser.id,
        username: formData.username,
        email: formData.email || null
      };

      // Add password fields if changing password
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (result.success) {
        // Update localStorage with new user data
        localStorage.setItem('adminUser', JSON.stringify(result.data));
        setCurrentUser(result.data);
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));

        // Show success message
        setMessage({ 
          type: 'success', 
          text: 'Bilgileriniz başarıyla güncellendi!' 
        });

        // Show success popup
        Swal.fire({
          title: 'Başarılı!',
          text: 'Admin bilgileriniz güncellendi.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

      } else {
        setMessage({ type: 'error', text: result.error || 'Güncelleme başarısız' });
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessage({ type: 'error', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Yükleniyor...</p>
      </div>
    </div>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hesap Ayarları</h1>
          <p className="text-gray-600">Admin hesap bilgilerinizi yönetin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Mevcut Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Kullanıcı Adı:</span>
                    <p className="text-gray-900 font-medium">{currentUser?.username}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">E-posta:</span>
                    <p className="text-gray-900">{currentUser?.email || 'Belirtilmemiş'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Son Giriş:</span>
                    <p className="text-gray-900">
                      {currentUser?.lastLogin 
                        ? new Date(currentUser.lastLogin).toLocaleString('tr-TR')
                        : 'İlk giriş'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Save className="h-5 w-5 mr-2" />
                Bilgileri Düzenle
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Status Message */}
              {message.text && (
                <div className={`mb-6 p-4 rounded-lg flex items-center ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  <span className="font-medium">{message.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="username">Kullanıcı Adı *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="pl-10"
                      placeholder="Kullanıcı adınız"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="pl-10"
                      placeholder="E-posta adresiniz"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <hr className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Şifre Değiştir</h3>
                  <p className="text-sm text-gray-600">
                    Şifrenizi değiştirmek istiyorsanız aşağıdaki alanları doldurun
                  </p>

                  <div>
                    <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        className="pl-10"
                        placeholder="Mevcut şifreniz"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">Yeni Şifre</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        className="pl-10"
                        placeholder="Yeni şifreniz (min 6 karakter)"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="pl-10"
                        placeholder="Yeni şifrenizi tekrar girin"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Güncelleniyor...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Değişiklikleri Kaydet
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}