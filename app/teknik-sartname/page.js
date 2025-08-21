'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, User, ArrowRight } from 'lucide-react';

export default function TeknikSartname() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/teknik-sartname');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Teknik şartname kategorileri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 bg-gray-300">
        <Container>
          <div className="text-center bg-gray-300">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 bg-gray-300">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Teknik Şartname
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              İnşaat projelerimizde uyguladığımız teknik standartlar ve kalite kriterlerini 
              bölgelere göre düzenlenmiş kategorilerde inceleyebilirsiniz.
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card 
                  key={category._id} 
                  className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <Link href={`/teknik-sartname/${category.slug}`}>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {category.title}
                        </span>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          {category.updatedBy && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{category.updatedBy}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(category.lastUpdated).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                            Bu kategoride detaylı teknik şartnameler, malzeme özellikleri 
                            ve uygulama standartlarını bulabilirsiniz.
                          </p>
                        </div>
                        
                        <div className="flex items-center text-sm text-primary font-medium group-hover:underline">
                          <span>Detayları görüntüle</span>
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-12">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Henüz Kategori Bulunmuyor
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Teknik şartname kategorileri yakında eklenecektir.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          {categories.length > 0 && (
            <div className="mt-12">
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Kalite Standartlarımız
                    </h3>
                    <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
                      Tüm projelerimizde TSE standartları, yapı denetim kanun hükmünde kararname 
                      ve 2019 Deprem Yönetmenliği (DPY) ile TS 500 standartlarına uygun olarak çalışıyoruz. 
                      Her bölge için özel olarak hazırlanmış teknik şartnamelerimiz, malzeme kalitesi 
                      ve işçilik standartları hakkında detaylı bilgiler içermektedir.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}