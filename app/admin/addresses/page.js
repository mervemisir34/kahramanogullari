'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    title: 'Firma Adresi',
    street: '',
    neighborhood: '',
    buildingInfo: '',
    district: '',
    city: '',
    fullAddress: ''
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/admin/addresses');
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setAddresses(data.data);
        const address = data.data[0];
        setEditingAddress(address);
        setFormData({
          title: address.title,
          street: address.street,
          neighborhood: address.neighborhood,
          buildingInfo: address.buildingInfo || '',
          district: address.district,
          city: address.city,
          fullAddress: address.fullAddress
        });
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const addressToUpdate = editingAddress || addresses[0];
      const url = `/api/admin/addresses/${addressToUpdate._id}`;
      const method = 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        fetchAddresses();
        setNotification({ 
          show: true, 
          message: 'Adres başarıyla güncellendi!', 
          type: 'success' 
        });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      } else {
        setNotification({ 
          show: true, 
          message: 'Güncelleme sırasında bir hata oluştu!', 
          type: 'error' 
        });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      setNotification({ 
        show: true, 
        message: 'Güncelleme sırasında bir hata oluştu!', 
        type: 'error' 
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    }
  };



  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Adres Yönetimi</h1>
        </div>

        {(editingAddress || addresses.length > 0) && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Adres Bilgilerini Güncelle
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Başlık</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="neighborhood">Mahalle</Label>
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="street">Cadde/Sokak</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="buildingInfo">Bina/Daire Bilgisi</Label>
                  <Input
                    id="buildingInfo"
                    name="buildingInfo"
                    value={formData.buildingInfo}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="district">İlçe</Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">İl</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="fullAddress">Tam Adres</Label>
                <Textarea
                  id="fullAddress"
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  required
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  Güncelle
                </Button>
              </div>
            </form>
          </Card>
        )}

        {!editingAddress && addresses.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">Adres bulunamadı. Lütfen önce bir adres oluşturun.</p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}