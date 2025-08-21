'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, User, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (!username.trim()) {
      setMessage({ type: 'error', text: 'Kullanıcı adı gerekli' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: result.message
        });
        setUsername(''); // Clear form
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'İşlem başarısız'
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
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
              Şifremi Unuttum
            </CardTitle>
            <p className="text-gray-600">
              Kullanıcı adınızı girin, size şifre sıfırlama linki gönderelim
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Status Message */}
              {message.text && (
                <div className={`p-4 rounded-lg flex items-start ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={`text-sm ${
                    message.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {message.text}
                  </span>
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
                    type="text"
                    required
                    className="pl-10"
                    placeholder="Kullanıcı adınızı girin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading || !username.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gönderiliyor...
                  </div>
                ) : (
                  'Şifre Sıfırlama Linki Gönder'
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link 
                href="/admin/login"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Giriş sayfasına dön
              </Link>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">📧 E-posta gerekli</p>
                  <p>
                    Şifre sıfırlama linki, hesabınızda kayıtlı e-posta adresine gönderilecektir. 
                    E-posta adresiniz yoksa, admin ile iletişime geçin.
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