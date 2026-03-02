import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function AniDefteri() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [entries, setEntries] = useState([]);
  
  // Arayüz durumları
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Form durumları
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  // 1. Next.js Hydration Hatasını Önlemek İçin
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('ozgur_ani_defteri');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Veri okuma hatası", e);
      }
    }
    // Bugünü varsayılan tarih yap
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  // 2. Verileri Kaydetme
  const saveToLocal = (newEntries) => {
    setEntries(newEntries);
    try {
      localStorage.setItem('ozgur_ani_defteri', JSON.stringify(newEntries));
    } catch (e) {
      alert("Tarayıcı depolama alanı doldu! Lütfen eski anılardan bazılarını silin.");
    }
  };

  // 3. Resmi Sıkıştırma (LocalStorage dolmasın diye)
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          let scaleSize = 1;
          if (img.width > MAX_WIDTH) {
            scaleSize = MAX_WIDTH / img.width;
          }
          canvas.width = img.width * scaleSize;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
      };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Lütfen sadece resim (JPG, PNG) yükleyin.");
      return;
    }
    const compressedImage = await compressImage(file);
    setImage(compressedImage);
  };

  // 4. Formu Gönderme
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Lütfen başlık ve içerik alanlarını doldurun.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      date,
      title,
      content,
      image
    };

    // Yeni anıyı en başa ekle
    const sortedEntries = [newEntry, ...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    saveToLocal(sortedEntries);
    
    // Formu temizle ve kapat
    setTitle('');
    setContent('');
    setImage(null);
    setShowForm(false);
  };

  // 5. Anı Silme
  const deleteEntry = (id) => {
    if(confirm("Bu anıyı kalıcı olarak silmek istiyor musun?")) {
      const filtered = entries.filter(e => e.id !== id);
      saveToLocal(filtered);
      setSelectedEntry(null);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="diary-wrapper">
      <Head>
        <title>Anı Defteri</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Üst Bar */}
      <nav className="glass-nav">
        <button className="nav-btn" onClick={() => router.push('/anasayfa')}>
          <span>←</span> <span className="hide-mobile">Ana Menü</span>
        </button>
        <h2 className="nav-title">📓 Anı Defteri</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'İptal' : '+ Yeni Anı'}
        </button>
      </nav>

      <main className="content">
        {/* Yeni Anı Ekleme Formu */}
        {showForm ? (
          <div className="form-card">
            <h3>Yeni Bir Anı Yaz</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Tarih</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Konu / Başlık</label>
                <input type="text" placeholder="Bugün neler oldu?" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Anını Anlat</label>
                <textarea rows="6" placeholder="Bütün detaylarıyla yazabilirsin..." value={content} onChange={e => setContent(e.target.value)} required></textarea>
              </div>
              
              <div className="image-upload-section">
                <label className="image-upload-btn">
                  📸 {image ? 'Resim Değiştir' : 'Anıya Resim Ekle'}
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                </label>
                {image && <img src={image} alt="Önizleme" className="preview-img" />}
              </div>

              <button type="submit" className="save-btn">Anıyı Kaydet</button>
            </form>
          </div>
        ) : (
          /* Anıların Listelendiği Grid */
          <div className="entries-grid">
            {entries.length === 0 ? (
              <div className="empty-state">
                <p>Henüz bir anı yazmadın.</p>
                <button onClick={() => setShowForm(true)}>İlk anını yazmaya başla ✍️</button>
              </div>
            ) : (
              entries.map(entry => (
                <div key={entry.id} className="entry-card" onClick={() => setSelectedEntry(entry)}>
                  {entry.image && <div className="card-image" style={{ backgroundImage: `url(${entry.image})` }}></div>}
                  <div className="card-body">
                    <span className="date-badge">{new Date(entry.date).toLocaleDateString('tr-TR')}</span>
                    <h4>{entry.title}</h4>
                    <p>{entry.content.substring(0, 80)}...</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Anı Okuma Modalı */}
      {selectedEntry && (
        <div className="modal-backdrop" onClick={() => setSelectedEntry(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedEntry(null)}>✕</button>
            
            <div className="modal-header">
              <span className="modal-date">📅 {new Date(selectedEntry.date).toLocaleDateString('tr-TR')}</span>
              <h2>{selectedEntry.title}</h2>
            </div>
            
            <div className="modal-body">
              {selectedEntry.image && <img src={selectedEntry.image} alt="Anı resmi" className="full-image" />}
              <div className="text-content">
                {/* Satır atlamalarını korumak ve taşmaları önlemek için güncellendi */}
                <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{selectedEntry.content}</p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="del-btn" onClick={() => deleteEntry(selectedEntry.id)}>🗑️ Bu Anıyı Sil</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .diary-wrapper { 
          min-height: 100vh; background: #020617; color: white; 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .glass-nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 15px 20px; background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .nav-btn {
          background: #1e293b; border: none; color: #94a3b8;
          padding: 8px 15px; border-radius: 12px; cursor: pointer; display: flex; gap: 5px; align-items: center;
        }
        .nav-btn:hover { background: #334155; color: white; }
        
        .nav-title { margin: 0; font-size: 1.2rem; color: #f59e0b; }

        .add-btn {
          background: #f59e0b; color: #fff; border: none;
          padding: 8px 16px; border-radius: 12px; font-weight: bold; cursor: pointer;
        }

        .content { max-width: 900px; margin: 0 auto; padding: 20px; }

        /* Form Stilleri */
        .form-card {
          background: #0f172a; border: 1px solid #1e293b; border-radius: 20px;
          padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .form-card h3 { margin-top: 0; color: #f59e0b; margin-bottom: 20px; font-size: 1.5rem; }
        .input-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
        .input-group label { color: #94a3b8; font-size: 0.9rem; font-weight: 600; }
        .input-group input, .input-group textarea {
          background: #1e293b; border: 1px solid #334155; color: white;
          padding: 12px 15px; border-radius: 12px; font-size: 1rem; font-family: inherit;
        }
        .input-group input:focus, .input-group textarea:focus {
          outline: none; border-color: #f59e0b;
        }

        .image-upload-section { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
        .image-upload-btn {
          background: #1e293b; color: #cbd5e1; padding: 10px 20px;
          border-radius: 12px; cursor: pointer; border: 1px dashed #475569;
        }
        .preview-img { width: 60px; height: 60px; object-fit: cover; border-radius: 10px; }

        .save-btn {
          width: 100%; background: #f59e0b; color: white; border: none;
          padding: 15px; border-radius: 12px; font-size: 1.1rem; font-weight: bold;
          cursor: pointer; transition: 0.2s;
        }
        .save-btn:hover { background: #d97706; }

        /* Grid ve Kart Stilleri */
        .entries-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;
        }
        .entry-card {
          background: #0f172a; border: 1px solid rgba(255,255,255,0.05); border-radius: 20px;
          overflow: hidden; cursor: pointer; transition: transform 0.2s, border-color 0.2s;
        }
        .entry-card:hover { transform: translateY(-5px); border-color: #f59e0b; }
        .card-image { width: 100%; height: 160px; background-size: cover; background-position: center; }
        .card-body { padding: 20px; }
        .date-badge { background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; }
        .card-body h4 { margin: 10px 0; font-size: 1.2rem; }
        /* Kart içindeki yazının taşmasını önlemek için güncellendi */
        .card-body p { color: #94a3b8; font-size: 0.9rem; line-height: 1.5; margin: 0; word-break: break-word; overflow-wrap: break-word; }

        .empty-state { grid-column: 1/-1; text-align: center; padding: 60px 20px; background: #0f172a; border-radius: 20px; border: 1px dashed #334155; }
        .empty-state button { margin-top: 15px; background: #f59e0b; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-weight: bold; }

        /* Modal (Okuma Ekranı) */
        .modal-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 1000;
          display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(5px);
        }
        .modal-content {
          background: #0f172a; width: 100%; max-width: 600px; max-height: 90vh;
          border-radius: 24px; overflow-y: auto; position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 1px solid #1e293b;
        }
        .modal-header { padding: 30px 30px 10px; }
        .modal-date { color: #f59e0b; font-weight: bold; font-size: 0.9rem; }
        .modal-header h2 { margin: 10px 0 0; font-size: 1.8rem; }
        .modal-body { padding: 0 30px 30px; }
        .full-image { width: 100%; max-height: 300px; object-fit: cover; border-radius: 16px; margin: 20px 0; }
        .text-content p { color: #cbd5e1; line-height: 1.8; font-size: 1.05rem; }
        .modal-footer { padding: 20px 30px; border-top: 1px solid #1e293b; display: flex; justify-content: flex-end; }
        
        .close-btn { position: absolute; top: 15px; right: 15px; background: #1e293b; color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .close-btn:hover { background: #334155; }
        .del-btn { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); padding: 8px 16px; border-radius: 10px; cursor: pointer; font-weight: bold; transition: 0.2s; }
        .del-btn:hover { background: #ef4444; color: white; }

        @media (max-width: 600px) {
          .hide-mobile { display: none; }
          .modal-content { max-height: 95vh; }
          .modal-header, .modal-body, .modal-footer { padding: 20px; }
        }
      `}</style>
    </div>
  );
}