'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Plus, 
  Settings, 
  LogOut,
  Building,
  User,
  FileText
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, current: pathname === '/admin' },
    { name: 'Projeler', href: '/admin/projects', icon: FolderOpen, current: pathname === '/admin/projects' },
    { name: 'Teknik Şartname', href: '/admin/teknik-sartname', icon: FileText, current: pathname === '/admin/teknik-sartname' },
    { name: 'Hesap Ayarları', href: '/admin/settings', icon: Settings, current: pathname === '/admin/settings' },
  ];

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Kahramanoğulları İnşaat</h1>
                <p className="text-sm text-gray-500">Yönetim Paneli</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış Yap
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                      item.current
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}