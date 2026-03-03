import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Pulse() {
  const router = useRouter();
  const [isTouching, setIsTouching] = useState(false);
  const [incomingPulse, setIncomingPulse] = useState(false);

  // Kanal ismini sabitliyoruz
  const channel = supabase.channel('pulse-room');

  useEffect(() => {
    // 1. Kanala abone ol ve gelen sinyalleri dinle
    channel
      .on('broadcast', { event: 'send-pulse' }, (payload) => {
        triggerPulseEffect();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const triggerPulseEffect = () => {
    // Diğerinden sinyal geldiğinde yapılacaklar:
    setIncomingPulse(true);
    
    // Mobildeysen telefon titrer
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    // 3 saniye sonra efekti kapat
    setTimeout(() => setIncomingPulse(false), 3000);
  };

  const sendPulse = async () => {
    setIsTouching(true);
    
    // Sinyali gönder!
    await channel.send({
      type: 'broadcast',
      event: 'send-pulse',
      payload: { message: 'Seni düşünüyorum!' },
    });

    setTimeout(() => setIsTouching(false), 1000);
  };

  return (
    <div className={`pulse-wrapper ${incomingPulse ? 'active-bg' : ''}`}>
      <Head><title>Dijital Dokunuş ⚡</title></Head>

      <button className="back-btn" onClick={() => router.push('/anasayfa')}>←</button>

      <div className="content">
        <h1 className={incomingPulse ? 'glow-text' : ''}>
          {incomingPulse ? "Seni Düşünüyor! ❤️" : "Dokunuş Gönder"}
        </h1>
        <p>Butona bastığında diğer ekranda kalp çarpacak.</p>

        <div className="pulse-container">
          <button 
            className={`main-pulse-btn ${isTouching ? 'pressing' : ''}`} 
            onClick={sendPulse}
            disabled={isTouching}
          >
            <span className="heart-icon">⚡</span>
          </button>
          
          {/* Arka plandaki yayılan halkalar */}
          <div className={`ring ${isTouching ? 'animate-ring' : ''}`}></div>
          <div className={`ring delay-1 ${isTouching ? 'animate-ring' : ''}`}></div>
        </div>

        {incomingPulse && (
          <div className="fullscreen-heart">
            <span className="big-heart">❤️</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .pulse-wrapper {
          min-height: 100vh;
          background: #020617;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: background 0.5s ease;
          color: white;
          text-align: center;
          position: relative;
        }
        .active-bg { background: #450a0a; } /* Birisi dokunduğunda ekran hafif kırmızılaşır */

        .back-btn {
          position: absolute; top: 20px; left: 20px;
          background: rgba(255,255,255,0.1); border: none;
          color: white; padding: 10px 15px; border-radius: 50%; cursor: pointer;
        }

        .content h1 { font-size: 2rem; margin-bottom: 10px; transition: 0.3s; }
        .glow-text { color: #f87171; text-shadow: 0 0 20px #ef4444; }
        .content p { color: #94a3b8; font-size: 0.9rem; }

        .pulse-container {
          position: relative;
          width: 300px; height: 300px;
          display: flex; align-items: center; justify-content: center;
          margin-top: 50px;
        }

        .main-pulse-btn {
          width: 120px; height: 120px;
          border-radius: 50%; border: none;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white; font-size: 3rem;
          cursor: pointer; z-index: 10;
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
          transition: transform 0.1s;
        }
        .main-pulse-btn:active { transform: scale(0.9); }
        .pressing { transform: scale(0.9); background: #ef4444; }

        .ring {
          position: absolute; width: 120px; height: 120px;
          border: 2px solid #3b82f6; border-radius: 50%;
          opacity: 0; pointer-events: none;
        }
        .animate-ring { animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
        .delay-1 { animation-delay: 0.5s; }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }

        .fullscreen-heart {
          position: fixed; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.2);
          z-index: 100;
          animation: heart-pop 0.6s ease-out infinite alternate;
        }
        .big-heart { font-size: 15rem; filter: drop-shadow(0 0 50px #ef4444); }

        @keyframes heart-pop {
          from { transform: scale(0.8); }
          to { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}