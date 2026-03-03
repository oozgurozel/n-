import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// SUPABASE BAĞLANTISI
import { supabase } from '@/lib/supabaseClient';

export default function Kutuphane() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [categories] = useState(['Hukuk', 'Kişisel Gelişim', 'Yazılım', 'Kitap', 'Diğer']);
  const [activeCat, setActiveCat] = useState('Hepsi');
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Okuma ve Ayraç Durumları
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Form Durumları
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [file, setFile] = useState(null);

  // --- SUPABASE'DEN KİTAPLARI ÇEK ---
  useEffect(() => {
    setIsMounted(true);
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('id', { ascending: false });

    if (error) console.error("Hata:", error);
    else setBooks(data || []);
    setLoading(false);
  };

  // Kitap seçildiğinde ayracı yükle
  useEffect(() => {
    if (selectedBook && selectedBook.file_type === 'pdf') {
      setCurrentPage(selectedBook.bookmark || 1);
    }
  }, [selectedBook]);

  // Yeni Kitap Seçimi
  const handleFileUpload = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    
    if (selected.type !== 'application/pdf' && 
        !selected.type.includes('wordprocessingml') && 
        !selected.type.includes('msword')) {
      alert("Lütfen sadece PDF veya Word belgesi yükleyin.");
      return;
    }
    setFile(selected);
  };

  // --- SUPABASE'E DOSYA VE VERİ YÜKLE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) return alert("Lütfen kitap adını girin ve bir dosya seçin.");

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `library/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('book-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('book-files')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from('books').insert([
        {
          title,
          author: author || 'Bilinmiyor',
          category,
          file_name: file.name,
          file_type: file.type.includes('pdf') ? 'pdf' : 'word',
          file_url: publicUrl,
          bookmark: 1
        }
      ]);

      if (insertError) throw insertError;

      alert("Kitap başarıyla buluta yüklendi! ☁️");
      setTitle(''); setAuthor(''); setCategory(categories[0]); setFile(null); setShowForm(false);
      fetchBooks();

    } catch (error) {
      alert("Yükleme başarısız: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- AYRACI SUPABASE'E KAYDET ---
  const handleSaveBookmark = async () => {
    if (!selectedBook) return;
    const { error } = await supabase
      .from('books')
      .update({ bookmark: currentPage })
      .eq('id', selectedBook.id);
    
    if (error) {
      alert("Ayraç kaydedilemedi.");
    } else {
      const updatedBook = { ...selectedBook, bookmark: currentPage };
      setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
      setSelectedBook(updatedBook);
      alert(`Ayraç eklendi! ${currentPage}. sayfadan devam edebileceksin. 🔖`);
    }
  };

  // --- KİTABI SİL ---
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (confirm("Bu kitabı buluttan kalıcı olarak silmek istiyor musun?")) {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (!error) {
        setBooks(books.filter(b => b.id !== id));
        if (selectedBook && selectedBook.id === id) setSelectedBook(null);
      }
    }
  };

  const filteredBooks = activeCat === 'Hepsi' ? books : books.filter(b => b.category === activeCat);

  if (!isMounted) return null;

  return (
    <div className="lib-wrapper">
      <Head>
        <title>E-Kütüphane | Cloud</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <nav className="glass-nav">
        <button className="nav-btn" onClick={() => router.push('/anasayfa')}>
          <span>←</span> <span className="hide-mobile">Ana Menü</span>
        </button>
        <h2 className="nav-title">📚 Bulut Kütüphanem</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'İptal' : '+ Kitap Ekle'}
        </button>
      </nav>

      <div className="category-bar">
        <button className={activeCat === 'Hepsi' ? 'active' : ''} onClick={() => setActiveCat('Hepsi')}>Hepsi</button>
        {categories.map(c => (
          <button key={c} className={activeCat === c ? 'active' : ''} onClick={() => setActiveCat(c)}>{c}</button>
        ))}
      </div>

      <main className="content">
        {showForm && (
          <div className="form-card">
            <h3>Yeni Kitap / Belge Yükle</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-row">
                <div className="input-group">
                  <label>Kitap / Belge Adı</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Yazar (Opsiyonel)</label>
                  <input type="text" value={author} onChange={e => setAuthor(e.target.value)} />
                </div>
              </div>
              <div className="input-group">
                <label>Kategori</label>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="file-upload-section">
                <label className="file-upload-btn">
                  📄 {file ? file.name : 'PDF veya Word Seç'}
                  <input type="file" accept=".pdf,.doc,.docx" hidden onChange={handleFileUpload} />
                </label>
              </div>
              <button type="submit" disabled={uploading} className="save-btn">
                {uploading ? '☁️ Yükleniyor...' : 'Buluta Yükle'}
              </button>
            </form>
          </div>
        )}

        <div className="books-grid">
          {loading ? (
             <div className="empty-state">Kitaplar Yükleniyor...</div>
          ) : filteredBooks.length === 0 ? (
            <div className="empty-state">Hiç kitap yok.</div>
          ) : (
            filteredBooks.map(book => (
              <div key={book.id} className="book-card" onClick={() => {
                if(book.file_type === 'word') {
                   const a = document.createElement('a');
                   a.href = book.file_url;
                   a.download = book.file_name;
                   a.click();
                } else {
                  setSelectedBook(book);
                }
              }}>
                <div className={`book-cover ${book.file_type}`}>
                  <span className="icon">{book.file_type === 'pdf' ? '📕' : '📘'}</span>
                  <span className="type-badge">{book.file_type === 'pdf' ? 'PDF' : 'WORD'}</span>
                  {book.bookmark > 1 && <span className="bookmark-badge">🔖 {book.bookmark}. Sayfa</span>}
                </div>
                <div className="book-info">
                  <h4>{book.title}</h4>
                  <p>{book.author}</p>
                  <div className="card-footer">
                    <span className="cat-badge">{book.category}</span>
                    <button className="card-del-btn" onClick={(e) => handleDelete(e, book.id)}>🗑️</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {selectedBook && selectedBook.file_type === 'pdf' && (
        <div className="modal-backdrop" onClick={() => setSelectedBook(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="book-header-info">
                <h2>{selectedBook.title}</h2>
                <div className="modal-actions">
                    <button onClick={handleSaveBookmark} className="bookmark-btn">🔖 Ayracı Kaydet</button>
                    {/* Mobilde doğrudan açma butonu */}
                    <button 
                      onClick={() => window.open(selectedBook.file_url, '_blank')} 
                      className="download-view-btn"
                    >
                      📖 Tam Ekran
                    </button>
                </div>
              </div>
              
              <div className="page-controls">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>⬅️</button>
                <div className="page-input">
                  S. <input type="number" min="1" value={currentPage} onChange={e => setCurrentPage(Number(e.target.value) || 1)} />
                </div>
                <button onClick={() => setCurrentPage(p => p + 1)}>➡️</button>
                <button className="close-btn" onClick={() => setSelectedBook(null)}>✕</button>
              </div>
            </div>
            
            <div className="pdf-viewer">
              {/* Google Docs Viewer: Mobilde kaydırma sorununu çözer */}
              <iframe 
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedBook.file_url)}&embedded=true`} 
                title={selectedBook.title}
                width="100%" 
                height="100%" 
                style={{ border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .lib-wrapper { min-height: 100vh; background: #020617; color: white; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .glass-nav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 15px 20px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nav-btn { background: #1e293b; border: none; color: #94a3b8; padding: 8px 15px; border-radius: 12px; cursor: pointer; display: flex; gap: 5px; align-items: center; }
        .nav-title { margin: 0; font-size: 1.2rem; color: #8b5cf6; }
        .add-btn { background: #8b5cf6; color: #fff; border: none; padding: 8px 16px; border-radius: 12px; font-weight: bold; cursor: pointer; }
        .category-bar { display: flex; gap: 10px; padding: 15px 20px; overflow-x: auto; scrollbar-width: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .category-bar button { background: #0f172a; border: 1px solid #1e293b; color: #94a3b8; padding: 8px 20px; border-radius: 20px; white-space: nowrap; cursor: pointer; font-weight: 500; }
        .category-bar button.active { background: #8b5cf6; color: white; border-color: #8b5cf6; }
        .content { max-width: 1000px; margin: 0 auto; padding: 20px; }
        .form-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; padding: 30px; margin-bottom: 30px; }
        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .input-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
        .input-group input, .input-group select { background: #1e293b; border: 1px solid #334155; color: white; padding: 12px; border-radius: 12px; font-size: 1rem; }
        .file-upload-btn { background: #1e293b; color: #cbd5e1; padding: 12px 20px; border-radius: 12px; cursor: pointer; border: 1px dashed #8b5cf6; text-align: center; font-weight: bold; }
        .save-btn { width: 100%; background: #8b5cf6; color: white; border: none; padding: 15px; border-radius: 12px; font-size: 1.1rem; font-weight: bold; cursor: pointer; }
        .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }
        .book-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; cursor: pointer; transition: 0.2s; position: relative; }
        .book-cover { height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .book-cover.pdf { background: linear-gradient(135deg, #ef4444 0%, #991b1b 100%); }
        .book-cover.word { background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%); }
        .type-badge { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: bold; }
        .bookmark-badge { position: absolute; bottom: 10px; left: 10px; background: rgba(245, 158, 11, 0.9); padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; }
        .book-info { padding: 15px; }
        .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
        .cat-badge { background: rgba(139, 92, 246, 0.1); color: #a78bfa; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; }
        .card-del-btn { color: #ef4444; background: none; border: none; cursor: pointer; font-size: 1.2rem; }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 1000; display: flex; flex-direction: column; }
        .modal-content { flex: 1; display: flex; flex-direction: column; background: #0f172a; }
        .modal-header { padding: 15px 20px; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; background: #020617; }
        .modal-actions { display: flex; gap: 10px; margin-top: 5px; }
        .bookmark-btn { background: #f59e0b; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer; }
        .download-view-btn { background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer; }
        .page-controls { display: flex; align-items: center; gap: 10px; }
        .page-controls button { background: #1e293b; border: none; color: white; width: 35px; height: 35px; border-radius: 8px; }
        .page-input input { width: 45px; background: #020617; border: 1px solid #334155; color: white; text-align: center; border-radius: 6px; padding: 4px; }
        .close-btn { background: #ef4444 !important; font-weight: bold; margin-left: 5px; }
        .pdf-viewer { flex: 1; background: #e2e8f0; -webkit-overflow-scrolling: touch; }
        @media (max-width: 600px) { 
            .input-row { grid-template-columns: 1fr; } 
            .hide-mobile { display: none; }
            .modal-header { flex-direction: column; gap: 15px; align-items: flex-start; }
            .page-controls { width: 100%; justify-content: space-between; }
        }
      `}</style>
    </div>
  );
}