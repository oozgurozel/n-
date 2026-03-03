import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function QuizOyun() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [mode, setMode] = useState('menu'); // menu, ask, play, result
  const [newQ, setNewQ] = useState({ q: '', a: '', b: '', c: '', correct: 'a' });
  
  // Oyun içi durumlar
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data } = await supabase.from('quiz_questions').select('*').order('created_at', { ascending: false });
    setQuestions(data || []);
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('quiz_questions').insert([{
      question_text: newQ.q,
      asked_by: 'Özgür', 
      correct_answer: newQ.correct === 'a' ? newQ.a : newQ.correct === 'b' ? newQ.b : newQ.c,
      option_a: newQ.a,
      option_b: newQ.b,
      option_c: newQ.c
    }]);
    if (!error) {
      alert("Soru buluta uçtu! 🚀");
      setMode('menu');
      fetchQuestions();
    }
  };

  // 1. SORU SİLME FONKSİYONU
  const deleteQuestion = async (id) => {
    if (confirm("Bu soruyu sonsuza dek silmek istediğine emin misin?")) {
      const { error } = await supabase.from('quiz_questions').delete().eq('id', id);
      if (!error) fetchQuestions();
    }
  };

  // 2. CEVAPLAMA VE SONRAKİ SORUYA GEÇİŞ
  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption === questions[currentIndex].correct_answer;
    
    if (isCorrect) {
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }

    // Başka soru varsa geç, yoksa sonuç ekranına at
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setMode('result');
    }
  };

  // 3. PUAN HESAPLAMA (100 Üzerinden)
  const calculateScore = () => {
    const total = stats.correct + stats.wrong;
    return total === 0 ? 0 : Math.round((stats.correct / total) * 100);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setStats({ correct: 0, wrong: 0 });
    setMode('menu');
  };

  return (
    <div className="quiz-wrapper">
      <Head><title>Düello | Quiz</title></Head>

      {/* ANA SAYFAYA DÖN BUTONU */}
      <button className="nav-back-btn" onClick={() => router.push('/anasayfa')}>
        <span>←</span> <span className="hide-mobile">Ana Sayfa</span>
      </button>
      
      <div className="glass-container">
        {mode === 'menu' && (
          <div className="menu">
            <h1>🤝 Düello Modu</h1>
            <p className="q-count">Sistemde toplam {questions.length} soru var</p>
            
            <button 
              onClick={() => { setMode('play'); setStats({correct:0, wrong:0}); setCurrentIndex(0); }} 
              className="play-btn"
              disabled={questions.length === 0}
            >
              🔥 Soruları Cevapla
            </button>
            <button onClick={() => setMode('ask')} className="ask-btn">✍️ Soru Hazırla</button>

            {/* Soru Yönetimi / Silme Alanı */}
            {questions.length > 0 && (
              <div className="manage-section">
                <h4>Soruları Yönet</h4>
                <div className="q-list">
                  {questions.map(q => (
                    <div key={q.id} className="mini-q-card">
                      <span className="mini-q-text">{q.question_text}</span>
                      <button onClick={() => deleteQuestion(q.id)} className="del-btn">🗑️</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'ask' && (
          <form onSubmit={handleAsk} className="quiz-form">
            <h2>Onu Terleten Bir Soru Sor!</h2>
            <input placeholder="Soru nedir?" onChange={e => setNewQ({...newQ, q: e.target.value})} required />
            <input placeholder="A Şıkkı" onChange={e => setNewQ({...newQ, a: e.target.value})} required />
            <input placeholder="B Şıkkı" onChange={e => setNewQ({...newQ, b: e.target.value})} required />
            <input placeholder="C Şıkkı" onChange={e => setNewQ({...newQ, c: e.target.value})} required />
            <select onChange={e => setNewQ({...newQ, correct: e.target.value})}>
              <option value="a">Doğru Cevap A</option>
              <option value="b">Doğru Cevap B</option>
              <option value="c">Doğru Cevap C</option>
            </select>
            <button type="submit">Buluta Gönder</button>
            <button type="button" onClick={() => setMode('menu')} className="cancel">İptal</button>
          </form>
        )}

        {mode === 'play' && questions.length > 0 && (
          <div className="play-area">
            <div className="progress">Soru {currentIndex + 1} / {questions.length}</div>
            <div className="q-card">
              <span className="q-author">⚡ {questions[currentIndex].asked_by} sordu:</span>
              <h3 className="q-text">{questions[currentIndex].question_text}</h3>
              <div className="options">
                <button onClick={() => handleAnswer(questions[currentIndex].option_a)}>{questions[currentIndex].option_a}</button>
                <button onClick={() => handleAnswer(questions[currentIndex].option_b)}>{questions[currentIndex].option_b}</button>
                <button onClick={() => handleAnswer(questions[currentIndex].option_c)}>{questions[currentIndex].option_c}</button>
              </div>
              <button onClick={() => setMode('menu')} className="back-btn">← Vazgeç ve Dön</button>
            </div>
          </div>
        )}

        {/* SONUÇ EKRANI */}
        {mode === 'result' && (
          <div className="result-card">
            <h2>DÜELLO BİTTİ! 🏁</h2>
            <div className="score-circle">
              <span className="score-num">{calculateScore()}</span>
              <span className="score-label">PUAN</span>
            </div>
            <div className="stats-box">
              <p className="c-text">✅ Doğru: {stats.correct}</p>
              <p className="w-text">❌ Yanlış: {stats.wrong}</p>
            </div>
            <button onClick={resetGame} className="play-btn">Menüye Dön</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .quiz-wrapper { min-height: 100vh; background: #020617; display: flex; align-items: center; justify-content: center; padding: 20px; font-family: 'Inter', sans-serif; }
        
        /* SOL ÜST SABİT BUTON */
        .nav-back-btn { 
          position: fixed; top: 20px; left: 20px; background: #1e293b; border: 1px solid #334155; 
          color: #94a3b8; padding: 10px 18px; border-radius: 12px; cursor: pointer; 
          display: flex; gap: 8px; align-items: center; font-weight: 600; transition: 0.2s; z-index: 9999;
        }
        .nav-back-btn:hover { background: #3b82f6; color: white; border-color: #3b82f6; }

        .glass-container { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px); padding: 30px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); width: 100%; max-width: 450px; text-align: center; color: white; }
        .menu h1 { color: #f59e0b; margin-bottom: 10px; }
        .q-count { color: #94a3b8; margin-bottom: 25px; font-size: 0.9rem; }
        
        button { width: 100%; padding: 15px; margin: 10px 0; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .play-btn { background: #3b82f6; color: white; }
        .play-btn:disabled { background: #1e293b; color: #475569; cursor: not-allowed; }
        .ask-btn { background: #10b981; color: white; }
        
        /* SORU YÖNETİMİ */
        .manage-section { margin-top: 30px; text-align: left; border-top: 1px solid #334155; padding-top: 20px; }
        .manage-section h4 { color: #94a3b8; margin-bottom: 10px; }
        .q-list { max-height: 150px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-right: 5px; }
        .q-list::-webkit-scrollbar { width: 5px; }
        .q-list::-webkit-scrollbar-thumb { background: #334155; border-radius: 5px; }
        .mini-q-card { display: flex; justify-content: space-between; align-items: center; background: #1e293b; padding: 10px 15px; border-radius: 10px; border: 1px solid #334155; }
        .mini-q-text { font-size: 0.85rem; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80%; }
        .del-btn { background: rgba(239, 68, 68, 0.1) !important; color: #ef4444 !important; width: auto !important; padding: 5px 10px !important; margin: 0 !important; border: 1px solid rgba(239, 68, 68, 0.3) !important; }
        .del-btn:hover { background: #ef4444 !important; color: white !important; }

        .quiz-form input, .quiz-form select { width: 100%; padding: 12px; margin: 5px 0; background: #1e293b; border: 1px solid #334155; color: white; border-radius: 8px; }
        .quiz-form button[type="submit"] { background: #f59e0b; color: white; }
        
        /* OYUN ALANI */
        .progress { color: #3b82f6; font-weight: bold; margin-bottom: 15px; }
        .q-card { background: #1e293b; padding: 25px; border-radius: 20px; border: 2px solid #3b82f6; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
        .q-author { color: #fbbf24; font-size: 0.9rem; font-weight: 800; display: block; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .q-text { color: #ffffff !important; font-size: 1.5rem; font-weight: 800; line-height: 1.4; margin: 10px 0 25px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
        
        .options button { background: #0f172a; color: #ffffff; border: 1px solid #334155; font-size: 1rem; }
        .options button:hover { background: #3b82f6; border-color: white; transform: translateY(-2px); }
        
        /* SONUÇ EKRANI */
        .result-card h2 { color: #fbbf24; margin-bottom: 25px; }
        .score-circle { width: 130px; height: 130px; border: 6px solid #3b82f6; border-radius: 50%; margin: 0 auto 25px; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(59, 130, 246, 0.1); }
        .score-num { font-size: 3rem; font-weight: 900; color: white; line-height: 1; }
        .score-label { font-size: 0.8rem; color: #94a3b8; margin-top: 5px; font-weight: bold; }
        .stats-box { display: flex; justify-content: space-around; margin-bottom: 25px; background: #1e293b; padding: 15px; border-radius: 15px; }
        .c-text { color: #10b981; font-weight: bold; margin: 0; }
        .w-text { color: #ef4444; font-weight: bold; margin: 0; }

        .back-btn { margin-top: 15px; background: transparent; color: #94a3b8; font-size: 0.85rem; text-decoration: underline; width: auto; padding: 5px; }
        .cancel { background: transparent; color: #94a3b8; }

        @media (max-width: 400px) {
          .hide-mobile { display: none; }
        }
      `}</style>
    </div>
  );
}