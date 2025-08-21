'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useProjectStore } from '@/lib/stores/project-store';
import ProjectCard from '@/components/project/project-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { ArrowRight, Building, Users, Award, Shield, Clock } from 'lucide-react';

export default function Home() {
  const { getAllProjects, getCompletedProjects, getOngoingProjects, fetchHomepageProjects, fetchStats, getStats } = useProjectStore();
  
  useEffect(() => {
    fetchHomepageProjects();
    fetchStats();
  }, [fetchHomepageProjects, fetchStats]);
  
  const completedProjects = getCompletedProjects();
  const ongoingProjects = getOngoingProjects();
  const stats = getStats();
  
  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="relative py-8 min-h-[500px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/heroimage.jpeg')" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            <div className="inline-flex items-center bg-green-500/20 text-green-100 px-4 py-2 rounded-full text-sm font-medium mb-4">
              🏗️ İnşaat Çözümleri
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Güvenilir İnşaat Çözümleri
            </h1>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              30+ yıllık deneyimimizle konut, ofis ve ticari projelerinizde 
              kaliteli ve güvenilir hizmet sunmaktayız.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-gray-300">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Projelerimiz</h2>
          </div>

          {/* Completed Projects */}
          <div className="mb-16">
            {completedProjects.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {completedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
                <div className="text-center">
                  <Link 
                    href="/tamamlanan-projeler" 
                    className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg text-sm font-medium"
                  >
                     Tamamlanan Tüm Projeleri Görüntüle
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </>
            ) : (
              <Card className="p-8 text-center bg-gray-50">
                <CardContent>
                  <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz tamamlanan proje bulunmuyor</h4>
                  <p className="text-gray-600">İlk projeniz tamamlandığında burada görünecektir.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Ongoing Projects */}
          <h2 className="text-2xl font-bold text-foreground mb-4">Devam Eden Projeler</h2>
          <div>
            {ongoingProjects.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {ongoingProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
                <div className="text-center">
                  <Link 
                    href="/devam-eden-projeler" 
                    className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg text-sm font-medium"
                  >
                    Devam Eden Tüm Projeleri Görüntüle
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </>
            ) : (
              <Card className="p-8 text-center bg-gray-50">
                <CardContent>
                  <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz devam eden proje bulunmuyor</h4>
                  <p className="text-gray-600">Yeni projeleriniz başladığında burada görünecektir.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-100">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.totalProjects}</div>
              <div className="text-sm text-muted-foreground mt-1">Proje</div>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground mt-1">Mutlu Müşteri</div>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">30+</div>
              <div className="text-sm text-muted-foreground mt-1">Yıl Deneyim</div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Projeniz İçin Bizimle İletişime Geçin
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Deneyimli ekibimizle hayalinizdeki projeyi gerçekleştirin. 
              Ücretsiz keşif ve danışmanlık hizmeti sunuyoruz.
            </p>
            <div className="flex justify-center">
              <Link 
                href="/iletisim"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg text-sm font-medium"
              >
                Ücretsiz Teklif Al
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}