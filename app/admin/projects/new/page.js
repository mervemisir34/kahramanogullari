'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';
import ProjectForm from '@/components/admin/project-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function AdminNewProjectPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        await Swal.fire({
          title: 'Başarılı!',
          text: 'Proje başarıyla eklendi.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        router.push('/admin/projects');
      } else {
        throw new Error(result.error || 'Proje eklenemedi');
      }
    } catch (error) {
      console.error('Proje ekleme hatası:', error);
      await Swal.fire({
        title: 'Hata!',
        text: error.message || 'Proje eklenirken bir hata oluştu.',
        icon: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Yeni Proje Ekle</h1>
            <p className="text-gray-500 mt-2">
              Yeni bir proje eklemek için aşağıdaki formu doldurun.
            </p>
          </div>
          <Button variant="outline">
            <Link href="/admin/projects" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Link>
          </Button>
        </div>

        <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </AdminLayout>
  );
}