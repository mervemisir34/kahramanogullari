'use client';

import { useState, useEffect } from 'react';
import { Building, Users, Award, Target, Clock, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useProjectStore } from '@/lib/stores/project-store';

export default function HakkimizdaPage() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getAllProjects, getCompletedProjects, getOngoingProjects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchCompanyData();
    fetchProjects();
  }, [fetchProjects]);

  const fetchCompanyData = async () => {
    try {
      const response = await fetch('/api/admin/company');
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
    <div className="min-h-screen bg-gray-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-green-500/20 text-green-100 px-4 py-2 rounded-full text-sm font-medium mb-4">
              ℹ️ Şirket Bilgileri
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Hakkımızda
            </h1>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              {loading ? (
                'Veri yükleniyor...'
              ) : company ? (
                `Güvenilir inşaat çözümleri sunuyoruz.`
              ) : (
                'Güvenilir inşaat çözümleri sunuyoruz.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <div className="py-16 bg-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Şirket Hikayemiz
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {loading ? (
                'Veri yükleniyor...'
              ) : company ? (
                'İnşaat sektöründe güvenilir hizmet veriyoruz.'
              ) : (
                'İnşaat sektöründe güvenilir hizmet veriyoruz.'
              )}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                {loading ? (
                  <div className="text-gray-700 leading-relaxed">
                    Veri yükleniyor...
                  </div>
                ) : company?.about ? (
                  <div className="text-gray-700 leading-relaxed">
                    {company.about.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-700 leading-relaxed">
                    <p className="mb-4">
                      Kahramanoğulları İnşaat olarak, yıllardır inşaat sektöründe kaliteli hizmet sunmaktan gurur duyuyoruz. 
                      Müşterilerimizin memnuniyetini ön planda tutarak, her projemizde en yüksek standartlarda çalışmalar gerçekleştirmekteyiz.
                    </p>
                    <p className="mb-4">
                      Deneyimli ekibimiz ve modern teknolojimizle, konut projelerinden ticari yapılara kadar 
                      geniş bir yelpazede hizmet vermekteyiz. Her projede güvenlik, kalite ve zamanında teslimat 
                      ilkelerimizden taviz vermiyoruz.
                    </p>
                    <p>
                      Müşterilerimizin hayallerini gerçekleştirmek için çalışıyor, her projemizde fark yaratan 
                      çözümler üretiyoruz. Güvenilir ortaklığımızla inşaat ihtiyaçlarınızda yanınızdayız.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {getCompletedProjects().length}
                  </div>
                  <div className="text-gray-600 text-sm">Tamamlanan Proje</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {getOngoingProjects().length}
                  </div>
                  <div className="text-gray-600 text-sm">Devam Eden Proje</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">30+</div>
                  <div className="text-gray-600 text-sm">Yıl Deneyim</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission and Vision */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Misyonumuz</h3>
              <p className="text-gray-700 leading-relaxed">
                En yüksek kalite standartlarında, çevreye duyarlı ve sürdürülebilir yapılar inşa ederek 
                müşterilerimizin hayallerini gerçekleştirmek. İnnovatif çözümler ve deneyimli ekibimizle 
                sektörde öncü olmak ve Türkiye'nin gelişimine katkı sağlamak.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Vizyonumuz</h3>
              <p className="text-gray-700 leading-relaxed">
                Türkiye'nin en güvenilir ve tercih edilen inşaat firması olmak. Teknolojik yenilikleri 
                takip ederek, çevreye saygılı ve sürdürülebilir projeler geliştirmek. Müşteri memnuniyetini 
                en üst seviyede tutarak sektörde lider konumumuzu sürdürmek.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16 bg-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Değerlerimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Çalışma prensiplerimiz ve değerlerimiz her projemizde kendini gösterir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Güvenilirlik</h3>
              <p className="text-gray-600 text-sm">
                Sözümüzün arkasında durur, taahhütlerimizi eksiksiz yerine getiririz.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Kalite</h3>
              <p className="text-gray-600 text-sm">
                En yüksek kalite standartlarını benimser, her detayda mükemmelliği hedefleriz.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Zamanında Teslimat</h3>
              <p className="text-gray-600 text-sm">
                Belirlenen sürelere titizlikle uyar, projelerimizi zamanında teslim ederiz.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Uzman Ekibimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Deneyimli ve uzman kadromuzla her projede en iyi sonucu elde etmek için çalışıyoruz.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-gray-600">
              Veri yükleniyor...
            </div>
          ) : company?.teamMembers && company.teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {company.teamMembers
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((member, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
                  <div className="text-4xl mb-4">👨‍💼</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{member.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {member.position}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Ekip bilgileri henüz eklenmedi</h4>
              <p className="text-gray-600">Ekip üyelerimizin bilgileri yakında burada görünecek.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}