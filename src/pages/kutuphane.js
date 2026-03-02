import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// --- IndexedDB Veritabanı Ayarları ---
const DB_NAME = "OzgurLibraryDB";
const STORE_NAME = "books";

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveToDB = async (book) => {
  const db = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(book); // put komutu, aynı ID varsa günceller, yoksa ekler
    tx.oncomplete = () => resolve(true);
  });
};

const getAllFromDB = async () => {
  const db = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result);
  });
};

const deleteFromDB = async (id) => {
  const db = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve(true);
  });
};
// -----------------------------------------------------------

export default function Kutuphane() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [books, setBooks] = useState([]);
  
  const [categories] = useState(['Hukuk', 'Kişisel Gelişim', 'Yazılım', 'Kitap', 'Diğer']);
  const [activeCat, setActiveCat] = useState('Hepsi');
  
  const [showForm, setShowForm] = useState(false);
  
  // Okuma ve Ayraç Durumları
  const [selectedBook, setSelectedBook] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);

  // Form Durumları
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    const loadBooks = async () => {
      const savedBooks = await getAllFromDB();
      setBooks(savedBooks.sort((a, b) => b.id - a.id)); 
    };
    loadBooks();
  }, []);

  // Kitap seçildiğinde Blob (Sanal dosya) oluştur ve kalınan sayfayı (ayraç) yükle
  useEffect(() => {
    let objectUrl = null;
    if (selectedBook && selectedBook.fileType === 'pdf') {
      setCurrentPage(selectedBook.bookmark || 1); // Kayıtlı ayraç yoksa 1. sayfa

      fetch(selectedBook.fileData)
        .then(res => res.blob())
        .then(blob => {
          objectUrl = URL.createObjectURL(blob);
          setPdfBlobUrl(objectUrl);
        })
        .catch(err => console.error("PDF yüklenemedi:", err));
    } else {
      setPdfBlobUrl(null);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [selectedBook]);

  // Yeni Kitap Ekleme
  const handleFileUpload = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    
    if (selected.type !== 'application/pdf' && 
        !selected.type.includes('wordprocessingml') && 
        !selected.type.includes('msword')) {
      alert("Lütfen sadece PDF veya Word belgesi yükleyin.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selected);
    reader.onload = () => {
      setFile({
        name: selected.name,
        type: selected.type.includes('pdf') ? 'pdf' : 'word',
        dataUrl: reader.result
      });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      alert("Lütfen kitap adını girin ve bir dosya seçin.");
      return;
    }

    const newBook = {
      id: Date.now(),
      title,
      author: author || 'Bilinmiyor',
      category,
      fileName: file.name,
      fileType: file.type,
      fileData: file.dataUrl,
      bookmark: 1, // Yeni eklenen kitabın ayracı 1. sayfadadır
      date: new Date().toLocaleDateString('tr-TR')
    };

    await saveToDB(newBook);
    setBooks([newBook, ...books]);
    
    setTitle('');
    setAuthor('');
    setCategory(categories[0]);
    setFile(null);
    setShowForm(false);
  };

  // Ayracı (Kalınan Sayfayı) Kaydet
  const handleSaveBookmark = async () => {
    if (!selectedBook) return;
    const updatedBook = { ...selectedBook, bookmark: currentPage };
    
    await saveToDB(updatedBook); // Veritabanında güncelle
    
    // Ekranda (State) güncelle
    setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
    setSelectedBook(updatedBook);
    alert(`Ayraç eklendi! Bu kitabı bir dahaki sefere açtığında ${currentPage}. sayfadan başlayacaksın. 🔖`);
  };

  // Kitap Silme İşlemi (Artık kartların üzerinde)
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Kartın tıklanma özelliğini tetiklememesi için
    if (confirm("Bu kitabı kütüphaneden kalıcı olarak silmek istiyor musun?")) {
      await deleteFromDB(id);
      setBooks(books.filter(b => b.id !== id));
      if (selectedBook && selectedBook.id === id) setSelectedBook(null);
    }
  };

  const filteredBooks = activeCat === 'Hepsi' ? books : books.filter(b => b.category === activeCat);

  if (!isMounted) return null;

  return (
    <div className="lib-wrapper">
      <Head>
        <title>E-Kütüphane</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <nav className="glass-nav">
        <button className="nav-btn" onClick={() => router.push('/anasayfa')}>
          <span>←</span> <span className="hide-mobile">Ana Menü</span>
        </button>
        <h2 className="nav-title">📚 Kütüphanem</h2>
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
                {file && <span className="file-badge">{file.type.toUpperCase()} Eklendi</span>}
              </div>

              <button type="submit" className="save-btn">Kütüphaneye Ekle</button>
            </form>
          </div>
        )}

        <div className="books-grid">
          {filteredBooks.length === 0 ? (
            <div className="empty-state">Bu kategoride hiç kitabın yok.</div>
          ) : (
            filteredBooks.map(book => (
              <div key={book.id} className="book-card" onClick={() => {
                if(book.fileType === 'word') {
                   const a = document.createElement('a');
                   a.href = book.fileData;
                   a.download = book.fileName;
                   a.click();
                } else {
                  setSelectedBook(book);
                }
              }}>
                <div className={`book-cover ${book.fileType}`}>
                  <span className="icon">{book.fileType === 'pdf' ? '📕' : '📘'}</span>
                  <span className="type-badge">{book.fileType === 'pdf' ? 'PDF' : 'WORD'}</span>
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

      {/* PDF Okuma Modalı */}
      {selectedBook && selectedBook.fileType === 'pdf' && (
        <div className="modal-backdrop" onClick={() => setSelectedBook(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            
            {/* Üst Kısım: Sayfa Değiştirici ve Ayraç */}
            <div className="modal-header">
              <div className="book-header-info">
                <h2>{selectedBook.title}</h2>
                <button onClick={handleSaveBookmark} className="bookmark-btn">🔖 Ayracı Buraya Kaydet</button>
              </div>
              
              <div className="page-controls">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>⬅️</button>
                <div className="page-input">
                  Sayfa: 
                  <input 
                    type="number" 
                    min="1"
                    value={currentPage} 
                    onChange={e => setCurrentPage(Number(e.target.value) || 1)} 
                  />
                </div>
                <button onClick={() => setCurrentPage(p => p + 1)}>➡️</button>
                <button className="close-btn" onClick={() => setSelectedBook(null)}>✕</button>
              </div>
            </div>
            
            <div className="pdf-viewer">
              {pdfBlobUrl ? (
                <iframe 
                  /* iframe url'sinin sonuna sayfa numarasını ve fit komutunu ekliyoruz */
                  src={`${pdfBlobUrl}#page=${currentPage}&toolbar=0&view=FitH`} 
                  title={selectedBook.title}
                  width="100%" 
                  height="100%" 
                  style={{ border: 'none' }}
                />
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8' }}>
                  PDF Yükleniyor...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .lib-wrapper { 
          min-height: 100vh; background: #020617; color: white; 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .glass-nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 15px 20px; background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .nav-btn { background: #1e293b; border: none; color: #94a3b8; padding: 8px 15px; border-radius: 12px; cursor: pointer; display: flex; gap: 5px; align-items: center; }
        .nav-btn:hover { background: #334155; color: white; }
        .nav-title { margin: 0; font-size: 1.2rem; color: #8b5cf6; }
        .add-btn { background: #8b5cf6; color: #fff; border: none; padding: 8px 16px; border-radius: 12px; font-weight: bold; cursor: pointer; }

        .category-bar { display: flex; gap: 10px; padding: 15px 20px; overflow-x: auto; scrollbar-width: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .category-bar::-webkit-scrollbar { display: none; }
        .category-bar button { background: #0f172a; border: 1px solid #1e293b; color: #94a3b8; padding: 8px 20px; border-radius: 20px; white-space: nowrap; cursor: pointer; font-weight: 500; }
        .category-bar button.active { background: #8b5cf6; color: white; border-color: #8b5cf6; }

        .content { max-width: 1000px; margin: 0 auto; padding: 20px; }

        .form-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; padding: 30px; margin-bottom: 30px; }
        .form-card h3 { margin-top: 0; color: #8b5cf6; margin-bottom: 20px; }
        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .input-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
        .input-group label { color: #94a3b8; font-size: 0.9rem; font-weight: 600; }
        .input-group input, .input-group select { background: #1e293b; border: 1px solid #334155; color: white; padding: 12px; border-radius: 12px; font-size: 1rem; }
        .input-group input:focus, .input-group select:focus { outline: none; border-color: #8b5cf6; }

        .file-upload-section { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
        .file-upload-btn { background: #1e293b; color: #cbd5e1; padding: 12px 20px; border-radius: 12px; cursor: pointer; border: 1px dashed #8b5cf6; flex: 1; text-align: center; font-weight: bold; }
        .file-badge { background: rgba(139, 92, 246, 0.2); color: #a78bfa; padding: 8px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; }

        .save-btn { width: 100%; background: #8b5cf6; color: white; border: none; padding: 15px; border-radius: 12px; font-size: 1.1rem; font-weight: bold; cursor: pointer; }
        
        .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .book-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; cursor: pointer; transition: 0.2s; display: flex; flex-direction: column; position: relative; }
        .book-card:hover { transform: translateY(-5px); border-color: #8b5cf6; }
        .book-cover { height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
        .book-cover.pdf { background: linear-gradient(135deg, #ef4444 0%, #991b1b 100%); }
        .book-cover.word { background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%); }
        .book-cover .icon { font-size: 4rem; }
        .type-badge { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: bold; }
        .bookmark-badge { position: absolute; bottom: 10px; left: 10px; background: rgba(245, 158, 11, 0.9); color: white; padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: bold; }
        
        .book-info { padding: 15px; flex: 1; display: flex; flex-direction: column; }
        .book-info h4 { margin: 0 0 5px 0; font-size: 1.1rem; word-break: break-all; overflow-wrap: break-word; }
        .book-info p { margin: 0 0 10px 0; color: #94a3b8; font-size: 0.85rem; }
        .card-footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; }
        .cat-badge { display: inline-block; background: rgba(139, 92, 246, 0.1); color: #a78bfa; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; }
        .card-del-btn { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); width: 30px; height: 30px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .card-del-btn:hover { background: #ef4444; color: white; }

        .empty-state { grid-column: 1/-1; text-align: center; padding: 50px; color: #475569; border: 1px dashed #334155; border-radius: 20px; }

        /* Modal (PDF Okuyucu) */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 1000; display: flex; flex-direction: column; }
        .modal-content { flex: 1; display: flex; flex-direction: column; background: #0f172a; width: 100%; height: 100%; }
        
        .modal-header { padding: 15px 20px; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; background: #020617; flex-wrap: wrap; gap: 15px; }
        .book-header-info h2 { margin: 0 0 5px 0; font-size: 1.2rem; color: #e2e8f0; word-break: break-all; }
        .bookmark-btn { background: #f59e0b; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer; }
        
        .page-controls { display: flex; align-items: center; gap: 10px; background: #0f172a; padding: 5px; border-radius: 12px; border: 1px solid #1e293b; }
        .page-controls button { background: #1e293b; border: none; color: white; width: 35px; height: 35px; border-radius: 8px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; }
        .page-controls button:hover { background: #334155; }
        .page-input { display: flex; align-items: center; gap: 8px; color: #94a3b8; font-size: 0.9rem; }
        .page-input input { width: 50px; background: #020617; border: 1px solid #334155; color: white; padding: 5px; border-radius: 6px; text-align: center; }
        .page-input input:focus { outline: none; border-color: #8b5cf6; }
        
        .close-btn { background: #ef4444 !important; font-weight: bold; margin-left: 10px; }
        .close-btn:hover { background: #dc2626 !important; }
        
        .pdf-viewer { flex: 1; background: #e2e8f0; }

        @media (max-width: 768px) {
          .modal-header { flex-direction: column; align-items: flex-start; }
          .page-controls { width: 100%; justify-content: space-between; }
        }
        @media (max-width: 600px) {
          .input-row { grid-template-columns: 1fr; }
          .hide-mobile { display: none; }
          .books-grid { grid-template-columns: 1fr 1fr; gap: 15px; }
          .book-cover { height: 180px; }
        }
      `}</style>
    </div>
  );
}