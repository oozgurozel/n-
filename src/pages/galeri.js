import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'; // Geri butonu için ekledim

// SUPABASE BAĞLANTISI
import { supabase } from '@/lib/supabaseClient';

export default function Galeri() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- SUPABASE'DEN RESİMLERİ ÇEK ---
  useEffect(() => {
    setIsMounted(true);
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false }); // En yeniler en üstte

    if (!error && data) {
      // Gelen veriyi senin formatına uyduruyoruz
      const formattedData = data.map(item => ({
        id: item.id,
        url: item.image_url,
        date: new Date(item.created_at).toLocaleDateString('tr-TR')
      }));
      setItems(formattedData);
    }
    setLoading(false);
  };

  // --- RESMİ SIKIŞTIR (BULUTA UYGUN FORMATTA) ---
  const compressImageToBlob = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000; // Bulut olduğu için kaliteyi biraz artırdık
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Blob formatına çevir (Storage'a yüklemek için en uygunudur)
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.8);
        };
      };
    });
  };

  // --- DOSYA SEÇİLDİĞİNDE BULUTA YÜKLE ---
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Lütfen sadece resim (JPG, PNG) yükleyin.");
      return;
    }

    setUploading(true);
    try {
      // 1. Resmi sıkıştır
      const imageBlob = await compressImageToBlob(file);
      
      // 2. Rastgele bir isim oluştur ve Storage'a yükle
      const fileName = `photo_${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, imageBlob, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      // 3. Dosyanın linkini al
      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName);

      // 4. Linki Veritabanına kaydet
      const { error: dbError } = await supabase
        .from('gallery')
        .insert([{ image_url: publicUrl }]);

      if (dbError) throw dbError;

      // Listeyi yenile
      fetchImages();

    } catch (error) {
      alert("Yükleme hatası: " + error.message);
    } finally {
      setUploading(false);
      // Input'u temizle ki aynı resmi tekrar seçebilsin
      e.target.value = null; 
    }
  };

  // --- RESMİ SİL ---
  const deleteItem = async (id) => {
    if(confirm("Bu resmi buluttan kalıcı olarak silmek istiyor musun?")) {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      
      if (!error) {
        setItems(items.filter(i => i.id !== id));
        setSelectedItem(null);
      } else {
        alert("Silinirken bir hata oluştu.");
      }
    }
  };

  if (!isMounted) return null;

  return (
    <div className="app-wrapper">
      <Head>
        <title>Medya Arşivi | Cloud</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* Üst Bar */}
      <nav className="glass-nav">
        {/* Diğer sayfalara uyumlu olması için küçük bir geri butonu ekledim */}
        <button onClick={() => router.push('/anasayfa')} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', marginRight: '15px' }}>
          ←
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: '1.2rem', color: '#3b82f6' }}>📸 Bulut Galeri</h2>
        
        <label className="upload-fab" style={{ opacity: uploading ? 0.5 : 1 }}>
          <span>{uploading ? '⏳' : '+'}</span>
          <input type="file" accept="image/*" hidden onChange={handleFile} disabled={uploading} />
        </label>
      </nav>

      <main className="content">
        <div className="header-section">
          <h1>Anı Arşivi</h1>
          <p>{loading ? 'Yükleniyor...' : `${items.length} anı bulutta güvenle saklanıyor`}</p>
        </div>

        <div className="media-grid">
          {loading ? (
             <div className="empty-state">Fotoğraflar indiriliyor...</div>
          ) : items.length === 0 ? (
            <div className="empty-state">Henüz bir anı eklemedin. Üstteki "+" butonuna tıkla.</div>
          ) : (
            items.map(item => (
              <div key={item.id} className="media-card" onClick={() => setSelectedItem(item)}>
                <img src={item.url} alt="Galeri resmi" loading="lazy" />
              </div>
            ))
          )}
        </div>
      </main>

      {/* Tam Ekran Görüntüleyici Modalı */}
      {selectedItem && (
        <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="viewer-area">
              <img src={selectedItem.url} className="full-media" alt="Tam Ekran" />
            </div>
            
            <div className="modal-actions">
              <div className="info">
                <small>Tarih: {selectedItem.date}</small>
              </div>
              <button className="del-btn" onClick={() => deleteItem(selectedItem.id)}>SİL</button>
            </div>
            <button className="close-btn" onClick={() => setSelectedItem(null)}>✕</button>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Stillerinin hiçbirine dokunmadım, aynı tasarım geçerli */
        .app-wrapper { min-height: 100vh; background: #020617; color: white; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .glass-nav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 15px 20px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .upload-fab { width: 44px; height: 44px; background: #3b82f6; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 15px rgba(59,130,246,0.3); transition: transform 0.2s; }
        .upload-fab:hover { transform: scale(1.05); }
        .content { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header-section { margin-bottom: 25px; }
        .header-section h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 5px; }
        .header-section p { color: #64748b; font-size: 0.9rem; }
        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; }
        .media-card { border-radius: 18px; overflow: hidden; aspect-ratio: 1; background: #0f172a; cursor: pointer; transition: transform 0.2s; border: 1px solid rgba(255,255,255,0.05); }
        .media-card:active { transform: scale(0.96); }
        .media-card img { width: 100%; height: 100%; object-fit: cover; }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 15px; backdrop-filter: blur(5px); }
        .modal-content { width: 100%; max-width: 500px; background: #0f172a; border-radius: 30px; overflow: hidden; position: relative; }
        .viewer-area { width: 100%; min-height: 300px; background: black; display: flex; align-items: center; }
        .full-media { width: 100%; height: auto; max-height: 70vh; margin: 0 auto; display: block; }
        .modal-actions { padding: 20px; display: flex; justify-content: space-between; align-items: center; }
        .info small { color: #94a3b8; }
        .del-btn { background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 12px; font-weight: bold; cursor: pointer; }
        .close-btn { position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.5); color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; }
        .empty-state { grid-column: 1/-1; text-align: center; padding: 50px; color: #475569; border: 2px dashed #1e293b; border-radius: 20px; }
        @media (max-width: 600px) { .media-grid { grid-template-columns: 1fr 1fr; gap: 10px; } }
      `}</style>
    </div>
  );
}