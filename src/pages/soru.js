import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

// BİRBİRİNDEN GÜZEL 30 İLİŞKİ SORUSU (Sistem her gün birini otomatik seçer)
const QUESTIONS = [
  "Buluştuğumuz ilk günü düşündüğünde aklına gelen ilk detay nedir?",
  "Bende en çok sevdiğin ve hiç değişmesin dediğin huyum ne?",
  "Şu an cebimizde limitsiz para olsaydı, yarına hangi ülkeye bilet alırdık?",
  "Birlikte yaptığımız en komik ve absürt şey neydi?",
  "Benim hakkımda ilk tanıştığımızda düşündüğün ama sonradan değişen fikrin neydi?",
  "İlişkimizi anlatan bir film çekilseydi, adı ne olurdu?",
  "Gelecekteki evimizde en çok hangi odada vakit geçireceğimizi hayal ediyorsun?",
  "Bana söylemeden içinden geçirdiğin en güzel düşünce neydi son zamanlarda?",
  "Sana kendini en güvende hissettirdiğim an hangisiydi?",
  "Birlikte yaşlanınca sence nasıl bir çift olacağız?",
  "Dünyadaki tüm yemekler silinse ve hayatımız boyunca tek bir şey yiyecek olsak, ortak kararımız ne olurdu?",
  "Beni üç kelimeyle anlatman gerekse, hangi kelimeleri seçerdin?",
  "Hayatında aldığın en iyi karar sence neydi?",
  "Eğer bir süper gücümüz olsaydı (ikimizin ortak), bu ne olurdu?",
  "Birbirimize verdiğimiz en güzel söz sence hangisi?"
];

