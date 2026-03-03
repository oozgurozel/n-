import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Head from 'next/head';

export default function QuizOyun() {
  const [questions, setQuestions] = useState([]);
  const [mode, setMode] = useState('menu'); // menu, ask, play, result
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [newQ, setNewQ] = useState({ q: '', a: '', b: '', c: '', correct: 'a' });

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

  const deleteQuestion = async (id) => {
    if(confirm("Bu soruyu sonsuza dek silmek istediğine emin misin?")) {
      const { error } = await supabase.from('quiz_questions').delete().eq('id', id);
      if(!error) fetchQuestions();
    }
  };

  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption === questions[currentIndex].correct_answer;
    
    if (isCorrect) {
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }

    // Bir sonraki soruya geç veya bitir
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setMode('result');
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setStats({ correct: 0, wrong: 0 });
    setMode('menu');
  };

  const calculateScore = () => {
    const total = stats.correct + stats.wrong;
    return total === 0 ? 0 : Math.round((stats.correct / total) * 100);
  };

  return (
    <div className="quiz-wrapper">
      <Head><title>Düello | Quiz Pro</title></Head>
      
      <div className="glass-container">
        {mode === 'menu' && (
          <div className="menu">
            <h1>🤝 Düello Modu</h1>
            <p className="q-count">Sistemde {questions.length} soru var</p>
            <button onClick={() => { setMode('play'); setStats({correct:0, wrong:0}); setCurrentIndex(0); }} className="play-btn">🔥 Başlat (Düello)</button>
            <button onClick={() => setMode('ask')} className="ask-btn">✍️ Soru Hazırla</button>
            
            <div className="manage-section">
              <h4>Soruları Yönet</h4>
              {questions.map(q => (
                <div key={q.id} className="mini-q-card">
                  <span>{q.question_text}</span>
                  <button onClick={() => deleteQuestion(q.id)}>🗑️</button>
                </div>
              ))}
            </div>
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
            </div>
          </div>
        )}

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
            <button onClick={resetGame} className="play-btn">Tekrar Dene</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .quiz-wrapper { min-height: 100vh; background: #020617; display: flex; align-items: center; justify-content: center; padding: 20px; font-family: sans-serif; }
        .glass-container { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px); padding: 30px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); width: 100%; max-width: 450px; text-align: center; color: white; }
        
        .q-count { color: #94a3b8; margin-bottom: 20px; }
        .progress { margin-bottom: 10px; color: #3b82f6; font-weight: bold; }
        
        button { width: 100%; padding: 14px; margin: 8px 0; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .play-btn { background: #3b82f6; color: white; font-size: 1.1rem; }
        .ask-btn { background: #10b981; color: white; }
        
        .manage-section { margin-top: 30px; text-align: left; border-top: 1px solid #334155; padding-top: 20px; max-height: 200px; overflow-y: auto; }
        .mini-q-card { display: flex; justify-content: space-between; align-items: center; background: #1e293b; padding: 8px 12px; border-radius: 8px; margin-bottom: 5px; font-size: 0.8rem; }
        .mini-q-card button { width: auto; padding: 5px 10px; background: #ef4444; margin: 0; }

        .q-card { background: #1e293b; padding: 25px; border-radius: 20px; border: 2px solid #3b82f6; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
        .q-author { color: #fbbf24; font-size: 0.9rem; font-weight: 800; display: block; margin-bottom: 10px; }
        .q-text { color: #ffffff !important; font-size: 1.4rem; font-weight: 800; margin: 10px 0 20px 0; }
        
        .options button { background: #0f172a; color: white; border: 1px solid #334155; }
        .options button:hover { background: #3b82f6; transform: scale(1.02); }

        .result-card h2 { color: #fbbf24; margin-bottom: 20px; }
        .score-circle { width: 120px; height: 120px; border: 5px solid #3b82f6; border-radius: 60px; margin: 0 auto 20px; display: flex; flex-direction: column; justify-content: center; }
        .score-num { font-size: 2.5rem; font-weight: 900; }
        .score-label { font-size: 0.7rem; color: #94a3b8; }
        .stats-box { display: flex; justify-content: space-around; margin-bottom: 20px; }
        .c-text { color: #10b981; font-weight: bold; }
        .w-text { color: #ef4444; font-weight: bold; }
        
        .quiz-form input, .quiz-form select { width: 100%; padding: 12px; margin: 5px 0; background: #1e293b; border: 1px solid #334155; color: white; border-radius: 8px; }
        .cancel { background: transparent; color: #94a3b8; }
      `}</style>
    </div>
  );
}