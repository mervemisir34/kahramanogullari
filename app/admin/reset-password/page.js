'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (!urlToken) {
      setMessage({
        type: 'error',
        text: 'Geçersiz şifre sıfırlama linki. Yeni link talep edin.'
      });
    } else {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user types
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalı' });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Şifreler eşleşmiyor' });
      setIsLoading(false);
      return;
    }

    if (!token) {
      setMessage({ type: 'error', text: 'Geçersiz token' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: result.message
        });
        
        // Clear form
        setFormData({ newPassword: '', confirmPassword: '' });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/admin/login');
        }, 3000);
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Şifre sıfırlama başarısız'
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage({
        type: 'error',
        text: 'Bağlantı hatası. Lütfen tekrar deneyin.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-white text-black hover:bg-gray-100 border border-gray-300 p-3 rounded-full">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Şifre Sıfırla
            </CardTitle>
            <p className="text-gray-600">
              Yeni şifrenizi belirleyin
            </p>
          </CardHeader>
          
          <CardContent>
            {/* Status Message */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg flex items-start ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                )}
                <div className={`text-sm ${
                  message.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {message.text}
                  {message.type === 'success' && (
                    <p className="mt-2 text-xs">
                      3 saniye sonra giriş sayfasına yönlendirileceksiniz...
                    </p>
                  )}
                </div>
              </div>
            )}

            {token && message.type !== 'success' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Yeni Şifre
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      className="pl-10"
                      placeholder="Yeni şifrenizi girin (min 6 karakter)"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Şifre Tekrarı
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="pl-10"
                      placeholder="Şifrenizi tekrar girin"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Şifre Sıfırlanıyor...
                    </div>
                  ) : (
                    'Şifremi Sıfırla'
                  )}
                </Button>
              </form>
            ) : null}

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link 
                href="/admin/login"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Giriş sayfasına dön
              </Link>
            </div>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">🔒 Güvenlik</p>
                  <p>
                    Şifre sıfırlama linki 1 saat süreyle geçerlidir. 
                    Yeni şifrenizi güvenli bir yerde saklayın.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}