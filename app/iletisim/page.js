
'use client';

import { useState, useEffect } from 'react';

export default function IletisimPage() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear form status when user starts typing
    if (formStatus.message) {
      setFormStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setFormStatus({
          type: 'success',
          message: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.'
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          message: ''
        });
      } else {
        setFormStatus({
          type: 'error',
          message: result.error || 'Mesaj gönderilemedi. Lütfen tekrar deneyin.'
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus({
        type: 'error',
        message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-300">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">İletişim Bilgileri</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="text-2xl mr-3">📍</div>
                    <h3 className="font-semibold text-gray-900">Adres</h3>
                  </div>
                  {loading ? (
                    <p className="text-gray-600 text-sm">Adres bilgisi yükleniyor...</p>
                  ) : company?.addressId ? (
                    <p className="text-gray-600 text-sm">
                      {company.addressId.neighborhood}<br />
                      {company.addressId.street} {company.addressId.buildingInfo && company.addressId.buildingInfo}<br />
                      {company.addressId.district}/{company.addressId.city}
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm">
                      Merkez mah. marmara cad.<br />
                      bekir aşçı iş merkezi no:10/23<br />
                      avcılar/istanbul
                    </p>
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="text-2xl mr-3">📞</div>
                    <h3 className="font-semibold text-gray-900">Telefon</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {loading ? (
                      'Telefon bilgisi yükleniyor...'
                    ) : company ? (
                      <>
                        {company.phone && <span>{company.phone}<br /></span>}
                        {company.mobile1 && <span>{company.mobile1}<br /></span>}
                        {company.mobile2 && <span>{company.mobile2}</span>}
                      </>
                    ) : (
                      '0212 590 54 50'
                    )}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="text-2xl mr-3">✉️</div>
                    <h3 className="font-semibold text-gray-900">E-posta</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {loading ? (
                      'E-posta bilgisi yükleniyor...'
                    ) : company?.email ? (
                      company.email
                    ) : (
                      'kahramanogullariinsaattt@gmail.com'
                    )}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="text-2xl mr-3">🕐</div>
                    <h3 className="font-semibold text-gray-900">Çalışma Saatleri</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {loading ? (
                      'Çalışma saatleri yükleniyor...'
                    ) : company?.workingHours ? (
                      company.workingHours
                    ) : (
                      '8.30 - 18.00'
                    )}
                  </p>
                </div>
              </div>

            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">İletişim Formu</h2>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                {/* Form Status Message */}
                {formStatus.message && (
                  <div className={`p-4 rounded-lg mb-6 ${
                    formStatus.type === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center">
                      <div className="mr-2 text-lg">
                        {formStatus.type === 'success' ? '✅' : '❌'}
                      </div>
                      <p className="font-medium">{formStatus.message}</p>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Soyad *
                      </label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Adınızı ve soyadınızı girin"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon *
                      </label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Telefon numaranızı girin"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta *
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="E-posta adresinizi girin"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proje Türü
                    </label>
                    <select 
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Proje türünü seçin</option>
                      <option value="konut">Konut Projesi</option>
                      <option value="ofis">Ofis Binası</option>
                      <option value="ticari">Ticari Bina</option>
                      <option value="sanayi">Sanayi Tesisi</option>
                      <option value="diger">Diğer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mesajınız *
                    </label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Projeniz hakkında detaylı bilgi verebilirsiniz..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className={`w-full py-3 px-6 rounded-lg font-medium text-lg transition-all duration-200 ${
                      submitting 
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Gönderiliyor...
                      </div>
                    ) : (
                      'Mesajı Gönder'
                    )}
                  </button>
                </form>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="text-xl mr-2">💬</div>
                    <span className="font-medium text-gray-900">Ücretsiz Danışmanlık</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Tüm müşterilerimize ücretsiz proje danışmanlığı hizmeti sunuyoruz. 
                    Uzman ekibimiz size en uygun çözümü bulmak için yanınızda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}