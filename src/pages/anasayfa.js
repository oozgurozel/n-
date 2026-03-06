import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [time, setTime] = useState(new Date());

  // Canlı Saat
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Dinamik Selamlama
  const getGreeting = () => {
    const hour = time.getHours();
    if (hour >= 5 && hour < 12) return 'Günaydın ☀️';
    if (hour >= 12 && hour < 18) return 'Tünaydın 🌤️';
    if (hour >= 18 && hour < 22) return 'İyi Akşamlar 🌙';
    return 'İyi Geceler ✨';
  };

  // UYGULAMALAR (size parametresi ile bento grid boyutları belirleniyor)
  const menuItems = [
    {
      id: 'bitki', title: 'Ortak Bitki', description: 'Bahçemiz ilgi bekliyor.', icon: '🪴', path: '/bitki', color: '#10b981', size: 'large' 
    },
    {
      id: 'soru', title: 'Günün Sorusu', description: 'Bugünün kilidini kır!', icon: '💌', path: '/soru', color: '#ec4899', size: 'wide'
    },
    {
      id: 'ask-yuvasi', title: 'Aşk Yuvası', description: 'Evimizi diziyoruz.', icon: '🏡', path: '/yuva', color: '#f43f5e', size: 'wide'
    },
    {
      id: 'kesif', title: 'Keşif Haritası', description: 'Fethedilen şehirler.', icon: '🌍', path: '/kesif', color: '#3b82f6', size: 'wide'
    },
    {
      id: 'pulse', title: 'Titret', description: 'Ona hissettir.', icon: '⚡', path: '/titresim', color: '#06b6d4', size: 'small'
    },
    {
      id: 'plan', title: 'Ajanda', description: 'Ortak takvim.', icon: '📅', path: '/planlayici', color: '#6366f1', size: 'small'
    },
    {
      id: 'finans', title: 'Bütçe', description: 'Ortak kasa.', icon: '💰', path: '/finans', color: '#14b8a6', size: 'small'
    },
    {
      id: 'galeri', title: 'Galeri', description: 'Anılarımız.', icon: '📸', path: '/galeri', color: '#d946ef', size: 'small'
    },
    {
      id: 'ani-defteri', title: 'Defter', description: 'Günlüğümüz.', icon: '📓', path: '/ani-defteri', color: '#f59e0b', size: 'small'
    },
    {
      id: 'akademi', title: 'Akademi', description: 'Eğitim & Sınav.', icon: '🎓', path: '/akademi', color: '#8b5cf6', size: 'small'
    },
    {
      id: 'hukuk', title: 'Duruşma', description: 'Kanun testi.', icon: '⚖️', path: '/hukukgame', color: '#fbbf24', size: 'small'
    },
    {
      id: 'kutuphane', title: 'Kitaplık', description: 'Okunanlar.', icon: '📚', path: '/kutuphane', color: '#a855f7', size: 'small'
    },
    {
      id: 'game', title: 'Eşleştir', description: 'Hafıza oyunu.', icon: '🧩', path: '/game', color: '#f87171', size: 'small'
    },
    {
      id: 'game2', title: 'Soru Sor', description: 'Puan topla.', icon: '💡', path: '/game2', color: '#ffea00', size: 'small'
    },
    {
      id: 'cark', title: 'Çark', description: 'Şansını dene.', icon: '🎡', path: '/cark', color: '#ff9500', size: 'small'
    },
    {
      id: 'kapsul', 
      title: 'Zaman Kapsülü', 
      description: 'Geleceğe mühürlü mektuplar.', 
      icon: '⏳', 
      path: '/kapsul', 
      color: '#6366f1', 
      size: 'wide'
    }
  ];

  return (
    <div className="hub-container">
      <Head>
        <title>NÖ OS | Ana Sayfa</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/NÖ.png" sizes="any" />
      </Head>

      <main className="hub-content fade-in">
        
        {/* ÜST BİLGİ PANELİ (Widget) */}
        <header className="hero-widget">
          <div className="hero-left">
            <img src="/NÖ.png" alt="Logo" className="hero-logo" />
            <div className="hero-text">
              <h1>{getGreeting()}</h1>
              <p>NÖ Ekosistemine Hoş Geldin.</p>
            </div>
          </div>
          <div className="hero-right">
            <div className="live-clock">
              {time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="live-date">
              {time.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
            </div>
          </div>
        </header>

        {/* BENTO GRID (YENİ TASARIM MANTIĞI) */}
        <div className="bento-grid">
          {menuItems.map((item) => (
            <div 
              key={item.id} 
              className={`bento-card ${item.size}`} 
              onClick={() => router.push(item.path)}
              style={{ '--theme-color': item.color }}
            >
              <div className="card-bg-glow"></div>
              <div className="card-inner">
                <div className="icon-wrapper">{item.icon}</div>
                <div className="text-wrapper">
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </div>
                <div className="go-arrow">↗</div>
              </div>
            </div>
          ))}
        </div>

        <footer className="hub-footer">
          <button onClick={() => router.push('/')} className="logout-link">Sistemden Çıkış Yap</button>
        </footer>
      </main>

      <style jsx>{`
        .hub-container { 
          min-height: 100vh; 
          background: #020617; 
          background-image: radial-gradient(circle at 50% 0%, #1e293b 0%, #020617 60%);
          color: white; 
          display: flex; 
          justify-content: center; 
          padding: 40px 20px; 
          font-family: 'Inter', sans-serif;
        }
        
        .hub-content { max-width: 1000px; width: 100%; }

        .fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* HERO WIDGET (Dinamik Üst Panel) */
        .hero-widget { 
          background: rgba(15, 23, 42, 0.6); 
          backdrop-filter: blur(20px); 
          border: 1px solid rgba(255, 255, 255, 0.05); 
          border-radius: 30px; 
          padding: 30px 40px; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 40px; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .hero-left { display: flex; align-items: center; gap: 20px; }
        .hero-logo { width: 70px; height: 70px; border-radius: 20px; filter: drop-shadow(0 0 15px rgba(255,255,255,0.2)); }
        .hero-text h1 { margin: 0; font-size: 2rem; font-weight: 800; background: linear-gradient(90deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-text p { margin: 5px 0 0 0; color: #94a3b8; font-size: 1rem; font-weight: 500; }
        
        .hero-right { text-align: right; }
        .live-clock { font-size: 2.5rem; font-weight: 900; color: #f8fafc; letter-spacing: -1px; line-height: 1; }
        .live-date { color: #3b82f6; font-size: 0.95rem; font-weight: bold; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px; }

        /* BENTO GRID SİSTEMİ */
        .bento-grid { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          grid-auto-rows: minmax(130px, auto);
          gap: 20px; 
        }
        
        /* Boyut Sınıfları */
        .small { grid-column: span 1; }
        .wide { grid-column: span 2; }
        .large { grid-column: span 2; grid-row: span 2; }

        /* Bento Kart Tasarımı */
        .bento-card { 
          position: relative; 
          background: #0f172a; 
          border-radius: 24px; 
          border: 1px solid #1e293b; 
          cursor: pointer; 
          overflow: hidden; 
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
          display: flex;
        }
        
        /* İçerik Düzeni */
        .card-inner { 
          padding: 25px; 
          display: flex; 
          flex-direction: column; 
          justify-content: flex-end; 
          width: 100%; 
          z-index: 2; 
          position: relative;
        }
        
        /* Boyutlara Göre İçerik Ayarları */
        .small .card-inner { align-items: center; text-align: center; justify-content: center; padding: 20px;}
        .small .icon-wrapper { font-size: 2.5rem; margin-bottom: 10px; }
        .small h2 { font-size: 1rem; margin: 0; }
        .small p { display: none; } /* Küçüklerde açıklama gizli */
        .small .go-arrow { display: none; }

        .wide .card-inner { flex-direction: row; align-items: center; justify-content: space-between; }
        .wide .icon-wrapper { font-size: 3rem; margin-right: 20px; }
        .wide .text-wrapper { flex: 1; }
        
        .large .card-inner { justify-content: space-between; align-items: flex-start;}
        .large .icon-wrapper { font-size: 4.5rem; }
        .large h2 { font-size: 2rem; margin-bottom: 5px;}
        .large p { font-size: 1.1rem; opacity: 0.8; }

        .bento-card h2 { margin: 0 0 5px 0; font-size: 1.3rem; color: #f8fafc; transition: color 0.3s; }
        .bento-card p { margin: 0; color: #94a3b8; font-size: 0.9rem; }
        
        .go-arrow { font-size: 1.5rem; color: #64748b; font-weight: bold; opacity: 0; transform: translateX(-10px); transition: 0.3s; }

        /* Arka Plan Glow Efekti (Hover) */
        .card-bg-glow { 
          position: absolute; top: 0; left: 0; right: 0; bottom: 0; 
          background: radial-gradient(circle at 50% 150%, var(--theme-color) 0%, transparent 60%); 
          opacity: 0; transition: opacity 0.4s ease; z-index: 1; 
        }

        /* Hover Etkileşimleri */
        .bento-card:hover { transform: translateY(-5px) scale(1.02); border-color: var(--theme-color); box-shadow: 0 15px 30px rgba(0,0,0,0.5); }
        .bento-card:hover .card-bg-glow { opacity: 0.15; }
        .bento-card:hover h2 { color: var(--theme-color); }
        .bento-card:hover .go-arrow { opacity: 1; transform: translateX(0); color: var(--theme-color); }
        .bento-card:hover .icon-wrapper { transform: scale(1.1) rotate(5deg); transition: 0.3s; }

        /* Çıkış Butonu */
        .hub-footer { margin-top: 50px; text-align: center; }
        .logout-link { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 12px 30px; border-radius: 15px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .logout-link:hover { background: #ef4444; color: white; }

        /* MOBİL UYUM (Sihir Burada) */
        @media (max-width: 800px) {
          .bento-grid { grid-template-columns: repeat(2, 1fr); }
          .large { grid-column: span 2; grid-row: span 1; }
          .large .card-inner { flex-direction: row; align-items: center; }
          .large .icon-wrapper { font-size: 3rem; margin-right: 15px;}
          .large h2 { font-size: 1.5rem; }
          .large p { display: none; }
        }

        @media (max-width: 600px) {
          .hero-widget { flex-direction: column; text-align: center; gap: 20px; padding: 25px; }
          .hero-left { flex-direction: column; gap: 10px; }
          .hero-right { text-align: center; }
          
          .wide .icon-wrapper { font-size: 2rem; margin-right: 15px; }
          .wide h2 { font-size: 1.1rem; }
          .wide p { font-size: 0.8rem; }
        }
      `}</style>
    </div>
  );
}