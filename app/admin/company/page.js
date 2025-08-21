'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

export default function CompanyPage() {
  const [company, setCompany] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    companyName: 'Kahramanoğulları İnşaat',
    phone: '0212 590 54 50',
    mobile1: '0536 073 08 48',
    mobile2: '0532 331 13 09',
    email: 'kahramanogullariinsaattt@gmail.com',
    workingHours: '8.30 - 18.00',
    about: '',
    teamMembers: [
      { name: 'Muhsin Köç', position: 'Yönetim Kurulu Başkanı', order: 1 },
      { name: 'Fatih Köç', position: 'İç Mimar', order: 2 },
      { name: 'Elif Cansu Eyüpoğlu', position: 'Yüksek Mimar', order: 3 }
    ],
    addressId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [companyResponse, addressesResponse] = await Promise.all([
        fetch('/api/admin/company'),
        fetch('/api/admin/addresses')
      ]);

      const companyData = await companyResponse.json();
      const addressesData = await addressesResponse.json();

      if (companyData.success && companyData.data) {
        setCompany(companyData.data);
        setFormData({
          companyName: companyData.data.companyName || 'Kahramanoğulları İnşaat',
          phone: companyData.data.phone || '0212 590 54 50',
          mobile1: companyData.data.mobile1 || '0536 073 08 48',
          mobile2: companyData.data.mobile2 || '0532 331 13 09',
          email: companyData.data.email || 'kahramanogullariinsaattt@gmail.com',
          workingHours: companyData.data.workingHours || '8.30 - 18.00',
          about: companyData.data.about || '',
          teamMembers: companyData.data.teamMembers || [
            { name: 'Muhsin Köç', position: 'Yönetim Kurulu Başkanı', order: 1 },
            { name: 'Fatih Köç', position: 'İç Mimar', order: 2 },
            { name: 'Elif Cansu Eyüpoğlu', position: 'Yüksek Mimar', order: 3 }
          ],
          addressId: companyData.data.addressId || ''
        });
      }

      if (addressesData.success) {
        setAddresses(addressesData.data);
        // Auto-assign the first (and only) address
        if (addressesData.data.length > 0) {
          setFormData(prev => ({ ...prev, addressId: addressesData.data[0]._id }));
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const method = company ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/company', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setCompany(data.data);
        setNotification({ 
          show: true, 
          message: 'Firma bilgileri başarıyla kaydedildi!', 
          type: 'success' 
        });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      } else {
        setNotification({ 
          show: true, 
          message: 'Hata: ' + data.error, 
          type: 'error' 
        });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      }
    } catch (error) {
      console.error('Error saving company data:', error);
      setNotification({ 
        show: true, 
        message: 'Kayıt sırasında bir hata oluştu!', 
        type: 'error' 
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedTeamMembers = [...formData.teamMembers];
    updatedTeamMembers[index] = { ...updatedTeamMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, teamMembers: updatedTeamMembers }));
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: '', position: '', order: prev.teamMembers.length + 1 }]
    }));
  };

  const removeTeamMember = (index) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div>Yükleniyor...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <span>{notification.message}</span>
              <button 
                onClick={() => setNotification({ show: false, message: '', type: '' })}
                className="ml-4 text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Firma Bilgileri</h1>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <Label htmlFor="companyName">Firma Adı</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Firma Telefonu</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="mobile1">Cep Telefonu 1</Label>
                <Input
                  id="mobile1"
                  name="mobile1"
                  value={formData.mobile1}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="mobile2">Cep Telefonu 2</Label>
                <Input
                  id="mobile2"
                  name="mobile2"
                  value={formData.mobile2}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Working Hours */}
            <div>
              <Label htmlFor="workingHours">Çalışma Saatleri</Label>
              <Input
                id="workingHours"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleInputChange}
              />
            </div>

            {/* Address Display */}
            {addresses.length > 0 && (
              <div>
                <Label>Firma Adresi</Label>
                <div className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="font-medium">{addresses[0].title}</div>
                  <div className="text-gray-600 text-sm mt-1">
                    {addresses[0].fullAddress}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {addresses[0].district}, {addresses[0].city}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Adres bilgilerini düzenlemek için Adres Yönetimi sayfasını kullanın.
                </p>
              </div>
            )}

            {/* About Section */}
            <div>
              <Label htmlFor="about">Hakkında</Label>
              <Textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                rows={6}
                placeholder="Firma hakkında bilgi..."
              />
            </div>

            {/* Team Members */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Ekip Üyeleri</Label>
                <Button type="button" onClick={addTeamMember} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ekip Üyesi Ekle
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.teamMembers.map((member, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label>İsim</Label>
                      <Input
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                        placeholder="İsim Soyisim"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Pozisyon</Label>
                      <Input
                        value={member.position}
                        onChange={(e) => handleTeamMemberChange(index, 'position', e.target.value)}
                        placeholder="Pozisyon"
                      />
                    </div>
                    <div className="w-20">
                      <Label>Sıra</Label>
                      <Input
                        type="number"
                        value={member.order}
                        onChange={(e) => handleTeamMemberChange(index, 'order', parseInt(e.target.value))}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTeamMember(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>


            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Kaydediliyor...' : 'Firma Bilgilerini Kaydet'}
            </Button>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
}