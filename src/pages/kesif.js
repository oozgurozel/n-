import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

// TÜRKİYE'NİN 81 İLİ
const CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
].map((name, index) => ({ code: index + 1, name }));

export default function KesifHaritasi() {
  const router = useRouter();
  const [visitedCities, setVisitedCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null); 
  
  // Form State'leri
  const [memoryNote, setMemoryNote] = useState('');
  const [visitDate, setVisitDate] = useState('');
  
  // YENİ: Çoklu Seçim State'leri
  const [visitedOzgur, setVisitedOzgur] = useState(false);
  const [visitedNisa, setVisitedNisa] = useState(false);
  const [visitedBirlikte, setVisitedBirlikte] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    const { data } = await supabase.from('kesif_haritasi').select('*');
    if (data) setVisitedCities(data);
  };

  const openCityModal = (city) => {
    const visitRecord = visitedCities.find(v => v.city_code === city.code);
    if (visitRecord) {
      setMemoryNote(visitRecord.memory_note || '');
      setVisitDate(visitRecord.visit_date || '');
      setVisitedOzgur(visitRecord.visited_ozgur || false);
      setVisitedNisa(visitRecord.visited_nisa || false);
      setVisitedBirlikte(visitRecord.visited_birlikte || false);
    } else {
      setMemoryNote('');
      setVisitDate(new Date().toISOString().split('T')[0]); 
      setVisitedOzgur(false);
      setVisitedNisa(false);
      setVisitedBirlikte(false);
    }
    setSelectedCity(city);
  };

  const saveVisit = async (e) => {
    e.preventDefault();
    
    // Eğer hiçbir şey seçilmemişse uyarı ver
    if (!visitedOzgur && !visitedNisa && !visitedBirlikte) {
      alert("Lütfen bu şehri kimin fethettiğini seçin! (Özgür, Nisa veya Birlikte)");
      return;
    }

    setIsSubmitting(true);

    const visitData = {
      city_code: selectedCity.code,
      city_name: selectedCity.name,
      memory_note: memoryNote,
      visit_date: visitDate,
      visited_ozgur: visitedOzgur,
      visited_nisa: visitedNisa,
      visited_birlikte: visitedBirlikte
    };

    await supabase.from('kesif_haritasi').upsert(visitData, { onConflict: 'city_code' });
    
    await fetchVisits();
    setIsSubmitting(false);
    setSelectedCity(null);
  };

  const removeVisit = async () => {
    if (confirm(`${selectedCity.name} fethini iptal etmek istediğine emin misin?`)) {
      await supabase.from('kesif_haritasi').delete().eq('city_code', selectedCity.code);
      await fetchVisits();
      setSelectedCity(null);
    }
  };

  // İstatistik Hesaplamaları (Birlikte gidilenler, bireysel sayılara da dahil edilir)
  const ozgurCount = visitedCities.filter(v => v.visited_ozgur || v.visited_birlikte).length;
  const nisaCount = visitedCities.filter(v => v.visited_nisa || v.visited_birlikte).length;
  const birlikteCount = visitedCities.filter(v => v.visited_birlikte).length;
  
  // En az bir şekilde fethi gerçekleşen toplam benzersiz şehir sayısı
  const totalVisited = visitedCities.filter(v => v.visited_ozgur || v.visited_nisa || v.visited_birlikte).length;
  const progressPercent = Math.round((totalVisited / 81) * 100);

  return (
    <div className="page-wrapper">
      <Head><title>Keşif Haritamız | Kazı-Kazan</title></Head>

      <nav className="top-nav">
        <button className="back-btn" onClick={() => router.push('/anasayfa')}>
          <span>←</span> <span className="hide-mobile">Ana Sayfa</span>
        </button>
        <div className="user-badge">
          <strong>NÖ Gezginleri</strong> 🌍
        </div>
      </nav>

      <div className="main-container">
        
        {/* BAŞLIK VE İSTATİSTİKLER */}
        <header className="dashboard-header fade-in">
          <div className="title-area">
            <h1>🌍 Keşif Haritamız</h1>
            <p>Türkiye'nin %{progressPercent}'i fethedildi! ({totalVisited} / 81)</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card stat-ozgur">
              <span className="stat-icon">🤵🏻‍♂️</span>
              <div className="stat-info">
                <span>Özgür Gördü</span>
                <strong>{ozgurCount} Şehir</strong>
              </div>
            </div>
            
            <div className="stat-card stat-birlikte">
              <span className="stat-icon">👩‍❤️‍👨</span>
              <div className="stat-info">
                <span>Ortak Fetih</span>
                <strong>{birlikteCount} Şehir</strong>
              </div>
            </div>

            <div className="stat-card stat-nisa">
              <span className="stat-icon">👰🏻‍♀️</span>
              <div className="stat-info">
                <span>Nisa Gördü</span>
                <strong>{nisaCount} Şehir</strong>
              </div>
            </div>
          </div>
        </header>

        {/* 81 İL KAZI-KAZAN GRİDİ */}
        <div className="cities-grid fade-in">
          {CITIES.map((city) => {
            const v = visitedCities.find(rec => rec.city_code === city.code);
            
            // Renk Sınıfını Karmaşık Mantıkla Belirle
            let cardClass = 'locked';
            if (v) {
              if (v.visited_birlikte) {
                cardClass = 'visited-birlikte'; // Birlikte gidildiyse hep Zümrüt Yeşili
              } else if (v.visited_ozgur && v.visited_nisa) {
                cardClass = 'visited-both'; // Ayrı ayrı gidilmiş ama beraber gidilmemiş: Yarı Mavi Yarısı Pembe
              } else if (v.visited_ozgur) {
                cardClass = 'visited-ozgur'; // Sadece Özgür
              } else if (v.visited_nisa) {
                cardClass = 'visited-nisa'; // Sadece Nisa
              }
            }

            return (
              <div 
                key={city.code} 
                className={`city-card ${cardClass}`}
                onClick={() => openCityModal(city)}
              >
                <div className="plate-badge">{city.code.toString().padStart(2, '0')}</div>
                <div className="city-name">{city.name}</div>
                {v && (v.visited_ozgur || v.visited_nisa || v.visited_birlikte) && <div className="check-icon">✓</div>}
              </div>
            );
          })}
        </div>

      </div>

      {/* ŞEHİR DETAY MODALI (POP-UP) */}
      {selectedCity && (
        <div className="modal-overlay">
          <div className="modal-content pop-in">
            <button className="close-modal" onClick={() => setSelectedCity(null)}>✕</button>
            
            <div className="modal-header">
              <span className="modal-plate">{selectedCity.code.toString().padStart(2, '0')}</span>
              <h2>{selectedCity.name}</h2>
            </div>

            <form onSubmit={saveVisit} className="visit-form">
              
              {/* YENİ: ÇOKLU SEÇİM KUTULARI */}
              <div className="form-group">
                <label style={{marginBottom:'10px'}}>Bu şehre kimler ayak bastı? 🧭 (Birden fazla seçilebilir)</label>
                <div className="visitor-multi-selector">
                  <div 
                    className={`multi-btn ${visitedOzgur ? 'checked-ozgur' : ''}`}
                    onClick={() => setVisitedOzgur(!visitedOzgur)}
                  >
                    {visitedOzgur ? '🤵🏻‍♂️ Özgür Gitti ✓' : '🤵🏻‍♂️ Özgür Gitmedi'}
                  </div>
                  
                  <div 
                    className={`multi-btn ${visitedNisa ? 'checked-nisa' : ''}`}
                    onClick={() => setVisitedNisa(!visitedNisa)}
                  >
                    {visitedNisa ? '👰🏻‍♀️ Nisa Gitti ✓' : '👰🏻‍♀️ Nisa Gitmedi'}
                  </div>

                  <div 
                    className={`multi-btn btn-full ${visitedBirlikte ? 'checked-birlikte' : ''}`}
                    onClick={() => setVisitedBirlikte(!visitedBirlikte)}
                  >
                    {visitedBirlikte ? '👩‍❤️‍👨 Birlikte Gittik! ✓' : '👩‍❤️‍👨 Henüz Beraber Gitmedik'}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Ziyaret Tarihi (Son Gidiş) 🗓️</label>
                <input 
                  type="date" 
                  value={visitDate} 
                  onChange={(e) => setVisitDate(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Buradaki Anılarımız 📝</label>
                <textarea 
                  rows="3" 
                  placeholder="Bu şehirde ne yaşadık veya kim, ne zaman gitti? Not bırak..."
                  value={memoryNote}
                  onChange={(e) => setMemoryNote(e.target.value)}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Kaydediliyor...' : '🌍 Haritayı Güncelle'}
                </button>
                {visitedCities.some(v => v.city_code === selectedCity.code) && (
                  <button type="button" className="delete-btn" onClick={removeVisit}>Tüm Kaydı Sil 🗑️</button>
                )}
              </div>
            </form>

          </div>
        </div>
      )}

      <style jsx>{`
        .page-wrapper { min-height: 100vh; background: #020617; color: white; font-family: 'Inter', sans-serif; padding: 80px 20px 40px 20px; display: flex; justify-content: center; }
        
        .top-nav { position: fixed; top: 0; left: 0; width: 100%; padding: 15px 20px; background: rgba(2, 6, 23, 0.8); backdrop-filter: blur(10px); display: flex; justify-content: space-between; align-items: center; z-index: 1000; border-bottom: 1px solid #1e293b; }
        .back-btn { background: #1e293b; border: 1px solid #334155; color: #94a3b8; padding: 8px 15px; border-radius: 10px; cursor: pointer; display: flex; gap: 8px; align-items: center; font-weight: bold; transition: 0.2s; }
        .back-btn:hover { background: #3b82f6; color: white; border-color: #3b82f6; }
        .user-badge { background: rgba(59, 130, 246, 0.1); padding: 8px 15px; border-radius: 20px; font-size: 0.95rem; color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3);}

        .main-container { width: 100%; max-width: 900px; }

        .fade-in { animation: fadeIn 0.4s ease-out; }
        .pop-in { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }

        .dashboard-header { text-align: center; margin-bottom: 30px; }
        .title-area h1 { font-size: 2.5rem; margin: 0 0 5px 0; color: #f8fafc; }
        .title-area p { color: #94a3b8; margin: 0 0 25px 0; font-size: 1.1rem; }
        
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;}
        .stat-card { padding: 15px; border-radius: 16px; display: flex; align-items: center; gap: 15px; text-align: left; border: 1px solid transparent; transition: 0.3s;}
        .stat-card:hover { transform: translateY(-3px); }
        .stat-icon { font-size: 2rem; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 12px;}
        .stat-info { display: flex; flex-direction: column; }
        .stat-info span { font-size: 0.8rem; opacity: 0.9; }
        .stat-info strong { font-size: 1.2rem; font-weight: 900; }
        
        .stat-ozgur { background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1)); border-color: #3b82f6; color: #93c5fd; }
        .stat-ozgur strong { color: #60a5fa; }
        .stat-nisa { background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.1)); border-color: #ec4899; color: #f9a8d4; }
        .stat-nisa strong { color: #f472b6; }
        .stat-birlikte { background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1)); border-color: #10b981; color: #6ee7b7; box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);}
        .stat-birlikte strong { color: #34d399; }

        /* Kazı-Kazan 81 İl Gridi */
        .cities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; padding-bottom: 50px;}
        .city-card { position: relative; height: 90px; border-radius: 16px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; transition: 0.3s; overflow: hidden; border: 2px solid transparent;}
        
        /* 1. Kilitli Şehirler */
        .city-card.locked { background: #1e293b; border-color: #334155; color: #64748b; }
        .city-card.locked::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px); pointer-events: none; }
        .city-card.locked:hover { background: #334155; transform: scale(1.05); color: #cbd5e1; }
        
        /* 2. Sadece Özgür (Mavi) */
        .city-card.visited-ozgur { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border-color: #60a5fa; box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3); }
        .city-card.visited-ozgur:hover { transform: scale(1.08); box-shadow: 0 10px 20px rgba(59, 130, 246, 0.5); z-index: 10; }

        /* 3. Sadece Nisa (Pembe) */
        .city-card.visited-nisa { background: linear-gradient(135deg, #ec4899, #db2777); color: white; border-color: #f472b6; box-shadow: 0 5px 15px rgba(236, 72, 153, 0.3); }
        .city-card.visited-nisa:hover { transform: scale(1.08); box-shadow: 0 10px 20px rgba(236, 72, 153, 0.5); z-index: 10; }

        /* 4. İkisi de Ayrı Ayrı Gitti (Mavi & Pembe Gradient - ÇOK ŞIK) */
        .city-card.visited-both { background: linear-gradient(135deg, #3b82f6 0%, #ec4899 100%); color: white; border-color: #c084fc; box-shadow: 0 5px 15px rgba(192, 132, 252, 0.3); }
        .city-card.visited-both:hover { transform: scale(1.08); box-shadow: 0 10px 20px rgba(192, 132, 252, 0.5); z-index: 10; }

        /* 5. Birlikte Gidildi (Nihai Hedef - Zümrüt Yeşili) */
        .city-card.visited-birlikte { background: linear-gradient(135deg, #10b981, #059669); color: white; border-color: #fbbf24; box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3); }
        .city-card.visited-birlikte:hover { transform: scale(1.08); box-shadow: 0 10px 20px rgba(16, 185, 129, 0.5); z-index: 10; }

        .plate-badge { font-size: 1.6rem; font-weight: 900; opacity: 0.9; margin-bottom: 2px; font-family: monospace;}
        .city-name { font-size: 0.85rem; font-weight: bold; text-align: center; padding: 0 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
        .check-icon { position: absolute; top: 5px; right: 8px; font-weight: bold; font-size: 1.1rem; color: #fff; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));}

        /* Modal (Pop-up) Stilleri */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(2, 6, 23, 0.9); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 2000; padding: 20px; }
        .modal-content { background: #0f172a; width: 100%; max-width: 450px; border-radius: 24px; padding: 30px; position: relative; border: 1px solid #1e293b; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .close-modal { position: absolute; top: 20px; right: 20px; background: transparent; border: none; color: #64748b; font-size: 1.5rem; cursor: pointer; transition: 0.2s; }
        .close-modal:hover { color: #ef4444; transform: rotate(90deg); }

        .modal-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; border-bottom: 1px solid #1e293b; padding-bottom: 15px; }
        .modal-plate { background: #f8fafc; color: #020617; font-size: 1.5rem; font-weight: 900; padding: 5px 15px; border-radius: 12px; font-family: monospace; border: 2px solid #94a3b8;}
        .modal-header h2 { margin: 0; color: #f8fafc; font-size: 1.8rem; }

        /* Çoklu Ziyaretçi Seçici */
        .visitor-multi-selector { display: flex; flex-wrap: wrap; gap: 10px;}
        .multi-btn { flex: 1; min-width: 45%; text-align: center; padding: 15px 10px; border-radius: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; font-size: 0.9rem; background: #020617; color: #64748b; border: 2px solid #334155; }
        .multi-btn:hover { border-color: #94a3b8; }
        .btn-full { flex: 100%; }
        
        .checked-ozgur { background: rgba(59, 130, 246, 0.1); color: #60a5fa; border-color: #3b82f6; box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);}
        .checked-nisa { background: rgba(236, 72, 153, 0.1); color: #f472b6; border-color: #ec4899; box-shadow: 0 0 15px rgba(236, 72, 153, 0.2);}
        .checked-birlikte { background: #10b981; color: white; border-color: #10b981; box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); transform: scale(1.02);}

        .visit-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { color: #cbd5e1; font-weight: bold; font-size: 0.9rem; }
        .form-group input, .form-group textarea { background: #020617; border: 1px solid #334155; padding: 12px; border-radius: 12px; color: white; outline: none; font-family: inherit; font-size: 1rem; transition: 0.2s; }
        .form-group input:focus, .form-group textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
        .form-group textarea { resize: vertical; min-height: 80px; }

        .modal-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
        .save-btn { background: #f8fafc; color: #020617; border: none; padding: 15px; border-radius: 12px; font-weight: 900; font-size: 1.1rem; cursor: pointer; transition: 0.2s; }
        .save-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(255,255,255,0.2); }
        .save-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .delete-btn { background: transparent; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 12px; border-radius: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .delete-btn:hover { background: #ef4444; color: white; }

        @media (max-width: 600px) {
          .hide-mobile { display: none; }
          .stats-grid { grid-template-columns: 1fr; gap: 10px; }
          .cities-grid { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 8px;}
          .city-card { height: 75px; border-radius: 12px;}
          .plate-badge { font-size: 1.3rem; }
          .city-name { font-size: 0.7rem; }
          .multi-btn { padding: 10px 5px; font-size: 0.8rem; }
        }
      `}</style>
    </div>
  );
}