import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();

  const menuItems = [
    {
      id: 'plan',
      title: 'Plan Yönetimi',
      description: 'Günlük etkinliklerini ve ajandanı düzenle.',
      icon: '📅',
      path: '/planlayici',
      color: '#3b82f6' // Mavi
    },
    {
      id: 'finans',
      title: 'Finans Yönetimi',
      description: 'Özgür & Nisa bütçe ve harcama takibi.',
      icon: '💰',
      path: '/finans',
      color: '#10b981' // Yeşil
    },
    {
      id: 'galeri',
      title: 'Anı Galerisi',
      description: 'Fotoğraflarını kategorize et ve sakla.',
      icon: '📸',
      path: '/galeri',
      color: '#ec4899' // Pembe
    },
    {
      id: 'ani-defteri',
      title: 'Anı Defteri',
      description: 'Günlük düşüncelerini ve özel anılarını yaz.',
      icon: '📓',
      path: '/ani-defteri',
      color: '#f59e0b' // Kehribar/Turuncu
    },
    {
      id: 'kutuphane',
      title: 'E-Kütüphane',
      description: 'Okuduğun ve okuyacağın kitapları takip et.',
      icon: '📚',
      path: '/kutuphane',
      color: '#8b5cf6' // Mor
    },
    {
      id: 'game',
      title: 'Oyun',
      description: 'Oyun oyna .',
      icon: '🎮',
      path: '/game',
      color: '#f87171' // kırmızı
    }
  ];

  return (
    <div className="hub-container">
      <Head>
        <title>Ana Sayfa</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/NÖ.png" sizes="any" />
      </Head>

      <main className="hub-content">
        <header className="hub-header">
          <img src="/NÖ.png" alt="Logo" className="hub-logo" />
          <h1>Ana Sayfa</h1>
          <p>Hoş geldin bugün ne yapmak istersin?</p>
        </header>

        <div className="card-grid">
          {menuItems.map((item) => (
            <div 
              key={item.id} 
              className="menu-card" 
              onClick={() => router.push(item.path)}
              style={{ '--hover-color': item.color }}
            >
              <div className="card-icon">{item.icon}</div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <div className="go-button">Git →</div>
            </div>
          ))}
        </div>

        <footer className="hub-footer">
          <button onClick={() => router.push('/')} className="logout-link">Oturumu Kapat</button>
        </footer>
      </main>

      <style jsx>{`
        .hub-container { 
          min-height: 100vh; 
          background: radial-gradient(circle at top, #1e293b 0%, #020617 100%); 
          color: white; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          padding: 20px; 
        }
        .hub-content { max-width: 900px; width: 100%; text-align: center; }
        .hub-header { margin-bottom: 50px; }
        .hub-logo { width: 80px; margin-bottom: 20px; filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5)); }
        .hub-header h1 { font-size: 2.5rem; font-weight: 800; margin: 0; }
        .hub-header p { color: #94a3b8; margin-top: 10px; }
        
        .card-grid { 
          display: grid; 
          /* 5 öğe olduğu için ekran genişliğine göre güzel dağılması adına auto-fit ideal */
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
          gap: 20px; 
        }
        
        .menu-card { 
          background: rgba(30, 41, 59, 0.5); 
          backdrop-filter: blur(10px); 
          padding: 30px; 
          border-radius: 24px; 
          border: 1px solid #334155; 
          cursor: pointer; 
          transition: 0.3s; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
        }
        .menu-card:hover { 
          transform: translateY(-10px); 
          border-color: var(--hover-color); 
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4); 
        }
        .card-icon { font-size: 2.5rem; margin-bottom: 15px; }
        .menu-card h2 { font-size: 1.3rem; margin-bottom: 10px; }
        .menu-card p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px; }
        .go-button { font-weight: bold; color: var(--hover-color); }
        
        .hub-footer { margin-top: 50px; }
        .logout-link { 
          background: transparent; 
          border: 1px solid #334155; 
          color: #64748b; 
          padding: 8px 20px; 
          border-radius: 10px; 
          cursor: pointer; 
          transition: 0.2s;
        }
        .logout-link:hover {
          background: #334155;
          color: white;
        }
        
        @media (max-width: 640px) { 
          .card-grid { grid-template-columns: 1fr; } 
        }
      `}</style>
    </div>
  );
}