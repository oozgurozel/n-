import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function KararCarki() {
  const router = useRouter(); 
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState('');
  const [mustSpin, setMustSpin] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rotation, setRotation] = useState(0);

  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#eab308'];

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    const { data } = await supabase.from('wheel_options').select('*').order('id', { ascending: true });
    setOptions(data || []);
  };

  const addOption = async (e) => {
    e.preventDefault();
    if (!newOption || options.length >= 12) return;
    await supabase.from('wheel_options').insert([{ option_text: newOption.trim() }]);
    setNewOption('');
    fetchOptions();
  };

  const deleteOption = async (id) => {
    await supabase.from('wheel_options').delete().eq('id', id);
    fetchOptions();
  };

  const spinWheel = () => {
    if (options.length < 2) return alert("Çevirmek için en az 2 seçenek eklemelisin!");
    if (mustSpin) return;

    setWinner(null);
    setMustSpin(true);

    const randomShift = Math.floor(Math.random() * 360);
    const extraDegrees = 1800 + randomShift; 
    const newRotation = rotation + extraDegrees;
    
    setRotation(newRotation);

    setTimeout(() => {
      const sliceSize = 360 / options.length;
      const finalDegree = newRotation % 360;
      
      const index = Math.floor((360 - finalDegree) / sliceSize) % options.length;
      
      setWinner(options[index].option_text);
      setMustSpin(false);
    }, 4000); 
  };

  const sliceSize = options.length > 0 ? 360 / options.length : 360;

  return (
    <div className="wheel-page">
      <Head><title>Karar Çarkı | Kaderini Seç</title></Head>

      {/* EKRANIN SOL ÜST KÖŞESİNE SABİTLENMİŞ BUTON */}
      <button className="back-btn" onClick={() => router.push('/anasayfa')}>
        <span>←</span> <span className="hide-mobile">Ana Sayfa</span>
      </button>

      <div className="main-container">
        <h1 className="title">🎡 Karar Çarkı</h1>
        
        <div className="wheel-wrapper">
          <div className="pointer">▼</div>
          
          <div className="wheel-outer">
            <div className="wheel" style={{ 
              transform: `rotate(${rotation}deg)`,
              background: options.length > 0 
                ? `conic-gradient(${options.map((_, i) => `${colors[i % colors.length]} ${i * sliceSize}deg ${(i + 1) * sliceSize}deg`).join(', ')})` 
                : '#1e293b'
            }}>
              {options.map((opt, i) => (
                <div key={opt.id} className="option-label" style={{ 
                  transform: `rotate(${(i * sliceSize) + (sliceSize / 2) - 90}deg)` 
                }}>
                  <span>{opt.option_text}</span>
                </div>
              ))}
            </div>
            
            <div className="center-dot" onClick={spinWheel}>
              <div className="center-inner">
                {mustSpin ? '...' : 'ÇEVİR'}
              </div>
            </div>
          </div>
        </div>

        <div className={`winner-box ${winner ? 'show' : ''}`}>
          <p>Kaderin Seçimi:</p>
          <h2>{winner || '???'}</h2>
        </div>

        <div className="controls">
          <form onSubmit={addOption} className="add-form">
            <input 
              placeholder="Yeni seçenek ekle..." 
              value={newOption} 
              onChange={e=>setNewOption(e.target.value)}
              disabled={mustSpin || options.length >= 12}
            />
            <button type="submit" disabled={mustSpin || options.length >= 12}>+</button>
          </form>

          <div className="options-list">
            {options.map(opt => (
              <div key={opt.id} className="option-chip">
                <span className="chip-text">{opt.option_text}</span>
                <button onClick={() => deleteOption(opt.id)} disabled={mustSpin}>✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .wheel-page { min-height: 100vh; background: #020617; color: white; padding: 20px; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; }
        
        /* GERİ DÖN BUTONU EKRANIN SOL ÜSTÜNE ÇİVİLENDİ */
        .back-btn { 
          position: absolute; 
          top: 20px; 
          left: 20px; 
          background: #1e293b; 
          border: 1px solid #334155; 
          color: #94a3b8; 
          padding: 10px 18px; 
          border-radius: 12px; 
          cursor: pointer; 
          display: flex; 
          gap: 8px; 
          align-items: center; 
          font-weight: 600; 
          transition: 0.2s; 
          z-index: 1000;
        }
        .back-btn:hover { background: #3b82f6; color: white; border-color: #3b82f6; }

        .main-container { width: 100%; max-width: 400px; text-align: center; display: flex; flex-direction: column; align-items: center; margin-top: 40px; }
        .title { color: #f8fafc; font-weight: 800; font-size: 2rem; margin-top: 0; margin-bottom: 30px; text-shadow: 0 4px 15px rgba(255,255,255,0.1); }
        
        .wheel-wrapper { position: relative; margin: 0 auto 30px; width: 320px; height: 320px; }
        
        .pointer { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); z-index: 100; font-size: 2.5rem; color: #ef4444; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5)); }
        
        .wheel-outer { width: 100%; height: 100%; border: 8px solid #1e293b; border-radius: 50%; position: relative; box-shadow: 0 0 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.5); }
        
        .wheel { width: 100%; height: 100%; border-radius: 50%; position: relative; transition: transform 4s cubic-bezier(0.15, 0, 0.15, 1); overflow: hidden; border: 2px solid rgba(255,255,255,0.05); }
        
        .option-label { position: absolute; width: 50%; height: 20px; top: 50%; left: 50%; margin-top: -10px; transform-origin: left center; display: flex; align-items: center; justify-content: flex-end; padding-right: 25px; color: white; font-weight: 800; text-shadow: 1px 1px 3px rgba(0,0,0,0.9); z-index: 10; }
        .option-label span { font-size: 0.85rem; max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .center-dot { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 70px; height: 70px; background: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 110; border: 6px solid #1e293b; box-shadow: 0 4px 15px rgba(0,0,0,0.5); transition: transform 0.2s; }
        .center-dot:active { transform: translate(-50%, -50%) scale(0.95); }
        
        .center-inner { color: #0f172a; font-weight: 900; font-size: 0.85rem; letter-spacing: 0.5px; }

        .winner-box { margin-bottom: 25px; padding: 20px; border: 2px dashed #334155; border-radius: 20px; background: rgba(15, 23, 42, 0.5); transition: 0.3s; opacity: 0.5; width: 100%; box-sizing: border-box; }
        .winner-box.show { border-color: #f59e0b; background: rgba(245, 158, 11, 0.1); opacity: 1; transform: scale(1.05); box-shadow: 0 10px 25px rgba(245, 158, 11, 0.2); }
        .winner-box p { margin: 0; font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
        .winner-box.show p { color: #fcd34d; }
        .winner-box h2 { margin: 5px 0 0 0; color: #ffffff; font-size: 2rem; font-weight: 900; }
        .winner-box.show h2 { color: #f59e0b; }

        .controls { width: 100%; }
        .add-form { display: flex; gap: 8px; margin-bottom: 20px; }
        .add-form input { flex: 1; padding: 14px; border-radius: 14px; border: 1px solid #334155; background: #0f172a; color: white; font-size: 1rem; outline: none; transition: 0.2s; }
        .add-form input:focus { border-color: #3b82f6; }
        .add-form button { background: #3b82f6; color: white; padding: 0 20px; border-radius: 14px; border: none; font-size: 1.5rem; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .add-form button:hover:not(:disabled) { background: #2563eb; }
        .add-form button:disabled { background: #1e293b; color: #475569; cursor: not-allowed; }

        .options-list { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        .option-chip { background: #1e293b; padding: 8px 14px; border-radius: 20px; display: flex; align-items: center; gap: 10px; border: 1px solid rgba(255,255,255,0.05); }
        .chip-text { font-size: 0.85rem; font-weight: 600; color: #e2e8f0; }
        .option-chip button { background: none; border: none; color: #ef4444; cursor: pointer; font-weight: bold; padding: 0; font-size: 1rem; }
        .option-chip button:disabled { color: #475569; }

        @media (max-width: 400px) {
          .wheel-wrapper { width: 280px; height: 280px; }
          .center-dot { width: 60px; height: 60px; }
          .center-inner { font-size: 0.75rem; }
          .hide-mobile { display: none; }
        }
      `}</style>
    </div>
  );
}