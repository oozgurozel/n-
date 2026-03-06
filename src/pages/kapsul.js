import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function ZamanKapsulu() {
  const router = useRouter();
  const [player, setPlayer] = useState('');
  
  const [capsules, setCapsules] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  
  // Canlı Saat (Geri sayım için her saniye güncellenir)
  const [now, setNow] = useState(new Date());

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [unlockTime, setUnlockTime] = useState('00:00');
  const [target, setTarget] = useState('İkimiz');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Saniye sayacı
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (player) fetchCapsules();
  }, [player]);

  const fetchCapsules = async () => {
    const { data } = await supabase.from('zaman_kapsulu').select('*').order('unlock_date', { ascending: true });
    if (data) setCapsules(data);
  };

  const createCapsule = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullUnlockDate = new Date(`${unlockDate}T${unlockTime}:00`);

    if (fullUnlockDate <= new Date()) {
      alert("Hata! Kapsül sadece gelecekteki bir tarihe kilitlenebilir.");
      setIsSubmitting(false);
      return;
    }

    await supabase.from('zaman_kapsulu').insert([{
      creator: player,
      target_audience: target,
      title: title,
      secret_message: message,
      unlock_date: fullUnlockDate.toISOString()
    }]);

    setIsCreating(false);
    setTitle('');
    setMessage('');
    setUnlockDate('');
    setUnlockTime('00:00');
    await fetchCapsules();
    setIsSubmitting(false);
  };

  // Kapsül Silme Fonksiyonu
  const deleteCapsule = async (id) => {
    if (confirm("Bu mühürlü zaman kapsülünü kalıcı olarak yok etmek (silmek) istediğine emin misin?")) {
      await supabase.from('zaman_kapsulu').delete().eq('id', id);
      fetchCapsules(); 
    }
  };

  // Zaman Hesaplayıcı Motor
  const getRemainingTime = (targetDateString) => {
    const diff = new Date(targetDateString) - now;
    if (diff <= 0) return null; // Kilit açıldı
    
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);
    
    return `${d} Gün : ${h.toString().padStart(2, '0')} Saat : ${m.toString().padStart(2, '0')} Dk : ${s.toString().padStart(2, '0')} Sn`;
  };

  // --- KİMLİK SEÇİM EKRANI ---
  if (!player) {
    return (
      <div className="page-wrapper auth-bg">
        <Head><title>Giriş | Zaman Kapsülü</title></Head>
        <button className="back-btn" onClick={() => router.push('/anasayfa')}>← Ana Sayfa</button>
        <div className="glass-container">
          <h1 style={{color:'#6366f1', fontSize:'4rem', margin:'0 0 10px 0'}}>⏳</h1>
          <h2>Zaman Kapsülü</h2>
          <p style={{color:'#94a3b8', marginBottom:'30px'}}>Geleceğe kim not bırakıyor?</p>
          <button className="player-btn ozgur" onClick={() => setPlayer('Özgür')}>Özgür 🤵🏻‍♂️</button>
          <button className="player-btn nisa" onClick={() => setPlayer('Nisa')}>Nisa 👰🏻‍♀️</button>
        </div>
        <style jsx>{`
          .page-wrapper { min-height: 100vh; background: #020617; display: flex; justify-content: center; align-items: center; font-family: 'Inter', sans-serif;}
          .glass-container { background: #0f172a; padding: 40px; border-radius: 24px; text-align: center; border: 1px solid #1e293b; color: white; width: 100%; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.8);}
          .player-btn { width: 100%; padding: 15px; margin: 10px 0; border: none; border-radius: 12px; font-size: 1.2rem; font-weight: bold; cursor: pointer; transition: 0.2s; }
          .ozgur { background: #3b82f6; color: white; }
          .nisa { background: #ec4899; color: white; }
          .player-btn:hover { transform: scale(1.05); }
          .back-btn { position: fixed; top: 20px; left: 20px; background: #1e293b; color: white; border: 1px solid #334155; padding: 10px 20px; border-radius: 10px; cursor: pointer; z-index: 100;}
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Head><title>Zaman Kapsülü | NÖ OS</title></Head>

      <nav className="top-nav">
        <button className="back-btn" onClick={() => router.push('/anasayfa')}>
          <span>←</span> <span className="hide-mobile">Ana Sayfa</span>
        </button>
        <div className="user-badge">
          Kullanıcı: <strong>{player}</strong>
        </div>
      </nav>

      <div className="main-container">
        
        <header className="header-area fade-in">
          <div className="icon-glow">⏳</div>
          <h1>Geleceğe Mektuplar</h1>
          <p>Yazdıkların, belirlediğin tarih gelene kadar sandıkta kilitli kalacak.</p>
          
          {!isCreating && (
            <button className="new-capsule-btn" onClick={() => setIsCreating(true)}>
              + Yeni Bir Kapsül Mühürle
            </button>
          )}
        </header>

        {/* YENİ KAPSÜL OLUŞTURMA FORMU */}
        {isCreating && (
          <div className="create-form-wrapper pop-in">
            <div className="form-header">
              <h2>Gizli Mühür Odası 🔐</h2>
              <button className="close-form" onClick={() => setIsCreating(false)}>✕</button>
            </div>
            
            <form onSubmit={createCapsule} className="capsule-form">
              <div className="form-group">
                <label>Kapsülün Adı (Dışarıdan görünecek)</label>
                <input type="text" placeholder="Örn: Evliliğimizin 1. Yılı İçin..." value={title} onChange={e => setTitle(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Kime Gönderiyorsun?</label>
                <div className="target-selector">
                  <div className={`t-btn ${target === 'Özgür' ? 'active' : ''}`} onClick={() => setTarget('Özgür')}>🤵🏻‍♂️ Özgür'e</div>
                  <div className={`t-btn ${target === 'İkimiz' ? 'active' : ''}`} onClick={() => setTarget('İkimiz')}>👩‍❤️‍👨 İkimize</div>
                  <div className={`t-btn ${target === 'Nisa' ? 'active' : ''}`} onClick={() => setTarget('Nisa')}>👰🏻‍♀️ Nisa'ya</div>
                </div>
              </div>

              <div className="form-group">
                <label>Gizli Mesajın (Açılana kadar KİMSE okuyamaz)</label>
                <textarea rows="5" placeholder="Gelecekteki o güne notunu yaz..." value={message} onChange={e => setMessage(e.target.value)} required></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kilit Açılış Tarihi</label>
                  <input type="date" value={unlockDate} onChange={e => setUnlockDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Saati</label>
                  <input type="time" value={unlockTime} onChange={e => setUnlockTime(e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="seal-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Zincirleniyor...' : 'Kapsülü Mühürle ve Gönder ⛓️'}
              </button>
            </form>
          </div>
        )}

        {/* KAPSÜL LİSTESİ */}
        {!isCreating && (
          <div className="capsules-grid">
            {capsules.length === 0 && (
              <div className="empty-state">
                <p>Henüz geleceğe gönderilmiş bir mesaj yok. İlk kapsülü sen yarat!</p>
              </div>
            )}

            {capsules.map(capsule => {
              const remaining = getRemainingTime(capsule.unlock_date);
              const isUnlocked = remaining === null;
              
              // YENİ: Kapsülü silme yetkisi sadece oluşturan kişide var!
              const canDelete = capsule.creator === player; 

              return (
                <div key={capsule.id} className={`capsule-card ${isUnlocked ? 'unlocked-card' : 'locked-card'}`}>
                  
                  {/* Üst Bilgi ve (Sadece Yetkiliye Görünen) Sil Butonu */}
                  <div className="capsule-meta">
                    <div>
                      <span className="creator-badge">Gönderen: {capsule.creator}</span>
                      <span className="target-badge">Alıcı: {capsule.target_audience}</span>
                    </div>
                    
                    {/* Sadece Kapsülü Oluşturan Kişi Çöp Kutusunu Görür */}
                    {canDelete && (
                      <button className="delete-btn" onClick={() => deleteCapsule(capsule.id)} title="Kendi kapsülünü sil">
                        🗑️
                      </button>
                    )}
                  </div>
                  
                  <h3 className="capsule-title">{capsule.title}</h3>

                  {isUnlocked ? (
                    // KİLİDİ AÇILMIŞ KAPSÜL
                    <div className="unlocked-content pop-in">
                      <div className="unlock-icon">🔓 Işıklar Açıldı</div>
                      <div className="secret-message">
                        {capsule.secret_message}
                      </div>
                      <div className="date-info">
                        Kilit Açılış: {new Date(capsule.unlock_date).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  ) : (
                    // KİLİTLİ VE GERİ SAYAN KAPSÜL
                    <div className="locked-content">
                      <div className="chains">⛓️ 🔒 ⛓️</div>
                      <div className="countdown-box">
                        <span className="countdown-label">Açılmasına Kalan Süre</span>
                        <div className="countdown-timer">{remaining}</div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      <style jsx>{`
        .page-wrapper { min-height: 100vh; background: #020617; background-image: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #020617 70%); color: white; font-family: 'Inter', sans-serif; padding: 80px 20px 40px 20px; display: flex; justify-content: center; }
        
        .top-nav { position: fixed; top: 0; left: 0; width: 100%; padding: 15px 20px; background: rgba(2, 6, 23, 0.8); backdrop-filter: blur(10px); display: flex; justify-content: space-between; align-items: center; z-index: 1000; border-bottom: 1px solid #1e293b; }
        .back-btn { background: #1e293b; border: 1px solid #334155; color: #94a3b8; padding: 8px 15px; border-radius: 10px; cursor: pointer; display: flex; gap: 8px; align-items: center; font-weight: bold; transition: 0.2s; }
        .back-btn:hover { background: #6366f1; color: white; border-color: #6366f1; }
        .user-badge { background: rgba(99, 102, 241, 0.1); padding: 8px 15px; border-radius: 20px; font-size: 0.95rem; color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3);}

        .main-container { width: 100%; max-width: 700px; }

        .fade-in { animation: fadeIn 0.6s ease-out; }
        .pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }

        /* Üst Header */
        .header-area { text-align: center; margin-bottom: 40px; }
        .icon-glow { font-size: 4rem; filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.5)); margin-bottom: 10px; animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .header-area h1 { font-size: 2.5rem; margin: 0 0 10px 0; background: linear-gradient(90deg, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;}
        .header-area p { color: #94a3b8; font-size: 1.1rem; margin-bottom: 25px; }
        
        .new-capsule-btn { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; border: none; padding: 15px 30px; border-radius: 16px; font-weight: 900; font-size: 1.1rem; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4); }
        .new-capsule-btn:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 15px 35px rgba(79, 70, 229, 0.6); }

        /* Form Wrapper */
        .create-form-wrapper { background: #0f172a; padding: 30px; border-radius: 24px; border: 1px solid #312e81; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px dashed #334155; padding-bottom: 15px;}
        .form-header h2 { margin: 0; color: #818cf8; }
        .close-form { background: transparent; border: none; color: #64748b; font-size: 1.5rem; cursor: pointer; transition: 0.2s;}
        .close-form:hover { color: #ef4444; transform: rotate(90deg);}

        .capsule-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-row { display: flex; gap: 15px; }
        .form-row .form-group { flex: 1; }
        .form-group label { color: #cbd5e1; font-weight: bold; font-size: 0.9rem; }
        .form-group input, .form-group textarea { background: #020617; border: 1px solid #334155; padding: 15px; border-radius: 12px; color: white; font-family: inherit; outline: none; transition: 0.3s; font-size: 1rem;}
        .form-group input:focus, .form-group textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2); }
        .form-group textarea { resize: vertical; }

        .target-selector { display: flex; gap: 10px; background: #020617; padding: 5px; border-radius: 12px; border: 1px solid #334155;}
        .t-btn { flex: 1; text-align: center; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s; color: #64748b;}
        .t-btn.active { background: #6366f1; color: white; box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);}

        .seal-btn { background: #1e1b4b; color: #a5b4fc; border: 2px dashed #4f46e5; padding: 20px; border-radius: 16px; font-weight: 900; font-size: 1.2rem; cursor: pointer; transition: 0.3s; margin-top: 10px;}
        .seal-btn:hover { background: #4f46e5; color: white; border-style: solid; box-shadow: 0 10px 30px rgba(79, 70, 229, 0.5);}

        /* Kapsül Kartları */
        .capsules-grid { display: flex; flex-direction: column; gap: 20px; }
        .empty-state { text-align: center; color: #64748b; padding: 40px; border: 1px dashed #334155; border-radius: 20px; font-style: italic;}

        .capsule-card { background: #0f172a; border-radius: 20px; padding: 25px; transition: 0.3s; position: relative; overflow: hidden;}
        
        .capsule-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;}
        .creator-badge { color: #94a3b8; margin-right: 10px;}
        .target-badge { background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 10px; color: #cbd5e1; }
        
        /* Silme Butonu Stili */
        .delete-btn { background: transparent; border: none; font-size: 1.2rem; cursor: pointer; transition: 0.2s; filter: grayscale(1); opacity: 0.6; padding: 0;}
        .delete-btn:hover { filter: grayscale(0); opacity: 1; transform: scale(1.2); }

        .capsule-title { margin: 0 0 20px 0; font-size: 1.4rem; color: #f8fafc; }

        /* Kilitli Durum */
        .locked-card { border: 2px solid #312e81; }
        .locked-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 20px); pointer-events: none; opacity: 0.5;}
        
        .chains { font-size: 2.5rem; text-align: center; margin-bottom: 15px; letter-spacing: 5px; filter: drop-shadow(0 5px 5px rgba(0,0,0,0.5));}
        .countdown-box { background: #020617; padding: 20px; border-radius: 16px; text-align: center; border: 1px solid #334155; position: relative; z-index: 2;}
        .countdown-label { color: #ef4444; font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 8px;}
        .countdown-timer { color: #f8fafc; font-size: 1.6rem; font-family: monospace; font-weight: bold; text-shadow: 0 0 15px rgba(239, 68, 68, 0.5);}

        /* Kilit Açık Durum (Mesaj Okunabilir) */
        .unlocked-card { border: 2px solid #fbbf24; background: linear-gradient(180deg, rgba(251, 191, 36, 0.05) 0%, #0f172a 100%); box-shadow: 0 10px 30px rgba(251, 191, 36, 0.15);}
        .unlock-icon { color: #fbbf24; font-weight: bold; margin-bottom: 15px; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;}
        .secret-message { background: rgba(0,0,0,0.4); padding: 20px; border-radius: 16px; border-left: 4px solid #fbbf24; font-size: 1.1rem; line-height: 1.6; color: #f8fafc; font-style: italic; white-space: pre-wrap;}
        .date-info { margin-top: 15px; text-align: right; font-size: 0.8rem; color: #64748b; font-weight: bold;}

        @media (max-width: 600px) {
          .hide-mobile { display: none; }
          .header-area h1 { font-size: 2rem; }
          .form-row { flex-direction: column; }
          .t-btn { padding: 10px 5px; font-size: 0.9rem;}
          .countdown-timer { font-size: 1.2rem; }
        }
      `}</style>
    </div>
  );
}