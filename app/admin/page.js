'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/lib/stores/project-store';
import { 
  Building, 
  CheckCircle, 
  Clock, 
  Plus, 
  TrendingUp,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { getAllProjects, getCompletedProjects, getOngoingProjects, fetchProjects, isLoading } = useProjectStore();
  
  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      // Fetch projects when authenticated
      fetchProjects();
    }
  }, [router, fetchProjects]);

  if (!isAuthenticated || isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Yükleniyor...</p>
      </div>
    </div>;
  }

  const allProjects = getAllProjects();
  const completedProjects = getCompletedProjects();
  const ongoingProjects = getOngoingProjects();

  // Calculate stats
  const stats = [
    {
      name: 'Toplam Proje',
      value: allProjects.length,
      icon: Building,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Tamamlanan',
      value: completedProjects.length,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      name: 'Devam Eden',
      value: ongoingProjects.length,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Tamamlanma Oranı',
      value: allProjects.length > 0 ? `${Math.round((completedProjects.length / allProjects.length) * 100)}%` : '0%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+2%',
      changeType: 'positive'
    }
  ];

  const recentProjects = [...allProjects]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Proje yönetimi ve istatistikler</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">son aydan</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Son Güncellemeler
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentProjects.length > 0 ? (
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === 'COMPLETED' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status === 'COMPLETED' ? 'Tamamlandı' : 'Devam Ediyor'}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            {new Date(project.updatedAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Link href={`/admin/projects/edit/${project.id}`}>
                          Düzenle
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz proje bulunmuyor</h4>
                  <p className="text-gray-600 mb-4">İlk projenizi ekleyerek başlayın.</p>
                  <Button>
                    <Link href="/admin/projects/new" className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Proje Ekle
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Hızlı İşlemler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Link href="/admin/projects/new" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Proje Ekle
                  </Link>
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Link href="/admin/addresses" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Adres Yönetimi
                  </Link>
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Link href="/admin/company" className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Firma Bilgileri
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Proje Durumu Özeti</CardTitle>
          </CardHeader>
          <CardContent>
            {allProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Tamamlanan Projeler</h4>
                  <div className="space-y-2">
                    {completedProjects.length > 0 ? (
                      completedProjects.slice(0, 3).map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-green-900">{project.title}</span>
                          <span className="text-sm text-green-600">{project.location}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <span className="text-sm text-gray-500">Henüz tamamlanan proje yok</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Devam Eden Projeler</h4>
                  <div className="space-y-2">
                    {ongoingProjects.length > 0 ? (
                      ongoingProjects.slice(0, 3).map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <span className="text-sm font-medium text-yellow-900">{project.title}</span>
                          <span className="text-sm text-yellow-600">{project.location}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <span className="text-sm text-gray-500">Henüz devam eden proje yok</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz proje bulunmuyor</h4>
                <p className="text-gray-600 mb-4">İlk projenizi eklediğinizde burada görünecek.</p>
                <Button>
                  <Link href="/admin/projects/new" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Proje Ekle
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}