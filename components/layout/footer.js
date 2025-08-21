'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const response = await fetch('/api/company');
      const data = await response.json();
      if (data.success && data.data) {
        setCompany(data.data);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {loading ? 'Kahramanoğulları İnşaat' : company?.companyName || 'Kahramanoğulları İnşaat'}
            </h3>
            <p className="text-gray-300 mb-4">
  
                1990 yılından beri Avcılar ,Yeşilköy ve Bakırköy' de  güvenilir inşaat çözümleri sunuyoruz.
             
            </p>
            <p className="text-gray-400 text-sm">
              © 2025 {company?.companyName || 'Kahramanoğulları İnşaat'}. Tüm hakları saklıdır.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hizmetlerimiz</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Konut Projeleri</li>
              <li>Ticari Binalar</li>
              <li>Ofis Kompleksleri</li>
              <li>Tadilat & Renovasyon</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <div className="space-y-2 text-gray-300">
              {loading ? (
                <>
                  <p>0212 590 54 50</p>
                  <p>kahramanogullariinsaattt@gmail.com</p>
                  <p>Adres yükleniyor...</p>
                </>
              ) : company ? (
                <>
                  <p>{company.phone || '0212 590 54 50'}</p>
                  <p>{company.email || 'kahramanogullariinsaattt@gmail.com'}</p>
                  {company.addressId && (
                    <p>{company.addressId.district}, {company.addressId.city}</p>
                  )}
                </>
              ) : (
                <>
                  <p>0212 590 54 50</p>
                  <p>kahramanogullariinsaattt@gmail.com</p>
                  <p>Avcılar, İstanbul</p>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}