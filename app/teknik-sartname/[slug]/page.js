'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Check } from 'lucide-react';
import Swal from 'sweetalert2';

export default function TeknikSartnameDetail() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // İçeriği işleyerek p ve li taglarına check işareti ekleyen fonksiyon
  const processContent = (htmlContent) => {
    if (!htmlContent) return '';
    
    // p taglarına check işareti ekle
    let processedContent = htmlContent.replace(
      /<p>/g, 
      '<p class="flex items-start gap-2 mb-4"><span class="text-green-600 mt-1 flex-shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 12 2 2 4-4"></path></svg></span><span>'
    );
    
    // p taglarını kapatma
    processedContent = processedContent.replace(/<\/p>/g, '</span></p>');
    
    // li taglarına check işareti ekle
    processedContent = processedContent.replace(
      /<li>/g,
      '<li class="flex items-start gap-2 mb-2"><span class="text-green-600 mt-1 flex-shrink-0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 12 2 2 4-4"></path></svg></span><span>'
    );
    
    // li taglarını kapatma
    processedContent = processedContent.replace(/<\/li>/g, '</span></li>');
    
    return processedContent;
  };

  useEffect(() => {
    const fetchCategory = async () => {
      if (!slug) return;
      
      try {
        const response = await fetch(`/api/teknik-sartname?slug=${slug}`);
        if (response.ok) {
          const data = await response.json();
          setCategory(data);
        } else if (response.status === 404) {
          notFound();
        } else {
          throw new Error('Veri yüklenemedi');
        }
      } catch (error) {
        console.error('Teknik şartname yüklenirken hata:', error);
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Teknik şartname yüklenemedi.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {category.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            İnşaat projeleriniz için detaylı teknik şartname ve kalite standartları
          </p>
        </div>

        {/* Content Card */}
        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle>
              <span className="text-2xl font-semibold">{category.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {category.content ? (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: processContent(category.content) }}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Bu kategoride henüz içerik bulunmuyor.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}