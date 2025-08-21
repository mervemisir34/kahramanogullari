'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useProjectStore } from '@/lib/stores/project-store';

export default function ProjectDetailPage() {
  const params = useParams();
  const { getProjectBySlug, fetchProjects } = useProjectStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    fetchProjects({ limit: 100 }); // Load more projects for slug matching
  }, [fetchProjects]);
  
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Proje Bulunamadı</h2>
          <p className="text-gray-600 mb-8">Aradığınız proje mevcut değil veya kaldırılmış.</p>
          <Link 
            href="/" 
            className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href={project.status === 'COMPLETED' ? '/tamamlanan-projeler' : '/devam-eden-projeler'}
            className="inline-flex items-center text-gray-600 font-medium"
          >
            ← Geri Dön
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={project.images[currentImageIndex]}
                alt={`${project.title} - ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
              
              {/* Navigation Buttons */}
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg"
                  >
                    ›
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {project.images.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {project.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {project.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-20 rounded-md overflow-hidden ${
                      index === currentImageIndex 
                        ? 'ring-2 ring-green-500' 
                        : 'opacity-70'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${project.title} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {project.title}
                </h1>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'COMPLETED' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {project.status === 'COMPLETED' ? '✓ Tamamlandı' : '⏳ Devam Ediyor'}
                </div>
              </div>
              
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Proje Detayları</h3>
              <p className="text-gray-700 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Project Stats */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Proje Bilgileri</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500">Durum</div>
                  <div className="font-bold">
                    {project.status === 'COMPLETED' ? 'Tamamlandı' : 'Devam Ediyor'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Konum</div>
                  <div className="font-bold">{project.location}</div>
                </div>
                
                {project.apartmentInfo && (
                  <div>
                    <div className="text-sm text-gray-500">Daire Bilgisi</div>
                    <div className="font-bold">{project.apartmentInfo}</div>
                  </div>
                )}
                
                {project.duplexInfo && (
                  <div>
                    <div className="text-sm text-gray-500">Dubleks Bilgisi</div>
                    <div className="font-bold">{project.duplexInfo}</div>
                  </div>
                )}
                
                {project.startDate && (
                  <div>
                    <div className="text-sm text-gray-500">Başlangıç Tarihi</div>
                    <div className="font-bold">
                      {new Date(project.startDate).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                )}
                
                {project.endDate && (
                  <div>
                    <div className="text-sm text-gray-500">Bitiş Tarihi</div>
                    <div className="font-bold">
                      {new Date(project.endDate).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Benzer Bir Proje Mi İstiyorsunuz?</h3>
              <p className="text-gray-600 mb-6">
                Bu projeye benzer bir çalışma yaptırmak için bizimle iletişime geçin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/iletisim" 
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium text-center"
                >
                  İletişime Geçin
                </Link>
                <Link 
                  href={project.status === 'COMPLETED' ? '/tamamlanan-projeler' : '/devam-eden-projeler'}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium text-center"
                >
                  Diğer Projeler
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}