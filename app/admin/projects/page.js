'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useProjectStore } from '@/lib/stores/project-store';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  CheckCircle,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function AdminProjectsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { projects, pagination, deleteProject, fetchProjects } = useProjectStore();
  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      loadProjects(1, statusFilter === 'ALL' ? null : statusFilter);
    }
  }, [router]);

  const loadProjects = async (page = 1, status = null, append = false) => {
    if (!append) setIsLoadingMore(true);
    await fetchProjects({ 
      page, 
      limit: 12, 
      status, 
      append 
    });
    setCurrentPage(page);
    setIsLoadingMore(false);
  };

  const handleStatusFilter = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
    const filterValue = newStatus === 'ALL' ? null : newStatus;
    loadProjects(1, filterValue, false);
  };

  const loadMoreProjects = () => {
    if (pagination?.hasMore && !isLoadingMore) {
      const nextPage = currentPage + 1;
      const filterValue = statusFilter === 'ALL' ? null : statusFilter;
      loadProjects(nextPage, filterValue, true);
    }
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Yükleniyor...</p>
      </div>
    </div>;
  }

  const allProjects = projects;
  
  // Filter projects based on search and status
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Projeyi sil?',
      html: `<strong>"${title}"</strong> projesini silmek istediğinizden emin misiniz?<br><br>Bu işlem <strong>geri alınamaz</strong> ve proje ile birlikte tüm görseller de silinecektir.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'İptal',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        // Loading göster
        Swal.fire({
          title: 'Siliniyor...',
          text: 'Proje ve görseller siliniyor, lütfen bekleyin.',
          icon: 'info',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const deleteResult = await deleteProject(id);
        
        if (deleteResult.success) {
          Swal.fire({
            title: 'Başarılı!',
            text: 'Proje başarıyla silindi.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: 'Hata!',
            text: 'Proje silinirken bir hata oluştu: ' + deleteResult.error,
            icon: 'error'
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Hata!',
          text: 'Proje silinirken bir hata oluştu: ' + error.message,
          icon: 'error'
        });
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projeler</h1>
            <p className="text-gray-600">Tüm projelerinizi yönetin</p>
          </div>
          <Button>
            <Link href="/admin/projects/new" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Proje
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Proje adı veya konum ile ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">Tüm Durumlar</option>
                  <option value="COMPLETED">Tamamlanan</option>
                  <option value="ONGOING">Devam Eden</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant={project.status === 'COMPLETED' ? 'default' : 'secondary'}>
                    {project.status === 'COMPLETED' ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Tamamlandı
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        Devam Ediyor
                      </>
                    )}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Link href={`/admin/projects/edit/${project.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(project.id, project.title)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(project.updatedAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {project.images.length} görsel
                  </span>
                  <Button variant="outline" size="sm">
                    <Link href={`/projects/${project.slug}`} target="_blank">
                      Önizle
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Proje bulunamadı
                </h3>
                <p className="text-gray-600 mb-6">
                  Arama kriterlerinize uygun proje bulunamadı. Farklı terimler deneyin.
                </p>
                <Button>
                  <Link href="/admin/projects/new" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    İlk Projeyi Ekle
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Load More Button */}
        {pagination?.hasMore && (
          <div className="text-center">
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

        {/* Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{pagination?.totalItems || allProjects.length}</div>
                <div className="text-sm text-gray-500">Toplam Proje</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {allProjects.filter(p => p.status === 'COMPLETED').length}
                </div>
                <div className="text-sm text-gray-500">Tamamlanan</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {allProjects.filter(p => p.status === 'ONGOING').length}
                </div>
                <div className="text-sm text-gray-500">Devam Eden</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{filteredProjects.length}</div>
                <div className="text-sm text-gray-500">Görüntülenen</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}