'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, User, Lock, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Store JWT token
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminUser', JSON.stringify(result.admin));
        router.push('/admin');
      } else {
        setError(result.error || 'Giriş başarısız!');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    }
    
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-white text-black hover:bg-gray-100 border border-gray-300">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Yönetim Paneli
            </CardTitle>
            <p className="text-gray-600">
              Kahramanoğulları İnşaat Admin Girişi
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="pl-10"
                    placeholder="Kullanıcı adınızı girin"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-10"
                    placeholder="Şifrenizi girin"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </Button>
              
              {/* Forgot Password Link */}
              <div className="mt-4 text-center">
                <Link 
                  href="/admin/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Şifremi unuttum
                </Link>
              </div>
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}