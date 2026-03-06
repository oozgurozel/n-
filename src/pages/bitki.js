import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function OrtakBitki() {
  const router = useRouter();
  const [player, setPlayer] = useState('');
  const [plant, setPlant] = useState(null);
  const [isWatering, setIsWatering] = useState(false);
  const [isLoving, setIsLoving] = useState(false);

  useEffect(() => {
    if (player) fetchPlant();
  }, [player]);

  const fetchPlant = async () => {
    const { data, error } = await supabase.from('virtual_plant').select('*').eq('id', 1).single();
    
    if (data) {
      // ZAMAN AŞIMI HESAPLAMASI (Bitki ne kadar süredir susuz/ilgisiz?)
      const lastUpdate = new Date(data.updated_at);
      const now = new Date();
      const hoursPassed = Math.floor((now - lastUpdate) / (1000 * 60 * 60));

      let currentWater = data.water_level;
      let currentLove = data.love_level;

      // Her saat başı 2 puan azalır
      if (hoursPassed > 0) {
        currentWater = Math.max(0, currentWater - (hoursPassed * 2));
        currentLove = Math.max(0, currentLove - (hoursPassed * 2));
        
        // Eğer azalma varsa veritabanını da güncelle
        if (currentWater !== data.water_level || currentLove !== data.love_level) {
          await supabase.from('virtual_plant').update({
            water_level: currentWater,
            love_level: currentLove,
            updated_at: new Date().toISOString()
          }).eq('id', 1);
        }
      }

      setPlant({ ...data, water_level: currentWater, love_level: currentLove });
    }
  };

  // --- ETKİLEŞİM FONKSİYONLARI ---
  const waterPlant = async () => {
    if (!plant || plant.water_level >= 100) return;
    setIsWatering(true);
    
    const newWater = Math.min(100, plant.water_level + 20);
    const newXp = plant.xp + 10; // Her sulama XP kazandırır
    
    // UI'ı anında güncelle
    setPlant({ ...plant, water_level: newWater, xp: newXp, last_watered_by: player });

    // Bulutu güncelle
    await supabase.from('virtual_plant').update({
      water_level: newWater,
      xp: newXp,
      last_watered_by: player,
      updated_at: new Date().toISOString()
    }).eq('id', 1);

    setTimeout(() => setIsWatering(false), 1500);
  };

  const lovePlant = async () => {
    if (!plant || plant.love_level >= 100) return;
    setIsLoving(true);
    
    const newLove = Math.min(100, plant.love_level + 20);
    const newXp = plant.xp + 10;
    
    setPlant({ ...plant, love_level: newLove, xp: newXp, last_loved_by: player });

    await supabase.from('virtual_plant').update({
      love_level: newLove,
      xp: newXp,
      last_loved_by: player,
      updated_at: new Date().toISOString()
    }).eq('id', 1);

    setTimeout(() => setIsLoving(false), 1500);
  };

  // --- BİTKİ EVRİMİ (XP'ye göre şekil değiştirir) ---
  const getPlantVisual = () => {
    if (!plant) return '🌱';
    
    // Eğer susuzluk veya sevgisizlik sınırındaysa solar!
    if (plant.water_level < 20 || plant.love_level < 20) return '🥀';

    if (plant.xp < 100) return '🌱'; // Tohum/Filiz
    if (plant.xp < 300) return '🌿'; // Küçük Bitki
    if (plant.xp < 600) return '🪴'; // Saksı Çiçeği
    if (plant.xp < 1000) return '🌳'; // Büyük Ağaç
    return '🌸'; // Efsanevi Çiçek Açmış Ağaç
  };

  const getPlantStatus = () => {
    if (!plant) return 'Yükleniyor...';
    if (plant.water_level < 20) return 'Çok susadım, kuruyorum! 🏜️';
    if (plant.love_level < 20) return 'İlgiye ihtiyacım var! 💔';
    if (plant.water_level > 80 && plant.love_level > 80) return 'Harika hissediyorum! ✨';
    return 'Büyümeye devam ediyorum... 🍃';
  };

  // --- KİMLİK SEÇİM EKRANI ---
  if (!player) {
    return (
      <div className="page-wrapper auth-bg">
        <Head><title>Giriş | Yaşayan Bahçe</title></Head>
        <button className="back-btn" onClick={() => router.push('/anasayfa')}>← Ana Sayfa</button>
        <div className="glass-container">
          <h1 style={{fontSize:'4rem', margin:'0 0 10px 0'}}>🪴</h1>
          <h2>Ortak Bitkimiz</h2>
          <p style={{color:'#94a3b8', marginBottom:'30px'}}>Bahçeye kim giriyor?</p>
          <button className="player-btn ozgur" onClick={() => setPlayer('Özgür')}>Özgür 👨🏻‍🌾</button>
          <button className="player-btn nisa" onClick={() => setPlayer('Nisa')}>Nisa 👩🏻‍🌾</button>
        </div>
        <style jsx>{`
          .page-wrapper { min-height: 100vh; background: #020617; display: flex; justify-content: center; align-items: center; font-family: 'Inter', sans-serif;}
          .glass-container { background: #0f172a; padding: 40px; border-radius: 24px; text-align: center; border: 1px solid #1e293b; color: white; width: 100%; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);}
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
    <div className={`page-wrapper ${plant?.water_level < 20 || plant?.love_level < 20 ? 'danger-bg' : ''}`}>
      <Head><title>Yaşayan Bahçemiz 🪴</title></Head>

      <nav className="top-nav">
        <button className="back-btn" onClick={() => router.push('/anasayfa')}>
          <span>←</span> <span className="hide-mobile">Ana Sayfa</span>
        </button>
        <div className="user-badge">
          Bahçıvan: <strong>{player}</strong>
        </div>
      </nav>

      {plant && (
        <div className="main-container fade-in">
          
          {/* İSİM VE XP BARI */}
          <div className="plant-header">
            <h1>{plant.name}</h1>
            <p className="status-text">{getPlantStatus()}</p>
            
            <div className="xp-container">
              <span className="xp-label">Tecrübe (XP): {plant.xp}</span>
              <div className="xp-bar-bg">
                <div className="xp-bar-fill" style={{ width: `${Math.min(100, (plant.xp % 300) / 3)}%` }}></div>
              </div>
              <span className="level-text">Seviye {Math.floor(plant.xp / 300) + 1}</span>
            </div>
          </div>

          {/* BİTKİ GÖRSEL ALANI (İnteraktif) */}
          <div className="plant-stage">
            <div className={`sun ${isLoving ? 'glow' : ''}`}>☀️</div>
            
            {/* Sulama Animasyonu */}
            {isWatering && <div className="water-drops">💧💧💧</div>}
            
            {/* Sevgi Animasyonu */}
            {isLoving && <div className="love-hearts">❤️❤️❤️</div>}

            <div className={`plant-emoji ${plant.water_level < 20 || plant.love_level < 20 ? 'sad-shake' : 'happy-bounce'}`}>
              {getPlantVisual()}
            </div>
            <div className="ground"></div>
          </div>

          {/* İHTİYAÇ BARLARI VE BUTONLAR */}
          <div className="controls-panel">
            
            {/* Su Kontrolü */}
            <div className="stat-card">
              <div className="stat-info">
                <span>Su Seviyesi 💧</span>
                <strong>%{plant.water_level}</strong>
              </div>
              <div className="stat-bar-bg">
                <div className={`stat-bar-fill bg-blue ${plant.water_level < 30 ? 'bg-red' : ''}`} style={{ width: `${plant.water_level}%` }}></div>
              </div>
              <button 
                className="action-btn btn-water" 
                onClick={waterPlant}
                disabled={plant.water_level >= 100 || isWatering}
              >
                {plant.water_level >= 100 ? 'Suya Doydu 🌊' : 'Sula 💧'}
              </button>
              {plant.last_watered_by && <span className="last-action">En son: {plant.last_watered_by}</span>}
            </div>

            {/* Sevgi Kontrolü */}
            <div className="stat-card">
              <div className="stat-info">
                <span>Sevgi & İlgi ❤️</span>
                <strong>%{plant.love_level}</strong>
              </div>
              <div className="stat-bar-bg">
                <div className={`stat-bar-fill bg-pink ${plant.love_level < 30 ? 'bg-red' : ''}`} style={{ width: `${plant.love_level}%` }}></div>
              </div>
              <button 
                className="action-btn btn-love" 
                onClick={lovePlant}
                disabled={plant.love_level >= 100 || isLoving}
              >
                {plant.love_level >= 100 ? 'Sevgiye Doydu 💖' : 'Sevgi Göster ❤️'}
              </button>
              {plant.last_loved_by && <span className="last-action">En son: {plant.last_loved_by}</span>}
            </div>

          </div>
        </div>
      )}

      <style jsx>{`
        .page-wrapper { min-height: 100vh; background: #020617; color: white; font-family: 'Inter', sans-serif; padding: 80px 20px 40px 20px; display: flex; justify-content: center; transition: background 1s ease; }
        .danger-bg { background: #450a0a !important; } /* Bitki ölüyorsa arka plan kızarır */
        
        .top-nav { position: fixed; top: 0; left: 0; width: 100%; padding: 15px 20px; background: rgba(2, 6, 23, 0.8); backdrop-filter: blur(10px); display: flex; justify-content: space-between; align-items: center; z-index: 1000; border-bottom: 1px solid #1e293b; }
        .back-btn { background: #1e293b; border: 1px solid #334155; color: #94a3b8; padding: 8px 15px; border-radius: 10px; cursor: pointer; display: flex; gap: 8px; align-items: center; font-weight: bold; transition: 0.2s; }
        .back-btn:hover { background: #10b981; color: white; border-color: #10b981; }
        .user-badge { background: rgba(16, 185, 129, 0.1); padding: 8px 15px; border-radius: 20px; font-size: 0.95rem; color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);}

        .main-container { width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 30px;}
        .fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }

        /* Başlık ve XP */
        .plant-header { text-align: center; background: #0f172a; padding: 25px; border-radius: 24px; border: 1px solid #1e293b; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .plant-header h1 { margin: 0 0 5px 0; color: #10b981; font-size: 2.2rem; }
        .status-text { color: #fbbf24; font-weight: bold; font-size: 1.1rem; margin-bottom: 20px; }
        
        .xp-container { text-align: left; }
        .xp-label { font-size: 0.85rem; color: #94a3b8; font-weight: bold; }
        .xp-bar-bg { width: 100%; height: 10px; background: #1e293b; border-radius: 5px; overflow: hidden; margin: 5px 0; }
        .xp-bar-fill { height: 100%; background: linear-gradient(90deg, #fbbf24, #f59e0b); transition: width 0.5s ease-out; }
        .level-text { font-size: 0.8rem; color: #fbbf24; font-weight: bold; float: right; }

        /* Bitki Görsel Sahnesi */
        .plant-stage { position: relative; height: 300px; background: linear-gradient(to bottom, #0ea5e9 0%, #38bdf8 50%, #0f172a 100%); border-radius: 30px; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; overflow: hidden; border: 2px solid #334155; box-shadow: inset 0 0 50px rgba(0,0,0,0.3); }
        .danger-bg .plant-stage { background: linear-gradient(to bottom, #450a0a 0%, #7f1d1d 50%, #0f172a 100%); filter: grayscale(0.5); }
        
        .sun { position: absolute; top: 20px; right: 20px; font-size: 3rem; transition: 0.5s; filter: drop-shadow(0 0 20px #fbbf24); }
        .sun.glow { transform: scale(1.3); filter: drop-shadow(0 0 40px #fbbf24); }
        
        .plant-emoji { font-size: 8rem; z-index: 10; margin-bottom: -10px; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.5)); transition: font-size 0.5s; }
        
        .happy-bounce { animation: bounce 3s infinite ease-in-out; }
        .sad-shake { animation: shake 0.5s infinite; filter: grayscale(1) !important; }
        
        @keyframes bounce { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-10px) scale(1.02); } }
        @keyframes shake { 0% { transform: translateX(0); } 25% { transform: translateX(-2px) rotate(-2deg); } 75% { transform: translateX(2px) rotate(2deg); } }

        .ground { width: 150%; height: 50px; background: #451a03; border-radius: 50% 50% 0 0; position: absolute; bottom: -20px; z-index: 5; }

        /* Animasyon Efektleri (Su ve Kalp) */
        .water-drops { position: absolute; top: 30%; font-size: 2rem; animation: rain 1s ease-in forwards; z-index: 20; }
        .love-hearts { position: absolute; top: 30%; font-size: 2rem; animation: floatUp 1.5s ease-out forwards; z-index: 20; }
        
        @keyframes rain { 0% { transform: translateY(-50px); opacity: 1; } 100% { transform: translateY(100px); opacity: 0; } }
        @keyframes floatUp { 0% { transform: translateY(0) scale(0.8); opacity: 1; } 100% { transform: translateY(-100px) scale(1.5); opacity: 0; } }

        /* Kontrol Paneli */
        .controls-panel { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .stat-card { background: #0f172a; padding: 20px; border-radius: 20px; border: 1px solid #1e293b; display: flex; flex-direction: column; justify-content: space-between; }
        
        .stat-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; color: #cbd5e1; font-weight: bold; font-size: 0.9rem; }
        .stat-info strong { font-size: 1.1rem; color: white; }
        
        .stat-bar-bg { width: 100%; height: 15px; background: #020617; border-radius: 8px; overflow: hidden; margin-bottom: 15px; border: 1px solid #334155; }
        .stat-bar-fill { height: 100%; transition: width 0.5s ease, background 0.3s ease; }
        .bg-blue { background: #3b82f6; }
        .bg-pink { background: #ec4899; }
        .bg-red { background: #ef4444 !important; }

        .action-btn { width: 100%; padding: 15px; border: none; border-radius: 12px; font-weight: 900; font-size: 1rem; cursor: pointer; transition: 0.2s; color: white; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
        .btn-water { background: linear-gradient(135deg, #0ea5e9, #3b82f6); }
        .btn-water:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(59, 130, 246, 0.4); }
        .btn-love { background: linear-gradient(135deg, #f43f5e, #ec4899); }
        .btn-love:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(236, 72, 153, 0.4); }
        
        .action-btn:disabled { background: #1e293b; color: #64748b; cursor: not-allowed; box-shadow: none; transform: none; }

        .last-action { display: block; text-align: center; margin-top: 10px; font-size: 0.75rem; color: #64748b; font-style: italic; }

        @media (max-width: 500px) {
          .hide-mobile { display: none; }
          .controls-panel { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}