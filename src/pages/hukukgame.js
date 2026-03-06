import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

const CATEGORY_ICONS = {
  "Anayasa Hukuku": "📜",
  "Medeni Hukuk": "👨‍👩‍👧‍👦",
  "Ceza Hukuku": "⚖️",
  "İdare Hukuku": "🏛️"
};

export default function HukukOyunu() {
  const router = useRouter();
  
  // Ana Durumlar
  const [player, setPlayer] = useState(''); 
  const [mode, setMode] = useState('menu'); // 'menu', 'play', 'result', 'add_question'
  
  // Veritabanı Verileri
  const [allQuestions, setAllQuestions] = useState([]);
  const [solvedIds, setSolvedIds] = useState([]);
  const [allScores, setAllScores] = useState([]);
  
  // Oyun İçi Durumlar
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState([]); // O anki sınavın soruları
  const [currentQ, setCurrentQ] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [solvedInThisRun, setSolvedInThisRun] = useState([]); // Bu sınavda çözülenlerin ID'si
  
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  // Yeni Soru Formu State'i
  const [newQ, setNewQ] = useState({ cat: 'Anayasa Hukuku', q: '', a: '', b: '', c: '', d: '', ans: 'a' });

  // Verileri Çekme
  useEffect(() => {
    if (player) {
      fetchData();
    }
  }, [player, mode]);

  const fetchData = async () => {
    // Tüm soruları çek
    const { data: qData } = await supabase.from('hukuk_questions').select('*');
    if (qData) setAllQuestions(qData);

    // Bu oyuncunun çözdüğü soru ID'lerini çek
    const { data: sData } = await supabase.from('hukuk_solved').select('question_id').eq('player_name', player);
    if (sData) setSolvedIds(sData.map(s => s.question_id));

    // Skorları çek
    const { data: scoreData } = await supabase.from('hukuk_scores').select('*');
    if (scoreData) setAllScores(scoreData);
  };

  // --- OYUN BAŞLATMA ---
  const handleCategorySelect = (cat) => {
    // Bu kategoriye ait ve henüz ÇÖZÜLMEMİŞ soruları filtrele
    const unsolvedForCat = allQuestions.filter(q => q.category === cat && !solvedIds.includes(q.id));
    
    if (unsolvedForCat.length === 0) {
      alert(`Bu kategorideki tüm soruları zaten çözdün! Yeni soru ekle veya çözdüklerini sıfırla.`);
      return;
    }

    // Maksimum 10 soru al (veya kaç tane kaldıysa) ve karıştır
    const shuffled = unsolvedForCat.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    setSelectedCategory(cat);
    setActiveQuestions(shuffled);
    setCurrentQ(0);
    setCorrectCount(0);
    setSolvedInThisRun([]);
    setMode('play');
    setTimeLeft(15);
    setSelectedOpt(null);
  };

  // --- ZAMANLAYICI ---
  useEffect(() => {
    if (mode !== 'play' || selectedOpt) return;
    if (timeLeft === 0) {
      handleAnswer(null); 
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, mode, selectedOpt]);

  // --- CEVAPLAMA ---
  const handleAnswer = (option) => {
    setSelectedOpt(option);
    const question = activeQuestions[currentQ];
    const correct = option === question.answer;
    
    setIsCorrect(correct);
    if (correct) setCorrectCount(prev => prev + 1);

    // Soruyu bu oturumda çözülenlere ekle
    setSolvedInThisRun(prev => [...prev, question.id]);

    setTimeout(() => {
      setSelectedOpt(null);
      setIsCorrect(null);
      setTimeLeft(15);
      
      if (currentQ + 1 < activeQuestions.length) {
        setCurrentQ(prev => prev + 1);
      } else {
        finishGame();
      }
    }, 2000);
  };

  // --- OYUN BİTİŞİ & KAYIT ---
  const finishGame = async () => {
    const finalScore = Math.round(((correctCount + (isCorrect ? 1 : 0)) / activeQuestions.length) * 100);
    
    // 1. Çözülen soruları veritabanına kaydet (Bir daha çıkmasın diye)
    const solvedInserts = solvedInThisRun.map(id => ({ player_name: player, question_id: id }));
    await supabase.from('hukuk_solved').upsert(solvedInserts, { onConflict: 'player_name, question_id' });

    // 2. Skoru güncelle (Eski skoru last_score'a, en yükseği best_score'a)
    const existingScore = allScores.find(s => s.player_name === player && s.category === selectedCategory);
    const best = existingScore ? Math.max(existingScore.best_score, finalScore) : finalScore;

    await supabase.from('hukuk_scores').upsert({
      player_name: player,
      category: selectedCategory,
      last_score: finalScore,
      best_score: best
    }, { onConflict: 'player_name, category' });

    await fetchData(); // Verileri yenile
    setMode('result');
  };

  // --- SORU SIFIRLAMA ---
  const resetCategoryProgress = async (cat) => {
    if (confirm("Bu kategorideki tüm çözülmüş soru geçmişin silinecek. Emin misin?")) {
      const catQIds = allQuestions.filter(q => q.category === cat).map(q => q.id);
      await supabase.from('hukuk_solved').delete().eq('player_name', player).in('question_id', catQIds);
      fetchData();
      alert("Geçmiş sıfırlandı! Sorular tekrar karşına çıkacak.");
    }
  };

  // --- YENİ SORU EKLEME ---
  const submitNewQuestion = async (e) => {
    e.preventDefault();
    const ansText = newQ.ans === 'a' ? newQ.a : newQ.ans === 'b' ? newQ.b : newQ.ans === 'c' ? newQ.c : newQ.d;
    
    const { error } = await supabase.from('hukuk_questions').insert([{
      category: newQ.cat, q_text: newQ.q, opt_a: newQ.a, opt_b: newQ.b, opt_c: newQ.c, opt_d: newQ.d, answer: ansText
    }]);

    if (!error) {
      alert("Soru başarıyla eklendi! ⚖️");
      setNewQ({...newQ, q:'', a:'', b:'', c:'', d:''});
      fetchData();
    }
  };

  // --- EKRANLAR ---
  if (!player) {
    return (
      <div className="game-wrapper">
        <Head><title>Giriş | Adalet Terazisi</title></Head>
        <button className="back-btn" onClick={() => router.push('/anasayfa')}>← Ana Sayfa</button>
        <div className="game-container">
          <h1 style={{color:'#fbbf24', fontSize:'3rem'}}>⚖️</h1>
          <h2>Duruşma Başlıyor!</h2>
          <p style={{color:'#94a3b8', marginBottom:'30px'}}>Lütfen kimliğini seç:</p>
          <button className="player-btn ozgur" onClick={() => setPlayer('Özgür')}>Ben Özgür'üm 👨🏻‍⚖️</button>
          <button className="player-btn nisan" onClick={() => setPlayer('Nisa')}>Ben Nisa'yım 👩🏻‍⚖️</button>
        </div>
        <style jsx>{`
          .game-wrapper { min-height: 100vh; background: #020617; display: flex; justify-content: center; align-items: center; font-family: sans-serif;}
          .game-container { background: #0f172a; padding: 40px; border-radius: 24px; text-align: center; border: 1px solid #1e293b; color: white;}
          .player-btn { width: 100%; padding: 15px; margin: 10px 0; border: none; border-radius: 12px; font-size: 1.2rem; font-weight: bold; cursor: pointer; transition: 0.2s; }
          .ozgur { background: #3b82f6; color: white; }
          .nisan { background: #ec4899; color: white; }
          .player-btn:hover { transform: scale(1.05); }
          .back-btn { position: fixed; top: 20px; left: 20px; background: #1e293b; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; z-index:100; }
        `}</style>
      </div>
    );
  }

  const myScoreRecord = allScores.find(s => s.player_name === player && s.category === selectedCategory);

  return (
    <div className="game-wrapper">
      <Head><title>Adalet Terazisi | Dinamik Sınav</title></Head>

      <button className="back-btn" onClick={() => router.push('/anasayfa')}>
        <span>←</span> <span className="hide-mobile">Ana Sayfa</span>
      </button>

      <div className="game-container">
        
        {/* MENÜ EKRANI */}
        {mode === 'menu' && (
          <div className="category-screen">
            <div className="cat-header">
              <h1>⚖️ Adalet Terazisi</h1>
              <p>Hakim {player}, {allQuestions.length} soruluk dev arşive hoş geldin.</p>
              <button className="add-q-btn" onClick={() => setMode('add_question')}> Yeni Soru Ekle</button>
            </div>
            
            <div className="category-grid">
              {Object.keys(CATEGORY_ICONS).map(cat => {
                const totalQ = allQuestions.filter(q => q.category === cat).length;
                const solvedQ = solvedIds.filter(id => allQuestions.find(q => q.id === id && q.category === cat)).length;
                const scoreRecord = allScores.find(s => s.player_name === player && s.category === cat);
                
                return (
                  <div key={cat} className="cat-card">
                    {scoreRecord && (
                      <div className="score-badge gold">🏆 %{scoreRecord.best_score}</div>
                    )}
                    <div className="cat-content" onClick={() => handleCategorySelect(cat)}>
                      <span className="cat-icon">{CATEGORY_ICONS[cat]}</span>
                      <h3>{cat}</h3>
                      <p className="q-status">{totalQ - solvedQ} Yeni Soru Bekliyor</p>
                    </div>
                    {totalQ > 0 && totalQ === solvedQ && (
                      <button className="reset-cat-btn" onClick={(e) => { e.stopPropagation(); resetCategoryProgress(cat); }}>Sıfırla 🔄</button>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* LİDERLİK TABLOSU */}
            <div className="leaderboard">
              <h4>🔥 Hukuk Düellosu (En Yüksek Puanlar)</h4>
              <div className="board-grid">
                {Object.keys(CATEGORY_ICONS).map(cat => {
                  const ozgurScore = allScores.find(s => s.player_name === 'Özgür' && s.category === cat)?.best_score || 0;
                  const nisanScore = allScores.find(s => s.player_name === 'Nisan' && s.category === cat)?.best_score || 0;
                  
                  return (
                    <div key={cat} className="board-row">
                      <span className="board-cat">{cat}</span>
                      <div className="versus">
                        <span className={`score ${ozgurScore >= nisanScore && ozgurScore > 0 ? 'winner' : ''}`}>👨🏻‍⚖️ {ozgurScore}</span>
                        <span className="vs">VS</span>
                        <span className={`score ${nisanScore >= ozgurScore && nisanScore > 0 ? 'winner' : ''}`}>👩🏻‍⚖️ {nisanScore}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* YENİ SORU EKLEME EKRANI */}
        {mode === 'add_question' && (
          <div className="add-form-container">
            <h2>Hukuk Arşivini Büyüt 📚</h2>
            <form onSubmit={submitNewQuestion} className="quiz-form">
              <select value={newQ.cat} onChange={e => setNewQ({...newQ, cat: e.target.value})}>
                {Object.keys(CATEGORY_ICONS).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea placeholder="Soruyu buraya yaz..." value={newQ.q} onChange={e => setNewQ({...newQ, q: e.target.value})} required rows="3"/>
              <input placeholder="A Şıkkı" value={newQ.a} onChange={e => setNewQ({...newQ, a: e.target.value})} required />
              <input placeholder="B Şıkkı" value={newQ.b} onChange={e => setNewQ({...newQ, b: e.target.value})} required />
              <input placeholder="C Şıkkı" value={newQ.c} onChange={e => setNewQ({...newQ, c: e.target.value})} required />
              <input placeholder="D Şıkkı" value={newQ.d} onChange={e => setNewQ({...newQ, d: e.target.value})} required />
              
              <div className="correct-select">
                <label>Doğru Cevap Hangi Şık?</label>
                <select value={newQ.ans} onChange={e => setNewQ({...newQ, ans: e.target.value})}>
                  <option value="a">A Şıkkı</option>
                  <option value="b">B Şıkkı</option>
                  <option value="c">C Şıkkı</option>
                  <option value="d">D Şıkkı</option>
                </select>
              </div>
              <button type="submit" className="save-q-btn">Veritabanına Kaydet 🚀</button>
              <button type="button" className="cancel-btn" onClick={() => setMode('menu')}>Vazgeç ve Menüye Dön</button>
            </form>
          </div>
        )}

        {/* OYUN EKRANI */}
        {mode === 'play' && (
          <>
            <div className="header">
              <div className="header-info">
                <span className="cat-badge">{CATEGORY_ICONS[selectedCategory]} {selectedCategory}</span>
                <h2>Soru {currentQ + 1} / {activeQuestions.length}</h2>
              </div>
              <button className="quit-btn" onClick={() => setMode('menu')}>Vazgeç</button>
            </div>

            <div className="timer-bar">
              <div className={`timer-fill ${timeLeft <= 5 ? 'danger' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }}></div>
            </div>
            <div className="time-text">Kalan Süre: {timeLeft}s</div>

            <div className="question-card">
              <h3>{activeQuestions[currentQ].q_text}</h3>
            </div>

            <div className="options-grid">
              {[activeQuestions[currentQ].opt_a, activeQuestions[currentQ].opt_b, activeQuestions[currentQ].opt_c, activeQuestions[currentQ].opt_d].map((opt, i) => {
                let btnClass = "option-btn";
                if (selectedOpt) {
                  if (opt === activeQuestions[currentQ].answer) btnClass += " correct";
                  else if (opt === selectedOpt) btnClass += " wrong";
                  else btnClass += " disabled";
                }
                return (
                  <button key={i} className={btnClass} onClick={() => handleAnswer(opt)} disabled={selectedOpt !== null}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* SONUÇ EKRANI */}
        {mode === 'result' && myScoreRecord && (
          <div className="result-card">
            <div className="icon">{CATEGORY_ICONS[selectedCategory]}</div>
            <h2>Sınav Bitti!</h2>
            
            <div className="score-comparison">
              <div className="score-box old">
                <span>Önceki Puanın</span>
                <strong>{myScoreRecord.last_score || 0}</strong>
              </div>
              <div className="score-box new">
                <span>Şimdiki Puanın</span>
                <strong>{myScoreRecord.last_score}</strong> {/* Yukarıda update ettik, last_score yeni skor oldu */}
              </div>
            </div>

            <div className="best-score-box">
              👑 En Yüksek Rekorun: <strong>{myScoreRecord.best_score}</strong>
            </div>

            <p className="message">
              {myScoreRecord.last_score > (allScores.find(s => s.player_name === player && s.category === selectedCategory)?.last_score || 0) 
                ? "Harika! Kendini geliştirdin! 🚀" 
                : "Biraz daha çalışman gerekebilir. 📚"}
            </p>
            <div className="result-actions">
              <button className="restart-btn" onClick={() => setMode('menu')}>Menüye Dön</button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .game-wrapper { min-height: 100vh; background: #020617; color: white; font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; padding: 20px; position: relative; }

        .back-btn { position: fixed; top: 20px; left: 20px; background: #1e293b; border: 1px solid #334155; color: #94a3b8; padding: 10px 18px; border-radius: 12px; cursor: pointer; display: flex; gap: 8px; align-items: center; font-weight: 600; transition: 0.2s; z-index: 1000; }
        .back-btn:hover { background: #3b82f6; color: white; border-color: #3b82f6; }

        .game-container { width: 100%; max-width: 550px; background: #0f172a; padding: 30px; border-radius: 24px; border: 1px solid #1e293b; box-shadow: 0 15px 35px rgba(0,0,0,0.5); text-align: center; }

        .cat-header h1 { color: #fbbf24; font-size: 2.2rem; margin: 0 0 10px 0; }
        .cat-header p { color: #94a3b8; margin-bottom: 20px; }
        .add-q-btn { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px dashed #3b82f6; padding: 10px 20px; border-radius: 12px; font-weight: bold; cursor: pointer; width: 100%; margin-bottom: 25px; transition: 0.2s; }
        .add-q-btn:hover { background: #3b82f6; color: white; }
        
        .category-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
        .cat-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; transition: 0.3s; display: flex; flex-direction: column; position: relative; overflow: hidden; }
        .cat-card:hover { border-color: #fbbf24; transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
        .cat-content { padding: 20px 15px; cursor: pointer; display: flex; flex-direction: column; align-items: center; }
        .cat-icon { font-size: 3rem; margin-bottom: 10px; }
        .cat-card h3 { margin: 0 0 5px 0; font-size: 1.1rem; color: #e2e8f0; }
        .q-status { margin: 0; font-size: 0.8rem; color: #3b82f6; font-weight: bold; background: rgba(59,130,246,0.1); padding: 4px 10px; border-radius: 20px; }
        .reset-cat-btn { background: #ef4444; color: white; border: none; padding: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer; width: 100%; }
        .reset-cat-btn:hover { background: #dc2626; }

        .score-badge { position: absolute; top: 10px; right: 10px; padding: 4px 8px; border-radius: 10px; font-size: 0.75rem; font-weight: bold; color: #000; z-index: 10; }
        .gold { background: linear-gradient(135deg, #fbbf24, #f59e0b); }

        .leaderboard { background: #1e293b; border: 1px dashed #334155; padding: 20px; border-radius: 16px; text-align: left; }
        .leaderboard h4 { color: #fbbf24; margin: 0 0 15px 0; font-size: 1.2rem; text-align: center; border-bottom: 1px solid #334155; padding-bottom: 10px; }
        .board-grid { display: flex; flex-direction: column; gap: 12px; }
        .board-row { display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 12px 15px; border-radius: 10px; }
        .board-cat { font-weight: bold; color: #e2e8f0; font-size: 0.9rem; flex: 1; }
        .versus { display: flex; align-items: center; gap: 15px; background: #020617; padding: 5px 15px; border-radius: 20px; border: 1px solid #1e293b; }
        .vs { font-size: 0.7rem; color: #64748b; font-weight: 900; }
        .score { font-weight: bold; color: #94a3b8; font-size: 1rem; }
        .winner { color: #10b981; font-size: 1.1rem; text-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }

        /* Soru Ekleme Formu */
        .add-form-container h2 { color: #fbbf24; margin-bottom: 20px; }
        .quiz-form { display: flex; flex-direction: column; gap: 10px; text-align: left; }
        .quiz-form select, .quiz-form input, .quiz-form textarea { width: 100%; padding: 12px; background: #1e293b; border: 1px solid #334155; color: white; border-radius: 8px; font-family: inherit; }
        .correct-select { background: rgba(16, 185, 129, 0.1); padding: 15px; border-radius: 8px; border: 1px dashed #10b981; margin-top: 10px; }
        .correct-select label { display: block; color: #10b981; font-weight: bold; margin-bottom: 5px; }
        .save-q-btn { background: #10b981; color: white; padding: 15px; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 10px; font-size: 1.1rem; }
        .cancel-btn { background: transparent; color: #94a3b8; padding: 10px; border: none; cursor: pointer; text-decoration: underline; }

        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #1e293b; }
        .header-info { text-align: left; }
        .cat-badge { display: inline-block; background: rgba(251, 191, 36, 0.15); color: #fbbf24; padding: 5px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; margin-bottom: 10px; }
        .header-info h2 { margin: 0; color: #e2e8f0; font-size: 1.4rem; }
        .quit-btn { background: transparent; color: #64748b; border: 1px solid #334155; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; transition: 0.2s; }
        .quit-btn:hover { background: #ef4444; color: white; border-color: #ef4444; }
        .timer-bar { width: 100%; height: 8px; background: #1e293b; border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
        .timer-fill { height: 100%; background: #3b82f6; transition: width 1s linear, background 0.3s; }
        .timer-fill.danger { background: #ef4444; }
        .time-text { font-size: 0.8rem; color: #64748b; text-align: right; margin-bottom: 20px; font-weight: bold; }
        .question-card { background: #1e293b; padding: 25px 20px; border-radius: 16px; border-left: 5px solid #fbbf24; margin-bottom: 25px; min-height: 100px; display: flex; align-items: center; justify-content: center; }
        .question-card h3 { margin: 0; font-size: 1.2rem; line-height: 1.5; color: #f8fafc; }
        .options-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .option-btn { background: #020617; color: #e2e8f0; border: 2px solid #334155; padding: 15px; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: 0.2s; text-align: center; }
        .option-btn:hover:not(.disabled) { background: #1e293b; border-color: #fbbf24; }
        .correct { background: #10b981 !important; border-color: #059669 !important; color: white !important; }
        .wrong { background: #ef4444 !important; border-color: #b91c1c !important; color: white !important; }
        .disabled { opacity: 0.5; cursor: not-allowed; }

        /* Sonuç Ekranı Yenilikleri */
        .result-card .icon { font-size: 4rem; margin-bottom: 10px; }
        .score-comparison { display: flex; justify-content: center; gap: 20px; margin: 30px 0; }
        .score-box { padding: 15px 20px; border-radius: 16px; display: flex; flex-direction: column; width: 120px; }
        .score-box span { font-size: 0.8rem; text-transform: uppercase; margin-bottom: 5px; opacity: 0.8; }
        .score-box strong { font-size: 2.5rem; font-weight: 900; }
        .score-box.old { background: #1e293b; border: 1px dashed #64748b; color: #94a3b8; }
        .score-box.new { background: rgba(16, 185, 129, 0.1); border: 2px solid #10b981; color: #10b981; box-shadow: 0 0 20px rgba(16,185,129,0.3); transform: scale(1.1); }
        .best-score-box { background: rgba(251, 191, 36, 0.1); color: #fbbf24; padding: 10px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #fbbf24; font-size: 1.1rem; }
        
        .message { color: #e2e8f0; font-size: 1.1rem; margin-bottom: 30px; line-height: 1.5; }
        .result-actions { display: flex; flex-direction: column; gap: 10px; }
        .restart-btn { background: #fbbf24; color: #000; font-weight: bold; font-size: 1.1rem; padding: 15px; border: none; border-radius: 12px; cursor: pointer; transition: 0.2s; }
        .restart-btn:hover { background: #f59e0b; }

        @media (max-width: 500px) {
          .hide-mobile { display: none; }
          .game-container { padding: 20px; border-radius: 16px; border: none; }
          .category-grid { grid-template-columns: 1fr; }
          .question-card h3 { font-size: 1.1rem; }
          .score-comparison { gap: 10px; }
          .score-box { padding: 10px; width: 100px; }
          .score-box strong { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
}