'use client';

import { useEffect, useState } from 'react';
import { useProjectStore } from '@/lib/stores/project-store';
import ProjectCard from '@/components/project/project-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export default function ContinueProjectPage() {
  const { projects, pagination, fetchProjects } = useProjectStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  useEffect(() => {
    loadProjects(1);
  }, []);

  const loadProjects = async (page = 1, append = false) => {
    if (!append) setIsLoadingMore(true);
    await fetchProjects({ 
      page, 
      limit: 12, 
      status: 'ONGOING',
      append 
    });
    setCurrentPage(page);
    setIsLoadingMore(false);
  };

  const loadMoreProjects = () => {
    if (pagination?.hasMore && !isLoadingMore) {
      const nextPage = currentPage + 1;
      loadProjects(nextPage, true);
    }
  };
  
  const ongoingProjects = projects.filter(p => p.status === 'ONGOING');

  return (
    <div className="min-h-screen bg-gray-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-green-500/20 text-green-100 px-4 py-2 rounded-full text-sm font-medium mb-4">
              ⏳ Devam Ediyor
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Devam Eden Projeler
            </h1>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              Şu anda üzerinde çalıştığımız {pagination?.totalItems || ongoingProjects.length} projede kalitemizi sürdürüyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {ongoingProjects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ongoingProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            
            {/* Load More Button */}
            {pagination?.hasMore && (
              <div className="mt-12 text-center">
                <Button 
                  onClick={loadMoreProjects}
                  disabled={isLoadingMore}
                  className="min-w-32"
                >
                  {isLoadingMore ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Yükleniyor...
                    </div>
                  ) : (
                    'Daha Fazla Yükle'
                  )}
                </Button>
              </div>
            )}
            
            {/* Results Summary */}
            <div className="mt-12 text-center">
              <p className="text-gray-600">
                Toplam {pagination?.totalItems || ongoingProjects.length} devam eden projeden {ongoingProjects.length} tanesi gösteriliyor
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Şu anda devam eden proje bulunmuyor
              </h3>
              <p className="text-gray-600">
                Devam eden projeler burada görünecek.
              </p>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}