export default function GununSorusu() {
  const router = useRouter();
  const [player, setPlayer] = useState(''); 
  
  const [dateKey, setDateKey] = useState('');
  const [dailyData, setDailyData] = useState(null);
  const [myAnswerInput, setMyAnswerInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SAAT 21:00 MANTIĞI: Eğer saat akşam 9'u geçtiyse, tarihi o güne sabitler.
  // Eğer saat 21:00'den önceyse, hala DÜNÜN sorusundadır.
  const getActiveDateKey = () => {
    const now = new Date();
    if (now.getHours() < 21) {
      now.setDate(now.getDate() - 1); // 21:00'den önceyse bir gün geriye git
    }
    return `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`;
  };

  useEffect(() => {
    if (player) {
      const currentKey = getActiveDateKey();
      setDateKey(currentKey);
      fetchDailyData(currentKey);
    }
  }, [player]);

  const fetchDailyData = async (currentKey) => {
    let { data } = await supabase.from('gunun_sorusu').select('*').eq('date_key', currentKey).single();
    
    // Eğer o gün için henüz veritabanında soru açılmamışsa, biz oluşturalım
    if (!data) {
      // Günü sayıya çevirip QUESTIONS dizisinden sabit bir soru seçiyoruz
      const dayNumber = parseInt(currentKey.split('-')[2], 10);
      const questionIndex = dayNumber % QUESTIONS.length;
      const questionToAsk = QUESTIONS[questionIndex];

      const { data: newData } = await supabase.from('gunun_sorusu').insert([{
        date_key: currentKey,
        question_text: questionToAsk
      }]).select().single();
      
      data = newData;
    }

    setDailyData(data);
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!myAnswerInput.trim()) return;
    setIsSubmitting(true);

    const updateField = player === 'Özgür' ? { ozgur_answer: myAnswerInput } : { nisa_answer: myAnswerInput };

    await supabase.from('gunun_sorusu').update(updateField).eq('date_key', dateKey);
    
    await fetchDailyData(dateKey);
    setIsSubmitting(false);
  };

  // --- KİMLİK SEÇİM EKRANI ---
  if (!player) {
    return (
      <div className="page-wrapper auth-bg">
        <Head><title>Giriş | Günün Sorusu</title></Head>
        <button className="back-btn" onClick={() => router.push('/anasayfa')}>← Ana Sayfa</button>
        <div className="glass-container">
          <h1 style={{color:'#ec4899', fontSize:'3.5rem', margin:'0 0 10px 0'}}>💌</h1>
          <h2>Günün Sorusu</h2>
          <p style={{color:'#94a3b8', marginBottom:'30px'}}>Kim giriş yapıyor?</p>
          <button className="player-btn ozgur" onClick={() => setPlayer('Özgür')}>Özgür 🤵🏻‍♂️</button>
          <button className="player-btn nisa" onClick={() => setPlayer('Nisa')}>Nisa 👰🏻‍♀️</button>
        </div>
        <style jsx>{`
          .page-wrapper { min-height: 100vh; background: #020617; display: flex; justify-content: center; align-items: center; font-family: 'Inter', sans-serif;}
          .glass-container { background: #0f172a; padding: 40px; border-radius: 24px; text-align: center; border: 1px solid #1e293b; color: white; width: 100%; max-width: 400px;}
          .player-btn { width: 100%; padding: 15px; margin: 10px 0; border: none; border-radius: 12px; font-size: 1.2rem; font-weight: bold; cursor: pointer; transition: 0.2s; }
          .ozgur { background: #3b82f6; color: white; }
          .nisa { background: #ec4899; color: white; }
          .player-btn:hover { transform: scale(1.05); }
          .back-btn { position: fixed; top: 20px; left: 20px; background: #1e293b; color: white; border: 1px solid #334155; padding: 10px 20px; border-radius: 10px; cursor: pointer; z-index: 100;}
        `}</style>
      </div>
    );
  }

  if (!dailyData) return <div className="page-wrapper"><div className="loader">Soru Yükleniyor...</div></div>;

  // KİLİT MANTIĞI HESAPLAMALARI
  const myAnswer = player === 'Özgür' ? dailyData.ozgur_answer : dailyData.nisa_answer;
  const partnerAnswer = player === 'Özgür' ? dailyData.nisa_answer : dailyData.ozgur_answer;
  const partnerName = player === 'Özgür' ? 'Nisa' : 'Özgür';
  
  const isUnlocked = myAnswer && partnerAnswer; // İkisi de cevapladıysa kilit açılır

  return (
    <div className="page-wrapper">
      <Head><title>Günün Sorusu 💌</title></Head>

      <nav className="top-nav">
        <button className="back-btn" onClick={() => router.push('/anasayfa')}>
          <span>←</span> <span className="hide-mobile">Ana Sayfa</span>
        </button>
        <div className="time-badge">
          Her Akşam 21:00'da Yenilenir 🌙
        </div>
      </nav>

      <div className="main-container fade-in">
        
        {/* SORU KARTI */}
        <div className="question-card">
          <span className="date-label">📅 {dateKey.split('-').reverse().join('.')} Tarihli Soru</span>
          <h1>{dailyData.question_text}</h1>
        </div>

        {/* EĞER KULLANICI HENÜZ CEVAPLAMADIYSA: CEVAP FORMU */}
        {!myAnswer && (
          <div className="answer-section">
            <div className="warning-text">
              🔒 Cevabını gönderene kadar {partnerName}'nın cevabını göremezsin!
            </div>
            <form onSubmit={submitAnswer}>
              <textarea 
                className="answer-input"
                placeholder="İçinden geçenleri yaz..." 
                value={myAnswerInput}
                onChange={(e) => setMyAnswerInput(e.target.value)}
                rows="5"
                required
              ></textarea>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Gönderiliyor...' : 'Cevabımı Mühürle 🗝️'}
              </button>
            </form>
          </div>
        )}

        {/* EĞER KULLANICI CEVAPLADI AMA PARTNER CEVAPLAMADIYSA: BEKLEME EKRANI */}
        {myAnswer && !isUnlocked && (
          <div className="waiting-section fade-in">
            <div className="lock-icon">⏳</div>
            <h2>Cevabın başarıyla mühürlendi!</h2>
            <p>{partnerName} henüz cevap vermedi. O cevapladığı an ikinizin de cevabı burada açılacak.</p>
            
            <div className="my-secret-answer">
              <span>Senin Gizli Cevabın:</span>
              <p>{myAnswer}</p>
            </div>
          </div>
        )}

        {/* İKİSİ DE CEVAPLADIGINDA: KİLİTLER AÇILIR (WOW FAKTÖRÜ) */}
        {isUnlocked && (
          <div className="unlocked-section fade-in">
            <div className="unlock-animation">🔓✨ Kilidiniz Açıldı!</div>
            
            <div className="answers-grid">
              
              <div className={`answer-card ${player === 'Özgür' ? 'ozgur-card' : 'nisa-card'}`}>
                <div className="card-header">{player === 'Özgür' ? '🤵🏻‍♂️ Senin Cevabın' : '👰🏻‍♀️ Senin Cevabın'}</div>
                <div className="card-body">{myAnswer}</div>
              </div>

              <div className={`answer-card ${partnerName === 'Özgür' ? 'ozgur-card' : 'nisa-card'}`}>
                <div className="card-header">{partnerName === 'Özgür' ? '🤵🏻‍♂️ Özgür\'ün Cevabı' : '👰🏻‍♀️ Nisa\'nın Cevabı'}</div>
                <div className="card-body">{partnerAnswer}</div>
              </div>

            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        .page-wrapper { min-height: 100vh; background: radial-gradient(circle at top, #1e293b 0%, #020617 100%); color: white; font-family: 'Inter', sans-serif; padding: 100px 20px 40px 20px; display: flex; justify-content: center; }
        
        .top-nav { position: fixed; top: 0; left: 0; width: 100%; padding: 15px 20px; background: rgba(2, 6, 23, 0.8); backdrop-filter: blur(10px); display: flex; justify-content: space-between; align-items: center; z-index: 1000; border-bottom: 1px solid #1e293b; }
        .back-btn { background: #1e293b; border: 1px solid #334155; color: #94a3b8; padding: 8px 15px; border-radius: 10px; cursor: pointer; display: flex; gap: 8px; align-items: center; font-weight: bold; transition: 0.2s; }
        .back-btn:hover { background: #ec4899; color: white; border-color: #ec4899; }
        .time-badge { background: rgba(236, 72, 153, 0.1); padding: 8px 15px; border-radius: 20px; font-size: 0.9rem; color: #f472b6; border: 1px solid rgba(236, 72, 153, 0.3);}

        .main-container { width: 100%; max-width: 600px; display: flex; flex-direction: column; gap: 30px;}
        .fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .loader { font-size: 1.5rem; color: #ec4899; text-align: center; margin-top: 50px; font-weight: bold; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        /* Soru Kartı */
        .question-card { background: #0f172a; padding: 40px 30px; border-radius: 24px; text-align: center; border: 1px solid #1e293b; box-shadow: 0 10px 40px rgba(0,0,0,0.5); position: relative; border-top: 4px solid #ec4899;}
        .date-label { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: #ec4899; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; white-space: nowrap; box-shadow: 0 5px 10px rgba(236, 72, 153, 0.4);}
        .question-card h1 { margin: 15px 0 0 0; font-size: 1.6rem; color: #f8fafc; line-height: 1.5; font-family: 'Georgia', serif; font-style: italic;}

        /* Cevaplama Alanı */
        .answer-section { background: #0f172a; padding: 30px; border-radius: 24px; border: 1px solid #1e293b; }
        .warning-text { background: rgba(251, 191, 36, 0.1); color: #fbbf24; padding: 12px; border-radius: 12px; text-align: center; font-size: 0.9rem; font-weight: bold; margin-bottom: 20px; border: 1px dashed #fbbf24; }
        .answer-input { width: 100%; background: #020617; border: 2px solid #334155; color: white; padding: 20px; border-radius: 16px; font-size: 1.1rem; outline: none; transition: 0.3s; font-family: inherit; line-height: 1.6; resize: vertical; }
        .answer-input:focus { border-color: #ec4899; box-shadow: 0 0 15px rgba(236, 72, 153, 0.2); }
        .submit-btn { width: 100%; background: linear-gradient(135deg, #ec4899, #be185d); color: white; border: none; padding: 18px; border-radius: 16px; font-size: 1.2rem; font-weight: 900; margin-top: 15px; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px rgba(236, 72, 153, 0.3); }
        .submit-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 25px rgba(236, 72, 153, 0.5); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Bekleme Ekranı */
        .waiting-section { background: #0f172a; padding: 40px 30px; border-radius: 24px; text-align: center; border: 1px dashed #334155; }
        .lock-icon { font-size: 4rem; margin-bottom: 10px; animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .waiting-section h2 { color: #fbbf24; margin: 0 0 10px 0; }
        .waiting-section p { color: #94a3b8; font-size: 1rem; line-height: 1.5; margin-bottom: 30px;}
        .my-secret-answer { background: #020617; padding: 20px; border-radius: 16px; text-align: left; border-left: 4px solid #334155; opacity: 0.7;}
        .my-secret-answer span { color: #64748b; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }
        .my-secret-answer p { color: #cbd5e1; font-style: italic; margin: 5px 0 0 0; }

        /* Kilit Açıldı Ekranı */
        .unlocked-section { display: flex; flex-direction: column; gap: 20px; }
        .unlock-animation { background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 15px; border-radius: 16px; text-align: center; font-size: 1.3rem; font-weight: 900; border: 1px solid #10b981; animation: pop 0.5s ease-out; }
        @keyframes pop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

        .answers-grid { display: flex; flex-direction: column; gap: 15px; }
        .answer-card { background: #0f172a; border-radius: 20px; padding: 25px; border: 1px solid transparent; transition: 0.3s; }
        .answer-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
        .card-header { font-size: 0.9rem; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 1px; padding-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.1); }
        .card-body { font-size: 1.15rem; color: #f8fafc; line-height: 1.6; }
        
        .ozgur-card { border-color: rgba(59, 130, 246, 0.3); background: linear-gradient(180deg, rgba(59, 130, 246, 0.05) 0%, #0f172a 100%); }
        .ozgur-card .card-header { color: #60a5fa; }
        
        .nisa-card { border-color: rgba(236, 72, 153, 0.3); background: linear-gradient(180deg, rgba(236, 72, 153, 0.05) 0%, #0f172a 100%); }
        .nisa-card .card-header { color: #f472b6; }

        @media (max-width: 600px) {
          .hide-mobile { display: none; }
          .question-card h1 { font-size: 1.3rem; }
          .answer-input { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}