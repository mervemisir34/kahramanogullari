'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa6';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [teknikSartnameCategories, setTeknikSartnameCategories] = useState([]);
  const dropdownRef = useRef(null);

  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Tamamlanan Projeler', href: '/tamamlanan-projeler' },
    { name: 'Devam Eden Projeler', href: '/devam-eden-projeler' },
    { name: 'Hakkımızda', href: '/hakkimizda' },
    { name: 'İletişim', href: '/iletisim' },
  ];

  useEffect(() => {
    const fetchTeknikSartnameCategories = async () => {
      try {
        const response = await fetch('/api/teknik-sartname');
        if (response.ok) {
          const data = await response.json();
          setTeknikSartnameCategories(data);
        }
      } catch (error) {
        console.error('Teknik şartname kategorileri yüklenemedi:', error);
      }
    };

    fetchTeknikSartnameCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-20">
          
          {/* 1. BÖLÜM: Sol Taraf (Büyük Logo) */}
          <div className="flex-shrink-0 z-10">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <Image
                src="/logo.jpeg"
                alt="Kahraman Mimar"
                width={256}
                height={64}
                className="h-18 w-auto"
                priority
              />
            </Link>
          </div>

          {/* 2. BÖLÜM: Orta Taraf (Navigasyon Menüsü) */}                
          <nav className="hidden md:flex flex-1 justify-center items-center space-x-2 whitespace-nowrap">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? 'text-white bg-gradient-to-r from-green-600 to-green-700 shadow-lg transform scale-105'
                    : 'text-green-600 hover:text-green-700 hover:bg-green-50 hover:shadow-md hover:scale-105'
                }`}
              >
                {item.name}
                {pathname === item.href ? (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-white rounded-full"></div>
                ) : (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-green-500 rounded-full"></div>
                )}
              </Link>
            ))}
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`relative flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  pathname.startsWith('/teknik-sartname')
                    ? 'text-white bg-gradient-to-r from-green-600 to-green-700 shadow-lg transform scale-105'
                    : 'text-green-600 hover:text-green-700 hover:bg-green-50 hover:shadow-md hover:scale-105'
                }`}
              >
                Teknik Şartname
                <ChevronDown 
                  className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
                {pathname.startsWith('/teknik-sartname') ? (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-white rounded-full"></div>
                ) : (
                   <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-green-500 rounded-full"></div>
                )}
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {teknikSartnameCategories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/teknik-sartname/${category.slug}`}
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                      {category.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* 3. BÖLÜM: Sağ Taraf (Sosyal Medya ve Mobil Menü Butonu) */}
          <div className="flex items-center z-10">
            <div className="hidden md:flex items-center space-x-4">
              <a href="https://www.instagram.com/kahramanogullariinsaatt" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700"><FaInstagram className="h-5 w-5" /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700"><FaFacebookF className="h-5 w-5" /></a>
              <a href="https://wa.me/905360730848" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700"><FaWhatsapp className="h-5 w-5" /></a>
            </div>

            <div className="md:hidden ml-4">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 p-2">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobil Navigasyon Paneli */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-3 pt-3 pb-4 space-y-2 border-t bg-gray-50">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                    pathname === item.href
                      ? 'text-white bg-gradient-to-r from-green-600 to-green-700 shadow-lg'
                      : 'text-green-600 hover:text-green-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  {item.name}
                  {pathname === item.href ? (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  ) : (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    </div>
                  )}
                </Link>
              ))}
              
              <div className="pt-2">
                <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Teknik Şartname
                </div>
                {teknikSartnameCategories.length > 0 ? (
                  teknikSartnameCategories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/teknik-sartname/${category.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`relative block px-6 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                        pathname === `/teknik-sartname/${category.slug}`
                          ? 'text-white bg-gradient-to-r from-green-600 to-green-700 shadow-lg'
                          : 'text-green-600 hover:text-green-700 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      {category.title}
                      {pathname === `/teknik-sartname/${category.slug}` ? (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      ) : (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        </div>
                      )}
                    </Link>
                  ))
                ) : (
                  <div className="px-6 py-2 text-sm text-gray-500">
                    Henüz kategori bulunmuyor
                  </div>
                )}
              </div>
              
              <div className="pt-4 mt-4 border-t border-gray-200 flex justify-center space-x-6">
                <a href="https://www.instagram.com/kahramanogullariinsaatt" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700"><FaInstagram size={22} /></a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700"><FaFacebookF size={22} /></a>
                <a href="https://wa.me/905360730848" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700"><FaWhatsapp size={22} /></a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}