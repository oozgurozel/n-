import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Galeri() {
  const [items, setItems] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // 1. Next.js Hydration Hatasını Önlemek İçin (Sadece Client'ta render et)
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('ozgur_medya_galeri');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Veri okuma hatası", e);
      }
    }
  }, []);

  // 2. Verileri Kaydetme
  const saveToLocal = (newItems) => {
    setItems(newItems);
    try {
      localStorage.setItem('ozgur_medya_galeri', JSON.stringify(newItems));
    } catch (e) {
      alert("Tarayıcı depolama alanı doldu! Lütfen eski resimlerden bazılarını silin.");
    }
  };

  // 3. Resmi Sıkıştırma (LocalStorage anında dolmasın diye)
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Fotoğrafı 800px genişliğe küçült
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // %70 kaliteyle JPEG olarak çevir (Boyutu inanılmaz küçültür)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
      };
    });
  };

  // 4. Dosya Seçildiğinde
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Lütfen sadece resim (JPG, PNG) yükleyin.");
      return;
    }

    // Resmi sıkıştır
    const compressedImage = await compressImage(file);
    
    const newItem = {
      id: Date.now(),
      url: compressedImage,
      date: new Date().toLocaleDateString('tr-TR')
    };
    
    saveToLocal([newItem, ...items]);
  };

  const deleteItem = (id) => {
    if(confirm("Bu resmi kalıcı olarak silmek istiyor musun?")) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocal(filtered);
      setSelectedItem(null);
    }
  };

  // Next.js sunucu tarafı renderını engelle
  if (!isMounted) return null;

  return (
    <div className="app-wrapper">
      <Head>
        <title>Medya Arşivi</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* Üst Bar */}
      <nav className="glass-nav">
        <h2 style={{ margin: 0, flex: 1, fontSize: '1.2rem' }}>📸 Galerim</h2>
        
        <label className="upload-fab">
          <span>+</span>
          <input type="file" accept="image/*" hidden onChange={handleFile} />
        </label>
      </nav>

      <main className="content">
        <div className="header-section">
          <h1>Anı Arşivi</h1>
          <p>{items.length} resim saklanıyor</p>
        </div>

        <div className="media-grid">
          {items.length === 0 ? (
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
        .app-wrapper { 
          min-height: 100vh; background: #020617; color: white; 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .glass-nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 15px 20px; background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .upload-fab {
          width: 44px; height: 44px; background: #3b82f6; border-radius: 15px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; cursor: pointer; box-shadow: 0 4px 15px rgba(59,130,246,0.3);
          transition: transform 0.2s;
        }
        .upload-fab:hover { transform: scale(1.05); }

        .content { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header-section { margin-bottom: 25px; }
        .header-section h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 5px; }
        .header-section p { color: #64748b; font-size: 0.9rem; }

        .media-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 15px;
        }

        .media-card {
          border-radius: 18px; overflow: hidden; aspect-ratio: 1; 
          background: #0f172a; cursor: pointer; transition: transform 0.2s; 
          border: 1px solid rgba(255,255,255,0.05);
        }
        .media-card:active { transform: scale(0.96); }
        .media-card img { width: 100%; height: 100%; object-fit: cover; }

        .modal-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.95);
          z-index: 1000; display: flex; align-items: center; justify-content: center;
          padding: 15px; backdrop-filter: blur(5px);
        }
        .modal-content {
          width: 100%; max-width: 500px; background: #0f172a;
          border-radius: 30px; overflow: hidden; position: relative;
        }
        .viewer-area { width: 100%; min-height: 300px; background: black; display: flex; align-items: center; }
        .full-media { width: 100%; height: auto; max-height: 70vh; margin: 0 auto; display: block; }

        .modal-actions {
          padding: 20px; display: flex; justify-content: space-between; align-items: center;
        }
        .info small { color: #94a3b8; }

        .del-btn { background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 12px; font-weight: bold; cursor: pointer; }
        .close-btn { position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.5); color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; }

        .empty-state { grid-column: 1/-1; text-align: center; padding: 50px; color: #475569; border: 2px dashed #1e293b; border-radius: 20px; }

        @media (max-width: 600px) {
          .media-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
        }
      `}</style>
    </div>
  );
}