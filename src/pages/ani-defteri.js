import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// SUPABASE BAĞLANTISI
import { supabase } from '@/lib/supabaseClient';

export default function AniDefteri() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Arayüz durumları
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Form durumları
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Resim için iki state tutuyoruz: Biri yüklemek için (blob), diğeri ekranda göstermek için (url)
  const [imageBlob, setImageBlob] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // --- SUPABASE'DEN ANILARI ÇEK ---
  useEffect(() => {
    setIsMounted(true);
    fetchEntries();
    // Bugünü varsayılan tarih yap
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('diary')
      .select('*')
      .order('date', { ascending: false }); // En yeni tarihli anı en üstte

    if (!error && data) {
      setEntries(data);
    }
    setLoading(false);
  };

  // --- RESMİ SIKIŞTIR (BULUTA UYGUN BLOB FORMATINA ÇEVİR) ---
  const compressImageToBlob = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          let scaleSize = 1;
          if (img.width > MAX_WIDTH) {
            scaleSize = MAX_WIDTH / img.width;
          }
          canvas.width = img.width * scaleSize;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.8);
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
    
    // Resmi sıkıştırıp Blob'a çevir
    const compressedBlob = await compressImageToBlob(file);
    setImageBlob(compressedBlob);
    
    // Ekranda önizleme yapmak için geçici bir URL oluştur
    setImagePreview(URL.createObjectURL(compressedBlob));
  };

  // --- FORMU SUPABASE'E GÖNDERME ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Lütfen başlık ve içerik alanlarını doldurun.");
      return;
    }

    setUploading(true);
    try {
      let finalImageUrl = null;

      // 1. Eğer resim seçildiyse önce onu Storage'a yükle
      if (imageBlob) {
        const fileName = `diary_img_${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('diary-images')
          .upload(fileName, imageBlob, { contentType: 'image/jpeg' });

        if (uploadError) throw uploadError;

        // Yüklenen resmin public linkini al
        const { data: { publicUrl } } = supabase.storage
          .from('diary-images')
          .getPublicUrl(fileName);
          
        finalImageUrl = publicUrl;
      }

      // 2. Anıyı veritabanına kaydet
      const { error: dbError } = await supabase
        .from('diary')
        .insert([{
          date,
          title,
          content,
          image_url: finalImageUrl
        }]);

      if (dbError) throw dbError;

      // Formu temizle ve listeyi yenile
      setTitle('');
      setContent('');
      setImageBlob(null);
      setImagePreview(null);
      setShowForm(false);
      fetchEntries();

    } catch (error) {
      alert("Anı kaydedilirken hata oluştu: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- ANIYI SİL ---
  const deleteEntry = async (id) => {
    if(confirm("Bu anıyı buluttan kalıcı olarak silmek istiyor musun?")) {
      const { error } = await supabase.from('diary').delete().eq('id', id);
      
      if (!error) {
        setEntries(entries.filter(e => e.id !== id));
        setSelectedEntry(null);
      } else {
        alert("Silinirken bir hata oluştu.");
      }
    }
  };

  if (!isMounted) return null;

  return (
    <div className="diary-wrapper">
      <Head>
        <title>Anı Defteri | Cloud</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Üst Bar */}
      <nav className="glass-nav">
        <button className="nav-btn" onClick={() => router.push('/anasayfa')}>
          <span>←</span> <span className="hide-mobile">Ana Menü</span>
        </button>
        <h2 className="nav-title">📓 Bulut Anı Defteri</h2>
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
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required disabled={uploading} />
              </div>
              <div className="input-group">
                <label>Konu / Başlık</label>
                <input type="text" placeholder="Bugün neler oldu?" value={title} onChange={e => setTitle(e.target.value)} required disabled={uploading} />
              </div>
              <div className="input-group">
                <label>Anını Anlat</label>
                <textarea rows="6" placeholder="Bütün detaylarıyla yazabilirsin..." value={content} onChange={e => setContent(e.target.value)} required disabled={uploading}></textarea>
              </div>
              
              <div className="image-upload-section">
                <label className="image-upload-btn" style={{ opacity: uploading ? 0.5 : 1 }}>
                  📸 {imagePreview ? 'Resim Değiştir' : 'Anıya Resim Ekle'}
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} disabled={uploading} />
                </label>
                {imagePreview && <img src={imagePreview} alt="Önizleme" className="preview-img" />}
              </div>

              <button type="submit" disabled={uploading} className="save-btn">
                {uploading ? '☁️ Buluta Kaydediliyor...' : 'Anıyı Kaydet'}
              </button>
            </form>
          </div>
        ) : (
          /* Anıların Listelendiği Grid */
          <div className="entries-grid">
            {loading ? (
              <div className="empty-state"><p>Anılar Yükleniyor...</p></div>
            ) : entries.length === 0 ? (
              <div className="empty-state">
                <p>Henüz bir anı yazmadın.</p>
                <button onClick={() => setShowForm(true)}>İlk anını buluta yazmaya başla ✍️</button>
              </div>
            ) : (
              entries.map(entry => (
                <div key={entry.id} className="entry-card" onClick={() => setSelectedEntry(entry)}>
                  {/* entry.image yerine entry.image_url kullanıyoruz */}
                  {entry.image_url && <div className="card-image" style={{ backgroundImage: `url(${entry.image_url})` }}></div>}
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
              {/* entry.image yerine entry.image_url kullanıyoruz */}
              {selectedEntry.image_url && <img src={selectedEntry.image_url} alt="Anı resmi" className="full-image" />}
              <div className="text-content">
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
        /* Tüm CSS tasarımların birebir aynı bırakıldı */
        .diary-wrapper { min-height: 100vh; background: #020617; color: white; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .glass-nav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 15px 20px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nav-btn { background: #1e293b; border: none; color: #94a3b8; padding: 8px 15px; border-radius: 12px; cursor: pointer; display: flex; gap: 5px; align-items: center; }
        .nav-btn:hover { background: #334155; color: white; }
        .nav-title { margin: 0; font-size: 1.2rem; color: #f59e0b; }
        .add-btn { background: #f59e0b; color: #fff; border: none; padding: 8px 16px; border-radius: 12px; font-weight: bold; cursor: pointer; }
        .content { max-width: 900px; margin: 0 auto; padding: 20px; }
        .form-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .form-card h3 { margin-top: 0; color: #f59e0b; margin-bottom: 20px; font-size: 1.5rem; }
        .input-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
        .input-group label { color: #94a3b8; font-size: 0.9rem; font-weight: 600; }
        .input-group input, .input-group textarea { background: #1e293b; border: 1px solid #334155; color: white; padding: 12px 15px; border-radius: 12px; font-size: 1rem; font-family: inherit; }
        .input-group input:focus, .input-group textarea:focus { outline: none; border-color: #f59e0b; }
        .image-upload-section { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
        .image-upload-btn { background: #1e293b; color: #cbd5e1; padding: 10px 20px; border-radius: 12px; cursor: pointer; border: 1px dashed #475569; }
        .preview-img { width: 60px; height: 60px; object-fit: cover; border-radius: 10px; }
        .save-btn { width: 100%; background: #f59e0b; color: white; border: none; padding: 15px; border-radius: 12px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .save-btn:hover { background: #d97706; }
        .save-btn:disabled { background: #92400e; cursor: not-allowed; }
        .entries-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .entry-card { background: #0f172a; border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; overflow: hidden; cursor: pointer; transition: transform 0.2s, border-color 0.2s; }
        .entry-card:hover { transform: translateY(-5px); border-color: #f59e0b; }
        .card-image { width: 100%; height: 160px; background-size: cover; background-position: center; }
        .card-body { padding: 20px; }
        .date-badge { background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; }
        .card-body h4 { margin: 10px 0; font-size: 1.2rem; }
        .card-body p { color: #94a3b8; font-size: 0.9rem; line-height: 1.5; margin: 0; word-break: break-word; overflow-wrap: break-word; }
        .empty-state { grid-column: 1/-1; text-align: center; padding: 60px 20px; background: #0f172a; border-radius: 20px; border: 1px dashed #334155; }
        .empty-state button { margin-top: 15px; background: #f59e0b; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-weight: bold; }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(5px); }
        .modal-content { background: #0f172a; width: 100%; max-width: 600px; max-height: 90vh; border-radius: 24px; overflow-y: auto; position: relative; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 1px solid #1e293b; }
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
        @media (max-width: 600px) { .hide-mobile { display: none; } .modal-content { max-height: 95vh; } .modal-header, .modal-body, .modal-footer { padding: 20px; } }
      `}</style>
    </div>
  );
}