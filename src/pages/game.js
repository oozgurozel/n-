import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function Oyun() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [gameStatus, setGameStatus] = useState('loading'); // loading, playing, won
  const [bestScore, setBestScore] = useState(null);

  // 1. Galeri Resimlerini Çek ve Kartları Hazırla
  useEffect(() => {
    initGame();
    fetchBestScore();
  }, []);

  const fetchBestScore = async () => {
    const { data } = await supabase.from('game_scores').select('*').order('score_seconds', { ascending: true }).limit(1).single();
    if (data) setBestScore(data);
  };

  const initGame = async () => {
    setGameStatus('loading');
    const { data: galleryData } = await supabase.from('gallery').select('image_url').limit(20);
    
    if (!galleryData || galleryData.length < 6) {
      alert("Oyunu oynamak için galeride en az 6 fotoğraf olmalı!");
      router.push('/galeri');
      return;
    }

    // Rastgele 6 resim seç
    const selectedImages = [...galleryData].sort(() => 0.5 - Math.random()).slice(0, 6);
    // Resimleri ikile (eşleştirme için)
    const pairImages = [...selectedImages, ...selectedImages]
      .sort(() => 0.5 - Math.random())
      .map((img, index) => ({ id: index, url: img.image_url }));

    setCards(pairImages);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setSeconds(0);
    setGameStatus('playing');
  };

  // 2. Zamanlayıcı
  useEffect(() => {
    let timer;
    if (gameStatus === 'playing') {
      timer = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameStatus]);

  // 3. Kart Tıklama Mantığı
  const handleClick = (id) => {
    if (disabled || flipped.includes(id) || solved.includes(id)) return;

    if (flipped.length === 0) {
      setFlipped([id]);
    } else {
      setFlipped([flipped[0], id]);
      setMoves(m => m + 1);
      setDisabled(true);
      checkMatch(flipped[0], id);
    }
  };

  const checkMatch = (firstId, secondId) => {
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    if (firstCard.url === secondCard.url) {
      setSolved([...solved, firstId, secondId]);
      resetTurn();
    } else {
      setTimeout(resetTurn, 1000);
    }
  };

  const resetTurn = () => {
    setFlipped([]);
    setDisabled(false);
  };

  // 4. Oyun Bittiğinde Skor Kaydet
  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setGameStatus('won');
      saveScore();
    }
  }, [solved]);

  const saveScore = async () => {
    const name = prompt("Harika! İsmini yaz şampiyon:", "Özgür");
    await supabase.from('game_scores').insert([{ player_name: name || 'Anonim', score_seconds: seconds, moves: moves }]);
    fetchBestScore();
  };

  return (
    <div className="game-wrapper">
      <Head>
        <title>Anı Eşleştirme | Oyun</title>
      </Head>

      <nav className="game-nav">
        <button onClick={() => router.push('/anasayfa')}>← Geri</button>
        <div className="stats">
          <span>⏱️ {seconds}s</span>
          <span>🔄 {moves} Hamle</span>
        </div>
        <button onClick={initGame} className="reset-btn">🔄 Yenile</button>
      </nav>

      <main className="content">
        {gameStatus === 'won' && (
          <div className="win-message">
            <h2>🎉 TEBRİKLER! 🎉</h2>
            <p>{seconds} saniyede tüm anıları eşleştirdin!</p>
            <button onClick={initGame}>Tekrar Oyna</button>
          </div>
        )}

        <div className="grid">
          {cards.map((card) => (
            <div 
              key={card.id} 
              className={`card ${flipped.includes(card.id) || solved.includes(card.id) ? 'flipped' : ''}`}
              onClick={() => handleClick(card.id)}
            >
              <div className="card-inner">
                <div className="card-front">?</div>
                <div className="card-back">
                  <img src={card.url} alt="Memory" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {bestScore && (
          <div className="leaderboard">
            🏆 Rekor: <strong>{bestScore.player_name}</strong> - {bestScore.score_seconds}s
          </div>
        )}
      </main>

      <style jsx>{`
        .game-wrapper { min-height: 100vh; background: #0f172a; color: white; padding: 20px; font-family: sans-serif; }
        .game-nav { display: flex; justify-content: space-between; align-items: center; max-width: 600px; margin: 0 auto 20px; }
        .game-nav button { background: #1e293b; border: 1px solid #334155; color: white; padding: 8px 15px; border-radius: 10px; cursor: pointer; }
        .stats { font-weight: bold; font-size: 1.1rem; display: flex; gap: 20px; }
        
        .grid { 
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; 
          max-width: 500px; margin: 0 auto; perspective: 1000px;
        }

        .card { aspect-ratio: 1; cursor: pointer; position: relative; }
        .card-inner {
          position: relative; width: 100%; height: 100%;
          transition: transform 0.6s; transform-style: preserve-3d;
        }
        .card.flipped .card-inner { transform: rotateY(180deg); }

        .card-front, .card-back {
          position: absolute; width: 100%; height: 100%;
          backface-visibility: hidden; border-radius: 15px;
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; border: 2px solid #3b82f6;
        }

        .card-front { background: #1e293b; color: #3b82f6; }
        .card-back { background: #3b82f6; transform: rotateY(180deg); overflow: hidden; }
        .card-back img { width: 100%; height: 100%; object-fit: cover; }

        .win-message { text-align: center; margin-bottom: 20px; color: #4ade80; animation: bounce 1s infinite; }
        .leaderboard { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 0.9rem; }
        
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @media (min-width: 600px) { .grid { grid-template-columns: repeat(4, 1fr); } }
      `}</style>
    </div>
  );
}