'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, FileText, RotateCcw, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminTeknikSartname() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      fetchCategories();
    }
  }, [router]);

  const defaultContent = `<h1>İNŞAAT İŞLERİ GENEL TEKNİK ŞARTNAMESİ</h1>

<h2>STATİK</h2>

<p>1999 Marmara Depreminden sonra yeni yapılan yapıların denetlenmesi için yapı denetim firmaları kurulmuştur.Yapmaya talip olduğumuz binanızın yapı denetim kanun hükmünde kararname ve 2019 DPY ( Deprem Yönetmenliği ) Ve TS 500 Standartına uygun olarak yapılacaktır.</p>

<p>Temel ve perdede çimento esaslı yapı kimyasalları ile çift kat fileli izolasyon yapılacaktır. <strong>BASF,BETTON,FİXA</strong> markalarından kullanılacaktır.izolasyon detayı perde temizlenecek+çimento esaslı izolasyon yapılacak+3cm eps +drenaj levhası yapılacak.</p>

<p>Temele bohçalama sistemi yapılacak.Hafriyat bittikten sonra drenaj sistemi yapılacak.drenaj sisteminden sonra grobeton dökülecek.Grobetondan sonra tek kat 3mm kalınlıgında polyester keçe taşıyıcılı bitüm esaslı mebran ,mebran üzerine keçe serilip imalata devam edilecek. 3mm Mebran <strong>Onduline,ode,bitutek</strong> markalarından yapılacaktır.</p>

<p>Temele drenaj sistemi yapılacak.Yapıdan su uzaklaştıralacaktır. 2.bodrum perdelerinde sikalı beton dökülecektir.</p>

<p>İnşaatta kullanılan malzemeler TSEK belgeli olacak ve müteahhit firma bu belgeleri istendiğinde ibraz edecektir.</p>

<p>Statik proje zemin etüdü yapıldıktan sonra zeminin özelliklerine uygun olarak tasarlanacak ve tasarım sonucunda çıkan demir tonajının tamamı <strong>İÇDAŞ marka S420a Nervürlü</strong> olarak projeye uygun alınacaktır. Beton sınıfı projelerde genelde C25 olarak gösterilmektedir. Müteahhit firma beton sınıfı <strong>C30</strong> olarak kullanacaktır. Şantiyede Beton öncesi ve Beton atıldıktan sonra Standartlara uygun olarak bakımı tarafımızdan sağlanacaktır.</p>

<p>Kat döşemeleri belediyenin imar mevzuatına göre asmolen döşeme (nervürlü döşeme) veya kirişli döşeme yapılacaktır. Asmolen döşeme olacak ise nervürlü kirişlerin arasına yanmaz EPS asmolen köpük kullanılacaktır.</p>

<h2>BİNANIN DIŞ CEPHESİ</h2>

<p>Binanın üç cephesi betopan arka cephe <strong>TSE 825 ŞARTLARINA GÖRE</strong> mantolama yapılacaktır. Bina üç boyutlu çizimi yapıldıktan sonra onaylanan cephe sözleşmeye konulacaktır</p>

<h3>Montaj detayı</h3>

<ul>
<li>1-Dış cephe kaba sıva</li>
<li>2-Binanın sokak veya cadde cephelerine kismi yerlerine betopan olacak cephede kullanılacak betopan markası <strong>tepe betopan veya hekimboard</strong> olacak.Betopan arkasına kullanılacak yalıtım 4 cm kalınlıgında eps köpük 16 ds yoğunlugunda olacaktır.kaba sıva+4 cm eps+file+kalekim+m profil+betopan+betopan üzerine jotun marka boya uygulanacaktır. Isı yalıtım levhaları taraklama usulü le sıva üzerine yapıştırılacak. Öbekleme usulü ile yapıştırma yapılmayacaktır.</li>
<li>3-Arka cephede yapılacak mantolama detayı kaba sıva+4 cm eps+file+kalekim+ düz dekoratif+<strong>Filli,Marshall,polisan</strong> markalarından biri dış cephe boyası kullanılacak. Isı yalıtım levhaları taraklama usulü le sıva üzerine yapıştırılacak. Öbekleme usulü ile yapıştırma yapılmayacaktır.</li>
<li>4-Arka cephe pencere söveleri 10-15 cm genişliğinde köpük söveler kullanılacaktır.</li>
<li>5-Balkonlar ,Fransızlar,teraslar siyah renk plastik ferforje korkuluk ( dikmeler demir profil ,üst tutamak alüminyum )yapılacaktır.</li>
<li>6-.Balkon silmeleri ,kat silmeleri,ve parapet silmeleri mevcut 3 boyutu çizimdeki kombinasyonu saglamak adına betopan ile detay çözümü bulamadığımız noktalara özel kalıplar yaptırıp strafor yapılacak.Strafor üzerine çelik macun çekip zımbara yapılıp cephe bütünü korunacaktır.</li>
<li>7-Balkon ve çıkma tavanları kaba sıva veya kalekim file+4 cm eps+file+kalekim+düz dekoratif+ boya yapılacaktır. Isı yalıtım levhaları taraklama usulü le sıva üzerine yapıştırılacak. Öbekleme usulü ile yapıştırma yapılmayacaktır.</li>
<li>8- Yağmur olukları ve iniş boruları PVC esaslı olacak, mümkün olduğu kadar niş içinde kalmaları sağlanacaktır. Pvc markası <strong>vesbo,hakan plastik,kalde</strong> markalarında seçilecektir.</li>
</ul>

<h2>BİNANIN ÇATI İMALATI</h2>

<p>Avcılar belediyesinin imar mevzuatına göre Betonarme veya çelik çatı yapılacak.</p>

<h3>Çelik Çatı Montaj Detayı</h3>

<ul>
<li>1-Kullanılacak olacak çelikler min 2 mm kalınlıgında ve tamamı antipas boyalı olacaktır. çeliklerin birleşim yerleri antipas yapılacaktır.Balık sırtı kaynak yapılacaktır.</li>
<li>2-Çelik üzerine <strong>egger,koronosman</strong> markalarından osb kullanılacaktır.</li>
<li>3- Güvercinlikler 3mm kalınlıgında düz mebran üzerine kiremit renginde 4 mm kalınlıgında arduvazlı Mebran yapılacaktır. Mebran markaları <strong>Ondulıne,ode</strong> seçilecektir.</li>
<li>4- osb üzerine 5x5 çıta aralarına 120 yogunluklu mantolama taş yünü kullanılacak.</li>
<li>5-Taş yünü üzerine su yalıtım örtüsü çekilecek.</li>
<li>6-su yalıtım üzerine 3x5 çıta ve çıta üzerine antrasit giri kiremit yapılacaktır.</li>
<li>7-Bina dereleri alüminyum çekme dere yapılacak.Çatının belli yerlerine havalandırma bacaları bırakılacak.</li>
<li>8- Çatıya iki adet merkezi anten sistemi konulacaktır.Türksat ve Hotbird veya digiturk yayın konulacaktır.</li>
</ul>

<p><strong>Not:</strong>Betoname çatı montaj detayı yukarıdaki montaj detaylarıdan bir farkı taşıyıcı çelik yerine beton kullanılmasıdır.Diger montaj detayları aynıdır.</p>

<h2>İÇ MEKANLAR</h2>

<p>Bina bölme duvarları iyi cins kilsan tugla kullanılacak.Dairelerin birleştiği duvarlar sandeviç tuğla yapılacaktır.8,5 tugla+4 cm eps köpük veya 5 cm kanuff mineral plus  +8,5 tuğla</p>

<p>Dairelerin salon, mutfak, köşe spot ışıklı yapılacaktır. Antreler asma tavan spot yapılacaktır.Diğer odalara kartonpiyer yapılacaktır . Odalar ortalama 10 cm, banyolarda 5-7 cm kalınlığında kartonpiyer olacaktır.</p>

<p>Salonlara her iki köşeye projeye göre ve mutfaklara Fransız pencere konulacak. Ve Fransız pencerelerin biri sabit diğeri çift açılımlı olacak.</p>

<p>Fransız pencere olmayan odalarda 150x150 pencere kullanılacak. Bu pencerede bir sabit diğeri çift açılımlı olacak.</p>

<p>Pencere doğramaları <strong>EGE PEN,EURO PEN ,ADOPEN</strong> marka pvc olarak yapılacak ve şişe cam patentli ısıcam takılacaktır.seri 70 lik seri 5 odalı olacaktır. Pencere rengi iç beyaz,dış antrasit gri yapılacaktır.</p>

<p>Denizlikler 3 cm kalınlıgında Muğla mermer yapılacaktır.</p>

<p>Duvarlar karasıva+ alçısıva üzeri saten boya ,tavanlar plastik boya olacaktır.( Boya markaları <strong>filli,marshal,dyo,polisan</strong> arasından seçilecektir.)</p>

<p>Mutfak-antre –balkonlar-teraslar 1.sınıf 60x60 granit kaplama veya seramik yapılacak.<strong>Bien,Çanakkale,seramiksan</strong> markalarından olacaktır. Balkon ve teraslar öncelik kaymaz granit ,veya kaymaz seramik yapılacak.1.kalite olacak.</p>

<p>Teraslar,balkonlar 3 mm kalınlıgında mebran +şap+ çimento esaslı yapı kimyasal yalıtım yapılacktır.( Mebran markaları <strong>Ondulıne,ode</strong> seçilecektir.Çimento esaslı malzeme <strong>BASF,BETTON</strong> markalarından kullanılacaktır)</p>

<p>Salon ve odalarda 8mm Derzli laminat parke yapılacaktır.<strong>Çamsan,agt ,Floorpan</strong> markalarından seçilerek yapılacaktır.süpürgelikler 6cm derzli parke renginde olacaktır.</p>

<p>Banyo,ebeveyn zemin ve duvarlarına seramik yapılacaktır.1.Sınıf <strong>Bien,Çanakkale,seramiksan</strong> markalarından olacaktır.</p>

<p>Banyo ve ebeveynlere <strong>Bien Victoria ,serel</strong> marka gömme rezervuar idevit Samanyolu asma klozet ,bien asma kolozet yapılacaktır.</p>

<h2>KAHRAMANOĞULLARI İNŞAAT</h2>`;

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/teknik-sartname');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Kategoriler yüklenemedi.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewCategory = () => {
    setSelectedCategory(null);
    setTitle('');
    setContent('');
    setIsEditing(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setTitle(category.title);
    setContent(category.content);
    setIsEditing(true);
  };

  const handleDeleteCategory = async (id) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: 'Bu kategori kalıcı olarak silinecek!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/teknik-sartname?id=${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          Swal.fire('Silindi!', 'Kategori başarıyla silindi.', 'success');
          fetchCategories();
          if (selectedCategory?._id === id) {
            setSelectedCategory(null);
            setIsEditing(false);
          }
        } else {
          throw new Error('Silme işlemi başarısız');
        }
      } catch (error) {
        console.error('Silme hatası:', error);
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Kategori silinemedi.'
        });
      }
    }
  };

  const loadDefaultContent = () => {
    Swal.fire({
      title: 'Varsayılan İçeriği Yükle',
      text: 'Mevcut içerik silinecek ve varsayılan teknik şartname yüklenecek. Devam etmek istiyor musunuz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, Yükle',
      cancelButtonText: 'İptal'
    }).then((result) => {
      if (result.isConfirmed) {
        setContent(defaultContent);
        Swal.fire(
          'Yüklendi!',
          'Varsayılan içerik yüklendi.',
          'success'
        );
      }
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Başlık zorunludur.'
      });
      return;
    }

    setSaving(true);
    try {
      const method = selectedCategory ? 'PUT' : 'POST';
      const body = selectedCategory 
        ? {
            id: selectedCategory._id,
            title: title.trim(),
            content,
            updatedBy: 'Admin'
          }
        : {
            title: title.trim(),
            content,
            updatedBy: 'Admin'
          };

      const response = await fetch('/api/teknik-sartname', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          icon: 'success',
          title: 'Başarılı',
          text: selectedCategory ? 'Kategori güncellendi.' : 'Kategori oluşturuldu.'
        });
        
        setIsEditing(false);
        setSelectedCategory(data);
        fetchCategories();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: error.message || 'İşlem tamamlanamadı.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (selectedCategory) {
      setTitle(selectedCategory.title);
      setContent(selectedCategory.content);
    } else {
      setTitle('');
      setContent('');
      setSelectedCategory(null);
    }
  };

  const insertFormatting = (format) => {
    const textarea = document.getElementById('content-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `<strong>${selectedText || 'Kalın metin'}</strong>`;
        break;
      case 'h1':
        formattedText = `<h1>${selectedText || 'Başlık 1'}</h1>`;
        break;
      case 'h2':
        formattedText = `<h2>${selectedText || 'Başlık 2'}</h2>`;
        break;
      case 'h3':
        formattedText = `<h3>${selectedText || 'Başlık 3'}</h3>`;
        break;
      case 'p':
        formattedText = `<p>${selectedText || 'Paragraf'}</p>`;
        break;
      case 'br':
        formattedText = '<br>';
        break;
      case 'ul':
        formattedText = `<ul><li>${selectedText || 'Liste öğesi'}</li></ul>`;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + formattedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 10);
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Teknik Şartname Yönetimi</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Teknik şartname kategorilerini yönetin ve düzenleyin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kategoriler Listesi */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Kategoriler
                  <Button
                    onClick={handleNewCategory}
                    className="flex items-center gap-2"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    Yeni
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Henüz kategori bulunmuyor.
                    </p>
                  ) : (
                    categories.map((category) => (
                      <div
                        key={category._id}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedCategory?._id === category._id ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => {
                          if (!isEditing) {
                            setSelectedCategory(category);
                            setTitle(category.title);
                            setContent(category.content);
                          }
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm">{category.title}</h4>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCategory(category);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(category._id);
                              }}
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Son güncelleme: {new Date(category.lastUpdated).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* İçerik Düzenleme */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {isEditing ? (selectedCategory ? 'Kategori Düzenle' : 'Yeni Kategori') : 'Kategori Görüntüle'}
                  {selectedCategory && !isEditing && (
                    <Button
                      variant="outline"
                      onClick={loadDefaultContent}
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Varsayılan İçerik
                    </Button>
                  )}
                </CardTitle>
                
                {isEditing && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => insertFormatting('bold')}
                    >
                      <strong>Kalın</strong>
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => insertFormatting('h1')}
                    >
                      Başlık 1
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => insertFormatting('h2')}
                    >
                      Başlık 2
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => insertFormatting('h3')}
                    >
                      Başlık 3
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => insertFormatting('p')}
                    >
                      Paragraf
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => insertFormatting('ul')}
                    >
                      Liste
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => insertFormatting('br')}
                    >
                      Satır Atla
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {(selectedCategory || isEditing) ? (
                  <div className="space-y-4">
                    {isEditing && (
                      <div>
                        <label htmlFor="title-input" className="block text-sm font-medium mb-2">
                          Kategori Başlığı
                        </label>
                        <Input
                          id="title-input"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Örnek: Avcılar Teknik Şartname"
                          className="w-full"
                        />
                      </div>
                    )}
                    
                    {!isEditing && selectedCategory && (
                      <div className="mb-4">
                        <h2 className="text-xl font-semibold">{selectedCategory.title}</h2>
                        <p className="text-sm text-gray-500">
                          Son güncelleme: {new Date(selectedCategory.lastUpdated).toLocaleDateString('tr-TR')} - {selectedCategory.updatedBy}
                        </p>
                      </div>
                    )}

                    <div>
                      <label htmlFor="content-textarea" className="block text-sm font-medium mb-2">
                        İçerik {isEditing && '(HTML formatında)'}
                      </label>
                      {isEditing ? (
                        <textarea
                          id="content-textarea"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                          placeholder="Teknik şartname içeriğini HTML formatında yazın..."
                        />
                      ) : (
                        <div 
                          className="prose max-w-none p-4 border border-gray-200 rounded-lg bg-gray-50 min-h-32"
                          dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-500">İçerik bulunmuyor...</p>' }}
                        />
                      )}
                    </div>

                    {isEditing && (
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-semibold mb-4">Önizleme</h3>
                        <div 
                          className="prose max-w-none p-4 border border-gray-200 rounded-lg bg-gray-50 min-h-32"
                          dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-500">İçerik önizlemesi burada görünecek...</p>' }}
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                      {isEditing ? (
                        <>
                          <Button 
                            variant="outline"
                            onClick={handleCancel}
                            disabled={saving}
                          >
                            İptal
                          </Button>
                          <Button 
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2"
                          >
                            <Save className="h-4 w-4" />
                            {saving ? 'Kaydediliyor...' : 'Kaydet'}
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={() => handleEditCategory(selectedCategory)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Düzenle
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Görüntülemek için bir kategori seçin veya yeni kategori oluşturun.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}